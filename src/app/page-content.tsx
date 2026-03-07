'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { analytics } from '@/lib/analytics';
import { basePath } from '@/config/site';
import { FeedbackTrigger } from '@/components/feedback-trigger';

export default function PageContent({ briefingSample }: { briefingSample: React.ReactNode }) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const stripeLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || '#';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;

    setSubmitting(true);
    setError('');
    analytics.freeSignupSubmit();

    try {
      const res = await fetch(`${basePath}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Something broke. Try again.');
        return;
      }

      setDone(true);
      analytics.freeSignupSuccess();
    } catch {
      setError('Something broke. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <main className="mx-auto max-w-3xl px-6">
        {/* ── Hero ── */}
        <section className="pt-20 pb-16 md:pt-32 md:pb-24">
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Stop guessing.
            <br />
            Start building the right thing.
          </h1>
          <p className="text-muted mt-6 max-w-xl font-mono text-sm leading-relaxed md:text-base">
            Every morning at 6am: trending signals scored, Reddit pain validated, competition
            checked, BUILD or SKIP decision made. You just execute.
          </p>

          {/* Real pipeline output — above the fold */}
          <div className="border-border bg-surface mt-10 border p-6">
            <p className="text-muted mb-4 font-mono text-xs tracking-widest uppercase">
              Sample verdict — real pipeline output
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-accent font-mono text-sm font-bold">BUILD</span>
              <span className="text-muted font-mono text-xs">confidence: 82%</span>
            </div>
            <h2 className="mt-3 text-lg font-semibold tracking-tight">
              AI-powered habit tracker for neurodivergent adults
            </h2>
            <p className="text-muted mt-2 font-mono text-xs leading-relaxed">
              Pain validated across 14 Reddit threads in r/ADHD and r/productivity. Existing tools
              assume neurotypical consistency — gap is real. Competition: 3 apps, none targeting
              this niche. Risk: retention requires adaptive scheduling, non-trivial to build well.
            </p>
            <div className="text-muted mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs">
              <span>days_seen: 4</span>
              <span>trajectory: rising</span>
              <span>sources: Google Trends, Reddit</span>
            </div>
          </div>
        </section>

        {/* ── Sample Briefing ── */}
        <section className="border-border border-t py-16 md:py-20">
          <p className="text-muted mb-6 font-mono text-xs tracking-widest uppercase">
            What lands in your inbox — daily (real output, 2026-03-05)
          </p>

          {briefingSample}
        </section>

        {/* ── How It Works ── */}
        <section className="border-border border-t py-16 md:py-20">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            The system, not the vibes.
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {[
              {
                label: 'Trend detection',
                desc: 'Pulls rising signals from Google Trends every morning via trendspy.',
              },
              {
                label: 'Buildability filter',
                desc: 'Filters through TOPIC_MAP and is_buildable() — ~90% elimination rate.',
              },
              {
                label: 'Pain validation',
                desc: 'Checks Reddit for real users complaining about real problems.',
              },
              {
                label: 'Competition check',
                desc: 'Scans existing solutions via Brave Search. Spots gaps, not crowded markets.',
              },
              {
                label: 'Verdict engine',
                desc: 'Claude LLM scores confidence, risk, and product thesis. BUILD, WATCH, or SKIP.',
              },
              {
                label: 'Trend memory',
                desc: 'Tracks days_seen and trajectory across runs. Distinguishes spikes from sustained trends.',
              },
            ].map((step) => (
              <div key={step.label} className="border-border bg-surface border p-5">
                <p className="text-accent font-mono text-xs font-bold tracking-widest uppercase">
                  {step.label}
                </p>
                <p className="text-muted mt-2 font-mono text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Free Signup ── */}
        <section id="signup" className="border-border border-t py-16 md:py-20">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Get the Monday signal — free.
            </h2>
            <p className="text-muted mt-4 font-mono text-sm">
              Top 3 clusters + competition verdicts every Monday morning. No spam, no fluff.
            </p>

            {!done ? (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <label htmlFor="signup-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={submitting}
                  className="border-border placeholder:text-muted focus-visible:ring-accent h-12 flex-1 rounded-none border-2 bg-transparent px-4 font-mono text-sm focus-visible:ring-1 focus-visible:outline-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-accent h-12 rounded-none px-8 font-mono text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'Get the free digest'}
                </button>
              </form>
            ) : (
              <div className="border-accent/30 bg-accent/5 text-accent mt-8 border p-4 font-mono text-sm">
                You&apos;re in. First digest hits your inbox Monday at 6am.
              </div>
            )}

            {error && <p className="mt-4 font-mono text-sm text-red-500">{error}</p>}
          </div>
        </section>

        {/* ── Paid CTA ── */}
        <section className="border-border border-t py-16 md:py-20">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Get the daily brief — $19/mo
            </h2>
            <p className="text-muted mt-4 font-mono text-sm">
              Full verdicts. Reddit pain excerpts. Risk assessments. Every morning before your first
              coffee.
            </p>
            <a
              href={stripeLink}
              onClick={() => analytics.paidCtaClick()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent mt-8 inline-block h-12 px-10 font-mono text-sm leading-12 font-bold text-white hover:opacity-90"
            >
              Subscribe — $19/mo
            </a>
            <p className="text-muted mt-3 font-mono text-xs">
              Cancel anytime. No account required.
            </p>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-border border-t px-6 py-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <p className="text-muted font-mono text-xs">
            Built by Luke. Fueled by trendspy, Reddit, and too much coffee.
          </p>
          <div className="text-muted flex gap-6 font-mono text-xs">
            <Link href="/tools/warranted/privacy" className="hover:text-text">
              Privacy
            </Link>
            <Link href="/tools/warranted/terms" className="hover:text-text">
              Terms
            </Link>
            <a
              href="https://x.com/lukehanner"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text"
            >
              @lukehanner
            </a>
            <FeedbackTrigger />
          </div>
          <p className="text-muted font-mono text-xs">
            Built on the same system that decides what Modryn Studio builds.
          </p>
        </div>
      </footer>
    </>
  );
}
