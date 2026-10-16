export type Page =
  | 'landing'
  | 'auth'
  | 'dashboard'
  | 'repositories'
  | 'jobs'
  | 'skill-gap'
  | 'history'
  | 'pricing'
  | 'profile';

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
