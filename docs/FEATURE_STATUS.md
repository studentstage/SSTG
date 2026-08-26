# Legacy Feature Status

| Feature                  | Existing UI      | Backend connection                      | Status              | Evidence/notes                                          |
| ------------------------ | ---------------- | --------------------------------------- | ------------------- | ------------------------------------------------------- |
| Authentication           | Yes              | `/login`, `/register`, `/logout`, `/me` | CONNECTED           | Token and user state persist locally.                   |
| Role redirect and guards | Yes              | Uses auth responses and `/me`           | PARTIALLY CONNECTED | Enforcement is client-side; server rules UNKNOWN.       |
| Profile viewing          | Yes              | GET `/me`                               | CONNECTED           | Falls back to cached auth user on load failure.         |
| Profile editing/image    | Yes              | PUT `/profiles/:id`                     | CONNECTED           | JSON or FormData payload.                               |
| Student question list    | Yes              | GET `/questions`                        | CONNECTED           | “My” filtering is not proven.                           |
| Ask question             | Yes              | POST `/questions`                       | CONNECTED           | Client adds user ID and timestamp.                      |
| Submit answer            | Yes              | POST `/questions/:id/answers`           | CONNECTED           | Client adds user ID/name and timestamp.                 |
| Question detail/answers  | Partial          | Service methods defined                 | DEFINED/UNUSED      | No confirmed page caller for detail/answer GET.         |
| Voting                   | UI icons/imports | Upvote/downvote methods defined         | DEFINED/UNUSED      | No confirmed caller.                                    |
| Student dashboard stats  | Yes              | Questions provide counts only           | PARTIALLY CONNECTED | Points, tutors, and trends are static.                  |
| Student books/notes      | Yes              | None                                    | STATIC/MOCK         | Three local books and simulated actions.                |
| Student videos           | Yes              | None                                    | STATIC/MOCK         | Six local YouTube records and toast-only actions.       |
| AI assistant             | Yes              | None                                    | STATIC/MOCK         | Canned keyword responses.                               |
| Chat                     | Yes              | None                                    | STATIC/MOCK         | Local conversations/messages.                           |
| Student statistics       | Yes              | None                                    | STATIC/MOCK         | Hardcoded statistics and achievements.                  |
| Tutor dashboard          | Yes              | None                                    | STATIC/MOCK         | Metrics and actions are local/toast-only.               |
| Admin profile listing    | Yes              | GET `/profiles/`                        | CONNECTED           | Accepts array or `results` wrapper.                     |
| Admin role assignment    | Yes              | POST `/addtogroup/:group/:userId`       | CONNECTED           | Sends numeric ID and lowercase group.                   |
| Admin approvals          | Yes              | None                                    | STATIC/MOCK         | Pending count hardcoded to zero.                        |
| Delete users             | UI action        | None                                    | BROKEN/INCOMPLETE   | Explicitly disabled in UI.                              |
| Public home content      | Yes              | None                                    | STATIC/MOCK         | News, books, statistics, and charts local.              |
| Theme preference         | Yes              | None                                    | CONNECTED LOCALLY   | localStorage; light/dark/system.                        |
| PWA/offline behavior     | Partial          | None                                    | INCOMPLETE          | Manual worker; no manifest/plugin and base-path issues. |
