---
description: "The Digital Archive design system. Use when creating or editing any UI component, page, or style. Covers colors, typography, surfaces, elevation, spacing, and component patterns for the Nostalgic-Digital aesthetic."
applyTo: "src/**/*.{tsx,css}"
---

# Design System: The Digital Archive

## Creative North Star: "The Digital Curator"

Bridge a physical archive and a high-end digital gallery. This is a curated, editorial experience — not a generic social feed. Achieve the "Nostalgic-Digital" vibe through high-contrast interplay between modern, razor-sharp UI elements and elegant, historical typography.

Break the "template" look: embrace **intentional asymmetry**. Use the vertical timeline as anchor while content cards "float" at different heights. Overlapping elements — a serif headline partially masking a glassmorphism container — create physical depth and intentionality.

---

## Colors & Surface Philosophy

### Color Tokens

Use these CSS custom properties. Never use raw hex values — always reference tokens.

| Token                       | Value     | Usage                                    |
| --------------------------- | --------- | ---------------------------------------- |
| `primary`                   | `#e9c176` | Muted Gold — accents, timeline, headings |
| `primary_container`         | `#c5a059` | Darker gold — buttons, gradient end      |
| `on_primary_container`      | `#1a1400` | Text on primary containers               |
| `secondary`                 | `#71d7cd` | Retro Cyan — digital accents, glows      |
| `secondary_fixed`           | `#8ef4e9` | Verified badges, bright cyan accents     |
| `tertiary`                  | `#bac3ff` | Ghost button text, subtle highlights     |
| `error`                     | `#ffb4ab` | Error states, "love" reaction            |
| `surface`                   | `#131313` | Base canvas — never use `#000`           |
| `surface_container_lowest`  | `#171616` | Deepest nested cards                     |
| `surface_container_low`     | `#1c1b1b` | Large structural sections                |
| `surface_container`         | `#201f1f` | Standard interactive elements            |
| `surface_container_high`    | `#2a2a2a` | Active cards, modals                     |
| `surface_container_highest` | `#353434` | Highest focus elements                   |
| `surface_variant`           | `#49454f` | Glassmorphism base (at 40% opacity)      |
| `on_surface`                | `#e6e1e5` | Primary text on dark surfaces            |
| `on_surface_variant`        | `#cac4d0` | Secondary text, muted labels, icons      |
| `outline_variant`           | `#49454f` | Ghost borders (at 15% opacity only)      |

### Surface Hierarchy (Tonal Layering)

Hierarchy is built by stacking tonal layers — like polished basalt sheets.

1. **Base Level:** `surface` (#131313) — the canvas
2. **Secondary Level:** `surface_container_low` (#1c1b1b) — large structural sections
3. **Component Level:** `surface_container` (#201f1f) — standard interactive elements
4. **Elevated Level:** `surface_container_high` (#2a2a2a) — active cards, modals
5. **Focus Level:** `surface_container_highest` (#353434) — focused elements inside containers

### The "No-Line" Rule

**NEVER use `border` or `1px solid` to define sections.** Boundaries are defined solely through background color shifts or subtle tonal transitions. A `surface_container_low` section on a `surface` background provides all needed definition.

### The "Glass & Gradient" Rule

For "Nostalgic-Digital" moments, use Glassmorphism:

- **Formula:** `surface_variant` at 40% opacity + `backdrop-blur: 20px`
- **Signature Texture:** Subtle linear gradient from `primary` to `primary_container` at 10% opacity overlay on hero sections — creates "golden hour" warmth

---

## Typography

Dual-font strategy: soul + utility.

### Font Pairing

| Role                  | Font         | Weights       | Usage                           |
| --------------------- | ------------ | ------------- | ------------------------------- |
| Display & Headlines   | `Noto Serif` | 400, 500, 700 | Event titles, dates, hero text  |
| UI, Navigation & Body | `Inter`      | 400, 500, 600 | Labels, buttons, body text, nav |

### Type Scale

| Token         | Font       | Size      | Weight | Line-Height | Letter-Spacing | Usage                  |
| ------------- | ---------- | --------- | ------ | ----------- | -------------- | ---------------------- |
| `display-lg`  | Noto Serif | 3.5rem    | 400    | 1.12        | -0.02em        | Hero headlines         |
| `display-md`  | Noto Serif | 2.8rem    | 400    | 1.15        | -0.015em       | Section titles         |
| `display-sm`  | Noto Serif | 2.25rem   | 400    | 1.2         | 0              | Event year display     |
| `headline-lg` | Noto Serif | 2rem      | 400    | 1.3         | 0              | Event titles           |
| `headline-md` | Noto Serif | 1.75rem   | 400    | 1.35        | 0              | Card headings          |
| `headline-sm` | Noto Serif | 1.5rem    | 400    | 1.4         | 0              | Sub-headings           |
| `title-lg`    | Inter      | 1.375rem  | 500    | 1.3         | 0              | Section titles (UI)    |
| `title-md`    | Inter      | 1rem      | 500    | 1.5         | 0.01em         | Card subtitles         |
| `title-sm`    | Inter      | 0.875rem  | 500    | 1.4         | 0.01em         | Small titles           |
| `body-lg`     | Inter      | 1rem      | 400    | 1.6         | 0.03em         | Body text              |
| `body-md`     | Inter      | 0.875rem  | 400    | 1.5         | 0.025em        | Default body           |
| `body-sm`     | Inter      | 0.75rem   | 400    | 1.4         | 0.04em         | Captions               |
| `label-lg`    | Inter      | 0.875rem  | 500    | 1.4         | 0.01em         | Button text            |
| `label-md`    | Inter      | 0.75rem   | 500    | 1.3         | 0.05em         | Tags, metadata         |
| `label-sm`    | Inter      | 0.6875rem | 500    | 1.2         | 0.05em         | Small labels, all-caps |

### Intentional Contrast Pattern

Always pair a large Noto Serif heading with a small, all-caps Inter label:

```
"1975" in Noto Serif (display-sm) + "CHRONICLE" in Inter (label-sm, uppercase, tracking-wide)
```

This creates the signature editorial hierarchy.

### Serif Line-Height Rule

Noto Serif requires minimum **1.4x line-height** to maintain elegance. Never cram it into tight spaces.

---

## Spacing Scale

| Token        | Value   |
| ------------ | ------- |
| `spacing-1`  | 0.25rem |
| `spacing-2`  | 0.5rem  |
| `spacing-3`  | 0.75rem |
| `spacing-4`  | 1rem    |
| `spacing-6`  | 1.5rem  |
| `spacing-8`  | 2rem    |
| `spacing-10` | 2.5rem  |
| `spacing-12` | 3rem    |
| `spacing-16` | 4rem    |
| `spacing-20` | 5rem    |
| `spacing-24` | 6rem    |

Use `spacing-12` and `spacing-16` generously to let historical content breathe.

---

## Elevation & Depth

### The Layering Principle

Stack `surface_container_lowest` cards on a `surface_container_low` section to create soft, natural lift. Depth is a state of being, not a shadow.

### Ambient Shadows

For floating modals:

```css
box-shadow: 0 8px 40px 0 rgba(230, 225, 229, 0.06);
```

Uses `on_surface`-derived color. Must feel like atmospheric glow, not a drop shadow.

### The "Ghost Border" Fallback

If a container is lost against its background:

```css
border: 1px solid rgba(73, 69, 79, 0.15); /* outline_variant at 15% */
```

**NEVER use 100% opaque borders.**

---

## Roundedness

| Token  | Value    | Usage                            |
| ------ | -------- | -------------------------------- |
| `xs`   | 0.125rem | Tiny elements, tags              |
| `sm`   | 0.25rem  | Input fields, small cards        |
| `md`   | 0.375rem | Buttons, standard cards          |
| `lg`   | 0.75rem  | Large cards, containers          |
| `xl`   | 1rem     | Modals, hero elements            |
| `full` | 9999px   | Circular elements, badges, pills |

---

## Components

### Timeline (Signature Component)

- Vertical line: 1px width, `primary` (#e9c176) at 30% opacity
- Active nodes: solid `primary` circle with `secondary` (#71d7cd) outer glow (digital heartbeat)
- Content cards float at different heights — avoid rigid grid alignment

### Glassmorphism Cards

- Use the Glass formula: `surface_variant` at 40% opacity + `backdrop-blur: 20px`
- **No divider lines inside cards** — use `spacing-8` (2rem) vertical whitespace to separate Serif heading from Inter body
- Inner padding: `spacing-6` minimum

### Buttons

| Variant   | Background               | Text                   | Border                       | Radius |
| --------- | ------------------------ | ---------------------- | ---------------------------- | ------ |
| Primary   | `primary_container`      | `on_primary_container` | None                         | `md`   |
| Secondary | `surface_container_high` | `on_surface`           | `primary` Ghost Border (15%) | `md`   |
| Tertiary  | Transparent              | `tertiary`             | None                         | `md`   |

No shadows on buttons.

### Reaction Icons

- Default: monochrome icons using `on_surface_variant`
- On interaction, transition to themed color:
  - Love → `error` (#ffb4ab)
  - Like → `secondary` (#71d7cd)
- Transition: 200ms ease

### Verified Badges

- Small circle using `secondary_fixed` (#8ef4e9) background
- Inner icon with `spacing-2` (0.5rem) padding
- Feels like a digital "seal of authenticity"

---

## Image Treatment

- Use a 0–10% opacity gradient of `primary` overlaid on dark images to integrate them into the brand
- Images in cards should have `border-radius` matching the card's inner radius

---

## Do's and Don'ts

### DO:

- Embrace negative space (`spacing-12`, `spacing-16`) to let content breathe
- Use subtle gradients (0–10% opacity `primary`) over dark images
- Nest surfaces: `surface_container_highest` inside `surface_container` to show focus
- Use tonal layering for all hierarchy
- Pair Noto Serif headlines with all-caps Inter labels

### DON'T:

- **Don't use `#000` (pure black)** — use `surface` (#131313) to maintain depth
- **Don't use dividers** — no `<hr>`, no `border-bottom` separators. Use background color shift or `spacing-8` gap
- **Don't crowd the serif** — Noto Serif needs ≥1.4x line-height
- **Don't use visible borders** — if you can clearly see a border, it's too heavy. Ghost borders (15% opacity) only
- **Don't use 1px solid borders for layout** — define sections through background color alone
- **Don't use drop shadows on cards** — use tonal layering instead
- **Don't use flat, same-level surfaces** — always establish a tonal hierarchy between parent and child
