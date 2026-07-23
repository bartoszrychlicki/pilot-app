"use client";

import * as React from "react";

export type BRVariant = "A" | "B" | "C";
export type BRTheme = "light" | "dark";
export type BRGlass = "off" | "subtle" | "strong";
export type BRFontUI = "geist" | "fira" | "plex";
export type BRFontData = "mono" | "fira";
export type BRFontMeta = "mono" | "fira";

export interface BRTweaks {
  variant: BRVariant;
  theme: BRTheme;
  accent: string;
  glass: BRGlass;
  uiFont: BRFontUI;
  dataFont: BRFontData;
  metaFont: BRFontMeta;
}

const DEFAULTS: BRTweaks = {
  variant: "A",
  theme: "light",
  accent: "#E74011",
  glass: "subtle",
  uiFont: "geist",
  dataFont: "mono",
  metaFont: "mono",
};

export const ACCENT_SWATCHES = [
  "#E74011", // Fire — BR signature
  "#C8462A", // Terracotta
  "#8C5A2C", // Cognac
  "#3A3833", // Slate
];

export const VARIANT_LABELS: { v: BRVariant; label: string; desc: string }[] = [
  { v: "A", label: "Glass", desc: "Frosted · soft refleksy" },
  { v: "B", label: "Premium", desc: "Inverted dark · accent as light" },
  { v: "C", label: "Sharp", desc: "Editorial · hairlines · dense" },
];

type BRThemeContextValue = {
  tweaks: BRTweaks;
  setTweak: <K extends keyof BRTweaks>(key: K, value: BRTweaks[K]) => void;
  reset: () => void;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
};

const BRThemeContext = React.createContext<BRThemeContextValue | null>(null);

const STORAGE_KEY = "br-tweaks-v1";

function readInitialTweaks(): BRTweaks {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<BRTweaks>) };
  } catch {
    return DEFAULTS;
  }
}

export function BRThemeProvider({ children }: { children: React.ReactNode }) {
  const [tweaks, setTweaks] = React.useState<BRTweaks>(readInitialTweaks);
  const [panelOpen, setPanelOpen] = React.useState(false);

  // Persist
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tweaks));
    } catch {
      /* ignore */
    }
  }, [tweaks]);

  // Apply to <html>
  React.useEffect(() => {
    const r = document.documentElement;
    r.setAttribute("data-variant", tweaks.variant);
    r.setAttribute("data-theme", tweaks.theme);
    r.setAttribute("data-glass", tweaks.glass);
    r.style.setProperty("--accent", tweaks.accent);

    const uiStack = {
      geist: "var(--font-geist-sans), 'Geist', system-ui, sans-serif",
      fira: "'Fira Sans', system-ui, sans-serif",
      plex: "'IBM Plex Sans', system-ui, sans-serif",
    }[tweaks.uiFont];
    const dataStack = {
      mono: "var(--font-geist-mono), 'Geist Mono', ui-monospace, monospace",
      fira: "'Fira Sans', system-ui, sans-serif",
    }[tweaks.dataFont];
    const metaStack = {
      mono: "var(--font-geist-mono), 'Geist Mono', ui-monospace, monospace",
      fira: "'Fira Sans Condensed', 'Fira Sans', system-ui, sans-serif",
    }[tweaks.metaFont];
    r.style.setProperty("--font-ui", uiStack);
    r.style.setProperty("--font-data", dataStack);
    r.style.setProperty("--font-meta", metaStack);
  }, [tweaks]);

  // ⌘. → toggle theme · ⌘, → cycle variant · ⌘? → open panel
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === ".") {
        e.preventDefault();
        setTweaks((t) => ({ ...t, theme: t.theme === "light" ? "dark" : "light" }));
      } else if (e.key === ",") {
        e.preventDefault();
        setTweaks((t) => {
          const order: BRVariant[] = ["A", "B", "C"];
          const next = order[(order.indexOf(t.variant) + 1) % order.length];
          return { ...t, variant: next };
        });
      } else if (e.key === "/") {
        e.preventDefault();
        setPanelOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const setTweak = React.useCallback<BRThemeContextValue["setTweak"]>((key, value) => {
    setTweaks((t) => ({ ...t, [key]: value }));
  }, []);

  const reset = React.useCallback(() => setTweaks(DEFAULTS), []);

  const value = React.useMemo<BRThemeContextValue>(
    () => ({ tweaks, setTweak, reset, panelOpen, setPanelOpen }),
    [tweaks, setTweak, reset, panelOpen]
  );

  return <BRThemeContext.Provider value={value}>{children}</BRThemeContext.Provider>;
}

export function useBRTheme() {
  const ctx = React.useContext(BRThemeContext);
  if (!ctx) throw new Error("useBRTheme must be used inside <BRThemeProvider>");
  return ctx;
}

