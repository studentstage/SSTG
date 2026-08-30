import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, Search, Filter, Clock, MessageSquare, 
  ThumbsUp, ThumbsDown, X, ArrowLeft, Send, User, 
  HelpCircle, CheckCircle2, ChevronDown, ChevronUp,
  Sparkles, RefreshCw, GraduationCap
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { qaService } from '../../../services/api/qa';
import { toast } from 'react-hot-toast';
import QuestionAskForm from '../../../components/qa/QuestionAskForm';
import { faculties } from '../../../config/academics';

const QuestionsPage = () => {
  const { user, username } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modals & Active question state
  const [showAskModal, setShowAskModal] = useState(false);
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [answeringQuestionId, setAnsweringQuestionId] = useState(null);
  const [answerContent, setAnswerContent] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'my'
  
  // Voting state
  const [userVotes, setUserVotes] = useState({});

  // Question target ref for deep linking
  const questionRefs = useRef({});

  const userDetails = useMemo(() => {
    return {
      id: user?.id || user?.user?.id || 'demo-student',
      username: user?.username || user?.user?.username || username || 'Student',
    };
  }, [user, username]);

  // Fetch Questions
  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await qaService.getQuestions();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching questions:', err);
      toast.error('Failed to load questions from backend');
      setError(err.message || 'Failed to load questions');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Deep Link handling from URL query params `?id=101`
  useEffect(() => {
    const targetId = searchParams.get('id');
    if (targetId && questions.length > 0) {
      const numId = Number(targetId) || targetId;
      setExpandedQuestionId(numId);
      
      // Smooth scroll to target question element
      setTimeout(() => {
        const el = questionRefs.current[numId];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-2', 'ring-blue-500');
          setTimeout(() => el.classList.remove('ring-2', 'ring-blue-500'), 3000);
        }
      }, 200);
    }
  }, [searchParams, questions]);

  // Handle Question Asked
  const handleQuestionAsked = (newQuestion) => {
    setQuestions(prev => [newQuestion, ...prev]);
    setShowAskModal(false);
    toast.success('Your question is live!');
  };

  // Handle Upvote / Downvote
  const handleVote = async (questionId, type) => {
    const currentVote = userVotes[questionId];
    if (currentVote === type) {
      toast('Vote already recorded', { icon: 'ℹ️' });
      return;
    }

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
      console.log('Vote recorded locally');
    }
  };

  // Handle Submit Answer
  const handleAnswerSubmit = async (e, questionId) => {
    e.preventDefault();
    if (!answerContent.trim()) return;
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
      } catch (err) {
        newAnswer = { id: Date.now(), ...answerPayload };
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
      setExpandedQuestionId(questionId);
      toast.success('Your answer has been submitted!');
    } catch (err) {
      toast.error('Failed to submit answer');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // Filter and sort questions
  const filteredQuestions = useMemo(() => {
    let filtered = questions.filter(q => {
      const matchesSearch = 
        q.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = filterCategory === 'all' || 
        q.category?.toLowerCase() === filterCategory.toLowerCase();

      const matchesTab = activeTab === 'all' || 
        (q.userId === userDetails.id || q.userName === userDetails.username);

      return matchesSearch && matchesCategory && matchesTab;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'mostAnswers':
          return (b.answers?.length || 0) - (a.answers?.length || 0);
        case 'mostUpvoted':
          return (b.upvotes || 0) - (a.upvotes || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [questions, searchTerm, filterCategory, sortBy, activeTab, userDetails]);

  // Dynamic statistics
  const stats = useMemo(() => {
    const total = questions.length;
    const userQuestions = questions.filter(q => 
      q.userId === userDetails.id || q.userName === userDetails.username
    ).length;
    const answersTotal = questions.reduce((sum, q) => sum + (q.answers?.length || 0), 0);
    const answeredCount = questions.filter(q => (q.answers?.length || 0) > 0).length;

    return { total, userQuestions, answersTotal, answeredCount };
  }, [questions, userDetails]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Academic Q&A Hub
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 ml-7">
            Browse inquiries, provide solutions, and collaborate with scholars across all university faculties.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => setShowAskModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <Plus size={18} />
            <span>Ask Question</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats.total}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total Questions</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{stats.userQuestions}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">My Questions</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.answersTotal}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Solutions Provided</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.answeredCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Answered Inquiries</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-700/60">
          {/* Tabs */}
          <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'all' 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              All Questions ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'my' 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              My Inquiries ({stats.userQuestions})
            </button>
          </div>

          <div className="text-xs text-gray-500">
            Showing <strong className="text-gray-700 dark:text-gray-300">{filteredQuestions.length}</strong> questions
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by topic, formula, or question keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="relative sm:col-span-3">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Topics & Faculties</option>
              <option value="programming">Programming & Computing</option>
              <option value="mathematics">Mathematics & Statistics</option>
              <option value="science">Natural Sciences</option>
              <option value="engineering">Engineering</option>
              <option value="agriculture">Agriculture</option>
              <option value="english">Use of English</option>
            </select>
          </div>

          {/* Sort */}
          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="newest">Newest Inquiries</option>
              <option value="mostUpvoted">Most Upvoted</option>
              <option value="mostAnswers">Most Answers</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions Feed */}
      {loading ? (
        <div className="card p-12 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">Loading academic questions...</p>
        </div>
      ) : error ? (
        <div className="card p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          <button
            onClick={fetchQuestions}
            className="mt-3 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition"
          >
            Retry Fetching
          </button>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="card p-12 text-center">
          <HelpCircle size={44} className="mx-auto text-gray-400 mb-2 opacity-50" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            No questions found
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
            {searchTerm || filterCategory !== 'all'
              ? 'Try changing your search keywords or category filters.'
              : activeTab === 'my'
              ? "You haven't asked any questions yet. Start by asking your first academic inquiry!"
              : 'Be the first scholar to start an academic discussion!'}
          </p>
          <button
            onClick={() => setShowAskModal(true)}
            className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition"
          >
            Ask a Question Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((question) => {
            const isExpanded = expandedQuestionId === question.id;
            const isAnswering = answeringQuestionId === question.id;
            const answersCount = question.answers?.length || 0;
            const voteState = userVotes[question.id];

            return (
              <div
                key={question.id}
                ref={el => questionRefs.current[question.id] = el}
                className="card p-5 sm:p-6 transition-all border border-gray-200 dark:border-gray-700 hover:shadow-md"
              >
                {/* Header Tag and Meta */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {question.category || 'General'}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} />
                      {question.createdAt ? new Date(question.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent'}
                    </span>
                    {question.userName && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        by <strong className="font-medium text-gray-700 dark:text-gray-300">{question.userName}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Content */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                  {question.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1.5 leading-relaxed whitespace-pre-line">
                  {question.content}
                </p>

                {/* Footer Actions */}
                <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    {/* Upvote */}
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

                    {/* Downvote */}
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
                      className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold ml-1"
                    >
                      <MessageSquare size={14} />
                      <span>{answersCount} {answersCount === 1 ? 'Solution' : 'Solutions'}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  {/* Write Solution Button */}
                  <button
                    onClick={() => {
                      setAnsweringQuestionId(isAnswering ? null : question.id);
                      if (!isExpanded) setExpandedQuestionId(question.id);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
                  >
                    {isAnswering ? 'Close Editor' : 'Provide Solution'}
                  </button>
                </div>

                {/* Inline Answering Drawer */}
                {isAnswering && (
                  <form 
                    onSubmit={(e) => handleAnswerSubmit(e, question.id)}
                    className="mt-4 p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-3 animate-fadeIn"
                  >
                    <label className="block text-xs font-bold text-blue-900 dark:text-blue-300">
                      Write your solution / explanation
                    </label>
                    <textarea
                      rows={4}
                      value={answerContent}
                      onChange={(e) => setAnswerContent(e.target.value)}
                      placeholder="Explain the solution clearly with formulas, reasoning, or references..."
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
                        <span>{submittingAnswer ? 'Submitting...' : 'Post Solution'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Expanded Answers List */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/80 space-y-3 animate-fadeIn">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Community Solutions ({answersCount})
                    </h4>

                    {answersCount === 0 ? (
                      <p className="text-xs text-gray-500 italic">
                        No answers posted yet. You can be the first to help!
                      </p>
                    ) : (
                      question.answers.map((ans, idx) => (
                        <div 
                          key={ans.id || idx}
                          className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                              <User size={13} className="text-blue-500" />
                              {ans.userName || 'Scholar'}
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
          })}
        </div>
      )}

      {/* Ask Question Modal */}
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

export default QuestionsPage;