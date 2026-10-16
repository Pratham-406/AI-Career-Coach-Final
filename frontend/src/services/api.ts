import { User, RepositorySummary, SkillGapItem, JobPosting, AssessmentRecord, PricingPlan, Invoice } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Fallback mock datasets for offline resilience
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
  }
];

export const fallbackJobs: JobPosting[] = [
  {
    id: 'job_01',
    title: 'Cloud Infrastructure & Backend Intern',
    company: 'Datadog',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    location: 'New York, NY (Remote)',
    type: 'Internship',
    isRemote: true,
    matchScore: 92,
    salaryRange: '$48 - $58 / hr',
    requiredSkills: ['TypeScript', 'Node.js', 'Docker', 'Redis', 'PostgreSQL', 'Jest'],
    matchingSkills: ['TypeScript', 'Node.js', 'Docker', 'Redis', 'PostgreSQL', 'Jest'],
    missingSkills: ['Kubernetes', 'Go'],
    description: 'Join our telemetry agent platform team to optimize high-throughput distributed tracing engines.',
    postedDaysAgo: 2,
    applicationUrl: 'https://careers.datadoghq.com'
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
  }
];

export const fallbackInvoices: Invoice[] = [
  {
    id: 'inv_2026_03',
    date: '2026-03-01',
    amount: '$12.00',
    plan: 'Career Accelerator Pro (Monthly)',
    status: 'Paid',
    pdfUrl: '#'
  }
];

// Helper to get auth headers
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Helper wrapper for fetch with fallback
async function fetchWithFallback<T>(url: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const authHeaders = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...authHeaders,
        ...options?.headers,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result.message || `HTTP error ${response.status}`;
      throw new Error(errorMsg);
    }

    return result.data ?? result;
  } catch (error: any) {
    console.warn(`[API] Endpoint ${url} fallback triggered:`, error.message);
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw error;
  }
}

export const api = {
  // Auth
  async login(email: string, password?: string): Promise<{ token: string; user: User }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Login failed. Please check your credentials.');
    }
    if (result.data?.token) {
      localStorage.setItem('auth_token', result.data.token);
    }
    return result.data;
  },

  async register(name: string, email: string, targetRole: string, password?: string): Promise<{ token: string; user: User }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, targetRole, password: password || 'Password123!' }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Registration failed.');
    }
    if (result.data?.token) {
      localStorage.setItem('auth_token', result.data.token);
    }
    return result.data;
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', headers: getAuthHeaders() });
    } catch {}
    localStorage.removeItem('auth_token');
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
      { method: 'POST', body: JSON.stringify({ repoId }) }
    );
  },

  async connectRepository(repoUrl: string): Promise<RepositorySummary> {
    const name = repoUrl.split('/').pop()?.replace('.git', '') || 'connected-repo';
    return fetchWithFallback(
      '/github/connect',
      { method: 'POST', body: JSON.stringify({ repoUrl, name }) }
    );
  },

  async getRepoEvidence(repoId: string): Promise<any[]> {
    return fetchWithFallback(`/github/repos/${repoId}/evidence`, { method: 'GET' }, []);
  },

  async getSyncStatus() {
    return fetchWithFallback('/github/status', { method: 'GET' }, {
      isWebhookActive: true,
      lastWebhookEvent: null,
      syncMode: 'Live Webhook + GitHub REST Scanner',
      configuredClientId: 'Configured',
      nextScheduledScan: new Date().toISOString(),
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

  async ingestJob(params: { url?: string; text?: string; title?: string; company?: string }) {
    const response = await fetch(`${API_BASE_URL}/jobs/ingest`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(params),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Job ingestion failed');
    }
    return result.data;
  },

  async createJob(jobData: any): Promise<JobPosting> {
    return fetchWithFallback('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  },

  async deleteJob(jobId: string): Promise<void> {
    await fetchWithFallback(`/jobs/${jobId}`, { method: 'DELETE' });
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
      { method: 'GET' }
    );
  },

  async getAssessmentHistory(): Promise<AssessmentRecord[]> {
    return fetchWithFallback('/assessment/history', { method: 'GET' }, fallbackAssessments);
  },

  async triggerReassessment(targetRole?: string, jobId?: string, repositoryIds?: string[]): Promise<AssessmentRecord> {
    return fetchWithFallback(
      '/assessment/trigger',
      { method: 'POST', body: JSON.stringify({ targetRole, jobId, repositoryIds }) }
    );
  },

  // Live SSE stream subscription
  subscribeToLiveEvents(onEvent: (data: any) => void): () => void {
    const userToken = localStorage.getItem('auth_token');
    const url = `${API_BASE_URL}/events${userToken ? `?token=${encodeURIComponent(userToken)}` : ''}`;
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource(url);

      eventSource.addEventListener('message', (e) => {
        try {
          const data = JSON.parse(e.data);
          onEvent(data);
        } catch {}
      });

      eventSource.addEventListener('SCAN_COMPLETED', (e: any) => {
        try {
          const data = JSON.parse(e.data);
          onEvent({ type: 'SCAN_COMPLETED', ...data });
        } catch {}
      });

      eventSource.addEventListener('WEBHOOK_PUSH_RECEIVED', (e: any) => {
        try {
          const data = JSON.parse(e.data);
          onEvent({ type: 'WEBHOOK_PUSH_RECEIVED', ...data });
        } catch {}
      });

      eventSource.addEventListener('REASSESSMENT_UPDATED', (e: any) => {
        try {
          const data = JSON.parse(e.data);
          onEvent({ type: 'REASSESSMENT_UPDATED', ...data });
        } catch {}
      });

      eventSource.onerror = () => {
        // SSE will attempt reconnect automatically
      };
    } catch (err) {
      console.warn('[SSE] Could not establish EventSource connection:', err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
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
