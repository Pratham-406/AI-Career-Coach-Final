import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma';
import { config } from '../config/env';
import { AuthenticatedRequest } from '../middleware/auth';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    targetRole: z.string().optional().default('Full Stack Developer'),
    githubUsername: z.string().optional(),
    experienceLevel: z.string().optional().default('Student'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    targetRole: z.string().optional(),
    experienceLevel: z.string().optional(),
    githubUsername: z.string().optional(),
    avatarUrl: z.string().optional(),
  }),
});

export const authController = {
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'Invalid email or password',
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'Invalid email or password',
        });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn as any }
      );

      // Omit password hash in response
      const { passwordHash: _, ...userSafe } = user;

      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: userSafe,
        },
        meta: {
          timestamp: new Date().toISOString(),
          isMockData: false,
        },
      });
    } catch (error: any) {
      console.error('[authController.login]', error);
      return res.status(500).json({
        success: false,
        error: 'InternalServerError',
        message: error.message || 'Error logging in',
      });
    }
  },

  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password, targetRole, githubUsername, experienceLevel } = req.body;
      const cleanEmail = email.toLowerCase().trim();

      const existingUser = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'ConflictError',
          message: 'An account with this email address already exists',
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email: cleanEmail,
          passwordHash,
          targetRole: targetRole || 'Full Stack Developer',
          githubUsername: githubUsername || null,
          experienceLevel: experienceLevel || 'Student',
          careerReadinessScore: 75,
          plan: 'pro',
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        },
      });

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn as any }
      );

      const { passwordHash: _, ...userSafe } = user;

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          token,
          user: userSafe,
        },
        meta: {
          timestamp: new Date().toISOString(),
          isMockData: false,
        },
      });
    } catch (error: any) {
      console.error('[authController.register]', error);
      return res.status(500).json({
        success: false,
        error: 'InternalServerError',
        message: error.message || 'Error registering user',
      });
    }
  },

  getProfile: async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'Authentication required to view profile',
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'NotFoundError',
          message: 'User not found',
        });
      }

      const { passwordHash: _, ...userSafe } = user;

      return res.json({
        success: true,
        data: userSafe,
        meta: {
          timestamp: new Date().toISOString(),
          isMockData: false,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: 'InternalServerError',
        message: error.message || 'Error fetching profile',
      });
    }
  },

  updateProfile: async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'Authentication required to update profile',
        });
      }

      const updates = req.body;
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          ...updates,
        },
      });

      const { passwordHash: _, ...userSafe } = updatedUser;

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        data: userSafe,
        meta: {
          timestamp: new Date().toISOString(),
          isMockData: false,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: 'InternalServerError',
        message: error.message || 'Error updating profile',
      });
    }
  },

  logout: async (req: Request, res: Response) => {
    return res.json({
      success: true,
      message: 'Logged out successfully',
    });
  },
};
