import React from 'react';
import QuestionItem from './QuestionItem';

const QuestionList = ({ questions, onQuestionClick, onAnswerSubmit }) => {
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          No questions found. Be the first to ask a question!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map(question => (
        <QuestionItem
          key={question.id}
          question={question}
          onQuestionClick={onQuestionClick}
          onAnswerSubmit={onAnswerSubmit}
        />
      ))}
    </div>
  );
};

export default QuestionList;