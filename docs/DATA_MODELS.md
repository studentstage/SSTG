# Legacy Frontend Data Models

These are fields read or sent by the frontend. They are observed assumptions,
not authoritative backend schemas. Fields marked UNKNOWN require validation.

## Authentication Response

```text
{ "Access Token" OR "ACCESS TOKEN": string, user: object }
```

The exact token key casing is variable in the observed client. User nesting may
be flat, under `user`, or include `profile`.

## User/Profile

Observed fields: `id`, `username`, `email`, `role`, `full_name`, `date_joined`,
`image`, `address`, `sector`, and `marked_as`. Role may be nested at
`profile.role`, `user.role`, or `user.profile.role`. The profile ID versus user
ID relationship is UNKNOWN.

Profile update fields are `full_name`, `address`, `sector`, `marked_as`, and
optional `image` (file). Response shape is UNKNOWN.

## Question

Fields read: `id`, `title`, `content`, `category`, `createdAt`, `upvotes`,
`downvotes`, and `answers[]`. The create payload additionally sends `userId`
and a client-generated ISO `createdAt`. Whether timestamps are server-managed,
whether field names are case-sensitive, and whether `answers` is always
embedded are UNKNOWN.

## Answer

Fields read: `id`, `content`, `userName`, `createdAt`, `isAccepted`,
`upvotes`, and `downvotes`. The submit payload sends `questionId`, `content`,
`userId`, `userName`, and a client-generated ISO `createdAt`. Exact response
shape is UNKNOWN.

## Admin Profile List

The UI accepts either `Profile[]` or `{ results: Profile[] }`. It tolerates
identity at `user.id`, `user_id`, or `id`, and role at multiple nesting levels.
This permissive mapping does not establish a backend contract.

## Local-Only Models

Books, videos, conversations/messages, AI responses, student achievements, and
tutor dashboard metrics are defined in page-local constants or state. Their
structures are implementation details and have no API contract in this
repository.
