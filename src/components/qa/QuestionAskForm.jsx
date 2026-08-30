import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { qaService } from '../../services/api/qa';
import { toast } from 'react-hot-toast';
import { faculties } from '../../config/academics';

const QuestionAskForm = ({ onQuestionAsked }) => {
  const { user, username } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Form validation
      if (!title.trim()) {
        throw new Error('Question title is required');
      }

      if (title.trim().length < 5) {
        throw new Error('Question title must be at least 5 characters long');
      }

      if (title.trim().length > 200) {
        throw new Error('Question title must not exceed 200 characters');
      }

      if (!content.trim()) {
        throw new Error('Question details are required');
      }

      if (content.trim().length < 10) {
        throw new Error('Question details must be at least 10 characters long');
      }

      if (!category) {
        throw new Error('Please select a category or department');
      }

      const questionData = {
        title: title.trim(),
        content: content.trim(),
        category,
        userId: user.id || user.user?.id || 'demo-student',
        userName: user.username || user.user?.username || username || 'Student',
        createdAt: new Date().toISOString()
      };

      const response = await qaService.askQuestion(questionData);

      if (onQuestionAsked) {
        onQuestionAsked(response);
      }

      // Reset form
      setTitle('');
      setContent('');
      setCategory('');

      toast.success('Question posted successfully!');
    } catch (err) {
      setError(err.message || 'Failed to post question');
      toast.error(err.message || 'Failed to post question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Ask an Academic Question
      </h2>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Post your inquiry to university tutors and fellow scholars in your faculty.
      </p>
      
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Question Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. How does Dijkstra's Algorithm guarantee shortest path in DAGs?"
            className="w-full px-3.5 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Academic Category / Department
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={loading}
            required
          >
            <option value="">Select Category or University Department</option>
            <optgroup label="General & Core Disciplines">
              <option value="programming">Computer Programming & Algorithms</option>
              <option value="mathematics">Pure & Applied Mathematics</option>
              <option value="science">Natural & Applied Science</option>
              <option value="engineering">General Engineering</option>
              <option value="agriculture">Agriculture & Agronomy</option>
              <option value="english">Use of English & Communication</option>
            </optgroup>
            {faculties.map((fac) => (
              <optgroup key={fac.id} label={fac.name}>
                {fac.departments.map((dept) => (
                  <option key={dept} value={dept.toLowerCase().replace(/\s+/g, '-')}>
                    {dept}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Question Details & Context
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Provide relevant code snippets, formulas, lecture context, or what you've tried so far..."
            rows={5}
            className="w-full px-3.5 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !title || !content || !category}
          className="w-full flex justify-center py-2.5 px-4 rounded-lg font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 shadow-sm active:scale-[0.99]"
        >
          {loading ? 'Posting Question...' : 'Submit Academic Question'}
        </button>
      </form>
    </div>
  );
};

export default QuestionAskForm;