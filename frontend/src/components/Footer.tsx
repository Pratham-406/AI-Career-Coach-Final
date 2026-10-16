import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Compass, Shield, Terminal, Heart } from 'lucide-react';
import { Page } from '../types';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useAuth();

  const navigate = (p: Page) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-xs transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base">
                AI Career Coach
              </span>
            </div>
            <p className="leading-relaxed text-slate-500 dark:text-slate-400">
              Evidence-based AI skill analysis for software engineering students. Transforming GitHub commits into proven career readiness.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300">
              <Terminal className="w-3.5 h-3.5 text-brand-500" />
              <span>Full-Stack Hackathon Edition</span>
            </div>
          </div>

          {/* Platform Pages */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('dashboard')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Student Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate('repositories')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  GitHub Repositories
                </button>
              </li>
              <li>
                <button onClick={() => navigate('jobs')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Job & Internship Discovery
                </button>
              </li>
              <li>
                <button onClick={() => navigate('skill-gap')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  AI Skill-Gap & Evidence
                </button>
              </li>
            </ul>
          </div>

          {/* Verification & Account */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Auditing & Account
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('history')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Assessment History
                </button>
              </li>
              <li>
                <button onClick={() => navigate('pricing')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Subscription Plans
                </button>
              </li>
              <li>
                <button onClick={() => navigate('profile')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Billing & Career Goals
                </button>
              </li>
              <li>
                <button onClick={() => navigate('auth')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Sign In / Register
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture & Notice */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
              Architecture & Transparency
            </h4>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-[11px] leading-relaxed">
              <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200 mb-1">
                <Shield className="w-3.5 h-3.5 text-brand-500" />
                <span>Simulated Integrations</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                GitHub AST parsing, job ranking algorithms, and Stripe checkout are wired to mock REST controllers for evaluation safety.
              </p>
            </div>
            <p className="text-[11px] text-slate-400">
              Built with React, TypeScript, Express, Vite & Tailwind CSS.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© 2026 AI Career Coach. Built for Hackathon Demonstration.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for computer science students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
