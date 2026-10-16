import { Request, Response } from 'express';
import { z } from 'zod';
import { mockUser } from '../data/mockStore';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    targetRole: z.string().optional().default('Full Stack Developer'),
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
    experienceLevel: z.enum(['Entry', 'Mid', 'Senior', 'Student']).optional(),
    githubUsername: z.string().optional(),
  }),
});

// In-memory user state for the current session
let currentUser = { ...mockUser };

export const authController = {
  login: async (req: Request, res: Response) => {
    const { email } = req.body;
    // In hackathon demo mode: accept any validly formatted login, return mock user
    const token = 'demo_jwt_token_hackathon_showcase_' + Date.now();
    return res.json({
      success: true,
      message: 'Login successful (Simulated Hackathon Auth)',
      data: {
        token,
        user: {
          ...currentUser,
          email: email || currentUser.email,
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
        isMockData: true,
      },
    });
  },

  register: async (req: Request, res: Response) => {
    const { name, email, targetRole } = req.body;
    currentUser = {
      ...currentUser,
      name,
      email,
      targetRole: targetRole || currentUser.targetRole,
    };
    const token = 'demo_jwt_token_hackathon_showcase_' + Date.now();
    return res.status(201).json({
      success: true,
      message: 'Registration successful (Simulated Hackathon Auth)',
      data: {
        token,
        user: currentUser,
      },
      meta: {
        timestamp: new Date().toISOString(),
        isMockData: true,
      },
    });
  },

  getProfile: async (req: Request, res: Response) => {
    return res.json({
      success: true,
      data: currentUser,
      meta: {
        timestamp: new Date().toISOString(),
        isMockData: true,
      },
    });
  },

  updateProfile: async (req: Request, res: Response) => {
    const updates = req.body;
    currentUser = {
      ...currentUser,
      ...updates,
    };
    return res.json({
      success: true,
      message: 'Profile updated successfully',
      data: currentUser,
      meta: {
        timestamp: new Date().toISOString(),
        isMockData: true,
      },
    });
  },
};
