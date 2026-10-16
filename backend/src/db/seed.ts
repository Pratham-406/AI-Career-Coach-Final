import prisma from './prisma';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  const existingUser = await prisma.user.findUnique({
    where: { email: 'alex.rivera@cs.university.edu' },
  });

  if (existingUser) {
    console.log('[Seed] Database already seeded with default user.');
    return;
  }

  console.log('[Seed] Seeding database with initial records...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Create Default User
  const user = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'alex.rivera@cs.university.edu',
      passwordHash,
      githubUsername: 'alexrivera-dev',
      targetRole: 'Full Stack Cloud Engineer',
      experienceLevel: 'Student',
      careerReadinessScore: 82,
      plan: 'pro',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  // 2. Create Initial Repository
  const repo = await prisma.gitHubRepository.create({
    data: {
      userId: user.id,
      name: 'eventflow-distributed-queue',
      owner: 'alexrivera-dev',
      repoUrl: 'https://github.com/alexrivera-dev/eventflow-distributed-queue',
      defaultBranch: 'main',
      latestCommitSha: 'a7c93e4f1b82',
      lastScanTimestamp: new Date(),
      webhookStatus: 'active',
      language: 'TypeScript',
      stars: 34,
      forks: 8,
      openIssues: 2,
      codeQualityScore: 88,
      detectedSkills: JSON.stringify(['TypeScript', 'Node.js', 'Redis', 'PostgreSQL', 'Docker', 'Jest']),
      aiAnalysisStatus: 'analyzed',
      insights: JSON.stringify([
        'Strong error handling and unit test coverage (84% branch coverage).',
        'Missing Docker Compose healthchecks and rate-limiting middleware.',
        'Clean architecture separating business logic from transport layers.'
      ]),
    },
  });

  // 3. Create Scan & Code Evidence
  const scan = await prisma.repositoryScan.create({
    data: {
      repositoryId: repo.id,
      commitSha: 'a7c93e4f1b82',
      scanStatus: 'completed',
      detectedTech: JSON.stringify(['TypeScript', 'Node.js', 'Express', 'Redis', 'Docker', 'Jest']),
      fileTreeSummary: JSON.stringify([
        'package.json',
        'Dockerfile',
        'docker-compose.yml',
        'src/server.ts',
        'src/services/queueService.ts',
        'src/config/redis.ts',
        'tests/queue.test.ts'
      ]),
    },
  });

  await prisma.codeEvidence.createMany({
    data: [
      {
        scanId: scan.id,
        skill: 'TypeScript',
        filePath: 'src/server.ts',
        startLine: 1,
        endLine: 45,
        commitSha: 'a7c93e4f1b82',
        evidenceDescription: 'Strict TypeScript server setup with typed interfaces and error handling.',
        confidence: 95,
        codeSnippet: 'export interface QueueMessage<T> {\n  id: string;\n  payload: T;\n  timestamp: number;\n}',
      },
      {
        scanId: scan.id,
        skill: 'Docker',
        filePath: 'Dockerfile',
        startLine: 1,
        endLine: 24,
        commitSha: 'a7c93e4f1b82',
        evidenceDescription: 'Multi-stage Dockerfile build optimizing node_modules and production image size.',
        confidence: 90,
        codeSnippet: 'FROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci',
      },
      {
        scanId: scan.id,
        skill: 'Jest',
        filePath: 'tests/queue.test.ts',
        startLine: 10,
        endLine: 50,
        commitSha: 'a7c93e4f1b82',
        evidenceDescription: 'Automated unit and integration test suites with mock assertions.',
        confidence: 88,
        codeSnippet: 'describe("EventFlowQueue", () => {\n  it("should process message batches", async () => {\n    ...\n  });\n});',
      },
    ],
  });

  // 4. Create Job Posting with Requirements
  const job = await prisma.jobPosting.create({
    data: {
      userId: user.id,
      title: 'Full Stack Cloud Engineer Intern',
      company: 'Datadog / Cloud Platforms',
      description: 'We are seeking an ambitious engineer to design high-throughput cloud streaming APIs and microservices. Must demonstrate proficiency in TypeScript, containerization with Docker, and automated unit testing.',
      sourceUrl: 'https://careers.datadoghq.com/detail/12345',
      sourceType: 'curated',
      matchScore: 86,
      isRemote: true,
      type: 'Internship',
      location: 'New York, NY / Remote',
      salary: '$45 - $60 / hr',
      requiredSkills: JSON.stringify(['TypeScript', 'Docker', 'Jest', 'Kubernetes', 'CI/CD']),
    },
  });

  const req1 = await prisma.jobRequirement.create({
    data: {
      jobId: job.id,
      requiredSkill: 'TypeScript',
      description: 'Solid proficiency writing modern typed code in Node.js backend services.',
      importance: 'Critical',
      sourceExcerpt: 'Must demonstrate proficiency in TypeScript',
      sourceReference: 'Datadog Job Requirements section 2.1',
    },
  });

  const req2 = await prisma.jobRequirement.create({
    data: {
      jobId: job.id,
      requiredSkill: 'Docker',
      description: 'Experience containerizing microservices and writing Dockerfiles.',
      importance: 'Critical',
      sourceExcerpt: 'containerization with Docker',
      sourceReference: 'Datadog Job Requirements section 2.2',
    },
  });

  const req3 = await prisma.jobRequirement.create({
    data: {
      jobId: job.id,
      requiredSkill: 'Kubernetes',
      description: 'Knowledge of container orchestration, deployment manifests, or Helm charts.',
      importance: 'Recommended',
      sourceExcerpt: 'Knowledge of cloud orchestration platforms',
      sourceReference: 'Datadog Qualifications section 3.1',
    },
  });

  // 5. Initial Assessment
  const assessment = await prisma.assessment.create({
    data: {
      userId: user.id,
      jobId: job.id,
      overallScore: 82,
      scoreChangeFromPrevious: 0,
      targetRole: 'Full Stack Cloud Engineer',
      reposAnalyzedCount: 1,
      primaryStrengths: JSON.stringify(['TypeScript strict typing', 'Docker containerization', 'Jest unit testing']),
      keyGapAreas: JSON.stringify(['Kubernetes manifests', 'CI/CD GitHub Actions']),
      summaryFeedback: 'Initial baseline assessment completed. Verified concrete code evidence in eventflow-distributed-queue repository.',
    },
  });

  await prisma.skillAssessment.createMany({
    data: [
      {
        assessmentId: assessment.id,
        requirementId: req1.id,
        skillName: 'TypeScript',
        category: 'Backend',
        score: 92,
        targetLevel: 85,
        evidenceStatus: 'Strong Evidence',
        explanation: 'Concrete implementation found in eventflow-distributed-queue at src/server.ts lines 1-45.',
        recommendation: 'Continue maintaining strict null checks and exported API type contracts.',
        supportingFilePath: 'src/server.ts',
        codeReference: 'eventflow-distributed-queue@a7c93e4f1b82:src/server.ts:L1-45',
        actionItems: JSON.stringify(['Maintain strict TypeScript configuration']),
      },
      {
        assessmentId: assessment.id,
        requirementId: req2.id,
        skillName: 'Docker',
        category: 'DevOps',
        score: 85,
        targetLevel: 80,
        evidenceStatus: 'Strong Evidence',
        explanation: 'Multi-stage Dockerfile verified at Dockerfile lines 1-24 with production image optimization.',
        recommendation: 'Add Docker Compose healthchecks for automated orchestrator verification.',
        supportingFilePath: 'Dockerfile',
        codeReference: 'eventflow-distributed-queue@a7c93e4f1b82:Dockerfile:L1-24',
        actionItems: JSON.stringify(['Add HEALTHCHECK instruction in Dockerfile']),
      },
      {
        assessmentId: assessment.id,
        requirementId: req3.id,
        skillName: 'Kubernetes',
        category: 'Cloud',
        score: 40,
        targetLevel: 75,
        evidenceStatus: 'No Evidence',
        explanation: 'No Kubernetes manifests or Helm charts detected in scanned repositories.',
        recommendation: 'Add a k8s/ deployment.yaml manifest to demonstrate familiarity with pod scheduling and ingress.',
        supportingFilePath: null,
        codeReference: null,
        actionItems: JSON.stringify(['Create k8s/deployment.yaml with replicas and container port definition']),
      },
    ],
  });

  console.log('[Seed] Database successfully populated!');
}

if (require.main === module) {
  seedDatabase()
    .catch((err) => {
      console.error('[Seed Error]', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
