"use client";

/**
 * BR primitives — ported 1:1 from the original cmp-controls.jsx / cmp-surfaces.jsx
 * prototypes. These are the BR design-system library; the showcase uses them
 * exactly like the consuming projects will.
 *
 * Visual styling lives in globals.css (.btn, .badge, .chip, .card, etc.) so
 * the components stay slim and the look stays consistent across the app.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Arrow,
  X as XIcon,
  Check,
  Minus,
  Plus,
  Warning,
  Info,
  Spark as Sparkles,
} from "@/components/br/icons";
import { Check as CheckIcon } from "lucide-react";

/* ─────────────────────────────  BUTTON  ───────────────────────────── */

type ButtonVariant = "primary" | "ink" | "ghost" | "quiet" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size, icon, iconRight, children, className, ...rest },
  ref
) {
  const sizeCls = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";
  return (
    <button
      ref={ref}
      {...rest}
      className={cn("btn", `btn-${variant}`, sizeCls, !children && "btn-icon", className)}
    >
      {icon}
      {children}
      {iconRight && <span className="ico-r">{iconRight}</span>}
    </button>
  );
});

export interface ButtonGroupOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
}

export function ButtonGroup<T extends string>({
  value,
  onChange,
  options,
  "aria-label": ariaLabel = "Options",
}: {
  value: T;
  onChange?: (v: T) => void;
  options: ButtonGroupOption<T>[];
  "aria-label"?: string;
}) {
  return (
    <div className="btn-group" role="group" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className="btn"
          aria-pressed={value === o.value}
          onClick={() => onChange?.(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────  BADGE  ───────────────────────────── */

type BadgeVariant = "default" | "accent" | "solid" | "ink" | "success";

export function Badge({
  variant = "default",
  children,
  dot,
  className,
}: {
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("badge", variant !== "default" && `badge-${variant}`, className)}>
      {dot && <span className="dot" />}
      {children}
    </span>
  );
}

/* ─────────────────────────────  CHIP  ───────────────────────────── */

export function Chip({
  pressed,
  onPressedChange,
  onRemove,
  children,
  className,
}: {
  pressed?: boolean;
  onPressedChange?: (p: boolean) => void;
  onRemove?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn("chip", className)}
      aria-pressed={pressed || undefined}
      onClick={() => onPressedChange?.(!pressed)}
    >
      {children}
      {onRemove && (
        <span
          className="x"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <XIcon size={12} />
        </span>
      )}
    </button>
  );
}

/* ─────────────────────────────  FIELD / INPUT  ───────────────────────────── */

export function Field({
  label,
  hint,
  error,
  action,
  children,
  className,
}: {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("field", className)}>
      {label && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="field-label">{label}</span>
          {action}
        </div>
      )}
      {children}
      {error ? (
        <span className="field-error">{error}</span>
      ) : hint ? (
        <span className="field-hint">{hint}</span>
      ) : null}
    </label>
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { icon, suffix, className, ...rest },
  ref
) {
  return (
    <div className="input-wrap">
      {icon && <span className="input-ico">{icon}</span>}
      <input ref={ref} {...rest} className={cn("input", className)} />
      {suffix && <span className="input-affix">{suffix}</span>}
    </div>
  );
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...rest }, ref) {
  return <textarea ref={ref} {...rest} className={cn("textarea", className)} />;
});

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { children, ...rest },
  ref
) {
  return (
    <div className="input-wrap select-wrap">
      <select ref={ref} {...rest}>
        {children}
      </select>
    </div>
  );
});

/* ─────────────────────────────  CHECKBOX / RADIO / SWITCH  ───────────────────────────── */

export function Checkbox({
  label,
  checked,
  onChange,
  ...rest
}: { label?: React.ReactNode; checked?: boolean; onChange?: (v: boolean) => void } & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type"
>) {
  return (
    <label className="cbx">
      <input
        type="checkbox"
        {...rest}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className="box">
        <span className="check">
          <Check size={12} strokeWidth={2.5} />
        </span>
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}

export function Radio({
  label,
  name,
  value,
  checked,
  onChange,
}: {
  label?: React.ReactNode;
  name?: string;
  value: string;
  checked?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <label className="rdo">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange?.(value)}
      />
      <span className="dot" />
      {label && <span>{label}</span>}
    </label>
  );
}

export function Switch({
  label,
  checked,
  onChange,
  ...rest
}: {
  label?: React.ReactNode;
  checked?: boolean;
  onChange?: (v: boolean) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "type" | "checked">) {
  return (
    <label className="sw">
      <input
        type="checkbox"
        {...rest}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className="track">
        <span className="thumb" />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}

/* ─────────────────────────────  SLIDER / STEPPER  ───────────────────────────── */

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label = "Value",
}: {
  value: number;
  onChange?: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      className="br-slider"
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={label}
      style={{ "--fill": `${pct}%` } as React.CSSProperties}
      onChange={(e) => onChange?.(+e.target.value)}
    />
  );
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
}: {
  value: number;
  onChange?: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="stepper">
      <button onClick={() => onChange?.(Math.max(min, value - step))} aria-label="Decrease" type="button">
        <Minus size={14} />
      </button>
      <span className="value">{value}</span>
      <button onClick={() => onChange?.(Math.min(max, value + step))} aria-label="Increase" type="button">
        <Plus size={14} />
      </button>
    </div>
  );
}

/* ─────────────────────────────  CARD / STAT CARD / CASE CARD  ───────────────────────────── */

export function Card({
  children,
  interactive,
  className,
  ...rest
}: { children: React.ReactNode; interactive?: boolean; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} className={cn("card", interactive && "interactive", className)}>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  unit,
  trend,
  footer,
  sparkline,
  accent,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  unit?: React.ReactNode;
  trend?: string;
  footer?: React.ReactNode;
  sparkline?: string;
  accent?: boolean;
}) {
  const trendNeg = trend?.toString().startsWith("-");
  return (
    <div className={cn("stat-card", accent && "accent")}>
      <div className="stat-head">
        <span>{label}</span>
        {trend && (
          <span className={cn("trend", trendNeg && "down")}>
            <span
              style={{
                transform: trendNeg ? "rotate(45deg)" : "rotate(-45deg)",
                display: "inline-block",
              }}
            >
              <Arrow size={12} />
            </span>
            {trend}
          </span>
        )}
      </div>
      <div className="stat-num">
        {value}
        {unit && <span className="unit">{unit}</span>}
      </div>
      {footer && <div className="stat-foot">{footer}</div>}
      {sparkline && (
        <svg className="spark" viewBox="0 0 86 38" preserveAspectRatio="none">
          <path d={sparkline} />
        </svg>
      )}
    </div>
  );
}

export function CaseCard({
  days,
  year,
  title,
  desc,
  tags,
  placeholder,
}: {
  days?: string | number;
  year?: string | number;
  title: React.ReactNode;
  desc?: React.ReactNode;
  tags?: string[];
  placeholder?: React.ReactNode;
}) {
  return (
    <article className="case-card">
      <div className="case-img-wrap">
        <div className="case-img">{placeholder || "project shot"}</div>
      </div>
      <div className="case-body">
        <div className="case-top">
          <span>{year || "2026"}</span>
          {days && <Badge variant="accent">{days} days</Badge>}
        </div>
        <h3>{title}</h3>
        {desc && <p>{desc}</p>}
        {tags && (
          <div className="case-tags">
            {tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

/* ─────────────────────────────  AVATAR  ───────────────────────────── */

export function Avatar({
  src,
  alt,
  fallback,
  size,
  accent,
  className,
}: {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  size?: "sm" | "lg";
  accent?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("avatar", size, accent && "accent", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- BR-UI registry consumers are not guaranteed to run on Next.js. */}
      {src ? <img src={src} alt={alt} /> : fallback}
    </span>
  );
}

export function AvatarStack({
  avatars,
  more,
}: {
  avatars: Array<{ fallback?: React.ReactNode; accent?: boolean }>;
  more?: number;
}) {
  return (
    <div className="avatar-stack">
      {avatars.map((a, i) => (
        <Avatar key={i} {...a} />
      ))}
      {more != null && <span className="more">+{more}</span>}
    </div>
  );
}

/* ─────────────────────────────  SKELETON / PROGRESS / SPINNER  ───────────────────────────── */

export function Skeleton({
  w = "100%",
  h = 14,
  r,
  style,
  className,
  ...rest
}: {
  w?: string | number;
  h?: string | number;
  r?: string | number;
  style?: React.CSSProperties;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "style">) {
  return (
    <div
      {...rest}
      className={cn("skel", className)}
      style={{ width: w, height: h, borderRadius: r, ...style }}
    />
  );
}

export function Progress({
  value,
  indeterminate,
  className,
  label = indeterminate ? "Loading" : "Progress",
}: {
  value?: number;
  indeterminate?: boolean;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn("br-progress", indeterminate && "indeterminate", className)}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuetext={indeterminate ? "Loading" : undefined}
    >
      <div
        className="fill"
        style={{ width: indeterminate ? undefined : `${value}%` }}
      />
    </div>
  );
}

export function Spinner({ size }: { size?: "sm" | "lg" }) {
  return <div className={cn("progress-circ", size)} role="status" aria-label="Loading" />;
}

/* ─────────────────────────────  TABS  ───────────────────────────── */

export function TabsUnderline<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange?: (v: T) => void;
  options: { value: T; label: React.ReactNode }[];
}) {
  return (
    <div className="tabs-underline" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange?.(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function TabsPills<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange?: (v: T) => void;
  options: { value: T; label: React.ReactNode }[];
}) {
  return (
    <div className="tabs-pills" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange?.(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: React.ReactNode; href?: string }[] }) {
  return (
    <nav className="crumbs">
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="sep">/</span>}
          {i === items.length - 1 ? (
            <span className="current">{it.label}</span>
          ) : (
            <a href={it.href || "#"}>{it.label}</a>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

/* ─────────────────────────────  SIDEBAR  ───────────────────────────── */

export interface SidebarItem {
  icon?: React.ReactNode;
  label: React.ReactNode;
  active?: boolean;
  badge?: React.ReactNode;
  onClick?: () => void;
}
export interface SidebarSection {
  label?: React.ReactNode;
  items: SidebarItem[];
}

export interface SidebarProps {
  sections: SidebarSection[];
  children?: React.ReactNode;
  shortcutHints?: boolean;
  shortcutHintDelay?: number;
}

function isEditableShortcutTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || target.isContentEditable;
}

export function Sidebar({
  sections,
  children,
  shortcutHints = false,
  shortcutHintDelay = 700,
}: SidebarProps) {
  const [shortcutsVisible, setShortcutsVisible] = React.useState(false);
  const shortcutsVisibleRef = React.useRef(false);
  const hideTimerRef = React.useRef<number | null>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const shortcutCount = React.useMemo(
    () => Math.min(9, sections.reduce((count, section) => count + section.items.length, 0)),
    [sections]
  );

  const clearHideTimer = React.useCallback(() => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const setShortcutVisibility = React.useCallback(
    (visible: boolean) => {
      clearHideTimer();
      shortcutsVisibleRef.current = visible;
      setShortcutsVisible(visible);
    },
    [clearHideTimer]
  );

  React.useEffect(() => {
    if (!shortcutHints || shortcutCount === 0) return;

    const scheduleHide = () => {
      clearHideTimer();
      hideTimerRef.current = window.setTimeout(() => {
        shortcutsVisibleRef.current = false;
        setShortcutsVisible(false);
      }, shortcutHintDelay);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableShortcutTarget(event.target)) return;

      const modifierActive = event.metaKey || event.ctrlKey || event.key === "Meta" || event.key === "Control";
      if (modifierActive) {
        setShortcutVisibility(true);
        return;
      }

      if (!shortcutsVisibleRef.current || !/^[1-9]$/.test(event.key)) return;

      const index = Number(event.key) - 1;
      const item = itemRefs.current[index];
      if (!item) return;

      event.preventDefault();
      item.focus();
      item.click();
      setShortcutVisibility(false);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Meta" || event.key === "Control" || (!event.metaKey && !event.ctrlKey)) {
        scheduleHide();
      }
    };

    const onBlur = () => setShortcutVisibility(false);
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") setShortcutVisibility(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      clearHideTimer();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [clearHideTimer, shortcutHintDelay, shortcutHints, shortcutCount, setShortcutVisibility]);

  let itemIndex = 0;

  return (
    <aside className={cn("br-sidebar", shortcutHints && "shortcuts-enabled", shortcutsVisible && "shortcuts-visible")}>
      {sections.map((s, i) => (
        <React.Fragment key={i}>
          {s.label && <div className="section-label">{s.label}</div>}
          {s.items.map((it, j) => {
            const shortcutIndex = itemIndex++;
            const shortcut = shortcutHints && shortcutIndex < 9 ? String(shortcutIndex + 1) : null;

            return (
              <button
                key={j}
                ref={(node) => {
                  itemRefs.current[shortcutIndex] = node;
                }}
                type="button"
                className={cn("item", it.active && "active")}
                onClick={it.onClick}
                aria-keyshortcuts={shortcut || undefined}
              >
                {it.icon}
                <span className="item-label">{it.label}</span>
                {it.badge != null && <Badge>{it.badge}</Badge>}
                {shortcut && (
                  <span className="shortcut-hint" aria-hidden="true">
                    {shortcut}
                  </span>
                )}
              </button>
            );
          })}
        </React.Fragment>
      ))}
      {children}
    </aside>
  );
}

/* ─────────────────────────────  TABLE  ───────────────────────────── */

export interface TableColumn<T> {
  key: string;
  label: React.ReactNode;
  numeric?: boolean;
  kind?: "user" | "actions";
  render?: (row: T) => React.ReactNode;
}

export function Table<T extends Record<string, unknown>>({
  title,
  actions,
  columns,
  rows,
}: {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  columns: TableColumn<T>[];
  rows: T[];
}) {
  return (
    <div className="table-wrap">
      {(title || actions) && (
        <div className="table-head">
          <span className="title">{title}</span>
          <div className="actions">{actions}</div>
        </div>
      )}
      <table className="tbl">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={c.numeric ? "num" : ""}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c.key} className={cn(c.numeric && "num", c.kind)}>
                  {c.render ? c.render(r) : (r[c.key] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────────  ALERT / BANNER  ───────────────────────────── */

export function Alert({
  variant = "default",
  title,
  icon,
  children,
}: {
  variant?: "default" | "accent" | "warn";
  title?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const defaultIcon =
    variant === "warn" ? <Warning size={16} /> : <Info size={16} />;
  return (
    <div className={cn("alert", variant !== "default" && `alert-${variant}`)}>
      <span className="ico">{icon || defaultIcon}</span>
      <div className="body">
        {title && <strong>{title}</strong>}
        {children && <p>{children}</p>}
      </div>
    </div>
  );
}

export function Banner({
  children,
  action,
  onDismiss,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
  onDismiss?: () => void;
}) {
  return (
    <div className="banner">
      <span className="ico">
        <Sparkles size={12} />
      </span>
      <strong>{children}</strong>
      {action}
      {onDismiss && (
        <button className="x" onClick={onDismiss} aria-label="Dismiss" type="button">
          <XIcon size={14} />
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────  DIALOG / SHEET / DRAWER  ───────────────────────────── */

function useEscape(handler?: () => void, active?: boolean) {
  React.useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handler?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handler, active]);
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEscape(onClose, open);
  if (!open) return null;
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="dialog" role="dialog" aria-modal="true">
        <div className="dialog-head">
          <div>
            {title && <h3>{title}</h3>}
            {description && <p>{description}</p>}
          </div>
          <button className="dialog-close" onClick={onClose} aria-label="Close" type="button">
            <XIcon size={16} />
          </button>
        </div>
        {children && <div className="dialog-body">{children}</div>}
        {footer && <div className="dialog-foot">{footer}</div>}
      </div>
    </>
  );
}

export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEscape(onClose, open);
  if (!open) return null;
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-head">
          <div>
            {title && <h3>{title}</h3>}
            {description && <p>{description}</p>}
          </div>
          <button className="dialog-close" onClick={onClose} aria-label="Close" type="button">
            <XIcon size={16} />
          </button>
        </div>
        <div className="sheet-body">{children}</div>
        {footer && <div className="sheet-foot">{footer}</div>}
      </div>
    </>
  );
}

export function Drawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}) {
  useEscape(onClose, open);
  if (!open) return null;
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="drawer">
        <div className="handle" />
        {children}
      </div>
    </>
  );
}

export function Tooltip({
  label,
  kbd,
  children,
}: {
  label: React.ReactNode;
  kbd?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="tt-wrap">
      {children}
      <span className="tt tt-top">
        {label}
        {kbd && <span className="kbd">{kbd}</span>}
      </span>
    </span>
  );
}

/* ─────────────────────────────  DROPDOWN MENU (anchored)  ───────────────────────────── */

export interface MenuItem {
  text?: React.ReactNode;
  icon?: React.ReactNode;
  kbd?: React.ReactNode;
  onClick?: () => void;
  sep?: boolean;
  label?: React.ReactNode;
}

export function Menu({ items, style }: { items: MenuItem[]; style?: React.CSSProperties }) {
  return (
    <div className="menu" style={style}>
      {items.map((it, i) => {
        if (it.sep) return <div key={i} className="menu-sep" />;
        if (it.label && !it.text) return <div key={i} className="menu-label">{it.label}</div>;
        return (
          <button key={i} type="button" className="menu-item" onClick={it.onClick}>
            {it.icon}
            <span>{it.text}</span>
            {it.kbd && <span className="kbd">{it.kbd}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function Dropdown({
  trigger,
  items,
  align = "start",
}: {
  trigger: React.ReactNode;
  items: MenuItem[];
  align?: "start" | "end";
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);
  useEscape(() => setOpen(false), open);
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <span onClick={() => setOpen((o) => !o)} style={{ cursor: "pointer" }}>
        {trigger}
      </span>
      {open && (
        <Menu
          items={items}
          style={{
            top: "calc(100% + 6px)",
            [align === "end" ? "right" : "left"]: 0,
          }}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────  TOAST primitive  ───────────────────────────── */

export function Toast({
  title,
  description,
  onClose,
  icon,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  onClose?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="toast">
      <span className="ico">{icon || <CheckIcon size={16} strokeWidth={2} />}</span>
      <div>
        {title && <strong>{title}</strong>}
        {description && <p>{description}</p>}
      </div>
      {onClose && (
        <button className="x" onClick={onClose} aria-label="Close" type="button">
          <XIcon size={14} />
        </button>
      )}
    </div>
  );
}

