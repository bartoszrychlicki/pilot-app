"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Search } from "@/components/br/icons";

export interface CommandPaletteItem {
  id: string;
  label: string;
  description?: string;
  group?: string;
  shortcut?: React.ReactNode;
  keywords?: string[];
  href?: string;
  action?: () => void;
  /** Optional leading visual (icon, avatar, logo) rendered before the label. */
  icon?: React.ReactNode;
}

export const BR_DOCS_COMMANDS: CommandPaletteItem[] = [
  { id: "docs-home", label: "Docs home", group: "Docs", href: "/docs", keywords: ["overview", "start"] },
  { id: "install", label: "Installation", group: "Docs", href: "/docs/installation", keywords: ["registry", "shadcn"] },
  { id: "tokens", label: "Tokens & layout", group: "Foundations", href: "/docs/foundations/tokens", keywords: ["spacing", "motion", "z-index"] },
  { id: "button", label: "Button", group: "Primitives", href: "/docs/components/button" },
  { id: "form", label: "Form", group: "Patterns", href: "/docs/components/form", keywords: ["field", "error", "summary"] },
  { id: "states", label: "States", group: "Patterns", href: "/docs/components/states", keywords: ["empty", "loading", "error"] },
  { id: "data-table", label: "DataTable", group: "Patterns", href: "/docs/components/data-table", keywords: ["sort", "pagination", "selection"] },
  { id: "command-palette", label: "CommandPalette", group: "Patterns", href: "/docs/components/command-palette", keywords: ["search", "cmdk"] },
  { id: "a11y", label: "Accessibility", group: "Guides", href: "/docs/accessibility", keywords: ["aria", "focus"] },
  { id: "extend", label: "Extending BR-UI", group: "Guides", href: "/docs/extending", keywords: ["accent", "variant"] },
  { id: "versioning", label: "Versioning", group: "Guides", href: "/docs/versioning", keywords: ["edition", "semver"] },
];

export function CommandPalette({
  open,
  onOpenChange,
  items = BR_DOCS_COMMANDS,
  title = "BR-UI command palette",
  description = "Search BR-UI docs and run quick actions.",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items?: CommandPaletteItem[];
  title?: string;
  description?: string;
}) {
  const groups = React.useMemo(() => {
    const map = new Map<string, CommandPaletteItem[]>();
    items.forEach((item) => {
      const group = item.group || "Commands";
      map.set(group, [...(map.get(group) || []), item]);
    });
    return [...map.entries()];
  }, [items]);

  const run = (item: CommandPaletteItem) => {
    onOpenChange(false);
    window.setTimeout(() => {
      if (item.action) item.action();
      if (item.href) window.location.href = item.href;
    }, 80);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title={title} description={description}>
      <CommandInput placeholder="Search components, tokens, patterns..." />
      <CommandList>
        <CommandEmpty>
          <div className="br-command-empty">
            <Search size={16} />
            No command found.
          </div>
        </CommandEmpty>
        {groups.map(([group, groupItems], index) => (
          <React.Fragment key={group}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup heading={group}>
              {groupItems.map((item) => (
                <CommandItem
                  key={item.id}
                  value={[item.label, item.description, ...(item.keywords || [])].filter(Boolean).join(" ")}
                  onSelect={() => run(item)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.description && <span className="br-command-desc">{item.description}</span>}
                  {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
                </CommandItem>
              ))}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

