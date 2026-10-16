import { useReducedMotion } from '../hooks/useReducedMotion';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, fallbackSkillGaps } from '../services/api';
import { SkillGapItem, JobPosting } from '../types';
import {
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  BookOpen,
  Sparkles,
  ExternalLink,
  Target,
  ArrowRight,
  Filter,
  Check,
  Code2,
  Zap,
  Info,
  RefreshCw,
  FileText,
  TrendingUp,
  Loader2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const SkillGapPage: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const { user, showToast } = useAuth();
  const [skillGaps, setSkillGaps] = useState<SkillGapItem[]>(fallbackSkillGaps);
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Full Stack Cloud Engineer');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImportance, setSelectedImportance] = useState<string>('all');
  const [readinessScore, setReadinessScore] = useState<number>(82);
  const [isReassessing, setIsReassessing] = useState(false);
  const [lastDiff, setLastDiff] = useState<number | null>(null);

  // Active target job
  const [targetJobTitle, setTargetJobTitle] = useState(() => {
    return localStorage.getItem('selected_target_job_title') || 'Full Stack Cloud Engineer Intern';
  });
  const [targetJobId, setTargetJobId] = useState(() => {
    return localStorage.getItem('selected_target_job_id') || '';
  });

  useEffect(() => {
    loadGaps();

    // Subscribe to SSE updates
    const unsubscribe = api.subscribeToLiveEvents((event) => {
      if (event.type === 'REASSESSMENT_UPDATED') {
        showToast('Live assessment snapshot received from GitHub push webhook!', 'info');
        loadGaps();
      }
    });

    return () => unsubscribe();
  }, [targetRole, targetJobId]);

  const loadGaps = async () => {
    try {
      const data = await api.getSkillGapAnalysis(targetRole);
      if (data && data.skillGaps && data.skillGaps.length > 0) {
        setSkillGaps(data.skillGaps);
        setReadinessScore(data.readinessScore);
      }
    } catch {
      setSkillGaps(fallbackSkillGaps);
    }
  };

  const handleTriggerReassess = async () => {
    setIsReassessing(true);
    showToast('Comparing repository code evidence against target requirements...', 'info');
    try {
      const outcome = await api.triggerReassessment(targetRole, targetJobId || undefined);
      setLastDiff(outcome.scoreChangeFromPrevious);
      setReadinessScore(outcome.overallScore);
      showToast(
        `Re-assessment finished: Overall score is ${outcome.overallScore}% (${outcome.scoreChangeFromPrevious >= 0 ? '+' : ''}${outcome.scoreChangeFromPrevious}%)`,
        'success'
      );
      loadGaps();
    } catch (err: any) {
      showToast(err.message || 'Error triggering reassessment', 'error');
    } finally {
      setIsReassessing(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(skillGaps.map(g => g.category)))];

  const filteredGaps = skillGaps.filter(g => {
    const matchesCat = selectedCategory === 'all' || g.category === selectedCategory;
    const matchesImp = selectedImportance === 'all' || g.importance === selectedImportance;
    return matchesCat && matchesImp;
  });

  // Chart data comparing current level vs target level
  const chartData = filteredGaps.map(g => ({
    name: g.skill.length > 18 ? g.skill.substring(0, 16) + '...' : g.skill,
    current: g.currentLevel,
    target: g.targetLevel,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              AI Skill-Gap Analysis
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Step 3 & 5 Evaluation
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Comparing verified GitHub AST code evidence against job requirements to pinpoint concrete hiring gaps.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleTriggerReassess}
            disabled={isReassessing}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReassessing ? 'animate-spin' : ''}`} />
            <span>{isReassessing ? 'Re-assessing Evidence...' : 'Re-assess Portfolio'}</span>
          </button>
        </div>
      </div>

      {/* Target Job Context Banner */}
      <div className="glass-panel p-4 rounded-2xl border border-brand-200 dark:border-brand-900/50 bg-brand-50/20 dark:bg-brand-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 tracking-wider">
              Evaluating Against Target Job
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {targetJobTitle}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-400">Current Evidence Readiness</span>
            <div className="text-lg font-black text-slate-900 dark:text-white flex items-center justify-end gap-1.5">
              <span>{readinessScore}%</span>
              {lastDiff !== null && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${lastDiff >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {lastDiff >= 0 ? `+${lastDiff}%` : `${lastDiff}%`}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Chart Comparison */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Skill Coverage vs Industry Target Benchmark
            </h3>
            <p className="text-xs text-slate-500">
              Transparent evidence scores calculated directly from repository scans.
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="current" name="Your Code Evidence Level (%)" fill="#f97316" radius={[4, 4, 0, 0]} isAnimationActive={!reducedMotion} />
              <Bar dataKey="target" name="Target Requirement Standard (%)" fill="#94a3b8" radius={[4, 4, 0, 0]} isAnimationActive={!reducedMotion} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              {cat === 'all' ? 'All Competency Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skill Gap Cards */}
      <div className="space-y-4">
        {filteredGaps.map((item) => {
          const status = item.evidenceStatus || (item.currentLevel >= 80 ? 'Strong Evidence' : item.currentLevel >= 50 ? 'Partial Evidence' : 'No Evidence');
          const isStrong = status === 'Strong Evidence';
          const isPartial = status === 'Partial Evidence';
          const isNone = status === 'No Evidence';

          return (
            <div
              key={item.skill}
              className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 hover:border-brand-200 transition-all"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                      isStrong
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : isPartial
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {isStrong ? <CheckCircle2 className="w-5 h-5" /> : isPartial ? <AlertTriangle className="w-5 h-5" /> : <BrainCircuit className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.skill}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isStrong
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : isPartial
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {status}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.importance}
                      </span>
                    </div>
                    {item.codeReference && (
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5 flex items-center gap-1">
                        <FileCode2 className="w-3 h-3 text-brand-500" />
                        Evidence: {item.codeReference}
                      </p>
                    )}
                  </div>
                </div>

                {/* Score Ratio Progress */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.currentLevel} / {item.targetLevel}%
                    </span>
                    <p className="text-[10px] text-slate-400">Readiness Score</p>
                  </div>
                  <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isStrong ? 'bg-emerald-500' : isPartial ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${Math.min(100, item.currentLevel)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Reason & Recommendation Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-brand-500" />
                    Evidence Analysis:
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.reason || (item.evidenceFound && item.evidenceFound[0]) || 'Analyzed against connected code repositories.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                    Recommended Action:
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.recommendation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
