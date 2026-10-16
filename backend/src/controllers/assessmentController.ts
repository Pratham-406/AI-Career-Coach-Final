import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../db/prisma';
import { AssessmentEngine } from '../services/assessmentEngine';
import { AuthenticatedRequest } from '../middleware/auth';

export const triggerAssessmentSchema = z.object({
  body: z.object({
    jobId: z.string().optional(),
    repositoryIds: z.array(z.string()).optional(),
    targetRole: z.string().optional(),
  }),
});

export const assessmentController = {
  getHistory: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const assessments = await prisma.assessment.findMany({
        where: userId ? { userId } : {},
        orderBy: { createdAt: 'desc' },
      });

      const formatted = assessments.map(a => ({
        id: a.id,
        timestamp: a.createdAt.toISOString(),
        overallScore: a.overallScore,
        targetRole: a.targetRole,
        reposAnalyzedCount: a.reposAnalyzedCount,
        primaryStrengths: (() => {
          try {
            return JSON.parse(a.primaryStrengths);
          } catch {
            return [];
          }
        })(),
        keyGapAreas: (() => {
          try {
            return JSON.parse(a.keyGapAreas);
          } catch {
            return [];
          }
        })(),
        scoreChangeFromPrevious: a.scoreChangeFromPrevious,
        summaryFeedback: a.summaryFeedback,
      }));

      return res.json({
        success: true,
        data: formatted,
        meta: {
          total: formatted.length,
          timestamp: new Date().toISOString(),
          isMockData: false,
        },
      });
    } catch (error: any) {
      console.error('[assessmentController.getHistory]', error);
      return res.status(500).json({
        success: false,
        error: 'InternalServerError',
        message: error.message || 'Error fetching assessment history',
      });
    }
  },

  getSkillGapAnalysis: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;

      // Find latest assessment
      const latestAssessment = await prisma.assessment.findFirst({
        where: userId ? { userId } : {},
        orderBy: { createdAt: 'desc' },
        include: {
          skillAssessments: true,
        },
      });

      if (!latestAssessment) {
        // If no assessment exists yet, trigger one
        let defaultUserId = userId;
        if (!defaultUserId) {
          const defaultUser = await prisma.user.findFirst();
          defaultUserId = defaultUser?.id || 'usr_dev_101';
        }

        const freshOutcome = await AssessmentEngine.evaluatePortfolio(defaultUserId);
        return res.json({
          success: true,
          data: {
            targetRole: freshOutcome.targetRole,
            readinessScore: freshOutcome.overallScore,
            targetBenchmarkScore: 88,
            stats: {
              totalEvaluatedSkills: freshOutcome.skills.length,
              criticalGapsCount: freshOutcome.skills.filter(s => s.importance === 'Critical' && s.evidenceStatus !== 'Strong Evidence').length,
              recommendedGapsCount: freshOutcome.skills.filter(s => s.importance === 'Recommended' && s.evidenceStatus !== 'Strong Evidence').length,
              readySkillsCount: freshOutcome.skills.filter(s => s.score >= s.targetLevel).length,
            },
            skillGaps: freshOutcome.skills.map(s => ({
              skill: s.skillName,
              category: s.category,
              currentLevel: s.score,
              targetLevel: s.targetLevel,
              importance: s.importance,
              evidenceStatus: s.evidenceStatus,
              reason: s.explanation,
              recommendation: s.recommendation,
              codeReference: s.codeReference,
              supportingFilePath: s.supportingFilePath,
              actionItems: s.actionItems,
            })),
          },
          meta: {
            timestamp: new Date().toISOString(),
            isMockData: false,
          },
        });
      }

      const skills = latestAssessment.skillAssessments;
      const criticalCount = skills.filter(s => s.evidenceStatus !== 'Strong Evidence' && s.targetLevel >= 85).length;
      const recommendedCount = skills.filter(s => s.evidenceStatus !== 'Strong Evidence' && s.targetLevel < 85).length;

      return res.json({
        success: true,
        data: {
          targetRole: latestAssessment.targetRole,
          readinessScore: latestAssessment.overallScore,
          targetBenchmarkScore: 88,
          stats: {
            totalEvaluatedSkills: skills.length,
            criticalGapsCount: criticalCount,
            recommendedGapsCount: recommendedCount,
            readySkillsCount: skills.filter(s => s.score >= s.targetLevel).length,
          },
          skillGaps: skills.map(s => ({
            skill: s.skillName,
            category: s.category,
            currentLevel: s.score,
            targetLevel: s.targetLevel,
            importance: s.targetLevel >= 85 ? 'Critical' : 'Recommended',
            evidenceStatus: s.evidenceStatus,
            reason: s.explanation,
            recommendation: s.recommendation,
            codeReference: s.codeReference,
            supportingFilePath: s.supportingFilePath,
            actionItems: (() => {
              try {
                return JSON.parse(s.actionItems);
              } catch {
                return [];
              }
            })(),
          })),
        },
        meta: {
          timestamp: new Date().toISOString(),
          isMockData: false,
        },
      });
    } catch (error: any) {
      console.error('[assessmentController.getSkillGapAnalysis]', error);
      return res.status(500).json({
        success: false,
        error: 'InternalServerError',
        message: error.message || 'Error generating skill gap analysis',
      });
    }
  },

  triggerReassessment: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { jobId, repositoryIds, targetRole } = req.body;

      let userId = req.user?.id;
      if (!userId) {
        const defaultUser = await prisma.user.findFirst();
        userId = defaultUser?.id || 'usr_dev_101';
      }

      const outcome = await AssessmentEngine.evaluatePortfolio(userId, jobId, repositoryIds);

      return res.json({
        success: true,
        message: `Portfolio re-assessment successfully generated. Score difference: ${outcome.scoreDifference >= 0 ? '+' : ''}${outcome.scoreDifference}%`,
        data: {
          id: outcome.assessmentId,
          timestamp: outcome.timestamp,
          overallScore: outcome.overallScore,
          previousOverallScore: outcome.previousOverallScore,
          scoreChangeFromPrevious: outcome.scoreDifference,
          targetRole: targetRole || outcome.targetRole,
          reposAnalyzedCount: repositoryIds?.length || 1,
          primaryStrengths: outcome.primaryStrengths,
          keyGapAreas: outcome.keyGapAreas,
          summaryFeedback: outcome.summaryFeedback,
        },
        meta: {
          timestamp: new Date().toISOString(),
          isMockData: false,
        },
      });
    } catch (error: any) {
      console.error('[assessmentController.triggerReassessment]', error);
      return res.status(500).json({
        success: false,
        error: 'InternalServerError',
        message: error.message || 'Error triggering reassessment',
      });
    }
  },
};
