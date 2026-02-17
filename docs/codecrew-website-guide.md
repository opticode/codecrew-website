# CodeCrew Software Inc. — Website Implementation Guide

## Overview

Build a stunning, static marketing website for **CODECREW SOFTWARE INC.**, a BC-based software development company that leverages AI-augmented development steered by 30+ years of human expertise. The site must have a genuine "wow factor" through modern CSS animations, scroll-triggered reveals, and polished micro-interactions — while remaining dead-simple to maintain and deploy.

**Live URL target:** `https://codecrew.dev` (or similar) via GitHub Pages with custom domain.

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Framework** | Astro 5 | Zero JS by default, ships only what you need. Built-in content collections for blog/updates. |
| **Islands** | Vue 3 (via `@astrojs/vue`) | Interactive components only where needed. **Do NOT use React.** |
| **Styling** | Tailwind CSS 4 (via `@astrojs/tailwind`) | Utility-first, purged in production for tiny bundles |
| **Animations** | GSAP (GreenSock) + ScrollTrigger | Industry-standard performant scroll animations, loaded client-side |
| **Fonts** | Google Fonts (self-hosted via `@fontsource`) | Two distinctive fonts — see Design section |
| **Icons** | Astro Icon + Lucide icon set | Clean, consistent, lightweight, no JS needed |
| **Deployment** | GitHub Pages via GitHub Actions | Astro has an official adapter — push to `main`, site deploys automatically |
| **Forms** | Formspree or `mailto:` link | Zero backend needed |
| **Content** | Astro Content Collections (Markdown/MDX) | Blog posts and updates as `.md` files in the repo. Type-safe, zero-config. |

### Why Astro Over a Vue SPA

- **Zero JavaScript by default** — marketing pages ship as pure HTML + CSS. Lighthouse performance is essentially free.
- **Content Collections** — blog posts and updates are just Markdown files with frontmatter. Type-checked schemas, automatic slug generation, built-in pagination. No CMS needed.
- **Vue where you want it** — any component that needs interactivity (animated counters, mobile nav toggle, contact form) uses `client:visible` or `client:load` directives to hydrate only that island.
- **File-based routing** — add a page by adding a file. No router config.
- **First-class GitHub Pages support** — official `@astrojs/sitemap` and static adapter, official GitHub Actions workflow in their docs.

### Dev → Push → Deploy Cycle

```
1. Edit content (Markdown) or code (Astro/Vue components)
2. git add . && git commit -m "update" && git push
3. GitHub Action builds and deploys automatically (~60 seconds)
4. Live at https://codecrew.dev
```

That's it. No build servers to manage, no deployment scripts to remember.

---

## Design Direction

### Aesthetic: "Precision Engineering Meets Creative Energy"

Think: dark, sophisticated base with electric accent colors and purposeful motion. The site should feel like a high-end dev tool or creative agency — not a generic corporate template.

### Brand Elements

- **Logo:** The existing CodeCrew logo features angle brackets `< >` with dots representing AI collaboration. Use this prominently.
- **Tagline suggestion:** "AI-Powered Development. Human-Driven Excellence." (or similar — iterate)
- **Color Palette:**
  - **Base:** Near-black (`#0a0a0f`) with subtle blue undertone
  - **Surface:** Dark charcoal (`#12121a`) for cards/sections
  - **Primary accent:** Electric cyan/teal (`#00e5ff` or similar)
  - **Secondary accent:** Warm amber/gold (`#f5a623`) for highlights
  - **Text:** Off-white (`#e8e8ed`) for body, pure white for headings
  - **Muted:** Slate gray (`#6b7280`) for secondary text
  - Define all as CSS custom properties for consistency

### Typography

Choose two distinctive fonts from Google Fonts via `@fontsource` packages (self-hosted, no external requests). Suggestions (pick ONE pairing — don't use Inter, Roboto, or Arial):

- **Option A:** `JetBrains Mono` (headings — codes credibility) + `Source Sans 3` (body)
- **Option B:** `Syne` (headings — bold, geometric, memorable) + `Outfit` (body)
- **Option C:** `Space Grotesk` (headings) + `DM Sans` (body)
- **Option D:** `Clash Display` or `Cabinet Grotesk` (via Fontsource if available) + `General Sans`

Whichever is chosen: headings should feel bold and technical, body text clean and highly readable.

### Animation & Motion Strategy

**Key principle for Astro:** Most animations should be CSS-only (no JS payload). GSAP is only loaded for the few components that genuinely need scroll-triggered orchestration — use Astro's `client:visible` directive so it's not loaded until the user scrolls to that section.

Layer these effects for cumulative wow factor:

1. **Hero section:**
   - Animated gradient mesh or subtle particle field background (CSS keyframes preferred, canvas fallback)
   - Logo animates in with a typing/assembly effect (CSS animation)
   - Tagline reveals with staggered letter or word animation (CSS `animation-delay`)
   - Subtle floating geometric shapes (angle brackets, dots) as ambient decoration (CSS `@keyframes float`)

2. **Scroll-triggered reveals (GSAP ScrollTrigger — Vue island):**
   - Each section fades + slides in as user scrolls
   - Service cards stagger in one by one
   - Stats/numbers count up when scrolled into view
   - Progress indicators or timeline animations for the "experience" section
   - **Load GSAP only via `client:visible`** so the homepage ships zero JS above the fold

3. **Micro-interactions (CSS-only where possible):**
   - Service cards: glassmorphism effect with subtle glow on hover
   - Buttons: satisfying press/scale effect
   - Navigation: smooth underline animation on hover
   - All achievable with CSS `transition` and `:hover` — no JS needed

4. **Section transitions:**
   - Diagonal or wave SVG dividers between sections (Astro components, pure HTML/CSS)
   - Parallax depth on background elements (CSS `transform` with scroll, or GSAP for complex cases)
   - Color theme shifts between sections (dark → slightly lighter → dark)

5. **Performance guardrails:**
   - Use `will-change` sparingly
   - Respect `prefers-reduced-motion` via `@media` queries — provide graceful fallbacks
   - All CSS animations must hit 60fps
   - GSAP only loaded in islands that need it
   - Lazy-load anything below the fold

---

## Site Structure & Content

### Page Architecture

```
Pages:
  / ........................ Home (single-page with smooth-scroll sections)
  /blog .................... Blog listing page (paginated)
  /blog/[slug] ............. Individual blog posts
  /updates ................. Updates/changelog listing
  /updates/[slug] .......... Individual update posts
```

The homepage is a single-page experience with smooth-scroll navigation. Blog and updates are separate routes using Astro's content collections.

### Navigation (sticky, transparent → solid on scroll)

- Logo (left)
- Section links: Services | Our Edge | About | Blog | Contact
- Mobile: hamburger menu (Vue island with `client:load` for the toggle)

---

### Homepage Section 1: Hero

**Full viewport height. Maximum impact.**

```
[Animated background — gradient mesh or subtle particles]

< CodeCrew />    ← Logo, animated assembly

AI-Powered Development. Human-Driven Excellence.

We build exceptional software at unprecedented speed —
an elite crew of AI agents guided by three decades of
engineering mastery.

[CTA Button: "Explore Our Services" → smooth scroll]
[CTA Button (secondary): "Get In Touch" → smooth scroll to contact]
```

### Homepage Section 2: Services

**What We Build**

Present as animated cards with icons. Each card should have:
- An icon (from Lucide set via astro-icon)
- Title
- 2-3 sentence description
- Subtle hover animation (glow, lift, border shimmer)

#### Service Cards:

1. **Path to Retire** — Badge: "Flagship Product"
   - Icon: TrendingUp or LineChart
   - "Comprehensive Canadian retirement planning platform combining retirement simulation with dividend portfolio tracking. Purpose-built for Canadians aged 40-65 who want clarity on their financial future."

2. **Nonprofit & Sports Organization Tools**
   - Icon: Users or Heart
   - "Custom digital solutions for nonprofits and curling organizations — from event management to member tracking. Built with deep understanding of how community organizations actually work."

3. **Board Game Applications**
   - Icon: Dice5 or Gamepad2
   - "Digital companions, scoring tools, and utilities for the tabletop gaming community. Bringing modern software craftsmanship to an analog passion."

4. **Custom Software Development**
   - Icon: Code2 or Terminal
   - "Full-stack application development tailored to your needs. From concept through deployment, we build software that solves real problems with clean, maintainable code."

5. **Digital Modernization & AI Consulting**
   - Icon: Sparkles or Brain
   - "Strategic consulting for organizations navigating digital transformation. Specializing in practical AI integration, agentic workflows, and modernization strategies that actually deliver results."

### Homepage Section 3: Our Edge (Differentiators)

**Why CodeCrew?**

Two-column or alternating layout with animated elements:

#### ⚡ Unprecedented Development Speed
"Our development crew isn't a team of juniors — it's an elite squad of top-tier AI agents working in concert, orchestrated through sophisticated toolchains and workflows. What takes traditional teams weeks, we deliver in days."

Consider: an animated timeline or speed comparison visualization showing traditional vs. CodeCrew development timelines.

#### 🧠 30+ Years of Human Mastery
"AI is the engine. Experience is the steering wheel. Every line of code is guided by three decades of software architecture across virtually every language, platform, and paradigm. We've seen what works, what fails, and what lasts."

Consider: an animated tech stack cloud or scrolling ticker of technologies/languages/platforms.

#### 🍁 Built in Canada, For Canada
"Headquartered in British Columbia. Our flagship product is purpose-built for Canadian tax law, RRSP/TFSA rules, and provincial regulations across all 13 jurisdictions. We understand the Canadian landscape because we live it."

#### 💡 Quality Over Quantity
"We don't ship fast and break things. We ship fast and build things right. AI-augmented development means speed WITHOUT sacrificing code quality, test coverage, or maintainability."

### Homepage Section 4: About / Company

Brief section, humanizing the brand:

```
CodeCrew Software Inc. is a BC-incorporated software company
blending decades of hands-on engineering experience with
cutting-edge AI-augmented development practices.

Founded by a veteran software architect with experience spanning
enterprise systems, community organizations, and everything in
between — we bring the craft and care of experienced engineering
to every project, amplified by the speed and capability of
modern AI tooling.
```

Optional: small "tech we work with" icon grid (Django, Python, Vue, Tailwind, SQLite, etc.) with subtle float animation.

### Homepage Section 5: Latest from the Blog

**Dynamic section** pulling the 3 most recent blog posts from the content collection. Each card shows:
- Post title
- Date
- Short excerpt/description
- "Read more →" link

This section auto-updates whenever you add a new blog post — no manual homepage editing required.

### Homepage Section 6: Contact

Clean, minimal:

```
Let's Build Something Great

[Email link: hello@codecrew.dev or similar]
[Location: Trail, British Columbia, Canada]
[GitHub icon → github.com/codecrew-software (or your org)]

— or —

[Simple contact form via Formspree: Name, Email, Message, Submit]
```

### Footer

Minimal:
```
© 2025 CodeCrew Software Inc. | Trail, BC, Canada
[GitHub] [LinkedIn] [Email]
```

---

## Content Collections (Blog & Updates)

### Schema Definition

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    image: z.string().optional(), // OG image for social sharing
  }),
});

const updates = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/updates' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    type: z.enum(['feature', 'announcement', 'milestone']).default('announcement'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, updates };
```

### Writing a Blog Post

Just create a Markdown file:

```markdown
<!-- src/content/blog/hello-world.md -->
---
title: "Why We Built CodeCrew Around AI-Augmented Development"
description: "The story behind our approach to software development"
date: 2025-06-15
tags: ["ai", "development", "company"]
---

Your blog post content here in regular Markdown...
```

Push to `main` → auto-deploys with the new post included. The homepage "Latest from the Blog" section picks it up automatically.

### Writing an Update

```markdown
<!-- src/content/updates/path-to-retire-beta.md -->
---
title: "Path to Retire Enters Public Beta"
description: "Our flagship retirement planning platform is now available for testing"
date: 2025-07-01
type: "milestone"
---

Update content here...
```

---

## Project Structure

```
codecrew-website/
├── astro.config.mjs           # Astro config — integrations, site URL
├── tailwind.config.mjs        # Tailwind theme extensions
├── package.json
├── public/
│   ├── CNAME                  # Custom domain for GitHub Pages
│   ├── favicon.svg
│   ├── robots.txt
│   └── og-image.png           # Default social sharing image
├── src/
│   ├── content.config.ts      # Content collection schemas
│   ├── content/
│   │   ├── blog/              # Blog posts as .md files
│   │   │   └── hello-world.md
│   │   └── updates/           # Updates as .md files
│   │       └── initial-launch.md
│   ├── data/
│   │   └── content.ts         # All homepage text centralized here for easy editing
│   ├── layouts/
│   │   ├── BaseLayout.astro   # HTML shell — head, meta, fonts, footer
│   │   ├── PostLayout.astro   # Blog post layout with reading time, tags
│   │   └── UpdateLayout.astro # Update post layout
│   ├── pages/
│   │   ├── index.astro        # Homepage — assembles all sections
│   │   ├── blog/
│   │   │   ├── index.astro    # Blog listing with pagination
│   │   │   └── [...slug].astro # Dynamic blog post pages
│   │   └── updates/
│   │       ├── index.astro    # Updates listing
│   │       └── [...slug].astro # Dynamic update pages
│   ├── components/
│   │   ├── NavBar.astro       # Sticky nav (mostly static HTML/CSS)
│   │   ├── NavMobile.vue      # Mobile menu toggle (Vue island, client:load)
│   │   ├── HeroSection.astro  # Hero — pure CSS animations, no JS
│   │   ├── ServicesSection.astro
│   │   ├── ServiceCard.astro  # Glassmorphism card — CSS hover effects
│   │   ├── EdgeSection.astro
│   │   ├── AboutSection.astro
│   │   ├── BlogPreview.astro  # Latest 3 blog posts section
│   │   ├── ContactSection.astro
│   │   ├── FooterSection.astro
│   │   ├── PostCard.astro     # Reusable blog/update card
│   │   ├── interactive/       # Vue islands — only these ship JS
│   │   │   ├── ScrollReveal.vue     # GSAP ScrollTrigger wrapper
│   │   │   ├── AnimatedCounter.vue  # Number count-up on scroll
│   │   │   └── ContactForm.vue      # Form with validation
│   │   └── ui/
│   │       ├── GlowCard.astro       # Reusable glow-on-hover card
│   │       ├── SectionDivider.astro  # Wave/diagonal SVG dividers
│   │       ├── Badge.astro           # "Flagship Product" etc.
│   │       └── GradientBackground.astro  # Hero background effect
│   ├── styles/
│   │   └── global.css         # Tailwind directives + custom keyframes
│   └── assets/
│       └── logo.svg
└── .github/
    └── workflows/
        └── deploy.yml         # Auto-deploy to GitHub Pages on push
```

### Key Architectural Decisions

**Astro components (.astro) = static HTML.** These ship zero JavaScript. Use for everything that doesn't need client-side interactivity: navigation links, service cards, section layouts, SVG dividers, blog post listings.

**Vue islands (.vue) = interactive bits only.** Hydrated with client directives:
- `client:load` — loads immediately (use for: mobile nav toggle)
- `client:visible` — loads when scrolled into view (use for: GSAP scroll animations, animated counters)
- `client:idle` — loads when browser is idle (use for: contact form)

This means the homepage loads with near-zero JavaScript and progressively hydrates interactive elements as needed.

---

## Implementation Notes for Claude Code

### Project Setup

```bash
npm create astro@latest codecrew-website -- --template minimal
cd codecrew-website

# Add integrations
npx astro add vue
npx astro add tailwind
npx astro add sitemap

# Animation library (only loaded in Vue islands)
npm install gsap

# Self-hosted fonts
npm install @fontsource-variable/syne @fontsource-variable/outfit
# (or whichever pairing is chosen)

# Icons
npm install astro-icon @iconify-json/lucide
```

### Astro Config

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://codecrew.dev', // Update to actual domain
  integrations: [vue(), tailwind(), sitemap()],
  output: 'static', // Pure static build — this is the default
});
```

### Centralized Content

All homepage text lives in `src/data/content.ts`. Blog/update content lives in `src/content/` as Markdown. To update the site:

1. Edit a `.ts` or `.md` file
2. `git push`
3. Done — GitHub Action handles the rest

### GSAP in Vue Islands

```vue
<!-- src/components/interactive/ScrollReveal.vue -->
<template>
  <div ref="container">
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const container = ref(null)

onMounted(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return

  gsap.from(container.value.children, {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: container.value,
      start: 'top 85%',
    },
  })
})
</script>
```

Usage in an Astro component:
```astro
---
import ScrollReveal from '../components/interactive/ScrollReveal.vue';
---
<ScrollReveal client:visible>
  <div class="service-card">...</div>
  <div class="service-card">...</div>
  <div class="service-card">...</div>
</ScrollReveal>
```

### CSS Animation Examples

```css
/* src/styles/global.css */
@import 'tailwindcss';

/* Gradient mesh animation for hero background */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-gradient {
  background: linear-gradient(-45deg, #0a0a0f, #12121a, #001a2e, #0a1628);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

/* Glassmorphism card effect */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}
.glass-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(0, 229, 255, 0.3);
  box-shadow: 0 0 30px rgba(0, 229, 255, 0.1);
  transform: translateY(-4px);
}

/* Floating ambient shapes */
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

/* Shimmer border effect on hover */
.shimmer-border {
  position: relative;
}
.shimmer-border::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, transparent 0%, rgba(0, 229, 255, 0.4) 50%, transparent 100%);
  background-size: 200% 100%;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  padding: 1px;
  opacity: 0;
  transition: opacity 0.3s ease;
  animation: shimmer 2s linear infinite;
}
.shimmer-border:hover::after {
  opacity: 1;
}

@keyframes shimmer {
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
}

/* Stagger animation for hero text */
.stagger-in > * {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;
}
.stagger-in > *:nth-child(1) { animation-delay: 0.1s; }
.stagger-in > *:nth-child(2) { animation-delay: 0.3s; }
.stagger-in > *:nth-child(3) { animation-delay: 0.5s; }
.stagger-in > *:nth-child(4) { animation-delay: 0.7s; }

@keyframes fadeInUp {
  to { opacity: 1; transform: translateY(0); }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### GitHub Pages Deployment

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

This uses GitHub's official Pages deployment (no `gh-pages` branch needed, no third-party actions with PATs).

---

## SEO & Meta

In `BaseLayout.astro`, include:

- `<title>` and `<meta name="description">` (per-page via props)
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`)
- Twitter card meta tags
- Canonical URL
- Structured data (JSON-LD) for Organization schema
- `robots.txt` in `/public`
- Sitemap generated automatically by `@astrojs/sitemap`

For blog posts, `PostLayout.astro` should override OG tags with post-specific title, description, and image.

---

## Out of Scope (For Now)

- Client portal or login
- Analytics (add Plausible or Simple Analytics later — privacy-respecting, no cookie banners, ~$12 CAD/month)
- Multi-language support
- E-commerce or payment processing
- Comments on blog posts (consider Giscus via GitHub Discussions later)

---

## Quality Checklist

Before considering the site "done":

- [ ] All CSS animations smooth at 60fps
- [ ] `prefers-reduced-motion` gracefully handled throughout
- [ ] Lighthouse: 95+ Performance, 100 Accessibility, 100 Best Practices, 90+ SEO
- [ ] Responsive: looks great on mobile (375px), tablet (768px), desktop (1280px+)
- [ ] All nav links scroll smoothly / route correctly
- [ ] Contact form/email link functional
- [ ] Blog listing and individual post pages render correctly
- [ ] Updates listing and individual update pages render correctly
- [ ] Custom domain configured and HTTPS working via GitHub Pages
- [ ] Open Graph preview looks good when shared (test with opengraph.xyz)
- [ ] Content proofread — no placeholder text remaining
- [ ] Tested in Chrome, Firefox, Safari (at minimum)
- [ ] Zero JavaScript shipped on pages that don't need interactive islands
- [ ] RSS feed for blog (Astro has `@astrojs/rss` for this — nice-to-have)
