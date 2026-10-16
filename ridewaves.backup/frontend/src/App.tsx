import React, { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { RepositoriesPage } from './pages/RepositoriesPage';
import { JobDiscoveryPage } from './pages/JobDiscoveryPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { AssessmentHistoryPage } from './pages/AssessmentHistoryPage';
import { PricingPage } from './pages/PricingPage';
import { BillingProfilePage } from './pages/BillingProfilePage';

export const AppContent: React.FC = () => {
  const { currentPage } = useAuth();

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [currentPage]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'auth':
        return <AuthPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'repositories':
        return <RepositoriesPage />;
      case 'jobs':
        return <JobDiscoveryPage />;
      case 'skill-gap':
        return <SkillGapPage />;
      case 'history':
        return <AssessmentHistoryPage />;
      case 'pricing':
        return <PricingPage />;
      case 'profile':
        return <BillingProfilePage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <DisclaimerBanner />
      <Navbar />
      <main id="main-content" className={`flex-1 pb-12 page-${currentPage}`} >
        {renderCurrentPage()}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};
