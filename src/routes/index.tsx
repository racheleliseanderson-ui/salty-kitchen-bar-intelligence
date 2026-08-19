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

function Home() {
  return (
    <div className="app-shell py-8 sm:py-12">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="eyebrow">Kitchen & Bar · Salty & Clever</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.05] sm:text-5xl">
            See the shelf. Rank the pour. Hand off the occasion.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-deep sm:text-lg">
            Scan, confirm, and cook from one pantry and bar. Pairing is explainable
            chemistry plus recipe practice. Occasions stays the planner — this layer
            is daily execution.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/inventory" className="btn btn-primary">
              Open inventory
              <ArrowRight className="size-4" />
            </Link>
            <Link to="/match" className="btn btn-secondary">
              What can I make
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { n: "90s", l: "Bar shelf reads" },
            { n: "65–75%", l: "Hard fridge scenes" },
            { n: "35/65", l: "Molecule + recipe" },
            { n: "1.0", l: "Availability packet" },
          ].map((m) => (
            <div key={m.l} className="metric">
              <span className="metric-value">{m.n}</span>
              <span className="metric-label">{m.l}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.to}
              to={s.to}
              className="panel-surface group flex flex-col p-5 transition-shadow hover:shadow-lift"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="grid size-9 place-items-center rounded-lg bg-navy-100 text-heritage">
                    <Icon className="size-4" />
                  </span>
                  <span className="section-label">{s.kicker}</span>
                </div>
                <span className="badge badge-comfortable">{s.verdict}</span>
              </div>
              <h2 className="mt-4 font-display text-2xl">{s.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-deep">{s.body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-heritage">
                Open
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </section>

      <aside className="alert alert-info mt-8">
        Occasions remains the occasion planner — Architecture, Plan, Card. This
        layer handles daily execution: what is on the shelf, what pairs, and what
        you can make tonight.
      </aside>
    </div>
  );
}
