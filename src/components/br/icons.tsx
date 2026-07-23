"use client";

import * as React from "react";

/**
 * Lightweight wrapper around lucide-react with a couple of BR-specific marks.
 * Importing from this module gives consumers a stable surface — if we ever swap
 * icon libraries, only this file changes.
 */
export {
  ArrowRight as Arrow,
  ArrowUpRight as ArrowUR,
  ChevronDown as Chevron,
  ChevronRight as ChevronR,
  ChevronLeft as ChevronL,
  Plus,
  Minus,
  X,
  Check,
  Search,
  Settings,
  Bell,
  Mail,
  User,
  Users,
  Home,
  Folder,
  Calendar,
  Clock,
  Sun,
  Moon,
  Info,
  AlertTriangle as Warning,
  Sparkles as Spark,
  Zap as Bolt,
  Star,
  Heart,
  Code,
  Layers,
  Globe,
  Download,
  Upload,
  Filter,
  ArrowDownUp as Sort,
  Copy,
  ExternalLink as External,
  Trash2 as Trash,
  Edit3 as Edit,
  Lock,
  Eye,
  EyeOff,
  LayoutGrid as Grid,
  TrendingUp as Trend,
  Inbox,
  Command,
  CornerDownLeft,
  Play,
  Pause,
  Mic,
  StopCircle,
  Volume2,
  ChevronsUpDown,
  CircleDot,
  Hash,
  CreditCard,
} from "lucide-react";

export function Logo({
  size = 26,
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      {...props}
    >
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="5" fill="currentColor" />
    </svg>
  );
}

/* BR personal signet — ~/Downloads/svg.svg, fill replaced with currentColor */
export function BRSignet({
  height = 30,
  ...props
}: React.SVGProps<SVGSVGElement> & { height?: number }) {
  const w = Math.round((137.91 / 142.3) * height);
  return (
    <svg
      width={w}
      height={height}
      viewBox="0 0 137.91 142.3"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="96.3" cy="88.54" r="2.75" fill="currentColor" />
      <path
        fill="currentColor"
        d="m110.82,68.51c-8.99,5.93-17.56,9.72-24.87,12.08,6.18-7.7,10.54-15.82,12.3-23.07,1.5-6.19.93-11.1-1.62-13.85-1.68-1.8-3.9-2.76-6.61-2.83-.12,0-.23,0-.35,0-7.6,0-17.69,6.81-24.58,12.29,4.28-6.57,9.17-15.48,8.47-21.03-.22-1.76-.97-3.14-2.22-4.1-2.6-1.99-5.52-2.03-8.23-.13-4.65,3.27-8.75,12.19-10.97,23.87-2.04,10.72-2.04,21.38-.06,29.85-14.12,9.96-26.91,26.34-24.76,31.99.57,1.49,1.83,2.23,3.76,2.23,1.33,0,2.98-.35,4.95-1.06,17.25-6.2,32.44-15.69,43.94-27.44,1.04-1.06,2.05-2.14,3.02-3.23,7.91-2.15,17.55-5.97,27.83-12.57v-3.01Zm-46.28-38.61c1.85-1.3,3.54-1.28,5.3.07.72.55,1.13,1.35,1.27,2.44.77,6.07-7.17,18.41-12,25.03-.35-9.65-.85-17.88-.86-17.98h-.02c1.87-4.58,4.07-7.99,6.31-9.57Zm-9.97,22.31c.44-2.3.96-4.51,1.55-6.58.65,12.37.98,24.71.79,32.86-.87.51-1.75,1.05-2.63,1.62-1.67-7.96-1.59-18.05.28-27.89Zm2.24,29.21c-.11,2.35-.28,4.16-.52,5.28-.25-.55-.57-1.38-.98-2.64-.15-.46-.29-.93-.42-1.41.64-.43,1.28-.84,1.91-1.23Zm-21.62,31.02c-3.07,1.1-5.2,1.21-5.56.27-.76-2,2.42-8.5,9.81-16.61,4.17-4.57,8.76-8.67,13.31-11.96.07.22.14.45.21.67,1.13,3.55,2.11,5.55,3.8,5.23,1.03-.19,2.23-.42,2.58-10.1,1.52-.83,3-1.54,4.43-2.12,1.6-.65,2.71-.56,2.93-.14.34.62-.33,2.71-3.43,4.93-.46.3-1.52,1.11-1.47,2.23.03.63.41,1.18,1.03,1.51.77.4,6.79.74,15.88-1.22-12.22,12.31-28.71,21.97-43.53,27.3Zm46.66-30.62c-7.96,2.16-13.96,2.58-16.66,2.46,3.86-2.97,4.65-6.02,3.68-7.78-.74-1.34-2.71-2.3-6.02-.96-1.13.46-2.28.98-3.43,1.57.06-3.41.03-7.72-.11-13.2-.02-.83-.04-1.65-.07-2.48,2.31-2.17,20.02-18.42,30.71-18.12,2.05.06,3.64.73,4.87,2.05,1.93,2.08,2.31,6.3,1.03,11.58-2.17,8.92-7.24,17.33-13.99,24.87Z"
      />
    </svg>
  );
}

export function Google({
  size = 16,
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M21.6 12.23c0-.67-.06-1.32-.18-1.95H12v3.7h5.39a4.62 4.62 0 0 1-2 3.02v2.51h3.24c1.9-1.74 2.99-4.32 2.99-7.28z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.97-.9 6.63-2.43l-3.24-2.51c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22z"
        fill="#34A853"
      />
      <path
        d="M6.41 13.9A6 6 0 0 1 6.1 12c0-.66.11-1.3.31-1.9V7.51H3.07A10 10 0 0 0 2 12c0 1.61.39 3.14 1.07 4.49l3.34-2.59z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.98c1.47 0 2.78.5 3.82 1.5l2.86-2.86A10 10 0 0 0 12 2 10 10 0 0 0 3.07 7.51l3.34 2.59C7.2 7.74 9.4 5.98 12 5.98z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function Github({
  size = 16,
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.72.5.1.68-.22.68-.49v-1.71c-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.92.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.4 9.4 0 0 1 12 6.86c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.07 10.07 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

export function Dot({ size = 8, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" {...props}>
      <circle cx="4" cy="4" r="3" fill="currentColor" />
    </svg>
  );
}

