import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageSquare, Clock, ThumbsUp, ThumbsDown, 
  Eye, X, CheckCircle, AlertCircle, User,
  Filter, Search, ArrowLeft, ExternalLink, Sparkles
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
  const [filterStatus, setFilterStatus] = useState('all'); // all | accepted
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Fetch questions and extract answers
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const questionsData = await qaService.getQuestions();
      const questionsList = Array.isArray(questionsData) ? questionsData : [];
      setQuestions(questionsList);

      const allAnswers = [];
      questionsList.forEach(question => {
        if (question.answers && question.answers.length > 0) {
          question.answers.forEach(answer => {
            allAnswers.push({
              ...answer,
              questionId: question.id,
              questionTitle: question.title,
              questionCategory: question.category || 'General'
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
  const filteredAnswers = useMemo(() => {
    let filtered = answers.filter(answer => {
      const matchesSearch = 
        answer.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        answer.questionTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        answer.userName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || (filterStatus === 'accepted' && answer.isAccepted);
      const matchesCategory = categoryFilter === 'all' || answer.questionCategory?.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesCategory;
    });

    filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return filtered;
  }, [answers, searchTerm, filterStatus, categoryFilter]);

  const stats = useMemo(() => {
    return {
      totalAnswers: answers.length,
      answeredQuestions: new Set(answers.map(a => a.questionId)).size,
      recentAnswers: answers.filter(a => {
        const daysDiff = (new Date() - new Date(a.createdAt)) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
      }).length
    };
  }, [answers]);

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
              Solutions & Answers Directory
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 ml-7">
            Review solutions and explanations posted by tutors and scholars across all topics.
          </p>
        </div>

        <Link
          to="/student/questions"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition active:scale-95 self-start sm:self-auto"
        >
          <MessageSquare size={16} />
          <span>Browse All Questions</span>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center justify-between">
          <div>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {stats.totalAnswers}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total Solutions</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
            <MessageSquare size={20} />
          </div>
        </div>

        <div className="card p-4 flex items-center justify-between">
          <div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.answeredQuestions}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Resolved Inquiries</p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <CheckCircle size={20} />
          </div>
        </div>

        <div className="card p-4 flex items-center justify-between col-span-2 lg:col-span-1">
          <div>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {stats.recentAnswers}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Posted This Week</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl">
            <Clock size={20} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="relative sm:col-span-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search solutions, authors, or question titles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Disciplines</option>
              <option value="programming">Programming</option>
              <option value="mathematics">Mathematics</option>
              <option value="science">Science</option>
              <option value="agriculture">Agriculture</option>
              <option value="engineering">Engineering</option>
            </select>
          </div>
        </div>
      </div>

      {/* Answers List */}
      {loading ? (
        <div className="card p-12 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">Loading academic solutions...</p>
        </div>
      ) : error ? (
        <div className="card p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          <button
            onClick={fetchData}
            className="mt-3 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition"
          >
            Retry Fetching
          </button>
        </div>
      ) : filteredAnswers.length === 0 ? (
        <div className="card p-12 text-center">
          <MessageSquare size={44} className="mx-auto text-gray-400 mb-2 opacity-50" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            No solutions found
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
            {searchTerm || categoryFilter !== 'all'
              ? 'Try modifying your search or discipline filter.'
              : 'Browse questions in the community to post the first solution!'}
          </p>
          <Link
            to="/student/questions"
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition"
          >
            <MessageSquare size={16} />
            <span>Open Questions Feed</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnswers.map((answer, index) => (
            <div
              key={`${answer.questionId}-${answer.id || index}`}
              className="card p-5 sm:p-6 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
            >
              {/* Question Header & Category */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                      {answer.questionCategory}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} />
                      {answer.createdAt ? new Date(answer.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  <Link
                    to={`/student/questions?id=${answer.questionId}`}
                    className="text-base font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1.5 group"
                  >
                    <span>Question: {answer.questionTitle}</span>
                    <ExternalLink size={14} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </Link>
                </div>
              </div>

              {/* Solution Body */}
              <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 mb-3 border border-gray-100 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Solution Provided:
                </p>
                <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                  {answer.content}
                </p>
              </div>

              {/* Author Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2">
                <div className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                  <User size={14} className="text-blue-500" />
                  <span>Answered by {answer.userName || 'Scholar'}</span>
                </div>

                <Link
                  to={`/student/questions?id=${answer.questionId}`}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Full Thread →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnswersPage;