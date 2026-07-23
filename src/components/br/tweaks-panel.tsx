"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  ACCENT_SWATCHES,
  VARIANT_LABELS,
  useBRTheme,
  type BRTweaks,
} from "@/components/br/theme-provider";
import { X } from "@/components/br/icons";

export function TweaksPanel() {
  const { tweaks, setTweak, reset, panelOpen, setPanelOpen } = useBRTheme();
  if (!panelOpen) return null;
  return (
    <aside className="br-twk" role="dialog" aria-label="Theme tweaks">
      <div className="hd">
        <div className="ttl">
          Tweaks <span className="kbd">⌘/</span>
        </div>
        <button className="x" aria-label="Close" onClick={() => setPanelOpen(false)}>
          <X size={14} />
        </button>
      </div>
      <div className="body">
        <Section label="Variant">
          <VariantPicker
            value={tweaks.variant}
            onChange={(v) => setTweak("variant", v)}
          />
        </Section>

        <Section label="Theme">
          <Segmented
            label="Mode"
            value={tweaks.theme}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
            onChange={(v) => setTweak("theme", v)}
          />
        </Section>

        <Section label="Accent">
          <Row label="Color">
            <div className="chips" role="radiogroup">
              {ACCENT_SWATCHES.map((c) => (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={tweaks.accent === c}
                  className="chip"
                  style={{ background: c }}
                  onClick={() => setTweak("accent", c)}
                  title={c}
                />
              ))}
            </div>
          </Row>
        </Section>

        <Section label="Glass">
          <Segmented
            label="Intensity"
            value={tweaks.glass}
            options={[
              { value: "off", label: "Off" },
              { value: "subtle", label: "Subtle" },
              { value: "strong", label: "Strong" },
            ]}
            onChange={(v) => setTweak("glass", v)}
          />
        </Section>

        <Section label="Typography — explore">
          <Segmented
            label="UI font"
            value={tweaks.uiFont}
            options={[
              { value: "geist", label: "Geist" },
              { value: "fira", label: "Fira" },
              { value: "plex", label: "Plex" },
            ]}
            onChange={(v) => setTweak("uiFont", v)}
          />
          <Segmented
            label="Numbers / data"
            value={tweaks.dataFont}
            options={[
              { value: "mono", label: "Mono" },
              { value: "fira", label: "Fira" },
            ]}
            onChange={(v) => setTweak("dataFont", v)}
          />
          <Segmented
            label="Eyebrows / meta"
            value={tweaks.metaFont}
            options={[
              { value: "mono", label: "Mono" },
              { value: "fira", label: "Cond." },
            ]}
            onChange={(v) => setTweak("metaFont", v)}
          />
        </Section>

        <div className="row h" style={{ paddingTop: 8 }}>
          <button
            type="button"
            onClick={reset}
            className="x"
            style={{ width: "auto", padding: "4px 10px", fontFamily: "var(--font-mono)", fontSize: 11 }}
          >
            Reset
          </button>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-subtle)" }}>
            ⌘. theme · ⌘, variant · ⌘/ panel
          </span>
        </div>
      </div>
    </aside>
  );
}

export function TweaksTrigger() {
  const { tweaks, panelOpen, setPanelOpen } = useBRTheme();
  if (panelOpen) return null;
  return (
    <button type="button" className="br-twk-trigger" onClick={() => setPanelOpen(true)} aria-label="Open tweaks panel">
      <span className="dot" />
      Tweaks · {tweaks.variant} · {tweaks.theme}
    </button>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <div className="sect">{label}</div>
      {children}
    </>
  );
}

function Row({
  label,
  children,
  value,
}: {
  label: string;
  children: React.ReactNode;
  value?: React.ReactNode;
}) {
  return (
    <div className="row">
      <div className="lbl">
        <span>{label}</span>
        {value != null && <span className="v">{value}</span>}
      </div>
      {children}
    </div>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <Row label={label}>
      <div className="seg" role="radiogroup">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={o.value === value}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </Row>
  );
}

function VariantPicker({
  value,
  onChange,
}: {
  value: BRTweaks["variant"];
  onChange: (v: BRTweaks["variant"]) => void;
}) {
  return (
    <div className="variant-picker">
      {VARIANT_LABELS.map(({ v, label }) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
          title={label}
        >
          <span className={cn("swatch", v)} />
          <span className="lbl-v">{label}</span>
        </button>
      ))}
    </div>
  );
}

