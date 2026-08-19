import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { IngredientPicker } from "@/components/IngredientPicker";
import { Surface } from "@/components/Surface";
import { METHOD_NOTES, PAIRING_SOURCES } from "@/lib/kbi/report";
import {
  bestPairsFor,
  DATA_VERSION,
  explainPair,
  LAST_REVIEWED,
  pairScore,
  PROFILES,
  SYNERGY,
  unexpectedBridges,
  type ScoredNeighbor,
} from "@/lib/kbi/flavors";
import { useInventoryStore } from "@/lib/kbi/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pairing")({
  component: PairingPage,
});

type Mode = "explorer" | "inventory" | "bridges" | "unexpected";

function PairingPage() {
  const [focal, setFocal] = useState("bourbon");
  const [mode, setMode] = useState<Mode>("explorer");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const items = useInventoryStore((s) => s.items);

  const score = useMemo(() => pairScore(focal, focal === "bourbon" ? "vanilla" : "bourbon"), [focal]);
  const neighbors = useMemo(
    () => bestPairsFor(focal, 8, categoryFilter || undefined),
    [focal, categoryFilter],
  );
  const bridges = useMemo(() => unexpectedBridges(12), []);

  return (
    <div className="page">
      <Surface
        title="Pairing explorer"
        lede="Search an ingredient, inspect the chemistry, and rank it against what you already own. Classic bridges, unexpected chemistry, and the same scores Match uses."
      >
        <p className="text-sm text-muted">
          Data {DATA_VERSION} · reviewed {LAST_REVIEWED}. Educational planning only — no allergen, nutrition, or pricing claims.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {(["explorer", "inventory", "bridges", "unexpected"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              className={cn("btn btn-sm", mode === m ? "btn-primary" : "btn-ghost")}
              onClick={() => setMode(m)}
            >
              {m === "explorer" && "Explorer"}
              {m === "inventory" && "Against inventory"}
              {m === "bridges" && "Classic bridges"}
              {m === "unexpected" && "Unexpected bridges"}
            </button>
          ))}
        </div>

        {mode === "explorer" && (
          <div className="mt-8 space-y-6">
            <IngredientPicker value={focal} onChange={setFocal} />
            <div className="grid gap-4 sm:grid-cols-3">
              <ScoreMeter label="IDF molecular" value={score.molecular} />
              <ScoreMeter label="Recipe co-occurrence" value={score.cooccurrence} />
              <ScoreMeter label="Composite" value={score.composite} accent />
            </div>
            <p className="text-sm">{explainPair(score)}</p>
            <p className="text-xs text-muted">
              Synergy +{SYNERGY.bonus} when IDF molecular {" > "} {SYNERGY.molecularMin} and Recipe co-occurrence {" > "} {SYNERGY.coMin}.
            </p>
            <ul className="space-y-2">
              {neighbors.map((s) => (
                <li key={s.b} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                  <span>{s.displayName}</span>
                  <span className="tabular text-sm text-muted">
                    mol {s.molecular.toFixed(2)} · co {s.cooccurrence.toFixed(2)} · {s.composite.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {mode === "unexpected" && (
          <div className="mt-8 space-y-4">
            <p className="text-sm text-muted">
              IDF molecular ≥ 0.25 with co-occurrence still below 0.40. These are deliberate experiments — the chemistry is there; the recipe habit is not (yet).
            </p>
            <ul className="space-y-2">
              {bridges.map((br) => (
                <li key={`${br.a}-${br.b}`} className="flex flex-wrap items-center gap-2 rounded-lg border border-border px-3 py-2">
                  <span className="font-medium">{br.aDisplay}</span>
                  <span className="text-muted">×</span>
                  <span className="font-medium">{br.bDisplay}</span>
                  <span className="badge badge-rising tabular">mol {br.molecular.toFixed(2)}</span>
                  <span className="badge tabular">co {br.cooccurrence.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <section className="mt-12">
          <h2 className="text-lg font-semibold">Method</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
            {METHOD_NOTES.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </section>
      </Surface>
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
