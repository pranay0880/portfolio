import { Code2, Database, GitBranch, Server, type LucideIcon } from "lucide-react";

export const profile = {
  name: "Pranay Dasari",
  title: "Full Stack Developer",
  availability: "Curious, Learning, Growing",
  tagline: "Full Stack Developer — Building with Purpose.",
  summary:
    "3 years of experience working across React, Next.js, and Node.js — taking features from interface to database without losing sight of how they hold up in production. Away from the keyboard, usually watching anime, drawn to the same craftsmanship that goes into a well-built feature.",
  bio: [
    "Full Stack Developer based in India with 3+ years of experience building production web applications — from customer-facing interfaces to the APIs and databases behind them. Day-to-day work spans React, Next.js, and TypeScript on the frontend, and Node.js and PostgreSQL on the backend.",
    "A focus on owning problems end-to-end rather than just the parts that are easy to demo: architecting decoupled, microfrontend-based systems that make releases faster and safer, and shipping AI-driven features that make products usable across languages and regions. Not just the UI, but how a feature holds up in production.",
    "Beyond feature work: cleaner and more maintainable code, current frontend architecture patterns, and attention to the performance details that shape a faster experience. Open to conversations about new roles, projects, or technical challenges.",
  ],
  location: "India",
  email: "pranay0880@gmail.com",
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL ?? "",
  social: {
    linkedin: "https://www.linkedin.com/in/pranay-dasari0880/",
    github: "https://github.com/pranay0880",
  },
  photo: "/images/profile.png",
} as const;

export type TechCategory = {
  category: string;
  icon: LucideIcon;
  items: string[];
};

export const techStack: TechCategory[] = [
  {
    category: "Frontend",
    icon: Code2,
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "HTML",
      "CSS",
      "JavaScript",
      "Bootstrap",
      "Material UI",
      "Tailwind CSS",
    ],
  },
  {
    category: "Backend",
    icon: Server,
    items: ["Python", "Express", "Node.js"],
  },
  {
    category: "Database",
    icon: Database,
    items: ["PostgreSQL", "MongoDB", "SQLite"],
  },
  {
    category: "Tools",
    icon: GitBranch,
    items: ["Git", "GitHub", "Jira", "Bitbucket"],
  },
];

export type ExperienceEntry = {
  period: string;
  role: string;
  company: string;
  companyLogo: string;
  bullets: string[];
};

export const experience: ExperienceEntry[] = [
  {
    period: "Oct 2023 - Present",
    role: "Full Stack Developer (SDE-1)",
    company: "Aapmor Technologies",
    companyLogo: "/images/aapmor-logo.png",
    bullets: [
      "Building and managing interactive frontend UIs using React and Material UI.",
      "Development of SAP applications into a modern React-based interface for internal Johnson & Johnson users.",
      "Introduced microfrontend architecture to decouple features, reducing dependencies and enabling independent development and deployment, cutting release friction and downtime.",
      "Introduced AI-driven language translation features, extending the application to multiple international languages and improving accessibility across regions.",
      "Led development of the company website, focused on a modern UI design and a smooth user experience.",
      "Integrated with backend APIs and services to fetch and manipulate data.",
      "Participated in client meetings to gather requirements, provide updates, and address feedback.",
    ],
  },
];

export type ProjectEntry = {
  title: string;
  description: string;
  image: string;
  link: string;
  stack: string[];
};

export const projects: ProjectEntry[] = [
  {
    title: "Aapmor Website",
    description:
      "Company website built with a focus on interactive UI and a smooth user experience. Introduced microfrontend architecture to decouple features, reducing dependencies and enabling independent development and deployment.",
    image: "/images/project-aapmor.png",
    link: "https://aapmor.com/",
    stack: ["React", "Material UI", "Framer Motion"],
  },
];

export const siteMeta = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  title: `${profile.name} — ${profile.title}`,
  description: profile.summary,
};
