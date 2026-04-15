import { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle2, Circle, Settings, ExternalLink } from 'lucide-react';

const initialIntegrations = [
  {
    id: 1,
    name: 'HubSpot',
    description: 'Sync contacts, deals, and activities',
    connected: true,
    lastSync: '2 minutes ago',
    logo: '🟠',
  },
  {
    id: 2,
    name: 'Salesforce',
    description: 'Full CRM data synchronization',
    connected: true,
    lastSync: '5 minutes ago',
    logo: '🔵',
  },
  {
    id: 3,
    name: 'Microsoft Dynamics',
    description: 'Enterprise CRM integration',
    connected: false,
    lastSync: null,
    logo: '🔷',
  },
  {
    id: 4,
    name: 'Gmail',
    description: 'Email tracking and logging',
    connected: false,
    lastSync: null,
    logo: '📧',
  },
  {
    id: 5,
    name: 'Slack',
    description: 'Pipeline alerts and notifications',
    connected: false,
    lastSync: null,
    logo: '💬',
  },
  {
    id: 6,
    name: 'Zoom',
    description: 'Meeting scheduling and recordings',
    connected: false,
    lastSync: null,
    logo: '📹',
  },
  {
    id: 7,
    name: 'LinkedIn Sales Navigator',
    description: 'Prospect research and enrichment',
    connected: false,
    lastSync: null,
    logo: '💼',
  },
];

export function Integrations() {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const connectedCount = integrations.filter((i) => i.connected).length;
  const totalCount = integrations.length;

  const setConnected = (id: number, name: string, connected: boolean) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, connected, lastSync: connected ? 'Just now' : null } : i
      )
    );
    toast.success(connected ? 'Connected' : 'Disconnected', { description: name });
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl px-4 py-6 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="belon-enter-up mb-6 sm:mb-8" style={{ animationDelay: '0ms' }}>
        <h1 className="mb-2 text-[clamp(1.375rem,4vw,1.875rem)] font-medium leading-snug">Integrations</h1>
        <p className="leading-relaxed text-white/60">
          {totalCount} integrations available, <span className="text-emerald-400">{connectedCount} connected</span>
        </p>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        {integrations.map((integration, index) => (
          <div
            key={integration.id}
            style={{ animationDelay: `${60 + index * 50}ms` }}
            className={`belon-enter-up group rounded-2xl border bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/[0.07] sm:p-6 ${
              integration.connected
                ? 'border-emerald-500/30 hover:border-emerald-500/50'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            {/* Logo and Status */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-3xl">
                {integration.logo}
              </div>
              <div className="flex items-center gap-2">
                {integration.connected ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <CheckCircle2 size={20} className="text-emerald-400" />
                  </>
                ) : (
                  <Circle size={20} className="text-white/20" />
                )}
              </div>
            </div>

            {/* Info */}
            <h3 className="text-lg mb-2">{integration.name}</h3>
            <p className="text-sm text-white/60 mb-4 leading-relaxed">
              {integration.description}
            </p>

            {/* Status */}
            {integration.connected && integration.lastSync && (
              <div className="mb-4 pb-4 border-b border-white/5">
                <div className="text-xs text-white/40">Last synced</div>
                <div className="text-sm text-white/80">{integration.lastSync}</div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {integration.connected ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      toast.message('Configure', {
                        description: `Opening settings for ${integration.name} (demo).`,
                      })
                    }
                    className="flex min-h-11 min-w-0 flex-1 touch-manipulation items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm transition-colors hover:bg-white/15 active:bg-white/20 sm:px-4"
                  >
                    <Settings size={16} />
                    Configure
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      window.open('https://example.com', '_blank', 'noopener,noreferrer')
                    }
                    className="flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition-colors hover:bg-white/10 active:bg-white/15"
                  >
                    <ExternalLink size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConnected(integration.id, integration.name, false)}
                    className="min-h-11 w-full touch-manipulation rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:bg-red-500/20 hover:text-red-300 active:bg-red-500/10"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setConnected(integration.id, integration.name, true)}
                  className="min-h-11 w-full flex-1 touch-manipulation rounded-xl bg-[#3b82f6] px-4 py-2 text-sm transition-colors hover:bg-[#3b82f6]/90 active:bg-[#3b82f6]/80 sm:w-auto"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div
        className="belon-enter-up mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:mt-12 sm:p-8"
        style={{ animationDelay: '200ms' }}
      >
        <h3 className="mb-2 text-[clamp(1rem,2.5vw,1.125rem)] font-medium">About Integrations</h3>
        <p className="mb-6 leading-relaxed text-white/60">
          Connect Belon with your existing tools to create a unified workflow. Data syncs automatically
          in real-time, ensuring your AI agent always has the latest information to make intelligent decisions.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="mb-1 text-xl sm:text-2xl">Real-time Sync</div>
            <div className="text-sm text-white/60">
              All integrations sync data in real-time with no manual intervention required.
            </div>
          </div>
          <div>
            <div className="mb-1 text-xl sm:text-2xl">Secure & Encrypted</div>
            <div className="text-sm text-white/60">
              Enterprise-grade security with end-to-end encryption for all data transfers.
            </div>
          </div>
          <div>
            <div className="mb-1 text-xl sm:text-2xl">Custom Mappings</div>
            <div className="text-sm text-white/60">
              Configure field mappings and sync rules to match your workflow exactly.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
