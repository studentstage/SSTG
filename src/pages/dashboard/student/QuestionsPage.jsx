import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Clock, MessageSquare, 
  ThumbsUp, ThumbsDown, Eye, X, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { qaService } from '../../../services/api/qa';
import { toast } from 'react-hot-toast';
import QuestionAskForm from '../../../components/qa/QuestionAskForm';
import AnswerForm from '../../../components/qa/AnswerForm';

const QuestionsPage = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAskForm, setShowAskForm] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'english', label: 'English' },
    { value: 'history', label: 'History' },
    { value: 'programming', label: 'Programming' },
    { value: 'other', label: 'Other' }
  ];

  // Fetch user's questions
  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all questions (API should return only user's questions based on token)
      const data = await qaService.getQuestions();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching questions:', err);
      toast.error('Failed to load your questions');
      setError(err.message || 'Failed to load questions');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Handle question asked
  const handleQuestionAsked = (newQuestion) => {
    setQuestions(prev => [newQuestion, ...prev]);
    setShowAskForm(false);
    toast.success('Question posted successfully!');
  };

  // Handle question click
  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
  };

  // Handle answer submitted
  const handleAnswerSubmitted = (answer) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === selectedQuestion?.id) {
        return {
          ...q,
          answers: [...(q.answers || []), answer]
        };
      }
      return q;
    }));
    setSelectedQuestion(null);
    fetchQuestions(); // Refresh to get latest data
  };

  // Filter and sort questions
  const getFilteredQuestions = () => {
    let filtered = [...questions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(q => q.category === filterCategory);
    }

    // Sort
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
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredQuestions = getFilteredQuestions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Questions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage your questions
          </p>
        </div>
        <button
          onClick={() => setShowAskForm(!showAskForm)}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          <span>Ask Question</span>
        </button>
      </div>

      {/* Ask Question Form */}
      {showAskForm && (
        <div className="relative">
          <button
            onClick={() => setShowAskForm(false)}
            className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
          <QuestionAskForm onQuestionAsked={handleQuestionAsked} />
        </div>
      )}

      {/* Selected Question with Answer Form */}
      {selectedQuestion && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Answering: {selectedQuestion.title}
            </h3>
            <button
              onClick={() => setSelectedQuestion(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>
          <AnswerForm 
            questionId={selectedQuestion.id} 
            onAnswerSubmitted={handleAnswerSubmitted} 
          />
        </div>
      )}

      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="mostAnswers">Most Answers</option>
              <option value="mostUpvoted">Most Upvoted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="card p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your questions...</p>
        </div>
      ) : error ? (
        <div className="card p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={fetchQuestions}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No questions yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't asked any questions yet. Start by asking your first question!
          </p>
          <button
            onClick={() => setShowAskForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Ask Your First Question</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <div
              key={question.id}
              className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleQuestionClick(question)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                      {question.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      <Clock size={12} className="inline mr-1" />
                      {formatDate(question.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {question.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                    {question.content}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                  <MessageSquare size={16} />
                  <span className="text-sm">{question.answers?.length || 0}</span>
                </div>
                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                  <ThumbsUp size={16} />
                  <span className="text-sm">{question.upvotes || 0}</span>
                </div>
                <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                  <ThumbsDown size={16} />
                  <span className="text-sm">{question.downvotes || 0}</span>
                </div>
                <div className="ml-auto text-blue-600 dark:text-blue-400 text-sm font-medium">
                  Click to view details
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {questions.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Questions</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {questions.reduce((sum, q) => sum + (q.answers?.length || 0), 0)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Answers</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {questions.reduce((sum, q) => sum + (q.upvotes || 0), 0)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Upvotes</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {questions.filter(q => (q.answers?.length || 0) > 0).length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Answered</p>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;