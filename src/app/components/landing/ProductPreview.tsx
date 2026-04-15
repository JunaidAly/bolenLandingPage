import { ArrowRight, GitBranch, MessageSquare, Sparkles, TrendingUp, Zap } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

function BrowserChrome({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-white/[0.08] bg-[#0a0a12] px-3 py-2">
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
      </div>
      <div className="min-w-0 flex-1 truncate rounded-md border border-white/[0.06] bg-[#05050a] px-2 py-1 text-center text-[10px] text-[#64748b]">
        {url}
      </div>
    </div>
  );
}

function PreviewShell({
  url,
  label,
  children,
}: {
  url: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <figure className="belon-card group m-0 overflow-hidden p-0 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85)]">
      <figcaption className="sr-only">{label}</figcaption>
      <BrowserChrome url={url} />
      <div className="relative bg-[#08090f]">{children}</div>
    </figure>
  );
}

export function ProductPreview() {
  return (
    <section className="belon-section border-t border-white/[0.06] bg-[#05050a]" id="product-preview" aria-labelledby="product-preview-heading">
      <div className="belon-container">
        <div className="mb-12 max-w-2xl lg:mb-16">
          <h2 id="product-preview-heading" className="mb-3 text-3xl font-bold tracking-tight text-white lg:text-[48px] lg:leading-tight">
            See the product
          </h2>
          <p className="text-lg leading-relaxed text-[#94a3b8]">
            Real workspace UI—agent feed, pipeline intelligence, and workflows—so you know exactly what you&apos;re signing up for. Open the live app to click through.
          </p>
          <Link
            to="/app"
            className="belon-btn belon-cta-primary mt-6 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
          >
            Open interactive workspace
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">
          <PreviewShell url="belon.app/app" label="Belon agent feed preview">
            <div className="flex min-h-[240px]">
              <div className="flex w-9 shrink-0 flex-col items-center border-r border-white/[0.06] bg-[#0d0e1a] py-3">
                <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#7c3aed]">
                  <Zap className="h-4 w-4 text-white" strokeWidth={2.5} aria-hidden />
                </div>
                <Sparkles className="mb-2 h-4 w-4 text-[#3b82f6]" strokeWidth={2} aria-hidden />
                <GitBranch className="mb-2 h-4 w-4 text-white/25" strokeWidth={2} aria-hidden />
                <TrendingUp className="mb-2 h-4 w-4 text-white/25" strokeWidth={2} aria-hidden />
                <MessageSquare className="h-4 w-4 text-white/25" strokeWidth={2} aria-hidden />
              </div>
              <div className="min-w-0 flex-1 p-3">
                <div className="mb-2 flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-[10px] font-medium text-white/80">Belon</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                </div>
                <p className="mb-3 text-[11px] leading-snug text-white/90">
                  Good morning, Sarah.
                </p>
                <div className="mb-2 grid grid-cols-2 gap-1.5">
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.04] p-2">
                    <div className="text-[8px] text-[#64748b]">Pipeline Health</div>
                    <div className="text-sm font-semibold text-white">72%</div>
                  </div>
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.04] p-2">
                    <div className="text-[8px] text-[#64748b]">At Risk</div>
                    <div className="text-sm font-semibold text-red-400">$1.2M</div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-2">
                    <div className="text-[9px] font-medium leading-tight text-white/90">TechFlow Inc deal stalled</div>
                    <div className="mt-0.5 text-[8px] text-[#94a3b8]">14 days · $125K</div>
                  </div>
                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2">
                    <div className="text-[9px] font-medium leading-tight text-white/90">3 deals missing next steps</div>
                    <div className="mt-0.5 text-[8px] text-[#94a3b8]">$380K combined</div>
                  </div>
                </div>
              </div>
            </div>
          </PreviewShell>

          <PreviewShell url="belon.app/app/pipeline" label="Belon pipeline preview">
            <div className="min-h-[240px] p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-white">Pipeline</span>
                <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[8px] text-[#94a3b8]">Filter</span>
              </div>
              <div className="mb-2 grid grid-cols-4 gap-1 text-[7px] font-medium uppercase tracking-wider text-[#64748b]">
                <span>Company</span>
                <span className="text-right">Value</span>
                <span className="text-center">Health</span>
                <span className="text-right">Stage</span>
              </div>
              <div className="space-y-1">
                {[
                  ['TechFlow Inc', '$125K', '34', 'Disc.'],
                  ['DataSync Corp', '$95K', '45', 'Disc.'],
                  ['GlobalTech', '$340K', '52', 'Qual.'],
                ].map(([co, val, h, st]) => (
                  <div
                    key={co}
                    className="grid grid-cols-4 items-center gap-1 rounded-md border border-white/[0.05] bg-white/[0.02] px-2 py-1.5 text-[9px]"
                  >
                    <span className="truncate font-medium text-white/90">{co}</span>
                    <span className="text-right text-[#94a3b8]">{val}</span>
                    <span className="text-center text-red-400/90">{h}%</span>
                    <span className="text-right text-[#64748b]">{st}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex gap-1">
                {['Discovery', 'Qual.', 'Proposal'].map((s) => (
                  <div
                    key={s}
                    className="flex-1 rounded border border-white/[0.06] bg-[#0d0d1a] py-1.5 text-center text-[8px] text-[#64748b]"
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </PreviewShell>

          <PreviewShell url="belon.app/app/workflows" label="Belon workflows preview">
            <div className="min-h-[240px] p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-white">Workflows</span>
                <span className="text-[8px] text-[#64748b]">+ Add node</span>
              </div>
              <div className="relative mx-auto max-w-[200px] rounded-lg border border-white/[0.06] bg-[#0d0d1a] p-3">
                <div className="mb-2 flex justify-center">
                  <div className="rounded-md border-l-2 border-[#3b82f6] bg-white/[0.04] px-2 py-1.5 text-[8px] font-medium text-white/90">
                    CRM Scan
                  </div>
                </div>
                <div className="mx-auto mb-2 h-4 w-px bg-gradient-to-b from-[#3b82f6]/50 to-[#7c3aed]/50" />
                <div className="mb-2 flex justify-center gap-2">
                  <div className="rounded-md border-l-2 border-[#7c3aed] bg-white/[0.04] px-2 py-1.5 text-[8px] text-white/90">
                    Decrypt
                  </div>
                  <div className="rounded-md border-l-2 border-[#22d3ee] bg-white/[0.04] px-2 py-1.5 text-[8px] text-white/90">
                    Score
                  </div>
                </div>
                <div className="mx-auto mb-2 h-4 w-px bg-gradient-to-b from-[#7c3aed]/50 to-[#22c55e]/50" />
                <div className="flex justify-center gap-2">
                  <div className="rounded-md border-l-2 border-[#22c55e] bg-white/[0.04] px-2 py-1.5 text-[8px] text-white/90">
                    Execute
                  </div>
                  <div className="rounded-md border-l-2 border-[#f97316] bg-white/[0.04] px-2 py-1.5 text-[8px] text-white/90">
                    Alert
                  </div>
                </div>
              </div>
            </div>
          </PreviewShell>
        </div>
      </div>
    </section>
  );
}
