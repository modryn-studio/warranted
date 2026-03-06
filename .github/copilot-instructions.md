# Warranted — Copilot Context

## Who I Am

Luke Hanner — solo founder of Modryn Studio. AI-assisted builder shipping micro-niche tools fast. Warranted is a paid daily briefing for indie hackers that tells them whether trending signals are worth building on — and why. The target user is a solo developer who can execute fast but wastes weeks building things nobody wants because they picked the wrong problem. They don't need more trend data — they need permission to commit.

## Deployment

mode: modryn-app
url: https://modrynstudio.com/tools/warranted
basePath: /tools/warranted

## Stack

- Next.js 15 (App Router) with TypeScript
- Tailwind CSS for styling
- Vercel for deployment
- GA4 for custom event tracking (via `@/lib/analytics.ts` — never call `gtag()` directly)
- Vercel Analytics `<Analytics />` component in `layout.tsx` for pageviews only — do not use their `track()` API
- Resend — email delivery for free (Monday digest) and paid (daily briefing) subscriber segments
- Stripe — subscription via Payment Link (no Checkout Sessions, no webhooks at launch)

## Project Structure

```
/app                    → Next.js App Router pages
/components             → Reusable UI components
/lib                    → Utilities, helpers, data fetching
/config                 → Site metadata (site.ts)
/docs                   → Validation reports, strategy docs
```

## Route Map

- `/` → Landing page: hero with real verdict block, free email signup (Resend), paid CTA (Stripe Payment Link)
- `/privacy` → Privacy policy
- `/terms` → Terms of service

## Brand & Voice

### Voice

- Short. Direct. No filler. Every sentence earns its place.
- Confident and opinionated — this product makes calls, not suggestions.
- Honest about uncertainty: "signal is early," "Reddit inconclusive," "watch before you commit."
- Talks like a sharp founder talking to another founder over coffee. Not a marketing team.
- Use process language over "we" language. Machine framing earns more trust — "Runs every morning at 6am" > "We run this daily." "Pain validated across 12 Reddit threads" > "We check Reddit."
- Never use: "powerful," "seamless," "revolutionary," "unlock," "leverage," "game-changing," "AI-powered" (the AI is invisible — the output is what matters)

### Visual

- Dark mode base, no toggle (tool for builders, used at 6 AM with coffee)
- Accent color: Amber / Burnt Orange (#F97415) — semantic signal color, not a general accent. Reserved for BUILD verdict labels, primary CTA buttons, key data points. Never as background fill or decoration.
- Verdict label colors: BUILD = amber (#F97415). WATCH = muted yellow or neutral gray. SKIP = dim gray.
- System font stack (Inter fallback) for body. Mono for scores, verdicts, and data labels.
- No motion. No gradients, no glassmorphism, no decorative illustrations, no fake testimonials, no stock photos.

### Target User

Indie hackers and micro-SaaS founders who are tired of guessing what to build. They've shipped before, they know how to execute, but they waste weeks building things nobody wants. They don't need more trend data — they need permission to commit.

### Emotional Arc

- Land: "Wait — this actually makes the call for me? BUILD or SKIP, with reasoning?"
- Read: "This is a real system. Pain validated across Reddit threads. Competition checked. Confidence scored."
- Scroll: "That sample briefing is way more useful than Exploding Topics."
- Convert (free): "I want that Monday digest in my inbox."
- Convert (paid): "I need this every morning, not once a week."

### Copy Reference

- Hero: "Stop guessing. Start building the right thing."
- Alt hero: "You already know what's trending. This tells you whether it's worth building — and why."
- Subhead: "Every morning at 6am: trending signals scored, Reddit pain validated, competition checked, BUILD or SKIP decision made. You just execute."
- CTA (free): "Get the Monday signal — free."
- CTA (paid): "Get the daily brief — $19/mo."
- Social proof: "Built on the same system that decides what Modryn Studio builds."
- Footer: "Built by Luke. Fueled by trendspy, Reddit, and too much coffee."
- Error: "Something broke. Try again."

### Layout Rule

Show the product first. The hero section must contain a real verdict block — actual pipeline output, not a description of output. Real sample verdict above the fold, not below it.

## README Standard

Every project README follows this exact structure — no more, no less:

```markdown
![Project Name](public/brand/banner.png)

# Project Name

One-line tagline. Outcome-focused — lead with what the user gets, not the technology.

→ [domain.com](https://domain.com)

---

Next.js · TypeScript · Tailwind CSS · Vercel
```

Rules:

- **Banner image** — always first. Path is `public/brand/banner.png`.
- **H1 title** — product name only, no subtitle.
- **Tagline** — one sentence. What the user gets. No buzzwords ("powerful", "seamless", "AI-powered").
- **Live link** — `→ [domain.com](https://domain.com)` format. Always present if live.
- **Divider** — `---` separator before the stack line.
- **Stack line** — `·`-separated list of core tech only. No version numbers, no descriptions.
- **Nothing else.** No install instructions, no contributing section, no architecture diagrams, no screenshots beyond the banner. Real docs go in `/docs` or on the live site.

When adding a badge row (optional, for open source tools/libraries only):

- Place it between the H1 and the tagline
- Use shields.io format: `[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)`
- Keep it to 3 badges max: typically license + CI status + live site
- Apps (not libraries) should skip badges entirely

## Tailwind v4

This project uses Tailwind CSS v4. The rules are different from v3 — follow these exactly.

**Design tokens live in `@theme`, not `:root`:**
```css
/* ✅ correct — generates text-accent, bg-surface, border-border, etc. */
@theme {
  --color-accent: #F97415;
  --color-surface: #111111;
  --color-border: #222222;
  --color-muted: #666666;
  --color-text: #e5e5e5;
  --color-bg: #050505;
  --font-heading: var(--font-sans);
}

/* ❌ wrong — :root creates CSS variables but NO utility classes */
:root {
  --color-accent: #F97415;
}
```

**Use `(--color-*)` shorthand in class strings — never `[var(--color-*)]`:**
```tsx
// ✅ correct — TW v4 native shorthand
<div className="border-(--color-border) bg-(--color-surface) text-(--color-muted)" />

// ❌ wrong — v3 bracket notation, verbose and unnecessary in v4
<div className="border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]" />
```

If tokens are defined in `@theme`, you can also use the short utility names directly:
```tsx
// ✅ also correct when @theme is properly set up
<div className="border-border bg-surface text-muted text-accent" />
```

Never add `tailwind.config.*` — v4 has no config file. All theme customization goes in `globals.css` under `@theme`.

## API Route Logging

Every new API route (`app/api/**/route.ts`) MUST use `createRouteLogger` from `@/lib/route-logger`.

```typescript
import { createRouteLogger } from '@/lib/route-logger';
const log = createRouteLogger('my-route');

export async function POST(req: Request): Promise<Response> {
  const ctx = log.begin();
  try {
    log.info(ctx.reqId, 'Request received', {
      /* key fields */
    });
    // ... handler body ...
    return log.end(ctx, Response.json(result), {
      /* key result fields */
    });
  } catch (error) {
    log.err(ctx, error);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

- `begin()` prints the `─` separator + START line with a 5-char `reqId`
- `info()` / `warn()` log mid-request milestones
- `end()` logs ✅ with elapsed ms and returns the response
- `err()` logs ❌ with elapsed ms
- Never use raw `console.log` in routes — always go through the logger

## Analytics

All custom events MUST go through `analytics` from `@/lib/analytics.ts` — never call `gtag()` directly.

```typescript
import { analytics } from '@/lib/analytics';
analytics.track('event_name', { prop: value });
```

Add a named method to `analytics.ts` for each distinct user action. Named methods are typed and
discoverable — no magic strings scattered across 10 files.

GA4 measurement ID is loaded via `NEXT_PUBLIC_GA_MEASUREMENT_ID` in `layout.tsx`.

## Dev Server

Start with `Ctrl+Shift+B` (default build task). This runs:

```
npm run dev -- --port 3000 2>&1 | Tee-Object -FilePath dev.log
```

Tell Copilot **"check logs"** at any point — it reads `dev.log` and flags errors or slow requests.

## Code Style

- Write as a senior engineer: minimal surface area, obvious naming, no abstractions before they're needed
- Comments explain WHY, not what
- One file = one responsibility
- Prefer early returns for error handling
- Never break existing functionality when adding new features
- Leave TODO comments for post-launch polish items

## Core Rules

- Every page earns its place — no pages for businesses not yet running
- Ship fast, stay honest — empty is better than fake
- Ugly is acceptable, broken is not — polish the core action ruthlessly
- Ship one killer feature, not ten mediocre ones
- Instrument analytics before features — data from day one
- Onboard users to value in under 2 minutes
