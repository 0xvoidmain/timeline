# Features — Timeline

Tracking all features for the Timeline world event app. Updated after each feature is implemented or modified.

---

## Implemented

### Bun Native Routing

- **Description**: Server refactored from manual path matching in a fetch handler to Bun's built-in `routes` property in `Bun.serve()`, with route files exporting route objects and `BunRequest` for type-safe params
- **Status**: Implemented
- **Key Files**: `server/index.ts`, `server/routes/events.ts`, `server/routes/auth.ts`
- **Date**: 2026-03-24

### OAuth Authentication

- **Description**: Users can sign in via Google OAuth, session managed with JWT in httpOnly cookies
- **Status**: Implemented
- **Key Files**: `server/routes/auth.ts`, `server/config/oauth.ts`, `server/lib/jwt.ts`, `server/middleware/auth.ts`, `src/context/AuthContext.tsx`
- **Date**: 2026-03-24

### Event CRUD API

- **Description**: RESTful API for creating, reading, updating, and deleting timeline events with Zod validation
- **Status**: Implemented
- **Key Files**: `server/routes/events.ts`, `server/models/Event.ts`, `src/services/api.ts`
- **Date**: 2026-03-24

### Event Listing Page

- **Description**: Home page displays a list of public/anonymous events from the API with loading and error states
- **Status**: Implemented
- **Key Files**: `src/pages/HomePage.tsx`, `src/components/EventCard.tsx`, `src/services/api.ts`
- **Date**: 2026-03-24

### Event Visibility

- **Description**: Events can be public, private, or anonymous; filtering respects visibility settings
- **Status**: Implemented
- **Key Files**: `server/models/Event.ts`, `server/routes/events.ts`
- **Date**: 2026-03-24

### Navigation Bar

- **Description**: Top navigation with app branding, auth state display, and login/logout buttons
- **Status**: Implemented
- **Key Files**: `src/components/Navbar.tsx`, `src/context/AuthContext.tsx`
- **Date**: 2026-03-24

### Shared Types Architecture

- **Description**: Single source of truth for types, Zod schemas, and constants shared between frontend and backend via a `shared/` directory
- **Status**: Implemented
- **Key Files**: `shared/types.ts`, `shared/schemas.ts`, `shared/constants.ts`, `src/types/index.ts`
- **Date**: 2026-03-24

---

## In Progress

_No features currently in progress._

---

## Planned

### Event Filtering UI

- **Description**: Filter events by category, country, and date range from the frontend
- **Status**: Planned
- **Key Files**: TBD
- **Date**: —

### Add Event Form

- **Description**: Authenticated users can submit new events via a form with validation
- **Status**: Planned
- **Key Files**: TBD
- **Date**: —

### Wikipedia/Media Import

- **Description**: Fetch event data from Wikipedia or media sources to populate the timeline
- **Status**: Planned
- **Key Files**: TBD
- **Date**: —

### User Profile Page

- **Description**: View own events, edit profile, manage private vs public events
- **Status**: Planned
- **Key Files**: TBD
- **Date**: —

---

## Removed

_No features removed._
