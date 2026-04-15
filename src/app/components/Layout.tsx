import { Suspense, useEffect, useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router';
import {
  Sparkles,
  GitBranch,
  TrendingUp,
  MessageSquare,
  BarChart3,
  Settings,
  Zap,
  Menu,
  X,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { to: '/app', label: 'Agent Feed', short: 'Feed', icon: Sparkles },
  { to: '/app/workflows', label: 'Workflows', short: 'Flow', icon: GitBranch },
  { to: '/app/pipeline', label: 'Pipeline', short: 'Pipe', icon: TrendingUp },
  { to: '/app/copilot', label: 'Co-Pilot', short: 'AI', icon: MessageSquare },
  { to: '/app/reports', label: 'Reports', short: 'Reports', icon: BarChart3 },
  { to: '/app/integrations', label: 'Integrations', short: 'Apps', icon: Settings },
] as const;

function sidebarLinkClass(isActive: boolean) {
  return `flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl transition-colors touch-manipulation active:opacity-80 md:min-h-12 md:min-w-12 ${
    isActive
      ? 'bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/20'
      : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground md:hover:bg-accent/40'
  }`;
}

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-background text-foreground md:flex-row">
      {/* Desktop / tablet: rail */}
      <aside className="relative z-20 hidden shrink-0 flex-col items-center border-r border-border/40 bg-popover py-4 md:flex md:w-14 md:py-6 lg:w-20">
        <div className="mb-6 lg:mb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#7c3aed] lg:h-11 lg:w-11">
            <Zap className="h-[22px] w-[22px]" strokeWidth={2.5} aria-hidden />
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-2 md:gap-3 lg:gap-4" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              title={item.label}
              className={({ isActive }) => `${sidebarLinkClass(isActive)} group relative`}
            >
              {({ isActive }) => (
                <>
                  <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} aria-hidden />
                  <span className="sr-only">{item.label}</span>
                  <div className="pointer-events-none absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-lg border border-border/40 bg-popover px-3 py-1.5 text-sm opacity-0 transition-opacity lg:group-hover:block lg:group-hover:opacity-100">
                    {item.label}
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile: backdrop */}
      <button
        type="button"
        aria-label="Close menu"
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity md:hidden ${
          mobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile: full-screen slide-in */}
      <div
        id="mobile-slide-menu"
        className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-full flex-col bg-popover shadow-2xl transition-transform duration-200 ease-out sm:max-w-md md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border/40 px-4">
          <span className="text-lg font-medium tracking-tight">Belon</span>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-foreground/80 transition-colors active:bg-accent/40"
            aria-label="Close navigation menu"
          >
            <X className="h-6 w-6" strokeWidth={2} />
          </button>
        </div>
        <nav className="belon-scroll flex flex-1 flex-col gap-1 overflow-y-auto p-4" aria-label="Mobile menu">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex min-h-12 items-center gap-4 rounded-xl px-4 py-3 text-base transition-colors touch-manipulation active:opacity-90 ${
                  isActive ? 'bg-[#3b82f6] text-white' : 'text-foreground/80 hover:bg-accent/40'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="h-6 w-6 shrink-0" strokeWidth={isActive ? 2.5 : 2} aria-hidden />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))] md:pb-0">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/40 bg-background/50 px-4 backdrop-blur-xl sm:px-6 md:h-16 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl text-foreground/90 transition-colors active:bg-accent/40 md:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-slide-menu"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" strokeWidth={2} />
            </button>
            <h1 className="truncate text-[clamp(1rem,4vw,1.25rem)] font-medium tracking-tight">Belon</h1>
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-500 sm:hidden" title="Agent active" />
            <div className="hidden min-w-0 items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 sm:flex sm:px-3">
              <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-500" />
              <span className="truncate text-xs text-emerald-400">Agent Active</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <ThemeToggle />
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#7c3aed] text-sm font-medium">
              SJ
            </div>
          </div>
        </header>

        <main className="belon-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-background overscroll-y-contain">
          <Suspense
            fallback={
              <div
                className="flex h-full min-h-[240px] items-center justify-center text-sm text-muted-foreground"
                role="status"
                aria-live="polite"
              >
                Loading…
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-3 gap-0 border-t border-border/40 bg-popover/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur-xl md:hidden"
        aria-label="Primary"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/app'}
            className={({ isActive }) =>
              `flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 px-1 py-2 text-center transition-colors touch-manipulation active:opacity-80 ${
                isActive ? 'text-[#3b82f6]' : 'text-muted-foreground'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="h-5 w-5 shrink-0" strokeWidth={isActive ? 2.5 : 2} aria-hidden />
                <span className="max-w-full truncate text-[0.65rem] leading-tight sm:text-[0.7rem]">{item.short}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
