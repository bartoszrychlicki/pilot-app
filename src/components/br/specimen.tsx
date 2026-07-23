"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SpecimenProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  trailing?: React.ReactNode;
  dotted?: boolean;
}

export function Specimen({
  label,
  trailing,
  dotted = true,
  className,
  children,
  ...rest
}: SpecimenProps) {
  return (
    <div className={cn("specimen", className)} {...rest}>
      {(label || trailing) && (
        <div className="specimen-header">
          <span>
            {dotted && <span className="dot" />}
            {label}
          </span>
          {trailing && <span>{trailing}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

export function SpecimenBody({
  className,
  dense,
  tight,
  flush,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  dense?: boolean;
  tight?: boolean;
  flush?: boolean;
}) {
  return (
    <div
      className={cn(
        "specimen-body",
        dense && "dense",
        tight && "tight",
        flush && "flush",
        className
      )}
      {...rest}
    />
  );
}

export function SpecGrid({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("spec-grid", className)} {...rest} />;
}

export function SpecRow({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("spec-row", className)} {...rest} />;
}

export function SpecStack({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("spec-stack", className)} {...rest} />;
}

export function SpecLabel({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("spec-label", className)} {...rest} />;
}

