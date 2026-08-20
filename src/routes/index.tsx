import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Camera, FlaskConical, Handshake, ScanSearch, Swords } from "lucide-react";
import heroGarnish from "@/assets/hero-garnish.jpg";
import figPantry from "@/assets/fig-pantry.jpg";
import figBar from "@/assets/fig-bar.jpg";
import figPrep from "@/assets/fig-prep.jpg";
import figMise from "@/assets/fig-mise.jpg";
import figPlated from "@/assets/fig-plated.jpg";

export const Route = createFileRoute("/")({ component: Home });

const SECTIONS = [
  {
    to: "/vision",
    kicker: "01",
    title: "Vision",
    body: "Scan a shelf or fridge, review every candidate, then commit. Bar reads cleaner; crowded pantries still need your eyes.",
    icon: Camera,
    verdict: "Live",
    image: figPantry,
    imageAlt: "Jars of preserved fruit and vegetables lined on a rustic pantry shelf",
  },
  {
    to: "/pairing",
    kicker: "02",
    title: "Pairing",
    body: "Molecular overlap plus recipe co-occurrence. Explainable scores, classic bridges, and unexpected chemistry.",
    icon: FlaskConical,
    verdict: "Live",
    image: figBar,
    imageAlt: "Iced citrus cocktail on a dark bar counter with bottles behind",
  },
  {
    to: "/inventory",
    kicker: "03",
    title: "Inventory + match",
    body: "Local-first pantry and bar. Review, edit, expiry ranking, Almost, and Smart Buy — food and drink together.",
    icon: ScanSearch,
    verdict: "Live",
    image: figPrep,
    imageAlt: "Organised meal-prep containers of vegetables, grains, and proteins",
  },
  {
    to: "/handoff",
    kicker: "04",
    title: "Occasions packet",
    body: "Availability Packet 1.0. You send it. No recipes, no allergen claims, no silent inference.",
    icon: Handshake,
    verdict: "Packet 1.0",
    image: figMise,
    imageAlt: "Overhead mise en place — chopped vegetables arranged on a cutting board",
  },
  {
    to: "/teardown",
    kicker: "05",
    title: "The field",
    body: "Home Bar Hero, Chefs AI, CompKitchen, pantry apps. The gap we own is unification + science + truth.",
    icon: Swords,
    verdict: "Clear gap",
    image: figPlated,
    imageAlt: "Artistically plated roasted vegetables on a white plate",
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
    <div>
      <section className="relative isolate overflow-hidden">
        <img
          src={heroGarnish}
          alt="Cocktail garnish station: citrus, herbs, spices, and botanicals ready for the pour"
          width={1800}
          height={1355}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="ink-veil absolute inset-0" />
        <div className="hairline-grid absolute inset-0 opacity-30" />
        <div className="relative app-shell py-16 sm:py-24">
          <p className="label-mono text-brass">Salty & Clever · Kitchen & Bar Intelligence</p>
          <h1 className="display-xl mt-5 max-w-4xl text-bone">
            See the shelf.
            <span className="block text-brass">Rank the pour.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/85 sm:text-lg">
            Scan, confirm, and cook from one pantry and bar. Pairing is explainable chemistry plus
            recipe practice. Occasions stays the planner — this layer is daily execution.
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
        </div>
      </section>

      <div className="app-shell py-10 sm:py-16">
        <dl className="grid min-w-0 grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.l} className="min-w-0 bg-ink-deep px-4 py-5">
              <dt className="font-display text-2xl tabular-nums text-brass sm:text-3xl">{m.n}</dt>
              <dd className="label-mono mt-1 break-words">{m.l}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.to}
                to={s.to}
                className="panel-brass group flex flex-col overflow-hidden rounded-lg"
              >
                <div className="relative h-36 overflow-hidden sm:h-40">
                  <img
                    src={s.image}
                    alt={s.imageAlt}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-5">
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
                </div>
              </Link>
            );
          })}
        </section>

        <aside className="alert alert-info mt-10">
          Occasions remains the occasion planner — Architecture, Plan, Card. This layer handles
          daily execution: what is on the shelf, what pairs, and what you can make tonight.
        </aside>
      </div>
    </div>
  );
}
