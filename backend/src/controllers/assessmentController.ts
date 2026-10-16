import { Request, Response } from 'express';
import { z } from 'zod';
import { mockAssessments, mockSkillGaps } from '../data/mockStore';
import { AssessmentRecord } from '../types';

let assessments: AssessmentRecord[] = [...mockAssessments];

export const triggerAssessmentSchema = z.object({
  body: z.object({
    targetRole: z.string().optional(),
    focusAreas: z.array(z.string()).optional(),
  }),
});

export const assessmentController = {
  getHistory: async (req: Request, res: Response) => {
    return res.json({
      success: true,
      data: assessments,
      meta: {
        total: assessments.length,
        timestamp: new Date().toISOString(),
        isMockData: true,
      },
    });
  },

  getSkillGapAnalysis: async (req: Request, res: Response) => {
    const role = req.query.role || 'Full Stack Cloud Engineer';
    const criticalCount = mockSkillGaps.filter(g => g.importance === 'Critical').length;
    const recommendedCount = mockSkillGaps.filter(g => g.importance === 'Recommended').length;

    return res.json({
      success: true,
      data: {
        targetRole: role,
        readinessScore: 82,
        targetBenchmarkScore: 88,
        stats: {
          totalEvaluatedSkills: mockSkillGaps.length,
          criticalGapsCount: criticalCount,
          recommendedGapsCount: recommendedCount,
          readySkillsCount: mockSkillGaps.filter(g => g.currentLevel >= g.targetLevel).length,
        },
        skillGaps: mockSkillGaps,
      },
      meta: {
        timestamp: new Date().toISOString(),
        isMockData: true,
        notice: 'AI skill-gap engine simulation with code evidence detection.',
      },
    });
  },

  triggerReassessment: async (req: Request, res: Response) => {
    const { targetRole } = req.body;
    const latestScore = assessments[0]?.overallScore || 80;
    const newScore = Math.min(100, latestScore + 2);

    const newRecord: AssessmentRecord = {
      id: `eval_${Date.now()}`,
      timestamp: new Date().toISOString(),
      overallScore: newScore,
      targetRole: targetRole || 'Full Stack Cloud Engineer',
      reposAnalyzedCount: 4,
      primaryStrengths: ['TypeScript strict typing', 'Redis caching', 'Clean architecture'],
      keyGapAreas: ['Kubernetes Helm charts', 'End-to-end integration tests'],
      scoreChangeFromPrevious: +2,
      summaryFeedback: 'Automated re-assessment executed. Incremental code quality improvements detected across recent commit hashes.',
    };

    assessments.unshift(newRecord);

    return res.json({
      success: true,
      message: 'Portfolio re-assessment successfully generated (Simulated)',
      data: newRecord,
      meta: {
        timestamp: new Date().toISOString(),
        isMockData: true,
      },
    });
  },
};
