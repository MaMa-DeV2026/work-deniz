---
name: nextjs-responsive-audit
description: Systematic mobile responsiveness audit and fix pass for Next.js + Tailwind CSS projects. Iterates through every component applying responsive typography (clamp()), touch targets (44px min), mobile layouts, and verifies at 375px/768px breakpoints.
---

# Next.js Responsive Audit

Systematic mobile responsiveness pass for Next.js + Tailwind CSS projects.
Derived from a proven 12-task procedure used on a multi-page e-commerce site.

## When to use

- Project has been built desktop-first and needs mobile polish
- Before a production launch or client handoff
- When the user says "make it responsive", "mobile pass", "fix responsive issues"

## Prerequisites

- Next.js project with Tailwind CSS
- Running `next dev` for visual verification
- Knowledge of breakpoints: `sm: 640px, md: 768px, lg: 1024px, xl: 1280px` (Tailwind defaults)

## Procedure

### Step 1: Explore the project structure

```
1. List all component files (components/**/*.tsx)
2. List all page files (app/**/page.tsx)
3. Identify layout files (app/**/layout.tsx)
4. Check tailwind.config.ts for existing responsive utilities
5. Check globals.css for existing media queries
```

### Step 2: Global responsive foundations

Apply these first — they affect everything:

1. **globals.css** — Add mobile base rules:
   - `@media (pointer: coarse) { cursor: auto !important }` — hide custom cursor on touch
   - `@supports (-webkit-touch-callout: none) { body { font-size: 16px } }` — prevent iOS zoom on input focus
   - RTL line-height: `line-height: 1.9` on mobile for readability
   - Body font-size: `15px` on mobile for cramped layouts

2. **tailwind.config.ts** — Add responsive display utilities:
   - `display-xl`: `clamp(2.25rem, 8vw, 4.5rem)` (36px–72px)
   - `display-lg`: `clamp(1.75rem, 5vw, 3rem)` (28px–48px)
   - These replace hardcoded `text-[48px]` etc. throughout components

### Step 3: Component-by-component pass

Work through each component category. For each:
- Read the file
- Identify hardcoded sizes, fixed widths, missing responsive behavior
- Apply fixes
- Mark as done

**A. Navigation & Layout**
- Navbar: Hamburger/close buttons → `h-11 w-11` (44px), menu links → `min-h-[48px]`, language switcher → `min-h-[44px] min-w-[44px]`
- Footer: Mobile → single column, center-aligned, links → `min-h-[44px]`
- Admin panel (if exists): Bottom tab bar with 4 most-used sections, `fixed inset-x-0 bottom-0`, main content `pb-24`

**B. Hero & Media**
- Hero slider: Swipe velocity threshold `Math.abs(velocity.x) > 200`, responsive height
- Product gallery: Mobile horizontal scroll thumbnails (`overflow-x-auto snap-x`), dot indicators (`md:hidden`), velocity threshold
- About video / media embeds: Height `h-[min(420px,60vw)]`

**C. Typography**
- All headings with hardcoded `text-[40px]` or `text-[48px]` → `clamp()` responsive values
- Section titles: `text-[clamp(1.75rem,5vw,3rem)]`
- Hero titles: `text-[clamp(2.25rem,8vw,4.5rem)]`
- Body text on mobile: ensure `font-size >= 15px`

**D. Forms**
- All submit buttons: `min-h-[52px]`
- Input fields: `font-size: 16px` on mobile (prevents iOS zoom)

**E. Content Sections**
- Featured collections / card grids: Card height → `h-[min(400px,60vw)]`
- Stats / counters: Numbers → `text-[clamp(2.5rem,8vw,4.5rem)]`
- Testimonials: Quote marks, headings → responsive clamp

**F. Smooth scroll / scroll behavior**
- iOS: Disable Lenis/smooth-scroll libraries, fall back to CSS `scroll-behavior: smooth`
- Route change: Reset scroll position

### Step 4: Verification pass

1. Start `next dev` server
2. Open browser at 375px width (iPhone SE) — check EVERY page:
   - No horizontal scroll
   - No text overflow or overlap
   - All interactive elements tappable (44px+ touch targets)
   - Images scale properly
   - Forms usable
3. Open at 768px width (iPad portrait) — same checks
4. Fix any issues found

### Step 5: Build verification

```bash
npm run build
```

Ensure no compilation errors. Review warnings for responsive-related issues.

## Key rules

- Use `clamp()` for responsive typography instead of separate breakpoint classes
- Minimum touch target: 44x44px (Apple HIG) for navigation, 48px for links, 52px for form submits
- Never hardcode pixel values for font sizes in components — always use clamp or responsive utilities
- Test at 375px (smallest realistic phone) as the baseline
- iOS zoom prevention: inputs must be `font-size: 16px` minimum

## Stopping condition

- Every page renders without horizontal scroll at 375px and 768px
- All interactive elements meet minimum touch target sizes
- `npm run build` passes clean
- No hardcoded font sizes remain in component files
