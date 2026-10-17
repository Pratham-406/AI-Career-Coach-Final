import {
  User,
  RepositorySummary,
  SkillGapItem,
  JobPosting,
  AssessmentRecord,
  PricingPlan,
  Invoice,
  TutorialVideo,
  MockInterviewQuestion,
  InterviewEvaluation,
  MockInterviewSession,
  TalentProfile,
  RecruiterMessage,
} from '../types';

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

  // Tutorials
  async getTutorials(): Promise<TutorialVideo[]> {
    return fetchWithFallback('/tutorials', { method: 'GET' }, fallbackTutorials);
  },

  async completeTutorial(id: string): Promise<any> {
    return fetchWithFallback(`/tutorials/${id}/complete`, { method: 'POST' }, { success: true });
  },

  // Mock Interview
  async getInterviewQuestions(role?: string, category?: string): Promise<MockInterviewQuestion[]> {
    const params = new URLSearchParams();
    if (role) params.set('role', role);
    if (category) params.set('category', category);
    return fetchWithFallback(`/interviews/questions?${params.toString()}`, { method: 'GET' }, fallbackInterviewQuestions);
  },

  async evaluateInterviewAnswer(questionId: string, answer: string, role?: string): Promise<{ evaluation: InterviewEvaluation }> {
    return fetchWithFallback(
      '/interviews/evaluate',
      { method: 'POST', body: JSON.stringify({ questionId, answer, role }) },
      {
        evaluation: {
          overallScore: 84,
          clarityScore: 88,
          technicalDepthScore: 82,
          starComplianceScore: 85,
          strengths: ['Identified core architectural patterns', 'Demonstrated production incident awareness'],
          improvements: ['Add quantifiable business metrics to conclusions', 'Mention distributed tracing safeguards'],
          matchedKeywords: ['Redis', 'Dead Letter Queue', 'Idempotency'],
          missingKeywords: ['Exponential Backoff', 'Jitter'],
          modelAnswerSummary: 'Strong technical explanation demonstrating solid systems maturity.',
          readinessVerdict: 'High Technical Competence — Recommended for Onsite Interview',
        },
      }
    );
  },

  async saveInterviewSession(sessionData: Partial<MockInterviewSession>): Promise<{ session: MockInterviewSession }> {
    return fetchWithFallback(
      '/interviews/sessions',
      { method: 'POST', body: JSON.stringify(sessionData) },
      {
        session: {
          id: `session_${Date.now()}`,
          targetRole: sessionData.targetRole || 'Full Stack Cloud Engineer',
          category: sessionData.category || 'System Design',
          date: new Date().toISOString(),
          totalQuestions: sessionData.totalQuestions || 1,
          averageScore: sessionData.averageScore || 85,
          feedback: sessionData.feedback as InterviewEvaluation,
        },
      }
    );
  },

  async getInterviewHistory(): Promise<MockInterviewSession[]> {
    return fetchWithFallback('/interviews/history', { method: 'GET' }, fallbackInterviewSessions);
  },

  // Skill-First Talent Network
  async getTalentProfiles(skill?: string, role?: string): Promise<TalentProfile[]> {
    const params = new URLSearchParams();
    if (skill) params.set('skill', skill);
    if (role) params.set('role', role);
    return fetchWithFallback(`/network/talents?${params.toString()}`, { method: 'GET' }, fallbackTalentProfiles);
  },

  async sendRecruiterMessage(payload: Partial<RecruiterMessage>): Promise<RecruiterMessage> {
    return fetchWithFallback(
      '/network/messages',
      { method: 'POST', body: JSON.stringify(payload) },
      {
        id: `msg_${Date.now()}`,
        senderName: payload.senderName || 'Senior Tech Lead',
        senderTitle: payload.senderTitle || 'Talent Acquisition Partner',
        company: payload.company || 'Stripe',
        companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        studentId: payload.studentId || 'talent-01',
        subject: payload.subject || 'Interview Request: Engineering Role',
        message: payload.message || 'We love your verified skills!',
        interviewType: payload.interviewType || 'Round 1 Technical Screen',
        proposedDate: payload.proposedDate || 'Next Tuesday at 2:00 PM PST',
        status: 'pending',
        sentAt: 'Just now',
      }
    );
  },

  async getStudentInbox(): Promise<RecruiterMessage[]> {
    return fetchWithFallback('/network/inbox', { method: 'GET' }, fallbackRecruiterMessages);
  },

  async updateMessageStatus(id: string, status: 'accepted' | 'declined'): Promise<RecruiterMessage> {
    return fetchWithFallback(
      `/network/messages/${id}`,
      { method: 'PATCH', body: JSON.stringify({ status }) },
      {
        id,
        senderName: 'Rachel Vance',
        senderTitle: 'Engineering Talent Partner',
        company: 'Stripe',
        companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        studentId: 'talent-01',
        subject: 'Interview Request',
        message: 'Status updated',
        interviewType: 'Round 1 Technical Screen',
        status,
        sentAt: 'Yesterday',
      }
    );
  },

  async addStudentSkill(skill: { name: string; level: string; verifiedBy: string; evidenceSnippet?: string }): Promise<any> {
    return fetchWithFallback('/network/skills', { method: 'POST', body: JSON.stringify(skill) }, { success: true });
  },
};

// Fallback datasets for new features
export const fallbackTutorials: TutorialVideo[] = [
  {
    id: 'tut-cwh-python',
    title: 'Python for Beginners (Full Course #100DaysOfCode)',
    description: 'Master Python programming from zero to advanced with CodeWithHarry. Covers core data structures, OOPs, modules, automation, and real-world project development.',
    category: 'Core Programming',
    durationMinutes: '100+ Videos',
    videoUrl: 'https://www.youtube-nocookie.com/embed/videoseries?list=PLu0W_9lII9agwh1XjRt242xIpHhPT2llg',
    externalUrl: 'https://youtube.com/playlist?list=PLu0W_9lII9agwh1XjRt242xIpHhPT2llg&si=82RHskftZhCeUxxa',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80',
    instructor: 'CodeWithHarry (Harry)',
    difficulty: 'Beginner',
    keyTakeaways: [
      'Comprehensive Python fundamentals, control flow, functions & packages.',
      'Hands-on object-oriented programming (OOP), file I/O & exception handling.',
      'Building portfolio projects and automating scripts to prove skills.',
    ],
    actionLink: {
      label: 'Update Python in Skills',
      page: 'network',
    },
    isCompleted: false,
  },
  {
    id: 'tut-cw-cpp',
    title: 'C++ in One Shot | Complete Programming Tutorial for Beginners',
    description: 'Comprehensive end-to-end C++ masterclass by College Wallah. Covers syntax, conditional statements, loops, pattern printing, pointers, recursion, and arrays.',
    category: 'Core Programming',
    durationMinutes: 120,
    videoUrl: 'https://www.youtube-nocookie.com/embed/e7sAf4SbS_g',
    externalUrl: 'https://youtu.be/e7sAf4SbS_g?si=txne4EVLvzSRlNhH',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80',
    instructor: 'College Wallah (PW Skills)',
    difficulty: 'Intermediate',
    keyTakeaways: [
      'Master C++ core syntax, pointers, memory references, and recursion.',
      'Solve pattern printing, multidimensional arrays, and string algorithms.',
      'Prepare fundamental DSA concepts tested in top engineering interviews.',
    ],
    actionLink: {
      label: 'Practice Mock Interview',
      page: 'mock-interview',
    },
    isCompleted: false,
  },
];

export const fallbackInterviewQuestions: MockInterviewQuestion[] = [
  {
    id: 'q-fullstack-1',
    role: 'Full Stack Cloud Engineer',
    category: 'System Design',
    question: 'How would you architect a resilient, distributed asynchronous job queue that handles sudden 10x traffic spikes while preventing message loss?',
    context: 'The candidate should explain message brokers (Redis Streams, RabbitMQ, or SQS), idempotency keys, dead-letter queues (DLQ), and exponential backoff retry policies.',
    expectedKeywords: ['Redis', 'RabbitMQ', 'SQS', 'Idempotency', 'Dead Letter Queue', 'DLQ', 'Backoff', 'Worker', 'Concurrency', 'Scale'],
    hint: 'Mention how you guarantee at-least-once delivery semantics and handle poison pill messages.',
    difficulty: 'Mid',
    timeLimitSeconds: 180,
  },
  {
    id: 'q-fullstack-2',
    role: 'Full Stack Cloud Engineer',
    category: 'Technical Coding',
    question: 'Explain how you structure database transactions and optimistic locking in Node.js/TypeScript to prevent race conditions during concurrent account balance updates.',
    context: 'Focus on ACID guarantees, Prisma/TypeORM interactive transactions, isolation levels, or version columns.',
    expectedKeywords: ['Transaction', 'ACID', 'Isolation', 'Optimistic Locking', 'Rollback', 'Prisma', 'Race Condition', 'Version'],
    hint: 'Think about what happens when two concurrent requests read the same balance and try to decrement it simultaneously.',
    difficulty: 'Senior',
    timeLimitSeconds: 150,
  },
  {
    id: 'q-fullstack-3',
    role: 'Full Stack Cloud Engineer',
    category: 'Behavioral STAR',
    question: 'Tell me about a high-severity production bug or outage you encountered. How did you diagnose it under pressure, and what safeguards did you put in place?',
    context: 'Evaluate STAR method: Situation, Task, Action, and Result.',
    expectedKeywords: ['Situation', 'Task', 'Action', 'Result', 'Logs', 'Monitoring', 'Post-mortem', 'Safeguard', 'Impact', 'Metric'],
    hint: 'Follow the STAR structure clearly and quantify the downtime duration and recovery metric.',
    difficulty: 'Junior',
    timeLimitSeconds: 180,
  },
];

export const fallbackInterviewSessions: MockInterviewSession[] = [
  {
    id: 'session-demo-01',
    targetRole: 'Full Stack Cloud Engineer',
    category: 'System Design & STAR',
    date: '2026-04-14T15:30:00Z',
    totalQuestions: 3,
    averageScore: 84,
    feedback: {
      overallScore: 84,
      clarityScore: 88,
      technicalDepthScore: 82,
      starComplianceScore: 86,
      strengths: [
        'Clear articulation of Redis dead-letter queues and idempotency keys.',
        'Well-structured STAR responses with quantifiable downtime reduction metrics.',
      ],
      improvements: [
        'Could elaborate further on backoff jitter algorithms to prevent thundering herd problems.',
        'Mention distributed tracing (OpenTelemetry) when investigating microservice latency.',
      ],
      matchedKeywords: ['Redis', 'Dead Letter Queue', 'Idempotency', 'Monitoring', 'Post-mortem'],
      missingKeywords: ['Jitter', 'Exponential Backoff', 'OpenTelemetry'],
      modelAnswerSummary: 'Strong candidate response demonstrating production readiness and methodical troubleshooting instincts.',
      readinessVerdict: 'High Technical Competence — Recommended for Onsite Interview',
    },
  },
];

export const fallbackTalentProfiles: TalentProfile[] = [
  {
    id: 'talent-01',
    name: 'Alex Rivera (You)',
    headline: 'Full-Stack & Cloud Systems Builder | Distributed Architecture',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    targetRole: 'Full Stack Cloud Engineer',
    experienceLevel: 'Student / Senior Year',
    readinessScore: 82,
    githubUsername: 'alexrivera-dev',
    availability: 'Summer 2026 Internship',
    skills: [
      {
        name: 'TypeScript',
        level: 'Mastery',
        verifiedBy: 'GitHub AST Scan',
        evidenceSnippet: 'eventflow-distributed-queue/src/server.ts:42 (Strict types, generics, async streams)',
        confidenceScore: 94,
      },
      {
        name: 'Node.js & Express',
        level: 'Advanced',
        verifiedBy: 'GitHub AST Scan',
        evidenceSnippet: 'backend/src/controllers/jobController.ts:18 (REST endpoints, middleware)',
        confidenceScore: 90,
      },
      {
        name: 'Redis',
        level: 'Core Proficient',
        verifiedBy: 'GitHub AST Scan',
        evidenceSnippet: 'services/jobQueueService.ts:31 (Pub/Sub channels, TTL caching)',
        confidenceScore: 86,
      },
      {
        name: 'Docker & Containerization',
        level: 'Core Proficient',
        verifiedBy: 'GitHub AST Scan',
        evidenceSnippet: 'Dockerfile & docker-compose.yml (Multi-stage build)',
        confidenceScore: 88,
      },
      {
        name: 'PostgreSQL & Prisma',
        level: 'Advanced',
        verifiedBy: 'Verified Certificate',
        evidenceSnippet: 'Prisma Client migrations & relations',
        confidenceScore: 92,
      },
    ],
    certificates: [
      {
        id: 'cert-1',
        title: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        issueDate: 'Jan 2026',
        credentialUrl: 'https://aws.amazon.com/verification',
        badgeIcon: 'cloud',
      },
      {
        id: 'cert-2',
        title: 'Distributed Systems & Microservices Architecture',
        issuer: 'Coursera / Stanford Online',
        issueDate: 'Dec 2025',
        credentialUrl: 'https://coursera.org/verify',
        badgeIcon: 'server',
      },
    ],
    hackathonsCount: 4,
    projectsCount: 6,
    location: 'San Francisco, CA (Open to Remote)',
  },
  {
    id: 'talent-02',
    name: 'Priya Sharma',
    headline: 'High-Throughput Backend & Streaming Pipelines Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    targetRole: 'Distributed Systems Engineer',
    experienceLevel: 'Student / Master CS',
    readinessScore: 89,
    githubUsername: 'priyasharma-eng',
    availability: 'Immediate Full-Time',
    skills: [
      {
        name: 'Apache Kafka',
        level: 'Mastery',
        verifiedBy: 'GitHub AST Scan',
        evidenceSnippet: 'kafka-event-stream/consumer.go:112 (Partition consumer groups)',
        confidenceScore: 96,
      },
      {
        name: 'Go (Golang)',
        level: 'Mastery',
        verifiedBy: 'GitHub AST Scan',
        evidenceSnippet: 'pkg/worker/pool.go:48 (Goroutines, channels, sync.Mutex)',
        confidenceScore: 95,
      },
      {
        name: 'Kubernetes',
        level: 'Advanced',
        verifiedBy: 'Verified Certificate',
        evidenceSnippet: 'k8s/deployment.yaml (HPA, StatefulSet, Ingress)',
        confidenceScore: 91,
      },
      {
        name: 'PostgreSQL',
        level: 'Advanced',
        verifiedBy: 'Hackathon Project',
        evidenceSnippet: 'db/migrations/001_partitioning.sql',
        confidenceScore: 88,
      },
    ],
    certificates: [
      {
        id: 'cert-3',
        title: 'Certified Kubernetes Application Developer (CKAD)',
        issuer: 'Linux Foundation / CNCF',
        issueDate: 'Feb 2026',
        badgeIcon: 'box',
      },
    ],
    hackathonsCount: 5,
    projectsCount: 8,
    location: 'Seattle, WA',
  },
  {
    id: 'talent-03',
    name: 'Liam O’Connor',
    headline: 'AI Systems & LLM Infra Engineer | Vector Indexing & RAG Pipelines',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    targetRole: 'AI / ML Engineer',
    experienceLevel: 'Student / Senior',
    readinessScore: 86,
    githubUsername: 'liam-ai-dev',
    availability: 'Summer 2026 Internship',
    skills: [
      {
        name: 'Python',
        level: 'Mastery',
        verifiedBy: 'GitHub AST Scan',
        evidenceSnippet: 'rag-engine/pipeline.py:84 (PyTorch, Asyncio, FastAPI)',
        confidenceScore: 95,
      },
      {
        name: 'LangChain & LlamaIndex',
        level: 'Advanced',
        verifiedBy: 'GitHub AST Scan',
        evidenceSnippet: 'retrievers/hybrid.py:22 (Vector similarity + BM25)',
        confidenceScore: 92,
      },
      {
        name: 'Milvus / Pinecone',
        level: 'Advanced',
        verifiedBy: 'Hackathon Project',
        evidenceSnippet: 'vector_store/indexer.py:55 (HNSW indexing)',
        confidenceScore: 89,
      },
      {
        name: 'FastAPI',
        level: 'Advanced',
        verifiedBy: 'GitHub AST Scan',
        evidenceSnippet: 'api/endpoints/stream.py:19 (SSE streaming tokens)',
        confidenceScore: 91,
      },
    ],
    certificates: [
      {
        id: 'cert-4',
        title: 'Deep Learning Specialization',
        issuer: 'DeepLearning.AI',
        issueDate: 'Nov 2025',
        badgeIcon: 'cpu',
      },
    ],
    hackathonsCount: 3,
    projectsCount: 5,
    location: 'Austin, TX',
  },
  {
    id: 'talent-04',
    name: 'Chloe Kim',
    headline: 'Design Systems & High-Fidelity Interactive Frontend Architect',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    targetRole: 'Frontend UI/UX Engineer',
    experienceLevel: 'Entry Level',
    readinessScore: 91,
    githubUsername: 'chloekim-ui',
    availability: 'Immediate Full-Time',
    skills: [
      {
        name: 'React 19 & Next.js',
        level: 'Mastery',
        verifiedBy: 'GitHub AST Scan',
        evidenceSnippet: 'app/dashboard/page.tsx:34 (Server components, suspense)',
        confidenceScore: 97,
      },
      {
        name: 'Tailwind CSS',
        level: 'Mastery',
        verifiedBy: 'GitHub AST Scan',
        evidenceSnippet: 'styles/tokens.css (Custom design system variables)',
        confidenceScore: 95,
      },
      {
        name: 'TypeScript',
        level: 'Advanced',
        verifiedBy: 'GitHub AST Scan',
        evidenceSnippet: 'types/schema.ts:18 (Discriminated unions, strict lints)',
        confidenceScore: 93,
      },
      {
        name: 'Playwright E2E',
        level: 'Core Proficient',
        verifiedBy: 'GitHub AST Scan',
        evidenceSnippet: 'tests/e2e/checkout.spec.ts:12 (Flake-free test suites)',
        confidenceScore: 87,
      },
    ],
    certificates: [
      {
        id: 'cert-5',
        title: 'Meta Frontend Professional Certificate',
        issuer: 'Meta / Coursera',
        issueDate: 'Jan 2026',
        badgeIcon: 'layout',
      },
    ],
    hackathonsCount: 6,
    projectsCount: 9,
    location: 'New York, NY',
  },
];

export const fallbackRecruiterMessages: RecruiterMessage[] = [
  {
    id: 'msg-rec-1',
    senderName: 'Rachel Vance',
    senderTitle: 'Engineering Talent Partner',
    company: 'Stripe',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    studentId: 'talent-01',
    subject: 'Interview Request: Cloud Infrastructure & Distributed Queue Team',
    message: 'Hi Alex! We noticed your verified TypeScript & Redis AST proof on the Skill Matrix, specifically your eventflow-distributed-queue repository. Your handling of dead-letter queues and transaction boundaries matches our technical requirements. Would you be open for an introductory architecture round?',
    interviewType: 'Round 1 Technical Screen',
    proposedDate: 'Thursday, 3:00 PM PST',
    status: 'pending',
    sentAt: 'Yesterday, 4:15 PM',
  },
  {
    id: 'msg-rec-2',
    senderName: 'Marcus Bradley',
    senderTitle: 'Senior Tech Recruiter',
    company: 'Datadog',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80',
    studentId: 'talent-01',
    subject: 'Fast-Track Summer 2026 Backend Systems Internship',
    message: 'Hey Alex, your 82% Career Readiness Score and Docker containerization evidence caught our engineering leads attention. We would love to invite you for a 45-minute live coding screen with our Core Ingestion team.',
    interviewType: 'Full-Stack Architecture Chat',
    proposedDate: 'Friday, 11:00 AM PST',
    status: 'accepted',
    sentAt: '2 days ago',
  },
];

