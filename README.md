# Student's Stage

Student's Stage is a React and Vite educational platform with separate student,
tutor, and administrator experiences. The frontend includes role-based routing,
authentication, a student Q&A workflow, profile management, and theme support.

## Features

- Role-based access control for students, tutors, and administrators
- Student dashboards, learning resources, Q&A, chat, and statistics views
- Tutor and administrator dashboard views
- Persistent authentication using local storage
- Light, dark, and system theme modes
- Responsive layouts for desktop and mobile
- Toast notifications and a development debug panel

## Tech Stack

- React 18 and React Router 7
- Vite 5
- Axios
- Tailwind CSS
- Lucide React
- React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
npm run dev
```

Other available commands are `npm run build`, `npm run preview`, and
`npm run deploy`.

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=https://student-stage-backend-apis.onrender.com/api
```

If `VITE_API_URL` is not set, the application uses the same backend URL as its
default. The API client normalizes trailing slashes and appends `/api` when the
configured URL does not already contain it.

## Application Connections

```text
src/main.jsx
  -> src/App.jsx
  -> ThemeProvider
  -> AuthProvider
  -> BrowserRouter
  -> Layouts
  -> Pages
```

- `main.jsx` mounts the application, imports global CSS, and registers the
  service worker.
- `App.jsx` configures the router and the global toast provider.
- `AuthContext` loads and refreshes the current user and exposes login,
  registration, logout, and authentication state.
- `tokenService` manages the access token, stored user data, role extraction,
  and clearing authentication data.
- `ThemeContext` persists the selected theme and applies the theme class to the
  document root.
- `DashboardLayout` protects dashboard pages from unauthenticated users.
- `RequireRole` protects pages that require the `STUDENT`, `TUTOR`, or `ADMIN`
  role.

### Layouts

- `PublicLayout`: `PublicNavbar` -> routed page -> `Footer`
- `AuthLayout`: login and registration presentation -> routed page
- `DashboardLayout`: `Sidebar` -> `Navbar` -> routed dashboard page

## API Integration

The shared Axios client is `src/services/apiClient.js`. The API base URL is
`VITE_API_URL`, or `https://student-stage-backend-apis.onrender.com/api` when
the variable is absent.

Requests use the following authorization header when a token is available:

```http
Authorization: Token <access_token>
```

On an HTTP `401` response, the client clears authentication data and redirects
the user to `/login`.

### Authentication Endpoints

| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| POST   | `/login`            | Log in a user           |
| POST   | `/register`         | Register a user         |
| POST   | `/logout`           | Log out on the server   |
| GET    | `/me`               | Get the current user    |
| GET    | `/profiles/:userId` | Get a user profile      |
| GET    | `/profiles/:id`     | Fallback profile lookup |

### Administration Endpoints

| Method | Endpoint                     | Description                   |
| ------ | ---------------------------- | ----------------------------- |
| GET    | `/profiles/`                 | List profiles/users           |
| POST   | `/addtogroup/:group/:userId` | Assign a user to a role/group |

### Profile Endpoints

| Method | Endpoint               | Description                            |
| ------ | ---------------------- | -------------------------------------- |
| GET    | `/profiles/:profileId` | Load a profile                         |
| PUT    | `/profiles/:profileId` | Update profile data or upload an image |

### Question and Answer Endpoints

| Method | Endpoint                          | Description                               |
| ------ | --------------------------------- | ----------------------------------------- |
| POST   | `/questions`                      | Create a question                         |
| GET    | `/questions`                      | List questions; supports query parameters |
| GET    | `/questions/my`                   | List the current user's questions         |
| GET    | `/questions/:questionId`          | Get one question                          |
| POST   | `/questions/:questionId/answers`  | Submit an answer                          |
| GET    | `/questions/:questionId/answers`  | Get answers for a question                |
| POST   | `/questions/:questionId/upvote`   | Upvote a question                         |
| POST   | `/questions/:questionId/downvote` | Downvote a question                       |

### Data Flows

```text
LoginPage/RegisterPage
  -> AuthContext
  -> authService
  -> apiClient
  -> backend API
  -> local storage and auth state
  -> /redirect
  -> role-specific dashboard
```

```text
QuestionsPage or StudentDashboard
  -> qaService.getQuestions()
  -> GET /questions

QuestionAskForm
  -> qaService.askQuestion()
  -> POST /questions

AnswerForm
  -> qaService.submitAnswer()
  -> POST /questions/:questionId/answers
```

Profile updates call `PUT /profiles/:profileId` and then refresh the global
authentication user data. Image uploads use `FormData`.

## Available Routes

All paths below are relative to the Vite base path. The production base path is
`/SSTG/`.

| Path                    | Page                      | Access          |
| ----------------------- | ------------------------- | --------------- |
| `/`                     | Home page                 | Public          |
| `/login`                | Login page                | Public          |
| `/register`             | Registration page         | Public          |
| `/redirect`             | Role-based login redirect | Authenticated   |
| `/dashboard`            | Student dashboard         | `STUDENT`       |
| `/student/questions`    | Student questions         | `STUDENT`       |
| `/student/answers`      | Student answers           | `STUDENT`       |
| `/student/books`        | Books and notes           | `STUDENT`       |
| `/student/videos`       | Videos                    | `STUDENT`       |
| `/student/ai-assistant` | AI assistant              | `STUDENT`       |
| `/student/chat`         | Student chat              | `STUDENT`       |
| `/student/stats`        | Student statistics        | `STUDENT`       |
| `/tutor/dashboard`      | Tutor dashboard           | `TUTOR`         |
| `/admin/dashboard`      | Admin dashboard           | `ADMIN`         |
| `/admin/users`          | User management           | `ADMIN`         |
| `/profile`              | User profile              | Authenticated   |
| `*`                     | Under construction page   | Public fallback |

The UI also contains links to paths that are not currently declared as routes,
including `/settings`, `/forgot-password`, `/about`, `/news`, `/books`,
`/statistics`, `/contact`, `/terms`, `/privacy`, `/cookies`, `/tutor/questions`,
`/tutor/upload`, `/admin/moderation`, and `/admin/analytics`. These resolve to
the fallback page.

## Theme Support

Theme preference is persisted in local storage. The application supports light,
dark, and system modes.

## Authentication Flow

1. The user submits credentials on the Login or Register page.
2. The backend returns an access token and basic user data.
3. The token and user data are stored in local storage.
4. The app fetches complete user data and derives the user's role.
5. The user is redirected to a role-specific dashboard.
6. The session is validated again when the app reloads.

## Project Structure

```text
src/
  components/       Shared UI, layouts, authentication, and Q&A components
  contexts/         AuthContext and ThemeContext
  hooks/            Role access helpers
  layouts/          Public, auth, and dashboard layouts
  pages/            Public, auth, student, tutor, and admin pages
  services/api/     Authentication, admin, profile, and Q&A API services
  services/         Axios client and token storage
  utils/             Theme, API, and authentication debugging utilities
```

## Scripts

```bash
npm run dev       # Start the development server
npm run build     # Build for production
npm run preview   # Preview the production build
npm run deploy    # Build and publish dist/ with gh-pages
```

There is currently no `lint` script defined in `package.json`.

## Debug Mode

The app includes a debug panel in the bottom-right corner that can display:

- Current user role
- Authentication status
- User data structure
- API response details

## Current Implementation Notes

The books, videos, AI assistant, chat, student statistics, and most tutor
dashboard content currently use local or mock data rather than API calls. Public
home page sections such as news, books, and statistics are also static.

Some API service functions are defined for future use but are not currently
called by a page, including personal questions, question detail, voting, and
question answer-list requests.

## License

This project is licensed under the MIT License.
