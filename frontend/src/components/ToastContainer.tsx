import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAuth();

  if (toasts.length === 0) return null;

  return (
    <div role="status" aria-live="polite" className="fixed bottom-5 right-4 left-4 sm:left-auto z-50 flex flex-col gap-2 sm:max-w-sm max-h-[45vh] overflow-y-auto pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          error: <XCircle className="w-5 h-5 text-rose-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-brand-500 shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/90 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-100',
          warning: 'border-amber-200 dark:border-amber-900/60 bg-amber-50/90 dark:bg-amber-950/90 text-amber-900 dark:text-amber-100',
          error: 'border-rose-200 dark:border-rose-900/60 bg-rose-50/90 dark:bg-rose-950/90 text-rose-900 dark:text-rose-100',
          info: 'border-brand-200 dark:border-brand-900/60 bg-brand-50/90 dark:bg-brand-950/90 text-brand-900 dark:text-brand-100',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-slide-in ${borders[toast.type]}`}
          >
            <div className="flex items-center gap-2.5">
              {icons[toast.type]}
              <p className="text-xs font-medium leading-relaxed">{toast.message}</p>
            </div>
            <button
              aria-label="Dismiss notification" onClick={() => removeToast(toast.id)}
              className="p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
