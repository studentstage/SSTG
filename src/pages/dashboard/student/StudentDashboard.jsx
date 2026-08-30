import React, { useState, useEffect, useMemo } from 'react';
import { 
  HelpCircle, MessageSquare, BookOpen, Award, 
  TrendingUp, Users, Clock, Plus, User, RefreshCw,
  Search, Filter, ThumbsUp, ThumbsDown, Sparkles, 
  Video, BarChart3, MessageCircle, ArrowRight,
  BookMarked, ChevronDown, ChevronUp, Send, CheckCircle2,
  X, GraduationCap, Flame, AlertCircle, BookmarkCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { qaService } from '../../../services/api/qa';
import QuestionAskForm from '../../../components/qa/QuestionAskForm';
import { faculties } from '../../../config/academics';

const STUDY_TIPS = [
  {
    title: "Feynman Technique",
    desc: "Explain complex concepts in simple terms as if teaching a beginner to expose knowledge gaps."
  },
  {
    title: "Spaced Repetition",
    desc: "Review lecture notes at increasing intervals (1 day, 3 days, 1 week) for long-term memory retention."
  },
  {
    title: "Pomodoro Focus",
    desc: "Study in 25-minute distraction-free blocks followed by 5-minute restorative breaks."
  },
  {
    title: "Active Practice",
    desc: "Solve past questions and explain answers to your peers rather than passively re-reading."
  }
];

const StudentDashboard = () => {
  const { user, userRole, username, refreshUserData } = useAuth();
  const navigate = useNavigate();
  
  const [refreshing, setRefreshing] = useState(false);
  
  // Q&A State
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [showAskModal, setShowAskModal] = useState(false);
  
  // Active Question for inline answering / expanding
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [answeringQuestionId, setAnsweringQuestionId] = useState(null);
  const [answerContent, setAnswerContent] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'my'
  
  // Local interaction cache (votes)
  const [userVotes, setUserVotes] = useState({});
  
  // Quick AI Assistant prompt
  const [quickAiPrompt, setQuickAiPrompt] = useState('');
  
  // Daily Tip
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Extract User Details
  const userDetails = useMemo(() => {
    if (!user) return { id: 'N/A', username: 'Student', email: '', role: 'STUDENT' };
    return {
      id: user.id || user.user?.id || 'N/A',
      username: user.username || user.user?.username || username || 'Student',
      email: user.email || user.user?.email || '',
      role: userRole || 'STUDENT',
      fullName: user.profile?.full_name || user.full_name || '',
      department: user.profile?.sector || user.department || 'Computer Science',
      faculty: user.profile?.address || 'Faculty of Computing & Mathematical Sciences',
      dateJoined: user.profile?.date_joined || user.date_joined || null,
    };
  }, [user, userRole, username]);

  // Fetch Questions from API
  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const data = await qaService.getQuestions();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions from backend');
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Handle Refresh
  const handleRefreshData = async () => {
    if (!refreshUserData) {
      toast.error('Refresh function not available');
      return;
    }
    
    setRefreshing(true);
    try {
      await refreshUserData();
      await fetchQuestions();
      toast.success('Dashboard refreshed!');
    } catch (error) {
      toast.error('Failed to refresh data');
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle Question Asked in Modal
  const handleQuestionAsked = (newQuestion) => {
    setQuestions(prev => [newQuestion, ...prev]);
    setShowAskModal(false);
    toast.success('Your question is live in the community!');
  };

  // Handle Upvote / Downvote
  const handleVote = async (questionId, type) => {
    const currentVote = userVotes[questionId];
    if (currentVote === type) {
      toast('You already recorded this vote', { icon: 'ℹ️' });
      return;
    }

    // Optimistic UI update
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const upDiff = type === 'up' ? 1 : (currentVote === 'up' ? -1 : 0);
        const downDiff = type === 'down' ? 1 : (currentVote === 'down' ? -1 : 0);
        return {
          ...q,
          upvotes: Math.max(0, (q.upvotes || 0) + upDiff),
          downvotes: Math.max(0, (q.downvotes || 0) + downDiff)
        };
      }
      return q;
    }));

    setUserVotes(prev => ({ ...prev, [questionId]: type }));

    try {
      if (type === 'up') {
        await qaService.upvoteQuestion(questionId);
      } else {
        await qaService.downvoteQuestion(questionId);
      }
    } catch (err) {
      // Non-fatal if backend endpoint is simulated
      console.log('Vote recorded locally');
    }
  };

  // Submit Inline Answer
  const handleInlineAnswerSubmit = async (e, questionId) => {
    e.preventDefault();
    if (!answerContent.trim()) {
      toast.error('Please write an answer before submitting');
      return;
    }
    if (answerContent.trim().length < 10) {
      toast.error('Answer must be at least 10 characters long');
      return;
    }

    setSubmittingAnswer(true);
    try {
      const answerPayload = {
        questionId,
        content: answerContent.trim(),
        userId: userDetails.id,
        userName: userDetails.username,
        createdAt: new Date().toISOString()
      };

      let newAnswer;
      try {
        newAnswer = await qaService.submitAnswer(questionId, answerPayload);
      } catch (apiErr) {
        // Fallback to locally crafted answer if server error
        newAnswer = {
          id: Date.now(),
          ...answerPayload
        };
      }

      setQuestions(prev => prev.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: [...(q.answers || []), newAnswer]
          };
        }
        return q;
      }));

      setAnswerContent('');
      setAnsweringQuestionId(null);
      setExpandedQuestionId(questionId); // Expand to show new answer
      toast.success('Your answer has been shared!');
    } catch (error) {
      toast.error('Failed to submit answer');
      console.error(error);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // Quick AI Assistant route
  const handleQuickAiSubmit = (e) => {
    e.preventDefault();
    if (!quickAiPrompt.trim()) return;
    navigate('/student/ai-assistant', { state: { initialPrompt: quickAiPrompt } });
  };

  // Filtered & Tabbed Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch = 
        q.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || 
        q.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesTab = activeTab === 'all' || 
        (q.userId === userDetails.id || q.userName === userDetails.username);

      return matchesSearch && matchesCategory && matchesTab;
    });
  }, [questions, searchTerm, selectedCategory, activeTab, userDetails]);

  // Dynamic Statistics
  const stats = useMemo(() => {
    const totalQuestions = questions.length;
    const userQuestionsCount = questions.filter(q => 
      q.userId === userDetails.id || q.userName === userDetails.username
    ).length;
    const totalAnswers = questions.reduce((sum, q) => sum + (q.answers?.length || 0), 0);
    const points = (userQuestionsCount * 15) + (totalAnswers * 10) + 120; // gamified calculation

    return {
      totalQuestions,
      userQuestionsCount,
      totalAnswers,
      points,
      activeTutors: 18
    };
  }, [questions, userDetails]);

  const categories = [
    { value: 'all', label: 'All Topics' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'programming', label: 'Programming' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'english', label: 'English' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header & Welcome Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-md">
              <GraduationCap size={15} />
              <span>Student Learning Stage</span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {userDetails.fullName || userDetails.username}! 👋
            </h1>
            
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Explore university lecture notes, participate in peer Q&A, study with AI, and track your academic progress all in one place.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs sm:text-sm text-blue-100/90">
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-md">
                <BookOpen size={14} className="text-blue-300" />
                {userDetails.department}
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-md">
                <Award size={14} className="text-amber-300" />
                Level: Active Scholar
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => setShowAskModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-900 shadow-md transition-all hover:bg-blue-50 active:scale-95"
            >
              <Plus size={18} className="text-blue-700" />
              <span>Ask Question</span>
            </button>

            <button
              onClick={handleRefreshData}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 disabled:opacity-50"
              title="Sync with latest server data"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Syncing...' : 'Sync Data'}</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="card p-5 border-l-4 border-l-blue-500 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Questions Feed</span>
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <HelpCircle size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats.totalQuestions}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span className="font-semibold text-blue-600 dark:text-blue-400">{stats.userQuestionsCount}</span> asked by you
            </p>
          </div>
        </div>

        <div className="card p-5 border-l-4 border-l-emerald-500 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Answers Given</span>
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <MessageSquare size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats.totalAnswers}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp size={12} /> Active community replies
            </p>
          </div>
        </div>

        <div className="card p-5 border-l-4 border-l-amber-500 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Scholar Points</span>
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
              <Award size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats.points}</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1 font-medium">
              <Flame size={13} /> +35 pts this week
            </p>
          </div>
        </div>

        <div className="card p-5 border-l-4 border-l-purple-500 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Active Tutors</span>
            <div className="p-2.5 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats.activeTutors}</p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-medium">
              Available for academic review
            </p>
          </div>
        </div>
      </div>

      {/* 3. MVP Quick Navigation Launchpad */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Learning Hub</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Quick access to all your study materials and tools</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/student/books"
            className="card p-5 group flex items-start gap-4 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Books & Notes
                </h3>
                <ArrowRight size={16} className="text-gray-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                Access curated textbooks, lecture slides, and faculty syllabus notes with offline reader.
              </p>
              <span className="inline-block mt-3 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                Browse Shelf →
              </span>
            </div>
          </Link>

          <Link
            to="/student/videos"
            className="card p-5 group flex items-start gap-4 hover:border-red-500 dark:hover:border-red-500 hover:shadow-lg transition-all"
          >
            <div className="p-3 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-2xl group-hover:scale-110 transition-transform">
              <Video size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  Video Lectures
                </h3>
                <ArrowRight size={16} className="text-gray-400 group-hover:translate-x-1 group-hover:text-red-600 transition-all" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                Watch curated video tutorials and visual walkthroughs for complex STEM subjects.
              </p>
              <span className="inline-block mt-3 text-[11px] font-semibold text-red-600 dark:text-red-400">
                Watch Lectures →
              </span>
            </div>
          </Link>

          <Link
            to="/student/ai-assistant"
            className="card p-5 group flex items-start gap-4 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg transition-all"
          >
            <div className="p-3 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-2xl group-hover:scale-110 transition-transform">
              <Sparkles size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  AI Study Assistant
                </h3>
                <ArrowRight size={16} className="text-gray-400 group-hover:translate-x-1 group-hover:text-purple-600 transition-all" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                Get instant step-by-step problem breakdown, code debugging, and concept clarification.
              </p>
              <span className="inline-block mt-3 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                Ask AI →
              </span>
            </div>
          </Link>

          <Link
            to="/student/questions"
            className="card p-5 group flex items-start gap-4 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-lg transition-all"
          >
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
              <HelpCircle size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  My Questions
                </h3>
                <ArrowRight size={16} className="text-gray-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                Track all your posted questions and check for tutor verified answers.
              </p>
              <span className="inline-block mt-3 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Manage Inquiries →
              </span>
            </div>
          </Link>

          <Link
            to="/student/chat"
            className="card p-5 group flex items-start gap-4 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg transition-all"
          >
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform">
              <MessageCircle size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Study Chat
                </h3>
                <ArrowRight size={16} className="text-gray-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                Real-time study group chat with classmates in your department.
              </p>
              <span className="inline-block mt-3 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                Open Chat →
              </span>
            </div>
          </Link>

          <Link
            to="/student/stats"
            className="card p-5 group flex items-start gap-4 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-lg transition-all"
          >
            <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-2xl group-hover:scale-110 transition-transform">
              <BarChart3 size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Study Analytics
                </h3>
                <ArrowRight size={16} className="text-gray-400 group-hover:translate-x-1 group-hover:text-amber-600 transition-all" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                Review weekly study hours, quiz scores, and academic badge achievements.
              </p>
              <span className="inline-block mt-3 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                View Report →
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* 4. Main Section: Q&A Community Feed + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Q&A Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>Academic Discussions</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold">
                    {filteredQuestions.length}
                  </span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Ask, answer, and vote on questions from your peers and tutors
                </p>
              </div>

              {/* Feed Tabs */}
              <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    activeTab === 'all' 
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                  }`}
                >
                  All Questions
                </button>
                <button
                  onClick={() => setActiveTab('my')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    activeTab === 'my' 
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                  }`}
                >
                  My Questions
                </button>
              </div>
            </div>

            {/* Search and Category Filter */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative sm:col-span-2">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="relative">
                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Questions List */}
            <div className="mt-6 space-y-4">
              {loadingQuestions ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading academic questions...</p>
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="text-center py-12 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-6">
                  <HelpCircle size={40} className="mx-auto text-gray-400 mb-2 opacity-60" />
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">No questions found</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                    {searchTerm || selectedCategory !== 'all' 
                      ? 'Try adjusting your search keywords or topic filter.'
                      : 'Be the first scholar to ask a question in this department!'}
                  </p>
                  <button
                    onClick={() => setShowAskModal(true)}
                    className="mt-4 px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Post a Question
                  </button>
                </div>
              ) : (
                filteredQuestions.map(question => {
                  const isExpanded = expandedQuestionId === question.id;
                  const isAnswering = answeringQuestionId === question.id;
                  const answersCount = question.answers?.length || 0;
                  const voteState = userVotes[question.id];

                  return (
                    <div 
                      key={question.id} 
                      className="rounded-xl border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800/90 p-5 shadow-sm hover:shadow transition-all"
                    >
                      {/* Question Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            {question.category || 'General'}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={12} />
                            {question.createdAt ? new Date(question.createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                          {question.userName && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              by <strong className="font-medium text-gray-700 dark:text-gray-300">{question.userName}</strong>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Question Title & Body */}
                      <h3 className="font-bold text-base text-gray-900 dark:text-white mt-2">
                        {question.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed whitespace-pre-line">
                        {question.content}
                      </p>

                      {/* Action Bar */}
                      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          {/* Upvote Button */}
                          <button
                            onClick={() => handleVote(question.id, 'up')}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                              voteState === 'up'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 ring-1 ring-emerald-500'
                                : 'bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                            }`}
                          >
                            <ThumbsUp size={14} className={voteState === 'up' ? 'fill-emerald-600' : ''} />
                            <span>{question.upvotes || 0}</span>
                          </button>

                          {/* Downvote Button */}
                          <button
                            onClick={() => handleVote(question.id, 'down')}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                              voteState === 'down'
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 ring-1 ring-rose-500'
                                : 'bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                            }`}
                          >
                            <ThumbsDown size={14} className={voteState === 'down' ? 'fill-rose-600' : ''} />
                            <span>{question.downvotes || 0}</span>
                          </button>

                          {/* Toggle Answers view */}
                          <button
                            onClick={() => setExpandedQuestionId(isExpanded ? null : question.id)}
                            className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium ml-1"
                          >
                            <MessageSquare size={14} />
                            <span>{answersCount} {answersCount === 1 ? 'Answer' : 'Answers'}</span>
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </div>

                        {/* Answer Button */}
                        <button
                          onClick={() => {
                            setAnsweringQuestionId(isAnswering ? null : question.id);
                            if (!isExpanded) setExpandedQuestionId(question.id);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
                        >
                          {isAnswering ? 'Cancel' : 'Write Answer'}
                        </button>
                      </div>

                      {/* Inline Answering Drawer */}
                      {isAnswering && (
                        <form 
                          onSubmit={(e) => handleInlineAnswerSubmit(e, question.id)}
                          className="mt-4 p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-3"
                        >
                          <label className="block text-xs font-bold text-blue-900 dark:text-blue-300">
                            Your Solution / Answer
                          </label>
                          <textarea
                            rows={3}
                            value={answerContent}
                            onChange={(e) => setAnswerContent(e.target.value)}
                            placeholder="Write a clear, helpful explanation or step-by-step solution..."
                            className="w-full p-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setAnsweringQuestionId(null)}
                              className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={submittingAnswer || !answerContent.trim()}
                              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                            >
                              <Send size={12} />
                              <span>{submittingAnswer ? 'Posting...' : 'Post Answer'}</span>
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Expanded Answers List */}
                      {isExpanded && (
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/80 space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Answers ({answersCount})
                          </h4>

                          {answersCount === 0 ? (
                            <p className="text-xs text-gray-500 italic">
                              No answers yet. Be the first to help your fellow student!
                            </p>
                          ) : (
                            question.answers.map((ans, idx) => (
                              <div 
                                key={ans.id || idx}
                                className="p-3.5 rounded-lg bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 space-y-1.5"
                              >
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                  <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                    <User size={12} /> {ans.userName || 'Scholar'}
                                  </span>
                                  <span>{ans.createdAt ? new Date(ans.createdAt).toLocaleDateString() : 'Recent'}</span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                                  {ans.content}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Side Widgets */}
        <div className="space-y-6">
          {/* Quick AI Assistant Assistant Widget */}
          <div className="card p-5 bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-purple-950/30 dark:via-gray-800 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800/40">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold">
              <Sparkles size={18} />
              <span>AI Study Prompt</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Stuck on a tricky concept or coding problem? Ask our AI assistant immediately:
            </p>
            <form onSubmit={handleQuickAiSubmit} className="mt-3 space-y-2">
              <input
                type="text"
                value={quickAiPrompt}
                onChange={(e) => setQuickAiPrompt(e.target.value)}
                placeholder="e.g. Explain Binary Search Trees..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!quickAiPrompt.trim()}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 transition disabled:opacity-50"
              >
                <Sparkles size={13} />
                <span>Launch AI Assistant</span>
              </button>
            </form>
          </div>

          {/* Daily Study Tip Widget */}
          <div className="card p-5 border-amber-200 dark:border-amber-800/40 bg-amber-50/40 dark:bg-amber-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                <BookmarkCheck size={18} />
                <span>Daily Study Tip</span>
              </div>
              <button
                onClick={() => setCurrentTipIndex((prev) => (prev + 1) % STUDY_TIPS.length)}
                className="text-xs text-amber-700 dark:text-amber-400 hover:underline font-semibold"
              >
                Next Tip →
              </button>
            </div>
            <h4 className="font-bold text-xs text-gray-900 dark:text-white mt-3">
              {STUDY_TIPS[currentTipIndex].title}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
              {STUDY_TIPS[currentTipIndex].desc}
            </p>
          </div>

          {/* Nigerian Faculty Directory Card */}
          <div className="card p-5">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <GraduationCap size={18} className="text-blue-600" />
              <span>University Faculties</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Explore syllabus topics across all 6 faculties:
            </p>
            <div className="mt-3 space-y-2">
              {faculties.map((fac) => (
                <div 
                  key={fac.id}
                  className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/30 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedCategory(fac.departments[0]?.toLowerCase().split(' ')[0] || 'all')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {fac.shortName}
                    </span>
                    <span className="text-[10px] text-gray-500 bg-gray-200/60 dark:bg-gray-600 px-1.5 py-0.5 rounded">
                      {fac.departments.length} depts
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {fac.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Modal: Ask Question */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg">
                  <Plus size={18} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Ask an Academic Question</h3>
              </div>
              <button
                onClick={() => setShowAskModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <QuestionAskForm onQuestionAsked={handleQuestionAsked} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
