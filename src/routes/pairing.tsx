import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/kbi/PageHeader";
import { METHOD_NOTES, PAIRING_SOURCES } from "@/lib/kbi/report";
import {
  PROFILES,
  DATA_VERSION,
  LAST_REVIEWED,
  SYNERGY,
  bestPairsFor,
  pairScore,
} from "@/lib/kbi/flavors";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pairing")({ component: PairingPage });

function PairingPage() {
  const [a, setA] = useState("bourbon");
  const [b, setB] = useState("sweet vermouth");
  const score = useMemo(() => pairScore(a, b), [a, b]);
  const neighbors = useMemo(() => bestPairsFor(a, 6), [a]);
  const pa = PROFILES.find((p) => p.name === a);
  const pb = PROFILES.find((p) => p.name === b);

  return (
    <div className="app-shell space-y-8 py-8">
      <PageHeader
        kicker="02 · Pairing data"
        title="A hybrid molecular + co-occurrence engine can be bootstrapped now."
        lede="Curated profiles stand in for FlavorDB / FooDB vectors. The formula is fixed: Jaccard on volatiles, blended 50/50 with recipe co-occurrence, plus a synergy bonus only when both sides are already elevated."
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

      <section className="panel-surface p-5 sm:p-6">
        <p className="section-label">Explorer</p>
        <h2 className="mt-1 font-display text-2xl">Why this pairs</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Ingredient A
            <select className="field-input mt-1" value={a} onChange={(e) => setA(e.target.value)}>
              {PROFILES.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.displayName}
                  {p.coverage === "sparse" ? " (sparse)" : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Ingredient B
            <select className="field-input mt-1" value={b} onChange={(e) => setB(e.target.value)}>
              {PROFILES.map((p) => (
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
            <span className="font-semibold text-navy-700">Synergy gate</span>{" "}
            +{SYNERGY.bonus.toFixed(2)} only when Molecular Jaccard &gt;{" "}
            {SYNERGY.molecularMin} <span className="text-muted">and</span> Recipe
            co-occurrence &gt; {SYNERGY.coMin}. Never invents a pair from one signal alone.
          </p>
          <p>
            Bonus on this pair:{" "}
            <span className={cn("font-semibold", score.synergyApplied ? "text-heritage" : "text-muted")}>
              {score.synergyApplied ? `applied (+${SYNERGY.bonus.toFixed(2)})` : "not applied"}
            </span>
          </p>
          {(score.coverageA === "sparse" || score.coverageB === "sparse") && (
            <p className="text-muted">
              One or both profiles are marked <span className="font-semibold">sparse</span> —
              composite leans more on co-occurrence until denser volatiles are curated.
            </p>
          )}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="panel-inset p-4">
            <p className="section-label">Shared compounds</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {score.shared.length ? (
                score.shared.map((c) => (
                  <span key={c} className="badge badge-comfortable">
                    {c}
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
            {(pa?.sourceNote || pb?.sourceNote) && (
              <p className="mt-2 text-xs text-muted">
                {[pa?.sourceNote, pb?.sourceNote].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          <div className="panel-inset p-4">
            <p className="section-label">Best neighbors for {pa?.displayName}</p>
            <ul className="mt-3 space-y-2">
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
                    <span>{n.displayName}</span>
                    <span className="tabular text-muted">{n.composite.toFixed(2)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

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

function ScoreMeter({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
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
