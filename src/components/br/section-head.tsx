"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadProps {
  id?: string;
  idx: string;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  className?: string;
}

export function SectionHead({
  id,
  idx,
  eyebrow,
  title,
  lede,
  className,
}: SectionHeadProps) {
  return (
    <header className={cn("section-head", className)} id={id}>
      <div className="meta">
        <span className="idx">{idx}</span>
        {eyebrow && <span>{eyebrow}</span>}
      </div>
      <div className="title">
        <h2>{title}</h2>
        {lede && <p>{lede}</p>}
      </div>
    </header>
  );
}

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  wide?: boolean;
}

export function Section({ className, wide, children, ...rest }: SectionProps) {
  return (
    <section className={cn("section", className)} {...rest}>
      <div className={wide ? "container-wide" : "container-br"}>{children}</div>
    </section>
  );
}

