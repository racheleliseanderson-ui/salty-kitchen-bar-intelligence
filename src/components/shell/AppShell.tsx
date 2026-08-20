import { useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { UserButton } from "@/lib/auth/gates";
import { cn } from "@/lib/utils";
import { rehydrateInventory } from "@/lib/kbi/store";
import { DisplayControls } from "@/components/kbi/DisplayControls";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/vision", label: "Vision" },
  { to: "/pairing", label: "Pairing" },
  { to: "/inventory", label: "Inventory" },
  { to: "/match", label: "Match" },
  { to: "/handoff", label: "Handoff" },
  { to: "/teardown", label: "Field" },
] as const;

const SUITE = [
  { href: "https://salty.saltnotes.blog/", label: "Desk", short: "Desk", id: "desk" },
  { href: "https://kitchen.saltnotes.blog/", label: "Kitchen & Bar", short: "Kitchen", id: "kitchen" },
  {
    href: "https://occasion.saltnotes.blog/architecture",
    label: "Menu Builder",
    short: "Menu",
    id: "menu",
  },
  { href: "https://occasion.saltnotes.blog/", label: "Occasion OS", short: "Occasion", id: "occasion" },
  {
    href: "https://deepdish.saltnotes.blog/",
    label: "Restaurant Intelligence",
    short: "RI",
    id: "ri",
  },
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

function SuiteRibbon() {
  return (
    <div className="border-t border-border/50 bg-salt/80">
      <div className="app-shell flex min-w-0 items-center gap-1 overflow-x-auto py-1.5">
        <span className="label-mono mr-2 hidden shrink-0 text-brass sm:inline">Suite</span>
        {SUITE.map((item) => {
          const active = item.id === "kitchen";
          return (
            <a
              key={item.id}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "tap inline-flex shrink-0 items-center rounded-sm bg-brass/15 px-2.5 text-[0.72rem] tracking-wide text-brass"
                  : "tap inline-flex shrink-0 items-center rounded-sm px-2.5 text-[0.72rem] tracking-wide text-muted-foreground hover:text-bone"
              }
            >
              {item.short}
            </a>
          );
        })}
      </div>
    </div>
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
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname === item.to || pathname.startsWith(`${item.to}/`);
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
        <SuiteRibbon />
      </header>
      <main className="min-w-0 flex-1">{children}</main>
      <footer className="border-t border-border/70 bg-ink-deep">
        <div className="app-shell grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="min-w-0">
            <p className="label-mono text-brass">Trust boundary</p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Planning tool, not a safety system. Scan suggestions stay suggestions until you confirm.
              Pairing is a curated molecular + co-occurrence model, not a lab assay.
              No allergen, nutrition, or pricing claims. Inventory stays on this device unless you
              sign in and save.
            </p>
            <p className="label-mono mt-6">Layer 0.1.0 · Packet 1.0</p>
          </div>
          <div className="min-w-0">
            <p className="label-mono">Suite</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {SUITE.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    aria-current={s.id === "kitchen" ? "page" : undefined}
                    className="gold-underline break-words hover:text-brass"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <p className="label-mono">Constraints</p>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>Confirm before commit</li>
              <li>No allergen safety guarantees</li>
              <li>Packet 1.0 is opt-in</li>
              <li>Education only · Vanity or Vice</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
