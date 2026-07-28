import type { ComponentPropsWithoutRef, ElementType } from "react";

type DrawOutlineButtonProps<T extends ElementType> = {
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/**
 * A rectangular button with a static bottom border at rest, whose full
 * outline draws itself in on hover/focus starting from the bottom-left
 * corner and moving clockwise (up the left side, across the top, down the
 * right side, back along the bottom). A plain `<rect>` always starts its
 * implicit path near the top-left, so a custom `<path>` is used instead —
 * a 0-100 viewBox with preserveAspectRatio="none" lets straight-line
 * coordinates stretch to the button's real size (safe since there are no
 * curves/rounded corners), and pathLength=100 keeps stroke-dasharray/
 * dashoffset resolution independent of the actual pixel size.
 */
export function DrawOutlineButton<T extends ElementType = "a">({
  as,
  className = "",
  children,
  ...props
}: DrawOutlineButtonProps<T>) {
  const Component = as ?? "a";

  return (
    <Component
      className={`group relative inline-flex items-center justify-center gap-2 border-b-2 border-primary px-5 py-2.5 text-sm font-medium text-foreground ${className}`}
      {...props}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <path
          d="M 0 100 L 0 0 L 100 0 L 100 100 Z"
          pathLength={100}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          strokeDasharray={100}
          className="[stroke-dashoffset:100] transition-[stroke-dashoffset] duration-500 ease-out group-hover:[stroke-dashoffset:0] group-focus-visible:[stroke-dashoffset:0]"
        />
      </svg>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </Component>
  );
}
