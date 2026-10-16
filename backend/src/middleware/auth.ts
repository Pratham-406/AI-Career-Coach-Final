import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import prisma from '../db/prisma';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role?: string;
  };
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication token is missing or malformed',
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (err: any) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid or expired authentication token',
      });
    }

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid token payload',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        targetRole: true,
        experienceLevel: true,
        careerReadinessScore: true,
        plan: true,
        avatarUrl: true,
        githubUsername: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User account no longer exists',
      });
    }

    req.user = user;
    return next();
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'InternalServerError',
      message: error.message || 'Authentication error',
    });
  }
};

// Optional auth: populates req.user if token is present, but allows guest access if omitted
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, config.jwtSecret);
    if (decoded && decoded.userId) {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          targetRole: true,
          experienceLevel: true,
          careerReadinessScore: true,
          plan: true,
          avatarUrl: true,
          githubUsername: true,
          createdAt: true,
        },
      });
      if (user) {
        req.user = user;
      }
    }
  } catch {
    // Ignore invalid token in optional auth
  }
  return next();
};
