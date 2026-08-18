import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/kbi/PageHeader";
import { METHOD_NOTES, PAIRING_SOURCES } from "@/lib/kbi/report";
import { PROFILES, bestPairsFor, pairScore } from "@/lib/kbi/flavors";
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
        lede="Curated profiles here stand in for FlavorDB / FooDB vectors. The formula is the same: Jaccard on volatiles, blended 50/50 with recipe co-occurrence, plus a synergy bonus."
      />

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
            <p className="mt-3 text-sm leading-relaxed text-stone-deep">
              {pa?.notes} {pb?.notes}
            </p>
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
