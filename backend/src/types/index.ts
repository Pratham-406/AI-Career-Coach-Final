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

export interface SkillGapItem {
  skill: string;
  category: 'Frontend' | 'Backend' | 'DevOps' | 'Database' | 'System Design' | 'AI/ML' | 'Soft Skills';
  currentLevel: number; // 0-100
  targetLevel: number; // 0-100
  importance: 'Critical' | 'Recommended' | 'Bonus';
  evidenceFound: string[];
  evidenceMissing: string[];
  recommendation: string;
  learningResourceUrl?: string;
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
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  logoUrl?: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Contract' | 'Co-op';
  isRemote: boolean;
  matchScore: number; // 0-100
  salaryRange: string;
  requiredSkills: string[];
  matchingSkills: string[];
  missingSkills: string[];
  description: string;
  postedDaysAgo: number;
  applicationUrl: string;
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

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    timestamp: string;
    isMockData: boolean;
  };
}
