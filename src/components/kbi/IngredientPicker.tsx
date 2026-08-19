import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { PROFILES } from "@/lib/kbi/flavors";
import { cn } from "@/lib/utils";

function rankMatch(displayName: string, name: string, category: string, q: string): number {
  const d = displayName.toLowerCase();
  if (d === q || name === q) return 0;
  if (d.startsWith(q) || name.startsWith(q)) return 1;
  if (d.includes(q) || name.includes(q)) return 2;
  if (category.includes(q)) return 3;
  return 4;
}

export function filterProfiles(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return PROFILES;
  return PROFILES.filter(
    (p) =>
      p.displayName.toLowerCase().includes(q) ||
      p.name.includes(q) ||
      p.category.includes(q),
  ).sort(
    (a, b) =>
      rankMatch(a.displayName, a.name, a.category, q) -
        rankMatch(b.displayName, b.name, b.category, q) ||
      a.displayName.localeCompare(b.displayName),
  );
}

export function IngredientPicker({
  label,
  value,
  onChange,
  id,
}: {
  label: string;
  value: string;
  onChange: (name: string) => void;
  id: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const selected = PROFILES.find((p) => p.name === value);
  const editing = open || query.length > 0;

  const matches = useMemo(() => filterProfiles(query), [query]);

  function apply(name: string) {
    onChange(name);
    setQuery("");
    setOpen(false);
  }

  function onType(raw: string) {
    setQuery(raw);
    setOpen(true);
    const next = filterProfiles(raw);
    setActive(0);
    const q = raw.trim().toLowerCase();
    if (!q || next.length === 0) return;
    const exact = next.find(
      (p) => p.displayName.toLowerCase() === q || p.name === q,
    );
    const pick = exact ?? next[0]!;
    if (pick.name !== value) onChange(pick.name);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, Math.max(0, matches.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = matches[active] ?? matches[0];
      if (pick) apply(pick.name);
    } else if (e.key === "Escape") {
      setQuery("");
      setOpen(false);
    }
  }

  return (
    <div ref={wrapRef} className="relative text-sm font-semibold">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className="field-input mt-1"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder="Type to search…"
        value={editing ? query : (selected?.displayName ?? "")}
        onChange={(e) => onType(e.target.value)}
        onFocus={() => {
          setOpen(true);
          setQuery("");
          setActive(0);
        }}
        onBlur={() => {
          window.setTimeout(() => {
            if (!wrapRef.current?.contains(document.activeElement)) {
              setOpen(false);
              setQuery("");
            }
          }, 80);
        }}
        onKeyDown={onKeyDown}
      />
      {selected && !editing && (
        <p className="mt-1 text-xs font-normal text-muted">
          {selected.category}
          {selected.coverage === "sparse" ? " · sparse" : ""}
        </p>
      )}
      {open && (
        <ul
          id={`${id}-list`}
          role="listbox"
          className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-md border border-line bg-ivory shadow-lift"
        >
          {matches.length === 0 ? (
            <li className="px-3 py-2 text-sm font-normal text-muted">No match in this subset.</li>
          ) : (
            matches.slice(0, 48).map((p, i) => (
              <li key={p.name} role="option" aria-selected={p.name === value}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2 text-left text-sm font-normal",
                    i === active || p.name === value ? "bg-navy-100 text-heritage" : "hover:bg-surface",
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => apply(p.name)}
                >
                  <span>
                    {p.displayName}
                    {p.coverage === "sparse" ? (
                      <span className="text-muted"> (sparse)</span>
                    ) : null}
                  </span>
                  <span className="text-xs text-muted">{p.category}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
