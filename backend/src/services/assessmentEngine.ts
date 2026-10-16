import prisma from '../db/prisma';

export interface EvaluatedSkillResult {
  requirementId?: string;
  skillName: string;
  category: string;
  importance: 'Critical' | 'Recommended' | 'Bonus';
  score: number;
  targetLevel: number;
  evidenceStatus: 'Strong Evidence' | 'Partial Evidence' | 'No Evidence';
  explanation: string;
  recommendation: string;
  supportingFilePath?: string;
  codeReference?: string;
  actionItems: string[];
}

export interface AssessmentOutcome {
  assessmentId: string;
  overallScore: number;
  previousOverallScore: number;
  scoreDifference: number;
  targetRole: string;
  primaryStrengths: string[];
  keyGapAreas: string[];
  summaryFeedback: string;
  skills: EvaluatedSkillResult[];
  timestamp: string;
}

export class AssessmentEngine {
  /**
   * Evaluates job requirements against concrete repository code evidences
   */
  public static async evaluatePortfolio(
    userId: string,
    jobId?: string,
    repositoryIds?: string[]
  ): Promise<AssessmentOutcome> {
    // 1. Fetch Job and Requirements
    let job: any = null;
    let requirements: any[] = [];

    if (jobId) {
      job = await prisma.jobPosting.findUnique({
        where: { id: jobId },
        include: { requirements: true },
      });
      if (job && job.requirements.length > 0) {
        requirements = job.requirements;
      }
    }

    // Fallback: If no jobId specified or job has no requirements, fetch latest job with requirements
    if (requirements.length === 0) {
      job = await prisma.jobPosting.findFirst({
        where: { requirements: { some: {} } },
        include: { requirements: true },
        orderBy: { createdAt: 'desc' },
      });
      if (job) {
        requirements = job.requirements;
      }
    }

    // 2. Fetch Code Evidences from Scans
    const repoWhere: any = repositoryIds && repositoryIds.length > 0
      ? { id: { in: repositoryIds } }
      : { userId };

    const repos = await prisma.gitHubRepository.findMany({
      where: repoWhere,
      include: {
        scans: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { evidences: true },
        },
      },
    });

    const allEvidences = repos.flatMap(r => r.scans.flatMap(s => s.evidences));
    const allDetectedSkills = new Set<string>();
    repos.forEach(r => {
      try {
        const skills: string[] = JSON.parse(r.detectedSkills);
        skills.forEach(s => allDetectedSkills.add(s.toLowerCase()));
      } catch {}
    });

    // 3. Compare Each Requirement Against Evidences
    const evaluatedSkills: EvaluatedSkillResult[] = [];
    let weightedScoreSum = 0;
    let totalWeight = 0;

    const strengths: string[] = [];
    const gaps: string[] = [];

    for (const req of requirements) {
      const skillName = req.requiredSkill;
      const lowerSkill = skillName.toLowerCase();

      // Find direct code evidence
      const directEvidence = allEvidences.find(e =>
        e.skill.toLowerCase() === lowerSkill ||
        e.evidenceDescription.toLowerCase().includes(lowerSkill) ||
        (e.codeSnippet && e.codeSnippet.toLowerCase().includes(lowerSkill))
      );

      const hasPartialMention = directEvidence ? false : allDetectedSkills.has(lowerSkill);

      let evidenceStatus: 'Strong Evidence' | 'Partial Evidence' | 'No Evidence';
      let score: number;
      let explanation: string;
      let recommendation: string;
      let supportingFilePath: string | undefined;
      let codeReference: string | undefined;
      const actionItems: string[] = [];

      if (directEvidence) {
        evidenceStatus = 'Strong Evidence';
        score = Math.min(98, Math.max(85, directEvidence.confidence));
        supportingFilePath = directEvidence.filePath;
        codeReference = `${directEvidence.filePath}:${directEvidence.startLine}-${directEvidence.endLine} (${directEvidence.commitSha.slice(0, 7)})`;
        explanation = `Concrete implementation verified in ${directEvidence.filePath} (lines ${directEvidence.startLine}-${directEvidence.endLine}). ${directEvidence.evidenceDescription}`;
        recommendation = `Continue adhering to industry best practices in ${skillName}.`;
        strengths.push(`${skillName} implementation`);
        actionItems.push(`Maintain unit test coverage for ${skillName} modules.`);
      } else if (hasPartialMention) {
        evidenceStatus = 'Partial Evidence';
        score = 65;
        explanation = `Skill ${skillName} is detected in dependency manifests or repository tags, but detailed source code implementation evidence is limited.`;
        recommendation = `Add dedicated unit tests or expand usage of ${skillName} to demonstrate deep mastery.`;
        actionItems.push(`Write a dedicated module or test utilizing ${skillName}.`);
      } else {
        evidenceStatus = 'No Evidence';
        score = 35;
        explanation = `No source code files or configurations demonstrating ${skillName} were found across the connected repositories.`;
        recommendation = `Create a feature branch demonstrating practical application of ${skillName} relevant to this requirement.`;
        gaps.push(`${skillName} missing`);
        actionItems.push(`Implement a project or service component showcasing ${skillName}.`);
      }

      // Weight multiplier based on importance
      const weight = req.importance === 'Critical' ? 3 : req.importance === 'Recommended' ? 2 : 1;
      weightedScoreSum += score * weight;
      totalWeight += weight;

      evaluatedSkills.push({
        requirementId: req.id,
        skillName,
        category: 'Backend Architecture',
        importance: req.importance as any,
        score,
        targetLevel: req.importance === 'Critical' ? 85 : 75,
        evidenceStatus,
        explanation,
        recommendation,
        supportingFilePath,
        codeReference,
        actionItems,
      });
    }

    // 4. Calculate Final Weighted Overall Score
    const overallScore = totalWeight > 0 ? Math.round(weightedScoreSum / totalWeight) : 75;

    // 5. Fetch Previous Assessment for Before/After Differential
    const previousAssessment = await prisma.assessment.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const previousOverallScore = previousAssessment ? previousAssessment.overallScore : overallScore;
    const scoreDifference = overallScore - previousOverallScore;

    const targetRole = job?.title || 'Full Stack Software Engineer';
    const summaryFeedback = scoreDifference > 0
      ? `Re-assessment complete: Score increased by +${scoreDifference}% due to newly verified code evidence.`
      : scoreDifference < 0
      ? `Re-assessment complete: Score adjusted by ${scoreDifference}% reflecting stricter job requirements.`
      : `Re-assessment complete: Portfolio demonstrates steady alignment with ${targetRole} hiring standards.`;

    // 6. Persist Assessment in Database
    const assessment = await prisma.assessment.create({
      data: {
        userId,
        jobId: job?.id || null,
        overallScore,
        previousAssessmentId: previousAssessment?.id || null,
        scoreChangeFromPrevious: scoreDifference,
        targetRole,
        reposAnalyzedCount: repos.length,
        primaryStrengths: JSON.stringify(strengths.slice(0, 4)),
        keyGapAreas: JSON.stringify(gaps.slice(0, 4)),
        summaryFeedback,
      },
    });

    // 7. Persist Skill Assessment Records
    if (evaluatedSkills.length > 0) {
      await prisma.skillAssessment.createMany({
        data: evaluatedSkills.map(s => ({
          assessmentId: assessment.id,
          requirementId: s.requirementId || null,
          skillName: s.skillName,
          category: s.category,
          score: s.score,
          targetLevel: s.targetLevel,
          evidenceStatus: s.evidenceStatus,
          explanation: s.explanation,
          recommendation: s.recommendation,
          supportingFilePath: s.supportingFilePath || null,
          codeReference: s.codeReference || null,
          actionItems: JSON.stringify(s.actionItems),
        })),
      });
    }

    // Update user readiness score
    await prisma.user.update({
      where: { id: userId },
      data: { careerReadinessScore: overallScore },
    });

    return {
      assessmentId: assessment.id,
      overallScore,
      previousOverallScore,
      scoreDifference,
      targetRole,
      primaryStrengths: strengths,
      keyGapAreas: gaps,
      summaryFeedback,
      skills: evaluatedSkills,
      timestamp: assessment.createdAt.toISOString(),
    };
  }
}
