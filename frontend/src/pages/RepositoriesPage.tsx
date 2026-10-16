import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, fallbackRepositories } from '../services/api';
import { RepositorySummary } from '../types';
import {
  GitBranch,
  Star,
  GitFork,
  ExternalLink,
  RefreshCw,
  Plus,
  CheckCircle2,
  AlertCircle,
  Code2,
  Sparkles,
  Search,
  SlidersHorizontal,
  X,
  FileCode,
  Info,
  Radio,
  FileText,
  ShieldCheck,
  Loader2
} from 'lucide-react';

export const RepositoriesPage: React.FC = () => {
  const { user, showToast } = useAuth();
  const [repos, setRepos] = useState<RepositorySummary[]>(fallbackRepositories);
  const [isLoading, setIsLoading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  // Modal state
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Evidence Modal State
  const [evidenceModalRepo, setEvidenceModalRepo] = useState<RepositorySummary | null>(null);
  const [repoEvidences, setRepoEvidences] = useState<any[]>([]);
  const [isLoadingEvidence, setIsLoadingEvidence] = useState(false);

  useEffect(() => {
    loadRepositories();

    // Subscribe to real-time events for live updates
    const unsubscribe = api.subscribeToLiveEvents((event) => {
      if (event.type === 'SCAN_COMPLETED' || event.type === 'WEBHOOK_PUSH_RECEIVED') {
        showToast(`Repository updated via ${event.type}!`, 'info');
        loadRepositories();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadRepositories = async () => {
    setIsLoading(true);
    try {
      const data = await api.getRepositories();
      setRepos(data);
    } catch {
      setRepos(fallbackRepositories);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async (repoId: string) => {
    setAnalyzingId(repoId);
    showToast('Executing AST scanner & source code evidence extraction...', 'info');
    try {
      await api.analyzeRepository(repoId);
      showToast('Scan queued! Evidence will update automatically.', 'success');
      // Reload shortly
      setTimeout(loadRepositories, 1500);
    } catch (err: any) {
      showToast(err.message || 'Error triggering scan', 'error');
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleConnectRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoUrl) return;
    setIsConnecting(true);
    try {
      const created = await api.connectRepository(newRepoUrl);
      setRepos(prev => [created, ...prev]);
      showToast(`Connected ${created.name} & started AST scan!`, 'success');
      setNewRepoUrl('');
      setIsConnectModalOpen(false);
      setTimeout(loadRepositories, 1500);
    } catch (err: any) {
      showToast(err.message || 'Error connecting repository', 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleViewEvidence = async (repo: RepositorySummary) => {
    setEvidenceModalRepo(repo);
    setIsLoadingEvidence(true);
    try {
      const evidences = await api.getRepoEvidence(repo.id);
      setRepoEvidences(evidences);
    } catch {
      setRepoEvidences([]);
    } finally {
      setIsLoadingEvidence(false);
    }
  };

  const languages = ['all', ...Array.from(new Set(repos.map(r => r.language)))];

  const filteredRepos = repos.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.detectedSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLang = selectedLanguage === 'all' || r.language === selectedLanguage;
    return matchesSearch && matchesLang;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              GitHub Repositories
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
              Step 2 Scanner & Trigger
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real GitHub REST API inspection, dependency detection, commit SHA verification, and webhook push tracking.
          </p>
        </div>

        <button
          onClick={() => setIsConnectModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Connect Repository
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-8 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search repositories by name, detected technology, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {languages.map(l => (
                <option key={l} value={l}>
                  {l === 'all' ? 'All Languages' : l}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Repositories Grid */}
      {isLoading ? (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-500" />
          <p className="text-xs text-slate-500 mt-2">Scanning connected repositories from database...</p>
        </div>
      ) : filteredRepos.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <GitBranch className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No repositories found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Connect a GitHub repository using the button above to begin AST code scanning and evidence detection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredRepos.map((repo) => {
            const isAnalyzing = analyzingId === repo.id;

            return (
              <div
                key={repo.id}
                className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Repo Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {repo.name}
                        </h3>
                        {repo.webhookStatus === 'active' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Webhook Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Polling
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {repo.description}
                      </p>
                    </div>

                    {/* Quality Meter */}
                    <div className="text-right">
                      <div className="text-lg font-black text-brand-600 dark:text-brand-400">
                        {repo.codeQualityScore}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Quality Score</div>
                    </div>
                  </div>

                  {/* Metadata Chips: Branch & Commit SHA */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-mono text-[10px]">
                      <GitBranch className="w-3 h-3 text-slate-400" /> {repo.defaultBranch || 'main'}
                    </span>
                    {repo.latestCommitSha && (
                      <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-mono text-[10px]">
                        SHA: {repo.latestCommitSha.slice(0, 7)}
                      </span>
                    )}
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {repo.stars}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      <GitFork className="w-3 h-3 text-slate-400" /> {repo.forks}
                    </span>
                  </div>

                  {/* Detected Skills */}
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Verified Code Skills ({repo.detectedSkills.length}):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {repo.detectedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Insights Preview */}
                  {repo.insights && repo.insights.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px] space-y-1 text-slate-600 dark:text-slate-300">
                      <div className="font-semibold flex items-center gap-1 text-slate-700 dark:text-slate-200">
                        <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                        Code Evidence Insights:
                      </div>
                      <p className="line-clamp-2 italic">
                        "{repo.insights[0]}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      GitHub
                    </a>

                    <button
                      onClick={() => handleViewEvidence(repo)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      View Code Evidence
                    </button>
                  </div>

                  <button
                    onClick={() => handleAnalyze(repo.id)}
                    disabled={isAnalyzing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950 hover:bg-brand-100 text-brand-700 dark:text-brand-300 font-semibold text-xs border border-brand-200 dark:border-brand-800 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    <span>{isAnalyzing ? 'Scanning...' : 'Scan Repository'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CONNECT REPO MODAL */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-brand-500" />
                Connect GitHub Repository
              </h3>
              <button
                onClick={() => setIsConnectModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Provide any public GitHub repository URL or "owner/repo" to retrieve real file trees, commit SHAs, and source code evidence.
            </p>

            <form onSubmit={handleConnectRepo} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  GitHub Repository URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://github.com/facebook/react or owner/repo"
                  value={newRepoUrl}
                  onChange={(e) => setNewRepoUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 space-y-1">
                <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  GitHub Push Webhook Integration
                </div>
                <p>
                  Connects to the real GitHub REST API. Webhook listener endpoint is active at <code>/api/github/webhook</code> with HMAC-SHA256 signature verification.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isConnecting}
                  className="px-5 py-2 text-xs font-semibold bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  {isConnecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <GitBranch className="w-3.5 h-3.5" />}
                  Connect & Scan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW EVIDENCE DRAWER / MODAL */}
      {evidenceModalRepo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-brand-500" />
                  Verified Code Evidence — {evidenceModalRepo.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Extracted source-code artifacts with exact line numbers and commit SHA citations.
                </p>
              </div>
              <button
                onClick={() => setEvidenceModalRepo(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {isLoadingEvidence ? (
                <div className="text-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-500" />
                  <p className="text-xs text-slate-500 mt-2">Loading source-code evidence...</p>
                </div>
              ) : repoEvidences.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No concrete code evidence extracted yet. Click "Scan Repository" to run deep AST parsing.
                </div>
              ) : (
                <div className="space-y-3">
                  {repoEvidences.map((ev: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          {ev.skill}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {ev.confidence}% Confidence
                        </span>
                      </div>

                      <div className="font-mono text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <span className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                          {ev.filePath}:{ev.startLine}-{ev.endLine}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Commit: {ev.commitSha?.slice(0, 7)}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        {ev.evidenceDescription}
                      </p>

                      {ev.codeSnippet && (
                        <pre className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 text-[10px] font-mono overflow-x-auto">
                          {ev.codeSnippet}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setEvidenceModalRepo(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
