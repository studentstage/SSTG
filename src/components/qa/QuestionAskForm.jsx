import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { qaService } from '../../services/api/qa';
import { toast } from 'react-hot-toast';

const QuestionAskForm = ({ onQuestionAsked }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'english', label: 'English' },
    { value: 'history', label: 'History' },
    { value: 'programming', label: 'Programming' },
    { value: 'other', label: 'Other' }
  ];

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
         throw new Error('Please select a category');
       }

       // Call the actual API endpoint
       const questionData = {
         title: title.trim(),
         content: content.trim(),
         category,
         userId: user.id || user.user?.id,
         createdAt: new Date().toISOString()
       };

       const response = await qaService.askQuestion(questionData);

       // Call the onQuestionAsked callback to notify parent
       if (onQuestionAsked) {
         onQuestionAsked(response);
       }

       // Reset form
       setTitle('');
       setContent('');
       setCategory('');

       toast.success('Question asked successfully!');
     } catch (err) {
       setError(err.message || 'Failed to ask question');
       toast.error('Failed to ask question');
     } finally {
       setLoading(false);
     }
   };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Ask a Question
      </h2>
      
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Question Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a clear, concise title for your question"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Question Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Question Details
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Provide detailed context for your question..."
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !title || !content || !category}
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Asking...' : 'Ask Question'}
        </button>
      </form>
    </div>
  );
};

export default QuestionAskForm;