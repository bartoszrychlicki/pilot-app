"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowUR } from "@/components/br/icons";

export interface BrandCardProps {
  glyph?: string;
  eyebrow?: React.ReactNode;
  tagline?: React.ReactNode;
  taglineHighlight?: string;
  description?: React.ReactNode;
  signature?: React.ReactNode;
  signatureMeta?: React.ReactNode;
  link?: { href: string; label: string };
  compact?: boolean;
  className?: string;
}

const DEFAULTS: Required<Pick<BrandCardProps,
  "glyph" | "eyebrow" | "tagline" | "taglineHighlight" | "description" | "signature" | "signatureMeta" | "link"
>> = {
  glyph: "BR",
  eyebrow: "BR Atelier · Ed. 01",
  tagline: "Built with quiet conviction.",
  taglineHighlight: "quiet",
  description: "An editorial design system. Three voices, one set of rules.",
  signature: "Bartosz Rychlicki",
  signatureMeta: "Warsaw · 2026",
  link: { href: "https://bartoszrychlicki.com", label: "bartoszrychlicki.com" },
};

export function BrandCard({
  glyph = DEFAULTS.glyph,
  eyebrow = DEFAULTS.eyebrow,
  tagline = DEFAULTS.tagline,
  taglineHighlight = DEFAULTS.taglineHighlight,
  description = DEFAULTS.description,
  signature = DEFAULTS.signature,
  signatureMeta = DEFAULTS.signatureMeta,
  link = DEFAULTS.link,
  compact = false,
  className,
}: BrandCardProps) {
  const renderTagline = () => {
    if (typeof tagline !== "string" || !taglineHighlight) return tagline;
    const i = tagline.toLowerCase().indexOf(taglineHighlight.toLowerCase());
    if (i < 0) return tagline;
    return (
      <>
        {tagline.slice(0, i)}
        <mark>{tagline.slice(i, i + taglineHighlight.length)}</mark>
        {tagline.slice(i + taglineHighlight.length)}
      </>
    );
  };

  return (
    <div className={cn("br-brand-card", compact && "compact", className)}>
      {!compact && <span className="pulse" aria-hidden />}
      <div className="head">
        <span className="glyph">{glyph}</span>
        {!compact && <span className="eyebrow">{eyebrow}</span>}
        {compact && <span className="tagline">{renderTagline()}</span>}
      </div>
      {!compact && <div className="tagline">{renderTagline()}</div>}
      {!compact && description && <p className="desc">{description}</p>}
      {!compact && <div className="divider" />}
      <div className="footer">
        {!compact && (
          <div className="sig">
            <span className="name">{signature}</span>
            <span className="meta">{signatureMeta}</span>
          </div>
        )}
        {link && (
          <a className="pill" href={link.href} target="_blank" rel="noreferrer">
            {link.label} <ArrowUR size={12} />
          </a>
        )}
      </div>
    </div>
  );
}

