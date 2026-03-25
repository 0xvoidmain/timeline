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

- **Description**: RESTful API for creating, reading, updating, and deleting timeline events with Zod validation; events support slug, image, eventType, status, sources array, metadata array, period (anniversary), scoring (baseScore/engagementScore/score), versioning (currentVersion), denormalized reactionCounts/commentCount/viewCount, contributors array, and approval fields (approvedBy/approvedAt/reviewNote); POST creates initial EventVersion snapshot and updates Category/YearStat counts; PUT creates version snapshot; DELETE decrements stats; includes GET `/api/events/:id/versions` for version history and POST `/api/events/:id/approve` for moderator/admin approval
- **Status**: Implemented
- **Key Files**: `server/routes/events.ts`, `server/models/Event.ts`, `src/services/api.ts`
- **Date**: 2026-03-25
- **Note**: Updated 2026-03-25: expanded with slug, image, eventType, status, sources, metadata, period, scoring, versioning, denormalized counts, contributors, and approval endpoints

### Event Listing Page

- **Description**: Home page displays a list of public/anonymous events from the API with loading and error states
- **Status**: Implemented
- **Key Files**: `src/pages/HomePage.tsx`, `src/components/EventCard.tsx`, `src/services/api.ts`
- **Date**: 2026-03-24
- **Note**: Superseded by Homepage UI — The Digital Archive (2026-03-25)

### Event Visibility (API)

- **Description**: Events can be public, private, or anonymous; filtering respects visibility settings and also supports filtering by eventType and status
- **Status**: Implemented
- **Key Files**: `server/models/Event.ts`, `server/routes/events.ts`
- **Date**: 2026-03-25
- **Note**: Updated 2026-03-25: added eventType and status filtering

### All Category Default

- **Description**: "Tất cả" (All) added as the default first category option in the Navbar; selecting it shows events from all categories; default route is `/2026/all`
- **Status**: Implemented
- **Key Files**: `src/components/Navbar.tsx`, `src/App.tsx`
- **Date**: 2026-03-25

### Navigation Bar

- **Description**: Top navigation with app branding, auth state display, and login/logout buttons
- **Status**: Implemented
- **Key Files**: `src/components/Navbar.tsx`, `src/context/AuthContext.tsx`
- **Date**: 2026-03-24
- **Note**: Rewritten as part of Homepage UI — The Digital Archive (2026-03-25)

### Path-based Routing

- **Description**: Routes support `/` (home), `/:year` (year only), and `/:year/:category` (year + category), all rendering HomePage; App.tsx is a layout shell (Navbar + TimelineNav + Outlet) with no handler logic; TimelineNav reads year from route params and navigates internally; Navbar reads category from route params and navigates internally; HomePage reads year/category from route params and tracks scroll-vs-timeline state internally
- **Status**: Implemented
- **Key Files**: `src/App.tsx`, `src/pages/HomePage.tsx`, `src/components/Navbar.tsx`, `src/components/TimelineNav.tsx`
- **Date**: 2026-03-25
- **Note**: Replaces URL Search Params Sync. Updated 2026-03-25: simplified to three catch-all routes; moved all param reading into child components; App.tsx reduced to layout shell with Outlet

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
- **Note**: Routing changed from `?event=ID` to `/:year/:category/:slug` by Event Detail Slug Routing (2026-03-25)

### Event Detail Slug Routing

- **Description**: Event detail popup opens via clean URL route `/:year/:category/:slug` instead of `?event=ID` search params; slugs are auto-generated from event titles using a `slugify()` helper that strips diacritics, lowercases, and replaces non-alphanumeric characters with hyphens
- **Status**: Implemented
- **Key Files**: `src/App.tsx`, `src/pages/HomePage.tsx`, `src/components/EventCard.tsx`, `src/components/EventCardWide.tsx`, `src/data/dummyEvents.ts`
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

- **Description**: Single source of truth for types, Zod schemas, and constants shared between frontend and backend via a `shared/` directory; includes 10+ interfaces (Category, YearStat, Comment, Reaction, ReactionTypeConfig, EventVersion, EventSource, EventMetadata, EventPeriod, EventContributor, ReactionCount), validation schemas (createCommentSchema, createReactionSchema, createCategorySchema, approveEventSchema, createReactionTypeSchema), and constants (EVENT_STATUS, EVENT_TYPE, USER_ROLE, REACTION_TARGET, DEFAULT_REACTION_TYPES)
- **Status**: Implemented
- **Key Files**: `shared/types.ts`, `shared/schemas.ts`, `shared/constants.ts`, `src/types/index.ts`
- **Date**: 2026-03-25
- **Note**: Updated 2026-03-25: expanded with 10+ new interfaces, new Zod schemas, and new constants

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

### Anniversary Events

- **Description**: Events can be type "anniversary" with an optional period field (startYear, endYear, description) representing the time span the event reflects, separate from the display date
- **Status**: Implemented
- **Key Files**: `server/models/Event.ts`, `shared/schemas.ts`, `shared/types.ts`
- **Date**: 2026-03-25

### Category Management

- **Description**: Dedicated Category collection with name, slug, icon, color, order, and eventCount; REST API for CRUD (admin-only for writes); event counts auto-update on event create/delete
- **Status**: Implemented
- **Key Files**: `server/models/Category.ts`, `server/routes/categories.ts`, `src/services/api.ts`
- **Date**: 2026-03-25

### Comments System

- **Description**: Threaded comments on events with support for nested replies up to depth 3; comment CRUD with ownership checks; moderator/admin can delete any comment; event's commentCount auto-updated
- **Status**: Implemented
- **Key Files**: `server/models/Comment.ts`, `server/routes/comments.ts`, `src/services/api.ts`
- **Date**: 2026-03-25

### Configurable Reaction Types

- **Description**: Admin-manageable reaction types with name, icon (Material Symbols), label, color, and sort order; default types seeded: like, love, sad, wow, angry; API for listing active types and admin CRUD
- **Status**: Implemented
- **Key Files**: `server/models/ReactionType.ts`, `server/routes/reaction-types.ts`, `src/services/api.ts`
- **Date**: 2026-03-25

### Database Migration Script

- **Description**: Migration script to upgrade existing data: migrate source/sourceUrl to sources array, generate slugs, set default values for new fields, seed Category/YearStat/ReactionType collections from existing data; run with `bun run server/scripts/migrate-v2.ts`
- **Status**: Implemented
- **Key Files**: `server/scripts/migrate-v2.ts`
- **Date**: 2026-03-25

### Event Approval Workflow

- **Description**: Public events require moderator/admin approval; events go through draft → pending → verified/rejected status flow; role-based access control: only moderator and admin users can approve or reject events; approval metadata (approvedBy, approvedAt, reviewNote) stored on the event
- **Status**: Implemented
- **Key Files**: `server/models/Event.ts`, `server/routes/events.ts`, `server/middleware/auth.ts`, `shared/constants.ts`
- **Date**: 2026-03-25

### Event Scoring

- **Description**: Events have baseScore (manually set), engagementScore (computed from reactions/views/comments), and score (sum of both); score is indexed for sorting and can be used by the UI to highlight important events
- **Status**: Implemented
- **Key Files**: `server/models/Event.ts`, `shared/types.ts`
- **Date**: 2026-03-25

### Event Versioning

- **Description**: Full snapshot version history for events; every edit creates an EventVersion record with the complete event state before changes; versions are auto-numbered; API endpoints to list and retrieve version history
- **Status**: Implemented
- **Key Files**: `server/models/EventVersion.ts`, `server/routes/events.ts`, `src/services/api.ts`
- **Date**: 2026-03-25

### Flexible Event Metadata

- **Description**: Events have a metadata array of {label, info, group} objects for storing flexible key-value information that doesn't fit fixed schema fields; supports grouping for UI organization
- **Status**: Implemented
- **Key Files**: `server/models/Event.ts`, `shared/schemas.ts`, `shared/types.ts`
- **Date**: 2026-03-25

### Reactions System

- **Description**: Flexible reaction system for both events and comments; toggle-based (add/remove); denormalized reaction counts on target documents for fast reads; unique constraint ensures one reaction of each type per user per target
- **Status**: Implemented
- **Key Files**: `server/models/Reaction.ts`, `server/routes/reactions.ts`, `src/services/api.ts`
- **Date**: 2026-03-25

### Rich Event Sources

- **Description**: Events store sources as an array of {title, content, url} instead of single source/sourceUrl fields; supports multiple citations with descriptions
- **Status**: Implemented
- **Key Files**: `server/models/Event.ts`, `shared/schemas.ts`, `shared/types.ts`
- **Date**: 2026-03-25
- **Note**: Replaces the old source/sourceUrl fields; migration script handles conversion

### User Roles

- **Description**: Users have a role field (user, moderator, admin); role-based middleware (requireRole) protects admin/moderator-only endpoints; default role is "user"
- **Status**: Implemented
- **Key Files**: `server/models/User.ts`, `server/middleware/auth.ts`, `shared/constants.ts`
- **Date**: 2026-03-25

### Year Statistics

- **Description**: YearStat collection tracks event count per year; auto-updated on event create/delete; API endpoint to list years with event counts
- **Status**: Implemented
- **Key Files**: `server/models/YearStat.ts`, `server/routes/years.ts`, `src/services/api.ts`
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
- **Note**: Category filtering partially covered by Path-based Routing

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

### URL Search Params Sync

- **Description**: Year and category state sync to browser URL as `?year=XXXX&category=slug` search params; state initializes from URL on page load; Navbar category links act as toggle buttons (re-clicking deselects); existing `?event=ID` param is preserved across changes
- **Status**: Removed
- **Key Files**: `src/App.tsx`, `src/pages/HomePage.tsx`, `src/components/Navbar.tsx`, `src/components/TimelineNav.tsx`
- **Date**: 2026-03-25
- **Note**: Replaced by Path-based Routing (2026-03-25)

### Sidebar

- **Description**: Fixed left sidebar with vertical timeline navigation, zoom slider, and settings/help links; hides on mobile for responsive layout
- **Status**: Removed
- **Key Files**: `src/components/Sidebar.tsx`
- **Date**: 2026-03-25
- **Note**: Shell merged into TimelineNav; zoom slider, settings/help footer, and era header removed
