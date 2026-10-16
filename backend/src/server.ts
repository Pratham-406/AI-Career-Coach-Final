import { app } from './app';
import { config } from './config/env';
import prisma from './db/prisma';
import { seedDatabase } from './db/seed';

async function bootstrap() {
  try {
    // Seed initial data if database is fresh
    await seedDatabase();
  } catch (err: any) {
    console.warn('[Bootstrap Warning] Seeding check failed:', err.message);
  }

  const server = app.listen(config.port, () => {
    console.log(`===============================================`);
    console.log(`🚀 AI Career Coach Backend API Server Running`);
    console.log(`📡 URL: http://localhost:${config.port}`);
    console.log(`🩺 Health check: http://localhost:${config.port}/api/health`);
    console.log(`⚡ Live SSE Stream: http://localhost:${config.port}/api/events`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`💾 Database: Persistent SQLite (dev.db) / PostgreSQL Ready`);
    console.log(`===============================================`);
  });

  // Graceful shutdown handling
  const shutdown = async (signal: string) => {
    console.log(`${signal} signal received: closing HTTP server and database connections`);
    server.close(async () => {
      await prisma.$disconnect();
      console.log('HTTP server closed, Prisma disconnected.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch(err => {
  console.error('[Bootstrap Error]', err);
  process.exit(1);
});
