# Legacy Project Analysis

## Structure

- `src/App.jsx`: providers, basename router, routes, role guard, toaster.
- `src/layouts`: public, auth, and authenticated dashboard shells.
- `src/pages`: public, auth, student, tutor, admin, and shared profile pages.
- `src/components`: navigation, shared UI, debug panel, and Q&A forms/lists.
- `src/contexts`: authentication and theme state.
- `src/services`: Axios client, token storage, and auth/profile/admin/Q&A services.
- `src/hooks`: client-side role access helper.
- `src/utils`: debug/theme utilities.
- `public/service-worker.js`: manually registered cache-first worker.

## Routes and Page Status

| Route                   | Role          | API dependencies                         | Status              |
| ----------------------- | ------------- | ---------------------------------------- | ------------------- |
| `/`                     | Guest         | None; static content                     | STATIC/MOCK         |
| `/login`                | Guest         | POST `/login`                            | CONNECTED           |
| `/register`             | Guest         | POST `/register`                         | CONNECTED           |
| `/redirect`             | Authenticated | `/me`/profile refresh via context        | CONNECTED           |
| `/dashboard`            | Student       | GET `/questions`; profile state          | PARTIALLY CONNECTED |
| `/student/questions`    | Student       | GET/POST `/questions`; answer POST       | CONNECTED           |
| `/student/answers`      | Student       | GET `/questions`, embedded answers       | PARTIALLY CONNECTED |
| `/student/books`        | Student       | None                                     | STATIC/MOCK         |
| `/student/videos`       | Student       | None; external YouTube links             | STATIC/MOCK         |
| `/student/ai-assistant` | Student       | None                                     | STATIC/MOCK         |
| `/student/chat`         | Student       | None                                     | STATIC/MOCK         |
| `/student/stats`        | Student       | None                                     | STATIC/MOCK         |
| `/tutor/dashboard`      | Tutor         | None                                     | STATIC/MOCK         |
| `/admin/dashboard`      | Admin         | GET `/profiles/`                         | CONNECTED           |
| `/admin/users`          | Admin         | GET `/profiles/`, POST `/addtogroup/...` | CONNECTED           |
| `/profile`              | Authenticated | GET `/me`, PUT `/profiles/:id`           | CONNECTED           |
| `*`                     | Any           | None                                     | CONNECTED fallback  |

Visible but undeclared links include `/settings`, `/forgot-password`, `/about`,
`/news`, `/books`, `/statistics`, `/contact`, `/terms`, `/privacy`, `/cookies`,
tutor question/material/assignment/student/chat/analytics paths, and admin
moderation/analytics/news/books/settings paths. They render the fallback.

## Connected Behavior

Authentication, session bootstrap, profile load/update, admin profile listing
and group assignment, question listing/creation, and answer submission use the
shared API client. Client-side search, category filters, sorting, and answer
statistics are computed locally from returned question data.

## Static, Mock, or Placeholder Behavior

- Books: three embedded books with local reader state and fake download/library actions.
- Videos: six embedded YouTube records; likes/dislikes/upload are toast-only.
- AI assistant: keyword-based canned responses after a 1.5-second timeout.
- Chat: embedded conversations; sent messages remain local.
- Student stats: hardcoded statistics and achievements.
- Tutor dashboard: static metrics, questions, guidelines, and toast-only actions.
- Home: static news, featured books, public statistics, and growth content.
- Admin pending approvals: hardcoded `0`; delete user says it is not enabled.
- Notifications, calls, attachments, emoji, and settings controls are placeholders.

## Business Rules and UX

Registration requires username length >= 3, email-like syntax, password length

> = 8, and matching confirmation. Question titles require 5-200 characters;
> details require at least 10; answers require 10-2000. Roles are normalized to
> uppercase in context, while admin group assignment sends lowercase role names.
> The theme persists `light`, `dark`, or `system` in localStorage. Mobile
> dashboard navigation uses an overlay and collapsible sidebar.

## Known Issues and Technical Debt

- “My Questions” and “My Answers” call `/questions`, not the defined `/questions/my`.
- Many navigation targets have no route.
- `AdminDashboard` calls `toast.error` without an apparent import, likely a runtime error on profile-load failure.
- Missing roles may leave the redirect view waiting indefinitely.
- 401 and service-worker URLs ignore the `/SSTG/` deployment basename.
- StrictMode effects are not cancelled and may duplicate development requests.
- No tests or lint script are present; unused imports/state are not mechanically verified.
- `App.css` contains unused Vite starter styles and is not imported.

## Assets and Design References

Assets are under `public/icons` and `public/images`; pages also use external
YouTube thumbnails/embeds and social links. Tailwind uses class-based dark
mode, a 250px sidebar, and a 64px navbar spacing token. No manifest or PWA
plugin is present.
