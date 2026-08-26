# Student Stage Frontend Foundation

This document records the rebuild foundation. The legacy recovery documents
remain the historical record and API compatibility boundary. No product pages
are implemented in this phase.

## Status Vocabulary

- **CONFIRMED:** observed in the legacy source or recovery record.
- **DECISION:** selected for the rebuild foundation.
- **UNKNOWN:** requires backend or product confirmation.
- **FUTURE:** intentionally deferred.

## Structure

```text
src/
  app/                  provider composition and application entry
  components/ui/        small accessible design primitives
  config/               environment-derived configuration
  features/             domain boundaries (auth, theme, future product areas)
  lib/                  framework-independent utilities and error model
  services/api/         shared transport client
  styles/               reserved for future style modules
```

The old `components`, `contexts`, `layouts`, `pages`, and service modules remain
on the rebuild branch as recoverable legacy source but are no longer imported
by the active entry point. They will be migrated or removed as each feature is
rebuilt, after its contract is understood.

## API and Errors

**CONFIRMED:** the backend uses the legacy paths in `API_CONTRACT.md`, a
`VITE_API_URL` base, and `Authorization: Token <access_token>`.

**DECISION:** `services/api/client.js` centralizes base URL normalization,
authentication headers, a 10-second timeout, cancellation through Axios
`signal`, 401 local cleanup, and normalized error categories. Read requests may
be retried later only with an explicit policy. Mutations are never implicitly
retried. Development request logging is deferred until sensitive-data rules are
defined.

**UNKNOWN:** backend response schemas, authorization, expiry/revocation, and
which legacy payload fields are required.

## Authentication and State

**DECISION:** `SessionProvider` is the only global session owner. It restores
the existing `access_token`/`user_data` keys, calls the confirmed `/me` endpoint
on startup, reacts to storage/custom logout events, and exposes normalized role
state. There is no refresh-token assumption. Feature data will remain local to
feature hooks/components or a future server-state library after its need is
measured.

The legacy localStorage token constraint is retained for compatibility; it is a
frontend security boundary and remains vulnerable to successful XSS. Backend
security cannot be solved by this frontend.

## Theme and Design System

**DECISION:** semantic CSS variables support light/dark themes. The default is
the operating-system preference, with a persistent user override. Temporary
neutral colors intentionally avoid selecting final Student Stage branding.
`Button`, `Input`, `Card`, `Spinner`, `EmptyState`, and `ErrorState` establish
the first primitive APIs. Native HTML controls are preferred; focus, labels,
disabled/loading states, errors, 44px touch targets, and reduced motion are
baseline conventions.

**FUTURE:** Dialog, Select, Checkbox, Radio, Badge, Avatar, Dropdown, Tabs,
Tooltip, Toast, Skeleton, and richer form primitives as real workflows require.

## Responsive and Accessibility Strategy

Mobile and desktop use the same semantic markup and fluid constraints. Critical
actions cannot depend on hover. Tailwind breakpoints remain the centralized
responsive vocabulary; feature-specific arbitrary breakpoints are discouraged.
The target is WCAG 2.2 AA: semantic elements first, visible keyboard focus,
associated labels, `role="alert"` for errors, reduced-motion support, contrast,
and touch-friendly targets.

## PWA and Network Resilience

**DECISION:** the manifest and service worker cover only the application shell
and same-origin static GET assets. API requests, authenticated data, and
mutations are not cached. The Netlify `_redirects` file supports history routes.
There are no icons yet because the final identity is intentionally deferred.

**FUTURE:** update prompts, install UX, safe public-resource caching, online
status hooks, stale-data policies, and deliberate offline mutation behavior.

## Performance and Testing

**DECISION:** future routes must be lazy-loaded at route boundaries; feature
modules own their data fetching; request cancellation is supported; images and
external assets require explicit sizing and optimization. Bundle analysis is
deferred until product routes exist.

The lint command is active. **FUTURE:** Vitest/Testing Library unit and
component tests, accessibility checks, and Playwright journeys for auth, Q&A,
admin workflows, and PWA install/update behavior. No test library is added
until the first testable feature is implemented.

## AI, Credits, and MVP Boundaries

`features/ai-assistant/` is reserved as a future boundary. No AI client,
provider, key, fake response, or undocumented endpoint exists. A future secret
integration should use a backend gateway.

SaaS, schools, tenants, billing, subscriptions, white-labeling, and tenant
switching are explicitly outside MVP. A future About/Team experience will
visibly credit Student Stage Team, Tukur Sunusi Gama (Frontend Development & API
Integration), Ahmad Sani (Backend Development), and Sani Auwal (UI/UX Design).
The final logo and colors are intentionally deferred.

## Intentionally Not Implemented

Home, authentication forms, dashboards, profile, Q&A pages, resources, tutor
and admin workflows, AI, chat, final branding/logo, install UX, offline API
data, offline mutation queues, and multi-school SaaS features.
