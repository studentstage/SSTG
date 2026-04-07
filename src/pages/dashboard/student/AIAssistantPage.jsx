import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, User, Trash2, BookOpen, Lightbulb, 
  Code, Calculator, CheckCircle, Copy, RefreshCw,
  Sparkles, MessageSquare, History, X
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const mockAIResponses = {
  'math': `To solve this problem, let's break it down step by step:

1. First, identify what we're given
2. Apply the appropriate formula or method
3. Solve step by step
4. Verify the answer

Would you like me to show you the detailed steps?`,

  'code': `Here's how you can approach this programming problem:

**Code Example:**

// Step 1: Define the problem
// Step 2: Plan your solution
// Step 3: Implement the code

function solution() {
  // Your code here
}

Would you like me to explain this further or help you with a specific part?`,

  'explain': `I'd be happy to explain this concept!

**Key Points:**
- Start with the basics
- Build up to more complex ideas
- Connect new concepts to what you already know

Would you like me to elaborate on any specific part?`,

  'default': `I understand you're asking about this topic. Let me help you break it down:

1. **Understanding the basics**: Start with fundamental concepts
2. **Practical application**: See how it works in real scenarios
3. **Practice**: Apply what you've learned

Would you like me to provide more specific guidance or examples?`
};

const AIAssistantPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `Hello! I'm your AI learning assistant. I'm here to help you with:

- **Math & Science** - Solve problems step by step
- **Programming** - Write and debug code
- **Concept Explanation** - Break down complex topics
- **Study Tips** - Effective learning strategies

How can I help you today?`,
      timestamp: new Date().toISOString(),
      type: 'greeting'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    setTimeout(() => {
      let responseContent;
      const lowerInput = inputMessage.toLowerCase();

      if (lowerInput.includes('math') || lowerInput.includes('calculate') || lowerInput.includes('solve')) {
        responseContent = mockAIResponses.math;
      } else if (lowerInput.includes('code') || lowerInput.includes('program') || lowerInput.includes('function')) {
        responseContent = mockAIResponses.code;
      } else if (lowerInput.includes('explain') || lowerInput.includes('what is') || lowerInput.includes('how does')) {
        responseContent = mockAIResponses.explain;
      } else {
        responseContent = mockAIResponses.default;
      }

      const aiResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString(),
        type: 'response'
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      toast.success('AI response received');
    }, 1500);
  };

  const handleQuickQuestion = (category) => {
    const questions = {
      math: 'Can you help me solve a math problem?',
      code: 'Can you help me write some code?',
      explain: 'Can you explain a concept to me?',
      tips: 'Can you give me some study tips?'
    };

    setInputMessage(questions[category]);
    setSelectedCategory(category);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: `Hello! I'm your AI learning assistant. I'm here to help you with:

- **Math & Science** - Solve problems step by step
- **Programming** - Write and debug code
- **Concept Explanation** - Break down complex topics
- **Study Tips** - Effective learning strategies

How can I help you today?`,
        timestamp: new Date().toISOString(),
        type: 'greeting'
      }
    ]);
    toast.success('Chat cleared');
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const quickActions = [
    { icon: <Calculator size={20} />, label: 'Math Help', category: 'math', color: 'blue' },
    { icon: <Code size={20} />, label: 'Coding Help', category: 'code', color: 'green' },
    { icon: <Lightbulb size={20} />, label: 'Explain Topic', category: 'explain', color: 'yellow' },
    { icon: <BookOpen size={20} />, label: 'Study Tips', category: 'tips', color: 'purple' }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Bot size={28} className="text-blue-600 dark:text-blue-400" />
            <span>AI Assistant</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Get instant help with your studies
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
              showHistory 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <History size={18} />
            <span>History</span>
          </button>
          <button
            onClick={handleClearChat}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <Trash2 size={18} />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(action.category)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:opacity-80 transition ${colorClasses[action.color]}`}
            >
              {action.icon}
              <span className="font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-2 card flex flex-col h-[600px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-blue-100 dark:bg-blue-900/30' 
                      : 'bg-purple-100 dark:bg-purple-900/30'
                  }`}>
                    {message.role === 'user' ? (
                      <User size={16} className="text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Sparkles size={16} className="text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                  <div className={`flex-1 p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  }`}>
                    <div className="flex items-start justify-between">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <button
                        onClick={() => handleCopyMessage(message.content)}
                        className={`ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                          message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                        }`}
                        title="Copy"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                    <p className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Sparkles size={16} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send size={18} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - History or Tips */}
        <div className="space-y-4">
          {/* Tips Card */}
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
              <Lightbulb size={18} className="text-yellow-600 dark:text-yellow-400" />
              <span>Tips</span>
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span>Be specific with your questions</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span>Break down complex topics</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span>Ask for examples when needed</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span>Practice with exercises</span>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
              <MessageSquare size={18} className="text-blue-600 dark:text-blue-400" />
              <span>Topics I can help with</span>
            </h3>
            <div className="space-y-2">
              {['Mathematics', 'Programming', 'Science', 'English', 'History'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleQuickQuestion(topic.toLowerCase())}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Session Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Messages</span>
                <span className="font-medium text-gray-900 dark:text-white">{messages.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Questions</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {messages.filter(m => m.role === 'user').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;