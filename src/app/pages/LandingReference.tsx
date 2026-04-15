import '@fontsource/sora/400.css';
import '@fontsource/sora/500.css';
import '@fontsource/sora/600.css';
import '@fontsource/sora/700.css';
import '@fontsource/sora/800.css';
import '../../styles/landing.css';

import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  Calendar,
  Check,
  CircleCheck,
  Clock,
  DollarSign,
  Flag,
  Ghost,
  Lightbulb,
  Link2,
  Mail,
  Menu,
  MessageCircle,
  Minus,
  Plus,
  Puzzle,
  RefreshCw,
  Rocket,
  Search,
  Target,
  Trophy,
  User,
  X,
  Zap,
} from 'lucide-react';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { supabase } from '../../lib/supabase';
import { notifyWaitlistOwner } from '../../lib/waitlist-owner-notify';

const WAITLIST_LOCAL_KEY = 'belon_waitlist_emails';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Accuracy', href: '#accuracy' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
] as const;

const STATS = [
  { value: '50+', label: 'Simultaneous Automations' },
  { value: '100+', label: 'Pipeline Signals Decrypted' },
  { value: '99%', label: 'Accuracy Rate' },
  { value: '0', label: 'Human Inputs Required' },
] as const;

const SIGNALS: { Icon: LucideIcon; title: string; desc: string }[] = [
  { Icon: Search, title: 'Deal Velocity Decay', desc: 'Detects when deals are slowing down before your reps notice' },
  { Icon: MessageCircle, title: 'Engagement Sentiment Shift', desc: "Identifies when a buyer's tone is turning cold" },
  { Icon: AlertTriangle, title: 'Stage Anomaly Detection', desc: 'Flags deals stuck longer than your pipeline average' },
  { Icon: Ghost, title: 'Ghost Deal Detection', desc: 'Surfaces deals with zero activity automatically' },
  { Icon: Target, title: 'Win Probability Score', desc: 'AI-predicted close likelihood per deal, updated in real time' },
  { Icon: Trophy, title: 'Competitor Mention Detection', desc: 'Catches competitor references in emails and notes' },
  { Icon: DollarSign, title: 'Budget Signal Detection', desc: 'Identifies when buyers reveal budget intent' },
  { Icon: User, title: 'Decision Maker Gap', desc: 'Flags deals missing key stakeholder contact' },
  { Icon: Link2, title: 'Multi-Threading Score', desc: "Measures how many stakeholders you're engaging per deal" },
  { Icon: Flag, title: 'Forecast Risk Flag', desc: 'Predicts deals likely to slip this quarter' },
  { Icon: Clock, title: 'Response Time Decay', desc: 'Detects when slow rep replies are hurting deals' },
  { Icon: Rocket, title: 'Deal Momentum Score', desc: 'Tracks whether each deal is accelerating or decelerating' },
  { Icon: RefreshCw, title: 'Pipeline Velocity Score', desc: 'Measures overall pipeline speed vs your benchmark' },
  { Icon: Mail, title: 'Email Engagement Drop', desc: 'Detects declining open and reply rates per deal' },
  { Icon: Calendar, title: 'Meeting Frequency Decay', desc: 'Flags when meeting cadence is declining' },
  { Icon: Lightbulb, title: 'Buyer Intent Signal', desc: 'Identifies strong purchase intent signals in communications' },
  { Icon: Zap, title: 'Urgency Signal Detection', desc: 'Detects urgency language in buyer communications' },
  { Icon: Puzzle, title: 'Deal Complexity Score', desc: 'Measures deal risk based on stakeholder complexity' },
];

const ACCURACY_PILLARS = [
  { title: 'Multi-Signal Scoring', desc: '15+ data points combined per insight' },
  { title: 'Historical Pattern Matching', desc: 'learns from your past won and lost deals' },
  { title: 'Confidence Intervals', desc: 'every prediction shows a certainty score' },
  { title: 'Real-Time Data Sync', desc: 'syncs every 15 minutes, never stale' },
  { title: 'Cross-Validation', desc: 'CRM vs email vs calendar vs Slack' },
  { title: 'Rep Behavior Modeling', desc: 'calibrates individually per rep' },
  { title: 'Industry Benchmarking', desc: 'compares against your sector standards' },
  { title: 'Anomaly Baseline Calibration', desc: 'sets normal benchmarks per deal type' },
  { title: 'Continuous Feedback Loop', desc: 'gets smarter with every outcome' },
  { title: 'Ensemble AI Models', desc: 'multiple models vote on every prediction' },
] as const;

const INTEGRATIONS = [
  'HubSpot',
  'Salesforce',
  'Microsoft Dynamics',
  'Gmail',
  'Slack',
  'Zoom',
  'LinkedIn Sales Navigator',
  'Outlook',
  'Google Calendar',
  'Pipedrive',
] as const;

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
          stroke="#3b82f6"
          strokeWidth="2"
          className="fill-[#05050a]"
        />
        <path d="M20 12L27 16.5V25.5L20 30L13 25.5V16.5L20 12Z" fill="#3b82f6" fillOpacity="0.9" />
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
        <circle cx="120" cy="260" r="4" fill="#3b82f6" className="belon-hero-node-sm" style={{ animationDelay: '0s' }} />
        <circle cx="280" cy="200" r="4" fill="#7c3aed" className="belon-hero-node-sm" style={{ animationDelay: '0.4s' }} />
        <circle cx="460" cy="280" r="4" fill="#3b82f6" className="belon-hero-node-sm" style={{ animationDelay: '0.8s' }} />
        <circle cx="640" cy="220" r="4" fill="#3b82f6" className="belon-hero-node-sm" style={{ animationDelay: '0.2s' }} />
        <circle cx="780" cy="260" r="4" fill="#7c3aed" className="belon-hero-node-sm" style={{ animationDelay: '1s' }} />
        <circle cx="340" cy="380" r="4" fill="#3b82f6" className="belon-hero-node-sm" style={{ animationDelay: '0.6s' }} />
      </svg>
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
      className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-5 text-left transition-colors hover:bg-white/[0.03]"
      aria-expanded={open}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-base font-semibold text-white">{q}</span>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#0b0b12] text-[#7c3aed]">
          {open ? <Minus className="h-4 w-4" strokeWidth={2.25} aria-hidden /> : <Plus className="h-4 w-4" strokeWidth={2.25} aria-hidden />}
        </span>
      </div>
      {open ? <div className="mt-3 text-sm leading-relaxed text-[#94a3b8]">{a}</div> : null}
    </button>
  );
}

export function Landing() {
  const [navOpen, setNavOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen]);

  const refreshCount = useCallback(async () => {
    if (!supabase) return;
    await supabase.from('waitlist').select('*', { count: 'exact', head: true });
  }, []);

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
      {NAV_LINKS.map((l) => (
        <a key={l.href} href={l.href} className="belon-nav-link text-sm font-medium" onClick={() => setNavOpen(false)}>
          {l.label}
        </a>
      ))}
    </>
  );

  const gaugeRef = useInView<HTMLDivElement>(0.35);

  return (
    <div className="belon-landing text-[15px] leading-relaxed sm:text-base">
      <div className="belon-atmosphere" aria-hidden>
        <div className="belon-glow belon-glow--blue" />
        <div className="belon-glow belon-glow--violet" />
        <div className="belon-dot-grid" />
      </div>

      <div className="belon-landing-inner">
        {/* NAVBAR */}
        <header className="sticky top-0 z-50 h-16 border-b border-white/[0.06] bg-[rgba(5,5,10,0.8)] backdrop-blur-[20px]">
          <div className="belon-container flex h-full items-center justify-between gap-4">
            <Link to="/" className="touch-manipulation active:opacity-90">
              <BelonLogo />
            </Link>
            <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
              {navLinks}
            </nav>
            <div className="flex items-center gap-2">
              <a href="#waitlist" className="belon-btn belon-cta-primary hidden rounded-lg px-4 py-2 text-sm font-semibold text-white sm:inline-flex">
                Join the Waitlist
              </a>
              <button
                type="button"
                className="belon-btn flex h-10 w-10 items-center justify-center rounded-lg text-white/90 md:hidden"
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
            className={`border-t border-white/[0.06] bg-[rgba(5,5,10,0.95)] backdrop-blur-xl md:hidden ${navOpen ? 'block' : 'hidden'}`}
          >
            <nav className="belon-container flex flex-col gap-1 py-4" aria-label="Mobile">
              <div className="flex flex-col gap-4 px-1 py-2">{navLinks}</div>
              <a
                href="#waitlist"
                className="belon-btn belon-cta-primary mx-1 mt-2 inline-flex items-center justify-center rounded-lg py-3 text-center text-sm font-semibold text-white"
                onClick={() => setNavOpen(false)}
              >
                Join the Waitlist
              </a>
            </nav>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pt-8">
          <HeroGraphic />
          <div className="belon-container relative z-[1] py-12 text-center lg:py-20">
            <div className="belon-hero-badge mx-auto mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium text-white/90 sm:text-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              100% Autonomous · 99% Accuracy · 50+ Simultaneous Actions
            </div>
            <h1 className="mx-auto mb-8 max-w-4xl text-[40px] font-extrabold leading-[1.08] tracking-[-0.03em] text-white lg:text-[72px] lg:leading-[1.05]">
              <span className="block">Your Sales Pipeline.</span>
              <span className="block">Fully Decrypted.</span>
              <span className="block">Fully Automated.</span>
            </h1>
            <p className="belon-body mx-auto mb-10 max-w-3xl text-pretty text-lg sm:text-xl">
              Belon is the only AI agent that runs 50+ autonomous automations simultaneously — uncovering 100+ hidden signals from your CRM pipeline with zero human input.
            </p>
            <div className="mb-5 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <a
                href="#waitlist"
                className="belon-btn belon-cta-primary inline-flex min-h-[52px] w-full min-w-[260px] items-center justify-center rounded-lg px-8 text-base font-semibold text-white sm:w-auto"
              >
                Join the Waitlist — It&apos;s Free
              </a>
              <a
                href="#how-it-works"
                className="belon-btn inline-flex min-h-[52px] w-full min-w-[220px] items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] px-8 text-base font-semibold text-white sm:w-auto"
              >
                See How It Works
              </a>
            </div>
            <p className="mb-10 text-sm text-[#64748b]">No credit card required · 5-day free trial · $1,000/year after</p>

            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#08090f] shadow-[0_30px_120px_-60px_rgba(0,0,0,0.9)]">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#0a0a12] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#7c3aed] text-white">
                    <Zap className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                  </span>
                  <span className="text-sm font-semibold text-white/90">Belon</span>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Live
                </span>
              </div>
              <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="p-6 sm:p-8">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="text-sm font-semibold text-white">Belon&apos;s automation engine</div>
                    <div className="text-xs text-[#94a3b8]">Workflow nodes</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#0d0d1a] p-6">
                    <div className="grid grid-cols-2 gap-5">
                      {[
                        ['Trigger', 'CRM Scan'],
                        ['Condition', 'Signals detected'],
                        ['AI Action', 'Next best action'],
                        ['CRM Action', 'Execute + alert'],
                      ].map(([k, v]) => (
                        <div key={k} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">{k}</div>
                          <div className="mt-1 text-sm font-semibold text-white">{v}</div>
                          <div className="mt-3 h-2 w-16 rounded-full bg-white/5" aria-hidden />
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-[#08090f] px-4 py-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-white/90">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#3b82f6]/15 text-[#3b82f6]">
                          <Zap className="h-4 w-4" strokeWidth={2.25} aria-hidden />
                        </span>
                        Next best action cards
                      </div>
                      <span className="text-xs text-emerald-200">Running</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/10 bg-[#0a0a12] p-6 sm:p-8 lg:border-l lg:border-t-0">
                  <div className="mb-4 text-sm font-semibold text-white">Live signals</div>
                  <div className="space-y-3">
                    {[
                      ['Signal: Deal Stalling Detected', 'Insight: BlueSky Ltd — 22 days without engagement'],
                      ['Signal: Churn Risk Identified', 'Insight: PeakMetrics — health score dropped to 28'],
                      ['Signal: Budget Signal Found', 'Insight: TechFlow Inc — buyer mentioned Q2 budget'],
                    ].map(([t, s]) => (
                      <div key={t} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="text-sm font-semibold text-white/90">{t}</div>
                        <div className="mt-1 text-xs text-[#94a3b8]">{s}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="border-y border-white/[0.06] bg-[#0a0a12]" id="features">
          <div className="belon-container py-10">
            <div className="grid grid-cols-2 gap-y-10 lg:grid-cols-4 lg:gap-y-0">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={`relative px-4 text-center lg:px-8 ${
                    i % 2 === 0 ? 'max-lg:border-r max-lg:border-white/[0.06]' : ''
                  } ${i < 2 ? 'max-lg:border-b max-lg:border-white/[0.06] max-lg:pb-10' : 'max-lg:pt-2'} ${
                    i < 3 ? 'lg:border-r lg:border-white/[0.06]' : ''
                  } `}
                >
                  <div className="belon-stat-num mb-2 text-[38px] font-extrabold tabular-nums leading-none lg:text-[56px]">
                    {s.value}
                  </div>
                  <p className="text-sm text-[#64748b]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT BELON DECRYPTS */}
        <section className="belon-section" id="signals">
          <div className="belon-container">
            <h2 className="mb-4 text-center text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight tracking-tight text-white lg:text-[48px]">
              100+ Signals Your CRM Will Never Show You
            </h2>
            <p className="belon-body mx-auto mb-14 max-w-3xl text-center text-lg">
              Belon&apos;s decryption engine autonomously analyzes every hidden pattern in your pipeline — in real time, 24/7
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SIGNALS.map((item) => (
                <div key={item.title} className="belon-card group p-6">
                  <div className="belon-icon-tile mb-4">
                    <item.Icon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#94a3b8]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="belon-section border-t border-white/[0.06]" id="how-it-works">
          <div className="belon-container">
            <h2 className="mb-4 text-center text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight text-white lg:text-[48px]">
              100% Autonomous. Zero Human Input.
            </h2>
            <p className="belon-body mb-14 text-center text-lg">
              Belon runs every automation silently in the background — from signal detection to action execution
            </p>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {[
                {
                  title: 'Step 1 — Connect Your CRM',
                  body:
                    'Plug in HubSpot, Salesforce, or Dynamics in under 2 minutes. Belon immediately starts scanning your pipeline.',
                },
                {
                  title: 'Step 2 — Belon Decrypts Your Pipeline',
                  body:
                    '100+ hidden signals are analyzed automatically across every deal, rep, and account — 24 hours a day.',
                },
                {
                  title: 'Step 3 — Automations Execute',
                  body:
                    'Every insight triggers a next best action — emails sent, CRM updated, team alerted — all without anyone lifting a finger.',
                },
              ].map((s, idx) => (
                <div key={s.title} className="belon-card p-8">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/90">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#3b82f6]/15 text-xs font-bold text-[#3b82f6]">
                      {idx + 1}
                    </span>
                    {s.title}
                  </div>
                  <p className="text-sm leading-relaxed text-[#94a3b8]">{s.body}</p>
                  <div className="mt-6 h-24 w-full rounded-xl border border-white/[0.08] bg-white/[0.02]" aria-hidden />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NEXT BEST ACTION SECTION */}
        <section className="belon-section">
          <div className="belon-container">
            <h2 className="mb-4 text-center text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight text-white lg:text-[48px]">
              Every Insight Becomes An Instant Automation
            </h2>
            <p className="belon-body mx-auto mb-14 max-w-3xl text-center text-lg">
              Belon doesn&apos;t just find problems — it fixes them automatically
            </p>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {[
                {
                  signal: 'Signal: Deal Stalling Detected',
                  insight: 'Insight: BlueSky Ltd — 22 days without engagement',
                  action: 'Action: Re-engagement email sent automatically ✓',
                },
                {
                  signal: 'Signal: Churn Risk Identified',
                  insight: 'Insight: PeakMetrics — health score dropped to 28',
                  action: 'Action: Urgent call scheduled automatically ✓',
                },
                {
                  signal: 'Signal: Budget Signal Found',
                  insight: 'Insight: TechFlow Inc — buyer mentioned Q2 budget',
                  action: 'Action: Closing proposal drafted and sent ✓',
                },
              ].map((c) => (
                <div key={c.signal} className="belon-card p-8">
                  <div className="text-sm font-semibold text-white">{c.signal}</div>
                  <div className="mt-3 text-sm text-[#94a3b8]">{c.insight}</div>
                  <div className="mt-4 text-sm font-semibold text-emerald-200">{c.action}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 99% ACCURACY SECTION */}
        <section className="belon-section border-y border-white/[0.06]" id="accuracy">
          <div className="belon-container grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="mb-4 text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight text-white lg:text-[48px]">
                Built For 99% Accuracy
              </h2>
              <p className="belon-body mb-10 text-lg">
                10 layers of intelligence verify every signal before any action is taken
              </p>
              <ol className="space-y-4">
                {ACCURACY_PILLARS.map((p, i) => (
                  <li key={p.title} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3b82f6]/20 text-sm font-bold text-[#3b82f6]">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-white">{p.title}</div>
                      <div className="text-sm text-[#94a3b8]">{p.desc}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div ref={gaugeRef.ref} className="flex justify-center lg:justify-end">
              <div className="relative flex h-72 w-72 items-center justify-center">
                <div className="belon-gauge-halo absolute inset-0 flex items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#gaugeGradLandingRef)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      className={`belon-gauge-ring ${gaugeRef.visible ? 'is-visible' : ''}`}
                      style={{ transformOrigin: '50% 50%' }}
                    />
                    <defs>
                      <linearGradient id="gaugeGradLandingRef" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[48px] font-extrabold leading-none text-white">99%</span>
                  <span className="mt-1 text-sm text-[#64748b]">verified accuracy</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTEGRATIONS */}
        <section className="belon-section" id="integrations">
          <div className="belon-container mb-10 text-center">
            <h2 className="text-[clamp(1.5rem,3vw,3rem)] font-bold leading-tight text-white lg:text-[48px]">
              Connects To Your Entire Sales Stack
            </h2>
          </div>
          <div className="belon-container flex flex-wrap items-center justify-center gap-3">
            {INTEGRATIONS.map((name) => (
              <span key={name} className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm text-white/85">
                {name}
              </span>
            ))}
          </div>
        </section>

        {/* WHY BELON */}
        <section className="belon-section border-t border-white/[0.06]" id="why">
          <div className="belon-container">
            <h2 className="mb-14 text-center text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight text-white lg:text-[48px]">
              Why Sales Teams Choose Belon
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {[
                {
                  title: 'Replaces an $80K/year Analyst',
                  body: 'Belon runs 24/7 and never misses a signal. No salary, no sick days, no human error.',
                },
                {
                  title: 'Prevents 20% Revenue Leakage',
                  body: 'The average company loses 20% of pipeline to stalled deals. Belon catches every single one.',
                },
                {
                  title: '10x Faster Than Manual Reviews',
                  body: 'What takes your team hours every week, Belon completes in minutes — automatically.',
                },
              ].map((c) => (
                <div key={c.title} className="belon-card p-8">
                  <div className="mb-3 text-xl font-bold text-white">{c.title}</div>
                  <p className="text-sm leading-relaxed text-[#94a3b8]">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="belon-section" id="testimonials">
          <div className="belon-container">
            <h2 className="mb-4 text-center text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight text-white lg:text-[48px]">
              What Sales Leaders Are Saying
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {[
                {
                  quote: 'Belon found 3 stalled deals we had no idea about. Recovered $45K in pipeline in the first week.',
                  who: '— James R., VP of Sales · TechFlow Inc',
                },
                {
                  quote: 'The automation runs 24/7. Our reps stopped doing manual CRM updates completely.',
                  who: '— Sarah M., Sales Director · CloudNine',
                },
                {
                  quote: '99% accuracy is no joke. Every insight Belon surfaces has been spot on for our team.',
                  who: '— David K., Head of Revenue · DataBridge',
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

        {/* PRICING */}
        <section className="belon-section border-y border-white/[0.06]" id="pricing">
          <div className="belon-container">
            <h2 className="mb-4 text-center text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight text-white lg:text-[48px]">
              Simple, Transparent Pricing
            </h2>
            <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="belon-card p-8">
                <div className="text-sm font-semibold text-white/90">Free Trial</div>
                <div className="mt-4 text-4xl font-extrabold text-white">Free for 5 days</div>
                <div className="mt-6 text-sm text-[#94a3b8]">Full access to all automations, 100+ signals, all integrations</div>
                <a href="#waitlist" className="belon-btn belon-cta-primary mt-8 inline-flex min-h-[52px] w-full items-center justify-center rounded-lg px-6 text-base font-semibold text-white">
                  Start Free Trial
                </a>
              </div>
              <div className="belon-card relative p-8">
                <div className="absolute right-6 top-6 rounded-full bg-[#7c3aed]/20 px-3 py-1 text-xs font-semibold text-[#c4b5fd]">
                  Most Popular
                </div>
                <div className="text-sm font-semibold text-white/90">Annual Plan</div>
                <div className="mt-4 text-4xl font-extrabold text-white">$1,000/year</div>
                <div className="mt-6 text-sm text-[#94a3b8]">Everything in free + unlimited automations, priority support, custom workflows</div>
                <a href="#waitlist" className="belon-btn mt-8 inline-flex min-h-[52px] w-full items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] px-6 text-base font-semibold text-white">
                  Upgrade to Annual
                </a>
              </div>
            </div>
            <p className="mt-10 text-center text-sm text-[#64748b]">
              No credit card required for trial · Cancel anytime · Self-checkout upgrade
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="belon-section" id="faq">
          <div className="belon-container">
            <h2 className="mb-4 text-center text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight text-white lg:text-[48px]">
              Everything You Need To Know
            </h2>
            <div className="mx-auto grid max-w-3xl gap-4">
              {[
                { q: 'How long does setup take?', a: 'Under 2 minutes. Connect your CRM and Belon starts immediately.' },
                { q: 'What CRMs does Belon support?', a: 'HubSpot, Salesforce, Microsoft Dynamics, and more.' },
                { q: 'Is there really no human input needed?', a: 'Correct. 100% of automations run without any manual action.' },
                { q: 'How does Belon achieve 99% accuracy?', a: '10 layers of AI verification on every signal before action is taken.' },
                { q: 'What happens after the 5-day free trial?', a: "You'll be prompted to upgrade to the $1,000 annual plan via self-checkout." },
                { q: 'Can I customize the automation workflows?', a: 'Yes. You can build, edit, and personalize workflows using the visual workflow builder.' },
              ].map((f, i) => (
                <FaqItem key={f.q} q={f.q} a={f.a} open={faqOpen === i} onToggle={() => setFaqOpen((v) => (v === i ? null : i))} />
              ))}
            </div>
          </div>
        </section>

        {/* WAITLIST CTA */}
        <section className="belon-section relative overflow-hidden" id="waitlist">
          <div className="belon-waitlist-orb" aria-hidden />
          <div className="belon-container relative z-[1] max-w-2xl text-center">
            <h2 className="mb-4 text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight text-white lg:text-[48px]">
              Be First To Decrypt Your Pipeline
            </h2>
            <p className="belon-body mb-10 text-lg">
              Join the waitlist and get early access when Belon launches. Free 5-day trial included.
            </p>
            {waitlistStatus === 'success' ? (
              <div className="flex flex-col items-center gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.08] px-6 py-8 text-emerald-200">
                <CircleCheck className="belon-success-icon h-14 w-14 text-emerald-400" strokeWidth={1.5} aria-hidden />
                <p className="text-lg font-medium text-emerald-100">You&apos;re on the list! We&apos;ll be in touch.</p>
              </div>
            ) : (
              <form
                onSubmit={submitWaitlist}
                className="mx-auto flex max-w-xl flex-col gap-2 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.02)] p-1.5 sm:flex-row sm:items-stretch"
              >
                <label htmlFor="waitlist-email" className="sr-only">
                  Enter your work email
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Enter your work email"
                  value={waitlistEmail}
                  onChange={(e) => {
                    setWaitlistEmail(e.target.value);
                    if (waitlistStatus === 'error') setWaitlistStatus('idle');
                  }}
                  className="belon-btn h-[52px] min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0d0d1a] px-4 text-white placeholder:text-[#64748b] outline-none transition-shadow focus:border-[#3b82f6]/50 focus:ring-2 focus:ring-[#3b82f6]/30"
                />
                <button
                  type="submit"
                  disabled={waitlistStatus === 'loading'}
                  className="belon-btn belon-cta-primary h-[52px] shrink-0 rounded-lg px-8 font-semibold text-white disabled:opacity-60"
                >
                  {waitlistStatus === 'loading' ? 'Joining…' : 'Join the Waitlist'}
                </button>
              </form>
            )}
            {waitlistStatus === 'error' ? <p className="mt-4 text-sm text-red-400">Enter a valid email, or try again.</p> : null}
            <p className="mt-6 text-sm text-[#64748b]">No spam. No credit card. Cancel anytime.</p>
            <p className="mt-8 text-sm text-[#94a3b8]">Join 300+ sales leaders already on the waitlist.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/[0.06] bg-[#05050a] px-4 py-12 sm:px-6 lg:px-8" id="contact">
          <div className="belon-container flex max-w-[1200px] flex-col items-center justify-between gap-8 text-center text-sm text-[#64748b] md:flex-row md:text-left">
            <div>
              <BelonLogo className="justify-center md:justify-start" />
              <p className="belon-body mt-2 max-w-xs">Your pipeline. Fully decrypted.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 md:justify-center">
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
            <div className="flex flex-col items-center gap-2 md:items-end">
              <p>© 2026 Belon. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

