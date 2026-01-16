# Student's Stage

An educational platform where students learn, share, and grow together. Built with React + Vite featuring role-based access control for students, tutors, and administrators.

## 🎯 Features

- **Role-Based Access Control** - Three user roles with different permissions
- **Student Dashboard** - Ask questions, track progress, earn points
- **Tutor Dashboard** - Answer questions, upload materials, help students
- **Admin Dashboard** - Manage users, content, and platform settings
- **Dark/Light Theme** - Toggle between light and dark modes
- **Responsive Design** - Works on desktop and mobile devices
- **Real-time Notifications** - Toast notifications for user feedback
- **Session Management** - Persistent login with localStorage

## 👥 User Roles

| Role        | Permissions                                                             |
| ----------- | ----------------------------------------------------------------------- |
| **Student** | Ask questions, access learning materials, earn points for participation |
| **Tutor**   | Answer student questions, upload materials, help students learn         |
| **Admin**   | Full access to manage users, content, and platform settings             |

## 🛠 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard-specific components
│   ├── debug/          # Debug utilities
│   ├── layout/         # Layout components (Navbar, Sidebar, Footer)
│   ├── qa/             # Q&A components
│   └── ui/             # Reusable UI components
├── contexts/
│   ├── AuthContext.jsx # Authentication state management
│   └── ThemeContext.jsx # Theme (dark/light) management
├── hooks/
│   └── useRoleAccess.js # Role-based route protection hook
├── layouts/
│   ├── AuthLayout.jsx      # Login/Register layout
│   ├── DashboardLayout.jsx # Dashboard layout with sidebar
│   └── PublicLayout.jsx    # Public pages layout
├── pages/
│   ├── auth/           # Login and Register pages
│   ├── dashboard/      # Role-specific dashboards
│   └── public/         # Public pages (Home)
├── services/
│   ├── api/            # API service functions
│   ├── apiClient.js    # Axios instance with interceptors
│   └── tokenService.js # Token management utilities
└── utils/
    ├── darkMode.js     # Dark mode utilities
    └── debugAPI.js     # API debugging utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=https://student-stage-backend-apis.onrender.com/api
```

## 📡 API Integration

The frontend connects to a backend API at `student-stage-backend-apis.onrender.com`.

### API Endpoints

| Method | Endpoint         | Description              |
| ------ | ---------------- | ------------------------ |
| POST   | `/login`         | User login               |
| POST   | `/register`      | User registration        |
| POST   | `/logout`        | User logout              |
| GET    | `/me`            | Get current user profile |
| GET    | `/profiles/{id}` | Get user profile by ID   |

## 🎨 Theme Support

The app supports both light and dark themes. Theme preference is persisted in localStorage and respects system preferences.

## 🔐 Authentication Flow

1. User submits credentials via Login page
2. Backend returns access token and basic user data
3. Token stored in localStorage
4. App fetches complete user profile with role
5. User redirected to role-specific dashboard
6. Session validated on page reload

## 🏗 Available Routes

| Path               | Access                  | Description       |
| ------------------ | ----------------------- | ----------------- |
| `/`                | Public                  | Home page         |
| `/login`           | Public                  | Login page        |
| `/register`        | Public                  | Registration page |
| `/dashboard`       | Authenticated (Student) | Student dashboard |
| `/tutor/dashboard` | Authenticated (Tutor)   | Tutor dashboard   |
| `/admin/dashboard` | Authenticated (Admin)   | Admin dashboard   |

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🧪 Debug Mode

The app includes a debug panel (bottom-right corner) that shows:

- Current user role
- Authentication status
- User data structure
- API response details

Toggle by clicking the eye icon in the bottom-right corner.

## 📄 License

This project is licensed under the MIT License.
