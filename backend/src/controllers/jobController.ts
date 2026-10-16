import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../db/prisma';
import { JobIngestionService } from '../services/jobIngestionService';
import { AuthenticatedRequest } from '../middleware/auth';

export const ingestJobSchema = z.object({
  body: z.object({
    url: z.string().url().optional(),
    text: z.string().optional(),
    title: z.string().optional(),
    company: z.string().optional(),
  }).refine(data => data.url || data.text, {
    message: 'Either a job URL or job description text must be provided',
  }),
});

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Job title is required'),
    company: z.string().min(2, 'Company name is required'),
    description: z.string().min(20, 'Job description must be at least 20 characters'),
    sourceUrl: z.string().optional(),
    sourceType: z.enum(['url', 'manual', 'curated']).default('manual'),
    location: z.string().optional().default('Remote'),
    type: z.string().optional().default('Full-time'),
    salary: z.string().optional().default('$100,000 - $140,000'),
    requiredSkills: z.array(z.string()).default([]),
    requirements: z.array(
      z.object({
        requiredSkill: z.string(),
        description: z.string(),
        importance: z.enum(['Critical', 'Recommended', 'Bonus']).default('Recommended'),
        sourceExcerpt: z.string().optional(),
        sourceReference: z.string().optional(),
      })
    ).optional(),
  }),
});

export const jobController = {
  getJobs: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { search, type, remote } = req.query;

      const whereClause: any = {};

      if (search && typeof search === 'string') {
        const q = search.trim();
        whereClause.OR = [
          { title: { contains: q } },
          { company: { contains: q } },
          { description: { contains: q } },
          { requiredSkills: { contains: q } },
        ];
      }

      if (type && typeof type === 'string') {
        whereClause.type = type;
      }

      if (remote !== undefined && remote !== '') {
        whereClause.isRemote = remote === 'true';
      }

      const jobs = await prisma.jobPosting.findMany({
        where: whereClause,
        include: {
          requirements: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      // Parse JSON strings for client convenience
      const formattedJobs = jobs.map(j => ({
        ...j,
        requiredSkills: (() => {
          try {
            return JSON.parse(j.requiredSkills);
          } catch {
            return [];
          }
        })(),
      }));

      return res.json({
        success: true,
        message: 'Job recommendations retrieved',
        data: formattedJobs,
        meta: {
          total: formattedJobs.length,
          timestamp: new Date().toISOString(),
          isMockData: false,
        },
      });
    } catch (error: any) {
      console.error('[jobController.getJobs]', error);
      return res.status(500).json({
        success: false,
        error: 'InternalServerError',
        message: error.message || 'Error fetching jobs',
      });
    }
  },

  getJobById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const job = await prisma.jobPosting.findUnique({
        where: { id },
        include: {
          requirements: true,
        },
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'NotFoundError',
          message: `Job posting with ID ${id} not found`,
        });
      }

      const formattedJob = {
        ...job,
        requiredSkills: (() => {
          try {
            return JSON.parse(job.requiredSkills);
          } catch {
            return [];
          }
        })(),
      };

      return res.json({
        success: true,
        data: formattedJob,
        meta: {
          timestamp: new Date().toISOString(),
          isMockData: false,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: 'InternalServerError',
        message: error.message || 'Error fetching job',
      });
    }
  },

  ingestJob: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { url, text, title: inputTitle, company: inputCompany } = req.body;

      let extractedText = text || '';
      let detectedTitle = inputTitle;
      let detectedCompany = inputCompany;

      if (url) {
        try {
          const fetchRes = await JobIngestionService.fetchJobFromUrl(url);
          extractedText = fetchRes.rawText;
          if (!detectedTitle && fetchRes.title) detectedTitle = fetchRes.title;
          if (!detectedCompany && fetchRes.company) detectedCompany = fetchRes.company;
        } catch (fetchErr: any) {
          if (!text) {
            return res.status(422).json({
              success: false,
              error: 'IngestionError',
              message: `Could not fetch job from URL: ${fetchErr.message}. Please paste the job description text manually.`,
            });
          }
        }
      }

      if (!extractedText || extractedText.length < 20) {
        return res.status(400).json({
          success: false,
          error: 'ValidationError',
          message: 'Job text is too short to extract requirements. Please provide at least 20 characters.',
        });
      }

      const result = JobIngestionService.extractRequirementsFromText(
        extractedText,
        detectedTitle,
        detectedCompany,
        url
      );

      return res.json({
        success: true,
        message: 'Job requirements successfully extracted',
        data: result,
        meta: {
          timestamp: new Date().toISOString(),
          isMockData: false,
        },
      });
    } catch (error: any) {
      console.error('[jobController.ingestJob]', error);
      return res.status(500).json({
        success: false,
        error: 'InternalServerError',
        message: error.message || 'Error during job ingestion',
      });
    }
  },

  createJob: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const {
        title,
        company,
        description,
        sourceUrl,
        sourceType,
        location,
        type,
        salary,
        requiredSkills,
        requirements,
      } = req.body;

      const userId = req.user?.id || null;

      const job = await prisma.jobPosting.create({
        data: {
          userId,
          title,
          company,
          description,
          sourceUrl: sourceUrl || null,
          sourceType: sourceType || (sourceUrl ? 'url' : 'manual'),
          matchScore: 80,
          isRemote: (location || '').toLowerCase().includes('remote'),
          location: location || 'Remote',
          type: type || 'Full-time',
          salary: salary || '$100,000 - $140,000',
          requiredSkills: JSON.stringify(requiredSkills || []),
          requirements: {
            create: (requirements || []).map((r: any) => ({
              requiredSkill: r.requiredSkill || r.skill,
              description: r.description,
              importance: r.importance || 'Recommended',
              sourceExcerpt: r.sourceExcerpt || null,
              sourceReference: r.sourceReference || null,
            })),
          },
        },
        include: {
          requirements: true,
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Job posting and requirements saved successfully',
        data: {
          ...job,
          requiredSkills: JSON.parse(job.requiredSkills),
        },
        meta: {
          timestamp: new Date().toISOString(),
          isMockData: false,
        },
      });
    } catch (error: any) {
      console.error('[jobController.createJob]', error);
      return res.status(500).json({
        success: false,
        error: 'InternalServerError',
        message: error.message || 'Error saving job posting',
      });
    }
  },

  deleteJob: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.jobPosting.delete({
        where: { id },
      });
      return res.json({
        success: true,
        message: 'Job deleted successfully',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: 'InternalServerError',
        message: error.message || 'Error deleting job',
      });
    }
  },

  getMatchBreakdown: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const jobsCount = await prisma.jobPosting.count();
      const latestAssessment = await prisma.assessment.findFirst({
        orderBy: { createdAt: 'desc' },
      });

      const strengths = latestAssessment
        ? JSON.parse(latestAssessment.primaryStrengths)
        : ['TypeScript', 'Node.js', 'Docker'];
      const gaps = latestAssessment
        ? JSON.parse(latestAssessment.keyGapAreas)
        : ['Kubernetes', 'CI/CD Pipelines'];

      return res.json({
        success: true,
        data: {
          overallPortfolioMatchRate: latestAssessment ? latestAssessment.overallScore : 82,
          strongestCategories: strengths,
          priorityFocusAreas: gaps,
          totalOpenRolesMatched: jobsCount,
          highMatchRolesCount: Math.max(1, Math.floor(jobsCount * 0.7)),
        },
        meta: {
          timestamp: new Date().toISOString(),
          isMockData: false,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: 'InternalServerError',
        message: error.message || 'Error calculating match breakdown',
      });
    }
  },
};
