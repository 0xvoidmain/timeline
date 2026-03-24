---
description: "Use when creating or editing React components (.tsx files in src/). Covers component patterns, Tailwind CSS styling, hooks usage, and naming conventions."
applyTo: "src/**/*.tsx"
---

# React Component Guidelines

## Component Structure

- Use named exports: `export function MyComponent() {}`
- One component per file; filename matches component name in PascalCase
- Props interface defined above the component: `interface MyComponentProps {}`
- Keep components focused — extract sub-components when a component exceeds ~150 lines

## Hooks

- Custom hooks go in `src/hooks/` with `use` prefix: `useEvents.ts`
- Use `useAuth()` from `src/context/AuthContext.tsx` for auth state
- API calls should use hooks that wrap `src/services/api.ts` — never call `fetch` in components

## Styling

- Use Tailwind CSS utility classes exclusively
- Responsive: mobile-first approach (`sm:`, `md:`, `lg:` breakpoints)
- Dark mode: use `dark:` variant for colors (e.g., `text-gray-900 dark:text-gray-100`)
- Spacing: use consistent scale (`gap-2`, `p-4`, `mb-6`)

## Patterns

- Loading states: show skeleton or text placeholder
- Error states: display user-friendly error message, not raw error
- Empty states: meaningful message with call-to-action when appropriate
- Forms: controlled inputs with proper labels and validation feedback
