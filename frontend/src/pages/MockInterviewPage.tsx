import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, fallbackInterviewQuestions, fallbackInterviewSessions } from '../services/api';
import { MockInterviewQuestion, InterviewEvaluation, MockInterviewSession } from '../types';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Sparkles,
  Award,
  Clock,
  Send,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  MessageSquare,
  ThumbsUp,
  History,
  Play,
  Lightbulb,
} from 'lucide-react';

export const MockInterviewPage: React.FC = () => {
  const { user, showToast, setCurrentPage } = useAuth();

  // Mode: 'setup' | 'interview' | 'evaluation' | 'history'
  const [viewMode, setViewMode] = useState<'setup' | 'interview' | 'evaluation' | 'history'>('setup');

  // Setup options
  const [selectedRole, setSelectedRole] = useState(user?.targetRole || 'Full Stack Cloud Engineer');
  const [selectedCategory, setSelectedCategory] = useState<string>('System Design');
  const [difficulty, setDifficulty] = useState<'Junior' | 'Mid' | 'Senior'>('Mid');

  // Interview state
  const [questions, setQuestions] = useState<MockInterviewQuestion[]>(fallbackInterviewQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Audio / Speech states
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [speechMuted, setSpeechMuted] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);

  // Video / Camera states
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Evaluation & History
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<InterviewEvaluation | null>(null);
  const [historySessions, setHistorySessions] = useState<MockInterviewSession[]>(fallbackInterviewSessions);

  // Load history on mount
  useEffect(() => {
    api.getInterviewHistory()
      .then((data) => {
        if (data && data.length > 0) setHistorySessions(data);
      })
      .catch(() => {});
  }, []);

  // Timer countdown
  useEffect(() => {
    let timer: any;
    if (viewMode === 'interview' && isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [viewMode, isTimerRunning, timeLeft]);

  // Web Speech Synthesis (read question aloud)
  const speakQuestion = (text: string) => {
    if (speechMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeakingQuestion(true);
    utterance.onend = () => setIsSpeakingQuestion(false);
    utterance.onerror = () => setIsSpeakingQuestion(false);
    window.speechSynthesis.speak(utterance);
  };

  // Toggle Camera
  const toggleCamera = async () => {
    if (isCameraOn) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
      showToast('Camera turned off', 'info');
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
        showToast('Camera connected successfully', 'success');
      } catch (err) {
        showToast('Could not access camera. Using avatar preview.', 'warning');
        setIsCameraOn(false);
      }
    }
  };

  // Toggle Microphone Speech Recognition
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Speech Recognition not supported in this browser. Please type your answer.', 'warning');
      return;
    }

    if (isListeningMic) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListeningMic(false);
      showToast('Microphone transcription paused', 'info');
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setCandidateAnswer((prev) => (prev ? prev + ' ' + transcript : transcript));
        };

        recognition.onerror = () => {
          setIsListeningMic(false);
        };

        recognition.onend = () => {
          setIsListeningMic(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsListeningMic(true);
        showToast('Listening to your answer... Speak naturally!', 'info');
      } catch (err) {
        setIsListeningMic(false);
        showToast('Speech recognition error. Please type your answer.', 'error');
      }
    }
  };

  // Start interview session
  const handleStartInterview = async () => {
    try {
      const qList = await api.getInterviewQuestions(selectedRole, selectedCategory);
      if (qList && qList.length > 0) {
        setQuestions(qList);
      }
    } catch {}

    setCurrentQuestionIndex(0);
    setCandidateAnswer('');
    setShowHint(false);
    setTimeLeft(180);
    setIsTimerRunning(true);
    setViewMode('interview');

    // Read first question aloud
    setTimeout(() => {
      const activeQ = questions[0] || fallbackInterviewQuestions[0];
      speakQuestion(activeQ.question);
    }, 400);
  };

  // Submit Answer for AI Evaluation
  const handleSubmitAnswer = async () => {
    if (candidateAnswer.trim().length < 15) {
      showToast('Please provide a more substantive answer before submitting for evaluation.', 'warning');
      return;
    }

    setIsSubmitting(true);
    window.speechSynthesis?.cancel();
    if (isListeningMic && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListeningMic(false);
    }

    const currentQ = questions[currentQuestionIndex] || fallbackInterviewQuestions[0];

    try {
      const res = await api.evaluateInterviewAnswer(currentQ.id, candidateAnswer, selectedRole);
      setCurrentEvaluation(res.evaluation);

      // Save session
      const saved = await api.saveInterviewSession({
        targetRole: selectedRole,
        category: selectedCategory,
        totalQuestions: 1,
        averageScore: res.evaluation.overallScore,
        feedback: res.evaluation,
      });

      setHistorySessions((prev) => [saved.session, ...prev]);
      showToast(`Evaluation completed! Score: ${res.evaluation.overallScore}/100`, 'success');
      setViewMode('evaluation');
    } catch (err: any) {
      showToast(err.message || 'Evaluation completed via AI fallback engine.', 'info');
      setViewMode('evaluation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ = questions[currentQuestionIndex] || fallbackInterviewQuestions[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">

      {/* Top Navigation & Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            <Mic className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Interactive AI Mock Interview Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Build Real Interview Confidence
          </h1>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('setup')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'setup'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            New Interview
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'history'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Past Sessions ({historySessions.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: SETUP SCREEN */}
      {viewMode === 'setup' && (
        <div className="max-w-3xl mx-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Configure Your Mock Interview
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize role focus and interview style to simulate real technical screening and architecture rounds.
            </p>
          </div>

          <div className="space-y-4">
            {/* Target Role */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Engineering Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Full Stack Cloud Engineer">Full Stack Cloud Engineer</option>
                <option value="Distributed Systems Engineer">Distributed Systems Engineer</option>
                <option value="AI / ML Engineer">AI / ML Engineer</option>
                <option value="Frontend UI/UX Engineer">Frontend UI/UX Engineer</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Interview Focus Area
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'System Design', label: 'System Design & Architecture', desc: 'Scalability, queues, databases' },
                  { id: 'Technical Coding', label: 'Technical Coding & Concurrency', desc: 'Locking, algorithms, optimization' },
                  { id: 'Behavioral STAR', label: 'Behavioral STAR Round', desc: 'Outages, leadership, trade-offs' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3.5 rounded-xl text-left border transition-all ${
                      selectedCategory === cat.id
                        ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <p className="text-xs font-bold">{cat.label}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{cat.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Junior', 'Mid', 'Senior'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      difficulty === lvl
                        ? 'border-brand-500 bg-brand-600 text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {lvl} Level
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Checklist */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <p className="font-bold text-slate-900 dark:text-white">Included in this AI Session:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>AI Voice Question Readout</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Speech-to-Text Microphone Dictation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Webcam Practice Preview Mode</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Instant STAR Scorecard & Feedback</span>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              type="button"
              onClick={handleStartInterview}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Enter Interactive Mock Interview Room</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: LIVE INTERVIEW ROOM */}
      {viewMode === 'interview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Interviewer & Video Feeds */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* AI Interviewer Avatar Card */}
            <div className="rounded-2xl bg-slate-900 text-white p-5 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                      alt="AI Interviewer"
                      className="w-10 h-10 rounded-full object-cover border-2 border-brand-500"
                    />
                    {isSpeakingQuestion && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 animate-ping" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold">Elena Rostova (AI Interviewer)</h3>
                    <p className="text-[10px] text-slate-400">Staff Architecture Lead</p>
                  </div>
                </div>

                {/* Audio Readout Controls */}
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeakingQuestion) {
                      window.speechSynthesis?.cancel();
                      setIsSpeakingQuestion(false);
                    } else {
                      speakQuestion(currentQ.question);
                    }
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5"
                  title="Read question aloud"
                >
                  {isSpeakingQuestion ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  <span className="text-[11px] font-medium">{isSpeakingQuestion ? 'Stop Audio' : 'Speak Question'}</span>
                </button>
              </div>

              {/* Question Text Box */}
              <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-brand-400 uppercase tracking-wider">
                  <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <span className="text-slate-400">{currentQ.category} • {currentQ.difficulty}</span>
                </div>
                <p className="text-sm font-semibold leading-relaxed text-white">
                  "{currentQ.question}"
                </p>
              </div>

              {/* Hint Box */}
              {showHint && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{currentQ.hint}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide Hint' : 'Request Interviewer Hint'}</span>
                </button>

                {/* Question Timer */}
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 bg-slate-800 px-3 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>
            </div>

            {/* Candidate Webcam Box */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>Candidate Video Room</span>
                <button
                  type="button"
                  onClick={toggleCamera}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                    isCameraOn
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isCameraOn ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                  <span>{isCameraOn ? 'Turn Off Cam' : 'Enable Camera'}</span>
                </button>
              </div>

              {/* Video Element or Avatar placeholder */}
              <div className="aspect-video w-full rounded-xl bg-slate-950 relative overflow-hidden flex items-center justify-center border border-slate-800">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transform -scale-x-100 ${isCameraOn ? 'block' : 'hidden'}`}
                />
                {!isCameraOn && (
                  <div className="text-center space-y-2">
                    <img
                      src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={user?.name || 'Candidate'}
                      className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-slate-700"
                    />
                    <p className="text-[11px] text-slate-400">{user?.name || 'Alex Rivera'}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      Camera Standby
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Answer Input & Real-Time Dictation */}
          <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Your Answer Response
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Speak into your microphone or type your response using the STAR method.
                </p>
              </div>

              {/* Mic Dictation Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isListeningMic
                    ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20'
                }`}
              >
                {isListeningMic ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isListeningMic ? 'Recording Voice...' : 'Dictate with Voice'}</span>
              </button>
            </div>

            {/* STAR Quick Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-slate-400 font-semibold">Suggested STAR structure:</span>
              <button
                type="button"
                onClick={() => setCandidateAnswer((prev) => prev + '\n[Situation]: ')}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200"
              >
                + Situation
              </button>
              <button
                type="button"
                onClick={() => setCandidateAnswer((prev) => prev + '\n[Task]: ')}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200"
              >
                + Task
              </button>
              <button
                type="button"
                onClick={() => setCandidateAnswer((prev) => prev + '\n[Action]: ')}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200"
              >
                + Action
              </button>
              <button
                type="button"
                onClick={() => setCandidateAnswer((prev) => prev + '\n[Result]: ')}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200"
              >
                + Result
              </button>
            </div>

            {/* Answer Textarea */}
            <div className="relative">
              <textarea
                rows={10}
                value={candidateAnswer}
                onChange={(e) => setCandidateAnswer(e.target.value)}
                placeholder="Structure your answer here... Mention specific architecture components, failover mechanics, throughput latencies, and transaction boundaries."
                className="w-full p-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white leading-relaxed resize-none font-mono"
              />
              <div className="absolute bottom-3 right-3 text-[11px] font-medium text-slate-400 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-sm">
                {candidateAnswer.trim().split(/\s+/).filter(Boolean).length} words
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setViewMode('setup');
                }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-medium"
              >
                Cancel Session
              </button>

              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={isSubmitting || candidateAnswer.trim().length < 15}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Evaluating Answer...</span>
                ) : (
                  <>
                    <span>Submit for AI Evaluation</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* VIEW 3: AI EVALUATION & SCORECARD */}
      {viewMode === 'evaluation' && currentEvaluation && (
        <div className="max-w-4xl mx-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          
          {/* Header Score Gauge */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-brand-900 via-slate-900 to-slate-900 text-white border border-brand-800/60 gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400">
                Evaluation Scorecard
              </span>
              <h2 className="text-2xl font-black">
                {currentEvaluation.readinessVerdict}
              </h2>
              <p className="text-xs text-slate-300">
                Role Evaluated: {selectedRole} ({selectedCategory})
              </p>
            </div>

            {/* Big Circular Score */}
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-full border-4 border-brand-500 flex flex-col items-center justify-center bg-slate-950/60">
                <span className="text-2xl font-black text-white">{currentEvaluation.overallScore}</span>
                <span className="text-[9px] uppercase font-bold text-slate-400">Score</span>
              </div>
            </div>
          </div>

          {/* Sub-Score Breakdown Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Clarity & Articulation</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{currentEvaluation.clarityScore}%</p>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${currentEvaluation.clarityScore}%` }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Technical Depth & Keywords</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{currentEvaluation.technicalDepthScore}%</p>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full" style={{ width: `${currentEvaluation.technicalDepthScore}%` }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">STAR Structure Compliance</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{currentEvaluation.starComplianceScore}%</p>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${currentEvaluation.starComplianceScore}%` }} />
              </div>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
                <span>Observed Key Strengths</span>
              </div>
              <ul className="space-y-1.5 text-xs text-emerald-900 dark:text-emerald-200">
                {currentEvaluation.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Actionable Improvement Tips</span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-900 dark:text-amber-200">
                {currentEvaluation.improvements.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Keywords Detected */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Architectural Keywords Identified in Your Response:
            </p>
            <div className="flex flex-wrap gap-2">
              {currentEvaluation.matchedKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{kw}</span>
                </span>
              ))}
              {currentEvaluation.missingKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                >
                  Missing: {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Model Answer Recommendation */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-brand-500" />
              <span>Recommended Ideal Answer Blueprint</span>
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-mono">
              {currentEvaluation.modelAnswerSummary}
            </p>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('setup')}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
            >
              Practice Another Question
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage('skill-gap')}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 flex items-center justify-center gap-1.5"
            >
              <span>Bridge Identified Gaps in Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* VIEW 4: HISTORY SESSIONS */}
      {viewMode === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Mock Interview History & Progression
            </h2>
            <button
              onClick={() => setViewMode('setup')}
              className="px-3.5 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-sm"
            >
              Start New Mock Session
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {historySessions.map((session) => (
              <div
                key={session.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    {session.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200">
                    {session.averageScore}/100 Score
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {session.targetRole}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {session.feedback?.readinessVerdict || 'Recommended for Onsite Screen'}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>{new Date(session.date).toLocaleDateString()}</span>
                  <span className="text-brand-600 dark:text-brand-400 font-semibold">1 Question Evaluated</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
