import { useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { UserButton } from "@/lib/auth/gates";
import { cn } from "@/lib/utils";
import { rehydrateInventory } from "@/lib/kbi/store";
import { DisplayControls } from "@/components/kbi/DisplayControls";
import { LabsFooter } from "@/components/shell/LabsFooter";

const NAV = [
  { to: "/vision", label: "Vision" },
  { to: "/pairing", label: "Pairing" },
  { to: "/inventory", label: "Inventory" },
  { to: "/match", label: "Match" },
  { to: "/handoff", label: "Handoff" },
  { to: "/teardown", label: "Field" },
] as const;

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="h-9 w-20 shrink-0 animate-pulse rounded-sm bg-surface-raised" />;
  }
  if (user) return <UserButton />;
  return (
    <Link
      to="/login"
      className="tap inline-flex shrink-0 items-center rounded-sm border border-brass/40 px-3 text-sm text-brass transition-colors hover:bg-brass hover:text-primary-foreground"
    >
      Sign in
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    rehydrateInventory();
  }, []);

  return (
    <div className="flex min-h-[calc(100dvh-var(--grok-banner-h,0px))] min-w-0 flex-col overflow-x-clip bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-ink-deep/92 backdrop-blur-xl">
        <div className="app-shell flex min-w-0 items-center gap-3 py-3">
          <a
            href="https://northernlanternhouse.com"
            target="_blank"
            rel="noopener"
            className="label-mono hidden shrink-0 uppercase tracking-[0.18em] md:inline"
            style={{ color: "var(--color-house-gold-ink)" }}
          >
            Northern Lantern House Labs
          </a>
          <span aria-hidden="true" className="hidden shrink-0 text-border md:inline">
            |
          </span>
          <Link to="/" className="group flex min-w-0 items-baseline gap-3">
            <span className="font-display text-xl leading-none text-bone">Kitchen & Bar</span>
            <span className="label-mono hidden truncate lg:inline">Salty & Clever</span>
          </Link>
          <div className="ml-auto flex min-w-0 shrink-0 items-center gap-1 sm:gap-2">
            <DisplayControls />
            <AuthSlot />
          </div>
        </div>
        <nav
          aria-label="Primary"
          className="flex gap-1 overflow-x-auto border-t border-border/60 px-3 py-1"
        >
          {NAV.map((item) => {
            const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "tap inline-flex shrink-0 items-center rounded-sm px-3 text-sm tracking-wide",
                  active
                    ? "text-brass"
                    : "text-muted-foreground hover:text-bone",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="min-w-0 flex-1">{children}</main>
      <LabsFooter />
    </div>
  );
}
