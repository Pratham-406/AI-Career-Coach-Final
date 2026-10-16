import { Router } from 'express';
import authRoutes from './authRoutes';
import githubRoutes from './githubRoutes';
import jobRoutes from './jobRoutes';
import assessmentRoutes from './assessmentRoutes';
import billingRoutes from './billingRoutes';
import { config } from '../config/env';

const apiRouter = Router();

// Health Check Endpoint
apiRouter.get('/health', (req, res) => {
  return res.json({
    success: true,
    status: 'healthy',
    service: 'ai-career-coach-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: config.nodeEnv,
    activeModules: {
      auth: 'ready (simulated)',
      githubAnalysis: 'ready (simulated AST evaluator)',
      jobDiscovery: 'ready',
      skillGapAssessment: 'ready',
      billing: 'ready (test mode)',
    },
  });
});

// Mounted Sub-routers
apiRouter.use('/auth', authRoutes);
apiRouter.use('/github', githubRoutes);
apiRouter.use('/jobs', jobRoutes);
apiRouter.use('/assessment', assessmentRoutes);
apiRouter.use('/billing', billingRoutes);

export default apiRouter;
