import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/kbi/PageHeader";
import { rankRecipes, smartBuys } from "@/lib/kbi/match";
import { useInventory } from "@/lib/kbi/store";
import type { MatchHit } from "@/lib/kbi/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/match")({ component: MatchPage });

function MatchPage() {
  const items = useInventory((s) => s.items);
  const hydrated = useInventory((s) => s.hydrated);
  const [kind, setKind] = useState<"all" | "food" | "cocktail">("all");
  const hits = useMemo(() => rankRecipes(items, { kind }), [items, kind]);
  const buys = useMemo(() => smartBuys(items), [items]);
  const now = hits.filter((h) => h.tier === "now");
  const almost = hits.filter((h) => h.tier === "almost");

  return (
    <div className="app-shell space-y-8 py-8">
      <PageHeader
        kicker="03 · Match"
        title="What you can make now, almost, and with one bottle."
        lede="Ranking is match percentage × expiry urgency × flavor harmony, with spirit and produce hierarchy. Nothing is generated. The corpus is curated."
      />

      <div className="flex flex-wrap gap-2">
        {(["all", "food", "cocktail"] as const).map((k) => (
          <button
            key={k}
            type="button"
            className={cn("chip", kind === k && "is-active")}
            aria-pressed={kind === k}
            onClick={() => setKind(k)}
          >
            {k === "all" ? "Food + bar" : k}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="metric">
          <span className="metric-value">{hydrated ? now.length : "—"}</span>
          <span className="metric-label">Can make now</span>
        </div>
        <div className="metric">
          <span className="metric-value">{hydrated ? almost.length : "—"}</span>
          <span className="metric-label">Almost (1–2 missing)</span>
        </div>
        <div className="metric">
          <span className="metric-value">{hydrated ? items.length : "—"}</span>
          <span className="metric-label">Inventory items</span>
        </div>
      </div>

      <section>
        <p className="section-label">Can make now</p>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {now.map((hit) => (
            <HitCard key={hit.recipe.id} hit={hit} />
          ))}
        </div>
      </section>

      <section>
        <p className="section-label">Almost</p>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {almost.map((hit) => (
            <HitCard key={hit.recipe.id} hit={hit} />
          ))}
        </div>
      </section>

      <section className="panel-surface p-5">
        <p className="section-label">Smart Buy</p>
        <h2 className="mt-1 font-display text-2xl">One addition, most new options</h2>
        <ul className="mt-4 space-y-3">
          {buys.map((buy) => (
            <li key={buy.ingredient} className="panel-inset p-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-semibold capitalize">{buy.ingredient}</p>
                <span className="badge badge-comfortable">{buy.unlocks.length} unlocks</span>
              </div>
              <p className="mt-2 text-sm text-stone-deep">{buy.unlocks.join(" · ")}</p>
            </li>
          ))}
        </ul>
      </section>

      <Link to="/handoff" className="btn btn-primary">
        Send availability to Menu Builder
      </Link>
    </div>
  );
}

function HitCard({ hit }: { hit: MatchHit }) {
  return (
    <article className="panel-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="section-label">{hit.recipe.kind}</p>
          <h3 className="mt-1 font-display text-xl">{hit.recipe.name}</h3>
        </div>
        <span className="badge badge-comfortable tabular">{Math.round(hit.matchPct * 100)}%</span>
      </div>
      <p className="mt-2 text-sm text-stone-deep">{hit.recipe.notes}</p>
      <p className="mt-2 text-xs text-muted">
        {hit.recipe.minutes} min · {hit.recipe.skill} · flavor {hit.flavorScore.toFixed(2)} · score {hit.composite}
      </p>
      {hit.substituted.length ? (
        <p className="mt-2 text-xs text-gold-700">
          Hierarchy: {hit.substituted.map((s) => `${s.used} for ${s.needed}`).join(", ")}
        </p>
      ) : null}
      {hit.missing.length ? (
        <p className="mt-2 text-xs text-burnished">Missing: {hit.missing.join(", ")}</p>
      ) : null}
    </article>
  );
}
