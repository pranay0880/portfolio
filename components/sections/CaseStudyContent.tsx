import { ArrowUpRight } from "lucide-react";
import type { ProjectEntry } from "@/lib/content";

const SECTIONS = [
  { key: "problem", label: "Problem" },
  { key: "ownership", label: "What I owned" },
  { key: "architecture", label: "Architecture" },
  { key: "decision", label: "Key decision" },
  { key: "impact", label: "Impact" },
] as const;

/**
 * Problem -> ownership -> architecture -> key decision -> impact, plus stack
 * and links. Shared by the home-page drawer and the /projects/<slug> page.
 */
export function CaseStudyContent({ project }: { project: ProjectEntry }) {
  return (
    <>
      <dl className="space-y-6">
        {SECTIONS.map(({ key, label }) => {
          const value = project.caseStudy[key];
          return (
            <div key={key}>
              <dt className="text-primary font-mono text-xs font-semibold tracking-wider uppercase">
                {/* "Key decision" -> "Key decisions" when there are several. */}
                {Array.isArray(value) && value.length > 1 && key === "decision"
                  ? `${label}s`
                  : label}
              </dt>
              <dd className="text-foreground/90 mt-2 text-sm leading-relaxed">
                {Array.isArray(value) ? (
                  <ul className="list-disc space-y-1.5 pl-4">
                    {value.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{value}</p>
                )}
              </dd>
            </div>
          );
        })}
      </dl>

      <div className="border-border mt-8 border-t pt-6">
        <p className="text-muted-foreground font-mono text-xs font-semibold tracking-wider uppercase">
          Stack
        </p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="border-border text-muted-foreground rounded-full border px-2.5 py-0.5 font-mono text-[11px]"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>

      {project.links || project.link ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {(project.links ?? [{ label: "Visit site", url: project.link! }]).map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary inline-flex items-center gap-1.5 font-mono text-sm hover:underline"
            >
              {link.label}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          ))}
        </div>
      ) : null}
    </>
  );
}
