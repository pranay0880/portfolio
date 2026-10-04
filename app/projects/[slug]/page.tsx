import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CaseStudyContent } from "@/components/sections/CaseStudyContent";
import { projects } from "@/lib/content";

// Only the slugs in lib/content.ts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  const title = `${project.title} - Case study`;
  return {
    title,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title,
      description: project.description,
      url: `/projects/${project.slug}`,
      type: "article",
      ...(project.image ? { images: [project.image] } : {}),
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <article className="py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Link
            href="/#projects"
            className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 font-mono text-sm"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            All projects
          </Link>

          <p className="text-muted-foreground mt-8 font-mono text-xs tracking-wide uppercase">
            {project.meta}
          </p>
          <h1 className="text-foreground mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {project.title}
          </h1>
          <p className="text-muted-foreground mt-4 text-base">{project.description}</p>

          {project.image ? (
            <div className="border-border relative mt-8 aspect-[16/10] overflow-hidden rounded-lg border">
              <Image
                src={project.image}
                alt={`${project.title} screenshot`}
                fill
                sizes="(min-width: 768px) 720px, 100vw"
                quality={90}
                className="object-cover object-top"
                priority
              />
            </div>
          ) : null}

          <div className="mt-10">
            <CaseStudyContent project={project} />
          </div>
        </div>
      </Container>
    </article>
  );
}
