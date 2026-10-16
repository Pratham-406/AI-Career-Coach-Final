import { useReducedMotion } from '../hooks/useReducedMotion';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, fallbackUser } from '../services/api';
import {
  Compass,
  GitBranch,
  Search,
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Target,
  ShieldCheck,
  Zap,
  Code2,
  FileCheck
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const { user, setCurrentPage, showToast } = useAuth();
  const [isReassessing, setIsReassessing] = useState(false);
  const [readinessScore, setReadinessScore] = useState(user?.careerReadinessScore || 82);

  // Radar data comparing student current skills vs target benchmark
  const radarData = [
    { category: 'Backend Architecture', student: 85, benchmark: 85, fullMark: 100 },
    { category: 'DevOps & Containers', student: 65, benchmark: 90, fullMark: 100 },
    { category: 'Database & Caching', student: 88, benchmark: 80, fullMark: 100 },
    { category: 'Frontend & UI', student: 78, benchmark: 75, fullMark: 100 },
    { category: 'System Design', student: 78, benchmark: 85, fullMark: 100 },
    { category: 'Automated Testing', student: 55, benchmark: 80, fullMark: 100 },
  ];

  // Progression history data
  const historyData = [
    { date: 'Jan 20', score: 58 },
    { date: 'Feb 18', score: 68 },
    { date: 'Mar 15', score: 76 },
    { date: 'Apr 12', score: 82 },
  ];

  const handleRunReassessment = async () => {
    setIsReassessing(true);
    showToast('Running simulated AI AST scan across connected repositories...', 'info');
    try {
      const res = await api.triggerReassessment(user?.targetRole);
      setReadinessScore(res.overallScore);
      showToast(`Re-assessment complete! Readiness score updated to ${res.overallScore}%`, 'success');
    } catch {
      setReadinessScore(prev => Math.min(100, prev + 2));
      showToast('Simulated AST scan complete (+2 score gain)', 'success');
    } finally {
      setIsReassessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome & Target Role Hero */}
      <div className="rounded-3xl bg-brand-600 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Target Role: {user?.targetRole || 'Full Stack Cloud Engineer'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Alex Rivera'}
            </h1>
            <p className="text-brand-100 text-xs sm:text-sm max-w-xl">
              Your connected repositories have been indexed. 4 repos analyzed with 18 detected engineering competencies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunReassessment}
              disabled={isReassessing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-brand-700 hover:bg-brand-50 font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-75"
            >
              <RefreshCw className={`w-4 h-4 ${isReassessing ? 'animate-spin' : ''}`} />
              <span>{isReassessing ? 'Scanning AST...' : 'Run Re-Assessment'}</span>
            </button>
            <button
              onClick={() => setCurrentPage('skill-gap')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-black/20 hover:bg-black/30 border border-white/20 text-white font-semibold text-xs transition-colors"
            >
              <span>View Gaps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1: Readiness Score */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Career Readiness</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {readinessScore}%
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              +6% this month
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-700"
              style={{ width: `${readinessScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Threshold for interview shortlisting: 80%
          </p>
        </div>

        {/* Stat 2: Verified Repositories */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Connected Repositories</span>
            <span className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <GitBranch className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">4</span>
            <span className="text-xs font-medium text-slate-500">All scanned</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Primary languages: TypeScript, Go, Python
          </p>
          <button
            onClick={() => setCurrentPage('repositories')}
            className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            Manage repositories →
          </button>
        </div>

        {/* Stat 3: Identified Skill Gaps */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Critical Skill Gaps</span>
            <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-500">2</span>
            <span className="text-xs font-medium text-slate-500">DevOps & Testing</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Kubernetes manifests & Playwright E2E tests
          </p>
          <button
            onClick={() => setCurrentPage('skill-gap')}
            className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            Inspect evidence breakdown →
          </button>
        </div>

        {/* Stat 4: Matching Jobs */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Matching Openings</span>
            <span className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <Search className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">14</span>
            <span className="text-xs font-semibold text-emerald-600">85%+ Compatibility</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            New listings at CloudScale & Starlight
          </p>
          <button
            onClick={() => setCurrentPage('jobs')}
            className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            Explore open jobs →
          </button>
        </div>
      </div>

      {/* Visual Analytics Grid: Radar Chart + Progression Line */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-brand-500" />
                Portfolio Competency vs Role Target
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visualizing your verified codebase skills against industry benchmark standards
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400">
                <span className="w-3 h-3 rounded-full bg-brand-500" />
                Your Level
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
                Benchmark
              </span>
            </div>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                <PolarGrid stroke="#948575" strokeDasharray="3 3" opacity={0.3} />
                <PolarAngleAxis tickFormatter={(value: string) => ({ "Backend Architecture": "Backend", "DevOps & Containers": "DevOps", "Database & Caching": "Database", "Frontend & UI": "Frontend", "System Design": "Design", "Automated Testing": "Testing" }[value] || value)} dataKey="category" tick={{ fill: '#776b5e', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar isAnimationActive={!reducedMotion}
                  name="Your Codebase"
                  dataKey="student"
                  stroke="#ed5900"
                  fill="#f4650b"
                  fillOpacity={0.5}
                />
                <Radar isAnimationActive={!reducedMotion}
                  name="Target Benchmark"
                  dataKey="benchmark"
                  stroke="#948575"
                  fill="#d0c2b2"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Readiness Progression Area Chart */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Readiness Score History
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Progression over consecutive repository evaluations
            </p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f4650b" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#f4650b" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#776b5e' }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#776b5e' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#211c17',
                    border: '1px solid #493f35',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area isAnimationActive={!reducedMotion} type="monotone" dataKey="score" stroke="#ed5900" strokeWidth={3} fillOpacity={1} fill="url(#scoreGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3.5 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <p className="font-semibold text-brand-900 dark:text-brand-200">Assessment Archive</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">4 evaluations on record</p>
            </div>
            <button
              onClick={() => setCurrentPage('history')}
              className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              View Full History →
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Action Items */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Recommended High-Impact Portfolio Actions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Actions predicted to yield the highest increase in recruiter interview rates
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('skill-gap')}
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            All Action Items →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Action 1 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4 hover:border-brand-500 transition-colors">
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Critical Gap • +4% Score
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-slate-600 dark:text-slate-300">
                  DevOps
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Add Kubernetes Deployment Manifests
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Your <span className="font-semibold">eventflow-distributed-queue</span> repository contains Dockerfiles, but lacks Helm charts or Kubernetes YAML manifests required by 82% of cloud roles.
              </p>
              <div className="pt-1 flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage('skill-gap')}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  View Evidence & Guide →
                </button>
              </div>
            </div>
          </div>

          {/* Action 2 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4 hover:border-brand-500 transition-colors">
            <div className="p-3 rounded-xl bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-400 shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Recommended • +3% Score
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-slate-600 dark:text-slate-300">
                  Testing
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Implement Automated Playwright E2E Tests
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Add 2 to 3 end-to-end browser tests to <span className="font-semibold">campus-connect-platform</span> to demonstrate end-to-end reliability.
              </p>
              <div className="pt-1 flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage('skill-gap')}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  View Evidence & Guide →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
