import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { IngredientPicker } from "@/components/kbi/IngredientPicker";
import { PageHeader } from "@/components/kbi/PageHeader";
import figBar from "@/assets/fig-bar.jpg";
import { METHOD_NOTES, PAIRING_SOURCES } from "@/lib/kbi/report";
import {
  PROFILES,
  DATA_VERSION,
  LAST_REVIEWED,
  SYNERGY,
  COMPOUND_NOTES,
  FEATURED_BRIDGES,
  UNEXPECTED_BRIDGES,
  bestPairsFor,
  pairScore,
  rankInventoryPairs,
  explainPair,
} from "@/lib/kbi/flavors";
import { useInventory } from "@/lib/kbi/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pairing")({ component: PairingPage });

type Mode = "explorer" | "inventory" | "bridges" | "unexpected";

function PairingPage() {
  const [mode, setMode] = useState<Mode>("explorer");
  const [a, setA] = useState("bourbon");
  const [b, setB] = useState("sweet vermouth");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const items = useInventory((s) => s.items);

  const score = useMemo(() => pairScore(a, b), [a, b]);
  const neighbors = useMemo(
    () => bestPairsFor(a, 8, categoryFilter || undefined),
    [a, categoryFilter],
  );
  const inventoryRanks = useMemo(() => {
    const names = items.map((i) => i.normalizedName);
    return rankInventoryPairs(a, names, 10);
  }, [a, items]);
  const narrative = useMemo(() => explainPair(score), [score]);

  const categories = useMemo(() => {
    return [...new Set(PROFILES.map((p) => p.category))].sort();
  }, []);

  function pickBridge(fa: string, fb: string) {
    setA(fa);
    setB(fb);
    setMode("explorer");
  }

  return (
    <div className="app-shell space-y-8 py-8">
      <PageHeader
        kicker="02 · Pairing"
        title="Molecular overlap plus what cooks actually pair."
        lede="Search an ingredient, inspect the chemistry, and rank it against what you already own. Classic bridges, unexpected chemistry, and the same scores Match uses."
        image={figBar}
        imageAlt="Iced citrus cocktail on a dark bar counter with bottles behind"
      />

      <div className="panel-inset flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm text-stone-deep">
        <span>
          <span className="font-semibold text-navy-700">Data version</span> {DATA_VERSION}
        </span>
        <span className="text-muted">·</span>
        <span>
          <span className="font-semibold text-navy-700">Last reviewed</span> {LAST_REVIEWED}
        </span>
        <span className="text-muted">·</span>
        <span>Curated library — not a live or licensed FlavorDB / FooDB extract.</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PAIRING_SOURCES.map((s) => (
          <article key={s.name} className="panel-surface p-4">
            <h2 className="font-display text-xl">{s.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-deep">{s.detail}</p>
          </article>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["explorer", "Explorer"],
            ["inventory", "Against inventory"],
            ["bridges", "Featured bridges"],
            ["unexpected", "Unexpected bridges"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={cn("btn btn-sm", mode === id ? "btn-primary" : "btn-ghost")}
            onClick={() => setMode(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "bridges" && (
        <section className="panel-surface p-5 sm:p-6">
          <p className="section-label">Featured bridges</p>
          <h2 className="mt-1 font-display text-2xl">Classics and food–bar paths</h2>
          <p className="mt-2 text-sm text-stone-deep">
            Hand-picked classics and food–bar bridges. Tap any card to load it in the explorer.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {FEATURED_BRIDGES.map((br) => (
              <button
                key={`${br.a}-${br.b}`}
                type="button"
                className="panel-inset p-4 text-left transition hover:border-heritage hover:bg-navy-100/40"
                onClick={() => pickBridge(br.a, br.b)}
              >
                <p className="font-display text-lg">
                  {br.a} <span className="text-muted">×</span> {br.b}
                </p>
                <p className="mt-1 text-sm text-stone-deep">{br.hook}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {mode === "unexpected" && (
        <section className="panel-surface p-5 sm:p-6">
          <p className="section-label">Unexpected bridges</p>
          <h2 className="mt-1 font-display text-2xl">Rare chemistry, thin recipe habit</h2>
          <p className="mt-2 text-sm text-stone-deep">
            High IDF molecular overlap with co-occurrence still below 0.40. Ranked by the gap between
            chemistry and habit, then by rarity of shared volatiles. These sit on the edge of normal —
            plausible on the palate, under-used in the corpus. Tap any card to inspect.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {UNEXPECTED_BRIDGES.map((br) => (
              <button
                key={`${br.a}-${br.b}`}
                type="button"
                className="panel-inset p-4 text-left transition hover:border-heritage hover:bg-navy-100/40"
                onClick={() => pickBridge(br.a, br.b)}
              >
                <p className="font-display text-lg">
                  {br.displayA} <span className="text-muted">×</span> {br.displayB}
                </p>
                <p className="mt-1 text-sm text-stone-deep">
                  Shared {br.shared.slice(0, 4).join(", ") || "volatiles"}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="badge badge-rising tabular">mol {br.molecular.toFixed(2)}</span>
                  <span className="badge badge-neutral tabular">co {br.cooccurrence.toFixed(2)}</span>
                  <span className="badge tabular">gap {br.gap.toFixed(2)}</span>
                  <span className="badge tabular" title="Sum of IDF of shared compounds">
                    rarity {br.sharedRarity.toFixed(1)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {mode === "explorer" && (
        <section className="panel-surface space-y-6 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="section-label">Ingredient A</label>
              <IngredientPicker value={a} onChange={setA} />
            </div>
            <div>
              <label className="section-label">Ingredient B</label>
              <IngredientPicker value={b} onChange={setB} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <ScoreMeter label="IDF molecular" value={score.molecular} />
            <ScoreMeter label="Recipe co-occurrence" value={score.cooccurrence} />
            <ScoreMeter label="Composite" value={score.composite} accent />
          </div>
          <p className="text-sm text-stone-deep">{narrative}</p>
          <p className="text-xs text-muted">
            Synergy +{SYNERGY.bonus} when IDF molecular {" > "} {SYNERGY.molecularMin} and Recipe
            co-occurrence {" > "} {SYNERGY.coMin}.
          </p>
          {score.shared.length > 0 && (
            <div>
              <p className="section-label">Shared volatiles</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {score.shared.map((c) => (
                  <li key={c} className="badge badge-neutral">
                    {c}
                    {COMPOUND_NOTES[c] ? ` — ${COMPOUND_NOTES[c]}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <p className="section-label">Neighbors for {a}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <select
                className="input input-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <ul className="mt-3 space-y-2">
              {neighbors.map((s) => (
                <li key={s.b}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-left hover:border-heritage"
                    onClick={() => {
                      setB(s.b);
                      setMode("explorer");
                    }}
                  >
                    <span>{s.displayName}</span>
                    <span className="tabular text-sm text-muted">
                      mol {s.molecular.toFixed(2)} · co {s.cooccurrence.toFixed(2)} · {s.composite.toFixed(2)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {mode === "inventory" && (
        <section className="panel-surface p-5 sm:p-6">
          <p className="section-label">Against inventory</p>
          <h2 className="mt-1 font-display text-2xl">What you already own</h2>
          <p className="mt-2 text-sm text-stone-deep">
            Ranked by the same hybrid score used in the explorer. Tap a row to open the full pair view.
          </p>
          <div className="mt-4">
            <IngredientPicker value={a} onChange={setA} />
          </div>
          {inventoryRanks.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Add items on the inventory surface first.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {inventoryRanks.map((s) => (
                <li key={s.b}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-left hover:border-heritage"
                    onClick={() => {
                      setB(s.b);
                      setMode("explorer");
                    }}
                  >
                    <span>{s.displayName}</span>
                    <span className="tabular text-sm text-muted">
                      {s.composite.toFixed(2)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section className="panel-surface p-5 sm:p-6">
        <h2 className="font-display text-2xl">Method</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-stone-deep">
          {METHOD_NOTES.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted">
          Educational planning only. No allergen, nutrition, or pricing claims.
        </p>
      </section>
    </div>
  );
}

function ScoreMeter({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="metric">
      <span className="metric-value">{value.toFixed(2)}</span>
      <span className="metric-label">{label}</span>
      <div className="capacity-track mt-3 h-1.5 overflow-hidden rounded-full bg-linen">
        <div
          className={cn("h-full rounded-full", accent ? "bg-heritage" : "bg-navy-500")}
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </div>
    </div>
  );
}
