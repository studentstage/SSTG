import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { qaService } from '../../services/api/qa';
import { toast } from 'react-hot-toast';

const AnswerForm = ({ questionId, onAnswerSubmitted }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
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

        if (!content.trim()) {
          throw new Error('Answer cannot be empty');
        }

        if (content.trim().length < 10) {
          throw new Error('Answer must be at least 10 characters long');
        }

        if (content.trim().length > 2000) {
          throw new Error('Answer must not exceed 2000 characters');
        }

        // Call the actual API endpoint
        const answerData = {
          questionId,
          content: content.trim(),
          userId: user.id || user.user?.id,
          userName: user.username || user.user?.username || 'Anonymous',
          createdAt: new Date().toISOString()
        };

        const response = await qaService.submitAnswer(questionId, answerData);

        // Call the onAnswerSubmitted callback to notify parent
        if (onAnswerSubmitted) {
          onAnswerSubmitted(response);
        }

        // Reset form
        setContent('');

        toast.success('Answer submitted successfully!');
      } catch (err) {
        setError(err.message || 'Failed to submit answer');
        toast.error('Failed to submit answer');
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Answer Question
      </h2>
      
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Answer
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Provide a helpful and detailed answer..."
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Answer'}
        </button>
      </form>
    </div>
  );
};

export default AnswerForm;