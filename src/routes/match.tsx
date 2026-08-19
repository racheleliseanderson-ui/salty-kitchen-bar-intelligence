import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/kbi/PageHeader";
import {
  explainRank,
  rankRecipes,
  smartBuys,
  urgentForHit,
  useFirstItems,
  urgencyLabel,
  type RankSort,
} from "@/lib/kbi/match";
import { useInventory } from "@/lib/kbi/store";
import type { MatchHit, SmartBuy } from "@/lib/kbi/types";
import { cn, daysUntil, formatDate } from "@/lib/utils";

export const Route = createFileRoute("/match")({ component: MatchPage });

const NOW_PREVIEW = 10;
const ALMOST_PREVIEW = 6;

function MatchPage() {
  const items = useInventory((s) => s.items);
  const hydrated = useInventory((s) => s.hydrated);

  const [kind, setKind] = useState<"all" | "food" | "cocktail">("all");
  const [maxMinutes, setMaxMinutes] = useState<number | null>(null);
  const [skill, setSkill] = useState<"all" | "easy" | "medium" | "involved">("all");
  const [sort, setSort] = useState<RankSort>("best");
  const [showAllNow, setShowAllNow] = useState(false);
  const [showAllAlmost, setShowAllAlmost] = useState(false);
  const [showHow, setShowHow] = useState(false);

  const hits = useMemo(
    () => rankRecipes(items, { kind, maxMinutes, skill, sort }),
    [items, kind, maxMinutes, skill, sort],
  );
  const buys = useMemo(() => smartBuys(items, 8), [items]);
  const now = useMemo(() => hits.filter((h) => h.tier === "now"), [hits]);
  const almost = useMemo(() => hits.filter((h) => h.tier === "almost"), [hits]);
  const useFirst = useMemo(() => useFirstItems(items, hits, 5), [items, hits]);

  const visibleNow = showAllNow ? now : now.slice(0, NOW_PREVIEW);
  const visibleAlmost = showAllAlmost ? almost : almost.slice(0, ALMOST_PREVIEW);

  const empty = hydrated && items.length === 0;

  return (
    <div className="app-shell space-y-10 py-8">
      <PageHeader
        kicker="03 · Match"
        title="What you can make now, almost, and with one bottle."
        lede="Ranked from your local inventory — match × expiry urgency × flavor harmony, with spirit and produce hierarchy. Nothing is generated. The corpus is curated."
      />

      {/* How it works */}
      <section className="panel-surface overflow-hidden">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          onClick={() => setShowHow((v) => !v)}
          aria-expanded={showHow}
        >
          <div>
            <p className="section-label">How to use this page</p>
            <p className="mt-1 text-sm text-stone-deep">
              Start with <strong>Now</strong>, check <strong>Use first</strong> for near-expiry,
              then scan <strong>Almost</strong> and <strong>Smart Buy</strong> if you want more options.
            </p>
          </div>
          <span className="badge badge-comfortable shrink-0">{showHow ? "Hide" : "Details"}</span>
        </button>
        {showHow ? (
          <div className="border-t border-line px-5 py-4 text-sm leading-relaxed text-stone-deep">
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                <strong>Now</strong> — every required ingredient is on hand (or covered by hierarchy,
                e.g. rye for bourbon).
              </li>
              <li>
                <strong>Almost</strong> — one or two ingredients short. Missing items are listed on
                each card.
              </li>
              <li>
                <strong>Smart Buy</strong> — a single addition that unlocks the most new recipes.
                Prefer these over random shopping.
              </li>
              <li>
                Ranking boosts recipes that use food near expiry and that have stronger flavor
                co-occurrence. Filter by time or skill when you want a shorter list.
              </li>
            </ol>
            <p className="mt-3">
              Inventory is local-first.{" "}
              <Link to="/inventory" className="underline underline-offset-2">
                Edit what you have
              </Link>{" "}
              anytime — match updates immediately.
            </p>
          </div>
        ) : null}
      </section>

      {empty ? (
        <section className="panel-surface p-6 text-center">
          <p className="font-display text-2xl">No inventory yet</p>
          <p className="mt-2 text-sm text-stone-deep">
            Load the demo household or add a few items so ranking has something true to work with.
          </p>
          <Link to="/inventory" className="btn btn-primary mt-4 inline-flex">
            Open inventory
          </Link>
        </section>
      ) : (
        <>
          {/* Controls */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {(["all", "food", "cocktail"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  className={cn("chip", kind === k && "is-active")}
                  aria-pressed={kind === k}
                  onClick={() => setKind(k)}
                >
                  {k === "all" ? "Food + bar" : k}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { label: "Any time", value: null },
                  { label: "≤ 15 min", value: 15 },
                  { label: "≤ 30 min", value: 30 },
                ] as const
              ).map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  className={cn("chip", maxMinutes === opt.value && "is-active")}
                  aria-pressed={maxMinutes === opt.value}
                  onClick={() => setMaxMinutes(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
              {(["all", "easy", "medium"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={cn("chip", skill === s && "is-active")}
                  aria-pressed={skill === s}
                  onClick={() => setSkill(s)}
                >
                  {s === "all" ? "Any skill" : s}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: "best" as const, label: "Best match" },
                  { id: "expiry" as const, label: "Use first" },
                  { id: "quickest" as const, label: "Quickest" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={cn("chip", sort === opt.id && "is-active")}
                  aria-pressed={sort === opt.id}
                  onClick={() => setSort(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="metric">
              <span className="metric-value">{hydrated ? now.length : "—"}</span>
              <span className="metric-label">Can make now</span>
            </div>
            <div className="metric">
              <span className="metric-value">{hydrated ? almost.length : "—"}</span>
              <span className="metric-label">Almost (1–2 missing)</span>
            </div>
            <div className="metric">
              <span className="metric-value">{hydrated ? items.length : "—"}</span>
              <span className="metric-label">Inventory items</span>
            </div>
          </div>

          {/* Use first — near-expiry drivers */}
          {useFirst.length > 0 ? (
            <section className="panel-surface border-l-4 border-l-burnished p-5">
              <p className="section-label">Use first</p>
              <h2 className="mt-1 font-display text-xl">Near-expiry items already unlocking recipes</h2>
              <p className="mt-1 text-sm text-stone-deep">
                These are on hand and due soon. Sorting by <strong>Use first</strong> prioritizes
                recipes that consume them.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {useFirst.map((item) => {
                  const days = daysUntil(item.expiry);
                  const urg = urgencyLabel(item.expiry);
                  return (
                    <li
                      key={item.id}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm",
                        urg === "high" && "border-burnished bg-burnished/10",
                        urg === "medium" && "border-gold-700/40 bg-gold-700/5",
                      )}
                    >
                      <span className="font-medium">{item.displayName}</span>
                      <span className="ml-2 text-xs text-muted">
                        {days !== null && days < 0
                          ? "past date"
                          : days !== null
                            ? `${days}d`
                            : formatDate(item.expiry)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          {/* Now */}
          <section>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="section-label">Can make now</p>
                <h2 className="mt-1 font-display text-2xl">
                  {now.length === 0 ? "Nothing fully covered yet" : `${now.length} ready to cook or pour`}
                </h2>
              </div>
              {now.length > NOW_PREVIEW ? (
                <button
                  type="button"
                  className="chip"
                  onClick={() => setShowAllNow((v) => !v)}
                >
                  {showAllNow ? "Show fewer" : `Show all ${now.length}`}
                </button>
              ) : null}
            </div>
            {now.length === 0 ? (
              <p className="mt-3 text-sm text-stone-deep">
                Add more staples in{" "}
                <Link to="/inventory" className="underline underline-offset-2">
                  inventory
                </Link>{" "}
                or check Almost and Smart Buy below.
              </p>
            ) : (
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {visibleNow.map((hit) => (
                  <HitCard key={hit.recipe.id} hit={hit} items={items} />
                ))}
              </div>
            )}
          </section>

          {/* Almost */}
          <section>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="section-label">Almost</p>
                <h2 className="mt-1 font-display text-2xl">
                  {almost.length === 0
                    ? "No one- or two-ingredient gaps"
                    : `${almost.length} close — one or two short`}
                </h2>
              </div>
              {almost.length > ALMOST_PREVIEW ? (
                <button
                  type="button"
                  className="chip"
                  onClick={() => setShowAllAlmost((v) => !v)}
                >
                  {showAllAlmost ? "Show fewer" : `Show all ${almost.length}`}
                </button>
              ) : null}
            </div>
            {almost.length > 0 ? (
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {visibleAlmost.map((hit) => (
                  <HitCard key={hit.recipe.id} hit={hit} items={items} />
                ))}
              </div>
            ) : null}
          </section>

          {/* Smart Buy */}
          <section className="panel-surface p-5 sm:p-6">
            <p className="section-label">Smart Buy</p>
            <h2 className="mt-1 font-display text-2xl">One addition, most new options</h2>
            <p className="mt-2 max-w-2xl text-sm text-stone-deep">
              Ranked by how many curated recipes a single missing ingredient would unlock. Prefer
              these over buying at random — then re-check Now after you add them to inventory.
            </p>
            {buys.length === 0 ? (
              <p className="mt-4 text-sm text-stone-deep">
                Your inventory already covers most one-miss gaps, or the filter is narrow. Clear
                time/skill filters to see more unlocks.
              </p>
            ) : (
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {buys.map((buy, i) => (
                  <SmartBuyCard key={buy.ingredient} buy={buy} rank={i + 1} />
                ))}
              </ul>
            )}
          </section>

          {/* Next step */}
          <section className="flex flex-wrap items-center gap-3">
            <Link to="/handoff" className="btn btn-primary">
              Send availability to Occasions
            </Link>
            <Link to="/inventory" className="btn btn-secondary">
              Edit inventory
            </Link>
            <Link to="/pairing" className="btn btn-secondary">
              Explore pairing
            </Link>
          </section>
        </>
      )}
    </div>
  );
}

function HitCard({ hit, items }: { hit: MatchHit; items: ReturnType<typeof useInventory.getState>["items"] }) {
  const why = explainRank(hit);
  const urgent = urgentForHit(hit, items);
  const pct = Math.round(hit.matchPct * 100);

  return (
    <article className="panel-surface flex flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="section-label">{hit.recipe.kind}</span>
            <span className="text-xs text-muted">
              {hit.recipe.minutes} min · {hit.recipe.skill}
            </span>
            {hit.expiryBoost >= 0.4 ? (
              <span className="badge badge-comfortable text-[0.65rem]">Use soon</span>
            ) : null}
          </div>
          <h3 className="mt-1 font-display text-xl leading-snug">{hit.recipe.name}</h3>
        </div>
        <span
          className={cn(
            "badge shrink-0 tabular",
            hit.tier === "now" ? "badge-comfortable" : "border border-line bg-transparent",
          )}
        >
          {pct}%
        </span>
      </div>

      <p className="mt-2 text-sm text-stone-deep">{hit.recipe.notes}</p>

      <p className="mt-2 text-xs leading-relaxed text-muted">{why}</p>

      {urgent.length > 0 ? (
        <p className="mt-2 text-xs text-burnished">
          Near expiry: {urgent.map((u) => u.displayName).join(", ")}
        </p>
      ) : null}

      {hit.substituted.length > 0 ? (
        <p className="mt-2 text-xs text-gold-700">
          Hierarchy:{" "}
          {hit.substituted.map((s) => `${s.used} for ${s.needed}`).join(", ")}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {hit.have.map((name) => (
          <span
            key={`have-${name}`}
            className="rounded-full bg-navy-100 px-2 py-0.5 text-[0.7rem] text-heritage"
          >
            {name}
          </span>
        ))}
        {hit.missing.map((name) => (
          <span
            key={`miss-${name}`}
            className="rounded-full border border-burnished/40 px-2 py-0.5 text-[0.7rem] text-burnished"
          >
            need {name}
          </span>
        ))}
      </div>
    </article>
  );
}

function SmartBuyCard({ buy, rank }: { buy: SmartBuy; rank: number }) {
  const preview = buy.unlocks.slice(0, 4);
  const more = buy.unlocks.length - preview.length;

  return (
    <li className="panel-inset flex flex-col p-4">
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-xs tabular text-muted">#{rank}</span>
          <p className="font-semibold capitalize">{buy.ingredient}</p>
        </div>
        <span className="badge badge-comfortable">
          {buy.unlocks.length} unlock{buy.unlocks.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {preview.map((name) => (
          <span
            key={name}
            className="rounded-full border border-line px-2 py-0.5 text-[0.7rem] text-stone-deep"
          >
            {name}
          </span>
        ))}
        {more > 0 ? (
          <span className="rounded-full px-2 py-0.5 text-[0.7rem] text-muted">+{more} more</span>
        ) : null}
      </div>
    </li>
  );
}
