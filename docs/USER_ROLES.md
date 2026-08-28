# Legacy User Roles

The frontend distinguishes an unauthenticated **Guest** state from the
authenticated roles `STUDENT`, `TUTOR`, and `ADMIN`. These are client-side
rules only; backend permissions are UNKNOWN.

## Guest

Can access `/`, `/login`, `/register`, and the catch-all under-construction
page. Can submit login or registration forms. Protected dashboard routes
redirect to `/login`. Forgot-password and several public links are visible but
not declared routes.

## Student

Client route access: `/dashboard`, `/student/questions`, `/student/answers`,
`/student/books`, `/student/videos`, `/student/ai-assistant`,
`/student/chat`, and `/student/stats`. Any authenticated role can access
`/profile` through the shared guard, although the sidebar is role-dependent.

Observed actions: load/create questions, submit answers, refresh user data,
edit profile, use locally simulated books/videos/AI/chat/stats. Question and
answer API authorization is UNKNOWN.

## Tutor

Client route access: `/tutor/dashboard`. The sidebar also links to
`/tutor/questions`, `/tutor/answers`, `/tutor/upload`, `/tutor/assignments`,
`/tutor/students`, `/tutor/chat`, and `/tutor/analytics`, but those routes are
not declared and fall through to under construction. The dashboard actions and
metrics are static/toast-only. Backend permissions are UNKNOWN.

## Admin

Client route access: `/admin/dashboard` and `/admin/users`. The sidebar also
links to moderation, analytics, news, books, and settings routes that are not
declared. Admin pages list profiles and assign roles through the API. Pending
approvals are hardcoded to zero, and delete user is explicitly disabled.
Backend admin authorization is UNKNOWN.

## Guard Behavior

`DashboardLayout` checks token presence. `RequireRole` compares the normalized
role exactly and redirects mismatches to `/redirect`; shared profile access has
no required role. Missing/unknown roles are not actually accepted by the
student route despite a comment suggesting otherwise.
