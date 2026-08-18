import { useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { UserButton } from "@/lib/auth/gates";
import { cn } from "@/lib/utils";
import { rehydrateInventory } from "@/lib/kbi/store";
import { SALT_NOTES_URL } from "@/lib/kbi/types";

const NAV = [
  { to: "/", label: "Report" },
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
    return <div className="h-8 w-20 shrink-0 animate-pulse rounded-md bg-linen" />;
  }
  if (user) return <UserButton />;
  return (
    <Link to="/login" className="btn btn-secondary btn-sm">
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
    <div className="min-h-[calc(100dvh-var(--grok-banner-h,0px))] overflow-x-clip pb-10">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/90 backdrop-blur-md">
        <div className="app-shell flex flex-col gap-2 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="flex min-w-0 items-center gap-3">
              <div
                className="hidden size-9 shrink-0 items-center justify-center rounded-lg bg-heritage text-sm font-bold text-ivory shadow-xs sm:flex"
                aria-hidden
              >
                S
              </div>
              <div className="min-w-0 text-left">
                <p className="eyebrow leading-none">Salty & Clever</p>
                <p className="mt-0.5 truncate text-sm text-muted">
                  Kitchen & Bar
                  <span className="text-muted-soft"> · SC-KBI-001</span>
                </p>
              </div>
            </Link>
            <AuthSlot />
          </div>
          <nav className="flex gap-1 overflow-x-auto pb-0.5" aria-label="Primary">
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
                    "shrink-0 rounded-lg px-3 py-2 text-sm",
                    active ? "bg-surface text-ink" : "text-muted hover:bg-surface hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href={SALT_NOTES_URL}
              className="shrink-0 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface hover:text-ink"
              target="_blank"
              rel="noreferrer"
            >
              Salt Notes
            </a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="app-shell mt-12 border-t border-line pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl space-y-1.5">
            <p className="eyebrow">Trust boundary</p>
            <p className="text-sm leading-relaxed text-muted">
              Educational planning only. Vision scores are demo or user-confirmed.
              Pairing is a curated molecular + co-occurrence model, not a lab assay.
              No allergen safety, nutrition, or pricing claims. Local-first unless you
              sign in and save a household.
            </p>
          </div>
          <p className="text-xs text-muted-soft">
            Layer 0.1.0 · Packet 1.0 · Menu Builder contract 1.1.0
          </p>
        </div>
      </footer>
    </div>
  );
}
