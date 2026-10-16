import React, { useState } from 'react';
import { AlertCircle, X, ShieldAlert, Sparkles } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-brand-50 dark:bg-slate-900 border-b border-brand-200 dark:border-brand-900/60 text-xs py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-brand-300">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            Hackathon Showcase
          </span>
          <span className="hidden sm:inline text-slate-600 dark:text-slate-400">
            <strong>Demonstration Mode:</strong> All repository AST scans, skill evidence citations, and Stripe checkouts are simulated with realistic datasets. Automatic GitHub webhook detection is in test mode.
          </span>
          <span className="sm:hidden text-slate-600 dark:text-slate-400">
            Hackathon Demo: Integrations are simulated.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
          title="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
