# Project Context — Warranted

## Product

A paid daily briefing for indie hackers that tells them whether trending signals are worth building on — and why. The product is not trend discovery; it's the BUILD / WATCH / SKIP verdict with sourced reasoning. Every morning at 6am, a pipeline pulls rising search trends from 3 sources (trendspy PyPI package calling Google Trends' protobuf API via `trending_now()`, Google Trends RSS, Google Trends email newsletters), filters through `TOPIC_MAP` (tech/finance/health/hobbies/education) and `is_buildable()` (~90% elimination rate), clusters into macro-trends, validates pain on Reddit, checks competition via Brave Search, and uses Claude LLM to produce BUILD / WATCH / SKIP scores with confidence, risk assessment, and a product thesis. `trend_memory.py` tracks `days_seen` and `trajectory` across daily runs to distinguish 1-day spikes from sustained trends. Output: 5–8 clusters, 3–5 verdicts per daily run. Free subscribers get a weekly Monday digest. Paid subscribers get the full briefing daily.

Pipeline repo: `modryn-studio/trend-detector` (separate from this repo). This landing page does not touch the pipeline — it is the distribution layer only.

## Target User

Alex, a solo developer or indie hacker who has shipped 1–3 products before. They can build fast but keep picking the wrong problems. They spend hours on Google Trends, Reddit, and Twitter trying to spot opportunities, then second-guess themselves. They don't need more trend data — they need permission to commit. They want a system that validates pain, checks competition, and makes an opinionated call so they can stop researching and start building. They'd pay $19/month for the confidence that comes from "BUILD — here's why, here's the risk, here's who's in pain."

## Positioning

Core frame: **permission/confidence**, not trend discovery.

- The product doesn't find trends — it tells you whether a trend is worth building on, and why.
- The unique value is the BUILD/WATCH/SKIP verdict with sourced reasoning, not the data inputs.
- Copy leads with the _process_ (pain validated, competition checked, decision made), not the output.
- Machine framing over "we" language: "Runs every morning at 6am" > "We run this daily." Process language implies systematic, repeatable, verifiable — earns trust with skeptical builders.
- Social proof at launch comes from transparency about process, not borrowed credibility. Zero testimonials = show the product itself (real verdict block above the fold).
- The audience is looking for a reason to disbelieve you. Everything that looks like marketing copy is evidence against you.

## Competitor Landscape

- **Exploding Topics** — closest competitor. Wrong audience (brand managers, enterprise teams), wrong price ($39/mo, billed as $1.29/day), wrong output (trend charts, no verdict). Nobody tells you whether to build. This product does.
- **Google Trends** — free, raw data, no filtering, no buildability signal, no verdict. The pipeline is built on top of it but adds the judgment layer that Google doesn't provide.
- **Indie Hackers / r/SaaS** — community-sourced ideas, highly subjective, high noise. This product is the structured version of those threads.
- **Advantage:** Judgment layer (BUILD/WATCH/SKIP verdict with sourced reasoning) + daily cadence + indie hacker audience specificity + $19/mo pricing.

## Architecture

The landing page follows the **server shell + client content** pattern, mandated by `.github/instructions/nextjs.instructions.md`:

- `app/page.tsx` — server component. Exports `metadata` (title, description, openGraph). Renders the `<PageContent />` client component inside `<Suspense>`.
- `app/page-content.tsx` — `'use client'`. All hooks, form state, analytics calls. Contains `<FreeSignupForm>` and all interactive elements.
- Never put `'use client'` in `page.tsx` — it silently blocks metadata exports.

All API routes use `createRouteLogger` from `@/lib/route-logger`. All analytics events go through `analytics` from `@/lib/analytics.ts` — never call `gtag()` directly.

## Environment Variables

Required before any dev or deployment work:

| Variable                          | Description                                     |
| --------------------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`   | GA4 measurement ID — loaded in `layout.tsx`     |
| `RESEND_API_KEY`                  | Resend API key for subscriber management        |
| `RESEND_AUDIENCE_ID_FREE`         | Resend audience ID for `warranted-free` segment |
| `RESEND_AUDIENCE_ID_PAID`         | Resend audience ID for `warranted-paid` segment |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` | Stripe Payment Link URL for paid CTA button     |

## Analytics Events

All events defined as named methods in `@/lib/analytics.ts`. No magic strings in components.

| Event                 | Trigger                                    |
| --------------------- | ------------------------------------------ |
| `free_signup_submit`  | User submits free email form               |
| `free_signup_success` | API confirms email added to Resend segment |
| `paid_cta_click`      | User clicks "Get the daily brief — $19/mo" |

## Deployment

mode: modryn-app
url: https://modrynstudio.com/tools/warranted
basePath: /tools/warranted

## Stack Additions

- Resend — free tier email delivery (Monday digest for free segment, daily briefing for paid segment)
- Stripe — subscription via Payment Link (no Checkout Sessions, no webhooks at launch)
  - Launch price: $19/month, $149/year — low friction while social proof is zero
  - Raise to $39/month at ~50 subscribers. Grandfather early subscribers at $19.
  - Payment Link redirects to ?subscribed=true on success
  - Subscribers manually added to Resend paid segment until ~50 subs, then automate with webhook
- No database. No auth. No user accounts.

## Project Structure Additions

None at launch. The landing page is the entire app. Future additions (Week 4+):

- `/app/archive/` — past briefings rendered from markdown, gated by magic link tokens
- `/api/stripe-webhook/route.ts` — auto-add/remove subscribers to Resend paid segment

## Route Map

- `/` → Landing page: value prop, sample briefing screenshot, free email signup (Resend), paid CTA (Stripe Payment Link), social proof
- `/privacy` → Privacy policy (auto-generated by boilerplate)
- `/terms` → Terms of service (auto-generated by boilerplate)

Future routes (not for launch):

- `/archive` → Gated briefing archive for paid subscribers (Week 6+, magic link auth)
- `/archive/[date]` → Individual briefing page (rendered from briefing markdown)
- `/api/stripe-webhook` → Stripe webhook for subscription lifecycle events (Week 4+)
- `/api/verify-token` → Magic link token verification for archive access (Week 6+)

## Monetization

Subscription via Stripe Payment Link (subscription mode).

- Free tier: weekly Monday digest email (top 3 clusters + competition verdicts + story section). Captured via Resend email signup on landing page. Segment: `warranted-free`.
- Paid tier: $19/month or $149/year at launch. Full daily briefing delivered via email. Segment: `warranted-paid`. Payment Link created in Stripe Dashboard, linked from landing page CTA.
- Pricing strategy: $19 is the launch price — reduces friction while social proof is zero. At ~50 paid subscribers with testimonials, raise to $39/month. Early subscribers grandfathered at $19.

Implementation phases:

- **Launch (Week 1):** Stripe Payment Link for subscriptions. Manual subscriber management (Stripe payment notification → manually add email to Resend paid segment). Landing page has free email signup + paid CTA button.
- **Week 4+ (~50 paid subscribers):** Add `/api/stripe-webhook` route to auto-manage Resend segments on `customer.subscription.created`, `customer.subscription.deleted`, and `invoice.payment_failed` events.
- **Week 6+ (when subscribers request it):** Add `/archive` with magic link auth. Each daily email includes a tokenized archive link. Token validated against Stripe customer email via `/api/verify-token`. No passwords, no accounts.
- **Month 3+ (pSEO play):** Past briefings (7-day delay) become public pages at `/archive/[date]`. Targets long-tail queries: "what to build 2026," "trending startup ideas March 2026," "indie hacker ideas [month] [year]." Paid subscribers still get same-day access via email. Public archive is the SEO growth engine.

## Free vs. Paid Content Split

| Content                              | Free (Monday digest) | Paid (daily briefing) |
| ------------------------------------ | -------------------- | --------------------- |
| Cluster table (top 3)                | ✅                   | ✅ (all clusters)     |
| Competition verdicts                 | ✅                   | ✅                    |
| The Story section                    | ✅                   | ✅                    |
| BUILD/WATCH/SKIP decisions           | ❌                   | ✅                    |
| Reddit pain excerpts                 | ❌                   | ✅                    |
| LLM build ideas + context seeds      | ❌                   | ✅                    |
| Full reasoning + risk assessment     | ❌                   | ✅                    |
| Unclustered signals                  | ❌                   | ✅                    |
| Trend memory (trajectory, days seen) | ❌                   | ✅                    |

## Target Subreddits

- r/indiehackers — where the target user already hangs out and asks "what should I build?"
- r/SaaS — micro-SaaS founders looking for niches
- r/startups — early-stage founders evaluating opportunities
- r/Entrepreneur — broader founder audience, high traffic

## Social Profiles

- X/Twitter: https://x.com/lukehanner
- GitHub: https://github.com/modryn-studio/warranted
- Dev.to: https://dev.to/lukehanner
- Ship or Die: https://shipordie.club/lukehanner
