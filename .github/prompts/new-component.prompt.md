---
description: "Create a new React component with TypeScript types, Tailwind CSS styling, and proper patterns."
agent: "agent"
---

Create a new React component for the Timeline app:

## Steps

1. **Create component file** in `src/components/` (reusable) or `src/pages/` (route-level)
   - Use named export: `export function ComponentName() {}`
   - Define props interface above component: `interface ComponentNameProps {}`
   - Use Tailwind CSS utility classes for all styling
   - Support dark mode with `dark:` variants

2. **Add to routing** if it's a page component:
   - Add `<Route>` in `src/App.tsx`

3. **Connect to data** if needed:
   - Use API methods from `src/services/api.ts`
   - Handle loading, error, and empty states

4. **Update FEATURES.md** if this is part of a new feature

Ask what the component should render and how users interact with it before starting.
