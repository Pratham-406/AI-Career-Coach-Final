export type Page =
  | 'landing'
  | 'auth'
  | 'dashboard'
  | 'repositories'
  | 'jobs'
  | 'skill-gap'
  | 'history'
  | 'pricing'
  | 'profile'
  | 'tutorials'
  | 'mock-interview'
  | 'network';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  targetRole: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Student';
  githubUsername?: string;
  careerReadinessScore: number;
  plan: 'free' | 'pro' | 'campus';
  createdAt: string;
}

export interface RepositorySummary {
  id: string;
  name: string;
  description: string;
  htmlUrl: string;
  language: string;
  stars: number;
  forks: number;
  openIssues: number;
  lastUpdated: string;
  codeQualityScore: number;
  detectedSkills: string[];
  aiAnalysisStatus: 'analyzed' | 'pending' | 'queued' | 'needs_reassessment';
  insights: string[];
  defaultBranch?: string;
  latestCommitSha?: string;
  webhookStatus?: string;
  evidencesCount?: number;
}

export interface SkillGapItem {
  skill: string;
  category: 'Frontend' | 'Backend' | 'DevOps' | 'Database' | 'System Design' | 'AI/ML' | 'Soft Skills' | string;
  currentLevel: number; // 0-100
  targetLevel: number; // 0-100
  importance: 'Critical' | 'Recommended' | 'Bonus';
  evidenceFound?: string[];
  evidenceMissing?: string[];
  recommendation: string;
  learningResourceUrl?: string;
  evidenceStatus?: 'Strong Evidence' | 'Partial Evidence' | 'No Evidence' | 'Not Evaluated';
  codeReference?: string;
  supportingFilePath?: string;
  actionItems?: string[];
  reason?: string;
}

export interface JobRequirement {
  id: string;
  jobId: string;
  requiredSkill: string;
  description: string;
  importance: 'Critical' | 'Recommended' | 'Bonus';
  sourceExcerpt?: string;
  sourceReference?: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  logoUrl?: string;
  companyLogo?: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Contract' | 'Co-op' | string;
  isRemote: boolean;
  matchScore: number;
  salaryRange?: string;
  salary?: string;
  requiredSkills: string[];
  matchingSkills?: string[];
  missingSkills?: string[];
  description: string;
  postedDaysAgo?: number;
  applicationUrl?: string;
  sourceUrl?: string;
  sourceType?: string;
  requirements?: JobRequirement[];
}

export interface AssessmentRecord {
  id: string;
  timestamp: string;
  overallScore: number;
  targetRole: string;
  reposAnalyzedCount: number;
  primaryStrengths: string[];
  keyGapAreas: string[];
  scoreChangeFromPrevious: number;
  summaryFeedback: string;
}

export interface PricingPlan {
  id: 'free' | 'pro' | 'campus';
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  badge?: string;
  popular?: boolean;
  features: string[];
  unavailableFeatures?: string[];
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  plan: string;
  status: string;
  pdfUrl: string;
}

// Tutorial Video Interfaces
export interface TutorialVideo {
  id: string;
  title: string;
  description: string;
  category: 'Core Programming' | 'Platform Walkthrough' | 'GitHub Code Quality' | 'Interview Mastery' | 'Skill Networking' | string;
  durationMinutes: number | string;
  videoUrl: string;
  externalUrl?: string;
  thumbnailUrl: string;
  instructor: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  keyTakeaways: string[];
  actionLink?: {
    label: string;
    page: Page;
  };
  isCompleted?: boolean;
}

// AI Mock Interview Interfaces
export interface MockInterviewQuestion {
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

export interface InterviewEvaluation {
  overallScore: number;
  clarityScore: number;
  technicalDepthScore: number;
  starComplianceScore: number;
  strengths: string[];
  improvements: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  modelAnswerSummary: string;
  readinessVerdict: string;
}

export interface MockInterviewSession {
  id: string;
  targetRole: string;
  category: string;
  date: string;
  totalQuestions: number;
  averageScore: number;
  feedback: InterviewEvaluation;
}

// Skill-First Talent Network Interfaces
export interface VerifiedSkillBadge {
  name: string;
  level: 'Core Proficient' | 'Advanced' | 'Mastery';
  verifiedBy: 'GitHub AST Scan' | 'Verified Certificate' | 'Hackathon Project';
  evidenceSnippet?: string;
  confidenceScore: number;
}

export interface StudentCertificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  badgeIcon: string;
}

export interface TalentProfile {
  id: string;
  name: string;
  headline: string;
  avatarUrl: string;
  targetRole: string;
  experienceLevel: string;
  readinessScore: number;
  githubUsername: string;
  availability: 'Immediate Full-Time' | 'Summer 2026 Internship' | 'Contract / Freelance' | 'Open to Offers';
  skills: VerifiedSkillBadge[];
  certificates: StudentCertificate[];
  hackathonsCount: number;
  projectsCount: number;
  location: string;
}

export interface RecruiterMessage {
  id: string;
  senderName: string;
  senderTitle: string;
  company: string;
  companyLogo: string;
  studentId: string;
  subject: string;
  message: string;
  interviewType: 'Round 1 Technical Screen' | 'Full-Stack Architecture Chat' | 'Behavioral & Culture Fit' | 'Informal Connect';
  proposedDate?: string;
  status: 'pending' | 'accepted' | 'declined';
  sentAt: string;
}

