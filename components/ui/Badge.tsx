import type { ComponentPropsWithoutRef } from "react";

export function Badge({ className = "", ...props }: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-border bg-surface-muted px-3 py-1 text-sm text-foreground ${className}`}
      {...props}
    />
  );
}
