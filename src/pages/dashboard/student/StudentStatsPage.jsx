import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, HelpCircle, MessageSquare, 
  BookOpen, Video, Award, Clock, Calendar, Target,
  BarChart3, LineChart, PieChart, Activity, Users,
  Star, Medal, Trophy, Zap, Brain
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const StudentStatsPage = () => {
  const { user } = useAuth();
  
  const statsData = {
    questions: {
      total: 24,
      thisMonth: 8,
      lastMonth: 6,
      trend: 33,
      unanswered: 3,
      answered: 21,
      categories: [
        { name: 'Mathematics', count: 10 },
        { name: 'Programming', count: 8 },
        { name: 'Science', count: 4 },
        { name: 'English', count: 2 }
      ]
    },
    answers: {
      total: 45,
      thisMonth: 12,
      lastMonth: 10,
      trend: 20,
      accepted: 28,
      pending: 17,
      upvotes: 156,
      downvotes: 12
    },
    learning: {
      booksRead: 8,
      videosWatched: 15,
      totalHours: 42,
      thisWeek: 8,
      streak: 5,
      longestStreak: 14,
      categories: [
        { name: 'Programming', hours: 18 },
        { name: 'Mathematics', hours: 12 },
        { name: 'Science', hours: 8 },
        { name: 'English', hours: 4 }
      ]
    },
    activity: {
      daysActive: 28,
      lastActive: '2024-01-15',
      averageDaily: 1.5,
      peakHours: '6PM - 9PM',
      weeklyData: [
        { day: 'Mon', questions: 2, answers: 3, hours: 2 },
        { day: 'Tue', questions: 1, answers: 2, hours: 1.5 },
        { day: 'Wed', questions: 3, answers: 4, hours: 3 },
        { day: 'Thu', questions: 1, answers: 1, hours: 1 },
        { day: 'Fri', questions: 2, answers: 3, hours: 2.5 },
        { day: 'Sat', questions: 0, answers: 2, hours: 1 },
        { day: 'Sun', questions: 1, answers: 1, hours: 1 }
      ]
    },
    achievements: [
      { id: 1, name: 'Curious Mind', description: 'Asked 10 questions', icon: '🧠', earned: true, date: '2024-01-10' },
      { id: 2, name: 'Helpful Hand', description: 'Received 20 upvotes on answers', icon: '🤝', earned: true, date: '2024-01-08' },
      { id: 3, name: 'Bookworm', description: 'Read 5 books', icon: '📚', earned: true, date: '2024-01-05' },
      { id: 4, name: 'Video Learner', description: 'Watched 10 videos', icon: '🎬', earned: true, date: '2024-01-03' },
      { id: 5, name: 'Consistent', description: '7-day learning streak', icon: '🔥', earned: false, progress: 5, goal: 7 },
      { id: 6, name: 'Expert', description: 'Answer accepted 10 times', icon: '⭐', earned: false, progress: 8, goal: 10 }
    ]
  };

  const StatCard = ({ title, value, subtitle, trend, icon: Icon, color }) => {
    const colorClasses = {
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    };

    return (
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`w-10 h-10 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
            <Icon size={20} />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center space-x-1 text-sm ${trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    );
  };

  const ProgressBar = ({ value, max, color = 'blue' }) => {
    const percentage = (value / max) * 100;
    const colorClasses = {
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      purple: 'bg-purple-600',
      yellow: 'bg-yellow-600'
    };

    return (
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${colorClasses[color]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <BarChart3 size={28} className="text-blue-600 dark:text-blue-400" />
            <span>My Statistics</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your learning progress and achievements
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar size={18} className="text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Questions" 
          value={statsData.questions.total}
          subtitle={`${statsData.questions.thisMonth} this month`}
          trend={statsData.questions.trend}
          icon={HelpCircle}
          color="blue"
        />
        <StatCard 
          title="Total Answers" 
          value={statsData.answers.total}
          subtitle={`${statsData.answers.accepted} accepted`}
          trend={statsData.answers.trend}
          icon={MessageSquare}
          color="green"
        />
        <StatCard 
          title="Learning Hours" 
          value={statsData.learning.totalHours}
          subtitle={`${statsData.learning.thisWeek} this week`}
          icon={Clock}
          color="purple"
        />
        <StatCard 
          title="Day Streak" 
          value={statsData.learning.streak}
          subtitle={`Best: ${statsData.learning.longestStreak} days`}
          icon={Zap}
          color="yellow"
        />
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Questions Breakdown */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <HelpCircle size={20} className="text-blue-600 dark:text-blue-400" />
            <span>Questions Breakdown</span>
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{statsData.questions.answered}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Answered</p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{statsData.questions.unanswered}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Unanswered</p>
            </div>
          </div>
          <div className="space-y-3">
            {statsData.questions.categories.map((cat, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{cat.name}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{cat.count}</span>
                </div>
                <ProgressBar value={cat.count} max={statsData.questions.total} color="blue" />
              </div>
            ))}
          </div>
        </div>

        {/* Learning Progress */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <BookOpen size={20} className="text-green-600 dark:text-green-400" />
            <span>Learning Progress</span>
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{statsData.learning.booksRead}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Books</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{statsData.learning.videosWatched}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Videos</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{statsData.learning.totalHours}h</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Hours</p>
            </div>
          </div>
          <div className="space-y-3">
            {statsData.learning.categories.map((cat, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{cat.name}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{cat.hours}h</span>
                </div>
                <ProgressBar value={cat.hours} max={statsData.learning.totalHours} color="green" />
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Activity size={20} className="text-purple-600 dark:text-purple-400" />
            <span>Weekly Activity</span>
          </h3>
          <div className="flex items-end justify-between h-40 space-x-2">
            {statsData.activity.weeklyData.map((day, index) => {
              const maxHeight = Math.max(...statsData.activity.weeklyData.map(d => d.hours));
              const height = (day.hours / maxHeight) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-purple-100 dark:bg-purple-900/30 rounded-t-md relative" style={{ height: `${height}%` }}>
                    <div className="absolute bottom-0 w-full bg-purple-600 dark:bg-purple-400 rounded-t-md transition-all duration-300" style={{ height: '100%' }} />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{day.day}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{day.hours}h</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-600 rounded-full" />
                <span className="text-gray-600 dark:text-gray-400">Questions: {statsData.activity.weeklyData.reduce((a, b) => a + b.questions, 0)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-600 rounded-full" />
                <span className="text-gray-600 dark:text-gray-400">Answers: {statsData.activity.weeklyData.reduce((a, b) => a + b.answers, 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Clock size={20} className="text-yellow-600 dark:text-yellow-400" />
            <span>Activity Summary</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar size={18} className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Days Active</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{statsData.activity.daysActive} days</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock size={18} className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Daily Average</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{statsData.activity.averageDaily} hours</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Activity size={18} className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Peak Hours</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{statsData.activity.peakHours}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users size={18} className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Total Upvotes</span>
              </div>
              <span className="font-semibold text-green-600 dark:text-green-400">+{statsData.answers.upvotes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <Trophy size={20} className="text-yellow-600 dark:text-yellow-400" />
          <span>Achievements</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statsData.achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={`p-4 rounded-lg border ${
                achievement.earned 
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' 
                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`text-3xl ${!achievement.earned && 'opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${achievement.earned ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                    {achievement.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </p>
                  {achievement.earned ? (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                      Earned on {achievement.date}
                    </p>
                  ) : (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Progress</span>
                        <span className="text-gray-600 dark:text-gray-400">{achievement.progress}/{achievement.goal}</span>
                      </div>
                      <ProgressBar value={achievement.progress} max={achievement.goal} color="yellow" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentStatsPage;