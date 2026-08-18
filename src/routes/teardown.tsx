import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/kbi/PageHeader";
import { COMPETITORS, GAPS } from "@/lib/kbi/competitors";

export const Route = createFileRoute("/teardown")({ component: TeardownPage });

function TeardownPage() {
  return (
    <div className="app-shell space-y-8 py-8">
      <PageHeader
        kicker="05 · Competitive field"
        title="The market proves the pieces. Nobody owns the union."
        lede="Home Bar Hero owns bottle vision. Chefs AI owns kitchen chemistry. Pantry apps own lists and then lose the truth. The layer we can ship is unified inventory, persistent edit UX, and an explainable pairing graph."
      />

      <div className="overflow-x-auto panel-surface">
        <table className="min-w-[36rem] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-surface">
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Food</th>
              <th className="px-4 py-3 font-semibold">Bar</th>
              <th className="px-4 py-3 font-semibold">Vision</th>
              <th className="px-4 py-3 font-semibold">Chemistry</th>
            </tr>
          </thead>
          <tbody>
            {COMPETITORS.map((c) => (
              <tr key={c.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <Cell on={c.food} />
                <Cell on={c.bar} />
                <Cell on={c.vision} />
                <Cell on={c.chemistry} />
              </tr>
            ))}
            <tr className="bg-navy-100">
              <td className="px-4 py-3 font-semibold">This layer</td>
              <Cell on />
              <Cell on />
              <Cell on />
              <Cell on />
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {COMPETITORS.map((c) => (
          <article key={c.id} className="panel-surface p-5">
            <p className="section-label">{c.role}</p>
            <h2 className="mt-1 font-display text-2xl">{c.name}</h2>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-stone">Strengths</p>
            <ul className="mt-2 space-y-1.5 text-sm text-stone-deep">
              {c.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-stone">Limits</p>
            <ul className="mt-2 space-y-1.5 text-sm text-stone-deep">
              {c.limits.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <section className="panel-surface p-5 sm:p-6">
        <p className="section-label">Gaps we can own</p>
        <ol className="mt-4 space-y-3">
          {GAPS.map((gap, i) => (
            <li key={gap} className="flex gap-3">
              <span className="tabular font-semibold text-heritage">{i + 1}</span>
              <span className="text-sm leading-relaxed text-stone-deep">{gap}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link to="/inventory" className="btn btn-primary">
          Run the prototype
        </Link>
        <Link to="/" className="btn btn-secondary">
          Back to the report
        </Link>
      </div>
    </div>
  );
}

function Cell({ on }: { on: boolean }) {
  return (
    <td className="px-4 py-3">
      <span className={on ? "badge badge-comfortable" : "badge badge-neutral"}>{on ? "Yes" : "No"}</span>
    </td>
  );
}
