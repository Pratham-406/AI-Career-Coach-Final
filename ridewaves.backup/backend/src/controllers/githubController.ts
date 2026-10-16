import { Request, Response } from 'express';
import { z } from 'zod';
import { mockRepositories } from '../data/mockStore';
import { RepositorySummary } from '../types';

let repositories: RepositorySummary[] = [...mockRepositories];

export const analyzeRepoSchema = z.object({
  body: z.object({
    repoId: z.string().min(1, 'Repository ID is required'),
  }),
});

export const connectRepoSchema = z.object({
  body: z.object({
    repoUrl: z.string().url('Must be a valid repository URL'),
    name: z.string().optional(),
  }),
});

export const githubController = {
  getRepos: async (req: Request, res: Response) => {
    return res.json({
      success: true,
      message: 'Repositories fetched successfully (Simulated Data)',
      data: repositories,
      meta: {
        total: repositories.length,
        timestamp: new Date().toISOString(),
        isMockData: true,
        notice: 'Mocked GitHub analysis for hackathon showcase. Live webhook listener ready for deployment.',
      },
    });
  },

  analyzeRepo: async (req: Request, res: Response) => {
    const { repoId } = req.body;
    const repoIndex = repositories.findIndex(r => r.id === repoId);

    if (repoIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'NotFoundError',
        message: `Repository with ID ${repoId} not found`,
      });
    }

    // Simulate AI deep analysis run
    const updatedRepo = {
      ...repositories[repoIndex],
      aiAnalysisStatus: 'analyzed' as const,
      codeQualityScore: Math.min(100, repositories[repoIndex].codeQualityScore + 3),
      lastUpdated: new Date().toISOString(),
      insights: [
        'AI AST Scan: Verified TypeScript strictNullChecks and modular export structure.',
        ...repositories[repoIndex].insights,
      ],
    };
    repositories[repoIndex] = updatedRepo;

    return res.json({
      success: true,
      message: 'Simulated AI AST analysis completed on repository',
      data: updatedRepo,
      meta: {
        timestamp: new Date().toISOString(),
        isMockData: true,
        notice: 'Simulated AI analyzer. In production, this queues an AST tree-sitter worker via Celery/BullMQ.',
      },
    });
  },

  connectRepo: async (req: Request, res: Response) => {
    const { repoUrl, name } = req.body;
    const extractedName = name || repoUrl.split('/').pop()?.replace('.git', '') || 'new-connected-repo';

    const newRepo: RepositorySummary = {
      id: `repo_${Date.now()}`,
      name: extractedName,
      description: 'Newly connected repository queued for initial AI dependency and skill scan.',
      htmlUrl: repoUrl,
      language: 'TypeScript',
      stars: 1,
      forks: 0,
      openIssues: 0,
      lastUpdated: new Date().toISOString(),
      codeQualityScore: 70,
      detectedSkills: ['Git', 'TypeScript'],
      aiAnalysisStatus: 'pending',
      insights: ['Queued for deep semantic analysis and test coverage inspection.'],
    };

    repositories.unshift(newRepo);

    return res.status(201).json({
      success: true,
      message: 'Repository connected (Simulated)',
      data: newRepo,
      meta: {
        timestamp: new Date().toISOString(),
        isMockData: true,
      },
    });
  },

  getSyncStatus: async (req: Request, res: Response) => {
    return res.json({
      success: true,
      data: {
        isWebhookActive: false,
        lastWebhookEvent: null,
        syncMode: 'Simulated Demo Mode',
        configuredClientId: process.env.GITHUB_CLIENT_ID ? 'Configured (Masked)' : 'Unset',
        nextScheduledScan: '2026-04-18T00:00:00Z',
      },
      meta: {
        timestamp: new Date().toISOString(),
        isMockData: true,
        notice: 'Automatic repository change detection is a planned feature; current status is mocked for testing.',
      },
    });
  },
};
