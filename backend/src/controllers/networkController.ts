import { Request, Response } from 'express';

// Seeded Talent Profiles
export const TALENT_PROFILES = [
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

// Seeded Recruiter Messages / Interview Invites sent to student
export const RECRUITER_MESSAGES = [
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

export const getTalentProfiles = async (req: Request, res: Response) => {
  const skillQuery = req.query.skill as string | undefined;
  const roleQuery = req.query.role as string | undefined;

  let results = [...TALENT_PROFILES];

  if (skillQuery) {
    const q = skillQuery.toLowerCase();
    results = results.filter((p) =>
      p.skills.some((s) => s.name.toLowerCase().includes(q))
    );
  }

  if (roleQuery) {
    const r = roleQuery.toLowerCase();
    results = results.filter((p) =>
      p.targetRole.toLowerCase().includes(r)
    );
  }

  return res.json({
    success: true,
    data: results,
    total: results.length,
  });
};

export const sendRecruiterMessage = async (req: Request, res: Response) => {
  const { studentId, company, senderName, senderTitle, subject, message, interviewType, proposedDate } = req.body;

  if (!studentId || !message) {
    return res.status(400).json({
      success: false,
      message: 'Student ID and message content are required.',
    });
  }

  const newMessage = {
    id: `msg_${Date.now()}`,
    senderName: senderName || 'Senior Tech Talent Lead',
    senderTitle: senderTitle || 'Talent Acquisition Partner',
    company: company || 'Cloud Scale Inc.',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
    studentId,
    subject: subject || 'Interview Invitation for Software Engineering Role',
    message,
    interviewType: interviewType || 'Round 1 Technical Screen',
    proposedDate: proposedDate || 'Next Tuesday at 2:00 PM',
    status: 'pending',
    sentAt: 'Just now',
  };

  RECRUITER_MESSAGES.unshift(newMessage);

  return res.json({
    success: true,
    message: 'Interview invitation sent directly to candidate inbox!',
    data: newMessage,
  });
};

export const getStudentInbox = async (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: RECRUITER_MESSAGES,
    unreadCount: RECRUITER_MESSAGES.filter((m) => m.status === 'pending').length,
  });
};

export const updateMessageStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // accepted or declined

  const msg = RECRUITER_MESSAGES.find((m) => m.id === id);
  if (!msg) {
    return res.status(404).json({ success: false, message: 'Message not found' });
  }

  msg.status = status;
  return res.json({
    success: true,
    message: `Interview invite ${status}`,
    data: msg,
  });
};

export const addStudentSkill = async (req: Request, res: Response) => {
  const { name, level, verifiedBy, evidenceSnippet } = req.body;

  const targetProfile = TALENT_PROFILES[0]; // Current user Alex Rivera
  const newSkill = {
    name,
    level: level || 'Core Proficient',
    verifiedBy: verifiedBy || 'Verified Certificate',
    evidenceSnippet: evidenceSnippet || 'Verified by AST Repository Analysis',
    confidenceScore: 90,
  };

  targetProfile.skills.push(newSkill);

  return res.json({
    success: true,
    message: 'Skill added to your Skill-First Talent Profile',
    data: newSkill,
  });
};
