import { Contrast, Palette } from "lucide-react";
import { MODES, useColorSafe, useDisplayMode } from "@/hooks/use-theme";

export function DisplayControls() {
  const { mode, setMode, cycle } = useDisplayMode();
  const current = MODES.find((m) => m.value === mode)!;

  return (
    <div className="flex min-w-0 shrink-0 items-center gap-1.5">
      <div
        role="group"
        aria-label="Display mode"
        className="hidden items-center gap-0.5 rounded-sm border border-border p-0.5 sm:flex"
      >
        {MODES.map((m) => {
          const active = m.value === mode;
          return (
            <button
              key={m.value}
              type="button"
              onClick={() => setMode(m.value)}
              aria-pressed={active}
              title={m.note}
              className={
                active
                  ? "tap label-mono rounded-sm bg-brass px-2.5 py-1.5 text-[0.62rem] text-primary-foreground"
                  : "tap label-mono rounded-sm px-2.5 py-1.5 text-[0.62rem] text-muted-foreground hover:text-brass"
              }
            >
              {m.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={cycle}
        aria-label={`Display: ${current.label}. Tap to change.`}
        className="tap inline-flex items-center justify-center gap-2 rounded-sm border border-brass/35 px-2.5 text-brass sm:hidden"
      >
        <Palette className="h-4 w-4" />
        <span className="label-mono text-[0.62rem] text-brass">{current.label}</span>
      </button>

      <ColorSafeToggle />
    </div>
  );
}

export function ColorSafeToggle() {
  const { safe, toggle } = useColorSafe();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={safe}
      aria-label={safe ? "Colour-safe palette on" : "Colour-safe palette off"}
      title="Colour-vision-safe palette (brass / cyan signal)"
      className={
        safe
          ? "tap inline-flex items-center justify-center gap-1.5 rounded-sm border border-brass bg-brass/15 px-2.5 text-brass"
          : "tap inline-flex items-center justify-center gap-1.5 rounded-sm border border-border px-2.5 text-muted-foreground hover:border-brass/50 hover:text-brass"
      }
    >
      <Contrast className="h-4 w-4" />
      <span className="label-mono hidden text-[0.62rem] md:inline">{safe ? "CVD on" : "CVD"}</span>
    </button>
  );
}
