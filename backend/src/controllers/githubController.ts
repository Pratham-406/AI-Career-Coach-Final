import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../db/prisma';
import { GitHubScannerService } from '../services/githubScannerService';
import { jobQueueService } from '../services/jobQueueService';
import { AuthenticatedRequest } from '../middleware/auth';

export const analyzeRepoSchema = z.object({
  body: z.object({
    repoId: z.string().min(1, 'Repository ID is required'),
  }),
});

export const connectRepoSchema = z.object({
  body: z.object({
    repoUrl: z.string().min(3, 'Valid repository URL or owner/repo format is required'),
    name: z.string().optional(),
  }),
});

export const githubController = {
  getRepos: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const repos = await prisma.gitHubRepository.findMany({
        where: userId ? { userId } : {},
        include: {
          scans: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              evidences: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      const formatted = repos.map(r => ({
        id: r.id,
        name: r.name,
        description: r.description,
        htmlUrl: r.repoUrl,
        language: r.language,
        stars: r.stars,
        forks: r.forks,
        openIssues: r.openIssues,
        lastUpdated: r.updatedAt.toISOString(),
        codeQualityScore: r.codeQualityScore,
        detectedSkills: (() => {
          try {
            return JSON.parse(r.detectedSkills);
          } catch {
            return [];
          }
        })(),
        aiAnalysisStatus: r.aiAnalysisStatus as any,
        insights: (() => {
          try {
            return JSON.parse(r.insights);
          } catch {
            return [];
          }
        })(),
        defaultBranch: r.defaultBranch,
        latestCommitSha: r.latestCommitSha,
        webhookStatus: r.webhookStatus,
        evidencesCount: r.scans[0]?.evidences.length || 0,
      }));

      return res.json({
        success: true,
        message: 'Repositories fetched successfully',
        data: formatted,
        meta: {
          total: formatted.length,
          timestamp: new Date().toISOString(),
          isMockData: false,
        },
      });
    } catch (error: any) {
      console.error('[githubController.getRepos]', error);
      return res.status(500).json({
        success: false,
        error: 'InternalServerError',
        message: error.message || 'Error fetching repositories',
      });
    }
  },

  connectRepo: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { repoUrl, name } = req.body;
      const { owner, repo } = GitHubScannerService.parseRepoUrl(repoUrl);

      // 1. Fetch real GitHub metadata
      let meta;
      try {
        meta = await GitHubScannerService.fetchRepositoryMetadata(owner, repo);
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          error: 'GitHubFetchError',
          message: `Unable to access GitHub repository "${owner}/${repo}": ${err.message}`,
        });
      }

      // Find user to associate with
      let userId = req.user?.id;
      if (!userId) {
        const defaultUser = await prisma.user.findFirst();
        userId = defaultUser?.id || 'usr_dev_101';
      }

      // Check if already connected
      const existing = await prisma.gitHubRepository.findFirst({
        where: { userId, owner: meta.owner, name: meta.name },
      });

      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'ConflictError',
          message: `Repository ${meta.fullName} is already connected.`,
        });
      }

      // Save repository to database
      const newRepo = await prisma.gitHubRepository.create({
        data: {
          userId,
          name: name || meta.name,
          owner: meta.owner,
          repoUrl: `https://github.com/${meta.owner}/${meta.name}`,
          defaultBranch: meta.defaultBranch,
          latestCommitSha: meta.latestCommitSha,
          language: meta.language,
          stars: meta.stars,
          forks: meta.forks,
          openIssues: meta.openIssues,
          codeQualityScore: 70,
          detectedSkills: JSON.stringify([meta.language, 'Git']),
          aiAnalysisStatus: 'pending',
          insights: JSON.stringify(['Repository connected. Queued for deep source code scan and evidence extraction.']),
          webhookStatus: 'active',
        },
      });

      // Queue background scan
      jobQueueService.enqueue('SCAN_REPOSITORY', { repoId: newRepo.id, userId });

      return res.status(201).json({
        success: true,
        message: 'Repository connected and background scan queued',
        data: {
          ...newRepo,
          detectedSkills: JSON.parse(newRepo.detectedSkills),
          insights: JSON.parse(newRepo.insights),
        },
        meta: {
          timestamp: new Date().toISOString(),
          isMockData: false,
        },
      });
    } catch (error: any) {
      console.error('[githubController.connectRepo]', error);
      return res.status(500).json({
        success: false,
        error: 'InternalServerError',
        message: error.message || 'Error connecting repository',
      });
    }
  },

  analyzeRepo: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { repoId } = req.body;
      const repo = await prisma.gitHubRepository.findUnique({
        where: { id: repoId },
      });

      if (!repo) {
        return res.status(404).json({
          success: false,
          error: 'NotFoundError',
          message: `Repository with ID ${repoId} not found`,
        });
      }

      // Queue background scan job
      const userId = req.user?.id || repo.userId;
      jobQueueService.enqueue('SCAN_REPOSITORY', { repoId: repo.id, userId });

      return res.json({
        success: true,
        message: 'Deep AST repository scan and evidence extraction queued',
        data: {
          repoId: repo.id,
          status: 'queued',
        },
        meta: {
          timestamp: new Date().toISOString(),
          isMockData: false,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: 'InternalServerError',
        message: error.message || 'Error starting analysis',
      });
    }
  },

  getRepoEvidence: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const latestScan = await prisma.repositoryScan.findFirst({
        where: { repositoryId: id },
        orderBy: { createdAt: 'desc' },
        include: {
          evidences: true,
        },
      });

      return res.json({
        success: true,
        data: latestScan?.evidences || [],
        meta: {
          scanId: latestScan?.id,
          commitSha: latestScan?.commitSha,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: 'InternalServerError',
        message: error.message || 'Error fetching evidence',
      });
    }
  },

  handleWebhook: async (req: Request, res: Response) => {
    try {
      const signature = req.headers['x-hub-signature-256'] as string | undefined;
      const deliveryId = (req.headers['x-github-delivery'] as string) || `deliv_${Date.now()}`;
      const eventType = (req.headers['x-github-event'] as string) || 'push';

      // 1. Verify HMAC-SHA256 signature
      const rawBody = (req as any).rawBody || JSON.stringify(req.body);
      const isValid = GitHubScannerService.verifyWebhookSignature(rawBody, signature);

      if (!isValid) {
        console.warn(`[Webhook] Rejected unauthorized webhook payload with invalid signature: ${signature}`);
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'Invalid X-Hub-Signature-256 HMAC signature',
        });
      }

      // 2. Prevent duplicate delivery replay attacks
      const existingDelivery = await prisma.gitHubWebhookEvent.findUnique({
        where: { deliveryId },
      });

      if (existingDelivery) {
        console.warn(`[Webhook] Duplicate delivery ID received: ${deliveryId}`);
        return res.status(200).json({
          success: true,
          message: 'Duplicate delivery already acknowledged',
          deliveryId,
        });
      }

      // 3. Process push event
      if (eventType !== 'push') {
        return res.status(200).json({
          success: true,
          message: `Received ${eventType} event (push events trigger reassessment)`,
        });
      }

      const payload = req.body;
      const repoFullName = payload.repository?.full_name || '';
      const commitSha = payload.after || payload.head_commit?.id || '';
      const beforeSha = payload.before || '';
      const commits = payload.commits || [];

      // Record webhook event in database
      await prisma.gitHubWebhookEvent.create({
        data: {
          deliveryId,
          eventType,
          commitSha,
          processingStatus: 'received',
          payload: JSON.stringify(payload).slice(0, 10000),
        },
      });

      // 4. Enqueue background reassessment job (durable and prompt response)
      jobQueueService.enqueue('PROCESS_WEBHOOK_PUSH', {
        deliveryId,
        repoFullName,
        commitSha,
        beforeSha,
        commits,
      });

      return res.status(202).json({
        success: true,
        message: 'GitHub push webhook verified and reassessment pipeline enqueued',
        deliveryId,
        commitSha,
      });
    } catch (error: any) {
      console.error('[githubController.handleWebhook]', error);
      return res.status(500).json({
        success: false,
        error: 'InternalServerError',
        message: error.message || 'Error processing GitHub webhook',
      });
    }
  },

  getSyncStatus: async (req: Request, res: Response) => {
    try {
      const latestScan = await prisma.repositoryScan.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { repository: true },
      });

      const latestWebhook = await prisma.gitHubWebhookEvent.findFirst({
        orderBy: { createdAt: 'desc' },
      });

      return res.json({
        success: true,
        data: {
          lastScan: latestScan ? {
            repoName: latestScan.repository.name,
            commitSha: latestScan.commitSha,
            timestamp: latestScan.createdAt.toISOString(),
            status: latestScan.scanStatus,
          } : null,
          lastWebhook: latestWebhook ? {
            deliveryId: latestWebhook.deliveryId,
            eventType: latestWebhook.eventType,
            status: latestWebhook.processingStatus,
            commitSha: latestWebhook.commitSha,
            timestamp: latestWebhook.createdAt.toISOString(),
          } : null,
          webhookSecretConfigured: true,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: 'InternalServerError',
        message: error.message,
      });
    }
  },
};
