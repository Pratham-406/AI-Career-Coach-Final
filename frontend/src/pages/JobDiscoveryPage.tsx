import { IdentityImage } from '../components/IdentityImage';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, fallbackJobs } from '../services/api';
import { JobPosting } from '../types';
import {
  Search,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  ExternalLink,
  SlidersHorizontal,
  Bookmark,
  Share2,
  X,
  Send,
  Building,
  Target
} from 'lucide-react';

export const JobDiscoveryPage: React.FC = () => {
  const { showToast } = useAuth();
  const [jobs, setJobs] = useState<JobPosting[]>(fallbackJobs);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [remoteOnly, setRemoteOnly] = useState(false);

  // Detail Modal State
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  useEffect(() => {
    loadJobs();
  }, [searchQuery, selectedType, remoteOnly]);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const data = await api.getJobs({
        search: searchQuery || undefined,
        type: selectedType === 'all' ? undefined : selectedType,
        remote: remoteOnly ? true : undefined,
      });
      setJobs(data);
    } catch {
      setJobs(fallbackJobs);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (job: JobPosting) => {
    setAppliedJobIds(prev => [...prev, job.id]);
    showToast(`Application submitted to ${job.company} for ${job.title}! (Simulated Apply)`, 'success');
    if (selectedJob?.id === job.id) {
      setSelectedJob(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Job & Internship Discovery
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              AI Matched
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Curated engineering positions automatically ranked by compatibility with your verified code evidence.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by job title, company, or required skill (e.g. Go, Docker)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Type Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Employment Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Co-op">Co-op</option>
            </select>
          </div>

          {/* Remote Toggle */}
          <div className="md:col-span-3 flex items-center justify-end">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
              />
              <span>Remote Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Jobs Listing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => {
          const isApplied = appliedJobIds.includes(job.id);
          return (
            <div
              key={job.id}
              className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-5 hover:border-brand-500/60 transition-all"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <IdentityImage
                      src={job.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'}
                      alt={job.company}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white hover:text-brand-600 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.company}</span>
                      </div>
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div className="shrink-0 flex flex-col items-end">
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {job.matchScore}% Match
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Codebase Alignment</span>
                  </div>
                </div>

                {/* Meta row: Location, type, salary, time */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {job.type}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    {job.salaryRange}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {job.postedDaysAgo}d ago
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {job.description}
                </p>

                {/* Matching vs Missing Skills Breakdown */}
                <div className="space-y-2 pt-1">
                  {/* Verified matching */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified In Your Codebase ({job.matchingSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.matchingSkills.map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing skills */}
                  {job.missingSkills.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Gaps to Close ({job.missingSkills.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {job.missingSkills.map(skill => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setSelectedJob(job)}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                >
                  View Details & Evidence →
                </button>

                <button
                  onClick={() => handleApply(job)}
                  disabled={isApplied}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                    isApplied
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200'
                      : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20'
                  }`}
                >
                  {isApplied ? 'Application Sent' : 'Quick Apply (Demo)'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-label="Job details" className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <IdentityImage
                  src={selectedJob.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'}
                  alt={selectedJob.company}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedJob.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {selectedJob.company} • {selectedJob.location}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Match Highlight Box */}
            <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900/60 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-brand-900 dark:text-brand-200">
                  {selectedJob.matchScore}% Match for Alex Rivera
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Your public repositories satisfy {selectedJob.matchingSkills.length} of {selectedJob.requiredSkills.length} required skill competencies.
                </p>
              </div>
              <span className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">
                {selectedJob.matchScore}%
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Position Overview
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedJob.description}
              </p>
            </div>

            {/* How to bridge the gap */}
            {selectedJob.missingSkills.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2">
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Recommended Pre-Application Boost
                </h4>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                  Before sending your application, consider implementing a basic <strong>{selectedJob.missingSkills.join(' or ')}</strong> feature in one of your repositories. Doing so is projected to increase your interview match rate to 95%+.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => handleApply(selectedJob)}
                disabled={appliedJobIds.includes(selectedJob.id)}
                className="px-5 py-2.5 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{appliedJobIds.includes(selectedJob.id) ? 'Application Submitted' : 'Submit Candidate Application'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
