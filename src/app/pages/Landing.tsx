import '@fontsource/sora/400.css';
import '@fontsource/sora/500.css';
import '@fontsource/sora/600.css';
import '@fontsource/sora/700.css';
import '@fontsource/sora/800.css';
import '../../styles/landing.css';

import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  Bot,
  Calendar,
  Check,
  CircleCheck,
  Clock,
  DollarSign,
  Flag,
  Ghost,
  History,
  Layers,
  Lightbulb,
  LineChart,
  Link2,
  Mail,
  Menu,
  MessageCircle,
  Percent,
  Puzzle,
  RefreshCw,
  Repeat2,
  Rocket,
  Scale,
  Search,
  Shield,
  Shuffle,
  Target,
  Trophy,
  User,
  UserCog,
  X,
  Zap,
} from 'lucide-react';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ProductPreview } from '../components/landing/ProductPreview';
import { supabase } from '../../lib/supabase';
import { notifyWaitlistOwner } from '../../lib/waitlist-owner-notify';

const WAITLIST_LOCAL_KEY = 'belon_waitlist_emails';

const INSIGHTS: { Icon: LucideIcon; title: string; desc: string }[] = [
  { Icon: Search, title: 'Deal Velocity Decay', desc: 'Detects when deals slow down before reps notice' },
  { Icon: MessageCircle, title: 'Engagement Sentiment Shift', desc: 'Identifies when buyer tone turns cold' },
  { Icon: AlertTriangle, title: 'Stage Anomaly Detection', desc: 'Flags deals stuck longer than your average' },
  { Icon: Ghost, title: 'Ghost Deal Detection', desc: 'Surfaces deals with zero activity automatically' },
  { Icon: Target, title: 'Win Probability Score', desc: 'AI-predicted close likelihood per deal' },
  { Icon: Trophy, title: 'Competitor Mention Detection', desc: 'Catches competitor references in emails and notes' },
  { Icon: DollarSign, title: 'Budget Signal Detection', desc: 'Identifies when buyers reveal budget intent' },
  { Icon: User, title: 'Decision Maker Gap', desc: 'Flags deals missing key stakeholder contact' },
  { Icon: Link2, title: 'Multi-Threading Score', desc: 'Measures stakeholder coverage per deal' },
  { Icon: Flag, title: 'Forecast Risk Flag', desc: 'Predicts deals likely to slip this quarter' },
  { Icon: Clock, title: 'Response Time Decay', desc: 'Detects when rep response times are hurting deals' },
  { Icon: Rocket, title: 'Deal Momentum Score', desc: 'Tracks acceleration or deceleration per deal' },
  { Icon: RefreshCw, title: 'Pipeline Velocity Score', desc: 'Measures overall pipeline speed vs benchmark' },
  { Icon: Mail, title: 'Email Engagement Drop', desc: 'Detects declining open and reply rates' },
  { Icon: Calendar, title: 'Meeting Frequency Decay', desc: 'Flags declining meeting cadence' },
  { Icon: Lightbulb, title: 'Buyer Intent Signal', desc: 'Identifies strong purchase intent signals' },
  { Icon: Puzzle, title: 'Deal Complexity Score', desc: 'Measures deal risk based on stakeholder complexity' },
  { Icon: Zap, title: 'Urgency Signal Detection', desc: 'Detects urgency language in communications' },
];

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

const ACCURACY_PILLARS = [
  { title: 'Multi-Signal Scoring', desc: '15+ data points per insight' },
  { title: 'Historical Pattern Matching', desc: 'Learns from your pipeline history' },
  { title: 'Confidence Intervals', desc: 'Every prediction has a certainty score' },
  { title: 'Real-Time Data Sync', desc: 'Never stale, syncs every 15 minutes' },
  { title: 'Cross-Validation', desc: 'CRM vs email vs calendar vs Slack' },
  { title: 'Rep Behavior Modeling', desc: 'Calibrates per individual rep' },
  { title: 'Industry Benchmarking', desc: 'Compares against sector standards' },
  { title: 'Anomaly Baseline Calibration', desc: 'Sets normal per deal type' },
  { title: 'Continuous Feedback Loop', desc: 'Improves with every outcome' },
  { title: 'Ensemble AI Models', desc: 'Multiple models vote on every prediction' },
] as const;

const WORKFLOW_STEPS = [
  { label: 'CRM Scan', tone: 'blue' as const },
  { label: 'Decrypt Insights', tone: 'violet' as const },
  { label: 'Score Deals', tone: 'cyan' as const },
  { label: 'Detect Risks', tone: 'amber' as const },
  { label: 'Execute Actions', tone: 'green' as const },
  { label: 'Alert Team', tone: 'orange' as const },
];

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
      { threshold, rootMargin: '0px 0px -10% 0px' }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useCountUp(target: number, visible: boolean, duration = 1600) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start: number | null = null;
    let raf = 0;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setV(Math.round(target * ease(p)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [visible, target, duration]);
  return v;
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

const MARQUEE_DUP = [...INTEGRATIONS, ...INTEGRATIONS] as string[];

function WorkflowBlock() {
  return (
    <>
      <div className="mb-16 hidden w-full flex-wrap items-center justify-center gap-0 md:flex">
        {WORKFLOW_STEPS.map((step, i) => (
          <Fragment key={step.label}>
            <div className={`belon-wf-node belon-wf-node--${step.tone}`}>
              <span>{step.label}</span>
            </div>
            {i < WORKFLOW_STEPS.length - 1 ? <div className="belon-wf-connector-h" aria-hidden /> : null}
          </Fragment>
        ))}
      </div>
      <div className="mb-16 flex flex-col items-center md:hidden">
        {WORKFLOW_STEPS.map((step, i) => (
          <Fragment key={step.label}>
            <div className={`belon-wf-node belon-wf-node--${step.tone}`}>
              <span>{step.label}</span>
            </div>
            {i < WORKFLOW_STEPS.length - 1 ? <div className="belon-wf-connector-v" aria-hidden /> : null}
          </Fragment>
        ))}
      </div>
    </>
  );
}

export function Landing() {
  const [navOpen, setNavOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [waitlistCount, setWaitlistCount] = useState(247);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen]);

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

  const statsRef = useInView<HTMLElement>(0.25);
  const c50 = useCountUp(50, statsRef.visible);
  const c100 = useCountUp(100, statsRef.visible);
  const c99 = useCountUp(99, statsRef.visible);
  const gaugeRef = useInView<HTMLDivElement>(0.35);

  const navLinks = (
    <>
      <a href="#how-it-works" className="belon-nav-link text-sm font-medium" onClick={() => setNavOpen(false)}>
        How it Works
      </a>
      <a href="#product-preview" className="belon-nav-link text-sm font-medium" onClick={() => setNavOpen(false)}>
        Product
      </a>
      <a href="#insights" className="belon-nav-link text-sm font-medium" onClick={() => setNavOpen(false)}>
        Automations
      </a>
      <a href="#accuracy" className="belon-nav-link text-sm font-medium" onClick={() => setNavOpen(false)}>
        Accuracy
      </a>
      <a href="#waitlist" className="belon-nav-link text-sm font-medium" onClick={() => setNavOpen(false)}>
        Pricing
      </a>
      <a href="#why" className="belon-nav-link text-sm font-medium" onClick={() => setNavOpen(false)}>
        Enterprise
      </a>
    </>
  );

  return (
    <div className="belon-landing text-[15px] leading-relaxed sm:text-base">
      <div className="belon-atmosphere" aria-hidden>
        <div className="belon-glow belon-glow--blue" />
        <div className="belon-glow belon-glow--violet" />
        <div className="belon-dot-grid" />
      </div>

      <div className="belon-landing-inner">
        <header className="sticky top-0 z-50 h-16 border-b border-white/[0.06] bg-[rgba(5,5,10,0.8)] backdrop-blur-[20px]">
          <div className="belon-container flex h-full items-center justify-between gap-4">
            <Link to="/" className="touch-manipulation active:opacity-90">
              <BelonLogo />
            </Link>
            <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
              {navLinks}
            </nav>
            <div className="flex items-center gap-2">
              <a
                href="#waitlist"
                className="belon-btn belon-cta-primary hidden rounded-lg px-4 py-2 text-sm font-semibold text-white sm:inline-flex"
              >
                Join Waitlist
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
            className={`border-t border-white/[0.06] bg-[rgba(5,5,10,0.95)] backdrop-blur-xl md:hidden ${
              navOpen ? 'block' : 'hidden'
            }`}
          >
            <nav className="belon-container flex flex-col gap-1 py-4" aria-label="Mobile">
              <div className="flex flex-col gap-4 px-1 py-2">{navLinks}</div>
              <a
                href="#waitlist"
                className="belon-btn belon-cta-primary mx-1 mt-2 inline-flex items-center justify-center rounded-lg py-3 text-center text-sm font-semibold text-white"
                onClick={() => setNavOpen(false)}
              >
                Join Waitlist
              </a>
            </nav>
          </div>
        </header>

        <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pt-8">
          <HeroGraphic />
          <div className="belon-container relative z-[1] py-12 text-center lg:py-20">
            <div className="belon-hero-badge mx-auto mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium text-white/90 sm:text-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              99% Accuracy · 100% Autonomous · 50+ Simultaneous Actions
            </div>
            <h1 className="mx-auto mb-8 max-w-4xl text-[40px] font-extrabold leading-[1.08] tracking-[-0.03em] text-white lg:text-[72px] lg:leading-[1.05]">
              <span className="block">Your Sales Pipeline.</span>
              <span className="block">Fully</span>
              <span className="block">
                <span className="belon-text-gradient belon-gradient-word">Decrypted</span>.
              </span>
            </h1>
            <p className="belon-body mx-auto mb-10 max-w-2xl text-pretty text-lg sm:text-xl">
              Belon runs 50+ autonomous automations simultaneously, uncovering 100+ hidden insights from your CRM
              pipeline — with zero human input.
            </p>
            <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <a
                href="#waitlist"
                className="belon-btn belon-cta-primary inline-flex min-h-[52px] w-full min-w-[200px] items-center justify-center rounded-lg px-8 text-base font-semibold text-white sm:w-auto"
              >
                Join the Waitlist
              </a>
              <a
                href="#how-it-works"
                className="belon-btn inline-flex min-h-[52px] w-full min-w-[200px] items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] px-8 text-base font-semibold text-white sm:w-auto"
              >
                See How It Works
              </a>
            </div>
            <p className="belon-muted mb-8 text-xs font-medium tracking-wide sm:text-sm">
              HubSpot · Salesforce · Slack · Gmail · Zoom
            </p>
            <p className="text-sm text-[#64748b]">
              Trusted by forward-thinking sales teams · No credit card required
            </p>
          </div>
        </section>

        <ProductPreview />

        <section
          ref={statsRef.ref}
          className="belon-section relative border-y border-[rgba(59,130,246,0.2)] bg-gradient-to-b from-transparent via-[rgba(59,130,246,0.05)] to-transparent"
          id="stats"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[rgba(59,130,246,0.35)] shadow-[0_0_12px_rgba(59,130,246,0.4)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[rgba(59,130,246,0.35)] shadow-[0_0_12px_rgba(59,130,246,0.4)]" />
          <div className="belon-container">
            <div className="grid grid-cols-2 gap-y-12 lg:grid-cols-4 lg:gap-y-0">
              {[
                { v: `${c50}+`, label: 'Simultaneous Automations Running' },
                { v: `${c100}+`, label: 'Pipeline Insights Decrypted' },
                { v: `${c99}%`, label: 'Accuracy Rate' },
                { v: '0', label: 'Human Inputs Required' },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className={`relative px-4 text-center lg:px-8 ${
                    i % 2 === 0 ? 'max-lg:border-r max-lg:border-white/[0.06]' : ''
                  } ${i < 2 ? 'max-lg:border-b max-lg:border-white/[0.06] max-lg:pb-10' : 'max-lg:pt-2'} ${
                    i < 3 ? 'lg:border-r lg:border-white/[0.06]' : ''
                  } `}
                >
                  <div className="belon-stat-num mb-2 text-[40px] font-extrabold tabular-nums leading-none lg:text-[64px] lg:font-extrabold">
                    {s.v}
                  </div>
                  <p className="text-sm text-[#64748b]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="belon-section" id="insights">
          <div className="belon-container">
            <h2 className="mb-4 text-center text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight tracking-tight text-white lg:text-[48px] lg:font-bold">
              100+ Insights Your CRM Will Never Show You
            </h2>
            <p className="belon-body mx-auto mb-14 max-w-2xl text-center text-lg">
              Belon&apos;s decryption engine autonomously analyzes every signal in your pipeline
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {INSIGHTS.map((item) => (
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

        <section className="belon-section border-t border-white/[0.06]" id="how-it-works">
          <div className="belon-container">
            <h2 className="mb-4 text-center text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight text-white lg:text-[48px]">
              50+ Automations Running Simultaneously
            </h2>
            <p className="belon-body mb-14 text-center text-lg">While your team sleeps, Belon works</p>

            <WorkflowBlock />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="belon-card p-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#3b82f6]">Detection Automations</h3>
                <ul className="space-y-3 text-sm text-[#94a3b8]">
                  {[
                    'Auto-detect stalled deals every hour',
                    'Auto-flag revenue at risk',
                    'Auto-identify ghost deals',
                    'Auto-score every new lead',
                    'Auto-detect competitor mentions',
                  ].map((t) => (
                    <li key={t} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#3b82f6]" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="belon-card p-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#7c3aed]">Action Automations</h3>
                <ul className="space-y-3 text-sm text-[#94a3b8]">
                  {[
                    'Auto-send re-engagement emails',
                    'Auto-update CRM deal stages',
                    'Auto-assign tasks to reps',
                    'Auto-sync meeting notes to CRM',
                    'Auto-clean duplicate contacts',
                  ].map((t) => (
                    <li key={t} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#7c3aed]" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="belon-card p-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-emerald-400">
                  Intelligence Automations
                </h3>
                <ul className="space-y-3 text-sm text-[#94a3b8]">
                  {[
                    'Auto-generate forecast reports',
                    'Auto-benchmark rep performance',
                    'Auto-calibrate scoring models',
                    'Auto-enrich contact data',
                    'Auto-detect pipeline anomalies',
                  ].map((t) => (
                    <li key={t} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="belon-section" id="accuracy">
          <div className="belon-container grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-4 text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight text-white lg:text-[48px]">
                Built for 99% Accuracy
              </h2>
              <p className="belon-body mb-8 text-lg">
                10 layers of intelligence verify every insight before it surfaces
              </p>
              <ol className="space-y-4">
                {ACCURACY_PILLARS.map((p, i) => (
                  <li key={p.title} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3b82f6]/20 text-sm font-bold text-[#3b82f6]">
                      {i + 1}
                    </span>
                    <div>
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
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#gaugeGradLanding)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      className={`belon-gauge-ring ${gaugeRef.visible ? 'is-visible' : ''}`}
                      style={{ transformOrigin: '50% 50%' }}
                    />
                    <defs>
                      <linearGradient id="gaugeGradLanding" x1="0%" y1="0%" x2="100%" y2="0%">
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

        <section className="belon-section border-y border-white/[0.06]" id="integrations">
          <div className="belon-container mb-10 text-center">
            <h2 className="text-[clamp(1.5rem,3vw,3rem)] font-bold leading-tight text-white lg:text-[48px]">
              Connects To Your Entire Sales Stack
            </h2>
          </div>
          <div className="belon-marquee-mask belon-marquee-row space-y-4">
            <div className="relative overflow-hidden">
              <div className="belon-marquee-track">
                {MARQUEE_DUP.map((name, i) => (
                  <span key={`a-${name}-${i}`} className="belon-marquee-pill">
                    {name}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden">
              <div className="belon-marquee-track belon-marquee-track--rev">
                {MARQUEE_DUP.map((name, i) => (
                  <span key={`b-${name}-${i}`} className="belon-marquee-pill">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="belon-section" id="why">
          <div className="belon-container">
            <h2 className="mb-14 text-center text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight text-white lg:text-[48px]">
              Why Sales Teams Choose Belon
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="belon-card p-8">
                <div className="belon-icon-tile mb-6">
                  <User className="h-5 w-5" strokeWidth={2} aria-hidden />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">Replaces a $80K/year Sales Ops Analyst</h3>
                <p className="text-[#94a3b8]">
                  Belon runs 24/7 and never misses a signal. No salary, no sick days, no human error.
                </p>
              </div>
              <div className="belon-card p-8">
                <div className="belon-icon-tile mb-6">
                  <Shield className="h-5 w-5" strokeWidth={2} aria-hidden />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">Prevents 20% Pipeline Revenue Leakage</h3>
                <p className="text-[#94a3b8]">
                  The average company loses 20% of pipeline to stalled deals. Belon catches every one.
                </p>
              </div>
              <div className="belon-card p-8">
                <div className="belon-icon-tile mb-6">
                  <Zap className="h-5 w-5" strokeWidth={2} aria-hidden />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">10x Faster Than Manual CRM Reviews</h3>
                <p className="text-[#94a3b8]">
                  What takes your team hours every week, Belon completes in minutes. Automatically.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="belon-section relative overflow-hidden"
          id="waitlist"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 40%, #0f172a 0%, #05050a 65%, #05050a 100%)',
          }}
        >
          <div className="belon-waitlist-orb" aria-hidden />
          <div className="belon-container relative z-[1] max-w-2xl text-center">
            <h2 className="mb-4 text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight text-white lg:text-[48px]">
              Be First To Decrypt Your Pipeline
            </h2>
            <p className="belon-body mb-10 text-lg">Join the waitlist and get early access when Belon launches</p>
            {waitlistStatus === 'success' ? (
              <div className="flex flex-col items-center gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.08] px-6 py-8 text-emerald-200">
                <CircleCheck
                  className="belon-success-icon h-14 w-14 text-emerald-400"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <p className="text-lg font-medium text-emerald-100">
                  You&apos;re on the list! We&apos;ll be in touch.
                </p>
              </div>
            ) : (
              <form
                onSubmit={submitWaitlist}
                className="mx-auto flex max-w-xl flex-col gap-2 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.02)] p-1.5 sm:flex-row sm:items-stretch"
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
                  className="belon-btn h-[52px] min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0d0d1a] px-4 text-white placeholder:text-[#64748b] outline-none transition-shadow focus:border-[#3b82f6]/50 focus:ring-2 focus:ring-[#3b82f6]/30"
                />
                <button
                  type="submit"
                  disabled={waitlistStatus === 'loading'}
                  className="belon-btn belon-cta-primary h-[52px] shrink-0 rounded-lg px-8 font-semibold text-white disabled:opacity-60"
                >
                  {waitlistStatus === 'loading' ? 'Joining…' : 'Join Waitlist'}
                </button>
              </form>
            )}
            {waitlistStatus === 'error' && (
              <p className="mt-4 text-sm text-red-400">Enter a valid email, or try again.</p>
            )}
            <p className="mt-6 text-sm text-[#64748b]">No spam. No credit card. Cancel anytime.</p>
            <p className="mt-8 text-sm text-[#94a3b8]">
              Join <span className="font-semibold text-white">{waitlistCount}</span> sales leaders already on the waitlist
            </p>
          </div>
        </section>

        <footer className="border-t border-white/[0.06] bg-[#05050a] px-4 py-12 sm:px-6 lg:px-8">
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
              <Link
                to="/app"
                className="text-xs text-[#3b82f6]/90 transition-colors hover:text-[#60a5fa]"
              >
                Workspace sign-in
              </Link>
              <p>© 2026 Belon. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
