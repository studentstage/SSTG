import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Users, MessageSquare, Award, 
  ArrowRight, BarChart3, GraduationCap 
} from 'lucide-react';

const HomePage = () => {
  const stats = [
    { icon: <Users />, label: 'Active Students', value: '1,200+' },
    { icon: <GraduationCap />, label: 'Expert Tutors', value: '50+' },
    { icon: <MessageSquare />, label: 'Questions Answered', value: '5,000+' },
    { icon: <BookOpen />, label: 'Learning Resources', value: '200+' },
  ];
  const newsItems = [
    {
      title: 'Weekly study hall opens to all students',
      summary: 'Live Q&A sessions now run every Friday with rotating tutors.',
      date: 'Sep 10, 2026',
      tag: 'Events',
    },
    {
      title: 'New exam prep packs for science streams',
      summary: 'Updated notes and practice sets for physics and biology.',
      date: 'Sep 08, 2026',
      tag: 'Resources',
    },
    {
      title: 'Top contributors of the month announced',
      summary: 'Congrats to the students who earned the most points.',
      date: 'Sep 05, 2026',
      tag: 'Community',
    },
    {
      title: 'AI assistant now supports step-by-step hints',
      summary: 'Get guided help without full answers when you need it.',
      date: 'Sep 02, 2026',
      tag: 'Product',
    },
    {
      title: 'Tutor onboarding sessions expanded',
      summary: 'New training cycles now start every two weeks.',
      date: 'Aug 30, 2026',
      tag: 'Tutors',
    },
  ];

  const books = [
    { title: 'Algebra Made Clear', author: 'T. Mensah', level: 'Secondary' },
    { title: 'Foundations of Physics', author: 'A. Ali', level: 'Senior' },
    { title: 'Chemistry Quick Notes', author: 'R. Okoro', level: 'Secondary' },
    { title: 'Intro to Calculus', author: 'S. Rivera', level: 'Senior' },
    { title: 'Essay Writing Skills', author: 'N. Kim', level: 'All Levels' },
  ];

  const metrics = [
    { label: 'Active Users', value: 78, color: 'bg-blue-600' },
    { label: 'Active Tutors', value: 42, color: 'bg-green-600' },
    { label: 'New Registrations', value: 64, color: 'bg-yellow-500' },
    { label: 'Questions Asked', value: 55, color: 'bg-purple-600' },
    { label: 'AI Interactions', value: 71, color: 'bg-emerald-600' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <GraduationCap size={80} className="text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to <span className="text-blue-600">STUDENT's STAGE</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              A collaborative platform where students learn, share knowledge, and grow 
              together with guidance from expert tutors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary inline-flex items-center justify-center">
                Get Started Free
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link to="/login" className="btn-secondary inline-flex items-center justify-center">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <div className="text-blue-600 dark:text-blue-400">
                      {stat.icon}
                    </div>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform is designed to make learning collaborative and effective
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Ask Questions
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Post your academic questions and get detailed answers from expert tutors 
                and fellow students.
              </p>
            </div>

            <div className="card p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Award className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Earn Rewards
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get points for helpful contributions, earn stars, and climb the 
                leaderboard.
              </p>
            </div>

            <div className="card p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Access Resources
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Browse through curated books, notes, and video tutorials to 
                enhance your learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-12 bg-gray-50 dark:bg-gray-900 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Latest News
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Platform updates, events, and community highlights.
              </p>
            </div>
            <Link to="/register" className="btn-secondary">
              Join the community
            </Link>
          </div>

          <div className="grid gap-6">
            {newsItems.map((item, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 font-semibold">
                    {item.tag}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.date}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Books Section */}
      <section id="books" className="py-12 bg-white dark:bg-gray-800 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Featured Books
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Curated notes and ebooks ready for download.
              </p>
            </div>
            <Link to="/register" className="btn-primary">
              Access the library
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {books.map((book, index) => (
              <div key={index} className="card p-5">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {book.author}
                </p>
                <span className="inline-flex mt-3 text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {book.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="statistics" className="py-12 bg-gray-50 dark:bg-gray-900 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Community Statistics
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Live platform activity across students, tutors, and the AI assistant.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Activity Snapshot
              </h3>
              <div className="space-y-4">
                {metrics.map((metric, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>{metric.label}</span>
                      <span>{metric.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${metric.color}`}
                        style={{ width: `${metric.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Monthly Growth
              </h3>
              <div className="grid grid-cols-5 gap-3 items-end h-40">
                {[45, 62, 58, 71, 79].map((value, index) => (
                  <div key={index} className="flex flex-col items-center justify-end">
                    <div
                      className="w-full bg-blue-500 rounded-t-lg"
                      style={{ height: `${value}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      W{index + 1}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                Registration and engagement growth over the last 5 weeks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who are already learning and growing together.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Create Free Account
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
