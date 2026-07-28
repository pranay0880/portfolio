import type { ComponentPropsWithoutRef, ElementType } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "border border-border bg-surface text-foreground hover:bg-surface-muted disabled:opacity-50",
  ghost: "text-foreground hover:bg-surface-muted disabled:opacity-50",
};

type ButtonProps<T extends ElementType> = {
  as?: T;
  variant?: ButtonVariant;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

export function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps<T>) {
  const Component = as ?? "button";
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
