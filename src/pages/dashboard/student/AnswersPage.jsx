import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Clock, ThumbsUp, ThumbsDown, 
  Eye, X, CheckCircle, AlertCircle, User,
  Filter, Search, ArrowLeft, ExternalLink
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { qaService } from '../../../services/api/qa';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AnswersPage = () => {
  const { user } = useAuth();
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, answered, unanswered
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Fetch questions and answers
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch user's questions
      const questionsData = await qaService.getQuestions();
      const questionsList = Array.isArray(questionsData) ? questionsData : [];
      setQuestions(questionsList);

      // Extract all answers from questions
      const allAnswers = [];
      questionsList.forEach(question => {
        if (question.answers && question.answers.length > 0) {
          question.answers.forEach(answer => {
            allAnswers.push({
              ...answer,
              questionId: question.id,
              questionTitle: question.title,
              questionCategory: question.category
            });
          });
        }
      });

      setAnswers(allAnswers);
    } catch (err) {
      console.error('Error fetching answers:', err);
      toast.error('Failed to load answers');
      setError(err.message || 'Failed to load answers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter and sort answers
  const getFilteredAnswers = () => {
    let filtered = [...answers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(answer => 
        answer.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        answer.questionTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        answer.userName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus === 'answered') {
      filtered = filtered.filter(answer => answer.isAccepted);
    }

    // Sort by newest first
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return filtered;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredAnswers = getFilteredAnswers();

  // Calculate statistics
  const stats = {
    totalAnswers: answers.length,
    answeredQuestions: new Set(answers.map(a => a.questionId)).size,
    acceptedAnswers: answers.filter(a => a.isAccepted).length,
    recentAnswers: answers.filter(a => {
      const daysDiff = (new Date() - new Date(a.createdAt)) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Answers
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View answers received on your questions
          </p>
        </div>
        <Link
          to="/student/questions"
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <ArrowLeft size={18} />
          <span>View My Questions</span>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalAnswers}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Answers</p>
            </div>
            <MessageSquare className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.answeredQuestions}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Answered Questions</p>
            </div>
            <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.acceptedAnswers}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Accepted Answers</p>
            </div>
            <ThumbsUp className="text-yellow-600 dark:text-yellow-400" size={24} />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.recentAnswers}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
            </div>
            <Clock className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Answers</option>
              <option value="accepted">Accepted Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Answers List */}
      {loading ? (
        <div className="card p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading answers...</p>
        </div>
      ) : error ? (
        <div className="card p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : filteredAnswers.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No answers yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't received any answers yet. Ask a question to get started!
          </p>
          <Link
            to="/student/questions"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2"
          >
            <MessageSquare size={18} />
            <span>Ask a Question</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnswers.map((answer) => (
            <div
              key={`${answer.questionId}-${answer.id}`}
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                      {answer.questionCategory}
                    </span>
                    {answer.isAccepted && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full flex items-center space-x-1">
                        <CheckCircle size={12} />
                        <span>Accepted</span>
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/student/questions?id=${answer.questionId}`}
                    className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-2"
                  >
                    <span>{answer.questionTitle}</span>
                    <ExternalLink size={16} className="text-gray-400" />
                  </Link>
                </div>
              </div>

              {/* Answer Content */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {answer.content}
                </p>
              </div>

              {/* Answer Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <User size={16} className="text-gray-600 dark:text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {answer.userName || 'Anonymous'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                    <Clock size={14} />
                    <span className="text-sm">{formatDate(answer.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {answer.upvotes > 0 && (
                    <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                      <ThumbsUp size={16} />
                      <span className="text-sm">{answer.upvotes}</span>
                    </div>
                  )}
                  {answer.downvotes > 0 && (
                    <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                      <ThumbsDown size={16} />
                      <span className="text-sm">{answer.downvotes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Section */}
      {filteredAnswers.length > 0 && (
        <div className="card p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <MessageSquare className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-300">
                Answer Summary
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-400 mt-2">
                You have received <strong>{stats.totalAnswers}</strong> answers across{' '}
                <strong>{stats.answeredQuestions}</strong> questions.{' '}
                {stats.acceptedAnswers > 0 && (
                  <span>
                    <strong>{stats.acceptedAnswers}</strong> answers have been marked as helpful or accepted.
                  </span>
                )}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-500 mt-2">
                Keep engaging with your questions to get more answers from tutors and peers!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswersPage;