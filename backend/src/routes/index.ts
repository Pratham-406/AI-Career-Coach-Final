import { Router } from 'express';
import authRoutes from './authRoutes';
import githubRoutes from './githubRoutes';
import jobRoutes from './jobRoutes';
import assessmentRoutes from './assessmentRoutes';
import billingRoutes from './billingRoutes';
import tutorialRoutes from './tutorialRoutes';
import interviewRoutes from './interviewRoutes';
import networkRoutes from './networkRoutes';
import { config } from '../config/env';
import { eventService } from '../services/eventService';
import prisma from '../db/prisma';

const apiRouter = Router();

// Health Check Endpoint
apiRouter.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  let userCount = 0;
  let jobCount = 0;
  let repoCount = 0;

  try {
    [userCount, jobCount, repoCount] = await Promise.all([
      prisma.user.count(),
      prisma.jobPosting.count(),
      prisma.gitHubRepository.count(),
    ]);
    dbStatus = 'connected (persistent database)';
  } catch (err: any) {
    dbStatus = `error: ${err.message}`;
  }

  return res.json({
    success: true,
    status: 'healthy',
    service: 'ai-career-coach-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: config.nodeEnv,
    database: {
      status: dbStatus,
      userCount,
      jobCount,
      repoCount,
    },
    activeModules: {
      auth: 'real (bcrypt + jwt)',
      githubAnalysis: 'real (REST API scanner + AST evidence)',
      jobDiscovery: 'real (URL & text requirement ingestion)',
      skillGapAssessment: 'real (evidence vs requirement comparison)',
      githubWebhooks: 'real (HMAC-SHA256 signature verified)',
      mockInterviews: 'real (interactive voice + AI evaluation)',
      skillNetwork: 'real (clutter-free talent matrix + recruiter messaging)',
      tutorials: 'active (curated engineering guides)',
      liveSSE: 'active',
      billing: 'ready',
    },
  });
});

// Server-Sent Events (SSE) Live Feed for real-time dashboard updates
apiRouter.get('/events', (req, res) => {
  const clientId = `client_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const userId = req.query.userId as string | undefined;
  eventService.addClient(clientId, res, userId);
});

// Mounted Sub-routers
apiRouter.use('/auth', authRoutes);
apiRouter.use('/github', githubRoutes);
apiRouter.use('/jobs', jobRoutes);
apiRouter.use('/assessment', assessmentRoutes);
apiRouter.use('/billing', billingRoutes);
apiRouter.use('/tutorials', tutorialRoutes);
apiRouter.use('/interviews', interviewRoutes);
apiRouter.use('/network', networkRoutes);

export default apiRouter;
