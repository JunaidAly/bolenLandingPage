import { toast } from 'sonner';
import { TrendingDown, Users, Clock, Target, AlertCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip } from 'recharts';

const insights = [
  {
    id: 1,
    icon: TrendingDown,
    iconColor: 'red',
    title: 'Deal velocity dropped 23% this week',
    description: 'Average time in Discovery stage increased from 8 to 12 days',
    impact: 'High',
  },
  {
    id: 2,
    icon: Users,
    iconColor: 'amber',
    title: '3 reps haven\'t logged activity in 5 days',
    description: 'Mike Chen, David Park, Emily Rodriguez - total pipeline: $840K',
    impact: 'Medium',
  },
  {
    id: 3,
    icon: TrendingUp,
    iconColor: 'green',
    title: 'TechFlow Inc showing strong buying signals',
    description: 'Pricing page visited 8 times. 2 new stakeholders engaged.',
    impact: 'High',
  },
  {
    id: 4,
    icon: Target,
    iconColor: 'blue',
    title: 'Sarah Johnson 94% to quota',
    description: 'On track to exceed quarterly target by $120K',
    impact: 'Low',
  },
  {
    id: 5,
    icon: Clock,
    iconColor: 'violet',
    title: 'Average response time increased to 18 hours',
    description: 'Up from 12 hours last week. Affecting conversion rates.',
    impact: 'Medium',
  },
  {
    id: 6,
    icon: AlertCircle,
    iconColor: 'red',
    title: '4 high-value deals expire this month',
    description: 'Combined value: $680K. No recent engagement detected.',
    impact: 'Critical',
  },
];

const pipelineFunnelData = [
  { stage: 'Discovery', count: 48, value: 2400 },
  { stage: 'Qualification', count: 32, value: 1920 },
  { stage: 'Proposal', count: 18, value: 1260 },
  { stage: 'Negotiation', count: 12, value: 960 },
  { stage: 'Closed Won', count: 8, value: 640 },
];

const healthDistributionData = [
  { name: 'Healthy (75-100)', value: 42, color: '#10b981' },
  { name: 'At Risk (50-74)', value: 28, color: '#f59e0b' },
  { name: 'Critical (0-49)', value: 12, color: '#ef4444' },
];

const revenueForecastData = [
  { month: 'Jan', actual: 420, forecast: 410 },
  { month: 'Feb', actual: 380, forecast: 400 },
  { month: 'Mar', actual: 520, forecast: 480 },
  { month: 'Apr', actual: null, forecast: 560 },
  { month: 'May', actual: null, forecast: 580 },
  { month: 'Jun', actual: null, forecast: 620 },
];

/** Recharts defaults to ~400ms; keep charts snappy. */
const CHART_MS = 90;
const chartMotion = {
  isAnimationActive: true,
  animationDuration: CHART_MS,
  animationBegin: 0,
  animationEasing: 'ease-out' as const,
};

export function Reports() {
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col lg:flex-row">
      {/* Left Panel - AI Insights Feed */}
      <div className="belon-scroll w-full shrink-0 overflow-y-auto border-b border-white/5 p-4 sm:p-6 lg:max-w-[min(100%,30rem)] lg:border-b-0 lg:border-r">
        <div className="mb-6">
          <h2 className="mb-1 text-[clamp(1.125rem,3vw,1.25rem)] font-medium">AI Insights</h2>
          <p className="text-sm leading-relaxed text-white/60">Real-time intelligence from your pipeline</p>
        </div>

        <div className="space-y-3">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            const iconColors: Record<string, { bg: string; text: string }> = {
              red: { bg: 'bg-red-500/10', text: 'text-red-400' },
              amber: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
              green: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
              blue: { bg: 'bg-[#3b82f6]/10', text: 'text-[#3b82f6]' },
              violet: { bg: 'bg-[#7c3aed]/10', text: 'text-[#7c3aed]' },
            };
            const colors = iconColors[insight.iconColor];

            return (
              <div
                role="button"
                tabIndex={0}
                key={insight.id}
                style={{ animationDelay: `${index * 18}ms` }}
                className="belon-enter-x-fast group min-h-[3.25rem] cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.07] touch-manipulation active:bg-white/10"
                onClick={() =>
                  toast.message(insight.title, {
                    description: `${insight.description} · Impact: ${insight.impact}`,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toast.message(insight.title, {
                      description: `${insight.description} · Impact: ${insight.impact}`,
                    });
                  }
                }}
              >
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-medium pr-2">{insight.title}</h4>
                      <div
                        className={`px-2 py-0.5 rounded-full text-xs flex-shrink-0 ${
                          insight.impact === 'Critical' || insight.impact === 'High'
                            ? 'bg-red-500/10 text-red-400'
                            : insight.impact === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {insight.impact}
                      </div>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel - Charts */}
      <div className="belon-scroll min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
          {/* Pipeline Funnel */}
          <div className="belon-enter-up-fast rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-6">
            <h3 className="mb-4 text-[clamp(1rem,2.5vw,1.125rem)] font-medium sm:mb-6">Pipeline Funnel</h3>
            <div className="h-[220px] w-full min-w-0 sm:h-[280px] lg:h-[300px]">
            <ResponsiveContainer width="100%" height="100%" debounce={50}>
              <BarChart data={pipelineFunnelData} layout="horizontal" margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <XAxis
                  dataKey="stage"
                  stroke="rgba(255,255,255,0.2)"
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.2)"
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d0e1a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  {...chartMotion}
                />
              </BarChart>
            </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Deal Health Distribution */}
            <div className="belon-enter-up-fast rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-6">
              <h3 className="mb-4 text-[clamp(1rem,2.5vw,1.125rem)] font-medium sm:mb-6">Deal Health Distribution</h3>
              <div className="h-[200px] w-full min-w-0 sm:h-[220px]">
              <ResponsiveContainer width="100%" height="100%" debounce={50}>
                <PieChart>
                  <Pie
                    data={healthDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    {...chartMotion}
                  >
                    {healthDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0d0e1a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {healthDistributionData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-white/80">{item.name}</span>
                    </div>
                    <span className="text-white/60">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Forecast */}
            <div className="belon-enter-up-fast rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-6">
              <h3 className="mb-4 text-[clamp(1rem,2.5vw,1.125rem)] font-medium sm:mb-6">Revenue Forecast</h3>
              <div className="h-[200px] w-full min-w-0 sm:h-[220px]">
              <ResponsiveContainer width="100%" height="100%" debounce={50}>
                <LineChart data={revenueForecastData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <XAxis
                    dataKey="month"
                    stroke="rgba(255,255,255,0.2)"
                    tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.2)"
                    tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0d0e1a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                    {...chartMotion}
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#7c3aed', r: 4 }}
                    {...chartMotion}
                  />
                </LineChart>
              </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-white/80">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-[#7c3aed]" style={{ width: 12 }} />
                  <span className="text-white/80">Forecast</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
