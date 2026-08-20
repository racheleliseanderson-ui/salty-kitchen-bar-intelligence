import { useCallback, useEffect, useState } from "react";

/** Navy and Pearl are the house palette. CVD is an overlay, not a third ground. */
export type DisplayMode = "navy" | "pearl";

export const MODE_STORAGE_KEY = "sc-mode";
export const CVD_STORAGE_KEY = "sc-cvd";

export const MODES: { value: DisplayMode; label: string; note: string }[] = [
  { value: "navy", label: "Navy", note: "Deep navy ground, brass signal" },
  { value: "pearl", label: "Pearl", note: "Pearl ground, ink type" },
];

function readMode(): DisplayMode {
  if (typeof document === "undefined") return "navy";
  return document.documentElement.classList.contains("light") ? "pearl" : "navy";
}

function readCvd(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("cvd");
}

export function useDisplayMode() {
  const [mode, setMode] = useState<DisplayMode>("navy");

  useEffect(() => {
    setMode(readMode());
  }, []);

  const apply = useCallback((next: DisplayMode) => {
    setMode(next);
    const root = document.documentElement;
    root.classList.add("mode-shift");
    root.classList.toggle("light", next === "pearl");
    root.classList.toggle("dark", next !== "pearl");
    window.setTimeout(() => root.classList.remove("mode-shift"), 320);
    try {
      localStorage.setItem(MODE_STORAGE_KEY, next);
    } catch {
      /* session-only */
    }
  }, []);

  const cycle = useCallback(() => {
    apply(readMode() === "navy" ? "pearl" : "navy");
  }, [apply]);

  return { mode, setMode: apply, cycle };
}

/** Colour-vision-safe palette: brass / cyan instead of brass / oxblood. */
export function useColorSafe() {
  const [safe, setSafe] = useState(false);

  useEffect(() => {
    setSafe(readCvd());
  }, []);

  const toggle = useCallback(() => {
    const next = !readCvd();
    setSafe(next);
    document.documentElement.classList.toggle("cvd", next);
    try {
      localStorage.setItem(CVD_STORAGE_KEY, next ? "on" : "off");
    } catch {
      /* session-only */
    }
  }, []);

  return { safe, toggle };
}
