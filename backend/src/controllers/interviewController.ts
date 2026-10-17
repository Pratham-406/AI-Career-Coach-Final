import { Request, Response } from 'express';

export interface QuestionTemplate {
  id: string;
  role: string;
  category: 'System Design' | 'Technical Coding' | 'Behavioral STAR';
  question: string;
  context: string;
  expectedKeywords: string[];
  hint: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  timeLimitSeconds: number;
}

const QUESTION_BANK: QuestionTemplate[] = [
  {
    id: 'q-fullstack-1',
    role: 'Full Stack Cloud Engineer',
    category: 'System Design',
    question: 'How would you architect a resilient, distributed asynchronous job queue that handles sudden 10x traffic spikes while preventing message loss?',
    context: 'The candidate should explain message brokers (Redis Streams, RabbitMQ, or SQS), idempotency keys, dead-letter queues (DLQ), and exponential backoff retry policies.',
    expectedKeywords: ['Redis', 'RabbitMQ', 'SQS', 'Idempotency', 'Dead Letter Queue', 'DLQ', 'Backoff', 'Worker', 'Concurrency', 'Scale'],
    hint: 'Mention how you guarantee at-least-once or exactly-once delivery semantics and handle poison pill messages.',
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
    context: 'Evaluate STAR method: Situation (outage impact), Task (immediate mitigation), Action (root cause analysis with logs/metrics), Result (post-mortem and automated monitoring).',
    expectedKeywords: ['Situation', 'Task', 'Action', 'Result', 'Logs', 'Monitoring', 'Post-mortem', 'Safeguard', 'Impact', 'Metric'],
    hint: 'Follow the STAR structure clearly and quantify the downtime duration and recovery metric.',
    difficulty: 'Junior',
    timeLimitSeconds: 180,
  },
  {
    id: 'q-backend-1',
    role: 'Distributed Systems Engineer',
    category: 'System Design',
    question: 'How do you design a globally distributed cache invalidation strategy ensuring eventual consistency across multiple AWS regions?',
    context: 'Examine CDN edge caches, Redis Cluster replication lag, cache-aside vs write-through patterns, and TTL with bloom filters.',
    expectedKeywords: ['Cache-aside', 'Write-through', 'Replication', 'TTL', 'Eventual Consistency', 'Bloom Filter', 'Invalidation', 'CDN'],
    hint: 'Discuss the trade-offs between stale reads and elevated database query load.',
    difficulty: 'Senior',
    timeLimitSeconds: 180,
  },
  {
    id: 'q-ai-1',
    role: 'AI / ML Engineer',
    category: 'System Design',
    question: 'Design an end-to-end RAG (Retrieval Augmented Generation) pipeline that minimizes hallucination and provides verifiable source citations in sub-200ms.',
    context: 'Cover vector embeddings, chunking strategies, hybrid search (BM25 + Dense vector), reranking, and citation metadata mapping.',
    expectedKeywords: ['Vector', 'Embedding', 'RAG', 'Chunking', 'Hybrid Search', 'Reranking', 'Hallucination', 'Latency', 'Cosine'],
    hint: 'Address how chunk size and reranker models impact generation accuracy and response latency.',
    difficulty: 'Senior',
    timeLimitSeconds: 180,
  },
  {
    id: 'q-frontend-1',
    role: 'Frontend UI/UX Engineer',
    category: 'Technical Coding',
    question: 'How do you optimize critical rendering paths and prevent large React application re-renders across deeply nested tree components?',
    context: 'Look for understanding of React Profiler, useMemo/useCallback boundaries, virtualized lists (windowing), and Web Vitals (LCP, INP, CLS).',
    expectedKeywords: ['Profiler', 'useMemo', 'useCallback', 'Virtualization', 'Web Vitals', 'LCP', 'INP', 'Re-render', 'Memoization'],
    hint: 'Explain how component state localization avoids triggering re-renders in sibling and ancestor trees.',
    difficulty: 'Mid',
    timeLimitSeconds: 150,
  },
];

// In-memory mock interview sessions store
const SAVED_SESSIONS: any[] = [
  {
    id: 'session-demo-01',
    targetRole: 'Full Stack Cloud Engineer',
    category: 'System Design & STAR',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
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

export const getQuestions = async (req: Request, res: Response) => {
  const role = (req.query.role as string) || 'Full Stack Cloud Engineer';
  const category = req.query.category as string | undefined;

  let filtered = QUESTION_BANK.filter((q) =>
    role.toLowerCase().includes(q.role.toLowerCase()) || q.role.toLowerCase().includes(role.toLowerCase())
  );

  if (filtered.length === 0) {
    filtered = QUESTION_BANK.slice(0, 3);
  }

  if (category) {
    const byCat = filtered.filter((q) => q.category.toLowerCase() === category.toLowerCase());
    if (byCat.length > 0) filtered = byCat;
  }

  return res.json({
    success: true,
    data: filtered,
  });
};

export const evaluateAnswer = async (req: Request, res: Response) => {
  const { questionId, answer, role } = req.body;

  if (!answer || answer.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a substantive answer (at least 10 characters).',
    });
  }

  const question = QUESTION_BANK.find((q) => q.id === questionId) || QUESTION_BANK[0];
  const lowerAnswer = answer.toLowerCase();

  // Keyword Matching
  const matched = question.expectedKeywords.filter((k) =>
    lowerAnswer.includes(k.toLowerCase())
  );
  const missing = question.expectedKeywords.filter(
    (k) => !lowerAnswer.includes(k.toLowerCase())
  );

  const keywordRatio = matched.length / question.expectedKeywords.length;
  const wordCount = answer.trim().split(/\s+/).length;

  // Realistically compute scores
  let technicalDepthScore = Math.min(95, Math.max(55, Math.round(50 + keywordRatio * 45)));
  if (wordCount > 70) technicalDepthScore = Math.min(98, technicalDepthScore + 5);

  let clarityScore = Math.min(96, Math.max(60, Math.round(65 + Math.min(wordCount, 120) * 0.25)));
  let starComplianceScore = 75;

  if (
    lowerAnswer.includes('situation') ||
    lowerAnswer.includes('when') ||
    lowerAnswer.includes('we noticed') ||
    lowerAnswer.includes('first')
  ) {
    starComplianceScore += 10;
  }
  if (
    lowerAnswer.includes('result') ||
    lowerAnswer.includes('reduced') ||
    lowerAnswer.includes('improved') ||
    lowerAnswer.includes('%')
  ) {
    starComplianceScore += 10;
  }
  starComplianceScore = Math.min(95, starComplianceScore);

  const overallScore = Math.round(
    technicalDepthScore * 0.45 + clarityScore * 0.25 + starComplianceScore * 0.3
  );

  const strengths = [
    `Demonstrated active grasp of ${matched.slice(0, 3).join(', ') || 'core principles'}.`,
    wordCount > 50
      ? 'Thorough and detailed explanation covering real architectural trade-offs.'
      : 'Direct and concise communication.',
  ];

  const improvements: string[] = [];
  if (missing.length > 0) {
    improvements.push(`Consider addressing: ${missing.slice(0, 3).join(', ')}.`);
  }
  if (wordCount < 40) {
    improvements.push('Expand your answer with specific production metrics and architectural trade-offs.');
  } else {
    improvements.push('Conclude with concrete impact metrics (e.g. latency reduced by 40%, zero dropped jobs).');
  }

  let verdict = 'Good Potential — Ready with targeted practice';
  if (overallScore >= 85) {
    verdict = 'Outstanding Candidate — Ready for Onsite Round';
  } else if (overallScore >= 75) {
    verdict = 'Strong Candidate — Ready for Technical Screening';
  }

  const evaluation = {
    overallScore,
    clarityScore,
    technicalDepthScore,
    starComplianceScore,
    strengths,
    improvements,
    matchedKeywords: matched,
    missingKeywords: missing,
    modelAnswerSummary: `A top-percentile response would integrate: ${question.expectedKeywords.join(', ')}. Contextualize with real-world failure modes and recovery telemetry.`,
    readinessVerdict: verdict,
  };

  return res.json({
    success: true,
    evaluation,
  });
};

export const saveSession = async (req: Request, res: Response) => {
  const { targetRole, category, totalQuestions, averageScore, feedback } = req.body;
  const newSession = {
    id: `session_${Date.now()}`,
    targetRole: targetRole || 'Full Stack Cloud Engineer',
    category: category || 'System Design',
    date: new Date().toISOString(),
    totalQuestions: totalQuestions || 1,
    averageScore: averageScore || 80,
    feedback,
  };

  SAVED_SESSIONS.unshift(newSession);

  return res.json({
    success: true,
    message: 'Interview session saved',
    session: newSession,
  });
};

export const getHistory = async (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: SAVED_SESSIONS,
  });
};
