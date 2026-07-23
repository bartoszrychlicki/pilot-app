import * as React from "react";
import { cn } from "@/lib/utils";

export function FormShell({
  className,
  ...props
}: React.FormHTMLAttributes<HTMLFormElement>) {
  return <form {...props} className={cn("br-form", className)} />;
}

export function FormActions({
  align = "end",
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  align?: "start" | "end" | "between";
}) {
  return (
    <div
      {...props}
      className={cn("br-form-actions", align !== "end" && `align-${align}`, className)}
    />
  );
}

export interface FormFieldRenderProps {
  id: string;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
}

export function FormField({
  label,
  hint,
  error,
  action,
  children,
  id: idProp,
  className,
}: {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  action?: React.ReactNode;
  children: (props: FormFieldRenderProps) => React.ReactNode;
  id?: string;
  className?: string;
}) {
  const reactId = React.useId();
  const id = idProp || `br-field-${reactId.replace(/:/g, "")}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("br-form-field", error && "invalid", className)}>
      {(label || action) && (
        <div className="br-form-field-head">
          {label && <label htmlFor={id}>{label}</label>}
          {action}
        </div>
      )}
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })}
      {error ? (
        <div id={errorId} className="br-form-error">
          {error}
        </div>
      ) : hint ? (
        <div id={hintId} className="br-form-hint">
          {hint}
        </div>
      ) : null}
    </div>
  );
}

export function FormErrorSummary({
  title = "Review the highlighted fields.",
  errors,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  title?: React.ReactNode;
  errors: Array<{ id?: string; label: React.ReactNode; message: React.ReactNode }>;
}) {
  if (!errors.length) return null;
  return (
    <div {...props} className={cn("br-form-summary", className)} role="alert">
      <strong>{title}</strong>
      <ul>
        {errors.map((error, index) => (
          <li key={error.id || index}>
            {error.id ? (
              <a href={`#${error.id}`}>
                <span>{error.label}</span>
                {error.message}
              </a>
            ) : (
              <>
                <span>{error.label}</span>
                {error.message}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

