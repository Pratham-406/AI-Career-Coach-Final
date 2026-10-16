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
  Target,
  Plus,
  Link as LinkIcon,
  FileText,
  Loader2,
  ShieldAlert
} from 'lucide-react';

export const JobDiscoveryPage: React.FC = () => {
  const { showToast, setCurrentPage } = useAuth();
  const [jobs, setJobs] = useState<JobPosting[]>(fallbackJobs);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [remoteOnly, setRemoteOnly] = useState(false);

  // Detail Modal State
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [activeTargetJobId, setActiveTargetJobId] = useState<string>(() => {
    return localStorage.getItem('selected_target_job_id') || '';
  });

  // Ingest Modal State
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [ingestTab, setIngestTab] = useState<'url' | 'paste'>('url');
  const [inputUrl, setInputUrl] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const [inputCompany, setInputCompany] = useState('');
  const [inputText, setInputText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedPreview, setExtractedPreview] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
    showToast(`Application submitted to ${job.company} for ${job.title}!`, 'success');
    if (selectedJob?.id === job.id) {
      setSelectedJob(null);
    }
  };

  const handleSelectTarget = (job: JobPosting) => {
    setActiveTargetJobId(job.id);
    localStorage.setItem('selected_target_job_id', job.id);
    localStorage.setItem('selected_target_job_title', job.title);
    showToast(`Target job set to "${job.title}" at ${job.company}!`, 'success');
  };

  const handleExtractRequirements = async () => {
    if (ingestTab === 'url' && !inputUrl.trim()) {
      showToast('Please provide a valid job posting URL', 'warning');
      return;
    }
    if (ingestTab === 'paste' && (!inputText.trim() || inputText.length < 20)) {
      showToast('Please paste at least 20 characters of job description text', 'warning');
      return;
    }

    setIsExtracting(true);
    try {
      const data = await api.ingestJob({
        url: ingestTab === 'url' ? inputUrl.trim() : undefined,
        text: ingestTab === 'paste' ? inputText.trim() : undefined,
        title: inputTitle.trim() || undefined,
        company: inputCompany.trim() || undefined,
      });
      setExtractedPreview(data);
      showToast(`Extracted ${data.requirements?.length || 0} technical requirements from source!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to extract requirements. Try pasting the text manually.', 'error');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSaveIngestedJob = async () => {
    if (!extractedPreview) return;
    setIsSaving(true);
    try {
      const saved = await api.createJob({
        title: extractedPreview.title,
        company: extractedPreview.company,
        description: extractedPreview.description,
        sourceUrl: extractedPreview.sourceUrl,
        sourceType: extractedPreview.sourceType,
        location: extractedPreview.location,
        type: extractedPreview.type,
        salary: extractedPreview.salary,
        requiredSkills: extractedPreview.detectedSkills,
        requirements: extractedPreview.requirements,
      });

      showToast(`Job "${saved.title}" saved to your database!`, 'success');
      handleSelectTarget(saved);
      setIsIngestModalOpen(false);
      setExtractedPreview(null);
      setInputUrl('');
      setInputText('');
      loadJobs();
    } catch (err: any) {
      showToast(err.message || 'Error saving job posting', 'error');
    } finally {
      setIsSaving(false);
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
              Step 1 Ingestion
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Import real internship or job postings, record source-linked requirements, and set target roles for code gap assessment.
          </p>
        </div>

        <button
          onClick={() => {
            setIsIngestModalOpen(true);
            setExtractedPreview(null);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Import / Ingest Job Posting
        </button>
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
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time</option>
              <option value="Contract">Contract</option>
              <option value="Co-op">Co-op</option>
            </select>
          </div>

          {/* Remote Toggle */}
          <div className="md:col-span-3 flex items-center justify-between sm:justify-end gap-2">
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="rounded border-slate-300 text-brand-500 focus:ring-brand-500"
              />
              Remote Only
            </label>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {isLoading ? (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-500" />
          <p className="text-xs text-slate-500 mt-2">Loading verified job postings from database...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No job postings found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria, or import a real job URL or description using the button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => {
            const isApplied = appliedJobIds.includes(job.id);
            const isTarget = activeTargetJobId === job.id;

            return (
              <div
                key={job.id}
                className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isTarget
                    ? 'border-brand-500 shadow-md ring-1 ring-brand-500 bg-brand-50/20 dark:bg-brand-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <IdentityImage
                        alt={job.company}
                        src={job.logoUrl || job.companyLogo || ''}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Building className="w-3 h-3" /> {job.company}
                        </p>
                      </div>
                    </div>

                    {isTarget && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500 text-white shadow-xs">
                        Target Role
                      </span>
                    )}
                  </div>

                  {/* Metadata Pills */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      <MapPin className="w-3 h-3 text-slate-400" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      <Briefcase className="w-3 h-3 text-slate-400" /> {job.type}
                    </span>
                    {(job.salaryRange || job.salary) && (
                      <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        <DollarSign className="w-3 h-3 text-slate-400" /> {job.salaryRange || job.salary}
                      </span>
                    )}
                  </div>

                  {/* Description Excerpt */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {job.description}
                  </p>

                  {/* Skills Section */}
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Extracted Requirements ({job.requiredSkills?.length || 0})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(job.requiredSkills || []).slice(0, 5).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {(job.requiredSkills?.length || 0) > 5 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                          +{job.requiredSkills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleSelectTarget(job)}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      isTarget
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Target className="w-3.5 h-3.5" />
                    {isTarget ? 'Selected Target' : 'Select Target'}
                  </button>

                  <button
                    onClick={() => setSelectedJob(job)}
                    className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* JOB INGESTION MODAL */}
      {isIngestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-500" />
                  Step 1 — Ingest Job Posting & Requirements
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Import a real internship/job listing and extract verifiable source-linked technical requirements.
                </p>
              </div>
              <button
                onClick={() => setIsIngestModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Tab Selector */}
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  onClick={() => setIngestTab('url')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    ingestTab === 'url'
                      ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  Import from URL
                </button>
                <button
                  onClick={() => setIngestTab('paste')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    ingestTab === 'paste'
                      ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Paste Job Description
                </button>
              </div>

              {/* Form Inputs */}
              {ingestTab === 'url' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Public Job Posting URL <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://careers.google.com/jobs/results/... or https://jobs.lever.co/..."
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      If the website blocks external automated scrapers, switch to "Paste Job Description" tab.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Backend Cloud Engineer Intern"
                        value={inputTitle}
                        onChange={(e) => setInputTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Stripe, Datadog"
                        value={inputCompany}
                        onChange={(e) => setInputCompany(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Job Description Text <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Paste the full job responsibilities and technical qualifications text here..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleExtractRequirements}
                disabled={isExtracting}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white flex items-center justify-center gap-2 transition-colors"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Extracting Technical Requirements...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Extract Technical Requirements
                  </>
                )}
              </button>

              {/* Extracted Preview Section */}
              {extractedPreview && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {extractedPreview.title} — {extractedPreview.company}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {extractedPreview.location} • {extractedPreview.type}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {extractedPreview.requirements?.length || 0} Requirements Identified
                    </span>
                  </div>

                  {/* Requirements List */}
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {(extractedPreview.requirements || []).map((req: any, index: number) => (
                      <div
                        key={index}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {req.skill}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              req.importance === 'Critical'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {req.importance}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          {req.description}
                        </p>
                        {req.sourceExcerpt && (
                          <p className="text-[10px] text-slate-400 italic">
                            Source: "{req.sourceExcerpt}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsIngestModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900"
              >
                Cancel
              </button>
              {extractedPreview && (
                <button
                  onClick={handleSaveIngestedJob}
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white flex items-center gap-1.5"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Save Job & Set as Target
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* JOB DETAILS MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedJob.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedJob.company} • {selectedJob.location}
                </p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">About the Role</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedJob.requiredSkills || []).map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  handleSelectTarget(selectedJob);
                  setSelectedJob(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Set as Target Role
              </button>

              <button
                onClick={() => handleApply(selectedJob)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
