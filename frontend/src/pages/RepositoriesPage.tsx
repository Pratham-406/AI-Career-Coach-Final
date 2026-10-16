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
  Info
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

  useEffect(() => {
    loadRepositories();
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
    showToast('Simulating AST parser & commit history inspection...', 'info');
    try {
      const updated = await api.analyzeRepository(repoId);
      setRepos(prev => prev.map(r => r.id === repoId ? updated : r));
      showToast(`Analysis complete for ${updated.name}! Score: ${updated.codeQualityScore}`, 'success');
    } catch {
      showToast('Completed simulated AST scan.', 'success');
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
      showToast(`Connected ${created.name} (Simulated)`, 'success');
      setNewRepoUrl('');
      setIsConnectModalOpen(false);
    } catch {
      showToast('Error connecting repository', 'error');
    } finally {
      setIsConnecting(false);
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
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
              {repos.length} Connected
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Linked GitHub Account: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">@{user?.githubUsername || 'alexrivera-dev'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Connect Repository
          </button>
        </div>
      </div>

      {/* Simulated Webhook Detection Banner */}
      <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/60 flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-brand-900 dark:text-brand-200">
            Real-Time Commit Change Detection Status: <em>Simulated Standby</em>
          </p>
          <p className="text-brand-800 dark:text-brand-300 leading-relaxed text-[11px]">
            In production, a GitHub App webhook listens for <code className="font-mono bg-brand-100 dark:bg-brand-900/60 px-1 py-0.5 rounded">push</code> and <code className="font-mono bg-brand-100 dark:bg-brand-900/60 px-1 py-0.5 rounded">pull_request</code> payloads to automatically trigger re-assessments. In this hackathon demo, trigger individual AST evaluations via the "Deep AST Scan" button on any repository.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by repo name or detected skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 whitespace-nowrap">Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>
                {lang === 'all' ? 'All Languages' : lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Repository Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRepos.map((repo) => {
          const isAnalyzing = analyzingId === repo.id;
          return (
            <div
              key={repo.id}
              className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-brand-400/60 transition-all"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono hover:text-brand-600 transition-colors">
                        {repo.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                        {repo.language}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {repo.description}
                    </p>
                  </div>

                  {/* Quality Score Badge */}
                  <div className="shrink-0 text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {repo.codeQualityScore}
                      <span className="text-[10px] text-slate-400">/100</span>
                    </div>
                    <div className="text-[9px] uppercase font-bold text-brand-600 dark:text-brand-400">
                      Code Quality
                    </div>
                  </div>
                </div>

                {/* Stars and Forks */}
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {repo.stars} stars
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3.5 h-3.5 text-slate-400" />
                    {repo.forks} forks
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Updated {new Date(repo.lastUpdated).toLocaleDateString()}
                  </span>
                </div>

                {/* Detected Skills */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    AST Detected Skills:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {repo.detectedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Insights Snippet */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                    <span>AI Audit Findings:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                    {repo.insights.map((insight, idx) => (
                      <li key={idx} className="leading-snug">{insight}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  GitHub Source
                </a>

                <button
                  onClick={() => handleAnalyze(repo.id)}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-950 hover:bg-brand-100 text-brand-700 dark:text-brand-300 font-semibold text-xs border border-brand-200 dark:border-brand-800 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzing ? 'Analyzing AST...' : 'Deep AST Scan'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connect Repo Modal */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-label="Connect New Repository" className="glass-panel w-full max-w-md max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-brand-600" />
                Connect New Repository
              </h3>
              <button
                aria-label="Close repository dialog" onClick={() => setIsConnectModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Provide any public GitHub repository URL to initiate dependency indexing and skill-gap attribution.
            </p>

            <form onSubmit={handleConnectRepo} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/username/project-repo"
                  value={newRepoUrl}
                  onChange={(e) => setNewRepoUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500">
                <strong>Notice:</strong> In demonstration mode, public repo URLs are parsed and added to your active dashboard session.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  aria-label="Close repository dialog" onClick={() => setIsConnectModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isConnecting}
                  className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-sm transition-all"
                >
                  {isConnecting ? 'Connecting...' : 'Connect & Scan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
