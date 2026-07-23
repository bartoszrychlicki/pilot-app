"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { BRSignet, Search, Bell } from "@/components/br/icons";
import { Avatar } from "@/components/br/primitives";

export interface TopbarLink {
  label: string;
  href: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

interface TopbarProps {
  brand?: React.ReactNode;
  links: TopbarLink[];
  onSearchClick?: () => void;
}

export function Topbar({ brand = "Atelier", links, onSearchClick }: TopbarProps) {
  return (
    <header className="br-topbar">
      <div className="inner">
        <div className="brand">
          <BRSignet height={30} />
          <span>{brand}</span>
        </div>
        <nav className="nav">
          {links.map((l) => (
            <a
              key={l.label}
              className={cn("link", l.active && "active")}
              href={l.href}
              onClick={l.onClick}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="end">
          <button type="button" className="search" onClick={onSearchClick}>
            <Search size={14} />
            <span>Search components</span>
            <span className="kbd">⌘K</span>
          </button>
          <button type="button" className="icon-btn" aria-label="Notifications">
            <Bell size={16} />
          </button>
          <Avatar size="sm" accent fallback="BR" />
        </div>
      </div>
    </header>
  );
}

