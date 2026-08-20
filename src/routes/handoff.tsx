import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast, Toaster } from "sonner";
import { PageHeader } from "@/components/kbi/PageHeader";
import figMise from "@/assets/fig-mise.jpg";
import { CONTRACT_RULES, buildPacket, validatePacket } from "@/lib/kbi/handoff";
import { useInventory } from "@/lib/kbi/store";
import { OCCASIONS_ARCHITECTURE_URL, type AvailabilityPacket, type UserIntent } from "@/lib/kbi/types";
import { downloadText } from "@/lib/utils";

export const Route = createFileRoute("/handoff")({ component: HandoffPage });

function HandoffPage() {
  const items = useInventory((s) => s.items);
  const hydrated = useInventory((s) => s.hydrated);
  const [intent, setIntent] = useState<UserIntent>("daily_inventory");
  const [constraint, setConstraint] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const [packet, setPacket] = useState<AvailabilityPacket | null>(null);

  const preview = useMemo(
    () =>
      buildPacket(items, {
        intent,
        constraints: constraint.trim() ? [constraint.trim()] : [],
        notes: note.trim() ? [note.trim()] : [],
        stamp: false,
      }),
    [items, intent, constraint, note],
  );
  const shown = sent && packet ? packet : preview;
  const check = validatePacket(shown);
  const json = JSON.stringify(shown, null, 2);

  function send() {
    const next = buildPacket(items, {
      intent,
      constraints: constraint.trim() ? [constraint.trim()] : [],
      notes: note.trim() ? [note.trim()] : [],
    });
    const v = validatePacket(next);
    if (!v.valid) {
      toast.error(v.errors[0] ?? "Invalid packet");
      return;
    }
    setPacket(next);
    setSent(true);
    toast.success("Packet assembled. Nothing was sent automatically.");
  }

  return (
    <div className="app-shell space-y-8 py-8">
      <Toaster richColors position="top-center" />
      <PageHeader
        kicker="04 · Handoff"
        title="Availability Packet 1.0 — user-initiated, nothing silent."
        lede="Occasions stays the occasion planner — Architecture is the five-role menu stress-test. This layer only forwards what is on the shelf and what the user has declared."
        image={figMise}
        imageAlt="Overhead mise en place — chopped vegetables arranged on a cutting board"
      />

      <ul className="grid gap-3 sm:grid-cols-2">
        {CONTRACT_RULES.map((rule) => (
          <li key={rule} className="panel-inset p-4 text-sm leading-relaxed text-stone-deep">
            {rule}
          </li>
        ))}
      </ul>

      <section className="panel-surface p-5 sm:p-6">
        <p className="section-label">Assemble</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Intent
            <select
              className="field-input mt-1"
              value={intent}
              onChange={(e) => setIntent(e.target.value as UserIntent)}
            >
              <option value="daily_inventory">Daily inventory</option>
              <option value="explore">Explore</option>
              <option value="candidate_for_occasion">Candidate for occasion</option>
            </select>
          </label>
          <label className="text-sm font-semibold">
            Declared constraint
            <input
              className="field-input mt-1"
              value={constraint}
              onChange={(e) => setConstraint(e.target.value)}
              placeholder="Only if the user typed it"
            />
          </label>
          <label className="text-sm font-semibold sm:col-span-2">
            Optional note
            <input
              className="field-input mt-1"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Candidate dish names the user chose to forward"
            />
          </label>
        </div>
        <p className="mt-3 text-sm text-muted">
          {hydrated ? `${items.length} ingredients from the current inventory.` : "Loading inventory…"}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn btn-primary" onClick={send}>
            Send to Occasions
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              void navigator.clipboard.writeText(json);
              toast.success("Copied packet JSON");
            }}
          >
            Copy JSON
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => downloadText("availability-packet.json", json, "application/json")}
          >
            Download
          </button>
        </div>
        {sent ? (
          <div className="alert alert-info mt-4">
            Packet {shown.handoff_id.slice(0, 8)} is ready. Open Occasions yourself — nothing
            posts across tools.
            <a
              href={OCCASIONS_ARCHITECTURE_URL}
              className="mt-2 inline-flex font-semibold text-heritage underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Open Occasions Architecture
            </a>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">The button is the contract. Until you press it, nothing leaves.</p>
        )}
      </section>

      <section className="panel-surface p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="section-label">Packet</p>
          <span className={check.valid ? "badge badge-comfortable" : "badge badge-critical"}>
            {check.valid ? "valid" : "invalid"}
          </span>
        </div>
        {!check.valid ? (
          <ul className="mt-3 text-sm text-burnished">
            {check.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        ) : null}
        <pre className="mt-3 overflow-x-auto rounded-lg bg-ink-deep p-4 font-mono text-xs leading-relaxed text-kitchen-ink">
          {json}
        </pre>
      </section>

      <Link to="/teardown" className="btn btn-secondary">
        See the competitive field
      </Link>
    </div>
  );
}
