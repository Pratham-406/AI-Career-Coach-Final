import { Request, Response } from 'express';
import { mockJobs, mockSkillGaps } from '../data/mockStore';

export const jobController = {
  getJobs: async (req: Request, res: Response) => {
    const { search, type, remote } = req.query;

    let filtered = [...mockJobs];

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        j =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.requiredSkills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (type && typeof type === 'string') {
      filtered = filtered.filter(j => j.type.toLowerCase() === type.toLowerCase());
    }

    if (remote !== undefined && remote !== '') {
      const isRemote = remote === 'true';
      filtered = filtered.filter(j => j.isRemote === isRemote);
    }

    return res.json({
      success: true,
      message: 'Job recommendations retrieved',
      data: filtered,
      meta: {
        total: filtered.length,
        timestamp: new Date().toISOString(),
        isMockData: true,
        notice: 'Mocked job postings curated for hackathon demonstration. Production uses live Greenhouse/Lever connectors.',
      },
    });
  },

  getJobById: async (req: Request, res: Response) => {
    const { id } = req.params;
    const job = mockJobs.find(j => j.id === id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'NotFoundError',
        message: `Job posting with ID ${id} not found`,
      });
    }

    return res.json({
      success: true,
      data: job,
      meta: {
        timestamp: new Date().toISOString(),
        isMockData: true,
      },
    });
  },

  getMatchBreakdown: async (req: Request, res: Response) => {
    const totalGaps = mockSkillGaps.length;
    const criticalGaps = mockSkillGaps.filter(g => g.importance === 'Critical');
    const strengths = mockSkillGaps.filter(g => g.currentLevel >= 80);

    return res.json({
      success: true,
      data: {
        overallPortfolioMatchRate: 84,
        strongestCategories: ['Database Optimization', 'Backend Architecture', 'TypeScript'],
        priorityFocusAreas: ['Kubernetes', 'Automated E2E Testing', 'CI/CD Pipelines'],
        totalOpenRolesMatched: mockJobs.length,
        highMatchRolesCount: mockJobs.filter(j => j.matchScore >= 85).length,
      },
      meta: {
        timestamp: new Date().toISOString(),
        isMockData: true,
      },
    });
  },
};
