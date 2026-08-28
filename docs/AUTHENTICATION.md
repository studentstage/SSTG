# Legacy Authentication

## State and Storage

- `access_token` and serialized `user_data` are stored in `localStorage`.
- A token's presence is the only local authentication check; there is no expiry parsing or refresh-token flow.
- `tokenService` extracts roles from `role`, `profile.role`, `user.profile.role`, or `user.role`, then uppercases them.
- Username extraction supports `username` and `user.username`.

## Flow

1. Login posts `{ email, password }` to `/login`.
2. Registration posts `{ username, email, password, confirm_password }` to `/register`.
3. Both expect `Access Token` or `ACCESS TOKEN` plus `user`.
4. The token and basic user are stored immediately.
5. A background `/me` request runs with retries. If role data is absent and an ID exists, `/profiles/:id` is attempted.
6. `/redirect` sends `ADMIN`, `TUTOR`, and `STUDENT` to their dashboards; an unknown role falls through to `/dashboard`.
7. On reload, a persisted token triggers the same user refresh before protected content renders.

## Headers and Failure Behavior

Axios adds `Authorization: Token <access_token>` to every request when present.
HTTP 401 clears both local keys, emits `auth:logout`, and navigates to
`/login`. This navigation does not explicitly account for the Vite `/SSTG/`
basename and may fail on GitHub Pages.

Logout attempts `POST /logout`, then clears local state regardless of response.
The `storage` and `auth:logout` events update the context user state. There is
no dedicated cross-tab logout protocol beyond the browser storage event and
the custom event in the current tab.

## Forms and UX

Login validates only non-empty email/password locally. “Remember me” is visual
only. Registration validates username length, email shape, password length,
password confirmation, and displays password-strength indicators.

## Unknowns and Risks

- Token format, expiry, revocation, refresh behavior, and exact error schema are UNKNOWN.
- Server role claims and profile response nesting are only tolerated heuristically by the frontend.
- Backend authorization and session invalidation are UNKNOWN.
- Storing credentials in localStorage increases exposure if an XSS exists.
- Missing role data can leave `/redirect` displaying “Fetching your profile...” indefinitely.
