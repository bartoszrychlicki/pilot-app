import * as React from "react";
import { Button } from "@/components/br/primitives";
import { Inbox, Search, Warning } from "@/components/br/icons";
import { cn } from "@/lib/utils";

export interface StateBlockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  compact?: boolean;
}

function StateBlock({
  eyebrow,
  title,
  description,
  action,
  icon,
  compact,
  className,
  ...rest
}: StateBlockProps) {
  return (
    <div {...rest} className={cn("br-state", compact && "compact", className)}>
      {icon && <div className="br-state-icon">{icon}</div>}
      {eyebrow && <div className="br-state-eyebrow">{eyebrow}</div>}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action && <div className="br-state-action">{action}</div>}
    </div>
  );
}

export function EmptyState({
  icon = <Inbox size={18} />,
  eyebrow = "Empty",
  title = "Nothing here yet.",
  description = "Create the first item or adjust your filters.",
  action,
  ...props
}: Partial<StateBlockProps>) {
  return (
    <StateBlock
      {...props}
      icon={icon}
      eyebrow={eyebrow}
      title={title}
      description={description}
      action={action}
    />
  );
}

export function ErrorState({
  icon = <Warning size={18} />,
  eyebrow = "Error",
  title = "Something broke.",
  description = "Try again or contact support if the problem keeps happening.",
  action = <Button variant="ghost" size="sm">Retry</Button>,
  ...props
}: Partial<StateBlockProps>) {
  return (
    <StateBlock
      {...props}
      icon={icon}
      eyebrow={eyebrow}
      title={title}
      description={description}
      action={action}
    />
  );
}

export function LoadingState({
  eyebrow = "Loading",
  title = "Fetching the latest view.",
  description = "This usually takes a moment.",
  ...props
}: Partial<StateBlockProps>) {
  return (
    <StateBlock
      {...props}
      icon={<Search size={18} />}
      eyebrow={eyebrow}
      title={title}
      description={description}
      action={
        <div className="br-state-skeletons" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      }
    />
  );
}

