---
description: "End-to-end workflow for adding a new feature to the Timeline app. Creates model, route, service function, component, and updates FEATURES.md."
agent: "agent"
---

Implement a new feature for the Timeline app following this full-stack workflow:

## Steps

1. **Define the data model** (if needed):
   - Add or update Mongoose schema in `server/models/`
   - Add proper indexes and types

2. **Create API route**:
   - Add Zod validation schema
   - Implement CRUD endpoints in `server/routes/`
   - Wire into `server/index.ts`
   - Use `requireAuth` for write operations

3. **Add frontend API service**:
   - Add typed methods to `src/services/api.ts`
   - Add/update TypeScript interfaces in `src/types/index.ts`

4. **Build UI components**:
   - Create page in `src/pages/` and/or components in `src/components/`
   - Use Tailwind CSS for styling
   - Add route to `src/App.tsx` if it's a new page

5. **Update FEATURES.md**:
   - Add the feature entry with name, description, status, key files, and date

Always ask what the feature should do before starting implementation.
