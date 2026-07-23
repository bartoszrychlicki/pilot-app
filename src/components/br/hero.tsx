"use client";

import * as React from "react";
import { useBRTheme } from "@/components/br/theme-provider";

const VARIANT_COPY: Record<string, { label: string; desc: string }> = {
  A: {
    label: "Glass / Frosted",
    desc:
      "Refined translucency. Soft refractions over a warm paper base. Edges feel airy; surfaces breathe.",
  },
  B: {
    label: "Dark Premium",
    desc:
      "Inverted. Accent becomes light, hairlines whisper, every surface holds a faint inner glow.",
  },
  C: {
    label: "Sharp Modernist",
    desc:
      "Editorial discipline. Hairlines, dense type, geometric corners. No ornament, only rhythm.",
  },
};

export function Hero() {
  const { tweaks } = useBRTheme();
  const variantInfo = VARIANT_COPY[tweaks.variant];
  return (
    <section className="container-br" style={{ padding: "64px 0 56px" }}>
      <div className="hero-meta">
        <span>BR / Design System</span>
        <span>2026 · Edition 01</span>
      </div>
      <h1 className="display-xxl hero-title">
        Atelier of <span style={{ color: "var(--accent)" }}>interfaces.</span>
      </h1>
      <div className="hero-foot">
        <p className="hero-lede display-s">
          A component library built on top of the BR brand. Three variants, one accent, one ethos:{" "}
          <em>elegance that survives at small sizes.</em>
        </p>
        <div className="hero-now">
          <div className="hero-now-label">Now showing</div>
          <div className="hero-now-line">
            <span className="display-l hero-now-name">{variantInfo.label}</span>
            <span className="hero-now-badge">
              <span className="dot" />
              Live
            </span>
          </div>
          <p className="hero-now-desc">{variantInfo.desc}</p>
        </div>
      </div>
    </section>
  );
}

