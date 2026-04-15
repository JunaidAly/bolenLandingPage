import '@fontsource/sora/400.css';
import '@fontsource/sora/500.css';
import '@fontsource/sora/600.css';
import '@fontsource/sora/700.css';
import '@fontsource/sora/800.css';
import '../../styles/landing.css';

import { CircleCheck, Menu, Minus, Plus, X, Zap } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { supabase } from '../../lib/supabase';
import { notifyWaitlistOwner } from '../../lib/waitlist-owner-notify';

const WAITLIST_LOCAL_KEY = 'belon_waitlist_emails';

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setVisible(true);
      },
      { threshold, rootMargin: '0px 0px -10% 0px' },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function BelonLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden className="shrink-0">
        <path
          d="M20 2L35 11V29L20 38L5 29V11L20 2Z"
          stroke="#f97316"
          strokeWidth="2"
          className="fill-[#080808]"
        />
        <path d="M20 12L27 16.5V25.5L20 30L13 25.5V16.5L20 12Z" fill="#f97316" fillOpacity="0.9" />
      </svg>
      <span className="text-lg font-bold tracking-tight text-white sm:text-xl">Belon</span>
    </div>
  );
}

function HeroGraphic() {
  return (
    <div className="belon-hero-canvas opacity-80" aria-hidden>
      <svg viewBox="0 0 900 520" preserveAspectRatio="xMidYMid slice">
        <line x1="120" y1="260" x2="280" y2="200" className="belon-hero-line-sm" strokeWidth="1" fill="none" />
        <line x1="280" y1="200" x2="460" y2="280" className="belon-hero-line-sm" strokeWidth="1" fill="none" />
        <line x1="460" y1="280" x2="640" y2="220" className="belon-hero-line-sm" strokeWidth="1" fill="none" />
        <line x1="640" y1="220" x2="780" y2="260" className="belon-hero-line-sm" strokeWidth="1" fill="none" />
        <circle cx="120" cy="260" r="4" fill="#f97316" className="belon-hero-node-sm" style={{ animationDelay: '0s' }} />
        <circle cx="280" cy="200" r="4" fill="#ea580c" className="belon-hero-node-sm" style={{ animationDelay: '0.4s' }} />
        <circle cx="460" cy="280" r="4" fill="#f97316" className="belon-hero-node-sm" style={{ animationDelay: '0.8s' }} />
        <circle cx="640" cy="220" r="4" fill="#f97316" className="belon-hero-node-sm" style={{ animationDelay: '0.2s' }} />
        <circle cx="780" cy="260" r="4" fill="#ea580c" className="belon-hero-node-sm" style={{ animationDelay: '1s' }} />
        <circle cx="340" cy="380" r="4" fill="#f97316" className="belon-hero-node-sm" style={{ animationDelay: '0.6s' }} />
      </svg>
    </div>
  );
}

function HeroMockup() {
  return (
    <div className="relative mx-auto mt-10 max-w-5xl">
      <div
        className="pointer-events-none absolute -inset-8 rounded-[40px] opacity-70 blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(249,115,22,0.35) 0%, rgba(249,115,22,0.08) 45%, transparent 70%)',
        }}
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] shadow-[0_30px_120px_-60px_rgba(249,115,22,0.55)]">
        <div className="flex items-center gap-2 border-b border-white/10 bg-[#0f0f0f] px-4 py-3">
          <div className="flex gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <div className="min-w-0 flex-1 truncate rounded-full border border-white/10 bg-[#080808] px-3 py-1 text-center text-xs text-[#94a3b8]">
            belon.app/app/workflows
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Live
          </span>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-[320px] bg-[#080808] p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <div className="text-sm font-semibold text-white">Automation engine</div>
              <div className="text-xs text-[#94a3b8]">Signals running</div>
            </div>

            <div className="relative mx-auto max-w-[560px] rounded-2xl border border-white/10 bg-[#0f0f0f] p-6">
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              <div className="grid grid-cols-2 gap-5">
                {[
                  ['Trigger', 'CRM Scan'],
                  ['Condition', 'Stalled deal > 14 days'],
                  ['AI Action', 'Draft re-engagement email'],
                  ['CRM Action', 'Create task + update stage'],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl border border-white/10 bg-[#111111] p-4">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">{k}</div>
                    <div className="mt-1 text-sm font-semibold text-white">{v}</div>
                    <div className="mt-3 h-2 w-16 rounded-full bg-white/5" aria-hidden />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-[#0b0b0b] px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-medium text-white/90">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f97316]/15 text-[#f97316]">
                    <Zap className="h-4 w-4" strokeWidth={2.25} aria-hidden />
                  </span>
                  Next best action queued
                </div>
                <span className="text-xs text-emerald-200">Running</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 bg-[#0b0b0b] p-6 sm:p-8 lg:border-l lg:border-t-0">
            <div className="mb-4 text-sm font-semibold text-white">Live signals</div>
            <div className="space-y-3">
              {[
                ['TechFlow Inc deal stalled for 14 days', 'Critical'],
                ['3 high-value deals missing next steps', 'High'],
                ['Acme Corp showing buying signals', 'High'],
              ].map(([t, s]) => (
                <div key={t} className="rounded-2xl border border-white/10 bg-[#111111] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-semibold text-white/90">{t}</div>
                    <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-[#94a3b8]">
                      {s}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-[#94a3b8]">Autonomous action available</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full rounded-2xl border border-white/10 bg-[#111111] px-5 py-5 text-left transition-colors hover:bg-[#141414]"
      aria-expanded={open}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-base font-semibold text-white">{q}</span>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#0b0b0b] text-[#f97316]">
          {open ? (
            <Minus className="h-4 w-4" strokeWidth={2.25} aria-hidden />
          ) : (
            <Plus className="h-4 w-4" strokeWidth={2.25} aria-hidden />
          )}
        </span>
      </div>
      {open ? <div className="mt-3 text-sm leading-relaxed text-[#94a3b8]">{a}</div> : null}
    </button>
  );
}

function WaitlistModal({
  open,
  onClose,
  waitlistEmail,
  setWaitlistEmail,
  waitlistStatus,
  setWaitlistStatus,
  submitWaitlist,
}: {
  open: boolean;
  onClose: () => void;
  waitlistEmail: string;
  setWaitlistEmail: (v: string) => void;
  waitlistStatus: 'idle' | 'loading' | 'success' | 'error';
  setWaitlistStatus: (v: 'idle' | 'loading' | 'success' | 'error') => void;
  submitWaitlist: (e: React.FormEvent) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-10">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] shadow-[0_30px_120px_-60px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="text-base font-semibold text-white">Join Waitlist</div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={2} aria-hidden />
          </button>
        </div>
        <div className="px-6 py-6">
          {waitlistStatus === 'success' ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.08] px-6 py-10 text-emerald-200">
              <CircleCheck className="belon-success-icon h-14 w-14 text-emerald-400" strokeWidth={1.5} aria-hidden />
              <p className="text-lg font-medium text-emerald-100">You&apos;re on the list! We&apos;ll be in touch.</p>
              <button
                type="button"
                onClick={() => {
                  setWaitlistStatus('idle');
                  onClose();
                }}
                className="mt-1 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white/90"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm leading-relaxed text-[#94a3b8]">
                Join the waitlist and get early access when Belon launches
              </p>
              <form
                onSubmit={submitWaitlist}
                className="mx-auto flex max-w-xl flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 sm:flex-row sm:items-stretch"
              >
                <label htmlFor="waitlist-email" className="sr-only">
                  Work email
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={waitlistEmail}
                  onChange={(e) => {
                    setWaitlistEmail(e.target.value);
                    if (waitlistStatus === 'error') setWaitlistStatus('idle');
                  }}
                  className="h-[52px] min-w-0 flex-1 rounded-xl border border-white/10 bg-[#080808] px-4 text-white placeholder:text-[#64748b] outline-none transition-shadow focus:border-[#f97316]/60 focus:ring-2 focus:ring-[#f97316]/20"
                />
                <button
                  type="submit"
                  disabled={waitlistStatus === 'loading'}
                  className="h-[52px] shrink-0 rounded-xl bg-[#f97316] px-8 font-semibold text-white shadow-[0_0_20px_rgba(249,115,22,0.35)] transition hover:bg-[#ea580c] disabled:opacity-60"
                >
                  {waitlistStatus === 'loading' ? 'Joining…' : 'Join Waitlist'}
                </button>
              </form>
              {waitlistStatus === 'error' ? <p className="mt-4 text-sm text-red-400">Enter a valid email, or try again.</p> : null}
              <p className="mt-6 text-sm text-[#64748b]">No spam. No credit card. Cancel anytime.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function Landing() {
  const [navOpen, setNavOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [waitlistCount, setWaitlistCount] = useState(247);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  useEffect(() => {
    if (!navOpen && !waitlistOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNavOpen(false);
        setWaitlistOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen, waitlistOpen]);

  const refreshCount = useCallback(async () => {
    if (supabase) {
      const { count, error } = await supabase.from('waitlist').select('*', { count: 'exact', head: true });
      if (!error && typeof count === 'number') setWaitlistCount(Math.max(247, count));
    } else {
      try {
        const raw = localStorage.getItem(WAITLIST_LOCAL_KEY);
        const list: string[] = raw ? JSON.parse(raw) : [];
        setWaitlistCount(247 + list.length);
      } catch {
        setWaitlistCount(247);
      }
    }
  }, []);

  useEffect(() => {
    void refreshCount();
  }, [refreshCount]);

  const submitWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = waitlistEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setWaitlistStatus('error');
      return;
    }
    setWaitlistStatus('loading');
    try {
      let isNewSignup = false;

      if (supabase) {
        const { error } = await supabase.from('waitlist').insert({ email });
        if (error && error.code !== '23505') throw error;
        isNewSignup = !error;
      } else {
        const raw = localStorage.getItem(WAITLIST_LOCAL_KEY);
        const list: string[] = raw ? JSON.parse(raw) : [];
        isNewSignup = !list.includes(email);
        if (isNewSignup) list.push(email);
        localStorage.setItem(WAITLIST_LOCAL_KEY, JSON.stringify(list));
      }

      if (isNewSignup) void notifyWaitlistOwner(email);

      setWaitlistStatus('success');
      setWaitlistEmail('');
      await refreshCount();
    } catch {
      setWaitlistStatus('error');
    }
  };

  const navLinks = (
    <>
      <a href="#how-it-works" className="belon-nav-link text-sm font-medium" onClick={() => setNavOpen(false)}>
        How it Works
      </a>
      <a href="#value" className="belon-nav-link text-sm font-medium" onClick={() => setNavOpen(false)}>
        Product
      </a>
      <a href="#testimonials" className="belon-nav-link text-sm font-medium" onClick={() => setNavOpen(false)}>
        Automations
      </a>
      <a href="#faq" className="belon-nav-link text-sm font-medium" onClick={() => setNavOpen(false)}>
        Accuracy
      </a>
    </>
  );

  useInView<HTMLElement>(0.2); // keep IntersectionObserver warm for later sections

  return (
    <div className="belon-landing text-[15px] leading-relaxed sm:text-base">
      <div className="belon-atmosphere" aria-hidden>
        <div className="belon-glow belon-glow--blue" />
        <div className="belon-glow belon-glow--violet" />
        <div className="belon-dot-grid" />
      </div>

      <div className="belon-landing-inner">
        {/* 1) Navigation */}
        <header className="sticky top-0 z-50 h-16 border-b border-white/[0.06] bg-[rgba(8,8,8,0.78)] backdrop-blur-[18px]">
          <div className="belon-container flex h-full items-center justify-between gap-4">
            <Link to="/" className="touch-manipulation active:opacity-90">
              <BelonLogo />
            </Link>
            <nav className="hidden flex-1 items-center justify-center gap-8 md:flex" aria-label="Primary">
              {navLinks}
            </nav>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWaitlistOpen(true)}
                className="belon-btn belon-cta-primary hidden rounded-full px-5 py-2.5 text-sm font-semibold text-white sm:inline-flex"
              >
                Join Waitlist
              </button>
              <button
                type="button"
                className="belon-btn flex h-10 w-10 items-center justify-center rounded-xl text-white/90 md:hidden"
                aria-expanded={navOpen}
                aria-controls="belon-mobile-nav"
                aria-label={navOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setNavOpen((o) => !o)}
              >
                {navOpen ? <X className="h-5 w-5" strokeWidth={2} /> : <Menu className="h-5 w-5" strokeWidth={2} />}
              </button>
            </div>
          </div>
          <div
            id="belon-mobile-nav"
            className={`border-t border-white/[0.06] bg-[rgba(8,8,8,0.96)] backdrop-blur-xl md:hidden ${navOpen ? 'block' : 'hidden'}`}
          >
            <nav className="belon-container flex flex-col gap-1 py-4" aria-label="Mobile">
              <div className="flex flex-col gap-4 px-1 py-2">{navLinks}</div>
              <button
                type="button"
                className="belon-btn belon-cta-primary mx-1 mt-2 inline-flex items-center justify-center rounded-full py-3 text-center text-sm font-semibold text-white"
                onClick={() => {
                  setNavOpen(false);
                  setWaitlistOpen(true);
                }}
              >
                Join Waitlist
              </button>
            </nav>
          </div>
        </header>

        {/* 2) Hero */}
        <section className="relative overflow-hidden pt-8">
          <HeroGraphic />
          <div className="belon-container relative z-[1] pb-14 pt-12 text-center lg:pb-20 lg:pt-20">
            <div className="belon-hero-badge mx-auto mb-7 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium text-white/90 sm:text-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              99% Accuracy · 100% Autonomous · 50+ Simultaneous Actions
            </div>
            <h1 className="mx-auto mb-6 max-w-4xl text-balance text-[42px] font-extrabold leading-[1.06] tracking-[-0.03em] text-white lg:text-[72px] lg:leading-[1.03]">
              <span className="block">Your Sales Pipeline.</span>
              <span className="block">Fully</span>
              <span className="block">
                <span className="belon-text-gradient belon-gradient-word">Decrypted</span>.
              </span>
            </h1>
            <p className="belon-body mx-auto mb-10 max-w-2xl text-pretty text-lg sm:text-xl">
              Belon runs 50+ autonomous automations simultaneously, uncovering 100+ hidden insights from your CRM pipeline — with zero human input.
            </p>
            <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <button
                type="button"
                onClick={() => setWaitlistOpen(true)}
                className="belon-btn belon-cta-primary inline-flex min-h-[52px] w-full min-w-[200px] items-center justify-center rounded-full px-8 text-base font-semibold text-white sm:w-auto"
              >
                Join the Waitlist
              </button>
              <a
                href="#how-it-works"
                className="belon-btn inline-flex min-h-[52px] w-full min-w-[200px] items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-8 text-base font-semibold text-white sm:w-auto"
              >
                See How It Works
              </a>
            </div>
            <HeroMockup />
          </div>
        </section>

        {/* 3) Trusted by / Integrations bar */}
        <section className="border-y border-white/10 bg-[#0f0f0f] py-8">
          <div className="belon-container">
            <div className="flex flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
              <div className="text-sm font-medium text-[#94a3b8]">Integrates with leading CRMs and sales tools</div>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-white/80">
                {['HubSpot', 'Salesforce', 'Slack', 'Gmail', 'Zoom', 'LinkedIn'].map((n) => (
                  <span key={n} className="opacity-80">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4) Value proposition — 3 columns */}
        <section className="belon-section bg-[#080808]" id="value">
          <div className="belon-container">
            <h2 className="mb-4 text-center text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight tracking-tight text-white lg:text-[48px]">
              Unlock Sales Performance
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {[
                { icon: '⚡', title: 'Decrypt Pipeline Faster', desc: 'Uncover 100+ hidden signals automatically' },
                { icon: '💰', title: 'Reduce Revenue Leakage', desc: 'Stop losing deals to missed follow-ups' },
                { icon: '📈', title: 'Increase Close Rates', desc: 'AI-powered next best actions on every deal' },
              ].map((c) => (
                <div key={c.title} className="belon-card p-8">
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg">
                    {c.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">{c.title}</h3>
                  <p className="text-sm leading-relaxed text-[#94a3b8]">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5) Big statement */}
        <section className="belon-section bg-[#0f0f0f]">
          <div className="belon-container">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
              <div className="text-center text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold tracking-tight text-white lg:text-left">
                AI Automates 100+ Pipeline Signals
              </div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#080808] text-[#f97316]">
                <Zap className="h-6 w-6" strokeWidth={2.25} aria-hidden />
              </div>
              <div className="text-center text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold tracking-tight text-white lg:text-right">
                Teams Focus on Closing Deals
              </div>
            </div>
          </div>
        </section>

        {/* 6) How it works — 3 steps */}
        <section className="belon-section bg-[#080808]" id="how-it-works">
          <div className="belon-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <h2 className="mb-4 text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight text-white lg:text-[48px]">
                Getting Started with Belon is Easy
              </h2>
              <button
                type="button"
                onClick={() => setWaitlistOpen(true)}
                className="belon-btn belon-cta-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white"
              >
                Join Waitlist
              </button>
            </div>
            <div className="space-y-4">
              {[
                { n: 1, title: 'Connect Your CRM', desc: 'plug in HubSpot or Salesforce in 2 minutes' },
                { n: 2, title: 'Belon Decrypts Your Pipeline', desc: '100+ signals analyzed automatically' },
                { n: 3, title: 'Automations Execute', desc: 'next best actions run without human input' },
              ].map((s) => (
                <div key={s.title} className="belon-card flex flex-col gap-5 p-6 sm:flex-row sm:items-start">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f97316]/15 text-lg font-extrabold text-[#f97316]">
                    {s.n}
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg font-bold text-white">{s.title}</div>
                    <div className="mt-1 text-sm text-[#94a3b8]">{s.desc}</div>
                    <div className="mt-4 h-24 w-full rounded-2xl border border-white/10 bg-[#0b0b0b]" aria-hidden />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7) Testimonials */}
        <section className="belon-section bg-[#0f0f0f]" id="testimonials">
          <div className="belon-container">
            <h2 className="mb-4 text-center text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight text-white lg:text-[48px]">
              What Sales Leaders Are Saying
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {[
                {
                  quote: 'Belon found 3 stalled deals we had no idea about. Recovered $45K in pipeline in the first week.',
                  who: 'James R., VP of Sales, TechFlow Inc',
                },
                {
                  quote: 'The automation runs 24/7. Our reps stopped doing manual CRM updates completely.',
                  who: 'Sarah M., Sales Director, CloudNine',
                },
                {
                  quote: '99% accuracy is no joke. Every insight Belon surfaces has been spot on.',
                  who: 'David K., Head of Revenue, DataBridge',
                },
              ].map((t) => (
                <div key={t.who} className="belon-card p-8">
                  <p className="text-base leading-relaxed text-white/90">“{t.quote}”</p>
                  <div className="mt-6 border-t border-white/10 pt-5 text-sm text-[#94a3b8]">{t.who}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8) FAQ */}
        <section className="belon-section bg-[#080808]" id="faq">
          <div className="belon-container">
            <h2 className="mb-4 text-center text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight text-white lg:text-[48px]">
              Everything You Need to Know
            </h2>
            <div className="mx-auto grid max-w-3xl gap-4">
              {[
                { q: 'How long does it take to set up?', a: 'Most teams connect and start seeing signals the same day.' },
                { q: 'Can I customize the automation workflows?', a: 'Yes—Belon supports configurable automation logic per team.' },
                { q: 'What CRMs does Belon integrate with?', a: 'HubSpot and Salesforce today, with more integrations coming.' },
                { q: 'Is there a free trial available?', a: 'Yes—you can start with a trial and evaluate before committing.' },
                { q: 'How does Belon achieve 99% accuracy?', a: 'Belon cross-checks multiple sources to verify each insight.' },
                { q: 'What happens after the 5-day free trial?', a: 'You can choose a plan or keep exploring with your team.' },
              ].map((f, i) => (
                <FaqItem
                  key={f.q}
                  q={f.q}
                  a={f.a}
                  open={faqOpen === i}
                  onToggle={() => setFaqOpen((v) => (v === i ? null : i))}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 9) Final CTA */}
        <section className="belon-section relative overflow-hidden bg-[#0f0f0f]">
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background:
                'radial-gradient(ellipse 90% 65% at 50% 35%, rgba(249,115,22,0.22) 0%, rgba(234,88,12,0.08) 40%, transparent 70%)',
            }}
            aria-hidden
          />
          <div className="belon-container relative z-[1] text-center">
            <h2 className="mx-auto mb-4 max-w-3xl text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight text-white lg:text-[52px]">
              Ready to Decrypt Your Pipeline?
            </h2>
            <div className="mx-auto mb-10 max-w-2xl text-lg text-[#94a3b8]">
              Join <span className="font-semibold text-white">{waitlistCount}</span> sales leaders already on the waitlist
            </div>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                className="belon-btn belon-cta-primary inline-flex min-h-[52px] w-full min-w-[200px] items-center justify-center rounded-full px-8 text-base font-semibold text-white sm:w-auto"
                onClick={() => setWaitlistOpen(true)}
              >
                Start Free Trial
              </button>
              <button
                type="button"
                className="belon-btn inline-flex min-h-[52px] w-full min-w-[200px] items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-8 text-base font-semibold text-white sm:w-auto"
              >
                Request a Demo
              </button>
            </div>
          </div>
        </section>

        {/* 10) Footer */}
        <footer className="border-t border-white/[0.08] bg-[#080808] px-4 py-12 sm:px-6 lg:px-8">
          <div className="belon-container grid gap-10 text-sm text-[#94a3b8] md:grid-cols-3 md:items-center">
            <div className="flex flex-col items-center gap-2 md:items-start">
              <BelonLogo className="justify-center md:justify-start" />
              <p className="belon-body mt-1 max-w-xs text-center md:text-left">Your pipeline. Fully decrypted.</p>
            </div>
            <div className="text-center">
              <a className="text-[#94a3b8] transition-colors hover:text-white" href="mailto:hello@belon.com">
                hello@belon.com
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 md:justify-end">
              <a href="#" className="transition-colors hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Contact
              </a>
            </div>
          </div>
          <div className="belon-container mt-10 border-t border-white/10 pt-6 text-center text-xs text-[#64748b]">
            © 2026 Belon. All rights reserved.
          </div>
        </footer>

        <WaitlistModal
          open={waitlistOpen}
          onClose={() => setWaitlistOpen(false)}
          waitlistEmail={waitlistEmail}
          setWaitlistEmail={setWaitlistEmail}
          waitlistStatus={waitlistStatus}
          setWaitlistStatus={setWaitlistStatus}
          submitWaitlist={submitWaitlist}
        />
      </div>
    </div>
  );
}

