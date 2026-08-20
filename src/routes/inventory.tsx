import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast, Toaster } from "sonner";
import { PageHeader } from "@/components/kbi/PageHeader";
import figPrep from "@/assets/fig-prep.jpg";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { loadHousehold, saveHousehold } from "@/lib/kbi/server";
import { useInventory } from "@/lib/kbi/store";
import { urgencyLabel } from "@/lib/kbi/match";
import type { Category, InventoryItem, Location, Source, Unit } from "@/lib/kbi/types";
import { cn, formatDate } from "@/lib/utils";

export const Route = createFileRoute("/inventory")({ component: InventoryPage });

const SOURCE_LABEL: Record<Source, string> = {
  vision: "scan",
  barcode: "barcode",
  manual: "manual",
  demo: "starter",
};

function sourceLabel(source: Source) {
  return SOURCE_LABEL[source] ?? source;
}

const LOCATIONS: Location[] = ["bar_shelf", "fridge", "pantry", "freezer"];
const CATEGORIES: Category[] = [
  "spirit",
  "mixer",
  "produce",
  "dairy",
  "protein",
  "pantry",
  "condiment",
  "garnish",
  "herb",
];

function InventoryPage() {
  const items = useInventory((s) => s.items);
  const hydrated = useInventory((s) => s.hydrated);
  const upsert = useInventory((s) => s.upsert);
  const remove = useInventory((s) => s.remove);
  const resetDemo = useInventory((s) => s.resetDemo);
  const replaceAll = useInventory((s) => s.replaceAll);
  const { user } = useCurrentUserState();
  const [filter, setFilter] = useState<Location | "all">("all");
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);

  const shown = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.location === filter)),
    [items, filter],
  );

  async function syncUp() {
    if (!user) return;
    setBusy(true);
    try {
      await saveHousehold({ data: items });
      toast.success("Household saved");
    } catch {
      toast.error("Could not save household");
    } finally {
      setBusy(false);
    }
  }

  async function syncDown() {
    if (!user) return;
    setBusy(true);
    try {
      const remote = await loadHousehold();
      if (remote.length) replaceAll(remote);
      toast.success(remote.length ? "Household loaded" : "No household saved yet");
    } catch {
      toast.error("Could not load household");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-shell space-y-8 py-8">
      <Toaster richColors position="top-center" />
      <PageHeader
        kicker="03 · Inventory"
        title="Local-first pantry and bar. You confirm before anything is truth."
        lede="A starter pantry is loaded so Match has something real to rank. Edits stay in this browser. Sign in to save a household copy."
        image={figPrep}
        imageAlt="Organised meal-prep containers of vegetables, grains, and proteins"
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={cn("chip", filter === "all" && "is-active")}
          aria-pressed={filter === "all"}
          onClick={() => setFilter("all")}
        >
          All · {hydrated ? items.length : "—"}
        </button>
        {LOCATIONS.map((loc) => (
          <button
            key={loc}
            type="button"
            className={cn("chip", filter === loc && "is-active")}
            aria-pressed={filter === loc}
            onClick={() => setFilter(loc)}
          >
            {loc.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setAdding((v) => !v)}>
          {adding ? "Close form" : "Add item"}
        </button>
        <Link to="/vision" className="btn btn-secondary btn-sm">
          Scan a shelf
        </Link>
        <button type="button" className="btn btn-ghost btn-sm" onClick={resetDemo}>
          Restore starter pantry
        </button>
        {user ? (
          <>
            <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => void syncUp()}>
              Save household
            </button>
            <button type="button" className="btn btn-ghost btn-sm" disabled={busy} onClick={() => void syncDown()}>
              Load household
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-ghost btn-sm">
            Sign in to sync
          </Link>
        )}
      </div>

      {adding ? <AddForm onSave={upsert} onDone={() => setAdding(false)} /> : null}

      {!hydrated ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-linen" />
          ))}
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {shown.map((item) => (
            <li key={item.id} className="panel-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.displayName}</p>
                  <p className="text-sm text-muted">{item.normalizedName}</p>
                </div>
                <UrgencyBadge expiry={item.expiry} />
              </div>
              <p className="mt-3 text-sm text-stone-deep">
                {item.quantity.value} {item.quantity.unit} · {item.location.replace("_", " ")} · {sourceLabel(item.source)}
                {item.confidence < 1 ? ` · ${Math.round(item.confidence * 100)}%` : ""}
              </p>
              <p className="mt-1 text-xs text-muted">
                {item.expiry ? `Use by ${formatDate(item.expiry)}` : "No expiry"}
              </p>
              <div className="mt-3 flex gap-2">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => remove(item.id)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-3">
        <Link to="/match" className="btn btn-primary">
          What can I make
        </Link>
        <Link to="/handoff" className="btn btn-secondary">
          Build a packet
        </Link>
      </div>
    </div>
  );
}

function UrgencyBadge({ expiry }: { expiry: string | null }) {
  const u = urgencyLabel(expiry);
  if (u === "none") return <span className="badge badge-neutral">stable</span>;
  if (u === "high") return <span className="badge badge-critical">use first</span>;
  if (u === "medium") return <span className="badge badge-rising">soon</span>;
  return <span className="badge badge-comfortable">dated</span>;
}

function AddForm({
  onSave,
  onDone,
}: {
  onSave: (item: InventoryItem) => void;
  onDone: () => void;
}) {
  const [displayName, setDisplayName] = useState("");
  const [category, setCategory] = useState<Category>("pantry");
  const [location, setLocation] = useState<Location>("pantry");
  const [value, setValue] = useState("1");
  const [unit, setUnit] = useState<Unit>("count");
  const [expiry, setExpiry] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const name = displayName.trim();
    if (!name) return;
    onSave({
      id: crypto.randomUUID(),
      displayName: name,
      normalizedName: name.toLowerCase(),
      category,
      location,
      quantity: { value: Number(value) || 1, unit },
      expiry: expiry || null,
      source: "manual",
      confidence: 1,
      lastUpdated: new Date().toISOString(),
      tags: [],
      userNotes: "",
    });
    onDone();
  }

  return (
    <form onSubmit={submit} className="panel-surface grid gap-3 p-5 sm:grid-cols-2">
      <label className="text-sm font-semibold sm:col-span-2">
        Name
        <input className="field-input mt-1" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
      </label>
      <label className="text-sm font-semibold">
        Category
        <select className="field-input mt-1" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label className="text-sm font-semibold">
        Location
        <select className="field-input mt-1" value={location} onChange={(e) => setLocation(e.target.value as Location)}>
          {LOCATIONS.map((c) => (
            <option key={c} value={c}>
              {c.replace("_", " ")}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm font-semibold">
        Quantity
        <input className="field-input mt-1" value={value} onChange={(e) => setValue(e.target.value)} />
      </label>
      <label className="text-sm font-semibold">
        Unit
        <select className="field-input mt-1" value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
          {(["count", "bottle", "g", "ml", "oz", "bunch"] as Unit[]).map((u) => (
            <option key={u}>{u}</option>
          ))}
        </select>
      </label>
      <label className="text-sm font-semibold sm:col-span-2">
        Expiry
        <input className="field-input mt-1" type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
      </label>
      <button type="submit" className="btn btn-primary sm:col-span-2">
        Save item
      </button>
    </form>
  );
}
