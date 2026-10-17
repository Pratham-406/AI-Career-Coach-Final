import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Mail,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Eye,
  EyeOff,
  BrainCircuit,
  Mic,
  Users,
  GitBranch,
  CheckCircle2,
} from 'lucide-react';

const SHOWCASE_SLIDES = [
  {
    title: 'AST Code Evidence Engine',
    subtitle: 'Scan GitHub repositories for real code AST proofs instead of resume buzzwords.',
    icon: <BrainCircuit className="w-8 h-8 text-brand-500" />,
    badge: '94% Confidence Verification',
    stat: '7+ Skills Verified from AST',
    color: 'from-amber-500/20 to-orange-500/20',
  },
  {
    title: 'Interactive AI Mock Interviews',
    subtitle: 'Practice with voice readout, live webcam preview, and instant STAR scoring.',
    icon: <Mic className="w-8 h-8 text-emerald-500" />,
    badge: 'Real-Time Voice & Scoring',
    stat: '84/100 Readiness Verdict',
    color: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    title: 'Skills-Only Talent Matrix',
    subtitle: 'No LinkedIn corporate noise. Companies message candidates strictly based on proven skills.',
    icon: <Users className="w-8 h-8 text-blue-500" />,
    badge: 'Direct Company Outreach',
    stat: 'Stripe & Datadog Invites',
    color: 'from-blue-500/20 to-indigo-500/20',
  },
  {
    title: 'Automated GitHub Sync',
    subtitle: 'Track webhook push events and automatically recalculate career readiness.',
    icon: <GitBranch className="w-8 h-8 text-purple-500" />,
    badge: 'Live SSE Feed Active',
    stat: '82% Career Readiness Score',
    color: 'from-purple-500/20 to-pink-500/20',
  },
];

export const AuthPage: React.FC = () => {
  const { login, register, loginAsDemo } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  // Form states
  const [email, setEmail] = useState('alex.rivera@cs.university.edu');
  const [password, setPassword] = useState('Password123!');
  const [name, setName] = useState('Alex Rivera');
  const [targetRole, setTargetRole] = useState('Full Stack Cloud Engineer');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-rotate showcase frames
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await register(name, email, targetRole, password);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleJudgeStudentLogin = async () => {
    setIsLoading(true);
    try {
      await loginAsDemo('student');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJudgeRecruiterLogin = async () => {
    setIsLoading(true);
    try {
      await loginAsDemo('recruiter');
    } finally {
      setIsLoading(false);
    }
  };

  const currentSlideData = SHOWCASE_SLIDES[activeSlide];

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Column: Instagram-Style Smartphone Mockup & App Feature Showcase */}
        <div className="hidden lg:flex lg:col-span-7 flex-col items-center justify-center relative select-none">
          {/* Back Phone Frame (Slanted / Depth Effect) */}
          <div className="absolute -left-4 top-6 w-[280px] h-[540px] rounded-[44px] bg-slate-200 dark:bg-slate-900 border-[7px] border-slate-300 dark:border-slate-800 shadow-2xl opacity-60 transform -rotate-6 blur-[0.5px] pointer-events-none p-4 flex flex-col justify-between">
            <div className="w-24 h-4 bg-slate-300 dark:bg-slate-800 rounded-full mx-auto" />
            <div className="space-y-3 opacity-40">
              <div className="h-20 rounded-2xl bg-brand-500/20" />
              <div className="h-10 rounded-xl bg-slate-300 dark:bg-slate-700" />
              <div className="h-10 rounded-xl bg-slate-300 dark:bg-slate-700" />
            </div>
            <div className="w-16 h-1 bg-slate-300 dark:bg-slate-800 rounded-full mx-auto" />
          </div>

          {/* Front Primary Smartphone Frame (Instagram Showcase Style) */}
          <div className="relative w-[320px] h-[580px] rounded-[48px] bg-white dark:bg-slate-900 border-[8px] border-slate-800 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col justify-between p-5 z-10">
            {/* Phone Speaker Notch */}
            <div className="flex justify-center mb-3">
              <div className="w-24 h-4 bg-slate-800 dark:bg-slate-800 rounded-full flex items-center justify-center gap-2">
                <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              </div>
            </div>

            {/* In-Phone App Preview Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold tracking-tight text-slate-900 dark:text-white">
                  AI Career Coach
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Demo
              </span>
            </div>

            {/* In-Phone Sliding Card Content */}
            <div className="flex-1 flex flex-col justify-center py-4 space-y-4">
              <div className={`p-5 rounded-2xl bg-gradient-to-br ${currentSlideData.color} border border-slate-200/80 dark:border-slate-800 transition-all duration-500 transform`}>
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center mb-3">
                  {currentSlideData.icon}
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-brand-600 dark:text-brand-400">
                  {currentSlideData.badge}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {currentSlideData.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {currentSlideData.subtitle}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-100">
                  <span>Verified Metric:</span>
                  <span className="text-brand-600 dark:text-brand-400">{currentSlideData.stat}</span>
                </div>
              </div>

              {/* Slider Dots */}
              <div className="flex justify-center gap-1.5 pt-2">
                {SHOWCASE_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === activeSlide
                        ? 'w-6 bg-brand-600'
                        : 'w-1.5 bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* In-Phone Bottom Home Bar */}
            <div className="pt-2 text-center">
              <div className="w-24 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />
            </div>
          </div>
        </div>

        {/* Right Column: Instagram-Style Authentication Card */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto space-y-4">
          
          {/* Main Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-xl space-y-5">
            {/* Instagram-style Logo Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-brand-600 to-rose-500 text-white shadow-md shadow-brand-500/25 mb-1">
                <Compass className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                AI Career Coach
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {isLoginMode
                  ? 'Sign in to access your skills, mock interviews & recruiter inbox'
                  : 'Join the skill-first portfolio platform & close your career gaps'}
              </p>
            </div>

            {/* Judge 1-Click Instant Sign-In Area */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Judge Evaluation (1-Click)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleJudgeStudentLogin}
                  disabled={isLoading}
                  className="py-2 px-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-[11px] shadow-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Student (Alex)</span>
                </button>
                <button
                  type="button"
                  onClick={handleJudgeRecruiterLogin}
                  disabled={isLoading}
                  className="py-2 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold text-[11px] shadow-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                >
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Recruiter (Stripe)</span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Or
              </span>
            </div>

            {/* Instagram-style input form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {!isLoginMode && (
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or student username"
                  className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-white"
                />
              </div>

              {!isLoginMode && (
                <div>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-white"
                  >
                    <option value="Full Stack Cloud Engineer">Full Stack Cloud Engineer</option>
                    <option value="Distributed Systems Engineer">Distributed Systems Engineer</option>
                    <option value="AI / ML Engineer">AI / ML Engineer</option>
                    <option value="Frontend UI/UX Engineer">Frontend UI/UX Engineer</option>
                  </select>
                </div>
              )}

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{isLoginMode ? 'Log In' : 'Sign Up'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Security notice */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Bcrypt Hash + JWT Authentication Guard Active</span>
            </div>
          </div>

          {/* Bottom Card (Instagram Style Toggle Box) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center text-xs">
            {isLoginMode ? (
              <p className="text-slate-600 dark:text-slate-300">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLoginMode(false)}
                  className="font-bold text-brand-600 dark:text-brand-400 hover:underline ml-1"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-slate-600 dark:text-slate-300">
                Have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLoginMode(true)}
                  className="font-bold text-brand-600 dark:text-brand-400 hover:underline ml-1"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
