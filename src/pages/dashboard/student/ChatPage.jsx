import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, User, Search, Plus, MoreVertical,
  Phone, Video, Image, Paperclip, Smile, X, Check, CheckCheck,
  ArrowLeft, Circle
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const mockConversations = [
  {
    id: 1,
    name: 'Dr. John Smith',
    role: 'Tutor',
    avatar: null,
    lastMessage: 'Great progress on your assignment!',
    timestamp: '2:30 PM',
    unread: 2,
    online: true
  },
  {
    id: 2,
    name: 'Study Group - Math 101',
    role: 'Group',
    avatar: null,
    lastMessage: 'Sarah: See you at the study session tomorrow!',
    timestamp: '1:15 PM',
    unread: 0,
    online: false
  },
  {
    id: 3,
    name: 'Prof. Sarah Johnson',
    role: 'Tutor',
    avatar: null,
    lastMessage: 'Please review the materials I sent.',
    timestamp: 'Yesterday',
    unread: 0,
    online: false
  },
  {
    id: 4,
    name: 'Emily Brown',
    role: 'Student',
    avatar: null,
    lastMessage: 'Thanks for the help with the project!',
    timestamp: 'Yesterday',
    unread: 0,
    online: true
  },
  {
    id: 5,
    name: 'Dr. Michael Chen',
    role: 'Tutor',
    avatar: null,
    lastMessage: 'Let me know if you have questions.',
    timestamp: 'Monday',
    unread: 0,
    online: false
  }
];

const mockMessages = {
  1: [
    { id: 1, senderId: 'tutor', content: 'Hello! How is your programming assignment going?', timestamp: '2:00 PM', status: 'read' },
    { id: 2, senderId: 'me', content: 'Hi! I\'m working on it. Having some issues with the function.', timestamp: '2:05 PM', status: 'read' },
    { id: 3, senderId: 'tutor', content: 'What seems to be the problem? I can help you debug it.', timestamp: '2:10 PM', status: 'read' },
    { id: 4, senderId: 'me', content: 'I keep getting an error when I try to call the function.', timestamp: '2:15 PM', status: 'read' },
    { id: 5, senderId: 'tutor', content: 'Can you share the code? Or describe the error message?', timestamp: '2:20 PM', status: 'read' },
    { id: 6, senderId: 'me', content: 'It says "undefined is not a function"', timestamp: '2:25 PM', status: 'read' },
    { id: 7, senderId: 'tutor', content: 'Great progress on your assignment!', timestamp: '2:30 PM', status: 'delivered' }
  ],
  2: [
    { id: 1, senderId: 'user1', content: 'Hey everyone! Who\'s ready for the exam?', timestamp: '12:00 PM', status: 'read' },
    { id: 2, senderId: 'me', content: 'I think so! Been studying all week.', timestamp: '12:05 PM', status: 'read' },
    { id: 3, senderId: 'user2', content: 'Can we do a quick review session today?', timestamp: '12:30 PM', status: 'read' },
    { id: 4, senderId: 'user1', content: 'Sure! What time works for everyone?', timestamp: '12:45 PM', status: 'read' },
    { id: 5, senderId: 'me', content: 'How about 3 PM at the library?', timestamp: '1:00 PM', status: 'read' },
    { id: 6, senderId: 'user3', content: 'Sarah: See you at the study session tomorrow!', timestamp: '1:15 PM', status: 'read' }
  ]
};

const ChatPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages[selectedConversation.id] || []);
    }
  }, [selectedConversation]);

  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      senderId: 'me',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversation?.id) {
        return { ...conv, lastMessage: newMessage, timestamp: 'Just now' };
      }
      return conv;
    }));

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);
  };

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    setConversations(prev => prev.map(c => 
      c.id === conv.id ? { ...c, unread: 0 } : c
    ));
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (id) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-yellow-500', 'bg-red-500', 'bg-pink-500'
    ];
    return colors[id % colors.length];
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'read': return <CheckCheck size={14} className="text-blue-500" />;
      case 'delivered': return <CheckCheck size={14} className="text-gray-400" />;
      case 'sent': return <Check size={14} className="text-gray-400" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <MessageSquare size={28} className="text-blue-600 dark:text-blue-400" />
            <span>Messages</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Chat with tutors and fellow students
          </p>
        </div>
        <button
          onClick={() => setShowNewChat(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat Interface */}
      <div className="card overflow-hidden">
        <div className="flex h-[600px]">
          {/* Conversations List */}
          <div className={`w-full md:w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col ${selectedConversation ? 'hidden md:flex' : ''}`}>
            {/* Search */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
                    selectedConversation?.id === conv.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className={`w-12 h-12 ${getAvatarColor(conv.id)} rounded-full flex items-center justify-center text-white font-medium`}>
                        {getInitials(conv.name)}
                      </div>
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {conv.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {conv.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : ''}`}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <div className="relative">
                      <div className={`w-10 h-10 ${getAvatarColor(selectedConversation.id)} rounded-full flex items-center justify-center text-white font-medium`}>
                        {getInitials(selectedConversation.name)}
                      </div>
                      {selectedConversation.online && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {selectedConversation.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedConversation.role} • {selectedConversation.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
                      title="Voice Call"
                    >
                      <Phone size={20} />
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
                      title="Video Call"
                    >
                      <Video size={20} />
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
                      title="More"
                    >
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${message.senderId === 'me' ? 'order-2' : ''}`}>
                        <div className={`px-4 py-2 rounded-lg ${
                          message.senderId === 'me'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div className={`flex items-center space-x-1 mt-1 ${
                          message.senderId === 'me' ? 'justify-end' : ''
                        }`}>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {message.timestamp}
                          </span>
                          {message.senderId === 'me' && getStatusIcon(message.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
                      title="Attach file"
                    >
                      <Paperclip size={20} />
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
                      title="Send image"
                    >
                      <Image size={20} />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
                      title="Add emoji"
                    >
                      <Smile size={20} />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose a chat from the list or start a new one
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                New Conversation
              </h2>
              <button
                onClick={() => setShowNewChat(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search people..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Recent Contacts</p>
                {conversations.slice(0, 4).map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      handleSelectConversation(conv);
                      setShowNewChat(false);
                    }}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    <div className={`w-10 h-10 ${getAvatarColor(conv.id)} rounded-full flex items-center justify-center text-white font-medium`}>
                      {getInitials(conv.name)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{conv.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{conv.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;