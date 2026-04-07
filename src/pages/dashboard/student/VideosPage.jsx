import React, { useState, useEffect } from 'react';
import { 
  Video, Play, Clock, Eye, ThumbsUp, ThumbsDown,
  Search, Filter, Grid, List, X, ChevronLeft,
  BookOpen, User, Star, Calendar, Tag
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const mockVideos = [
  {
    id: 1,
    title: 'Introduction to Python Programming',
    description: 'Learn the basics of Python programming, including variables, data types, and basic syntax.',
    instructor: 'Dr. John Smith',
    duration: '45:30',
    category: 'Programming',
    views: 1250,
    likes: 320,
    dislikes: 12,
    youtubeId: 'kqtD5Wnha0Y',
    youtubeUrl: 'https://www.youtube.com/watch?v=kqtD5Wnha0Y',
    publishedAt: '2024-01-15T10:30:00Z',
    tags: ['python', 'programming', 'beginner']
  },
  {
    id: 2,
    title: 'Calculus Fundamentals: Derivatives',
    description: 'Understanding derivatives and their applications in calculus. Learn the power rule, product rule, and chain rule.',
    instructor: 'Prof. Sarah Johnson',
    duration: '1:15:00',
    category: 'Mathematics',
    views: 890,
    likes: 245,
    dislikes: 8,
    youtubeId: 'p-FgRy1jtyM',
    youtubeUrl: 'https://www.youtube.com/watch?v=p-FgRy1jtyM',
    publishedAt: '2024-01-12T14:20:00Z',
    tags: ['calculus', 'mathematics', 'derivatives']
  },
  {
    id: 3,
    title: 'Introduction to Data Structures',
    description: 'Learn about arrays, linked lists, stacks, and queues in this comprehensive tutorial.',
    instructor: 'Dr. Michael Chen',
    duration: '58:45',
    category: 'Programming',
    views: 567,
    likes: 156,
    dislikes: 5,
    youtubeId: 'owgjrR0wnN4',
    youtubeUrl: 'https://www.youtube.com/watch?v=owgjrR0wnN4',
    publishedAt: '2024-01-10T09:15:00Z',
    tags: ['data structures', 'programming', 'algorithms']
  },
  {
    id: 4,
    title: 'Shakespeare\'s Hamlet Analysis',
    description: 'An in-depth analysis of Hamlet, exploring themes, characters, and literary devices.',
    instructor: 'Dr. Emily Brown',
    duration: '1:30:00',
    category: 'English',
    views: 432,
    likes: 178,
    dislikes: 3,
    youtubeId: 'xOdL2b3lZ3U',
    youtubeUrl: 'https://www.youtube.com/watch?v=xOdL2b3lZ3U',
    publishedAt: '2024-01-08T11:00:00Z',
    tags: ['shakespeare', 'literature', 'hamlet']
  },
  {
    id: 5,
    title: 'Linear Algebra: Matrix Operations',
    description: 'Master matrix operations including addition, multiplication, and determinants.',
    instructor: 'Prof. Sarah Johnson',
    duration: '52:15',
    category: 'Mathematics',
    views: 678,
    likes: 189,
    dislikes: 7,
    youtubeId: '0k8MqhK6B2E',
    youtubeUrl: 'https://www.youtube.com/watch?v=0k8MqhK6B2E',
    publishedAt: '2024-01-05T15:30:00Z',
    tags: ['linear algebra', 'matrices', 'mathematics']
  },
  {
    id: 6,
    title: 'Introduction to Web Development',
    description: 'Learn HTML, CSS, and JavaScript fundamentals for building websites.',
    instructor: 'Dr. John Smith',
    duration: '1:45:00',
    category: 'Programming',
    views: 1567,
    likes: 445,
    dislikes: 15,
    youtubeId: 'u2nQ1W4Yy9Q',
    youtubeUrl: 'https://www.youtube.com/watch?v=u2nQ1W4Yy9Q',
    publishedAt: '2024-01-01T08:00:00Z',
    tags: ['web development', 'html', 'css', 'javascript']
  }
];

const getYouTubeThumbnail = (videoId) => `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
const getYouTubeEmbedUrl = (videoId) => `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

const openYouTubeVideo = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

const VideosPage = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState(mockVideos);
  const [filteredVideos, setFilteredVideos] = useState(mockVideos);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Programming', label: 'Programming' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'English', label: 'English' },
    { value: 'Science', label: 'Science' },
    { value: 'History', label: 'History' }
  ];

  useEffect(() => {
    let filtered = [...videos];

    if (searchTerm) {
      filtered = filtered.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(video => video.category === filterCategory);
    }

    setFilteredVideos(filtered);
  }, [searchTerm, filterCategory, videos]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handlePlayVideo = (video) => {
    if (video.youtubeUrl) {
      openYouTubeVideo(video.youtubeUrl);
      toast.success(`Opening: ${video.title}`);
    } else {
      setPlayingVideo(video);
    }
  };

  const closePlayer = () => {
    setPlayingVideo(null);
    setSelectedVideo(null);
  };

  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const stats = {
    totalVideos: videos.length,
    totalViews: videos.reduce((sum, v) => sum + v.views, 0),
    totalLikes: videos.reduce((sum, v) => sum + v.likes, 0),
    byCategory: categories.filter(c => c.value !== 'all').map(cat => ({
      name: cat.label,
      count: videos.filter(v => v.category === cat.value).length
    }))
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Video Tutorials
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Watch and learn from educational video content
          </p>
        </div>
        <button
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => toast.success('Video upload feature coming soon!')}
        >
          <Video size={18} />
          <span>Upload Video</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalVideos}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Videos</p>
            </div>
            <Video className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatViews(stats.totalViews)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
            </div>
            <Eye className="text-green-600 dark:text-green-400" size={24} />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {formatViews(stats.totalLikes)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Likes</p>
            </div>
            <ThumbsUp className="text-yellow-600 dark:text-yellow-400" size={24} />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.byCategory.filter(c => c.count > 0).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
            </div>
            <BookOpen className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
        </div>
      </div>

      {/* Filters and View Options */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-auto">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Videos Grid/List */}
      {filteredVideos.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No videos found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || filterCategory !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'No videos available yet. Check back later!'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleVideoClick(video)}
            >
              {/* YouTube Thumbnail */}
              <div className="h-40 relative overflow-hidden">
                {video.youtubeId ? (
                  <img 
                    src={getYouTubeThumbnail(video.youtubeId)} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center" />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <Play size={48} className="text-white opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                </div>
                <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                  {video.duration}
                </span>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                    {video.title}
                  </h3>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {video.description}
                </p>

                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                    {video.category}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User size={14} />
                    <span>{video.instructor}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye size={14} />
                    <span>{formatViews(video.views)}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    <Calendar size={12} className="inline mr-1" />
                    {formatDate(video.publishedAt)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayVideo(video);
                    }}
                    className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm font-medium"
                  >
                    <Play size={14} />
                    <span>Watch</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="card p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleVideoClick(video)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-40 h-24 rounded-lg flex-shrink-0 relative group overflow-hidden">
                    {video.youtubeId ? (
                      <img 
                        src={getYouTubeThumbnail(video.youtubeId)} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center" />
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play size={32} className="text-white opacity-80" />
                    </div>
                    <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 text-white text-xs rounded">
                      {video.duration}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {video.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                      <span className="flex items-center space-x-1">
                        <User size={12} />
                        <span>{video.instructor}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Eye size={12} />
                        <span>{formatViews(video.views)} views</span>
                      </span>
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                        {video.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayVideo(video);
                    }}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                    title="Play"
                  >
                    <Play size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Detail Modal */}
      {selectedVideo && !playingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-2xl">
            {/* YouTube Video Thumbnail */}
            <div className="h-64 relative rounded-t-lg overflow-hidden cursor-pointer" onClick={() => handlePlayVideo(selectedVideo)}>
              {selectedVideo.youtubeId ? (
                <img 
                  src={`https://img.youtube.com/vi/${selectedVideo.youtubeId}/hqdefault.jpg`} 
                  alt={selectedVideo.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/50 transition-colors">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg">
                  <Play size={32} className="text-white ml-1" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                {selectedVideo.duration}
              </span>
            </div>

            {/* Video Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedVideo.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    by {selectedVideo.instructor}
                  </p>
                </div>
                <button
                  onClick={closePlayer}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                  {selectedVideo.category}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  <Clock size={14} className="inline mr-1" />
                  {selectedVideo.duration}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  <Eye size={14} className="inline mr-1" />
                  {formatViews(selectedVideo.views)} views
                </span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {selectedVideo.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedVideo.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full flex items-center">
                    <Tag size={12} className="mr-1" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toast.success('Liked!')}
                    className="flex items-center space-x-1 text-green-600 dark:text-green-400 hover:text-green-700"
                  >
                    <ThumbsUp size={18} />
                    <span>{selectedVideo.likes}</span>
                  </button>
                  <button
                    onClick={() => toast.success('Disliked!')}
                    className="flex items-center space-x-1 text-red-600 dark:text-red-400 hover:text-red-700"
                  >
                    <ThumbsDown size={18} />
                    <span>{selectedVideo.dislikes}</span>
                  </button>
                </div>
                <button
                  onClick={() => handlePlayVideo(selectedVideo)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <Play size={18} />
                  <span>Watch on YouTube</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideosPage;