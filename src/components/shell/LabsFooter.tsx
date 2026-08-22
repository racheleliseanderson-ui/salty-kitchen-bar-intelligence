/**
 * Northern Lantern House Labs footer — Fleet Shell Standard v1 §5.
 *
 * This is the ONLY place in the app where the fleet is enumerated. Cross-app
 * links do not belong anywhere else in the page. The gold hairline and the
 * "Northern Lantern House Labs" wordmark are the house layer; they use
 * --house-gold and never the app's own brass accent.
 */

const HOUSE = "https://northernlanternhouse.com";

type App = { label: string; href: string; current?: boolean };
type Entry = { label: string; href: string; apps?: App[] };

const THIS_PUBLICATION: Entry[] = [
  {
    label: "Salty & Clever",
    href: "https://saltnotes.blog",
    apps: [
      { label: "Kitchen & Bar", href: "https://kitchen.saltnotes.blog", current: true },
      { label: "Salty Desk", href: "https://salty.saltnotes.blog" },
      { label: "Menu Builder", href: "https://occasion.saltnotes.blog/architecture" },
      { label: "Occasion OS", href: "https://occasion.saltnotes.blog" },
      { label: "Restaurant Intelligence", href: "https://deepdish.saltnotes.blog" },
    ],
  },
];

const FLEET: Entry[] = [
  {
    label: "Tangled Thistle",
    href: "https://tangledthistle.blog",
    apps: [
      { label: "Atmosphere OS", href: "https://atmosphere.tangledthistle.blog" },
      { label: "Venue Intelligence", href: "https://venue.tangledthistle.blog" },
    ],
  },
  {
    label: "Vanity or Vice",
    href: "https://vanityvice.blog",
    apps: [
      { label: "Makeup Intelligence", href: "https://makeup.vanityvice.blog" },
      { label: "Spa Intelligence", href: "https://spa.vanityvice.blog" },
    ],
  },
  { label: "Room for Drama", href: "https://dramaroom.blog" },
  { label: "Hook the Horizon", href: "https://hookthehorizon.blog" },
  { label: "Elsewhere, Apparently", href: "https://the-money-apparently.vercel.app" },
];

function Out({
  href,
  children,
  current,
}: {
  href: string;
  children: React.ReactNode;
  current?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-current={current ? "page" : undefined}
      className="gold-underline break-words hover:text-brass"
    >
      {children}
    </a>
  );
}

function Column({ title, entries }: { title: string; entries: Entry[] }) {
  return (
    <div className="min-w-0">
      <p className="label-mono">{title}</p>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {entries.map((entry) => (
          <li key={entry.label}>
            <Out href={entry.href}>{entry.label}</Out>
            {entry.apps ? (
              <ul className="mt-1 mb-2 space-y-1 border-l border-border/60 pl-3">
                {entry.apps.map((app) => (
                  <li key={app.label}>
                    <Out href={app.href} current={app.current}>
                      {app.label}
                    </Out>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LabsFooter() {
  return (
    <footer className="bg-ink-deep">
      <div
        aria-hidden="true"
        className="h-px w-full"
        style={{ background: "var(--color-house-gold)" }}
      />
      <div className="app-shell py-14">
        <h2
          className="font-display text-3xl tracking-tight"
          style={{ color: "var(--color-house-gold-ink)" }}
        >
          Northern Lantern House Labs
        </h2>

        <div className="mt-8 grid gap-10 md:grid-cols-3">
          <div className="min-w-0">
            <p className="label-mono">The House</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Independent publications and the decision instruments built for them.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              <Out href={HOUSE}>northernlanternhouse.com</Out>
            </p>
          </div>

          <Column title="This publication" entries={THIS_PUBLICATION} />
          <Column title="Across the fleet" entries={FLEET} />
        </div>

        <p className="mt-12 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          Planning tool, not a safety system. Scan suggestions stay suggestions until you confirm.
          Pairing is a curated molecular and co-occurrence model, not a lab assay. No allergen,
          nutrition, or pricing claims. Inventory stays on this device unless you sign in and save.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          <span>&copy; 2026 Northern Lantern House</span>
          <Out href={HOUSE}>Legal &amp; Accessibility</Out>
          <Out href={HOUSE}>Support</Out>
          <span className="label-mono ml-auto">Layer 0.1.0 &middot; Packet 1.0</span>
        </div>
      </div>
    </footer>
  );
}
