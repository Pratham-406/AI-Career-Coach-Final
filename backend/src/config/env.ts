import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-for-dev',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  githubClientId: process.env.GITHUB_CLIENT_ID || '',
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  githubWebhookSecret: process.env.GITHUB_WEBHOOK_SECRET || 'dev_github_webhook_secret_key_12345',
  githubToken: process.env.GITHUB_TOKEN || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
};
