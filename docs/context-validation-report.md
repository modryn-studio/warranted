## Plan: What to Build — Landing Page

**TL;DR:** The pipeline is live and producing real output. The landing page is the primary deliverable. It needs to do one job: convert a skeptical indie hacker who's never heard of this into either a free list subscriber or a $19/mo paid sub. The strategy is show-don't-tell: a real screenshot of a real briefing above the fold is more persuasive than any headline. The free/paid split already exists in Resend; the only missing piece is the page itself.

**Steps**

1. Configure [site.ts](site.ts) with product name, URL, tagline, accent color (`#F97415`), and social links from [context.md](context.md) and [brand.md](brand.md)

2. Build `app/page.tsx` as a server component exporting full metadata — hero section with tagline, subhead, and one real briefing screenshot (dark background, amber accent, monospace for scores/verdicts per [brand.md](brand.md)); no fake testimonials, no stock photos

3. Add a `<FreeSignupForm>` client component (`app/page-content.tsx` pattern per the updated nextjs instructions) that POSTs to a new API route `/api/subscribe` — calls Resend API to add email to the `what-to-build-free` audience segment

4. Add a "Get the daily brief — $19/mo" Stripe Payment Link CTA button (external link, no Checkout Session needed at launch)

5. Build `app/api/subscribe/route.ts` using `createRouteLogger` from `@/lib/route-logger`, calling Resend's contacts API, returning a clean success/error response

6. Add `analytics.track()` calls in `<FreeSignupForm>` for `free_signup_submit` and `free_signup_success` events; add a named method in `@/lib/analytics.ts` for each

7. Wire `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `RESEND_API_KEY`, and `STRIPE_PAYMENT_LINK` env vars

8. Build `/privacy` and `/terms` pages (boilerplate already in repo)

9. Add `public/brand/banner.png` and update README.md to match the standard from copilot-instructions.md

**Verification**

- `npm run dev` → load `/tools/what-to-build` → submit a test email → confirm contact appears in Resend `what-to-build-free` audience
- Verify GA4 event fires in DebugView
- Confirm `metadata.title` and `openGraph` render correctly in `<head>`
- Check that `'use client'` exists only in `page-content.tsx`, not `page.tsx`

**Decisions**

- Server shell + client content pattern: `page.tsx` (server, metadata) + `FreeSignupForm` in `page-content.tsx` (client, form state) — required by latest nextjs instructions
- No database, no auth — Resend is the subscriber list
- Stripe Payment Link only (no webhooks at launch) — manual subscriber management until ~50 subs
- Price: $19 launch, grandfather clause, raise to $39 at 50 subs

Rebuttal:
The Reframe
**1. "More signals = better decisions" — the moat is judgment, not data.**

**Correct, and the pipeline already reflects this.** The three sources (trendspy, RSS, email) aren't about breadth for breadth's sake — they feed cross-referencing (multi-source boost) and `is_buildable()` filtering, which eliminates ~90% of signals before scoring. The output is typically 5–8 clusters with 3–5 BUILD/WATCH/SKIP verdicts. The judgment layer is already the product: Reddit pain validation, competition check, emotional-barrier anchoring, niche specificity enforcement (the #17 fix). The briefing format already leads with reasoning/risk and buries the build idea in a collapsible `<details>` block. This reframing is valid but I'm already doing it — I can't let you talk me into removing sources. The free digest showing only top 3 clusters + competition verdicts is the right "less is more" move for the free tier.

**2. "trendspy is the right source" — the you confused trendspy with trendspy.io.**

**This is factually wrong.** The `trendspy` Python package ([PyPI](https://pypi.org/project/trendspy/)) is a Google Trends protobuf API client — it calls `trending_now()` on Google's internal API and returns rising _search queries_ with volume and growth percentages. It is not trendspy.io, which is an unrelated French Shopify/dropshipping analytics tool. My fetcher.py imports `from trendspy import Trends` and calls `trending_now(geo="US")`, getting 400+ rising Google search topics per call. It pulls from the same data Google Trends shows on its "Trending Now" page. The category filtering via `TOPIC_MAP` already scopes results to technology, finance, health, hobbies, and education — not e-commerce products. Your entire argument here is based on confusing two different products with similar names.

That said, the _underlying concern_ (is Google Trends the right primary signal for SaaS opportunities?) is worth sitting with. Google Trends surfaces mass-market search behavior, which skews toward consumer problems. The pipeline compensates with `is_buildable()` filtering + Reddit pain validation, but adding HN/PH as _supplementary_ signals (https://github.com/modryn-studio/trend-detector/issues/1) would strengthen SaaS-specific coverage. That's already on the roadmap.

**3. "Daily is the right cadence."**

**Fair challenge, but the data disagrees so far.** Looking at 4 consecutive days of output (signals_2026-03-01.json through signals_2026-03-04.json), each day surfaces meaningfully different clusters. The social isolation macro-trend appeared across 3 days but with different member keywords and evolving scores — trend_memory.py tracks this with `days_seen` and `trajectory`. A 3x/week cadence would miss the trajectory signal that separates a 1-day spike from a sustained trend. The pipeline's quality floor is already enforced: the RED gate + score gate skip LLM calls for weak signals, and `is_buildable()` eliminates noise before scoring. If quality dips, the answer is tighter filtering, not fewer runs. Daily is correct for the _pipeline_. Whether the _paid email_ is daily vs. 3x/week is a packaging question you can A/B test later without changing any code.

**4. "$19/month is appropriate."**

**You are probably right that $19 underprices it, but for the wrong reason.** You frame $39–49 as justified by the value of one good idea. True, but irrelevant at launch — I have zero social proof. $19 is the right _launch_ price because it reduces friction for early adopters who haven't seen a single briefing yet. Once you have 20+ paying subscribers and testimonials showing "this briefing led me to build X, which made $Y," you raise to $39. The free→paid gap argument also holds: $19/month vs. free Monday digest is a ~$0.63/day upgrade for 6 extra briefings/week. That's thin. At $39, each additional briefing day is worth ~$1.30, which feels more like you're paying for real research rather than an RSS feed. Consider: launch at $19, grandfather early subscribers, raise to $39 at 50 subs.

**5. "The product is about finding what to build" vs. "it's about permission."**

**This is the sharpest insight in the five.** Look at what the pipeline actually does: it doesn't just find trends — it validates pain (Reddit), checks competition (Brave), tracks persistence (trend_memory), and makes a verdict with explicit confidence and risk assessment. The `context_seed` with `emotional_barrier` is literally giving the user language for _why_ this matters emotionally. The BUILD decision structure (reasoning → risk → confidence → then the idea in a collapsible block) already mirrors "here's why this is real" more than "here's what to build." The landing page copy should lead with the permission/confidence frame: _"You already know what's trending. We tell you whether it's worth building — and why."_ This doesn't require any pipeline changes; it's pure positioning. But it's the right positioning.

Response to the Reframe:
The corrections are clean and the reasoning is solid. Here's what this changes in the plan:

**Nothing in the pipeline** — that's already built and right.

**The landing page positioning** — this is the meaningful update. The copy frame is no longer "find what to build." It's:

> _"You already know what's trending. We tell you whether it's worth building — and why."_

This reframes the hero, the subhead, and the CTA logic. The updated copy targets:

- **Hero:** "Stop guessing. Start building the right thing." or directly from your line above.
- **Subhead:** Lead with the _process_ — pain validated, competition checked, decision made — not the output. The user needs to understand the rigor before they trust the verdict.
- **Social proof line:** "Built on the same system that decides what Modryn Studio builds." — this is perfect for the permission frame. It's _credibility by proxy_.
- **CTA:** "Get the Monday signal — free." stays. It's low-risk permission to see the verdict format once before paying.

**Updated plan, with positioning locked:**

## Plan: What to Build — Landing Page

**TL;DR:** Build the landing page with the "permission/confidence" frame as the core positioning. Real briefing screenshot is the proof artifact. Free email signup (Resend) and Stripe Payment Link CTA are the two conversion paths. No database, no auth, no fake social proof.
