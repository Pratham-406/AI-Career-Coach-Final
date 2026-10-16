import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, fallbackPricingPlans } from '../services/api';
import { PricingPlan } from '../types';
import {
  CreditCard,
  Check,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  Building2,
  GraduationCap,
  ArrowRight,
  Info
} from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { user, updateUser, showToast, setCurrentPage } = useAuth();
  const [plans, setPlans] = useState<PricingPlan[]>(fallbackPricingPlans);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [subscribingId, setSubscribingId] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await api.getPricingPlans();
      setPlans(data);
    } catch {
      setPlans(fallbackPricingPlans);
    }
  };

  const handleSelectPlan = async (plan: PricingPlan) => {
    setSubscribingId(plan.id);
    showToast(`Initiating simulated checkout for ${plan.name}...`, 'info');
    try {
      const res = await api.createCheckoutSession(plan.id, billingCycle);
      await updateUser({ plan: plan.id as any });
      showToast(`Successfully upgraded to ${plan.name}! (Simulated Subscription)`, 'success');
      setCurrentPage('profile');
    } catch {
      showToast('Completed simulated plan upgrade.', 'success');
      await updateUser({ plan: plan.id as any });
      setCurrentPage('profile');
    } finally {
      setSubscribingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>Flexible Plans for Students & Campuses</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Invest in your engineering career
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Unlock unlimited repository AST indexing, evidence-backed gap recommendations, and direct matching with top tech recruiters.
        </p>

        {/* Billing Cycle Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
            Monthly Billing
          </span>
          <button
            aria-label="Annual billing" role="switch" aria-checked={billingCycle === 'annual'}
            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
            className="w-12 h-6 rounded-full bg-brand-600 p-0.5 transition-colors relative focus:outline-none"
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === 'annual' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
            <span>Annual Billing</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
              Save 30%
            </span>
          </span>
        </div>
      </div>

      {/* Simulated Payment Notice */}
      <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/60 flex items-start gap-3 text-xs text-brand-900 dark:text-brand-200">
        <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">Simulated Stripe Payment Gateway</p>
          <p className="text-[11px] text-brand-800 dark:text-brand-300 leading-relaxed">
            In this hackathon build, clicking any tier button triggers a mock checkout session. Your active account will immediately update to the chosen tier without requesting credit card numbers.
          </p>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const isCurrentPlan = user?.plan === plan.id;
          const isPro = plan.popular;
          const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;
          const period = billingCycle === 'annual' ? '/yr' : '/mo';

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 relative ${
                isPro
                  ? 'bg-white dark:bg-slate-900 border-2 border-brand-500 shadow-xl shadow-brand-500/10 scale-105 z-10'
                  : 'glass-panel border border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px]">
                    {plan.tagline}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                    ${price}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">{period}</span>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrentPlan || subscribingId === plan.id}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 ${
                    isCurrentPlan
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-default'
                      : isPro
                      ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25'
                      : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900'
                  }`}
                >
                  {subscribingId === plan.id ? (
                    <span>Processing...</span>
                  ) : isCurrentPlan ? (
                    <span>Active Current Plan</span>
                  ) : (
                    <>
                      <span>Upgrade to {plan.name.split(' ')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                {/* Features List */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Included Features:
                  </span>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] leading-relaxed">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                    {plan.unavailableFeatures?.map((unfeat, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-slate-400 line-through leading-relaxed">
                        <X className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
                        <span>{unfeat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 text-[10px] text-slate-400 text-center">
                Cancel or switch plans anytime.
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Cards */}
      <div className="max-w-4xl mx-auto pt-8 space-y-6">
        <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white">Does AI Career Coach store my source code?</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              No. Our scanner only evaluates public repository AST syntaxes, dependency manifests (package.json, Dockerfiles), and test configs in ephemeral memory.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white">Are university discounts available?</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              Yes! Students registering with a verified .edu email address automatically receive 30% off Pro tiers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
