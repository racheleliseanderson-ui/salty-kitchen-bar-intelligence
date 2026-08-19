import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/kbi/PageHeader";
import { METHOD_NOTES, PAIRING_SOURCES } from "@/lib/kbi/report";
import {
  PROFILES,
  DATA_VERSION,
  LAST_REVIEWED,
  SYNERGY,
  COMPOUND_NOTES,
  FEATURED_BRIDGES,
  bestPairsFor,
  pairScore,
  rankInventoryPairs,
  explainPair,
} from "@/lib/kbi/flavors";
import { useInventory } from "@/lib/kbi/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pairing")({ component: PairingPage });

type Mode = "explorer" | "inventory" | "bridges";

function PairingPage() {
  const [mode, setMode] = useState<Mode>("explorer");
  const [a, setA] = useState("bourbon");
  const [b, setB] = useState("sweet vermouth");
  const [filterA, setFilterA] = useState("");
  const [filterB, setFilterB] = useState("");
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
  const pa = PROFILES.find((p) => p.name === a);
  const pb = PROFILES.find((p) => p.name === b);
  const narrative = useMemo(() => explainPair(score), [score]);

  const filteredA = useMemo(() => {
    const q = filterA.trim().toLowerCase();
    if (!q) return PROFILES;
    return PROFILES.filter(
      (p) =>
        p.displayName.toLowerCase().includes(q) ||
        p.name.includes(q) ||
        p.category.includes(q),
    );
  }, [filterA]);

  const filteredB = useMemo(() => {
    const q = filterB.trim().toLowerCase();
    if (!q) return PROFILES;
    return PROFILES.filter(
      (p) =>
        p.displayName.toLowerCase().includes(q) ||
        p.name.includes(q) ||
        p.category.includes(q),
    );
  }, [filterB]);

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
        kicker="02 · Pairing data"
        title="A hybrid molecular + co-occurrence engine can be bootstrapped now."
        lede="Curated profiles stand in for FlavorDB / FooDB vectors. The formula is fixed: Jaccard on volatiles, blended with recipe co-occurrence, plus a synergy bonus only when both sides are already elevated. Explore pairs, rank against your inventory, or jump into high-signal bridges."
      />

      <div className="panel-inset flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm text-stone-deep">
        <span>
          <span className="font-semibold text-navy-700">Data version</span>{" "}
          {DATA_VERSION}
        </span>
        <span className="text-muted">·</span>
        <span>
          <span className="font-semibold text-navy-700">Last reviewed</span>{" "}
          {LAST_REVIEWED}
        </span>
        <span className="text-muted">·</span>
        <span>
          Educational curated subset — not a live or licensed FlavorDB / FooDB extract.
        </span>
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
            ["explorer", "Pair explorer"],
            ["inventory", "Against inventory"],
            ["bridges", "Featured bridges"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={cn("chip", mode === id && "is-active")}
            aria-pressed={mode === id}
            onClick={() => setMode(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "bridges" && (
        <section className="panel-surface p-5 sm:p-6">
          <p className="section-label">Featured bridges</p>
          <h2 className="mt-1 font-display text-2xl">High-signal pairs to explore</h2>
          <p className="mt-2 text-sm text-stone-deep">
            Hand-picked classics and food–bar bridges. Tap any card to load it in the explorer.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_BRIDGES.map((br) => {
              const s = pairScore(br.a, br.b);
              const da = PROFILES.find((p) => p.name === br.a)?.displayName ?? br.a;
              const db = PROFILES.find((p) => p.name === br.b)?.displayName ?? br.b;
              return (
                <button
                  key={`${br.a}-${br.b}`}
                  type="button"
                  className="panel-inset p-4 text-left transition hover:border-heritage hover:bg-navy-100/40"
                  onClick={() => pickBridge(br.a, br.b)}
                >
                  <p className="font-display text-lg">
                    {da} <span className="text-muted">×</span> {db}
                  </p>
                  <p className="mt-1 text-sm text-stone-deep">{br.hook}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    <span className="badge badge-comfortable tabular">{s.composite.toFixed(2)}</span>
                    <span className="text-muted">
                      mol {s.molecular.toFixed(2)} · co {s.cooccurrence.toFixed(2)}
                    </span>
                    {s.synergyApplied && (
                      <span className="badge badge-rising">synergy</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {mode === "inventory" && (
        <section className="panel-surface p-5 sm:p-6">
          <p className="section-label">Against inventory</p>
          <h2 className="mt-1 font-display text-2xl">What in the house pairs with…</h2>
          <div className="mt-4 max-w-sm">
            <label className="text-sm font-semibold">
              Focal ingredient
              <select
                className="field-input mt-1"
                value={a}
                onChange={(e) => setA(e.target.value)}
              >
                {PROFILES.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.displayName}
                    {p.coverage === "sparse" ? " (sparse)" : ""}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {items.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              Inventory is empty.{" "}
              <Link to="/inventory" className="font-semibold text-heritage underline">
                Open inventory
              </Link>{" "}
              or seed the demo household first.
            </p>
          ) : inventoryRanks.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              No other inventory items to rank against {pa?.displayName}.
            </p>
          ) : (
            <ul className="mt-5 space-y-2">
              {inventoryRanks.map((n) => (
                <li key={n.b}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left text-sm hover:bg-ivory"
                    onClick={() => {
                      setB(n.b);
                      setMode("explorer");
                    }}
                  >
                    <span className="min-w-0">
                      <span className="font-semibold">{n.displayName}</span>
                      <span className="ml-2 text-xs text-muted">{n.category}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      {n.synergyApplied && (
                        <span className="badge badge-rising">synergy</span>
                      )}
                      <span className="tabular text-muted">{n.composite.toFixed(2)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-muted">
            Ranked by the same hybrid score used in the explorer. Tap a row to open the full pair view.
          </p>
        </section>
      )}

      {mode === "explorer" && (
        <section className="panel-surface p-5 sm:p-6">
          <p className="section-label">Explorer</p>
          <h2 className="mt-1 font-display text-2xl">Why this pairs</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Ingredient A
              <input
                className="field-input mt-1"
                placeholder="Filter…"
                value={filterA}
                onChange={(e) => setFilterA(e.target.value)}
                aria-label="Filter ingredient A"
              />
              <select
                className="field-input mt-2"
                value={a}
                onChange={(e) => setA(e.target.value)}
              >
                {filteredA.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.displayName}
                    {p.coverage === "sparse" ? " (sparse)" : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold">
              Ingredient B
              <input
                className="field-input mt-1"
                placeholder="Filter…"
                value={filterB}
                onChange={(e) => setFilterB(e.target.value)}
                aria-label="Filter ingredient B"
              />
              <select
                className="field-input mt-2"
                value={b}
                onChange={(e) => setB(e.target.value)}
              >
                {filteredB.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.displayName}
                    {p.coverage === "sparse" ? " (sparse)" : ""}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <ScoreMeter label="Molecular Jaccard" value={score.molecular} />
            <ScoreMeter label="Recipe co-occurrence" value={score.cooccurrence} />
            <ScoreMeter label="Composite" value={score.composite} accent />
          </div>

          <div className="mt-4 panel-inset space-y-2 p-4 text-sm leading-relaxed text-stone-deep">
            <p>
              <span className="font-semibold text-navy-700">Why</span> {narrative}
            </p>
            <p>
              <span className="font-semibold text-navy-700">Synergy gate</span>{" "}
              +{SYNERGY.bonus.toFixed(2)} only when Molecular Jaccard &gt;{" "}
              {SYNERGY.molecularMin} <span className="text-muted">and</span> Recipe
              co-occurrence &gt; {SYNERGY.coMin}. Never invents a pair from one signal alone.
            </p>
            <p>
              Bonus on this pair:{" "}
              <span
                className={cn(
                  "font-semibold",
                  score.synergyApplied ? "text-heritage" : "text-muted",
                )}
              >
                {score.synergyApplied
                  ? `applied (+${SYNERGY.bonus.toFixed(2)})`
                  : "not applied"}
              </span>
            </p>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="panel-inset p-4">
              <p className="section-label">Shared compounds</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {score.shared.length ? (
                  score.shared.map((c) => (
                    <span
                      key={c}
                      className="badge badge-comfortable"
                      title={COMPOUND_NOTES[c] ?? c}
                    >
                      {c}
                      {COMPOUND_NOTES[c] ? (
                        <span className="ml-1 font-normal normal-case tracking-normal opacity-80">
                          · {COMPOUND_NOTES[c]}
                        </span>
                      ) : null}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-muted">No shared volatiles in this curated set.</p>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {pa?.coverage && (
                  <span className="badge badge-comfortable">A: {pa.coverage}</span>
                )}
                {pb?.coverage && (
                  <span className="badge badge-comfortable">B: {pb.coverage}</span>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-stone-deep">
                {pa?.notes} {pb?.notes}
              </p>
            </div>
            <div className="panel-inset p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="section-label">Best neighbors for {pa?.displayName}</p>
                <select
                  className="field-input max-w-[9rem] py-1 text-xs"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  aria-label="Filter neighbors by category"
                >
                  <option value="">All categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <ul className="mt-3 space-y-1">
                {neighbors.map((n) => (
                  <li key={n.b}>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm hover:bg-ivory",
                        n.b === b && "bg-ivory",
                      )}
                      onClick={() => setB(n.b)}
                    >
                      <span>
                        {n.displayName}
                        <span className="ml-1.5 text-xs text-muted">{n.category}</span>
                      </span>
                      <span className="tabular text-muted">{n.composite.toFixed(2)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setMode("inventory")}
            >
              Rank against inventory
            </button>
            <Link to="/match" className="btn btn-ghost btn-sm">
              Open Match
            </Link>
          </div>
        </section>
      )}

      <section>
        <p className="section-label">Method</p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-stone-deep">
          {METHOD_NOTES.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
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
