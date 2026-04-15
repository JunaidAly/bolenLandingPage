import { toast } from 'sonner';
import {
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingDown,
  Mail,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const actionCards = [
  {
    id: 1,
    type: 'critical',
    title: 'TechFlow Inc deal stalled for 14 days',
    reason: 'No contact activity logged since Feb 28. Last email unopened. Deal value: $125K.',
    action: 'Draft re-engagement email',
    icon: Clock,
    color: 'red',
  },
  {
    id: 2,
    type: 'warning',
    title: '3 high-value deals missing next steps',
    reason: 'Combined value of $380K. No follow-up tasks created after last touchpoint.',
    action: 'Generate task sequences',
    icon: AlertTriangle,
    color: 'amber',
  },
  {
    id: 3,
    type: 'revenue',
    title: 'Acme Corp showing buying signals',
    reason: 'Pricing page visited 12 times this week. 3 stakeholders engaged on LinkedIn.',
    action: 'Schedule discovery call',
    icon: TrendingDown,
    color: 'green',
  },
  {
    id: 4,
    type: 'action',
    title: '8 leads need qualification',
    reason: 'New inbound leads from demo requests. Average company size: 200+ employees.',
    action: 'Run lead scoring',
    icon: CheckCircle2,
    color: 'blue',
  },
  {
    id: 5,
    type: 'critical',
    title: 'DataSync renewal at risk',
    reason: 'Contract expires in 12 days. Champion left company 3 weeks ago. $95K ARR.',
    action: 'Identify new champion',
    icon: DollarSign,
    color: 'red',
  },
  {
    id: 6,
    type: 'suggestion',
    title: "Sarah hasn't followed up with GlobalTech",
    reason: 'Meeting was 5 days ago. Strong interest indicated but no next steps logged.',
    action: 'Send follow-up reminder',
    icon: Mail,
    color: 'violet',
  },
];

const stats = [
  { label: 'Pipeline Health', value: '72%', change: '-8%', trend: 'down' },
  { label: 'Active Deals', value: '47', change: '+3', trend: 'up' },
  { label: 'At Risk Revenue', value: '$1.2M', change: '+$340K', trend: 'down' },
  { label: 'Actions Completed', value: '18/24', change: '75%', trend: 'neutral' },
];

export function AgentHome() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl px-4 py-6 sm:p-6 lg:p-8">
      <div className="belon-enter-up mb-6 sm:mb-8" style={{ animationDelay: '0ms' }}>
        <h1 className="mb-2 text-[clamp(1.375rem,5vw,1.875rem)] font-medium leading-snug">
          Good morning, Sarah.
        </h1>
        <p className="text-base leading-relaxed text-white/60 sm:text-lg">
          I found <span className="font-medium text-red-400">6 critical issues</span> in your pipeline today.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="belon-enter-up rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/[0.07] sm:p-5"
            style={{ animationDelay: `${40 + index * 45}ms` }}
          >
            <div className="mb-1 text-sm text-white/50">{stat.label}</div>
            <div className="mb-1 min-h-[2rem] text-2xl">{stat.value}</div>
            <div
              className={`text-sm ${
                stat.trend === 'up'
                  ? 'text-emerald-400'
                  : stat.trend === 'down'
                    ? 'text-red-400'
                    : 'text-white/40'
              }`}
            >
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {actionCards.map((card, index) => {
          const Icon = card.icon;
          const isPulsing = card.type === 'critical';

          return (
            <div
              key={card.id}
              className={`belon-enter-x group rounded-2xl border bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/[0.07] sm:p-6 ${
                isPulsing ? 'animate-pulse border-red-500/30' : 'border-white/10'
              }`}
              style={{ animationDelay: `${200 + index * 70}ms` }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    card.color === 'red'
                      ? 'bg-red-500/10 text-red-400'
                      : card.color === 'amber'
                        ? 'bg-amber-500/10 text-amber-400'
                        : card.color === 'green'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : card.color === 'blue'
                            ? 'bg-[#3b82f6]/10 text-[#3b82f6]'
                            : 'bg-[#7c3aed]/10 text-[#7c3aed]'
                  }`}
                >
                  <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 text-lg leading-snug">{card.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-white/60">{card.reason}</p>

                  <button
                    type="button"
                    onClick={() => {
                      toast.success('Agent task queued', {
                        description: `${card.action} — ${card.title}`,
                      });
                    }}
                    className="inline-flex min-h-11 min-w-0 touch-manipulation items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm transition-colors hover:bg-white/15 active:bg-white/20 sm:py-2"
                  >
                    <span className="text-left">{card.action}</span>
                    <ArrowRight className="belon-icon-nudge h-4 w-4 shrink-0" />
                  </button>
                </div>

                {card.type === 'critical' && (
                  <div className="shrink-0 self-start rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-400 sm:self-auto">
                    Critical
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
