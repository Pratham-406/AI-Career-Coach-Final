import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';
import { config } from './config/env';

export const app = express();

// Middlewares
app.use(cors({
  origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Capture raw body for HMAC-SHA256 signature verification on GitHub webhooks
app.use(express.json({
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  },
}));

app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'AI Career Coach REST API Server',
    status: 'online',
    healthCheckUrl: '/api/health',
    docs: {
      auth: '/api/auth/me',
      github: '/api/github/repos',
      jobs: '/api/jobs',
      assessment: '/api/assessment/gap-analysis',
      billing: '/api/billing/plans',
      events: '/api/events',
    },
  });
});

// Main API Router
app.use('/api', apiRouter);

// 404 Catch-all handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'NotFoundError',
    message: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found`,
    meta: {
      timestamp: new Date().toISOString(),
      isMockData: false,
    },
  });
});

// Centralized Error Handler
app.use(errorHandler);
