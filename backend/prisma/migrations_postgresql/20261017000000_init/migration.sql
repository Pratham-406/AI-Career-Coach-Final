-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "githubUsername" TEXT,
    "targetRole" TEXT NOT NULL DEFAULT 'Full Stack Developer',
    "experienceLevel" TEXT NOT NULL DEFAULT 'Student',
    "careerReadinessScore" INTEGER NOT NULL DEFAULT 80,
    "plan" TEXT NOT NULL DEFAULT 'pro',
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GitHubRepository" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "githubRepoId" TEXT,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "repoUrl" TEXT NOT NULL,
    "defaultBranch" TEXT NOT NULL DEFAULT 'main',
    "latestCommitSha" TEXT,
    "lastScanTimestamp" TIMESTAMP(3),
    "webhookStatus" TEXT NOT NULL DEFAULT 'inactive',
    "language" TEXT NOT NULL DEFAULT 'TypeScript',
    "stars" INTEGER NOT NULL DEFAULT 0,
    "forks" INTEGER NOT NULL DEFAULT 0,
    "openIssues" INTEGER NOT NULL DEFAULT 0,
    "codeQualityScore" INTEGER NOT NULL DEFAULT 75,
    "detectedSkills" TEXT NOT NULL DEFAULT '[]',
    "aiAnalysisStatus" TEXT NOT NULL DEFAULT 'pending',
    "insights" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GitHubRepository_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPosting" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "sourceType" TEXT NOT NULL DEFAULT 'manual',
    "matchScore" INTEGER NOT NULL DEFAULT 75,
    "isRemote" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL DEFAULT 'Full-time',
    "location" TEXT NOT NULL DEFAULT 'Remote',
    "salary" TEXT NOT NULL DEFAULT '$90,000 - $120,000',
    "requiredSkills" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobPosting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobRequirement" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "requiredSkill" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "importance" TEXT NOT NULL DEFAULT 'Critical',
    "sourceExcerpt" TEXT,
    "sourceReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepositoryScan" (
    "id" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "commitSha" TEXT NOT NULL,
    "scanStatus" TEXT NOT NULL DEFAULT 'completed',
    "scanTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "errorInfo" TEXT,
    "fileTreeSummary" TEXT,
    "detectedTech" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RepositoryScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeEvidence" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "startLine" INTEGER NOT NULL DEFAULT 1,
    "endLine" INTEGER NOT NULL DEFAULT 1,
    "commitSha" TEXT NOT NULL,
    "evidenceDescription" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL DEFAULT 85,
    "codeSnippet" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodeEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobId" TEXT,
    "overallScore" INTEGER NOT NULL,
    "previousAssessmentId" TEXT,
    "scoreChangeFromPrevious" INTEGER NOT NULL DEFAULT 0,
    "targetRole" TEXT NOT NULL,
    "reposAnalyzedCount" INTEGER NOT NULL DEFAULT 1,
    "primaryStrengths" TEXT NOT NULL DEFAULT '[]',
    "keyGapAreas" TEXT NOT NULL DEFAULT '[]',
    "summaryFeedback" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillAssessment" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "requirementId" TEXT,
    "skillName" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Backend',
    "score" INTEGER NOT NULL DEFAULT 70,
    "targetLevel" INTEGER NOT NULL DEFAULT 85,
    "evidenceStatus" TEXT NOT NULL DEFAULT 'Partial Evidence',
    "explanation" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "supportingFilePath" TEXT,
    "codeReference" TEXT,
    "actionItems" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkillAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GitHubWebhookEvent" (
    "id" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "repositoryId" TEXT,
    "eventType" TEXT NOT NULL DEFAULT 'push',
    "commitSha" TEXT,
    "processingStatus" TEXT NOT NULL DEFAULT 'received',
    "payload" TEXT NOT NULL,
    "errorInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GitHubWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndexes
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "GitHubRepository_userId_idx" ON "GitHubRepository"("userId");
CREATE INDEX "GitHubRepository_name_idx" ON "GitHubRepository"("name");
CREATE INDEX "JobPosting_userId_idx" ON "JobPosting"("userId");
CREATE INDEX "JobPosting_title_idx" ON "JobPosting"("title");
CREATE INDEX "JobRequirement_jobId_idx" ON "JobRequirement"("jobId");
CREATE INDEX "JobRequirement_requiredSkill_idx" ON "JobRequirement"("requiredSkill");
CREATE INDEX "RepositoryScan_repositoryId_idx" ON "RepositoryScan"("repositoryId");
CREATE INDEX "RepositoryScan_commitSha_idx" ON "RepositoryScan"("commitSha");
CREATE INDEX "CodeEvidence_scanId_idx" ON "CodeEvidence"("scanId");
CREATE INDEX "CodeEvidence_skill_idx" ON "CodeEvidence"("skill");
CREATE INDEX "CodeEvidence_commitSha_idx" ON "CodeEvidence"("commitSha");
CREATE INDEX "Assessment_userId_idx" ON "Assessment"("userId");
CREATE INDEX "Assessment_jobId_idx" ON "Assessment"("jobId");
CREATE INDEX "SkillAssessment_assessmentId_idx" ON "SkillAssessment"("assessmentId");
CREATE INDEX "SkillAssessment_skillName_idx" ON "SkillAssessment"("skillName");
CREATE UNIQUE INDEX "GitHubWebhookEvent_deliveryId_key" ON "GitHubWebhookEvent"("deliveryId");
CREATE INDEX "GitHubWebhookEvent_deliveryId_idx" ON "GitHubWebhookEvent"("deliveryId");
CREATE INDEX "GitHubWebhookEvent_repositoryId_idx" ON "GitHubWebhookEvent"("repositoryId");

-- AddForeignKeys
ALTER TABLE "GitHubRepository" ADD CONSTRAINT "GitHubRepository_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "JobPosting" ADD CONSTRAINT "JobPosting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "JobRequirement" ADD CONSTRAINT "JobRequirement_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "JobPosting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RepositoryScan" ADD CONSTRAINT "RepositoryScan_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "GitHubRepository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CodeEvidence" ADD CONSTRAINT "CodeEvidence_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "RepositoryScan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "JobPosting"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SkillAssessment" ADD CONSTRAINT "SkillAssessment_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SkillAssessment" ADD CONSTRAINT "SkillAssessment_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "JobRequirement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "GitHubWebhookEvent" ADD CONSTRAINT "GitHubWebhookEvent_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "GitHubRepository"("id") ON DELETE SET NULL ON UPDATE CASCADE;
