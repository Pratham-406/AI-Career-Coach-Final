import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const timestamp = new Date().toISOString();

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
      details: err.errors,
      meta: {
        timestamp,
        isMockData: false,
      }
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${req.method} ${req.url}:`, err);

  return res.status(statusCode).json({
    success: false,
    error: err.name || 'ServerError',
    message,
    meta: {
      timestamp,
      isMockData: false,
    }
  });
}
