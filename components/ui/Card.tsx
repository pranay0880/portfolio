import type { ComponentPropsWithoutRef } from "react";

export function Card({ className = "", ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={`border-border bg-surface rounded-2xl border p-6 shadow-sm ${className}`}
      {...props}
    />
  );
}
