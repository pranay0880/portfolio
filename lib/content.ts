import { Clock, Cloud, Code2, Database, Layers, Server, Sparkles, type LucideIcon } from "lucide-react";

export const profile = {
  name: "Pranay Dasari",
  title: "Full Stack Developer",
  availability: "Curious, Learning, Growing",
  tagline: "Full Stack Developer — Building with Purpose.",
  summary:
    "3 years of experience working across React, Next.js, and Node.js — taking features from interface to database without losing sight of how they hold up in production. Away from the keyboard, usually watching anime, drawn to the same craftsmanship that goes into a well-built feature.",
  bio: [
    "My story started with curiosity about how things work, and turned into a habit of building products that solve real problems.",
    "Day to day, I work across the stack—TypeScript on the frontend, PostgreSQL and MongoDB on the backend—with a focus on architecture that holds up as products grow: modular frontends, cleaner data flows, and fewer surprises for the next person who touches the code.",
    "I've also built AI-powered features that make products more accessible across languages and regions, and taken on mentoring junior developers as I've grown into ownership of larger pieces of the systems I work on.",
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
  { label: "Beyond Code", subtitle: "What inspires me", value: "Anime × Code", icon: Sparkles },
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
  links?: { label: string; url: string }[];
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
    title: "Aapmor Blogs",
    meta: "AAPMOR TECHNOLOGIES · FULL-STACK BLOG PLATFORM · 2024 TO PRESENT",
    description:
      "A full-stack blog platform enabling users to write, edit, preview, and share blogs, with social features (likes, comments, saving) and admin capabilities to manage users and content.",
    bullets: [
      "Create, preview, edit, and delete blogs with real-time notifications via Socket.IO.",
      "Rich-text editor using React-Quill; trending, liked, and viewed blogs sections.",
      "Light/Dark mode toggle and Lottie animations for enhanced UX.",
      "Admin panel for managing blogs, users, and winner announcements; OTP login and JWT-based authentication.",
    ],
    quote: "A platform where writers thrive and readers discover stories.",
    badge: "Live",
    image: "/images/aapmor-blogs.png",
    link: "https://blogs.aapmor.com/",
    stack: ["React", "Node.js", "MongoDB", "Socket.IO", "React-Quill", "JWT", "Lottie", "Material UI"],
  },
  {
    title: "Performance Management System",
    meta: "AAPMOR TECHNOLOGIES · ROLE-BASED PERFORMANCE MANAGEMENT · 2024 TO PRESENT",
    description:
      "A role-based web application designed to manage employee performance and learning goals across Admin, Manager, Lead, and Employee roles with multi-level approval workflows and intelligent performance scoring.",
    bullets: [
      "Built role-based access control with Admin, Manager, Lead, and Employee roles supporting granular permissions.",
      "Implemented multi-level approval workflows and quarterly evaluation cycles with weighted scoring logic.",
      "Developed dynamic scoring engine combining competency and technical goal performance into a unified performance score.",
      "Architected achievement tracking system with role-based feedback and notification mechanisms.",
      "Created admin analytics dashboard for performance trends, team comparisons, and goal completion metrics.",
      "Implemented comprehensive audit logging for compliance and performance tracking.",
    ],
    quote: "Where performance meets growth through intelligent feedback and transparent evaluation.",
    badge: "Internal",
    stack: ["React", "Node.js", "MongoDB", "REST API", "Material UI", "Chart.js", "Role-Based Access Control"],
  },
  {
    title: "Internal Tools & Side Projects",
    meta: "AAPMOR TECHNOLOGIES · MULTIPLE PROJECTS · 2023 TO PRESENT",
    description:
      "Collection of internal tools and side projects built to streamline operations, manage employees, and solve real-world problems. Includes an enterprise website with microfrontend architecture, a comprehensive employee management system, and a SaaS scheduling application.",
    bullets: [
      "Aapmor Website: Company website with focus on interactive UI and smooth UX. Introduced microfrontend architecture to decouple features, reducing dependencies and enabling independent deployment.",
      "Nexus: Robust internal application for managing employees, access control, and recruitment. Implements RBAC (Super Admin, Admin, Lead, Employee) with role-tailored dashboards.",
      "Nexus - Employee Management: Add, edit, and delete users based on role-based access control with comprehensive audit trails.",
      "Nexus - Recruitment Module: Manage new joiners, interview scheduling, and selection process with workflow automation.",
      "Nexus - AI Chatbot: Integrated OpenAI chatbot for answering employee queries from internal documentation, improving employee experience.",
      "Shiftlyn: Modern SaaS scheduling application enabling efficient team scheduling, shift management, and employee availability tracking.",
    ],
    quote: "Building tools that make teams work smarter, not harder.",
    badge: "Live",
    image: "/images/project-aapmor.png",
    links: [
      { label: "Aapmor Website", url: "https://aapmor.com/" },
      { label: "Shiftlyn", url: "https://shiftlyn.com/" },
    ],
    stack: ["React", "Node.js", "MongoDB", "Material UI", "Framer Motion", "RBAC", "AuthX", "OpenAI", "REST API", "TypeScript"],
  },
  {
    title: "Personal Portfolio",
    meta: "PERSONAL PROJECT · FULL-STACK PORTFOLIO · V1 (2023) & V2 (2026)",
    description:
      "Evolution of personal portfolio showcasing professional work and skills. V1 built with React highlighting career journey. V2 redesigned with Next.js, TypeScript, and modern animations for a polished, interactive experience with real-time contact form integration.",
    bullets: [
      "V1 (React): Simple, clean portfolio with career timeline, skills showcase, and project gallery deployed on Vercel.",
      "V2 (Next.js): Comprehensive redesign featuring sticky-note skill cards, scroll-driven timeline animations, and integrated contact form with email notifications.",
      "Implemented Framer Motion animations (spring physics, scroll-driven progress, traveling glows) for smooth, engaging interactions.",
      "Added real-time form validation with React Hook Form + Zod, email delivery via Resend, and database storage with Prisma.",
      "Responsive design with light/dark mode toggle and mobile-optimized layouts using Tailwind CSS.",
      "Deployed V2 on Azure App Service with PostgreSQL database and Application Insights monitoring.",
    ],
    quote: "A developer's portfolio is their digital handshake — make it memorable.",
    badge: "Live",
    image: "/images/portfolio-v2.png",
    links: [
      { label: "V2 (Current)", url: "https://pranaydasari.in/" },
      { label: "V1 (Archive)", url: "https://pradeep-dasari.vercel.app/" },
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Prisma", "PostgreSQL", "Resend", "Azure", "Vercel"],
  },
];

export const siteMeta = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  title: `${profile.name} — ${profile.title}`,
  description: profile.summary,
};
