"use client";

/**
 * BR chart primitives — ported 1:1 from cmp-charts.jsx.
 * Pure SVG, no third-party deps. Driven by the same accent token as the rest
 * of the system, so they pick up the active variant automatically.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { EmptyState, ErrorState, LoadingState } from "@/components/br/states";

function ArrowUpSmall({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path d="M6 10V2M3 5l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowDownSmall({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path d="M6 2v8M3 7l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function buildLinePath(points: number[], w: number, h: number, max: number, min = 0) {
  if (max === min) max = min + 1;
  return points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((v - min) / (max - min)) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}
function buildAreaPath(points: number[], w: number, h: number, max: number, min = 0) {
  const top = buildLinePath(points, w, h, max, min);
  return `${top} L${w.toFixed(2)},${h} L0,${h} Z`;
}

interface ChartHeadProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  value?: React.ReactNode;
  unit?: React.ReactNode;
  delta?: React.ReactNode;
  deltaNeg?: boolean;
  ariaLabel?: string;
  ariaDescription?: string;
  loading?: boolean;
  empty?: boolean;
  error?: React.ReactNode;
}

function ChartHead({ title, subtitle, value, unit, delta, deltaNeg }: ChartHeadProps) {
  return (
    <>
      <div className="chart-head">
        <div>
          <h4 className="chart-title">{title}</h4>
          {subtitle && <div className="chart-sub">{subtitle}</div>}
        </div>
        {delta && (
          <span className={cn("chart-delta", deltaNeg && "neg")}>
            {deltaNeg ? <ArrowDownSmall /> : <ArrowUpSmall />}
            {delta}
          </span>
        )}
      </div>
      {value && (
        <div className="chart-value-row">
          <span className="chart-value">
            {value}
            {unit && <span className="u">{unit}</span>}
          </span>
        </div>
      )}
    </>
  );
}

function chartAriaLabel(title: React.ReactNode, ariaLabel?: string) {
  return ariaLabel || (typeof title === "string" ? title : undefined);
}

function ChartStatus({
  title,
  loading,
  empty,
  error,
}: Pick<ChartHeadProps, "title" | "loading" | "empty" | "error">) {
  if (loading) {
    return <LoadingState compact title="Loading chart." description="The visualization will update when data arrives." />;
  }
  if (error) {
    return <ErrorState compact title="Chart unavailable." description={error} action={null} />;
  }
  if (empty) {
    return <EmptyState compact title="No chart data." description={`There is no data for ${typeof title === "string" ? title : "this view"}.`} />;
  }
  return null;
}

export interface AreaChartProps extends ChartHeadProps {
  series: number[];
  alt?: number[];
  labels?: string[];
  max?: number;
  height?: number;
  footer?: React.ReactNode;
}

export function AreaChart({
  title,
  subtitle,
  value,
  unit,
  delta,
  deltaNeg,
  series,
  alt,
  labels,
  max,
  height = 140,
  footer,
  ariaLabel,
  ariaDescription,
  loading,
  empty,
  error,
}: AreaChartProps) {
  const id = React.useId().replace(/:/g, "");
  const status = <ChartStatus title={title} loading={loading} empty={empty || series.length === 0} error={error} />;
  if (loading || error || empty || series.length === 0) return <div className="chart-card">{status}</div>;
  const w = 480;
  const h = height;
  const all = [...series, ...(alt || [])];
  const m = max || Math.max(...all);
  const lastX = ((series.length - 1) / (series.length - 1)) * w;
  const lastY = h - (series[series.length - 1] / m) * h;
  return (
    <div className="chart-card">
      <ChartHead title={title} subtitle={subtitle} value={value} unit={unit} delta={delta} deltaNeg={deltaNeg} />
      <svg className="chart-svg" viewBox={`0 0 ${w} ${h + (labels ? 22 : 4)}`} preserveAspectRatio="none" role="img" aria-label={chartAriaLabel(title, ariaLabel)}>
        {chartAriaLabel(title, ariaLabel) && <title>{chartAriaLabel(title, ariaLabel)}</title>}
        {ariaDescription && <desc>{ariaDescription}</desc>}
        <defs>
          <linearGradient id={`ag-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity=".35" />
            <stop offset="80%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((i) => (
          <line key={i} className="grid" x1={0} x2={w} y1={(h / 3) * i + 0.5} y2={(h / 3) * i + 0.5} />
        ))}
        <path d={buildAreaPath(series, w, h, m)} fill={`url(#ag-${id})`} />
        {alt && <path d={buildLinePath(alt, w, h, m)} className="line alt" />}
        <path d={buildLinePath(series, w, h, m)} className="line" />
        <circle cx={lastX} cy={lastY} r={3.5} className="dot terminal" />
        {labels &&
          labels.map((l, i) => (
            <text
              key={i}
              className="axis"
              x={(i / (labels.length - 1)) * w}
              y={h + 15}
              textAnchor={i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"}
            >
              {l}
            </text>
          ))}
      </svg>
      {alt ? (
        <div className="chart-legend">
          <span>
            <i /> This period
          </span>
          <span>
            <i className="alt" /> Previous
          </span>
        </div>
      ) : footer ? (
        <div className="chart-foot">{footer}</div>
      ) : null}
    </div>
  );
}

export interface BarChartProps extends ChartHeadProps {
  series: number[];
  alt?: number[];
  labels?: string[];
  max?: number;
  highlight?: number;
  stacked?: boolean;
  height?: number;
  footer?: React.ReactNode;
}

export function BarChart({
  title,
  subtitle,
  value,
  unit,
  delta,
  deltaNeg,
  series,
  alt,
  labels,
  max,
  highlight,
  stacked,
  height = 140,
  footer,
  ariaLabel,
  ariaDescription,
  loading,
  empty,
  error,
}: BarChartProps) {
  const status = <ChartStatus title={title} loading={loading} empty={empty || series.length === 0} error={error} />;
  if (loading || error || empty || series.length === 0) return <div className="chart-card">{status}</div>;
  const w = 480;
  const h = height;
  const allVals = stacked ? series.map((v, i) => v + (alt ? alt[i] || 0 : 0)) : [...series, ...(alt || [])];
  const m = max || Math.max(...allVals);
  const bw = w / series.length;
  return (
    <div className="chart-card">
      <ChartHead title={title} subtitle={subtitle} value={value} unit={unit} delta={delta} deltaNeg={deltaNeg} />
      <svg className="chart-svg" viewBox={`0 0 ${w} ${h + 22}`} preserveAspectRatio="none" role="img" aria-label={chartAriaLabel(title, ariaLabel)}>
        {chartAriaLabel(title, ariaLabel) && <title>{chartAriaLabel(title, ariaLabel)}</title>}
        {ariaDescription && <desc>{ariaDescription}</desc>}
        {[0, 1, 2, 3].map((i) => (
          <line key={i} className="grid" x1={0} x2={w} y1={(h / 3) * i + 0.5} y2={(h / 3) * i + 0.5} />
        ))}
        {series.map((v, i) => {
          const x = i * bw + bw * 0.22;
          const ww = bw * 0.56;
          if (alt && !stacked) {
            const ww2 = ww * 0.46;
            const gap = ww * 0.08;
            const v2 = alt[i] || 0;
            const bh1 = (v / m) * h;
            const bh2 = (v2 / m) * h;
            return (
              <g key={i}>
                <rect className="bar-alt" x={x} y={h - bh2} width={ww2} height={bh2} rx={2} />
                <rect className="bar" x={x + ww2 + gap} y={h - bh1} width={ww2} height={bh1} rx={2} />
              </g>
            );
          }
          if (alt && stacked) {
            const v2 = alt[i] || 0;
            const bh1 = (v / m) * h;
            const bh2 = (v2 / m) * h;
            return (
              <g key={i}>
                <rect className="bar" x={x} y={h - bh1 - bh2} width={ww} height={bh1} rx={2} />
                <rect className="bar-alt" x={x} y={h - bh2} width={ww} height={bh2} />
              </g>
            );
          }
          const bh = (v / m) * h;
          const cls = highlight !== undefined ? (i === highlight ? "bar" : "bar muted") : "bar";
          return <rect key={i} className={cls} x={x} y={h - bh} width={ww} height={bh} rx={2} />;
        })}
        {labels &&
          labels.map((l, i) => (
            <text key={i} className="axis" x={i * bw + bw / 2} y={h + 15} textAnchor="middle">
              {l}
            </text>
          ))}
      </svg>
      {alt ? (
        <div className="chart-legend">
          <span>
            <i className="sq" /> This year
          </span>
          <span>
            <i className="sq alt" /> Last year
          </span>
        </div>
      ) : footer ? (
        <div className="chart-foot">{footer}</div>
      ) : null}
    </div>
  );
}

export interface LineChartProps extends ChartHeadProps {
  series: number[];
  alt?: number[];
  labels?: string[];
  max?: number;
  dotted?: boolean;
  height?: number;
  footer?: React.ReactNode;
}

export function LineChart({
  title,
  subtitle,
  value,
  unit,
  delta,
  deltaNeg,
  series,
  alt,
  labels,
  max,
  dotted,
  height = 140,
  footer,
  ariaLabel,
  ariaDescription,
  loading,
  empty,
  error,
}: LineChartProps) {
  const status = <ChartStatus title={title} loading={loading} empty={empty || series.length === 0} error={error} />;
  if (loading || error || empty || series.length === 0) return <div className="chart-card">{status}</div>;
  const w = 480;
  const h = height;
  const all = [...series, ...(alt || [])];
  const m = max || Math.max(...all);
  return (
    <div className="chart-card">
      <ChartHead title={title} subtitle={subtitle} value={value} unit={unit} delta={delta} deltaNeg={deltaNeg} />
      <svg className="chart-svg" viewBox={`0 0 ${w} ${h + 22}`} preserveAspectRatio="none" role="img" aria-label={chartAriaLabel(title, ariaLabel)}>
        {chartAriaLabel(title, ariaLabel) && <title>{chartAriaLabel(title, ariaLabel)}</title>}
        {ariaDescription && <desc>{ariaDescription}</desc>}
        {[0, 1, 2, 3].map((i) => (
          <line key={i} className="grid" x1={0} x2={w} y1={(h / 3) * i + 0.5} y2={(h / 3) * i + 0.5} />
        ))}
        {alt && <path d={buildLinePath(alt, w, h, m)} className="line alt" />}
        <path d={buildLinePath(series, w, h, m)} className="line" />
        {dotted &&
          series.map((v, i) => {
            const x = (i / (series.length - 1)) * w;
            const y = h - (v / m) * h;
            return <circle key={i} cx={x} cy={y} r={3} className="dot" />;
          })}
        {labels &&
          labels.map((l, i) => (
            <text
              key={i}
              className="axis"
              x={(i / (labels.length - 1)) * w}
              y={h + 15}
              textAnchor={i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"}
            >
              {l}
            </text>
          ))}
      </svg>
      {alt ? (
        <div className="chart-legend">
          <span>
            <i /> Current
          </span>
          <span>
            <i className="alt" /> Previous
          </span>
        </div>
      ) : footer ? (
        <div className="chart-foot">{footer}</div>
      ) : null}
    </div>
  );
}

export interface DonutItem {
  label: React.ReactNode;
  value: number;
  color?: string;
}

export interface DonutChartProps extends ChartHeadProps {
  total: React.ReactNode;
  label?: string;
  items: DonutItem[];
  footer?: React.ReactNode;
}

export function DonutChart({
  title,
  subtitle,
  total,
  label = "total",
  items,
  footer,
  ariaLabel,
  ariaDescription,
  loading,
  empty,
  error,
}: DonutChartProps) {
  const sum = items.reduce((a, b) => a + b.value, 0);
  const status = <ChartStatus title={title} loading={loading} empty={empty || items.length === 0 || sum <= 0} error={error} />;
  if (loading || error || empty || items.length === 0 || sum <= 0) return <div className="chart-card">{status}</div>;
  const r = 56;
  const sw = 14;
  const cx = 70;
  const cy = 70;
  const circ = 2 * Math.PI * r;
  return (
    <div className="chart-card">
      <ChartHead title={title} subtitle={subtitle} />
      <div className="donut-wrap">
        <div className="donut-svg-wrap" style={{ width: 140, height: 140 }}>
          <svg width={140} height={140} role="img" aria-label={chartAriaLabel(title, ariaLabel)}>
            {chartAriaLabel(title, ariaLabel) && <title>{chartAriaLabel(title, ariaLabel)}</title>}
            {ariaDescription && <desc>{ariaDescription}</desc>}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={sw} />
            {items.map((it, i) => {
              const frac = it.value / sum;
              const acc = items.slice(0, i).reduce((total, item) => total + item.value / sum, 0);
              const dash = `${frac * circ} ${circ}`;
              const off = -acc * circ;
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke={it.color || "var(--accent)"}
                  strokeWidth={sw}
                  strokeDasharray={dash}
                  strokeDashoffset={off}
                  transform={`rotate(-90 ${cx} ${cy})`}
                />
              );
            })}
          </svg>
          <div className="donut-center">
            <div>
              <div className="num">{total}</div>
              <div className="lab">{label}</div>
            </div>
          </div>
        </div>
        <div className="donut-list">
          {items.map((it, i) => (
            <div className="row" key={i}>
              <i style={{ background: it.color || "var(--accent)" }} />
              <span>{it.label}</span>
              <span className="val">{it.value}</span>
              <span className="pct">{Math.round((it.value / sum) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
      {footer && <div className="chart-foot">{footer}</div>}
    </div>
  );
}

export interface RadarChartProps extends ChartHeadProps {
  axes: string[];
  series: number[];
  altSeries?: number[];
  footer?: React.ReactNode;
}

export function RadarChart({
  title,
  subtitle,
  axes,
  series,
  altSeries,
  footer,
  ariaLabel,
  ariaDescription,
  loading,
  empty,
  error,
}: RadarChartProps) {
  const status = <ChartStatus title={title} loading={loading} empty={empty || series.length === 0 || axes.length === 0} error={error} />;
  if (loading || error || empty || series.length === 0 || axes.length === 0) return <div className="chart-card">{status}</div>;
  const n = axes.length;
  const r = 70;
  const cx = 110;
  const cy = 100;
  const max = 100;
  const pts = (vals: number[]) =>
    vals
      .map((v, i) => {
        const ang = -Math.PI / 2 + (i / n) * Math.PI * 2;
        const rr = (v / max) * r;
        return `${cx + Math.cos(ang) * rr},${cy + Math.sin(ang) * rr}`;
      })
      .join(" ");
  const ringPts = (frac: number) =>
    Array.from({ length: n })
      .map((_, i) => {
        const ang = -Math.PI / 2 + (i / n) * Math.PI * 2;
        const rr = frac * r;
        return `${cx + Math.cos(ang) * rr},${cy + Math.sin(ang) * rr}`;
      })
      .join(" ");
  return (
    <div className="chart-card">
      <ChartHead title={title} subtitle={subtitle} />
      <svg className="chart-svg" viewBox="0 0 220 200" style={{ maxHeight: 220 }} role="img" aria-label={chartAriaLabel(title, ariaLabel)}>
        {chartAriaLabel(title, ariaLabel) && <title>{chartAriaLabel(title, ariaLabel)}</title>}
        {ariaDescription && <desc>{ariaDescription}</desc>}
        {[0.33, 0.66, 1].map((f) => (
          <polygon key={f} points={ringPts(f)} fill="none" stroke="var(--border)" strokeDasharray="2 3" />
        ))}
        {axes.map((a, i) => {
          const ang = -Math.PI / 2 + (i / n) * Math.PI * 2;
          const x2 = cx + Math.cos(ang) * r;
          const y2 = cy + Math.sin(ang) * r;
          const lx = cx + Math.cos(ang) * (r + 16);
          const ly = cy + Math.sin(ang) * (r + 16);
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="var(--border)" />
              <text x={lx} y={ly + 3} className="axis" textAnchor="middle">
                {a}
              </text>
            </g>
          );
        })}
        {altSeries && (
          <polygon
            points={pts(altSeries)}
            fill="none"
            stroke="var(--text)"
            strokeOpacity={0.35}
            strokeDasharray="3 3"
            strokeWidth={1.4}
          />
        )}
        <polygon
          points={pts(series)}
          fill="var(--accent)"
          fillOpacity={0.14}
          stroke="var(--accent)"
          strokeWidth={1.6}
        />
        {series.map((v, i) => {
          const ang = -Math.PI / 2 + (i / n) * Math.PI * 2;
          const rr = (v / max) * r;
          return (
            <circle
              key={i}
              cx={cx + Math.cos(ang) * rr}
              cy={cy + Math.sin(ang) * rr}
              r={2.6}
              fill="var(--accent)"
            />
          );
        })}
      </svg>
      {altSeries ? (
        <div className="chart-legend">
          <span>
            <i /> This product
          </span>
          <span>
            <i className="alt" /> Category avg.
          </span>
        </div>
      ) : footer ? (
        <div className="chart-foot">{footer}</div>
      ) : null}
    </div>
  );
}

