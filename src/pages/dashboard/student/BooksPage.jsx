import React, { useState, useEffect } from 'react';
import { 
  BookOpen, FileText, Download, Eye, Trash2, 
  Search, Filter, Grid, List, X, ChevronLeft,
  Clock, Calendar, Folder, Bookmark, Share2
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

// Mock data for demonstration (replace with actual API calls)
const mockBooks = [
  {
    id: 1,
    title: 'Introduction to Programming',
    author: 'Dr. John Smith',
    category: 'Programming',
    coverImage: null,
    pages: 245,
    downloadDate: '2024-01-15T10:30:00Z',
    fileSize: '2.5 MB',
    type: 'pdf',
    content: `# Introduction to Programming

## Chapter 1: Getting Started

Programming is the art of telling a computer what to do. In this chapter, we'll explore the fundamentals of programming and set up your development environment.

### What is Programming?

Programming is the process of creating instructions that tell a computer how to perform a task. These instructions are written in a programming language that both humans and computers can understand.

### Key Concepts

1. **Variables** - Storage containers for data
2. **Functions** - Reusable blocks of code
3. **Control Structures** - Decision-making and loops
4. **Data Structures** - Ways to organize data

### Your First Program

Let's write a simple "Hello World" program:

\`\`\`python
print("Hello, World!")
\`\`\`

This simple program demonstrates the basic syntax of output in Python.

## Chapter 2: Variables and Data Types

Variables are fundamental to programming. They allow you to store and manipulate data.

### Basic Data Types

- **Integers**: Whole numbers (e.g., 42, -17)
- **Floats**: Decimal numbers (e.g., 3.14, -0.5)
- **Strings**: Text data (e.g., "Hello")
- **Booleans**: True or False values

### Declaring Variables

\`\`\`python
name = "Alice"
age = 25
height = 5.7
is_student = True
\`\`\`

## Conclusion

Programming is a valuable skill that opens many doors. Continue practicing and building projects to improve your skills.`
  },
  {
    id: 2,
    title: 'Advanced Mathematics Notes',
    author: 'Prof. Sarah Johnson',
    category: 'Mathematics',
    coverImage: null,
    pages: 180,
    downloadDate: '2024-01-10T14:20:00Z',
    fileSize: '1.8 MB',
    type: 'pdf',
    content: `# Advanced Mathematics Notes

## Calculus Fundamentals

### Derivatives

The derivative of a function represents the rate of change. For a function f(x), the derivative f'(x) gives the slope of the tangent line at any point.

#### Basic Rules

1. **Power Rule**: d/dx(x^n) = nx^(n-1)
2. **Product Rule**: (fg)' = f'g + fg'
3. **Chain Rule**: (f(g(x)))' = f'(g(x)) · g'(x)

### Integrals

Integration is the reverse process of differentiation. The integral of a function gives the area under its curve.

#### Fundamental Theorem of Calculus

∫[a to b] f(x)dx = F(b) - F(a), where F is the antiderivative of f.

## Linear Algebra

### Matrices

A matrix is a rectangular array of numbers arranged in rows and columns.

#### Matrix Operations

- **Addition**: Element-wise addition
- **Multiplication**: Row-by-column multiplication
- **Determinant**: A scalar value from a square matrix

### Eigenvalues and Eigenvectors

For a square matrix A, an eigenvector v and eigenvalue λ satisfy:
Av = λv

## Differential Equations

### First-Order Linear Equations

dy/dx + P(x)y = Q(x)

Solution: y = e^(-∫P dx) · ∫(Q · e^(∫P dx))dx

### Second-Order Equations

ay'' + by' + cy = 0

Characteristic equation: ar² + br + c = 0`
  },
  {
    id: 3,
    title: 'English Literature Summary',
    author: 'Dr. Emily Brown',
    category: 'English',
    coverImage: null,
    pages: 150,
    downloadDate: '2024-01-05T09:15:00Z',
    fileSize: '1.2 MB',
    type: 'pdf',
    content: `# English Literature Summary

## Major Literary Periods

### Renaissance (14th-17th Century)

Key characteristics:
- Humanism and individualism
- Revival of classical learning
- Exploration of human potential

Major works:
- Shakespeare's plays and sonnets
- Milton's "Paradise Lost"
- Donne's metaphysical poetry

### Romantic Period (Late 18th-19th Century)

Key characteristics:
- Emphasis on emotion and imagination
- Celebration of nature
- Focus on the individual experience

Major authors:
- William Wordsworth
- Samuel Taylor Coleridge
- Jane Austen
- Lord Byron

### Victorian Era (19th Century)

Key characteristics:
- Social commentary and reform
- Realism in literature
- Exploration of industrialization's impact

Major works:
- Charles Dickens' novels
- Charlotte Brontë's "Jane Eyre"
- Thomas Hardy's tragedies

## Literary Devices

### Figurative Language

1. **Metaphor**: Direct comparison without "like" or "as"
2. **Simile**: Comparison using "like" or "as"
3. **Personification**: Giving human traits to non-human things
4. **Symbolism**: Using objects to represent ideas

### Narrative Techniques

- **Point of View**: First, second, or third person
- **Foreshadowing**: Hints about future events
- **Irony**: Contrast between expectation and reality
- **Stream of Consciousness**: Flow of thoughts

## Poetry Analysis

### Elements of Poetry

- **Meter**: Rhythmic pattern of stressed and unstressed syllables
- **Rhyme Scheme**: Pattern of rhymes at line endings
- **Stanza**: Group of lines forming a unit
- **Imagery**: Language that appeals to the senses

### Common Forms

- **Sonnet**: 14-line poem with specific rhyme scheme
- **Haiku**: 3-line poem (5-7-5 syllables)
- **Free Verse**: No regular meter or rhyme
- **Limerick**: Humorous 5-line poem`
  }
];

const BooksPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState(mockBooks);
  const [filteredBooks, setFilteredBooks] = useState(mockBooks);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedBook, setSelectedBook] = useState(null);
  const [readingProgress, setReadingProgress] = useState({});

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Programming', label: 'Programming' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'English', label: 'English' },
    { value: 'Science', label: 'Science' },
    { value: 'History', label: 'History' },
    { value: 'Other', label: 'Other' }
  ];

  // Filter books
  useEffect(() => {
    let filtered = [...books];

    if (searchTerm) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(book => book.category === filterCategory);
    }

    setFilteredBooks(filtered);
  }, [searchTerm, filterCategory, books]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const closeReader = () => {
    setSelectedBook(null);
  };

  // Statistics
  const stats = {
    totalBooks: books.length,
    byCategory: categories.filter(c => c.value !== 'all').map(cat => ({
      name: cat.label,
      count: books.filter(b => b.category === cat.value).length
    })),
    recentDownloads: books.filter(book => {
      const daysDiff = (new Date() - new Date(book.downloadDate)) / (1000 * 60 * 60 * 24);
      return daysDiff <= 30;
    }).length
  };

  // Reading Modal Component
  const ReadingModal = ({ book, onClose }) => {
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleScroll = (e) => {
      const element = e.target;
      const scrollHeight = element.scrollHeight - element.clientHeight;
      const progress = scrollHeight > 0 ? (element.scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    // Simple markdown-like rendering with proper dark mode support
    const renderContent = (content) => {
      return content.split('\n').map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-bold mb-4 mt-6 text-gray-900 dark:text-white">{line.slice(2)}</h1>;
        } else if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-bold mb-3 mt-5 text-gray-800 dark:text-gray-100">{line.slice(3)}</h2>;
        } else if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-bold mb-2 mt-4 text-gray-800 dark:text-gray-100">{line.slice(4)}</h3>;
        } else if (line.startsWith('#### ')) {
          return <h4 key={index} className="text-base font-bold mb-2 mt-3 text-gray-800 dark:text-gray-100">{line.slice(5)}</h4>;
        } else if (line.startsWith('- **')) {
          const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
          if (match) {
            return (
              <li key={index} className="ml-4 mb-2 text-gray-700 dark:text-gray-300">
                <strong className="text-gray-900 dark:text-white">{match[1]}</strong>: {match[2]}
              </li>
            );
          }
        } else if (line.startsWith('- ')) {
          return <li key={index} className="ml-4 mb-2 text-gray-700 dark:text-gray-300">{line.slice(2)}</li>;
        } else if (line.match(/^\d+\. \*\*/)) {
          const match = line.match(/^\d+\. \*\*(.+?)\*\*: (.+)/);
          if (match) {
            return (
              <li key={index} className="ml-4 mb-2 list-decimal text-gray-700 dark:text-gray-300">
                <strong className="text-gray-900 dark:text-white">{match[1]}</strong>: {match[2]}
              </li>
            );
          }
        } else if (line.match(/^\d+\. /)) {
          return <li key={index} className="ml-4 mb-2 list-decimal text-gray-700 dark:text-gray-300">{line.replace(/^\d+\. /, '')}</li>;
        } else if (line.startsWith('```')) {
          return null; // Skip code block markers for simplicity
        } else if (line.trim() === '') {
          return <br key={index} />;
        } else {
          return <p key={index} className="mb-3 text-gray-700 dark:text-gray-300">{line}</p>;
        }
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {book.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                by {book.author}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-200 dark:bg-gray-700">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>

          {/* Content */}
          <div 
            className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900"
            onScroll={handleScroll}
          >
            <div className="max-w-none">
              {renderContent(book.content)}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900">
            <span>Page {Math.floor(scrollProgress * book.pages / 100) + 1} of {book.pages}</span>
            <span>{Math.round(scrollProgress)}% read</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Books & Notes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Access your downloaded learning materials
          </p>
        </div>
        <button
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => toast.success('Browse library feature coming soon!')}
        >
          <BookOpen size={18} />
          <span>Browse Library</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalBooks}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Books</p>
            </div>
            <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.recentDownloads}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
            </div>
            <Download className="text-green-600 dark:text-green-400" size={24} />
          </div>
        </div>

        {stats.byCategory.slice(0, 2).map((cat, index) => (
          <div key={index} className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {cat.count}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{cat.name}</p>
              </div>
              <Folder className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters and View Options */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search books and notes..."
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

      {/* Books Grid/List */}
      {filteredBooks.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No books found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || filterCategory !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'You haven\'t downloaded any books yet. Browse the library to get started!'}
          </p>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2"
            onClick={() => toast.success('Browse library feature coming soon!')}
          >
            <BookOpen size={18} />
            <span>Browse Library</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleBookClick(book)}
            >
              {/* Book Cover Placeholder */}
              <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <BookOpen size={48} className="text-white opacity-80" />
              </div>

              {/* Book Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 flex-1">
                    {book.title}
                  </h3>
                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full whitespace-nowrap">
                    {book.category}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  by {book.author}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                  <div className="flex items-center space-x-1">
                    <FileText size={14} />
                    <span>{book.pages} pages</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{formatDate(book.downloadDate)}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {book.fileSize}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookClick(book);
                    }}
                    className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm font-medium"
                  >
                    <Eye size={14} />
                    <span>Read</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="card p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleBookClick(book)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-16 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen size={24} className="text-white opacity-80" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      by {book.author}
                    </p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-500">
                      <span className="flex items-center space-x-1">
                        <FileText size={12} />
                        <span>{book.pages} pages</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{formatDate(book.downloadDate)}</span>
                      </span>
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                        {book.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success('Download feature coming soon!');
                    }}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    title="Download"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookClick(book);
                    }}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                    title="Read"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reading Modal */}
      {selectedBook && (
        <ReadingModal book={selectedBook} onClose={closeReader} />
      )}
    </div>
  );
};

export default BooksPage;