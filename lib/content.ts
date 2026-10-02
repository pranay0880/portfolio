import {
  Clock,
  Code2,
  Database,
  Layers,
  Network,
  Server,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export const profile = {
  name: "Pranay Dasari",
  title: "Full Stack Developer",
  tagline: "Full Stack Engineer · Enterprise React & Next.js",
  summary:
    "3+ years shipping enterprise applications, modernizing SAP workflows for Johnson & Johnson with a microfrontend architecture, and leading the frontend of Liberty Dental Plan's Next.js and TypeScript apps. I own application areas end to end, build role-based systems and AI features, and mentor junior developers.",
  // Proof points shown under the hero summary - each backed by a project below.
  highlights: [
    "Frontend lead",
    "Microfrontend architecture",
    "Role-based access control",
    "Application ownership",
    "Mentoring",
  ],
  bio: [
    "My story started with curiosity about how things work, and turned into a habit of <strong>building products</strong> that solve real problems.",
    "Day to day, I work across the stack—TypeScript on the frontend, PostgreSQL and MongoDB on the backend with a focus on <strong>scalable architecture</strong> that holds up as products grow: modular frontends, cleaner data flows, and fewer surprises for the next person who touches the code.",
    "I've also built <strong>AI-powered features</strong> that make products more accessible across languages and regions, and taken on mentoring junior developers as I've grown into ownership of larger pieces of the systems I work on.",
  ],
  location: "India, Hyderabad.",
  email: "pranay0880@gmail.com",
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL ?? "/resume.pdf",
  social: {
    linkedin: "https://www.linkedin.com/in/pranay-dasari0880/",
    github: "https://github.com/pranay0880",
  },
  photo: "/images/profile.webp",
  // Watercolour portrait on cream paper - matches the light theme.
  photoLight: "/images/profile-portrait-light-2.webp",
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

// How deep the experience goes - a competency model, not a score.
export type Depth = "Primary" | "Proficient" | "Familiar";

export type TechCategory = {
  category: string;
  icon: LucideIcon;
  depth: Depth;
  items: string[];
};

// The strongest, most in-demand skills from the resume - curated, not exhaustive.
export const techStack: TechCategory[] = [
  {
    category: "Frontend",
    icon: Code2,
    depth: "Primary",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Material UI"],
  },
  {
    category: "Architecture",
    icon: Network,
    depth: "Proficient",
    items: ["Microfrontends", "System design", "Responsive design", "Performance optimization"],
  },
  {
    category: "Backend",
    icon: Server,
    depth: "Proficient",
    items: ["Node.js", "REST APIs", "Socket.IO", "Redis", "Kafka"],
  },
  {
    category: "Databases",
    icon: Database,
    depth: "Proficient",
    items: ["MongoDB", "PostgreSQL", "SQL"],
  },
  {
    category: "Auth & Security",
    icon: ShieldCheck,
    depth: "Proficient",
    items: ["OAuth / SSO", "JWT", "RBAC", "Audit logging", "KPI metrics"],
  },
  {
    // Cloud, quality and everyday tooling on one note.
    category: "Cloud, Quality & Tools",
    icon: Layers,
    depth: "Familiar",
    items: ["Azure", "GitHub Actions", "Jest", "Accessibility (WCAG)", "Lighthouse", "Git", "Jira"],
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

// Told as a progression of responsibility, not a list of jobs.
export const timeline: TimelineNode[] = [
  {
    year: "2023",
    title: "Foundations",
    role: "Self-taught developer",
    scope:
      "Taught myself web development through structured courses and hands-on projects, coming from a civil engineering background.",
    stack: ["JavaScript", "React", "Python", "HTML & CSS"],
  },
  {
    year: "Sep 2023",
    title: "Contributor",
    role: "Full Stack Developer (SDE-1) · Aapmor",
    scope: "Joined Aapmor shipping production features on enterprise and internal applications.",
    projects: [{ name: "Johnson & Johnson" }, { name: "Nexus" }],
    bullets: [
      "Modernized legacy SAP workflows into React interfaces for J&J's internal users.",
      "Delivered features end to end across the MERN stack: UI, APIs and data.",
      "Learned production delivery: API integration, code quality and release discipline.",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "Material UI"],
  },
  {
    year: "2024",
    title: "Core contributor",
    role: "From single features to core parts of platforms",
    projects: [
      { name: "Nexus", blurb: "Employees, access control and recruitment on one platform." },
      { name: "Aapmor Blogs", blurb: "Full-stack internal publishing platform." },
    ],
    bullets: [
      "Introduced the microfrontend architecture across 4 J&J modules, so teams could release independently.",
      "Major contributor to Nexus across 3 domains, including 4-role RBAC and SSO through AuthX.",
      "Major contributor to Aapmor Blogs, including real-time notifications and OTP/JWT auth.",
    ],
    stack: ["Microfrontends", "RBAC", "Socket.IO", "OpenAI"],
  },
  {
    year: "2025",
    title: "Frontend lead & mentor",
    role: "Leading the frontend on Liberty Dental Plan (SDE-1)",
    projects: [
      {
        name: "Liberty Dental Plan",
        blurb: "Frontend lead on 2 apps - customer-facing and administrative - live since 2026.",
      },
    ],
    bullets: [
      "Led the frontend of 2 Liberty Dental Plan applications in Next.js and TypeScript, taking both live in 2026.",
      "Mentored 4 junior developers through code review and technical guidance.",
      "Set development conventions that made delivery more consistent.",
      "Turned client requirements into technical specs.",
    ],
    stack: ["Next.js", "TypeScript", "SQL", "Contentful"],
  },
  {
    year: "2026",
    title: "Designing systems",
    role: "Architecture-level work as an SDE-1",
    projects: [
      { name: "Performance Management System", blurb: "Designed the architecture." },
      { name: "Aapmor website", blurb: "Led development." },
      { name: "Shiftlyn", blurb: "SaaS scheduling app - led architecture and requirements." },
    ],
    bullets: [
      "Designed the architecture of a performance platform: 4-level role hierarchy, weighted scoring and audit logging.",
      "Led the Aapmor corporate website, focused on performance and accessibility.",
      "Still contributing to J&J and LDP alongside new products.",
    ],
    focus: ["System design", "Application ownership", "Mentoring", "Product development"],
    current: true,
  },
];

export const currentlyBuilding = {
  label: "Always Learning",
};

/** Senior-engineer view of a project, shown in the case-study drawer. */
export type CaseStudy = {
  problem: string;
  ownership: string[];
  architecture: string[];
  /** One key decision, or several. */
  decision: string | string[];
  impact: string[];
};

export type ProjectEntry = {
  title: string;
  meta: string;
  description: string;
  bullets?: string[];
  caseStudy: CaseStudy;
  quote: string;
  badge?: string;
  image?: string;
  link?: string;
  links?: { label: string; url: string }[];
  stack: string[];
};

export const projects: ProjectEntry[] = [
  {
    title: "Liberty Dental Plan",
    meta: "AAPMOR TECHNOLOGIES · SALES SITE & MAIN SITE · 2025 TO PRESENT",
    description:
      "Liberty Dental Plan's individual sales platform: a public storefront where people shop dental plans by state, find a dentist and check out online - plus an admin dashboard where the business manages plans, content and approvals.",
    caseStudy: {
      problem:
        "Individuals needed to compare and buy dental plans online for their state, and the business needed to change plans, copays, FAQs and pages without a code release - safely, with sign-off and a record of who changed what.",
      ownership: [
        "Frontend lead on the Sales app - its top contributor, building across the public storefront and the admin dashboard.",
        "Shopping, dentist search and checkout flows, including the hand-off to hosted payment and the return path.",
        "Admin features for plans, FAQs, procedure copays and content pages, with approvals and audit history.",
        "Contributor to the LDP main site: CMS-driven pages and admin tools.",
      ],
      architecture: [
        "Next.js App Router with separate route groups for the public storefront and the protected admin area.",
        "Backend-for-frontend: Next.js route handlers proxy every backend call, keeping service credentials on the server.",
        "Role-based admin with OTP login, an approval workflow, version history and audit logs.",
        "State-aware, server-rendered plan pages with CMS content (Contentful) and SEO metadata.",
        "Standalone build shipped to Azure App Service through an Azure pipeline that runs the test suite first.",
      ],
      decision: [
        "Redesigned the checkout flow around the customer - clearer steps and a form that is easy to understand and quick to fill in.",
        "Restructured the admin flow so admins can view, edit, submit and approve changes with ease, and check every version along the way.",
      ],
      impact: [
        "Live in 2026 - customers shop and buy plans online.",
        "Business teams update plans and content themselves, with approvals and a full audit trail.",
        "250+ automated test files gate every build in CI.",
      ],
    },
    quote: "Buying dental cover online.",
    badge: "Live",
    // Blurred on purpose - client work.
    image: "/images/project-ldp.webp",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "KendoReact",
      "Bootstrap",
      "Contentful",
      "Accessibility (WCAG)",
      "Performance optimization",
      "Jest",
    ],
  },
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
    caseStudy: {
      problem:
        "Core business workflows lived in legacy SAP screens, and every feature shipped inside one application - a single change meant redeploying everything.",
      ownership: [
        "Modernized SAP workflows into React interfaces for internal J&J users.",
        "Introduced the microfrontend architecture across 4 modules.",
        "Built AI-driven localization and a KPI analytics dashboard for logs.",
      ],
      architecture: [
        "Microfrontends: 4 modules with their own build and deployment pipelines.",
        "React + Material UI frontends over Node.js APIs, with Redis and MongoDB.",
      ],
      decision:
        "Split the frontend into independently deployed microfrontends instead of growing the single app - accepting more pipeline setup in exchange for teams releasing without waiting on each other.",
      impact: [
        "Serving 500,000+ users across core business workflows.",
        "No more full-application redeploys; less deployment-related downtime.",
        "Localized into 22 languages for international regions.",
      ],
    },
    quote: "From legacy SAP screens to a UI people actually enjoy using.",
    badge: "Confidential",
    // Blurred on purpose - client work under NDA.
    image: "/images/project-jnj.webp",
    stack: [
      "React",
      "Node",
      "MongoDB",
      "Material UI",
      "Microfrontend Architecture",
      "AI Translation",
      "Redis",
    ],
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
    caseStudy: {
      problem:
        "Aapmor needed an internal publishing platform where people could write, share and engage with blogs - with admins able to moderate users and content.",
      ownership: [
        "Major contributor across the stack: editor, publishing flow, discovery and admin panel.",
        "Implemented authentication with OTP login and JWT.",
      ],
      architecture: [
        "React + Node.js + MongoDB.",
        "Socket.IO for real-time notifications; React-Quill rich-text editor.",
      ],
      decision:
        "Pushed notifications over Socket.IO rather than having clients poll - keeping likes and comments live without hammering the API.",
      impact: [
        "Live at blogs.aapmor.com and used across the company.",
        "Content discovery through trending, liked and most-viewed sections.",
      ],
    },
    quote: "A platform where writers thrive and readers discover stories.",
    badge: "Live",
    image: "/images/aapmor-blogs.webp",
    link: "https://blogs.aapmor.com/",
    stack: [
      "React",
      "Node.js",
      "MongoDB",
      "Socket.IO",
      "React-Quill",
      "JWT",
      "Lottie",
      "Material UI",
    ],
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
      "Designed an achievement tracking system with role-based feedback and notification mechanisms.",
      "Created admin analytics dashboard for performance trends, team comparisons, and goal completion metrics.",
      "Implemented comprehensive audit logging for compliance and performance tracking.",
    ],
    caseStudy: {
      problem:
        "Performance reviews across four levels of hierarchy needed one consistent, auditable process instead of scattered feedback.",
      ownership: [
        "Designed the platform architecture and its core modules.",
        "Designed the weighted scoring engine and multi-level approval workflow.",
      ],
      architecture: [
        "4-level role hierarchy (Admin, Manager, Lead, Employee) with granular access control.",
        "Audit logging on user actions; quarterly evaluation cycles; admin analytics dashboard.",
      ],
      decision:
        "Combined competency ratings and technical goal achievement into one weighted score, so every role is evaluated on the same scale.",
      impact: [
        "One platform running quarterly evaluations across all four roles.",
        "Every action traceable through the audit log.",
      ],
    },
    quote:
      "Where performance meets growth through intelligent feedback and transparent evaluation.",
    badge: "Internal",
    // Blurred on purpose - internal tool.
    image: "/images/project-pms.webp",
    stack: [
      "React",
      "Node.js",
      "MongoDB",
      "REST API",
      "Material UI",
      "Chart.js",
      "Role-Based Access Control",
    ],
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
      "Shiftlyn: SaaS scheduling application for team scheduling, shift management and availability tracking - I led its architecture and requirements.",
    ],
    caseStudy: {
      problem:
        "Employee management, access control and recruitment were separate concerns that needed one secure internal platform - plus a faster company website.",
      ownership: [
        "Major contributor to Nexus across 3 domains: employees, access control and recruitment.",
        "Led development of the Aapmor corporate website.",
        "Led architecture and requirements for Shiftlyn, a SaaS scheduling app - turning scheduling needs into the system design.",
      ],
      architecture: [
        "RBAC with 4 roles (Super Admin, Admin, Lead, Employee) and role-specific dashboards.",
        "SSO through AuthX; OpenAI chatbot grounded in internal documentation.",
      ],
      decision:
        "Integrated SSO through AuthX instead of building a separate login - one identity across tools, with permissions scoped by role.",
      impact: [
        "Three internal domains run from one platform.",
        "Employees get answers from internal docs through the chatbot.",
      ],
    },
    quote: "Building tools that make teams work smarter, not harder.",
    badge: "Internal",
    // Blurred on purpose - company site.
    image: "/images/project-aapmor-blur.webp",
    links: [{ label: "Shiftlyn", url: "https://shiftlyn.com/" }],
    stack: [
      "React",
      "Node.js",
      "MongoDB",
      "Material UI",
      "Framer Motion",
      "RBAC",
      "AuthX",
      "OpenAI",
      "REST API",
      "TypeScript",
    ],
  },
  {
    title: "Personal Portfolio",
    meta: "PERSONAL PROJECT · FULL-STACK PORTFOLIO · V1 (2024) & V2 (2026)",
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
    caseStudy: {
      problem:
        "A portfolio that shows engineering depth, not just design - and is production-grade itself.",
      ownership: ["Designed and built it solo, from UI to infrastructure."],
      architecture: [
        "Next.js App Router + TypeScript, Tailwind CSS, Framer Motion.",
        "Contact pipeline: React Hook Form + Zod -> Prisma/PostgreSQL -> Resend email.",
        "Azure App Service + PostgreSQL Flexible Server, provisioned with Bicep.",
      ],
      decision:
        "One Zod schema validates the contact form on both client and server, so the two can never drift apart.",
      impact: [
        "Live at pranaydasari.in.",
        "Per-submission email delivery status tracked in the database.",
      ],
    },
    quote: "A developer's portfolio is their digital handshake - make it memorable.",
    badge: "Live",
    image: "/images/portfolio-v2.webp",
    links: [
      { label: "V2 (Current)", url: "https://pranaydasari.in/" },
      { label: "V1 (Archive)", url: "https://pradeep-dasari.vercel.app/" },
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Prisma",
      "PostgreSQL",
      "Resend",
      "Azure",
      "Vercel",
    ],
  },
];

export const siteMeta = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  title: `${profile.name} - ${profile.title}`,
  description: profile.summary,
};
