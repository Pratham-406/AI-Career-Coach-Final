import { IdentityImage } from './IdentityImage';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Page } from '../types';
import {
  Compass,
  GitBranch,
  Search,
  BrainCircuit,
  History,
  CreditCard,
  User,
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  Video,
  Mic,
  Users,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, currentPage, setCurrentPage, isDarkMode, toggleDarkMode, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems: { label: string; page: Page; icon: React.ReactNode }[] = [
    { label: 'Dashboard', page: 'dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Repositories', page: 'repositories', icon: <GitBranch className="w-4 h-4" /> },
    { label: 'Job Discovery', page: 'jobs', icon: <Search className="w-4 h-4" /> },
    { label: 'Skill Gap', page: 'skill-gap', icon: <BrainCircuit className="w-4 h-4" /> },
    { label: 'Mock Interview', page: 'mock-interview', icon: <Mic className="w-4 h-4 text-emerald-500" /> },
    { label: 'Skills Network', page: 'network', icon: <Users className="w-4 h-4 text-indigo-500" /> },
    { label: 'Tutorials', page: 'tutorials', icon: <Video className="w-4 h-4 text-brand-500" /> },
    { label: 'History', page: 'history', icon: <History className="w-4 h-4" /> },
  ];

  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="site-header sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="brand-mark"><Compass className="w-5 h-5" /></div>
            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">AI Career Coach</span>
          </button>

          {/* Desktop Navigation Links */}
          {currentPage === 'landing' && <nav aria-label="About the product" className="marketing-nav hidden lg:flex"><a href="#how-it-works">How it works</a><a href="#evidence">Evidence</a><a href="#capabilities">Capabilities</a></nav>}
          <nav aria-label="Application" className={`${currentPage === 'landing' ? 'hidden' : 'hidden xl:flex'} items-center space-x-1`}>
            {navItems.map((item) => {
              const active = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/80 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & User Control */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600 hover:rotate-12 transition-transform" />
              )}
            </button>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  aria-label="Account menu" aria-expanded={userDropdownOpen}
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all focus:outline-none"
                >
                  <IdentityImage
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-brand-400"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden md:inline">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-brand-500 text-white font-bold uppercase hidden md:inline">
                    {user.plan}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs">
                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-medium">
                        <Sparkles className="w-3 h-3" />
                        <span>Score: {user.careerReadinessScore}% Ready</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNavClick('profile')}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-200"
                    >
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        Profile & Target Role
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button
                      onClick={() => handleNavClick('pricing')}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-200"
                    >
                      <span className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-slate-400" />
                        Billing & Subscription
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                    <button
                      onClick={logout}
                      className="w-full text-left px-3.5 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('auth')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all shadow-brand-500/20"
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation" aria-expanded={mobileMenuOpen}
              className={`${currentPage === 'landing' ? '' : 'xl:hidden'} p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 pt-2 pb-5 space-y-1">
          {navItems.map((item) => {
            const active = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => handleNavClick('profile')}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <User className="w-4 h-4 text-brand-500" />
              Profile & Settings
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
