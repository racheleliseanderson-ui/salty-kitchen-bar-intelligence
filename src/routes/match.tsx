import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/kbi/PageHeader";
import {
  buildBreakdown,
  contrastHits,
  previewAddIngredient,
  rankRecipes,
  smartBuys,
  useFirstItems,
  urgencyLabel,
  type RankSort,
} from "@/lib/kbi/match";
import { useInventory } from "@/lib/kbi/store";
import type {
  ContrastExplanation,
  CounterfactualPreview,
  InventoryItem,
  MatchHit,
  RankBreakdown,
  RankFactor,
  SmartBuy,
} from "@/lib/kbi/types";
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
        lede="Ranked from your local inventory — match × expiry urgency × flavor harmony, with spirit and produce hierarchy. Open Why this rank for factors, Why above next for a head-to-head, and If you add this on Smart Buy for a live counterfactual."
      />

      <section className="panel-surface overflow-hidden">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          onClick={() => setShowHow((v) => !v)}
          aria-expanded={showHow}
        >
          <div>
            <p className="section-label">How ranking works</p>
            <p className="mt-1 text-sm text-stone-deep">
              Composite = coverage × expiry boost × flavor harmony × hierarchy penalty + time bias.
              Every card can show the factors that moved it.
            </p>
          </div>
          <span className="badge badge-comfortable shrink-0">{showHow ? "Hide" : "Details"}</span>
        </button>
        {showHow ? (
          <div className="border-t border-line px-5 py-4 text-sm leading-relaxed text-stone-deep">
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                <strong>Coverage</strong> — share of required ingredients on hand (exact or hierarchy).
              </li>
              <li>
                <strong>Expiry</strong> — boost when the recipe uses something due within ~2 weeks.
              </li>
              <li>
                <strong>Flavor</strong> — 35% molecular overlap + 65% recipe co-occurrence among
                on-hand required ingredients; strongest pair is named on the card.
              </li>
              <li>
                <strong>Hierarchy</strong> — rye may cover bourbon, lemon may cover lime; each swap
                applies a small penalty so exact matches still win ties.
              </li>
              <li>
                <strong>Time</strong> — slight bonus under 15–25 minutes so weeknight options surface.
              </li>
            </ol>
            <p className="mt-3">
              Cards also support <strong>contrast</strong> (why this ranks above the next card) and
              Smart Buy supports <strong>counterfactuals</strong> (if you add this bottle, how many
              recipes move to Now). Both use the same scoring function — no separate model.
            </p>
            <p className="mt-2">
              <Link to="/inventory" className="underline underline-offset-2">
                Edit inventory
              </Link>{" "}
              anytime — match and explanations update immediately.
            </p>
          </div>
        ) : null}
      </section>

      {empty ? (
        <section className="panel-surface p-6 text-center">
          <p className="font-display text-2xl">No inventory yet</p>
          <p className="mt-2 text-sm text-stone-deep">
            Restore the starter pantry or add a few items so ranking has something true to work with.
          </p>
          <Link to="/inventory" className="btn btn-primary mt-4 inline-flex">
            Open inventory
          </Link>
        </section>
      ) : (
        <>
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

          <section>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="section-label">Can make now</p>
                <h2 className="mt-1 font-display text-2xl">
                  {now.length === 0 ? "Nothing fully covered yet" : `${now.length} ready to cook or pour`}
                </h2>
              </div>
              {now.length > NOW_PREVIEW ? (
                <button type="button" className="chip" onClick={() => setShowAllNow((v) => !v)}>
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
                {visibleNow.map((hit, i) => (
                  <HitCard
                    key={hit.recipe.id}
                    hit={hit}
                    items={items}
                    peer={visibleNow[i + 1]}
                  />
                ))}
              </div>
            )}
          </section>

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
                <button type="button" className="chip" onClick={() => setShowAllAlmost((v) => !v)}>
                  {showAllAlmost ? "Show fewer" : `Show all ${almost.length}`}
                </button>
              ) : null}
            </div>
            {almost.length > 0 ? (
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {visibleAlmost.map((hit, i) => (
                  <HitCard
                    key={hit.recipe.id}
                    hit={hit}
                    items={items}
                    peer={visibleAlmost[i + 1]}
                  />
                ))}
              </div>
            ) : null}
          </section>

          <section className="panel-surface p-5 sm:p-6">
            <p className="section-label">Smart Buy</p>
            <h2 className="mt-1 font-display text-2xl">One addition, most new options</h2>
            <p className="mt-2 max-w-2xl text-sm text-stone-deep">
              Ranked by how many curated recipes a single missing ingredient would unlock. Open{" "}
              <strong>If you add this</strong> for a counterfactual: how many cards move to Now under
              your current filters — same ranker, simulated inventory.
            </p>
            {buys.length === 0 ? (
              <p className="mt-4 text-sm text-stone-deep">
                Your inventory already covers most one-miss gaps, or the filter is narrow. Clear
                time/skill filters to see more unlocks.
              </p>
            ) : (
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {buys.map((buy, i) => (
                  <SmartBuyCard
                    key={buy.ingredient}
                    buy={buy}
                    rank={i + 1}
                    items={items}
                    kind={kind}
                  />
                ))}
              </ul>
            )}
          </section>

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

function HitCard({
  hit,
  items,
  peer,
}: {
  hit: MatchHit;
  items: InventoryItem[];
  peer?: MatchHit;
}) {
  const [open, setOpen] = useState(false);
  const [openContrast, setOpenContrast] = useState(false);
  const breakdown = useMemo(() => buildBreakdown(hit, items), [hit, items]);
  const contrast = useMemo(
    () => (peer ? contrastHits(hit, peer, items) : null),
    [hit, peer, items],
  );
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
          title={`Composite ${hit.composite}`}
        >
          {pct}%
        </span>
      </div>

      <p className="mt-2 text-sm text-stone-deep">{hit.recipe.notes}</p>

      <p className="mt-2 text-xs leading-relaxed text-muted">{breakdown.summary}</p>

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

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        <button
          type="button"
          className="text-xs font-medium text-heritage underline-offset-2 hover:underline"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? "Hide ranking factors" : "Why this rank"}
        </button>
        {peer && contrast ? (
          <button
            type="button"
            className="text-xs font-medium text-heritage underline-offset-2 hover:underline"
            onClick={() => setOpenContrast((v) => !v)}
            aria-expanded={openContrast}
          >
            {openContrast ? "Hide comparison" : `Why above ${peer.recipe.name}`}
          </button>
        ) : null}
      </div>

      {open ? <RankPanel breakdown={breakdown} composite={hit.composite} /> : null}
      {openContrast && contrast ? <ContrastPanel contrast={contrast} /> : null}
    </article>
  );
}

function RankPanel({ breakdown, composite }: { breakdown: RankBreakdown; composite: number }) {
  return (
    <div className="mt-3 space-y-3 rounded-lg border border-line bg-surface/60 p-3">
      <p className="text-[0.7rem] font-medium uppercase tracking-wide text-muted">
        Score {composite} · factor breakdown
      </p>
      <ul className="space-y-2.5">
        {breakdown.factors.map((f) => (
          <FactorRow key={f.key} factor={f} />
        ))}
      </ul>
      {breakdown.flavor.topPair ? (
        <p className="text-xs text-stone-deep">
          Strongest on-hand pair:{" "}
          <span className="font-medium">
            {breakdown.flavor.topPair.a} + {breakdown.flavor.topPair.b}
          </span>{" "}
          ({breakdown.flavor.topPair.score.toFixed(2)} · co {breakdown.flavor.topPair.cooccurrence.toFixed(2)} · mol{" "}
          {breakdown.flavor.topPair.molecular.toFixed(2)})
        </p>
      ) : null}
      {breakdown.expiry.items.length > 0 ? (
        <p className="text-xs text-burnished">
          Expiry drivers:{" "}
          {breakdown.expiry.items
            .map((u) =>
              u.days !== null && u.days < 0
                ? `${u.displayName} (past)`
                : u.days !== null
                  ? `${u.displayName} (${u.days}d)`
                  : u.displayName,
            )
            .join(", ")}
        </p>
      ) : null}
      <p className="font-mono text-[0.65rem] leading-relaxed text-muted">{breakdown.formula}</p>
    </div>
  );
}

function FactorRow({ factor }: { factor: RankFactor }) {
  const barColor =
    factor.impact === "up"
      ? "bg-heritage"
      : factor.impact === "down"
        ? "bg-burnished"
        : "bg-stone";

  return (
    <li>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-ink">{factor.label}</span>
        <span
          className={cn(
            "text-[0.65rem]",
            factor.impact === "up" && "text-heritage",
            factor.impact === "down" && "text-burnished",
            factor.impact === "neutral" && "text-muted",
          )}
        >
          {factor.impact === "up" ? "boost" : factor.impact === "down" ? "penalty" : "neutral"}
        </span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line">
        <div
          className={cn("h-full rounded-full transition-[width]", barColor)}
          style={{ width: `${Math.round(Math.min(1, Math.max(0, factor.strength)) * 100)}%` }}
        />
      </div>
      <p className="mt-1 text-[0.7rem] leading-snug text-stone-deep">{factor.detail}</p>
    </li>
  );
}

function ContrastPanel({ contrast }: { contrast: ContrastExplanation }) {
  return (
    <div className="mt-3 space-y-3 rounded-lg border border-line bg-surface/60 p-3">
      <p className="text-[0.7rem] font-medium uppercase tracking-wide text-muted">
        Head-to-head · Δ composite {contrast.compositeDelta >= 0 ? "+" : ""}
        {contrast.compositeDelta}
      </p>
      <p className="text-xs leading-relaxed text-stone-deep">{contrast.summary}</p>
      <ul className="space-y-2">
        {contrast.deltas.map((d) => (
          <li key={d.key} className="text-[0.7rem] leading-snug">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium text-ink">{d.label}</span>
              <span
                className={cn(
                  "text-[0.65rem]",
                  d.advantage === "winner" && "text-heritage",
                  d.advantage === "loser" && "text-burnished",
                  d.advantage === "tie" && "text-muted",
                )}
              >
                {d.advantage === "winner"
                  ? "favors this"
                  : d.advantage === "loser"
                    ? "favors next"
                    : "tie"}
              </span>
            </div>
            <p className="mt-0.5 text-stone-deep">
              <span className="text-ink">{d.winnerValue}</span>
              <span className="text-muted"> vs </span>
              <span>{d.loserValue}</span>
            </p>
            <p className="mt-0.5 text-muted">{d.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SmartBuyCard({
  buy,
  rank,
  items,
  kind,
}: {
  buy: SmartBuy;
  rank: number;
  items: InventoryItem[];
  kind: "all" | "food" | "cocktail";
}) {
  const [open, setOpen] = useState(false);
  const preview = buy.unlocks.slice(0, 4);
  const more = buy.unlocks.length - preview.length;

  const cf = useMemo((): CounterfactualPreview | null => {
    if (!open) return null;
    return previewAddIngredient(items, buy.ingredient, { kind });
  }, [open, items, buy.ingredient, kind]);

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

      <button
        type="button"
        className="mt-3 self-start text-xs font-medium text-heritage underline-offset-2 hover:underline"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? "Hide counterfactual" : "If you add this"}
      </button>

      {open && cf ? (
        <div className="mt-3 space-y-2 rounded-lg border border-line bg-surface/60 p-3">
          <p className="text-[0.7rem] font-medium uppercase tracking-wide text-muted">
            Counterfactual · same ranker, simulated inventory
          </p>
          <p className="text-xs leading-relaxed text-stone-deep">{cf.summary}</p>
          <div className="flex flex-wrap gap-3 text-xs">
            <span>
              Now <span className="font-semibold tabular">{cf.currentNow}</span>
              <span className="text-muted"> → </span>
              <span className="font-semibold tabular text-heritage">{cf.projectedNow}</span>
              {cf.deltaNow > 0 ? (
                <span className="ml-1 text-heritage">(+{cf.deltaNow})</span>
              ) : null}
            </span>
            <span className="text-muted">
              Almost {cf.currentAlmost} → {cf.projectedAlmost}
            </span>
          </div>
          {cf.newlyNow.length > 0 ? (
            <div>
              <p className="text-[0.65rem] uppercase tracking-wide text-muted">Moves to Now</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {cf.newlyNow.slice(0, 8).map((name) => (
                  <span
                    key={name}
                    className="rounded-full bg-navy-100 px-2 py-0.5 text-[0.7rem] text-heritage"
                  >
                    {name}
                  </span>
                ))}
                {cf.newlyNow.length > 8 ? (
                  <span className="rounded-full px-2 py-0.5 text-[0.7rem] text-muted">
                    +{cf.newlyNow.length - 8} more
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}
          <p className="text-[0.65rem] text-muted">
            Unlock list above is one-miss recipes; the counterfactual re-runs full ranking after a
            virtual add, so counts can differ slightly from the unlock tally.
          </p>
        </div>
      ) : null}
    </li>
  );
}
