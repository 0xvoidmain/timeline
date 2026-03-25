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
- **Note**: Superseded by Homepage UI — The Digital Archive (2026-03-25)

### Event Visibility (API)

- **Description**: Events can be public, private, or anonymous; filtering respects visibility settings
- **Status**: Implemented
- **Key Files**: `server/models/Event.ts`, `server/routes/events.ts`
- **Date**: 2026-03-24

### Navigation Bar

- **Description**: Top navigation with app branding, auth state display, and login/logout buttons
- **Status**: Implemented
- **Key Files**: `src/components/Navbar.tsx`, `src/context/AuthContext.tsx`
- **Date**: 2026-03-24
- **Note**: Rewritten as part of Homepage UI — The Digital Archive (2026-03-25)

### Design System Foundation — The Digital Archive

- **Description**: Nostalgic-Digital design tokens (dark theme, gold/cyan accents) via Tailwind v4 @theme, Google Fonts (Inter, Noto Serif, Material Symbols Outlined), and cleaned base styles
- **Status**: Implemented
- **Key Files**: `src/index.css`, `src/App.css`, `index.html`
- **Date**: 2026-03-25

### Engagement Bar

- **Description**: Reaction buttons (like/love/sad) with counts and comment count display for event cards
- **Status**: Implemented
- **Key Files**: `src/components/EngagementBar.tsx`
- **Date**: 2026-03-25

### Event Detail Modal

- **Description**: Full-screen overlay modal for viewing detailed event information, triggered by clicking any event card; uses URL search params (`?event=ID`) for direct linking and bookmarkability
- **Status**: Implemented
- **Key Files**: `src/components/EventDetailModal.tsx`, `src/components/EventDetailHeader.tsx`, `src/components/MediaPlayer.tsx`, `src/components/StatsCard.tsx`, `src/components/QuoteCard.tsx`, `src/components/ContentSection.tsx`, `src/components/ReactionBar.tsx`, `src/components/CommentCard.tsx`, `src/data/dummyEventDetails.ts`, `src/components/EventCard.tsx`, `src/components/EventCardWide.tsx`, `src/pages/HomePage.tsx`
- **Date**: 2026-03-25

### Event Card — Glassmorphism Redesign

- **Description**: Rewritten event card with glassmorphism styling, image overlays, verification badges, and engagement bars using Digital Archive design tokens
- **Status**: Implemented
- **Key Files**: `src/components/EventCard.tsx`, `src/components/VerificationBadge.tsx`, `src/components/EngagementBar.tsx`
- **Date**: 2026-03-25

### Event Card Wide Variant

- **Description**: Horizontal featured card variant for highlighted timeline events
- **Status**: Implemented
- **Key Files**: `src/components/EventCardWide.tsx`
- **Date**: 2026-03-25

### Floating Action Button

- **Description**: Fixed bottom-right FAB for quick action access
- **Status**: Implemented
- **Key Files**: `src/components/FloatingActionButton.tsx`
- **Date**: 2026-03-25

### Homepage UI — The Digital Archive

- **Description**: Fully redesigned homepage with Nostalgic-Digital aesthetic featuring a masonry-like 3-column event card grid, glassmorphism cards, dummy data for visual preview, and responsive layout that collapses to single column on mobile
- **Status**: Implemented
- **Key Files**: `src/pages/HomePage.tsx`, `src/components/EventCard.tsx`, `src/components/EventCardWide.tsx`, `src/components/Navbar.tsx`, `src/components/TimelineNav.tsx`, `src/App.tsx`
- **Date**: 2026-03-25
- **Note**: HomePage rewritten with virtual scrolling year sections (2026-03-25)

### Search Input

- **Description**: Rounded search field with icon for the top navigation bar
- **Status**: Implemented
- **Key Files**: `src/components/SearchInput.tsx`
- **Date**: 2026-03-25

### Shared Types Architecture

- **Description**: Single source of truth for types, Zod schemas, and constants shared between frontend and backend via a `shared/` directory
- **Status**: Implemented
- **Key Files**: `shared/types.ts`, `shared/schemas.ts`, `shared/constants.ts`, `src/types/index.ts`
- **Date**: 2026-03-24

### Timeline Navigation

- **Description**: Full fixed left sidebar with scrollable vertical timeline spanning 3000 BCE to 2026; generates year markers at varying density, gold connector line, active-state glow, and auto-scrolls active year into view on mount
- **Status**: Implemented
- **Key Files**: `src/components/TimelineNav.tsx`, `src/App.tsx`, `src/pages/HomePage.tsx`
- **Date**: 2026-03-25
- **Note**: Merged Sidebar shell into TimelineNav (2026-03-25); removed zoom slider, settings/help footer, and era header. Updated with controlled year sync for bidirectional scroll↔nav linking (2026-03-25)

### Virtual Scrolling Year Timeline

- **Description**: Events grouped by year (2026→2000) with continuous vertical scrolling, virtualized rendering via @tanstack/react-virtual, bidirectional sync between scroll position and TimelineNav active year
- **Status**: Implemented
- **Key Files**: `src/data/dummyEvents.ts`, `src/pages/HomePage.tsx`, `src/components/TimelineNav.tsx`, `src/App.tsx`, `package.json`
- **Date**: 2026-03-25

### Verification Badge

- **Description**: Verified/pending status pill overlay for event cards
- **Status**: Implemented
- **Key Files**: `src/components/VerificationBadge.tsx`
- **Date**: 2026-03-25

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

### Sidebar

- **Description**: Fixed left sidebar with vertical timeline navigation, zoom slider, and settings/help links; hides on mobile for responsive layout
- **Status**: Removed
- **Key Files**: `src/components/Sidebar.tsx`
- **Date**: 2026-03-25
- **Note**: Shell merged into TimelineNav; zoom slider, settings/help footer, and era header removed
