import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Building2, DollarSign, Clock, AlertTriangle, TrendingUp, Filter } from 'lucide-react';

const stages = [
  { id: 'discovery', name: 'Discovery', count: 8 },
  { id: 'qualification', name: 'Qualification', count: 12 },
  { id: 'proposal', name: 'Proposal', count: 7 },
  { id: 'negotiation', name: 'Negotiation', count: 5 },
];

const deals = [
  {
    id: 1,
    company: 'TechFlow Inc',
    value: 125000,
    health: 34,
    stage: 'discovery',
    daysInStage: 14,
    risk: 'critical',
    rep: 'Sarah Johnson',
  },
  {
    id: 2,
    company: 'DataSync Corp',
    value: 95000,
    health: 45,
    stage: 'discovery',
    daysInStage: 11,
    risk: 'high',
    rep: 'Mike Chen',
  },
  {
    id: 3,
    company: 'CloudBase Solutions',
    value: 78000,
    health: 72,
    stage: 'discovery',
    daysInStage: 5,
    risk: null,
    rep: 'Emily Rodriguez',
  },
  {
    id: 4,
    company: 'Enterprise Dynamics',
    value: 220000,
    health: 88,
    stage: 'qualification',
    daysInStage: 3,
    risk: null,
    rep: 'Sarah Johnson',
  },
  {
    id: 5,
    company: 'Acme Corporation',
    value: 165000,
    health: 91,
    stage: 'qualification',
    daysInStage: 7,
    risk: null,
    rep: 'David Park',
  },
  {
    id: 6,
    company: 'GlobalTech Systems',
    value: 340000,
    health: 52,
    stage: 'qualification',
    daysInStage: 18,
    risk: 'high',
    rep: 'Sarah Johnson',
  },
  {
    id: 7,
    company: 'Innovation Labs',
    value: 89000,
    health: 78,
    stage: 'proposal',
    daysInStage: 4,
    risk: null,
    rep: 'Mike Chen',
  },
  {
    id: 8,
    company: 'Future Systems',
    value: 195000,
    health: 85,
    stage: 'proposal',
    daysInStage: 6,
    risk: null,
    rep: 'Emily Rodriguez',
  },
  {
    id: 9,
    company: 'Digital Ventures',
    value: 420000,
    health: 94,
    stage: 'negotiation',
    daysInStage: 2,
    risk: null,
    rep: 'Sarah Johnson',
  },
];

function CircularProgress({ value, size = 48 }: { value: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const color =
    value >= 75 ? '#10b981' : value >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
        {value}
      </div>
    </div>
  );
}

const reps = [...new Set(deals.map((d) => d.rep))].sort();

const stageCycle = ['all', ...stages.map((s) => s.id)] as const;
const repCycle = ['all', ...reps] as const;
const healthCycle = ['all', 'healthy', 'at-risk', 'critical'] as const;

function healthBucket(health: number): 'healthy' | 'at-risk' | 'critical' {
  if (health >= 75) return 'healthy';
  if (health >= 50) return 'at-risk';
  return 'critical';
}

export function PipelineIntel() {
  const [stageFilter, setStageFilter] = useState<(typeof stageCycle)[number]>('all');
  const [repFilter, setRepFilter] = useState<(typeof repCycle)[number]>('all');
  const [healthFilter, setHealthFilter] = useState<(typeof healthCycle)[number]>('all');

  const filteredDeals = useMemo(() => {
    return deals.filter((d) => {
      if (stageFilter !== 'all' && d.stage !== stageFilter) return false;
      if (repFilter !== 'all' && d.rep !== repFilter) return false;
      if (healthFilter !== 'all' && healthBucket(d.health) !== healthFilter) return false;
      return true;
    });
  }, [stageFilter, repFilter, healthFilter]);

  const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
  const avgHealth =
    filteredDeals.length === 0
      ? 0
      : Math.round(filteredDeals.reduce((sum, deal) => sum + deal.health, 0) / filteredDeals.length);
  const atRiskDeals = filteredDeals.filter((d) => d.risk).length;
  const atRiskRevenue = filteredDeals.filter((d) => d.risk).reduce((sum, deal) => sum + deal.value, 0);

  const stageLabel =
    stageFilter === 'all' ? 'All Stages' : stages.find((s) => s.id === stageFilter)?.name ?? stageFilter;
  const repLabel = repFilter === 'all' ? 'All Reps' : repFilter;
  const healthLabel =
    healthFilter === 'all'
      ? 'All Health Scores'
      : healthFilter === 'healthy'
        ? 'Healthy (75+)'
        : healthFilter === 'at-risk'
          ? 'At risk (50–74)'
          : 'Critical (<50)';

  const cycleNext = <T extends readonly string[]>(arr: T, current: T[number]) =>
    arr[(arr.indexOf(current) + 1) % arr.length] as T[number];

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col">
      {/* Summary Bar */}
      <div className="border-b border-white/5 bg-[#0d0e1a]/50 px-4 py-4 backdrop-blur-xl sm:px-6 sm:py-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          <div>
            <div className="text-sm text-white/60 mb-2 flex items-center gap-2">
              <DollarSign size={16} />
              Total Pipeline Value
            </div>
            <div className="text-xl sm:text-2xl">${filteredDeals.length ? (totalValue / 1000000).toFixed(2) : '0.00'}M</div>
          </div>
          <div>
            <div className="text-sm text-white/60 mb-2 flex items-center gap-2">
              <TrendingUp size={16} />
              Average Health Score
            </div>
            <div className="text-xl text-emerald-400 sm:text-2xl">{filteredDeals.length ? `${avgHealth}%` : '—'}</div>
          </div>
          <div>
            <div className="text-sm text-white/60 mb-2 flex items-center gap-2">
              <AlertTriangle size={16} />
              Deals at Risk
            </div>
            <div className="text-xl text-red-400 sm:text-2xl">{atRiskDeals}</div>
          </div>
          <div>
            <div className="text-sm text-white/60 mb-2 flex items-center gap-2">
              <DollarSign size={16} />
              Revenue at Risk
            </div>
            <div className="text-xl text-red-400 sm:text-2xl">${(atRiskRevenue / 1000).toFixed(0)}K</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="border-b border-white/5 bg-[#0d0e1a]/30 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Filter className="h-[18px] w-[18px] shrink-0 text-white/40" aria-hidden />
          <button
            type="button"
            onClick={() => setStageFilter((f) => cycleNext(stageCycle, f))}
            className={`min-h-11 touch-manipulation rounded-lg border px-3 py-2 text-sm transition-colors active:opacity-90 sm:py-1.5 ${
              stageFilter === 'all'
                ? 'bg-white/10 border-white/20'
                : 'bg-[#3b82f6]/20 border-[#3b82f6]/40 text-[#93c5fd]'
            }`}
          >
            {stageLabel}
          </button>
          <button
            type="button"
            onClick={() => setRepFilter((f) => cycleNext(repCycle, f))}
            className={`min-h-11 touch-manipulation rounded-lg border px-3 py-2 text-sm transition-colors active:opacity-90 sm:py-1.5 ${
              repFilter === 'all'
                ? 'bg-white/5 hover:bg-white/10 border-white/10'
                : 'bg-[#3b82f6]/20 border-[#3b82f6]/40 text-[#93c5fd]'
            }`}
          >
            {repLabel}
          </button>
          <button
            type="button"
            onClick={() => setHealthFilter((f) => cycleNext(healthCycle, f))}
            className={`min-h-11 touch-manipulation rounded-lg border px-3 py-2 text-sm transition-colors active:opacity-90 sm:py-1.5 ${
              healthFilter === 'all'
                ? 'bg-white/5 hover:bg-white/10 border-white/10'
                : 'bg-[#3b82f6]/20 border-[#3b82f6]/40 text-[#93c5fd]'
            }`}
          >
            {healthLabel}
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden overscroll-x-contain touch-pan-x">
        <div className="flex h-full min-w-min gap-3 p-4 sm:gap-4 sm:p-6">
          {stages.map((stage, stageIndex) => {
            const stageDeals = filteredDeals.filter((d) => d.stage === stage.id);

            return (
              <div
                key={stage.id}
                className="flex w-[min(85vw,20rem)] shrink-0 flex-col sm:w-80"
              >
                {/* Stage Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium">{stage.name}</h3>
                    <span className="text-sm text-white/60">{stageDeals.length}</span>
                  </div>
                  <div className="text-sm text-white/60">
                    ${(stageDeals.reduce((sum, d) => sum + d.value, 0) / 1000).toFixed(0)}K
                  </div>
                </div>

                {/* Deal Cards */}
                <div className="belon-scroll flex-1 space-y-3 overflow-y-auto">
                  {stageDeals.map((deal, index) => (
                    <div
                      role="button"
                      tabIndex={0}
                      key={deal.id}
                      className={`belon-enter-up group cursor-pointer rounded-xl border bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/[0.07] touch-manipulation active:bg-white/10 ${
                        deal.risk === 'critical'
                          ? 'border-red-500/30'
                          : deal.risk === 'high'
                            ? 'border-amber-500/30'
                            : 'border-white/10 hover:border-white/20'
                      }`}
                      style={{ animationDelay: `${stageIndex * 40 + index * 25}ms` }}
                      onClick={() =>
                        toast.message(deal.company, {
                          description: `$${(deal.value / 1000).toFixed(0)}K · Health ${deal.health}% · ${deal.rep}`,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toast.message(deal.company, {
                            description: `$${(deal.value / 1000).toFixed(0)}K · Health ${deal.health}% · ${deal.rep}`,
                          });
                        }
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-1">
                            <Building2 size={16} className="text-white/40 mt-0.5 flex-shrink-0" />
                            <h4 className="break-words text-sm font-medium leading-snug">{deal.company}</h4>
                          </div>
                          <div className="text-lg mb-1">
                            ${(deal.value / 1000).toFixed(0)}K
                          </div>
                        </div>
                        <CircularProgress value={deal.health} />
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-white/60">
                          <Clock size={12} />
                          <span>{deal.daysInStage}d in stage</span>
                        </div>
                        {deal.risk && (
                          <div
                            className={`px-2 py-0.5 rounded-full ${
                              deal.risk === 'critical'
                                ? 'bg-red-500/10 text-red-400'
                                : 'bg-amber-500/10 text-amber-400'
                            }`}
                          >
                            {deal.risk}
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/5 text-xs text-white/60">
                        {deal.rep}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
