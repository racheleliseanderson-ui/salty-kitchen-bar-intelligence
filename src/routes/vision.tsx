import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/kbi/PageHeader";
import { SCENES, cloneScene, type DemoScene } from "@/lib/kbi/vision-demo";
import { useInventory } from "@/lib/kbi/store";
import type { InventoryItem } from "@/lib/kbi/types";
import { VISION } from "@/lib/kbi/report";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vision")({ component: VisionPage });

function VisionPage() {
  const [scene, setScene] = useState<DemoScene>(() => cloneScene(SCENES[0]!));
  const upsert = useInventory((s) => s.upsert);
  const committed = scene.detections.filter((d) => d.accepted).length;

  function load(id: string) {
    const next = SCENES.find((s) => s.id === id);
    if (next) setScene(cloneScene(next));
  }

  function toggle(id: string) {
    setScene((s) => ({
      ...s,
      detections: s.detections.map((d) => (d.id === id ? { ...d, accepted: !d.accepted } : d)),
    }));
  }

  function rename(id: string, label: string) {
    setScene((s) => ({
      ...s,
      detections: s.detections.map((d) =>
        d.id === id
          ? { ...d, label, normalizedName: label.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() }
          : d,
      ),
    }));
  }

  function commit() {
    const now = new Date().toISOString();
    for (const det of scene.detections.filter((d) => d.accepted)) {
      const item: InventoryItem = {
        id: crypto.randomUUID(),
        normalizedName: det.normalizedName,
        displayName: det.label,
        category: det.category,
        quantity: { value: 1, unit: det.category === "spirit" ? "bottle" : "count" },
        expiry: null,
        location: det.location,
        source: "vision",
        confidence: det.confidence,
        lastUpdated: now,
        tags: det.confidence < 0.7 ? ["needs_review"] : [],
        userNotes: "",
      };
      upsert(item);
    }
  }

  const mean = useMemo(() => {
    if (!scene.detections.length) return 0;
    return scene.detections.reduce((a, d) => a + d.confidence, 0) / scene.detections.length;
  }, [scene]);

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
            <p className="section-label">Prototype scan</p>
            <h2 className="mt-1 font-display text-2xl">Review before it becomes truth</h2>
          </div>
          <p className="text-sm text-muted">
            Mean confidence <span className="tabular font-semibold text-ink">{Math.round(mean * 100)}%</span>
          </p>
        </div>
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

        <Shelf scene={scene} onToggle={toggle} />

        <ul className="mt-5 space-y-2">
          {scene.detections.map((det) => (
            <li key={det.id} className="panel-inset flex flex-wrap items-center gap-3 p-3">
              <button
                type="button"
                className={cn("badge", det.accepted ? "badge-comfortable" : "badge-neutral")}
                onClick={() => toggle(det.id)}
              >
                {det.accepted ? "Keep" : "Skip"}
              </button>
              <input
                className="field-input min-h-10 flex-1"
                value={det.label}
                onChange={(e) => rename(det.id, e.target.value)}
                aria-label="Detection label"
              />
              <span className="tabular text-sm text-muted">{Math.round(det.confidence * 100)}%</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary" onClick={commit}>
            Add {committed} to inventory
          </button>
          <Link to="/inventory" className="btn btn-secondary">
            Open inventory
          </Link>
        </div>
      </section>

      <section>
        <p className="section-label">Implementation path</p>
        <ol className="mt-3 space-y-2">
          {VISION.path.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm leading-relaxed text-stone-deep">
              <span className="tabular font-semibold text-heritage">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function Shelf({ scene, onToggle }: { scene: DemoScene; onToggle: (id: string) => void }) {
  return (
    <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-xl border border-line bg-heritage">
      <div className="absolute inset-x-0 bottom-8 h-2 bg-linen/40" />
      <div className="absolute inset-x-0 bottom-[42%] h-2 bg-linen/25" />
      {scene.detections.map((det) => (
        <button
          key={det.id}
          type="button"
          onClick={() => onToggle(det.id)}
          className={cn(
            "absolute rounded-sm border",
            det.accepted ? "border-champagne/80 bg-ivory/15" : "border-stone/40 bg-ink-deep/40",
          )}
          style={{
            left: `${det.box.x}%`,
            top: `${det.box.y}%`,
            width: `${det.box.w}%`,
            height: `${det.box.h}%`,
          }}
          aria-label={`${det.label}, ${Math.round(det.confidence * 100)} percent`}
        />
      ))}
    </div>
  );
}
