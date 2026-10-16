import { User, RepositorySummary, SkillGapItem, JobPosting, AssessmentRecord, PricingPlan, Invoice } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Fallback mock datasets for reliable demo presentation
export const fallbackUser: User = {
  id: 'usr_dev_101',
  name: 'Alex Rivera',
  email: 'alex.rivera@cs.university.edu',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  targetRole: 'Full Stack Cloud Engineer',
  experienceLevel: 'Student',
  githubUsername: 'alexrivera-dev',
  careerReadinessScore: 82,
  plan: 'pro',
  createdAt: '2026-01-15T09:00:00Z',
};

export const fallbackRepositories: RepositorySummary[] = [
  {
    id: 'repo_01',
    name: 'eventflow-distributed-queue',
    description: 'High-throughput event queue in Node.js & TypeScript with Redis Pub/Sub and PostgreSQL audit trails.',
    htmlUrl: 'https://github.com/alexrivera-dev/eventflow-distributed-queue',
    language: 'TypeScript',
    stars: 34,
    forks: 8,
    openIssues: 2,
    lastUpdated: '2026-03-28T14:32:00Z',
    codeQualityScore: 88,
    detectedSkills: ['TypeScript', 'Node.js', 'Redis', 'PostgreSQL', 'Docker', 'Jest'],
    aiAnalysisStatus: 'analyzed',
    insights: [
      'Strong error handling and unit test coverage (84% branch coverage).',
      'Missing Docker Compose healthchecks and rate-limiting middleware.',
      'Excellent repository structure following clean architecture principles.'
    ]
  },
  {
    id: 'repo_02',
    name: 'campus-connect-platform',
    description: 'Full-stack collaborative portal for college study groups featuring real-time WebSockets and Tailwind UI.',
    htmlUrl: 'https://github.com/alexrivera-dev/campus-connect-platform',
    language: 'TypeScript',
    stars: 19,
    forks: 4,
    openIssues: 5,
    lastUpdated: '2026-04-02T10:15:00Z',
    codeQualityScore: 81,
    detectedSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Express', 'WebSocket', 'Prisma'],
    aiAnalysisStatus: 'analyzed',
    insights: [
      'Great component separation with responsive modern design.',
      'Database migrations present, but lacks end-to-end integration tests (Cypress/Playwright).',
      'Demonstrates real-time state synchronization.'
    ]
  },
  {
    id: 'repo_03',
    name: 'cloud-metrics-daemon',
    description: 'Go agent collecting server hardware telemetry and pushing to Prometheus endpoint.',
    htmlUrl: 'https://github.com/alexrivera-dev/cloud-metrics-daemon',
    language: 'Go',
    stars: 12,
    forks: 1,
    openIssues: 0,
    lastUpdated: '2026-02-14T18:40:00Z',
    codeQualityScore: 75,
    detectedSkills: ['Go', 'Prometheus', 'Linux API', 'Concurrency'],
    aiAnalysisStatus: 'analyzed',
    insights: [
      'Good understanding of concurrency patterns and goroutines.',
      'Could benefit from comprehensive benchmark tests.'
    ]
  },
  {
    id: 'repo_04',
    name: 'ai-skill-evaluator-engine',
    description: 'Experimental script evaluating resume keywords against live job posting vector embeddings.',
    htmlUrl: 'https://github.com/alexrivera-dev/ai-skill-evaluator-engine',
    language: 'Python',
    stars: 45,
    forks: 11,
    openIssues: 3,
    lastUpdated: '2026-04-10T11:20:00Z',
    codeQualityScore: 79,
    detectedSkills: ['Python', 'FastAPI', 'ChromaDB', 'OpenAI API', 'Pandas'],
    aiAnalysisStatus: 'needs_reassessment',
    insights: [
      'Good usage of vector embeddings and semantic search.',
      'API keys hardcoded in early commits; scan suggested to verify .gitignore cleanup.'
    ]
  }
];

export const fallbackSkillGaps: SkillGapItem[] = [
  {
    skill: 'Docker & Container Orchestration',
    category: 'DevOps',
    currentLevel: 85,
    targetLevel: 90,
    importance: 'Critical',
    evidenceFound: [
      'Dockerfile found in eventflow-distributed-queue with multi-stage build pattern.',
      'docker-compose.yml with Redis & Postgres service configuration.'
    ],
    evidenceMissing: [
      'No Kubernetes (k8s) manifests or Helm charts detected in any public repository.',
      'Missing automated container vulnerability scanning in GitHub Actions.'
    ],
    recommendation: 'Add a Kubernetes deployment manifest and a basic Helm chart to eventflow repo to prove orchestrator proficiency.',
    learningResourceUrl: 'https://kubernetes.io/docs/tutorials/'
  },
  {
    skill: 'CI/CD Pipelines (GitHub Actions)',
    category: 'DevOps',
    currentLevel: 62,
    targetLevel: 85,
    importance: 'Critical',
    evidenceFound: [
      '.github/workflows/ci.yml with npm test and lint steps found in campus-connect.'
    ],
    evidenceMissing: [
      'No automated deployment pipeline to AWS / Vercel / Render.',
      'No PR preview environments or code coverage badges.'
    ],
    recommendation: 'Configure an automated CD workflow that deploys staging builds on tag pushes with Codecov status checks.',
    learningResourceUrl: 'https://docs.github.com/en/actions'
  },
  {
    skill: 'System Design & Distributed Caching',
    category: 'System Design',
    currentLevel: 78,
    targetLevel: 85,
    importance: 'Critical',
    evidenceFound: [
      'Redis Pub/Sub implemented in eventflow-distributed-queue for decoupled messaging.',
      'Basic cache invalidation pattern documented in README architecture diagram.'
    ],
    evidenceMissing: [
      'No cache stampede prevention (mutex lock / probabilistic early expiration).',
      'No read-through or write-behind cache implementation.'
    ],
    recommendation: 'Implement write-through caching in your API layer and document benchmark latency comparisons before and after.',
    learningResourceUrl: 'https://redis.io/docs/manual/patterns/'
  },
  {
    skill: 'Automated E2E Testing',
    category: 'Frontend',
    currentLevel: 55,
    targetLevel: 80,
    importance: 'Recommended',
    evidenceFound: [
      'Jest and React Testing Library unit tests in campus-connect-platform.'
    ],
    evidenceMissing: [
      'Zero Playwright or Cypress end-to-end integration test suites found in frontend repos.'
    ],
    recommendation: 'Add at least 3 critical user journey tests (login flow, room creation, real-time message exchange) using Playwright.',
    learningResourceUrl: 'https://playwright.dev/'
  },
  {
    skill: 'Cloud Infrastructure as Code (Terraform / CDK)',
    category: 'DevOps',
    currentLevel: 45,
    targetLevel: 75,
    importance: 'Recommended',
    evidenceFound: [
      'Basic AWS S3 bucket upload utility in campus-connect backend.'
    ],
    evidenceMissing: [
      'No Terraform (.tf) or AWS CDK infrastructure code files detected across repositories.'
    ],
    recommendation: 'Provision an S3 bucket and CloudFront distribution using a simple Terraform template in a cloud-infra repo.',
    learningResourceUrl: 'https://developer.hashicorp.com/terraform/tutorials'
  },
  {
    skill: 'Database Indexing & Query Profiling',
    category: 'Database',
    currentLevel: 88,
    targetLevel: 85,
    importance: 'Critical',
    evidenceFound: [
      'EXPLAIN ANALYZE documented in migration notes of eventflow repo.',
      'Composite indexes created on user_id and created_at timestamps.'
    ],
    evidenceMissing: [],
    recommendation: 'Exceeds benchmark for entry-level roles! Highlight query optimization metrics directly on your resume.',
    learningResourceUrl: 'https://use-the-index-luke.com/'
  }
];

export const fallbackJobs: JobPosting[] = [
  {
    id: 'job_01',
    title: 'Junior Cloud Systems Engineer (Fall 2026)',
    company: 'CloudScale Labs',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Full-time',
    isRemote: true,
    matchScore: 91,
    salaryRange: '$95,000 - $125,000 / yr',
    requiredSkills: ['TypeScript', 'Node.js', 'Docker', 'Redis', 'PostgreSQL', 'CI/CD'],
    matchingSkills: ['TypeScript', 'Node.js', 'Docker', 'Redis', 'PostgreSQL'],
    missingSkills: ['Kubernetes', 'Terraform'],
    description: 'Help build and scale distributed microservices handling billions of event telemetry streams. You will partner with senior architects to deploy resilient cloud runtimes.',
    postedDaysAgo: 2,
    applicationUrl: 'https://example.com/careers/cloudscale-junior-eng'
  },
  {
    id: 'job_02',
    title: 'Software Engineer Intern - Distributed Systems',
    company: 'Starlight Data Technologies',
    logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80',
    location: 'Seattle, WA (Remote)',
    type: 'Internship',
    isRemote: true,
    matchScore: 87,
    salaryRange: '$48 - $58 / hr',
    requiredSkills: ['Go', 'TypeScript', 'Docker', 'Prometheus', 'Distributed Systems'],
    matchingSkills: ['Go', 'TypeScript', 'Docker', 'Prometheus'],
    missingSkills: ['gRPC', 'Kubernetes'],
    description: 'Work directly on our real-time metrics collection pipeline. Write clean Go code, benchmark performance, and ship tools used by thousands of engineering teams.',
    postedDaysAgo: 4,
    applicationUrl: 'https://example.com/careers/starlight-intern'
  },
  {
    id: 'job_03',
    title: 'Associate Full-Stack Developer',
    company: 'FinPulse Mobility',
    logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
    location: 'New York, NY',
    type: 'Full-time',
    isRemote: false,
    matchScore: 84,
    salaryRange: '$90,000 - $115,000 / yr',
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Playwright'],
    matchingSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
    missingSkills: ['Playwright E2E', 'GraphQL'],
    description: 'Join our customer-facing team to build modern banking interfaces with high availability, clean design systems, and rapid release cycles.',
    postedDaysAgo: 5,
    applicationUrl: 'https://example.com/careers/finpulse-fullstack'
  },
  {
    id: 'job_04',
    title: 'AI Platform Engineering Fellow (Winter/Spring)',
    company: 'Nexus Cognitive Research',
    logoUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&auto=format&fit=crop&q=80',
    location: 'Boston, MA (Hybrid)',
    type: 'Co-op',
    isRemote: true,
    matchScore: 78,
    salaryRange: '$45 - $55 / hr',
    requiredSkills: ['Python', 'FastAPI', 'Vector Databases', 'Docker', 'LangChain'],
    matchingSkills: ['Python', 'FastAPI', 'Docker'],
    missingSkills: ['LangChain', 'vLLM', 'AWS SageMaker'],
    description: 'Collaborate with researchers to deploy inference APIs, optimize retrieval pipelines, and build evaluation harnesses for enterprise LLM agents.',
    postedDaysAgo: 1,
    applicationUrl: 'https://example.com/careers/nexus-ai-fellow'
  }
];

export const fallbackAssessments: AssessmentRecord[] = [
  {
    id: 'eval_04',
    timestamp: '2026-04-12T16:45:00Z',
    overallScore: 82,
    targetRole: 'Full Stack Cloud Engineer',
    reposAnalyzedCount: 4,
    primaryStrengths: ['TypeScript strict typing', 'Redis Pub/Sub concurrency', 'Clean component hierarchy'],
    keyGapAreas: ['Kubernetes deployment manifests', 'Automated E2E browser testing (Playwright)'],
    scoreChangeFromPrevious: +6,
    summaryFeedback: 'Great jump in readiness score after adding Docker multi-stage builds and Redis queue documentation to eventflow repo.'
  },
  {
    id: 'eval_03',
    timestamp: '2026-03-15T11:20:00Z',
    overallScore: 76,
    targetRole: 'Full Stack Cloud Engineer',
    reposAnalyzedCount: 3,
    primaryStrengths: ['Database relational modeling', 'REST API route controllers'],
    keyGapAreas: ['Containerization', 'CI/CD pipeline automation'],
    scoreChangeFromPrevious: +8,
    summaryFeedback: 'campus-connect-platform shows solid foundational React + Express usage. Recommended adding docker-compose setup.'
  },
  {
    id: 'eval_02',
    timestamp: '2026-02-18T14:00:00Z',
    overallScore: 68,
    targetRole: 'Full Stack Developer',
    reposAnalyzedCount: 2,
    primaryStrengths: ['Frontend UI styling', 'JavaScript async/await fundamentals'],
    keyGapAreas: ['Production logging', 'State management', 'Testing suites'],
    scoreChangeFromPrevious: +10,
    summaryFeedback: 'Identified lack of automated testing in early repos. Recommended setting up Jest/Vitest.'
  },
  {
    id: 'eval_01',
    timestamp: '2026-01-20T09:30:00Z',
    overallScore: 58,
    targetRole: 'Full Stack Developer',
    reposAnalyzedCount: 1,
    primaryStrengths: ['Git commit cadence', 'Basic HTML/CSS'],
    keyGapAreas: ['Modern TypeScript usage', 'Backend API design', 'Database queries'],
    scoreChangeFromPrevious: 0,
    summaryFeedback: 'Baseline assessment created upon initial GitHub account connection.'
  }
];

export const fallbackPricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Explorer (Free)',
    tagline: 'Ideal for students starting out and auditing their first GitHub repository.',
    priceMonthly: 0,
    priceAnnual: 0,
    features: [
      '1 Connected GitHub Repository',
      'Basic skill-gap detection',
      'Top 5 matching job recommendations',
      'Quarterly re-assessment score',
      'Community Discord access'
    ],
    unavailableFeatures: [
      'Deep AST & commit history inspection',
      'Evidence-backed code citations',
      'Personalized weekly portfolio action plans',
      'Priority recruiter talent pool badge'
    ]
  },
  {
    id: 'pro',
    name: 'Career Accelerator Pro',
    tagline: 'The complete AI-powered portfolio toolkit for landing your dream tech role.',
    priceMonthly: 12,
    priceAnnual: 99,
    badge: 'Most Popular',
    popular: true,
    features: [
      'Unlimited GitHub Repositories analyzed',
      'Real-time commit & PR skill change detection (Simulated)',
      'Detailed evidence & code gap citations',
      'Daily curated high-match job & internship feed',
      'Custom role target benchmarks (SWE, DevOps, ML, Cloud)',
      '1-Click automated re-assessment & progression charts',
      'Personalized project starter ideas to close specific gaps'
    ]
  },
  {
    id: 'campus',
    name: 'Campus / University Partner',
    tagline: 'Equip your computer science cohort with institutional career acceleration.',
    priceMonthly: 29,
    priceAnnual: 249,
    badge: 'Best for Bootcamps',
    features: [
      'Everything in Career Accelerator Pro',
      'Faculty / Advisor oversight dashboard',
      'Cohort-wide skill distribution analytics',
      'Custom campus recruiting pipeline integration',
      'Bulk student licenses with SSO support',
      'Dedicated hackathon mentor onboarding'
    ]
  }
];

export const fallbackInvoices: Invoice[] = [
  {
    id: 'inv_2026_04',
    date: '2026-04-01',
    amount: '$12.00',
    plan: 'Career Accelerator Pro (Monthly)',
    status: 'Paid',
    pdfUrl: '#'
  },
  {
    id: 'inv_2026_03',
    date: '2026-03-01',
    amount: '$12.00',
    plan: 'Career Accelerator Pro (Monthly)',
    status: 'Paid',
    pdfUrl: '#'
  },
  {
    id: 'inv_2026_02',
    date: '2026-02-01',
    amount: '$12.00',
    plan: 'Career Accelerator Pro (Monthly)',
    status: 'Paid',
    pdfUrl: '#'
  }
];

// Helper wrapper for fetch with fallback
async function fetchWithFallback<T>(url: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const result = await response.json();
    return result.data ?? result;
  } catch (error) {
    console.warn(`[API] Endpoint ${url} fallback triggered:`, error);
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw error;
  }
}

export const api = {
  // Auth
  async login(email: string, password?: string): Promise<{ token: string; user: User }> {
    return fetchWithFallback(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password: password || 'demo123' }) },
      { token: 'mock_jwt_token', user: { ...fallbackUser, email } }
    );
  },

  async register(name: string, email: string, targetRole: string): Promise<{ token: string; user: User }> {
    return fetchWithFallback(
      '/auth/register',
      { method: 'POST', body: JSON.stringify({ name, email, targetRole, password: 'password123' }) },
      { token: 'mock_jwt_token', user: { ...fallbackUser, name, email, targetRole } }
    );
  },

  async getProfile(): Promise<User> {
    return fetchWithFallback('/auth/me', { method: 'GET' }, fallbackUser);
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    return fetchWithFallback(
      '/auth/profile',
      { method: 'PATCH', body: JSON.stringify(updates) },
      { ...fallbackUser, ...updates }
    );
  },

  // Repositories
  async getRepositories(): Promise<RepositorySummary[]> {
    return fetchWithFallback('/github/repos', { method: 'GET' }, fallbackRepositories);
  },

  async analyzeRepository(repoId: string): Promise<RepositorySummary> {
    return fetchWithFallback(
      '/github/analyze',
      { method: 'POST', body: JSON.stringify({ repoId }) },
      {
        ...fallbackRepositories[0],
        id: repoId,
        codeQualityScore: Math.min(100, fallbackRepositories[0].codeQualityScore + 2),
        aiAnalysisStatus: 'analyzed',
      }
    );
  },

  async connectRepository(repoUrl: string): Promise<RepositorySummary> {
    const name = repoUrl.split('/').pop()?.replace('.git', '') || 'connected-repo';
    return fetchWithFallback(
      '/github/connect',
      { method: 'POST', body: JSON.stringify({ repoUrl, name }) },
      {
        id: `repo_${Date.now()}`,
        name,
        description: 'Newly connected repository queued for skill extraction.',
        htmlUrl: repoUrl,
        language: 'TypeScript',
        stars: 0,
        forks: 0,
        openIssues: 0,
        lastUpdated: new Date().toISOString(),
        codeQualityScore: 75,
        detectedSkills: ['Git', 'TypeScript'],
        aiAnalysisStatus: 'pending',
        insights: ['Queued for deep semantic analysis.'],
      }
    );
  },

  async getSyncStatus() {
    return fetchWithFallback('/github/status', { method: 'GET' }, {
      isWebhookActive: false,
      lastWebhookEvent: null,
      syncMode: 'Simulated Demo Mode',
      configuredClientId: 'Unset',
      nextScheduledScan: '2026-04-18T00:00:00Z',
    });
  },

  // Jobs
  async getJobs(params?: { search?: string; type?: string; remote?: boolean }): Promise<JobPosting[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.type) query.set('type', params.type);
    if (params?.remote !== undefined) query.set('remote', String(params.remote));
    const qs = query.toString() ? `?${query.toString()}` : '';

    return fetchWithFallback(`/jobs${qs}`, { method: 'GET' }, fallbackJobs);
  },

  // Assessment & Skill Gap
  async getSkillGapAnalysis(role?: string): Promise<{
    targetRole: string;
    readinessScore: number;
    targetBenchmarkScore: number;
    stats: {
      totalEvaluatedSkills: number;
      criticalGapsCount: number;
      recommendedGapsCount: number;
      readySkillsCount: number;
    };
    skillGaps: SkillGapItem[];
  }> {
    return fetchWithFallback(
      `/assessment/gap-analysis${role ? `?role=${encodeURIComponent(role)}` : ''}`,
      { method: 'GET' },
      {
        targetRole: role || 'Full Stack Cloud Engineer',
        readinessScore: 82,
        targetBenchmarkScore: 88,
        stats: {
          totalEvaluatedSkills: fallbackSkillGaps.length,
          criticalGapsCount: fallbackSkillGaps.filter(g => g.importance === 'Critical').length,
          recommendedGapsCount: fallbackSkillGaps.filter(g => g.importance === 'Recommended').length,
          readySkillsCount: fallbackSkillGaps.filter(g => g.currentLevel >= g.targetLevel).length,
        },
        skillGaps: fallbackSkillGaps,
      }
    );
  },

  async getAssessmentHistory(): Promise<AssessmentRecord[]> {
    return fetchWithFallback('/assessment/history', { method: 'GET' }, fallbackAssessments);
  },

  async triggerReassessment(targetRole?: string): Promise<AssessmentRecord> {
    return fetchWithFallback(
      '/assessment/trigger',
      { method: 'POST', body: JSON.stringify({ targetRole }) },
      {
        id: `eval_${Date.now()}`,
        timestamp: new Date().toISOString(),
        overallScore: 84,
        targetRole: targetRole || 'Full Stack Cloud Engineer',
        reposAnalyzedCount: 4,
        primaryStrengths: ['TypeScript strict typing', 'Redis Pub/Sub', 'Clean component hierarchy'],
        keyGapAreas: ['Kubernetes Helm charts', 'Playwright integration testing'],
        scoreChangeFromPrevious: +2,
        summaryFeedback: 'Automated re-assessment executed. New commits evaluated.',
      }
    );
  },

  // Billing
  async getPricingPlans(): Promise<PricingPlan[]> {
    return fetchWithFallback('/billing/plans', { method: 'GET' }, fallbackPricingPlans);
  },

  async getInvoices(): Promise<Invoice[]> {
    return fetchWithFallback('/billing/invoices', { method: 'GET' }, fallbackInvoices);
  },

  async createCheckoutSession(planId: string, billingCycle: 'monthly' | 'annual') {
    return fetchWithFallback(
      '/billing/checkout',
      { method: 'POST', body: JSON.stringify({ planId, billingCycle }) },
      {
        sessionId: `cs_mock_${Date.now()}`,
        checkoutUrl: '#',
        planName: planId === 'pro' ? 'Career Accelerator Pro' : 'Campus Partner',
        amount: billingCycle === 'annual' ? 99 : 12,
        currency: 'USD',
        isStripeLive: false,
        notice: 'Test checkout simulated for hackathon demo.',
      }
    );
  },

  async cancelSubscription() {
    return fetchWithFallback(
      '/billing/cancel',
      { method: 'POST' },
      { status: 'cancelled', effectiveDate: '2026-05-01' }
    );
  },

  // Backend Health check
  async checkHealth(): Promise<{ status: string; uptimeSeconds?: number; environment?: string }> {
    return fetchWithFallback('/health', { method: 'GET' }, { status: 'mock-offline', environment: 'client-fallback' });
  },
};
