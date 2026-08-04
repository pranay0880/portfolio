import { Clock, Cloud, Code2, Database, Layers, Server, Sparkles, type LucideIcon } from "lucide-react";

export const profile = {
  name: "Pranay Dasari",
  title: "Full Stack Developer",
  availability: "Curious, Learning, Growing",
  tagline: "Full Stack Developer — Building with Purpose.",
  summary:
    "3 years of experience working across React, Next.js, and Node.js — taking features from interface to database without losing sight of how they hold up in production. Away from the keyboard, usually watching anime, drawn to the same craftsmanship that goes into a well-built feature.",
  bio: [
    "Every developer has a story. Mine began with curiosity and evolved into building products that solve real problems.",
    "I'm a Full Stack Developer based in India with 3+ years of experience delivering production-grade web applications. From responsive interfaces built with React, Next.js, and TypeScript to scalable backend services powered by Node.js and PostgreSQL, I enjoy building systems that are reliable from end to end.",
    "Beyond writing features, I focus on architecture that lasts—designing modular frontends, improving maintainability, and building AI-powered experiences that make products more accessible across languages and regions.",
    "For me, good software isn't just about how it looks. It's about how it performs, scales, and continues to deliver value long after it's shipped.",
  ],
  location: "India",
  email: "pranay0880@gmail.com",
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL ?? "/resume.pdf",
  social: {
    linkedin: "https://www.linkedin.com/in/pranay-dasari0880/",
    github: "https://github.com/pranay0880",
  },
  photo: "/images/profile.png",
} as const;

export type CharacterStat = {
  label: string;
  subtitle: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
};

export const characterStats: CharacterStat[] = [
  { label: "Experience", subtitle: "Where I've worked", value: "3+", unit: "Years", icon: Clock },
  { label: "Projects", subtitle: "What I've built", value: "10+", unit: "Builds", icon: Layers },
  { label: "Beyond Code", subtitle: "What inspires me", value: "Anime", icon: Sparkles },
];

export type TechCategory = {
  category: string;
  icon: LucideIcon;
  level: number;
  quote: string;
  items: string[];
};

export const techStack: TechCategory[] = [
  {
    category: "Frontend",
    icon: Code2,
    level: 99,
    quote: "Building smooth experiences.",
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
    level: 75,
    quote: "Powering the world behind the UI.",
    items: ["Python", "Express", "Node.js"],
  },
  {
    category: "Database",
    icon: Database,
    level: 70,
    quote: "Data is the true source of power.",
    items: ["PostgreSQL", "MongoDB", "SQLite"],
  },
  {
    category: "DevOps",
    icon: Cloud,
    level: 55,
    quote: "Automating deployments.",
    items: ["Azure", "Docker", "GitHub Actions", "CI/CD", "Vercel"],
  },
  {
    category: "Others",
    icon: Layers,
    level: 80,
    quote: "Always learning.",
    items: ["Git", "GitHub", "Jira", "Bitbucket"],
  },
];

export type TimelineProject = {
  name: string;
  blurb?: string;
};

export type TimelineNode = {
  year: string;
  title: string;
  role?: string;
  scope?: string;
  projects?: TimelineProject[];
  bullets?: string[];
  stack?: string[];
  focus?: string[];
  current?: boolean;
};

export const timeline: TimelineNode[] = [
  {
    year: "2023",
    title: "Self-Learning",
    role: "Developer Foundations",
    scope:
      "Built a foundation in web development through a structured online learning and hands-on projects.",
    stack: ["HTML", "CSS", "JavaScript", "Python", "React", "Bootstrap"],
  },
  {
    year: "Oct 2023",
    title: "Aapmor",
    role: "Full Stack Developer",
    scope:
      "Started my professional development career working on enterprise and internal applications, initially focused on React and the MERN stack.",
    projects: [{ name: "J&J" }, { name: "Nexus" }],
    bullets: [
      "Developed and maintained production features using React and MERN.",
      "Worked collaboratively on enterprise and internal applications.",
      "Gained experience with production development, API integration, and code quality.",
    ],
    stack: ["React", "JavaScript", "Node.js", "Express", "MongoDB","Materual UI"],
  },
  {
    year: "2025",
    title: "Full Stack Developer",
    projects: [
      { name: "Aapmor Blogs", blurb: "Contributed to the development of an internal blogging platform." },
      {
        name: "Liberty Dental Plan(LDP)",
        blurb: "Joined the LDP project as a Senior Developer, working across two applications.",
      },
    ],
    bullets: [
      "Developed and maintained production features.",
      "Worked with Next.js, TypeScript, SQL, and Contentful.",
      "Took ownership of application areas and guided junior developers.",
    ],
    stack: ["Next.js", "TypeScript", "SQL", "Contentful"],
  },
  {
    year: "2026",
    title: "Multi-Project Development",
    scope:
      "Continued contributing to J&J and LDP, while expanding into additional products and development environments.",
    projects: [
      { name: "Quantive", blurb: "Employee Performance Management System." },
      { name: "Shiftlyn", blurb: "Personal/team product developed outside Aapmor." },
    ],
    focus: ["Full-stack development", "Application ownership", "Mentoring", "Product development"],
    current: true,
  },
];

export const currentlyBuilding = {
  label: "Always Learning"
};

export type ProjectEntry = {
  title: string;
  meta: string;
  description: string;
  bullets?: string[];
  quote: string;
  badge?: string;
  image?: string;
  link?: string;
  stack: string[];
};

export const projects: ProjectEntry[] = [
  {
    title: "Johnson & Johnson",
    meta: "AAPMOR TECHNOLOGIES · ENTERPRISE SAP MODERNIZATION · 2023 TO PRESENT",
    description:
      "Modernizing SAP workflows into a fast, decoupled React interface for internal Johnson & Johnson users.",
    bullets: [
      "Developed SAP applications into a modern React-based interface for internal Johnson & Johnson users.",
      "Worked on microfrontend architecture to decouple multiple features, reducing dependencies and enabling independent development and deployment, faster releases, and reduced downtime.",
      "Introduced AI-driven language translation features and a KPI analytics dashboard for logs, improving accessibility and UX across diverse regions.",
    ],
    quote: "From legacy SAP screens to a UI people actually enjoy using.",
    badge: "Confidential",
    stack: ["React", "Node","MongoDB","Material UI", "Microfrontend Architecture", "AI Translation", "Redis"],
  },
  {
    title: "Aapmor Website",
    meta: "AAPMOR TECHNOLOGIES · MICROFRONTEND ARCHITECTURE · 2023 TO PRESENT",
    description:
      "Company website built with a focus on interactive UI and a smooth user experience. Introduced microfrontend architecture to decouple features, reducing dependencies and enabling independent development and deployment.",
    quote: "Decoupled the features, not just the code.",
    badge: "Live",
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
