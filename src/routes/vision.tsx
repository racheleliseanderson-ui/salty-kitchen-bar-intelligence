import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/kbi/PageHeader";
import { SCENES, cloneScene, type DemoScene } from "@/lib/kbi/vision-demo";
import { useInventory } from "@/lib/kbi/store";
import type { InventoryItem } from "@/lib/kbi/types";
import { VISION } from "@/lib/kbi/report";
import { bestPairsFor, profileFor } from "@/lib/kbi/flavors";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vision")({ component: VisionPage });

type Step = "review" | "details" | "done";

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

  function toggle(id: string) {
    setScene((s) => ({
      ...s,
      detections: s.detections.map((d) =>
        d.id === id ? { ...d, accepted: !d.accepted } : d,
      ),
    }));
  }

  function rename(id: string, label: string) {
    setScene((s) => ({
      ...s,
      detections: s.detections.map((d) =>
        d.id === id
          ? {
              ...d,
              label,
              normalizedName: label
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, " ")
                .trim(),
            }
          : d,
      ),
    }));
  }

  function acceptHigh() {
    setScene((s) => ({
      ...s,
      detections: s.detections.map((d) =>
        d.confidence >= 0.8 ? { ...d, accepted: true } : d,
      ),
    }));
  }

  function skipLow() {
    setScene((s) => ({
      ...s,
      detections: s.detections.map((d) =>
        d.confidence < 0.7 ? { ...d, accepted: false } : d,
      ),
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
        quantity: {
          value: 1,
          unit: det.category === "spirit" ? "bottle" : "count",
        },
        expiry: null,
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
    return (
      scene.detections.reduce((a, d) => a + d.confidence, 0) /
      scene.detections.length
    );
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
            <h2 className="mt-1 font-display text-2xl">
              Review before it becomes truth
            </h2>
          </div>
          <p className="text-sm text-muted">
            Mean confidence{" "}
            <span className="tabular font-semibold text-ink">
              {Math.round(mean * 100)}%
            </span>
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
                step === id
                  ? "border-heritage bg-navy-100 text-heritage"
                  : "border-line text-muted",
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

        <Shelf
          scene={scene}
          selectedId={selectedDet}
          onToggle={toggle}
          onSelect={setSelectedDet}
        />

        {step === "review" && (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="btn btn-secondary btn-sm" onClick={acceptHigh}>
                Keep ≥80%
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={skipLow}>
                Skip &lt;70%
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
                    className={cn(
                      "badge",
                      det.accepted ? "badge-comfortable" : "badge-neutral",
                    )}
                    onClick={() => toggle(det.id)}
                  >
                    {det.accepted ? "Keep" : "Skip"}
                  </button>
                  <input
                    className="field-input min-h-10 flex-1"
                    value={det.label}
                    onChange={(e) => rename(det.id, e.target.value)}
                    onFocus={() => setSelectedDet(det.id)}
                    aria-label="Detection label"
                  />
                  <span
                    className={cn(
                      "tabular text-sm",
                      det.confidence >= 0.8
                        ? "text-[var(--color-ok)]"
                        : det.confidence < 0.7
                          ? "text-[var(--color-warn)]"
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
                onClick={() => setStep("details")}
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
              Final pass before inventory truth. Edit labels if needed, then commit.
              Quantities and expiry stay user-owned (vision is weak there).
            </p>
            <ul className="space-y-2">
              {accepted.map((det) => (
                <li key={det.id} className="panel-inset flex flex-wrap items-center gap-3 p-3">
                  <span className="badge badge-comfortable">Keep</span>
                  <input
                    className="field-input min-h-10 flex-1"
                    value={det.label}
                    onChange={(e) => rename(det.id, e.target.value)}
                    aria-label="Final label"
                  />
                  <span className="tabular text-sm text-muted">
                    {Math.round(det.confidence * 100)}%
                  </span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => toggle(det.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
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
                <span className="font-mono">needs_review</span> tag.
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
    <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-xl border border-line bg-heritage">
      <div className="absolute inset-x-0 bottom-8 h-2 bg-linen/40" />
      <div className="absolute inset-x-0 bottom-[42%] h-2 bg-linen/25" />
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
              "absolute rounded-sm border transition",
              det.accepted
                ? "border-champagne/80 bg-ivory/20"
                : "border-stone/40 bg-ink-deep/40",
              isSelected && "ring-2 ring-champagne ring-offset-1 ring-offset-heritage",
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
            {isSelected && (
              <span className="absolute inset-x-0 bottom-0 truncate bg-ink-deep/70 px-0.5 text-[10px] leading-tight text-ivory">
                {det.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
