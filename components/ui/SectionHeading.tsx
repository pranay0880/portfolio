type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-10 max-w-2xl">
      {eyebrow ? (
        <p className="text-primary mb-2 font-mono text-sm font-medium tracking-wide uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {description ? <p className="text-muted-foreground mt-3 text-base">{description}</p> : null}
    </div>
  );
}
