# CLAUDE.md — CodeCrew Website

## Project Overview

Corporate website for CodeCrew Software Inc. (codecrew.dev). Astro 5 static site with Vue 3 island components, Tailwind CSS 4, and GSAP animations. Deployed to GitHub Pages via GitHub Actions on push to `main`.

## Commands

- `bun run dev` — Local dev server (localhost:4321)
- `bun run build` — Production build to `dist/`
- `bun run preview` — Preview production build locally
- Always verify `bun run build` passes before considering work complete

## Tech Stack

- **Astro 5** — Static site generator with island architecture
- **Vue 3** — Interactive components only (`<script setup lang="ts">`)
- **Tailwind CSS 4** — Utility classes + custom component classes in `global.css`
- **GSAP** — Scroll-triggered animations and counters
- **TypeScript** — Strict mode (`astro/tsconfigs/strict`)
- **Bun** — Package manager and runtime
- **Formspree** — Contact form submission
- **astro-icon** — Icon system using `@iconify-json/lucide`

## Architecture

### Directory Structure

```
src/
  components/          # Astro components (static)
    interactive/       # Vue components (hydrated islands)
    ui/                # Small reusable UI primitives
  content/             # Content collections (blog/, updates/)
  data/content.ts      # Centralized site data (services, edge, about, contact)
  layouts/             # BaseLayout, PostLayout, UpdateLayout
  pages/               # File-based routing
  styles/global.css    # Design tokens, keyframes, component classes
```

### Data Flow

- **Static data** lives in `src/data/content.ts` — services, edge items, about, contact config, site metadata
- **Content collections** use Astro's `getCollection()` with Zod schemas defined in `src/content.config.ts`
- **Props** flow down from pages → sections → cards. Components define `interface Props` and destructure from `Astro.props`

### Routing

| Route | Source | Data |
|---|---|---|
| `/` | `pages/index.astro` | content.ts |
| `/services/[slug]` | `pages/services/[slug].astro` | content.ts services array |
| `/blog` | `pages/blog/index.astro` | blog collection |
| `/blog/[...slug]` | `pages/blog/[...slug].astro` | blog collection |
| `/updates` | `pages/updates/index.astro` | updates collection |
| `/updates/[...slug]` | `pages/updates/[...slug].astro` | updates collection |

Dynamic routes use `getStaticPaths()` to generate pages at build time.

## Styling

### Design Tokens (`global.css` @theme block)

- **Colors:** backdrop `#0a0a0f`, surface `#12121a`, primary `#00e5ff` (cyan), secondary `#f5a623` (orange), text `#e8e8ed`, muted `#6b7280`
- **Fonts:** Syne Variable (headings), Outfit Variable (body)

### Custom CSS Classes

Use these instead of reinventing — they're defined in `global.css`:

- `.glass-card` — Glassmorphism container (blur, border, shadow, animated gradient on hover)
- `.shimmer-border` — Animated gradient border on hover (via `::after`)
- `.btn-primary` / `.btn-secondary` — Button styles
- `.nav-link` — Nav link with animated underline
- `.section-heading` / `.section-subheading` — Section title typography
- `.prose` — Blog/long-form content styling
- `.hero-gradient` — Animated gradient background
- `.stagger-in` — Sequential child entrance animations

### Conventions

- Prefer Tailwind utilities for one-off styling — use `font-heading`, `text-primary`, `bg-backdrop`, etc. instead of inline `style` attributes with `var()`
- In `global.css`, custom base styles go in `@layer base`, custom component classes go in `@layer components` — **never** write unlayered CSS (it overrides all Tailwind utilities)
- In `global.css`, use `theme(--color-primary)` instead of `var(--color-primary)` to reference design tokens
- Add to `global.css` only for reusable patterns or animations
- Dark theme only — all colors assume dark background
- Use `clamp()` for fluid typography via arbitrary values: `text-[clamp(0.9rem,2.5vw,1.35rem)]`
- All animations must respect `prefers-reduced-motion` (there's a blanket media query in global.css)

## Component Conventions

### Astro Components

- PascalCase filenames: `ServiceCard.astro`
- Define props via `interface Props { ... }` in frontmatter
- Use `astro-icon` for icons: `<Icon name="lucide:arrow-right" class="w-4 h-4" />`

### Vue Interactive Components (`src/components/interactive/`)

- Use `<script setup lang="ts">` with `defineProps<>()`
- Hydration directives matter:
  - `client:load` — Immediate (NavMobile)
  - `client:idle` — After page idle (ContactForm)
  - `client:visible` — On scroll into view (ScrollReveal)
- Keep Vue components minimal — most of the site is static Astro

### UI Primitives (`src/components/ui/`)

- Small, single-purpose: Badge, GlowCard, GradientBackground, SectionDivider
- Composable with other components

## Content Collections

### Blog (`src/content/blog/*.md`)

```yaml
title: string        # Required
description: string  # Required
date: date           # Required
tags: string[]       # Optional
draft: boolean       # Default false — filtered out in listing pages
image: string        # Optional
```

### Updates (`src/content/updates/*.md`)

```yaml
title: string        # Required
description: string  # Required
date: date           # Required
type: feature | announcement | milestone  # Default "announcement"
draft: boolean       # Default false
```

## Adding Content

### New Service

1. Add entry to `services` array in `src/data/content.ts` with `title`, `slug`, `icon`, `badge`, `description`, `longDescription`
2. The detail page at `/services/[slug]` is generated automatically via `getStaticPaths()`

### New Blog Post

1. Create `src/content/blog/your-slug.md` with required frontmatter
2. Listed automatically on `/blog` and routed to `/blog/your-slug`

### New Update

1. Create `src/content/updates/your-slug.md` with required frontmatter
2. Listed automatically on `/updates` and routed to `/updates/your-slug`

## Deployment

- Push to `main` triggers GitHub Actions (`.github/workflows/deploy.yml`)
- Builds with Bun on ubuntu-latest, deploys to GitHub Pages
- Custom domain: codecrew.dev (configured via `public/CNAME` and `astro.config.mjs` site field)
- Sitemap auto-generated by `@astrojs/sitemap`

## Gotchas

- **Tailwind 4 token naming collisions:** `@theme` color tokens generate utility classes (e.g. `--color-foo` → `text-foo`, `bg-foo`). Never name a color token to collide with built-in Tailwind utilities (`base`, `sm`, `lg`, `xl`, `xs`, etc.) — this was the cause of a critical bug where `--color-base` hijacked `text-base` from font-size to color
- Tailwind 4 uses `@theme` for design tokens, not `tailwind.config.js` — config is inline in `global.css`
- The Vite plugin for Tailwind is `@tailwindcss/vite`, configured in `astro.config.mjs`
- Icon names must be `lucide:*` or `mdi:*` format (from `@iconify-json/lucide` and `@iconify-json/mdi`)
- Content collection schemas are in `src/content.config.ts` (not inside the content directory)
- Blog/update listing pages filter `draft: true` entries — set `draft: false` or omit to publish
