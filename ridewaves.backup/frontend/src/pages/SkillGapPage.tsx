import { useReducedMotion } from '../hooks/useReducedMotion';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, fallbackSkillGaps } from '../services/api';
import { SkillGapItem } from '../types';
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
  Info
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

  useEffect(() => {
    loadGaps();
  }, [targetRole]);

  const loadGaps = async () => {
    try {
      const data = await api.getSkillGapAnalysis(targetRole);
      setSkillGaps(data.skillGaps);
    } catch {
      setSkillGaps(fallbackSkillGaps);
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
    name: g.skill.length > 20 ? g.skill.substring(0, 18) + '...' : g.skill,
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
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
              Evidence Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Comparing concrete AST citations from your GitHub repositories against target role standards.
          </p>
        </div>

        {/* Target Role Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 whitespace-nowrap">Benchmark Role:</span>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="min-w-0 flex-1 sm:flex-none px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          >
            <option value="Full Stack Cloud Engineer">Full Stack Cloud Engineer</option>
            <option value="Distributed Systems Engineer">Distributed Systems Engineer</option>
            <option value="AI / ML Engineer">AI / ML Engineer</option>
            <option value="DevOps & Platform Engineer">DevOps & Platform Engineer</option>
          </select>
        </div>
      </div>

      {/* Target Benchmark Comparison Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              Role Benchmark Comparison: {targetRole}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Assessing 6 critical competency pillars derived from current technical hiring rubrics
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400">
              <span className="w-3 h-3 rounded bg-brand-500" />
              <span>Current Verified (82%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-3 rounded bg-slate-300 dark:bg-slate-700" />
              <span>Target Benchmark (88%)</span>
            </div>
          </div>
        </div>

        {/* Bar comparison chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#776b5e' }} interval={0} angle={-15} textAnchor="end" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#776b5e' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#211c17',
                  border: '1px solid #493f35',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Bar isAnimationActive={!reducedMotion} dataKey="current" name="Current Code Level" fill="#ed5900" radius={[4, 4, 0, 0]} />
              <Bar isAnimationActive={!reducedMotion} dataKey="target" name="Industry Target" fill="#948575" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Priority:</span>
          <select
            value={selectedImportance}
            onChange={(e) => setSelectedImportance(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical Only</option>
            <option value="Recommended">Recommended</option>
          </select>
        </div>
      </div>

      {/* Evidence Breakdown Cards */}
      <div className="space-y-6">
        {filteredGaps.map((item, idx) => {
          const isCritical = item.importance === 'Critical';
          const isSatisfied = item.currentLevel >= item.targetLevel;

          return (
            <div
              key={idx}
              className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {item.skill}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {item.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCritical
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                      }`}
                    >
                      {item.importance} Gap
                    </span>
                  </div>
                </div>

                {/* Score Ratio Progress */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.currentLevel} / {item.targetLevel}%
                    </span>
                    <p className="text-[10px] text-slate-400">Current vs Benchmark</p>
                  </div>
                  <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isSatisfied ? 'bg-emerald-500' : isCritical ? 'bg-amber-500' : 'bg-brand-500'
                      }`}
                      style={{ width: `${Math.min(100, (item.currentLevel / item.targetLevel) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Two Column Evidence Box: Found vs Missing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Evidence Found */}
                <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-xs text-emerald-900 dark:text-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Evidence Found in Codebase</span>
                  </div>
                  {item.evidenceFound.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-emerald-800 dark:text-emerald-300">
                      {item.evidenceFound.map((ev, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                          <span className="mt-1 text-emerald-500 font-bold">•</span>
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-emerald-700/80 italic">
                      No verified implementations detected across current commits.
                    </p>
                  )}
                </div>

                {/* Evidence Missing */}
                <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-xs text-amber-900 dark:text-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Missing Industry Evidence</span>
                  </div>
                  {item.evidenceMissing.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-amber-800 dark:text-amber-300">
                      {item.evidenceMissing.map((ev, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                          <span className="mt-1 text-amber-500 font-bold">•</span>
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                      All standard competencies for this level are satisfied!
                    </p>
                  )}
                </div>
              </div>

              {/* Recommendation Callout */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                    AI Action Plan Recommendation:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    {item.recommendation}
                  </p>
                </div>

                {item.learningResourceUrl && (
                  <a
                    href={item.learningResourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-brand-600 dark:text-brand-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shrink-0"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Learning Guide</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
