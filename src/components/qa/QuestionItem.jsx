import React from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Clock } from 'lucide-react';

const QuestionItem = ({ question, onQuestionClick, onAnswerSubmit }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="card p-4 border-l-4 border-blue-500 hover:border-l-4 hover:border-blue-600 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {question.title}
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(question.createdAt)}
        </span>
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
        {question.content}
      </p>
      
      <div className="flex flex-wrap gap-4 mb-3">
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
          {question.category}
        </span>
        
        <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
          <span>
            <ThumbsUp size={16} className="mr-1" />
            {question.upvotes || 0}
          </span>
          <span>
            <ThumbsDown size={16} className="mr-1" />
            {question.downvotes || 0}
          </span>
          <span>
            <MessageSquare size={16} className="mr-1" />
            {question.answers?.length || 0} Answers
          </span>
        </div>
      </div>
      
      {question.answers && question.answers.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">
            Answers ({question.answers.length})
          </p>
          <div className="space-y-2">
            {question.answers.map((answer, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {answer.content}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  By {answer.userName || 'Anonymous'} • 
                  {formatDate(answer.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <button
        onClick={() => onQuestionClick && onQuestionClick(question.id)}
        className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        {question.answers && question.answers.length > 0 ? 'View Answers' : 'Answer Question'}
      </button>
    </div>
  );
};

export default QuestionItem;