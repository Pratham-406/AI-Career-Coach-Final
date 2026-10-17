import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, fallbackTalentProfiles, fallbackRecruiterMessages } from '../services/api';
import { TalentProfile, RecruiterMessage, VerifiedSkillBadge } from '../types';
import {
  Users,
  Search,
  Mail,
  Send,
  Award,
  CheckCircle2,
  GitBranch,
  Sparkles,
  ExternalLink,
  Plus,
  Briefcase,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Building,
  Check,
  X,
  Clock,
  Filter,
} from 'lucide-react';

export const SkillNetworkPage: React.FC = () => {
  const { user, showToast } = useAuth();

  // Tab: 'discover' | 'inbox' | 'my-skills'
  const [activeTab, setActiveTab] = useState<'discover' | 'inbox' | 'my-skills'>('discover');

  // Discover state
  const [talents, setTalents] = useState<TalentProfile[]>(fallbackTalentProfiles);
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCodeEvidence, setSelectedCodeEvidence] = useState<VerifiedSkillBadge | null>(null);

  // Recruiter Messaging state
  const [inboxMessages, setInboxMessages] = useState<RecruiterMessage[]>(fallbackRecruiterMessages);
  const [activeOutreachCandidate, setActiveOutreachCandidate] = useState<TalentProfile | null>(null);
  const [outreachCompany, setOutreachCompany] = useState('Stripe Engineering');
  const [outreachRole, setOutreachRole] = useState('Full-Stack Software Engineer');
  const [outreachInterviewType, setOutreachInterviewType] = useState<RecruiterMessage['interviewType']>('Round 1 Technical Screen');
  const [outreachMessage, setOutreachMessage] = useState('');
  const [outreachDate, setOutreachDate] = useState('Next Wednesday at 2:00 PM PST');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // New Skill form state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Core Proficient' | 'Advanced' | 'Mastery'>('Advanced');
  const [newSkillVerifiedBy, setNewSkillVerifiedBy] = useState<'GitHub AST Scan' | 'Verified Certificate' | 'Hackathon Project'>('Verified Certificate');
  const [newSkillSnippet, setNewSkillSnippet] = useState('');

  // Load data
  useEffect(() => {
    api.getTalentProfiles()
      .then((data) => {
        if (data && data.length > 0) setTalents(data);
      })
      .catch(() => {});

    api.getStudentInbox()
      .then((data) => {
        if (data && data.length > 0) setInboxMessages(data);
      })
      .catch(() => {});
  }, []);

  // Filter skills
  const availableSkills = ['All', 'TypeScript', 'Docker', 'Redis', 'Kafka', 'Go (Golang)', 'Python', 'React 19 & Next.js', 'PostgreSQL'];

  const filteredTalents = talents.filter((t) => {
    const matchesSkill = selectedSkillFilter === 'All' || t.skills.some((s) => s.name.toLowerCase().includes(selectedSkillFilter.toLowerCase()));
    const matchesSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.targetRole.toLowerCase().includes(searchQuery.toLowerCase()) || t.skills.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSkill && matchesSearch;
  });

  // Handle Send Recruiter Invite
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOutreachCandidate) return;

    setIsSendingMessage(true);
    try {
      const payload: Partial<RecruiterMessage> = {
        studentId: activeOutreachCandidate.id,
        company: outreachCompany,
        senderName: 'Rachel Vance',
        senderTitle: 'Engineering Talent Lead',
        subject: `Interview Request: ${outreachRole} at ${outreachCompany}`,
        message: outreachMessage || `Hi ${activeOutreachCandidate.name.split(' ')[0]}, we reviewed your verified ${activeOutreachCandidate.skills.slice(0, 2).map((s) => s.name).join(' & ')} evidence. We would love to invite you for an interview.`,
        interviewType: outreachInterviewType,
        proposedDate: outreachDate,
      };

      const sentMsg = await api.sendRecruiterMessage(payload);
      setInboxMessages((prev) => [sentMsg, ...prev]);
      showToast(`Interview invite sent to ${activeOutreachCandidate.name}!`, 'success');
      setActiveOutreachCandidate(null);
      setOutreachMessage('');
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Handle Accept/Decline message
  const handleUpdateStatus = async (id: string, status: 'accepted' | 'declined') => {
    try {
      await api.updateMessageStatus(id, status);
      setInboxMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
      showToast(`Interview offer ${status}! Recruiter has been notified.`, status === 'accepted' ? 'success' : 'info');
    } catch {
      setInboxMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
    }
  };

  // Handle Add Student Skill
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill: VerifiedSkillBadge = {
      name: newSkillName.trim(),
      level: newSkillLevel,
      verifiedBy: newSkillVerifiedBy,
      evidenceSnippet: newSkillSnippet || 'Verified via verified skill assessment and repo evidence',
      confidenceScore: 92,
    };

    try {
      await api.addStudentSkill(newSkill);
      setTalents((prev) => {
        const updated = [...prev];
        updated[0].skills.push(newSkill);
        return updated;
      });
      showToast(`Added ${newSkillName} to your verified skill locker!`, 'success');
      setNewSkillName('');
      setNewSkillSnippet('');
    } catch {}
  };

  const pendingCount = inboxMessages.filter((m) => m.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-indigo-900/40 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Skills-Only Student Talent Network & Recruiter Direct Inbox</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Pure Skill Match. Zero Resume Noise.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Unlike LinkedIn, this network eliminates clutter and fluff. Students showcase verified skills from AST code scans & certificates, allowing companies to message you directly for interview rounds.
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'discover'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Explore Talent Matrix
          </button>
          
          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative flex items-center gap-1.5 ${
              activeTab === 'inbox'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Company Interview Invites</span>
            {pendingCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-black animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('my-skills')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'my-skills'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            My Skill Locker & Certs
          </button>
        </div>
      </div>

      {/* TAB 1: DISCOVER TALENT MATRIX */}
      {activeTab === 'discover' && (
        <div className="space-y-6">
          
          {/* Search & Skill Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search candidates by verified skill (e.g. TypeScript, Redis, Kafka, Docker)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Quick Skill Tag Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {availableSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => setSelectedSkillFilter(skill)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSkillFilter === skill
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>

          {/* Talent Candidates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTalents.map((candidate) => (
              <div
                key={candidate.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md p-6 space-y-4 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Candidate Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={candidate.avatarUrl}
                        alt={candidate.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-brand-500 shadow-sm"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {candidate.name}
                          </h3>
                          {candidate.id === 'talent-01' && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {candidate.headline}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {candidate.targetRole} • {candidate.location}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {candidate.readinessScore}% Ready
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">{candidate.availability}</p>
                    </div>
                  </div>

                  {/* Verified Skills Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <span>Verified Code & Cert Proofs</span>
                      <span>{candidate.skills.length} Badges</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {candidate.skills.map((skill, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedCodeEvidence(skill)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 hover:bg-brand-50 dark:hover:bg-brand-950/40 border border-slate-200 dark:border-slate-700 hover:border-brand-400 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-all group"
                          title="Click to view verified code evidence"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
                          <span>{skill.name}</span>
                          <span className="text-[10px] text-slate-400 group-hover:text-brand-500">
                            ({skill.confidenceScore}%)
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Certificates / Hackathons */}
                  {candidate.certificates.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Certifications & Proofs:
                      </p>
                      {candidate.certificates.map((cert) => (
                        <div key={cert.id} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                          <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{cert.title} ({cert.issuer})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recruiter Action Bar */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 mt-4">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>{candidate.projectsCount} Verified Repos</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveOutreachCandidate(candidate);
                      setOutreachMessage(`Hi ${candidate.name.split(' ')[0]}! We reviewed your verified code proof in ${candidate.skills.slice(0, 2).map((s) => s.name).join(' and ')}. Our engineering team would love to invite you for an introductory architecture round.`);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition-transform active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Interview Invite</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: INBOX (COMPANY INTERVIEW INVITES) */}
      {activeTab === 'inbox' && (
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Company Interview Outreach Inbox
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {inboxMessages.length} Messages Received
            </span>
          </div>

          <div className="space-y-4">
            {inboxMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={msg.companyLogo}
                      alt={msg.company}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {msg.company}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold">
                          {msg.interviewType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        From: <strong>{msg.senderName}</strong> ({msg.senderTitle})
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      msg.status === 'accepted'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        : msg.status === 'declined'
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 animate-pulse'
                    }`}>
                      {msg.status === 'pending' ? 'Action Required' : msg.status.toUpperCase()}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">{msg.sentAt}</p>
                  </div>
                </div>

                {/* Subject & Message */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {msg.subject}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    "{msg.message}"
                  </p>
                  {msg.proposedDate && (
                    <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Proposed Date/Time: {msg.proposedDate}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  {msg.status === 'pending' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(msg.id, 'declined')}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(msg.id, 'accepted')}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition-transform active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Interview Invite</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Responded ({msg.status})</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MY SKILL LOCKER */}
      {activeTab === 'my-skills' && (
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Add Skill Form */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-600" />
                <span>Add Skill & Certification Proof to Your Matrix</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Companies search for candidates based on verified skills. Add your new technical strengths below.
              </p>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GraphQL, Kubernetes, Rust"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Proficiency Level
                  </label>
                  <select
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-white"
                  >
                    <option value="Core Proficient">Core Proficient</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Mastery">Mastery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Verification Method
                  </label>
                  <select
                    value={newSkillVerifiedBy}
                    onChange={(e) => setNewSkillVerifiedBy(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-white"
                  >
                    <option value="GitHub AST Scan">GitHub AST Scan</option>
                    <option value="Verified Certificate">Verified Certificate</option>
                    <option value="Hackathon Project">Hackathon Project</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Evidence Snippet or Credential URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. repo/src/graphql/schema.ts:24 or https://aws.amazon.com/verification"
                  value={newSkillSnippet}
                  onChange={(e) => setNewSkillSnippet(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20"
                >
                  Save Skill to Matrix
                </button>
              </div>
            </form>
          </div>

          {/* Current Verified Skills List */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Your Current Verified Skill Badges ({talents[0]?.skills.length || 0})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {talents[0]?.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {skill.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
                      {skill.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                    {skill.evidenceSnippet}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified by {skill.verifiedBy} ({skill.confidenceScore}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* MODAL 1: Code Evidence Inspection */}
      {selectedCodeEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Verified AST Evidence: {selectedCodeEvidence.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCodeEvidence(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400">Proof Source:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCodeEvidence.verifiedBy}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400">Confidence Score:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedCodeEvidence.confidenceScore}%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] leading-relaxed border border-slate-800">
                <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">// Repository Code AST Reference:</p>
                {selectedCodeEvidence.evidenceSnippet}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCodeEvidence(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Send Interview Invite Outreach Modal */}
      {activeOutreachCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Send Direct Interview Invite to {activeOutreachCandidate.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveOutreachCandidate(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={outreachCompany}
                    onChange={(e) => setOutreachCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Interview Round Type
                  </label>
                  <select
                    value={outreachInterviewType}
                    onChange={(e) => setOutreachInterviewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Round 1 Technical Screen">Round 1 Technical Screen</option>
                    <option value="Full-Stack Architecture Chat">Full-Stack Architecture Chat</option>
                    <option value="Behavioral & Culture Fit">Behavioral & Culture Fit</option>
                    <option value="Informal Connect">Informal Connect</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Proposed Date & Time
                </label>
                <input
                  type="text"
                  required
                  value={outreachDate}
                  onChange={(e) => setOutreachDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Invitation Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={outreachMessage}
                  onChange={(e) => setOutreachMessage(e.target.value)}
                  className="w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveOutreachCandidate(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingMessage}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Official Invite</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
