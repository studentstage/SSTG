# Legacy API Contract

This document records only API behavior visible in the legacy frontend. It is
not backend documentation. Response schemas, authorization rules, and server
side validation must be verified against the backend before reuse.

## Endpoint Inventory

The service layer contains 19 concrete Axios call sites and 17 unique
method/path templates.
`GET /profiles/:id` is defined twice in separate services. There are 12 path
templates when methods are ignored.

| Method | Path                              | Purpose                              | Auth/roles observed                         | Status         |
| ------ | --------------------------------- | ------------------------------------ | ------------------------------------------- | -------------- |
| POST   | `/login`                          | Authenticate with email and password | Guest request; server auth unknown          | CONFIRMED      |
| POST   | `/register`                       | Create an account                    | Guest request; server auth unknown          | CONFIRMED      |
| POST   | `/logout`                         | End server session                   | Auth token attached when present            | CONFIRMED      |
| GET    | `/me`                             | Retrieve current user data           | Token attached                              | CONFIRMED      |
| GET    | `/profiles/:id`                   | Retrieve a profile by ID             | Token behavior only; permission unknown     | CONFIRMED      |
| GET    | `/profiles/`                      | List profiles for administration     | Used by ADMIN UI; server permission unknown | CONFIRMED      |
| PUT    | `/profiles/:id`                   | Update profile fields or image       | Authenticated profile UI                    | CONFIRMED      |
| POST   | `/addtogroup/:group/:userId`      | Assign a user to a group/role        | ADMIN UI; server permission unknown         | CONFIRMED      |
| POST   | `/questions`                      | Create a question                    | Student UI; server permission unknown       | CONFIRMED      |
| GET    | `/questions`                      | List questions                       | Student UI; server filtering unknown        | CONFIRMED      |
| GET    | `/questions/my`                   | List current user's questions        | No confirmed caller                         | DEFINED/UNUSED |
| GET    | `/questions/:questionId`          | Retrieve one question                | No confirmed caller                         | DEFINED/UNUSED |
| POST   | `/questions/:questionId/answers`  | Submit an answer                     | Student UI; server permission unknown       | CONFIRMED      |
| GET    | `/questions/:questionId/answers`  | Retrieve answers for one question    | No confirmed caller                         | DEFINED/UNUSED |
| POST   | `/questions/:questionId/upvote`   | Upvote a question                    | No confirmed caller                         | DEFINED/UNUSED |
| POST   | `/questions/:questionId/downvote` | Downvote a question                  | No confirmed caller                         | DEFINED/UNUSED |

## Base URL and Headers

`src/services/apiClient.js` reads `VITE_API_URL`, falling back to
`https://student-stage-backend-apis.onrender.com/api`. Trailing slashes are
removed. If the value does not end in `/api`, `/api` is appended. Axios sends
`Content-Type: application/json` by default and adds
`Authorization: Token <access_token>` when `access_token` exists in
`localStorage`.

The 401 interceptor removes `access_token` and `user_data`, emits
`auth:logout`, and assigns `window.location.href = '/login'`. Whether the
backend accepts this token scheme and whether any endpoint requires a token
remain UNKNOWN from frontend evidence alone.

## Authentication

### POST `/login`

**Purpose:** `authService.login(email, password)`.

**Request:** JSON `{ email, password }`.

**Response:** The context reads `response['Access Token']` or
`response['ACCESS TOKEN']`, and `response.user`. Any other fields are UNKNOWN.

**Used by:** `AuthContext.login`, called by `LoginPage`.

**Status:** CONFIRMED for the frontend request and consumed keys; backend
response contract UNKNOWN.

### POST `/register`

**Purpose:** Create an account.

**Request:** JSON `{ username, email, password, confirm_password }`.

**Response:** Same two token key variants and `user` are consumed. Exact schema
UNKNOWN.

**Used by:** `AuthContext.register`, called by `RegisterPage`.

**Status:** CONFIRMED for request and consumed keys.

### POST `/logout`

**Purpose:** Server logout.

**Request/response:** No body is sent by the frontend; response is ignored.

**Used by:** `AuthContext.logout`, sidebar and user menu. Local auth is cleared
in a `finally` block even if the request fails.

**Status:** CONFIRMED operation; server semantics UNKNOWN.

### GET `/me`

**Purpose:** Validate a persisted session and retrieve current user data.

**Request:** No body.

**Response:** The frontend reads user fields and may read `role` or
`profile.role`. If no role is available and `id` exists, it requests the
profile fallback below. Exact schema UNKNOWN.

**Used by:** auth startup refresh and `ProfilePage`.

**Status:** CONFIRMED.

### GET `/profiles/:id`

**Purpose:** Profile fallback in `getFullUserData`; also exposed as
`profileService.getProfile` but that method has no confirmed caller.

**Request:** ID is interpolated into the path; no body.

**Response:** Returned profile is nested under `profile` only by the fallback
wrapper; raw backend fields are UNKNOWN.

**Status:** CONFIRMED as defined; fallback use is OBSERVED.

## Profile and Administration

### GET `/profiles/`

Used by `AdminDashboard` and `UserManagement`. The UI accepts either an array
or an object with a `results` array. Profile identity may be `user.id`,
`user_id`, or `id`; role may be at `role`, `profile.role`, `user.role`, or
`user.profile.role`. This is frontend tolerance, not a guaranteed API schema.

**Status:** CONFIRMED request; response alternatives OBSERVED in consuming code.

### PUT `/profiles/:id`

`ProfilePage` sends JSON with `full_name`, `address`, `sector`, and `marked_as`.
When an image is selected it sends those fields plus `image` in `FormData` and
sets multipart content type. The returned object is read for the same profile
fields. Exact response and upload requirements are UNKNOWN.

**Status:** CONFIRMED request construction.

### POST `/addtogroup/:group/:userId`

`UserManagement` converts the selected user ID to a number and lowercases the
selected role before interpolating both values. No request body is sent. The
supported UI choices are `STUDENT`, `TUTOR`, and `ADMIN`; backend group names
and response are UNKNOWN.

**Status:** CONFIRMED request construction; authorization UNKNOWN.

## Questions and Answers

### POST `/questions`

`QuestionAskForm` sends JSON `{ title, content, category, userId, createdAt }`.
The first three values are trimmed; `userId` is read from `user.id` or
`user.user.id`; `createdAt` is a client-generated ISO timestamp. The response is
inserted into the local question list. Exact response schema UNKNOWN.

**Used by:** `QuestionAskForm`, embedded in the student dashboard and questions
page. **Status:** CONFIRMED.

### GET `/questions`

Called without parameters by `StudentDashboard`, `QuestionsPage`, and
`AnswersPage`; the service also accepts an optional Axios `params` object.
Consumers expect an array. Question fields read by the UI include `id`,
`title`, `content`, `category`, `createdAt`, `upvotes`, `downvotes`, and an
optional `answers` array. The UI labels some results as “my” questions but
does not use `/questions/my`, so server filtering is UNKNOWN.

**Status:** CONFIRMED request and consumer assumptions.

### GET `/questions/my`

Defined with optional query parameters but not called by a confirmed component.
Query names, response schema, authorization, and filtering are UNKNOWN.

**Status:** DEFINED/UNUSED.

### GET `/questions/:questionId`

Defined but not called by a confirmed component. Path ID is interpolated. Query,
response, and authorization are UNKNOWN.

**Status:** DEFINED/UNUSED.

### POST `/questions/:questionId/answers`

`AnswerForm` sends JSON `{ questionId, content, userId, userName, createdAt }`.
The ID is both in the path and body; `createdAt` is a client-generated ISO
timestamp. Exact response schema UNKNOWN.

**Status:** CONFIRMED request construction.

### GET `/questions/:questionId/answers`, POST `.../upvote`, POST `.../downvote`

All three are defined in `qaService` but have no confirmed caller. Bodies,
responses, authorization, and server-side side effects are UNKNOWN.

**Status:** DEFINED/UNUSED.

## Compatibility Warnings

- Do not treat frontend-added `userId`, `userName`, or timestamps as backend-required; acceptance is UNKNOWN.
- Do not replace `/questions` with `/questions/my` without backend validation.
- Do not infer role authorization from client route guards; server enforcement is UNKNOWN.
- No network calls were made during recovery because the backend is not part of this repository.
