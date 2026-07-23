import * as React from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({
  tone = "muted",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "muted" | "ink" | "accent";
}) {
  return (
    <span
      {...props}
      className={cn(
        "eyebrow",
        tone === "ink" && "eyebrow-ink",
        tone === "accent" && "eyebrow-accent",
        className
      )}
    />
  );
}

export function MetaText({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} className={cn("br-meta-text", className)} />;
}

export function Kbd({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return <kbd {...props} className={cn("br-kbd", className)} />;
}

