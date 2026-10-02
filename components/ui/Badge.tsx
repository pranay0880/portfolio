import type { ComponentPropsWithoutRef } from "react";

export function Badge({ className = "", ...props }: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={`border-border bg-surface-muted text-foreground inline-flex items-center rounded-full border px-3 py-1 text-sm ${className}`}
      {...props}
    />
  );
}
