import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Camera, FlaskConical, Handshake, ScanSearch, Swords } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

const SECTIONS = [
  {
    to: "/vision",
    kicker: "01",
    title: "Vision",
    body: "Scan a shelf or fridge, review every candidate, then commit. Bar reads cleaner; crowded pantries still need your eyes.",
    icon: Camera,
    verdict: "Live",
  },
  {
    to: "/pairing",
    kicker: "02",
    title: "Pairing",
    body: "Molecular overlap plus recipe co-occurrence. Explainable scores, classic bridges, and unexpected chemistry.",
    icon: FlaskConical,
    verdict: "Live",
  },
  {
    to: "/inventory",
    kicker: "03",
    title: "Inventory + match",
    body: "Local-first pantry and bar. Review, edit, expiry ranking, Almost, and Smart Buy — food and drink together.",
    icon: ScanSearch,
    verdict: "Live",
  },
  {
    to: "/handoff",
    kicker: "04",
    title: "Occasions packet",
    body: "Availability Packet 1.0. You send it. No recipes, no allergen claims, no silent inference.",
    icon: Handshake,
    verdict: "Packet 1.0",
  },
  {
    to: "/teardown",
    kicker: "05",
    title: "The field",
    body: "Home Bar Hero, Chefs AI, CompKitchen, pantry apps. The gap we own is unification + science + truth.",
    icon: Swords,
    verdict: "Clear gap",
  },
] as const;

const METRICS = [
  { n: "90s", l: "Bar shelf reads" },
  { n: "65–75%", l: "Hard fridge scenes" },
  { n: "35/65", l: "Molecule + recipe" },
  { n: "1.0", l: "Availability packet" },
] as const;

function Home() {
  return (
    <div className="hairline-grid">
      <div className="app-shell py-10 sm:py-16">
        <section>
          <p className="label-mono text-brass">Salty & Clever · Kitchen & Bar Intelligence</p>
          <h1 className="display-xl mt-5 max-w-4xl text-bone">
            See the shelf. Rank the pour. Hand off the occasion.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Scan, confirm, and cook from one pantry and bar. Pairing is explainable
            chemistry plus recipe practice. Occasions stays the planner — this layer
            is daily execution.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/inventory" className="btn btn-primary">
              Open inventory
              <ArrowRight className="size-4" />
            </Link>
            <Link to="/match" className="btn btn-secondary">
              What can I make
            </Link>
          </div>

          <dl className="mt-12 grid min-w-0 grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-4">
            {METRICS.map((m) => (
              <div key={m.l} className="min-w-0 bg-ink-deep px-4 py-5">
                <dt className="font-display text-2xl tabular-nums text-brass sm:text-3xl">{m.n}</dt>
                <dd className="label-mono mt-1 break-words">{m.l}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.to}
                to={s.to}
                className="panel-brass group flex flex-col rounded-lg p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="grid size-9 place-items-center rounded-sm bg-navy-100 text-heritage">
                      <Icon className="size-4" />
                    </span>
                    <span className="label-mono text-brass">{s.kicker}</span>
                  </div>
                  <span className="badge badge-comfortable">{s.verdict}</span>
                </div>
                <h2 className="mt-4 font-display text-2xl text-bone">{s.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brass gold-underline">
                  Open
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </section>

        <aside className="alert alert-info mt-10">
          Occasions remains the occasion planner — Architecture, Plan, Card. This
          layer handles daily execution: what is on the shelf, what pairs, and what
          you can make tonight.
        </aside>
      </div>
    </div>
  );
}
