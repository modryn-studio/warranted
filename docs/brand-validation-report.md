## Brand Validation: brand.md Analysis

**TL;DR:** The core decisions in brand.md are correct for this audience. Three specific risks are worth correcting before you write a single line of copy.

---

### What the research shows about this audience

TLDR (1.6M subscribers) wins on format: "5 minutes" is the entire promise. No personality, no opinion — pure utility framing.

Cursor wins on product authority: testimonials from Jensen Huang and Patrick Collison work because the brand can back it up. At launch with zero social proof, authority has to come from _transparency about process_, not from borrowed credibility.

Vercel wins on minimalism: dark background, code shown directly on the page, no feature bloat in the hero. Developer audiences distrust what they can't verify.

The what-to-build audience is none of these targets — they're harder. Solo dev, 6am, already burned by hype. The IH post "I analyzed 500 Product Hunt SaaS launches. 487 are dead" (510 upvotes) is the worldview you're writing into. They are _looking for a reason to disbelieve you_. Everything that looks like marketing copy is evidence against you.

---

### Element-by-element verdict

**Voice: "short, direct, opinionated, founder-to-founder"** ✅ Correct

The anti-hype language rules in brand.md are exactly right. One nuance: "We" language can feel like it's hiding a person behind a brand. Stronger move is process language. _"The pipeline runs every morning at 6am"_ > _"We run this daily."_ Machine framing earns more trust with this audience because it implies systematic, repeatable, verifiable — not someone's subjective opinion.

**Dark mode, no toggle** ✅ Correct

Vercel, PostHog, Railway — all dark-first. Developer/builder tools have normalized it. The right default for this audience.

**Amber `#F97415`** ✅ Correct _with one rule_

Amber is distinctive without being garish. It maps intuitively to "signal" — the same reason terminals use amber/yellow for warnings. It differentiates from the blue-dominated dev tool space (Linear, GitHub, Vercel). One risk: Bitcoin/Solana orange is adjacent. The rule that prevents this: **amber must appear as a signal color, never as a background fill.** It belongs on verdicts (`BUILD` label), CTAs (the subscribe button), and key numbers. Not as decoration.

**Monospace for scores/verdicts** ✅ Strongly correct

This is the right call. When this audience sees monospace, they read it as terminal output — data from a system, not marketing copy. A `BUILD | confidence 0.84 | days_seen: 4` block in monospace reads as _evidence_. The same text in a serif font reads as _marketing_.

**No motion, no gradients, no glassmorphism** ✅ Strongly correct

Cursor uses animated demos and gradient backgrounds. It works for them because they're a $300M company — the design signals investment. For day-1 indie tool, over-design signals "trying to look like more than you are." This audience has a pattern-recognition filter for it. Static + fast = respects my time = trustworthy. This is the PostHog model, not the Cursor model.

**Emotional arc (Land → Read → Scroll → Convert free → Convert paid)** ✅ Correct _with one missing beat_

The arc is right in sequence. What brand.md doesn't make explicit: **the real sample verdict must appear above the fold, not below it.** The product IS the verdict format. If the first thing a visitor sees is copy _about_ the product instead of the product itself, you've lost your best trust-builder. TLDR's landing page doesn't describe what a TLDR newsletter looks like — it shows you. Same principle applies here.

**"Permission/confidence" frame** ✅ The sharpest insight in the entire document

_"You already know what's trending. We tell you whether it's worth building — and why."_ This is the correct positioning. The unique value is not trend discovery — it's the BUILD/WATCH/SKIP verdict with sourced reasoning. The hero copy should invoke the anxiety ("how many hours did you spend last week on Reddit deciding whether X was saturated?"), then immediately resolve it with a real verdict block.

---

### Three things to fix before writing copy

**1. Add a "show the product first" rule**

brand.md describes visual components but doesn't establish the hierarchy. Add explicitly: _the hero section must contain a real verdict block — actual output, not a description of output._ This is what earns the free signup. It's also why you need the screenshot ready before building the page.

**2. Tighten the "We" language convention**

Replace brand voice examples that use "we" with process language where possible:

- "We run this daily" → "Runs every morning at 6am"
- "We check Reddit" → "Pain validated across 12 Reddit threads"
- "We score buildability" → "Scored across pain, competition, and time-to-ship"

Machine framing reinforces the pipeline story. It also removes the implicit question: _"who is we and why should I trust them?"_

**3. Define amber as a semantic signal color, not a general accent**

Add to visual rules: amber `#F97415` is reserved for (a) BUILD verdict labels, (b) primary CTA buttons, (c) key data points (price, subscriber count, days_seen). It should never appear as a decorative element. This prevents the palette from tipping into Bitcoin-adjacent territory and keeps amber reading as _"this matters, pay attention"_ throughout the page.
