type LogoMarkProps = { size?: number | "100%"; className?: string; id?: string };

/**
 * The source PNG is a shape with a genuine alpha channel (transparent
 * background). It's rendered via CSS mask + `currentColor` rather than
 * `next/image` so it inherits the surrounding text color and stays legible
 * in both light and dark mode without needing separate color variants.
 *
 * Decorative only — always paired with the visible name text, so it's
 * hidden from assistive tech rather than given its own (redundant) label.
 */
export function LogoMark({ size = 28, className = "", id }: LogoMarkProps) {
  return (
    <span
      id={id}
      aria-hidden="true"
      className={`inline-block bg-current ${className}`}
      style={{
        width: size,
        height: size,
        WebkitMaskImage: "url(/images/logo-mark.png)",
        maskImage: "url(/images/logo-mark.png)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
