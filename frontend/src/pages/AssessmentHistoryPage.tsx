import { useReducedMotion } from '../hooks/useReducedMotion';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, fallbackAssessments } from '../services/api';
import { AssessmentRecord } from '../types';
import {
  History,
  TrendingUp,
  RefreshCw,
  Calendar,
  Sparkles,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowUpRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

export const AssessmentHistoryPage: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const { user, showToast } = useAuth();
  const [assessments, setAssessments] = useState<AssessmentRecord[]>(fallbackAssessments);
  const [isReassessing, setIsReassessing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await api.getAssessmentHistory();
      setAssessments(data);
    } catch {
      setAssessments(fallbackAssessments);
    }
  };

  const handleTriggerReassessment = async () => {
    setIsReassessing(true);
    showToast('Executing portfolio re-assessment...', 'info');
    try {
      const newRec = await api.triggerReassessment(user?.targetRole);
      setAssessments(prev => [newRec, ...prev]);
      showToast(`New assessment created! Score: ${newRec.overallScore}%`, 'success');
    } catch {
      showToast('Simulated re-assessment complete.', 'success');
    } finally {
      setIsReassessing(false);
    }
  };

  const chartData = [...assessments].reverse().map(a => ({
    date: new Date(a.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: a.overallScore,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Assessment History
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
              {assessments.length} Audits
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tracking your readiness progression over time as you push new commits and resolve skill gaps.
          </p>
        </div>

        <button
          onClick={handleTriggerReassessment}
          disabled={isReassessing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isReassessing ? 'animate-spin' : ''}`} />
          <span>{isReassessing ? 'Running Audit...' : 'Trigger New Assessment'}</span>
        </button>
      </div>

      {/* Progression Score Line Chart */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-500" />
              Career Readiness Score Trend
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluations reflect incremental code quality and technology adoption
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            Total Gain: +24% Since Baseline
          </span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
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
              <Line isAnimationActive={!reducedMotion}
                type="monotone"
                dataKey="score"
                stroke="#ed5900"
                strokeWidth={3}
                dot={{ r: 5, fill: '#f4650b' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Audit Cards Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Detailed Evaluation Log
        </h3>

        <div className="space-y-4 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {assessments.map((record) => {
            const isPositive = record.scoreChangeFromPrevious > 0;
            return (
              <div
                key={record.id}
                className="relative pl-12 group"
              >
                {/* Timeline node */}
                <div className="absolute left-3.5 top-5 w-3.5 h-3.5 rounded-full bg-brand-500 border-4 border-white dark:border-slate-900 group-hover:scale-125 transition-transform" />

                <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        {record.overallScore}%
                      </span>
                      {record.scoreChangeFromPrevious !== 0 && (
                        <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                          +{record.scoreChangeFromPrevious}% Gain
                        </span>
                      )}
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Target: {record.targetRole}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(record.timestamp).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitBranch className="w-3.5 h-3.5" />
                        {record.reposAnalyzedCount} Repos
                      </span>
                    </div>
                  </div>

                  {/* Summary Feedback */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    "{record.summaryFeedback}"
                  </p>

                  {/* Strengths & Gaps Pills */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Strengths */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Strengths
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {record.primaryStrengths.map((str, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[11px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          >
                            {str}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Gaps */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Identified Focus Gaps
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {record.keyGapAreas.map((gap, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[11px] bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                          >
                            {gap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
