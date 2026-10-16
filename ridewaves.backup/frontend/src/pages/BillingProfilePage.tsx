import { IdentityImage } from '../components/IdentityImage';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, fallbackInvoices } from '../services/api';
import { Invoice } from '../types';
import {
  User,
  CreditCard,
  Mail,
  Briefcase,
  Award,
  Save,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Shield,
  Sparkles
} from 'lucide-react';
import { GitHubIcon } from '../components/GitHubIcon';

export const BillingProfilePage: React.FC = () => {
  const { user, updateUser, showToast, setCurrentPage } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>(fallbackInvoices);

  // Form states
  const [name, setName] = useState(user?.name || 'Alex Rivera');
  const [email, setEmail] = useState(user?.email || 'alex.rivera@cs.university.edu');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Full Stack Cloud Engineer');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Student');
  const [githubUsername, setGithubUsername] = useState(user?.githubUsername || 'alexrivera-dev');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const data = await api.getInvoices();
      setInvoices(data);
    } catch {
      setInvoices(fallbackInvoices);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUser({
        name,
        targetRole,
        experienceLevel: experienceLevel as any,
        githubUsername,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelSubscription = async () => {
    showToast('Simulating subscription cancellation request...', 'info');
    try {
      await api.cancelSubscription();
      showToast('Auto-renewal cancelled effective at end of billing cycle.', 'info');
    } catch {
      showToast('Subscription updated.', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Billing & Candidate Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your career target parameters, connected portfolio handles, and active subscription.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Settings (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <IdentityImage
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500 shadow-md"
            />
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{email}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-300">
                  Plan: {user?.plan || 'pro'}
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Readiness: {user?.careerReadinessScore || 82}%
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Full Stack Cloud Engineer">Full Stack Cloud Engineer</option>
                    <option value="Distributed Systems Engineer">Distributed Systems Engineer</option>
                    <option value="AI / ML Engineer">AI / ML Engineer</option>
                    <option value="DevOps & Platform Engineer">DevOps & Platform Engineer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Experience Tier
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Student">Current Student / Undergraduate</option>
                  <option value="Entry">Entry-Level (0-2 YOE)</option>
                  <option value="Mid">Mid-Level (2-4 YOE)</option>
                  <option value="Senior">Senior (5+ YOE)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                GitHub Handle
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <GitHubIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  placeholder="github-username"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Active Plan & Billing Management (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Plan Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-500" />
                Active Subscription
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Active
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-brand-600 text-white space-y-3 shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs uppercase font-bold tracking-wider text-brand-100">
                    Current Plan
                  </div>
                  <div className="text-xl font-extrabold">
                    {user?.plan === 'campus'
                      ? 'Campus Partner'
                      : user?.plan === 'pro'
                      ? 'Career Accelerator Pro'
                      : 'Explorer (Free)'}
                  </div>
                </div>
                <span className="text-xl font-bold">
                  {user?.plan === 'free' ? '$0' : '$12/mo'}
                </span>
              </div>
              <p className="text-[11px] text-brand-100">
                Unlimited AST repo audits, job ranking, and evidence citations enabled.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setCurrentPage('pricing')}
                className="flex-1 py-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-semibold text-xs border border-brand-200 dark:border-brand-800 hover:bg-brand-100 transition-colors"
              >
                Change Tier
              </button>
              <button
                onClick={handleCancelSubscription}
                className="py-2 px-3 rounded-xl text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 font-medium text-xs transition-colors"
              >
                Cancel Renewal
              </button>
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white">
              Payment Gateway Information
            </h4>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span className="font-mono">Visa ending in •••• 4242</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-600">Test Card</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Payments are in test sandbox mode. No real credit card transactions are billed.
            </p>
          </div>
        </div>
      </div>

      {/* Invoice History Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Billing History & Receipts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Download invoices and audit simulated transaction history
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Invoice #</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Plan Description</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {invoices.map((inv) => (
                <tr key={inv.id} className="text-slate-700 dark:text-slate-300">
                  <td className="py-3 font-mono font-medium">{inv.id}</td>
                  <td className="py-3 text-slate-500">{inv.date}</td>
                  <td className="py-3 font-medium text-slate-900 dark:text-white">{inv.plan}</td>
                  <td className="py-3 font-semibold">{inv.amount}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => showToast(`Downloaded receipt for ${inv.id} (Demo PDF)`, 'info')}
                      className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
