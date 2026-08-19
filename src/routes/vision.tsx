import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/kbi/PageHeader";
import { SCENES, cloneScene, type DemoScene } from "@/lib/kbi/vision-demo";
import { useInventory } from "@/lib/kbi/store";
import type { Category, Detection, InventoryItem, Unit } from "@/lib/kbi/types";
import { VISION } from "@/lib/kbi/report";
import { bestPairsFor, profileFor } from "@/lib/kbi/flavors";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vision")({ component: VisionPage });

type Step = "review" | "details" | "done";

const UNITS: Unit[] = ["count", "bottle", "g", "ml", "oz", "bunch"];

function defaultUnit(category: Category): Unit {
  if (category === "spirit" || category === "mixer" || category === "condiment") return "bottle";
  if (category === "herb") return "bunch";
  if (category === "protein") return "g";
  return "count";
}

function defaultQty(category: Category): number {
  if (category === "protein") return 250;
  return 1;
}

function VisionPage() {
  const [scene, setScene] = useState<DemoScene>(() => cloneScene(SCENES[0]!));
  const [step, setStep] = useState<Step>("review");
  const [committedIds, setCommittedIds] = useState<string[]>([]);
  const [selectedDet, setSelectedDet] = useState<string | null>(null);
  const upsert = useInventory((s) => s.upsert);

  const accepted = scene.detections.filter((d) => d.accepted);
  const committed = accepted.length;

  function load(id: string) {
    const next = SCENES.find((s) => s.id === id);
    if (next) {
      setScene(cloneScene(next));
      setStep("review");
      setCommittedIds([]);
      setSelectedDet(null);
    }
  }

  function patch(id: string, partial: Partial<Detection>) {
    setScene((s) => ({
      ...s,
      detections: s.detections.map((d) => (d.id === id ? { ...d, ...partial } : d)),
    }));
  }

  function toggle(id: string) {
    setScene((s) => ({
      ...s,
      detections: s.detections.map((d) => (d.id === id ? { ...d, accepted: !d.accepted } : d)),
    }));
  }

  function rename(id: string, label: string) {
    patch(id, {
      label,
      normalizedName: label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim(),
    });
  }

  function ensureDrafts() {
    setScene((s) => ({
      ...s,
      detections: s.detections.map((d) => ({
        ...d,
        quantity: d.quantity ?? { value: defaultQty(d.category), unit: defaultUnit(d.category) },
        expiry: d.expiry ?? null,
      })),
    }));
  }

  function acceptHigh() {
    setScene((s) => ({
      ...s,
      detections: s.detections.map((d) => (d.confidence >= 0.8 ? { ...d, accepted: true } : d)),
    }));
  }

  function skipLow() {
    setScene((s) => ({
      ...s,
      detections: s.detections.map((d) => (d.confidence < 0.7 ? { ...d, accepted: false } : d)),
    }));
  }

  function acceptAll() {
    setScene((s) => ({
      ...s,
      detections: s.detections.map((d) => ({ ...d, accepted: true })),
    }));
  }

  function skipAll() {
    setScene((s) => ({
      ...s,
      detections: s.detections.map((d) => ({ ...d, accepted: false })),
    }));
  }

  function commit() {
    const now = new Date().toISOString();
    const ids: string[] = [];
    for (const det of scene.detections.filter((d) => d.accepted)) {
      const item: InventoryItem = {
        id: crypto.randomUUID(),
        normalizedName: det.normalizedName,
        displayName: det.label,
        category: det.category,
        quantity: det.quantity ?? { value: defaultQty(det.category), unit: defaultUnit(det.category) },
        expiry: det.expiry ?? null,
        location: det.location,
        source: "vision",
        confidence: det.confidence,
        lastUpdated: now,
        tags: det.confidence < 0.7 ? ["needs_review"] : [],
        userNotes: "",
      };
      upsert(item);
      ids.push(det.normalizedName);
    }
    setCommittedIds(ids);
    setStep("done");
  }

  const mean = useMemo(() => {
    if (!scene.detections.length) return 0;
    return scene.detections.reduce((acc, d) => acc + d.confidence, 0) / scene.detections.length;
  }, [scene]);

  const pairingTeasers = useMemo(() => {
    if (!committedIds.length) return [];
    const out: { name: string; neighbor: string; score: number }[] = [];
    for (const name of committedIds.slice(0, 4)) {
      const top = bestPairsFor(name, 1)[0];
      if (top) {
        out.push({
          name: profileFor(name)?.displayName ?? name,
          neighbor: top.displayName,
          score: top.composite,
        });
      }
    }
    return out;
  }, [committedIds]);

  return (
    <div className="app-shell space-y-8 py-8">
      <PageHeader
        kicker="01 · Vision tech"
        title="Feasible for MVP. Confirmation is the product."
        lede={VISION.verdict}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="metric">
          <span className="metric-value">90s</span>
          <span className="metric-label">Bar / shelf mAP</span>
        </div>
        <div className="metric">
          <span className="metric-value">80–90%</span>
          <span className="metric-label">Packaged grocery</span>
        </div>
        <div className="metric">
          <span className="metric-value">65–75%</span>
          <span className="metric-label">Hard mixed fridge</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="panel-surface p-5">
          <p className="section-label">{VISION.bar.title}</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-stone-deep">
            {VISION.bar.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </article>
        <article className="panel-surface p-5">
          <p className="section-label">{VISION.pantry.title}</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-stone-deep">
            {VISION.pantry.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </article>
      </div>

      <section className="panel-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-label">Prototype scan · review workflow</p>
            <h2 className="mt-1 font-display text-2xl">Review before it becomes truth</h2>
          </div>
          <p className="text-sm text-muted">
            Mean confidence <span className="tabular font-semibold text-ink">{Math.round(mean * 100)}%</span>
          </p>
        </div>

        <ol className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide">
          {(
            [
              ["review", "1 · Review"],
              ["details", "2 · Confirm"],
              ["done", "3 · Committed"],
            ] as const
          ).map(([id, label]) => (
            <li
              key={id}
              className={cn(
                "rounded-full border px-3 py-1.5",
                step === id ? "border-heritage bg-navy-100 text-heritage" : "border-line text-muted",
              )}
            >
              {label}
            </li>
          ))}
        </ol>

        <div className="mt-4 flex flex-wrap gap-2">
          {SCENES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={cn("chip", scene.id === s.id && "is-active")}
              aria-pressed={scene.id === s.id}
              onClick={() => load(s.id)}
            >
              {s.title}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-stone-deep">
          {scene.blurb} {scene.lighting}.
        </p>

        <Shelf scene={scene} selectedId={selectedDet} onToggle={toggle} onSelect={setSelectedDet} />

        {step === "review" && (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="btn btn-secondary btn-sm" onClick={acceptHigh}>
                Keep ≥80%
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={skipLow}>
                Skip {'<'}70%
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={acceptAll}>
                Keep all
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={skipAll}>
                Skip all
              </button>
            </div>

            <ul className="mt-5 space-y-2">
              {scene.detections.map((det) => (
                <li
                  key={det.id}
                  className={cn(
                    "panel-inset flex flex-wrap items-center gap-3 p-3",
                    selectedDet === det.id && "ring-2 ring-heritage/40",
                  )}
                >
                  <button
                    type="button"
                    className={cn("badge min-h-9", det.accepted ? "badge-comfortable" : "badge-neutral")}
                    onClick={() => toggle(det.id)}
                  >
                    {det.accepted ? "Keep" : "Skip"}
                  </button>
                  <input
                    className="field-input min-h-11 flex-1"
                    value={det.label}
                    onChange={(e) => rename(det.id, e.target.value)}
                    onFocus={() => setSelectedDet(det.id)}
                    aria-label="Detection label"
                  />
                  <span
                    className={cn(
                      "tabular text-sm",
                      det.confidence >= 0.8
                        ? "text-ok"
                        : det.confidence < 0.7
                          ? "text-warn"
                          : "text-muted",
                    )}
                  >
                    {Math.round(det.confidence * 100)}%
                  </span>
                  <span className="text-xs text-muted">{det.category}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="btn btn-primary"
                disabled={committed === 0}
                onClick={() => {
                  ensureDrafts();
                  setStep("details");
                }}
              >
                Continue with {committed} item{committed === 1 ? "" : "s"}
              </button>
              <Link to="/inventory" className="btn btn-secondary">
                Open inventory
              </Link>
            </div>
          </>
        )}

        {step === "details" && (
          <div className="mt-5 space-y-4">
            <p className="text-sm text-stone-deep">
              Quantity and expiry are yours — vision does not invent them. Edit labels, amounts, and dates, then
              commit.
            </p>
            <ul className="space-y-3">
              {accepted.map((det) => {
                const qty = det.quantity ?? { value: defaultQty(det.category), unit: defaultUnit(det.category) };
                return (
                  <li key={det.id} className="panel-inset space-y-3 p-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="badge badge-comfortable">Keep</span>
                      <input
                        className="field-input min-h-11 flex-1"
                        value={det.label}
                        onChange={(e) => rename(det.id, e.target.value)}
                        aria-label="Final label"
                      />
                      <span className="tabular text-sm text-muted">{Math.round(det.confidence * 100)}%</span>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => toggle(det.id)}>
                        Remove
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                        Quantity
                        <input
                          className="field-input mt-1 min-h-11"
                          type="number"
                          min={0}
                          step="any"
                          value={qty.value}
                          onChange={(e) =>
                            patch(det.id, {
                              quantity: { value: Number(e.target.value) || 0, unit: qty.unit },
                            })
                          }
                        />
                      </label>
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                        Unit
                        <select
                          className="field-input mt-1 min-h-11"
                          value={qty.unit}
                          onChange={(e) =>
                            patch(det.id, {
                              quantity: { value: qty.value, unit: e.target.value as Unit },
                            })
                          }
                        >
                          {UNITS.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                        Expiry (optional)
                        <input
                          className="field-input mt-1 min-h-11"
                          type="date"
                          value={det.expiry ?? ""}
                          onChange={(e) => patch(det.id, { expiry: e.target.value || null })}
                        />
                      </label>
                    </div>
                  </li>
                );
              })}
            </ul>
            {accepted.length === 0 && (
              <p className="text-sm text-muted">Nothing left to commit. Go back and Keep some items.</p>
            )}
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn btn-secondary" onClick={() => setStep("review")}>
                Back to review
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={accepted.length === 0}
                onClick={commit}
              >
                Add {accepted.length} to inventory
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="mt-5 space-y-4">
            <div className="alert alert-info">
              <p className="font-semibold">Committed {committedIds.length} item(s) to local inventory.</p>
              <p className="mt-1 text-sm">
                Source tagged <span className="font-mono">vision</span>. Low-confidence rows carry a{" "}
                <span className="font-mono">needs_review</span> tag. Quantity and expiry are stored as you entered
                them.
              </p>
            </div>
            {pairingTeasers.length > 0 && (
              <div className="panel-inset p-4">
                <p className="section-label">Pairing teaser</p>
                <p className="mt-1 text-sm text-stone-deep">
                  Quick hybrid neighbors for what you just added — open Pairing to dig in.
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  {pairingTeasers.map((t) => (
                    <li key={t.name} className="flex justify-between gap-2">
                      <span>
                        <span className="font-semibold">{t.name}</span>
                        <span className="text-muted"> → </span>
                        {t.neighbor}
                      </span>
                      <span className="tabular text-muted">{t.score.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link to="/pairing" className="btn btn-secondary btn-sm">
                    Open Pairing
                  </Link>
                  <Link to="/match" className="btn btn-ghost btn-sm">
                    Open Match
                  </Link>
                  <Link to="/inventory" className="btn btn-ghost btn-sm">
                    Inventory
                  </Link>
                </div>
              </div>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setStep("review");
                setCommittedIds([]);
              }}
            >
              Review another scene
            </button>
          </div>
        )}
      </section>

      <section>
        <p className="section-label">Implementation path</p>
        <ol className="mt-3 space-y-2">
          {VISION.path.map((stepText, i) => (
            <li key={stepText} className="flex gap-3 text-sm leading-relaxed text-stone-deep">
              <span className="tabular font-semibold text-heritage">{i + 1}</span>
              <span>{stepText}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

const CAT_TONE: Record<Category, string> = {
  spirit: "text-ivory",
  mixer: "text-brass",
  produce: "text-ok",
  dairy: "text-navy-200",
  pantry: "text-champagne",
  protein: "text-linen",
  herb: "text-ok",
  condiment: "text-champagne",
  garnish: "text-linen",
};

function Silhouette({ category }: { category: Category }) {
  if (category === "spirit" || category === "mixer") {
    return (
      <svg viewBox="0 0 40 110" className="h-full w-full min-h-0 flex-1 fill-current" aria-hidden>
        <path
          fill="currentColor"
          d="M15 4h10v8l5 10v70a8 8 0 0 1-8 8H18a8 8 0 0 1-8-8V22l5-10V4z"
        />
        <rect x="16" y="0" width="8" height="6" rx="1" fill="currentColor" opacity="0.85" />
      </svg>
    );
  }
  if (category === "produce") {
    return (
      <svg viewBox="0 0 48 48" className="h-full w-full min-h-0 flex-1 fill-current" aria-hidden>
        <ellipse cx="24" cy="26" rx="16" ry="14" fill="currentColor" />
        <path d="M24 8c4 4 6 8 4 12" fill="none" stroke="currentColor" strokeWidth="3" />
      </svg>
    );
  }
  if (category === "dairy") {
    return (
      <svg viewBox="0 0 48 72" className="h-full w-full" aria-hidden>
        <path fill="currentColor" d="M12 16 18 6h12l6 10v48a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V16z" />
      </svg>
    );
  }
  if (category === "herb") {
    return (
      <svg viewBox="0 0 48 72" className="h-full w-full" aria-hidden>
        <path fill="currentColor" d="M24 68V18m0 0C16 28 8 30 8 22 8 12 24 8 24 8s16 4 16 14c0 8-8 6-16-4z" />
        <circle cx="16" cy="28" r="8" fill="currentColor" opacity="0.8" />
        <circle cx="32" cy="24" r="7" fill="currentColor" opacity="0.7" />
      </svg>
    );
  }
  if (category === "protein") {
    return (
      <svg viewBox="0 0 64 40" className="h-full w-full min-h-0 flex-1 fill-current" aria-hidden>
        <rect x="4" y="8" width="56" height="24" rx="6" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 64" className="h-full w-full" aria-hidden>
      <path fill="currentColor" d="M10 18c0-6 6-10 14-10s14 4 14 10v34a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6V18z" />
      <rect x="16" y="6" width="16" height="10" rx="2" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

function Shelf({
  scene,
  selectedId,
  onToggle,
  onSelect,
}: {
  scene: DemoScene;
  selectedId: string | null;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="vision-shelf relative mt-5 aspect-[16/9] overflow-hidden rounded-xl border border-line">
      <div className="absolute inset-x-0 bottom-[8%] h-2 bg-linen/50" />
      <div className="absolute inset-x-0 bottom-[42%] h-2 bg-linen/30" />
      {scene.detections.map((det) => {
        const isSelected = selectedId === det.id;
        return (
          <button
            key={det.id}
            type="button"
            onClick={() => {
              onSelect(det.id);
              onToggle(det.id);
            }}
            className={cn(
              "absolute flex flex-col items-center justify-end rounded-sm bg-ivory/10 p-0.5 transition",
              CAT_TONE[det.category],
              det.accepted ? "opacity-100" : "opacity-40",
              isSelected && "z-10 ring-2 ring-champagne ring-offset-1 ring-offset-heritage",
            )}
            style={{
              left: `${det.box.x}%`,
              top: `${det.box.y}%`,
              width: `${det.box.w}%`,
              height: `${det.box.h}%`,
            }}
            aria-label={`${det.label}, ${Math.round(det.confidence * 100)} percent, ${det.accepted ? "kept" : "skipped"}`}
            title={`${det.label} · ${Math.round(det.confidence * 100)}%`}
          >
            <Silhouette category={det.category} />
            <span className="mt-0.5 w-full truncate bg-ink-deep/70 px-0.5 text-center text-[9px] leading-tight text-ivory">
              {det.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
