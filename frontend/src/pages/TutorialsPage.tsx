import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, fallbackTutorials } from '../services/api';
import { TutorialVideo } from '../types';
import {
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Video,
  ArrowRight,
  Filter,
  Check,
  ExternalLink,
  BookOpen,
  Compass,
  X,
} from 'lucide-react';

export const TutorialsPage: React.FC = () => {
  const { setCurrentPage, showToast } = useAuth();
  const [tutorials, setTutorials] = useState<TutorialVideo[]>(fallbackTutorials);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeVideoModal, setActiveVideoModal] = useState<TutorialVideo | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ai_coach_completed_tutorials');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    api.getTutorials()
      .then((data) => {
        if (data && data.length > 0) setTutorials(data);
      })
      .catch(() => {});
  }, []);

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (completedIds.includes(id)) {
      updated = completedIds.filter((item) => item !== id);
      showToast('Tutorial marked as uncompleted', 'info');
    } else {
      updated = [...completedIds, id];
      showToast('Tutorial marked as completed! +15 Readiness XP', 'success');
    }
    setCompletedIds(updated);
    localStorage.setItem('ai_coach_completed_tutorials', JSON.stringify(updated));
  };

  const categories = ['All', 'Python', 'C++', 'Core Programming'];

  const filteredTutorials = selectedCategory === 'All'
    ? tutorials
    : tutorials.filter((t) =>
        t.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        t.title.toLowerCase().includes(selectedCategory.toLowerCase())
      );

  const completedCount = tutorials.filter((t) => completedIds.includes(t.id)).length;
  const progressPercent = Math.round((completedCount / tutorials.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white p-6 sm:p-8 border border-brand-800/40 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
            <Video className="w-3.5 h-3.5 text-brand-400" />
            <span>Interactive Video Tutorials & Masterclasses</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Learn How to Improve & Crack Top Engineering Roles
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Step-by-step video walkthroughs showing how to connect repositories, extract AST evidence, ace interactive AI mock interviews, and get direct company interview invites.
          </p>

          {/* Progress Bar */}
          <div className="pt-2 max-w-md space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Your Learning Milestone:</span>
              <span className="text-brand-400">{completedCount} of {tutorials.length} Completed ({progressPercent}%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tutorials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTutorials.map((tut) => {
          const isDone = completedIds.includes(tut.id);
          return (
            <div
              key={tut.id}
              onClick={() => setActiveVideoModal(tut)}
              className="group cursor-pointer rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail Header */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    src={tut.thumbnailUrl}
                    alt={tut.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-brand-600/90 text-white shadow-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 ml-1 fill-white" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-md border border-white/10">
                      {tut.category}
                    </span>
                  </div>

                  {/* Duration & Difficulty */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/75 text-white backdrop-blur-md">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{tut.durationMinutes} min</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Instructor: <strong className="text-slate-800 dark:text-slate-200">{tut.instructor}</strong></span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {tut.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                    {tut.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {tut.description}
                  </p>

                  {/* Key Takeaways */}
                  <div className="pt-2 space-y-1.5 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      What you will learn:
                    </p>
                    {tut.keyTakeaways.slice(0, 2).map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-5 pt-0 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800/60 mt-3 pt-3">
                <button
                  type="button"
                  onClick={(e) => toggleComplete(tut.id, e)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isDone
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${isDone ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{isDone ? 'Completed' : 'Mark as Done'}</span>
                </button>

                <div className="flex items-center gap-2">
                  {tut.externalUrl && (
                    <a
                      href={tut.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Open on YouTube"
                    >
                      <span>YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {tut.actionLink && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentPage(tut.actionLink!.page);
                      }}
                      className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      <span>{tut.actionLink.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Player Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                  {activeVideoModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player (Embedded YouTube / Clean Simulated Stream) */}
            <div className="px-4">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
                <iframe
                  className="w-full h-full"
                  src={activeVideoModal.videoUrl}
                  title={activeVideoModal.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Takeaways in Modal */}
            <div className="p-4 pt-0 space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeVideoModal.description}
              </p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Key Takeaways & Best Practices:
                </p>
                <ul className="space-y-1">
                  {activeVideoModal.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <span className="text-brand-500 font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2">
                {activeVideoModal.externalUrl ? (
                  <a
                    href={activeVideoModal.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-all shadow-sm"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : <div />}

                <button
                  onClick={() => {
                    if (!completedIds.includes(activeVideoModal.id)) {
                      toggleComplete(activeVideoModal.id, { stopPropagation: () => {} } as any);
                    }
                    setActiveVideoModal(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md"
                >
                  Finished Watching (Mark Completed)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
