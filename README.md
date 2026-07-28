# Pradeep Dasari — Portfolio

A production-ready personal portfolio built with Next.js (App Router), TypeScript, and Tailwind CSS. The contact form is backed by a real API route, PostgreSQL (via Prisma), and Resend for email delivery, with Application Insights wired in for monitoring. Deployment target is Azure App Service.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack) + TypeScript
- **Styling:** Tailwind CSS v4, `next-themes` for light/dark mode
- **Motion/UI:** `framer-motion`, `lucide-react`
- **Forms:** `react-hook-form` + `zod`
- **Database:** PostgreSQL via Prisma 7 (driver adapter: `@prisma/adapter-pg`)
- **Email:** Resend + React Email
- **Monitoring:** Azure Application Insights (`applicationinsights` Node SDK, via `instrumentation.ts`)
- **Tests:** Vitest + React Testing Library
- **Deployment:** Azure App Service (Linux/Node) + Azure Database for PostgreSQL Flexible Server, provisioned via Bicep

## Getting started

### 1. Install dependencies

```bash
npm install
```

`postinstall` runs `prisma generate` automatically.

### 2. Environment variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `RESEND_API_KEY` | Resend API key for sending contact-form notification emails |
| `CONTACT_FROM_EMAIL` | Verified "from" address in Resend |
| `CONTACT_TO_EMAIL` | Inbox that receives contact form submissions |
| `NEXT_PUBLIC_RESUME_URL` | Link opened by the "Resume" button in the hero section |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, used for metadata/sitemap/OG image generation |
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | Azure Application Insights connection string (leave blank to disable monitoring locally) |

### 3. Local database

Two options:

**Docker (recommended if you have it installed):**

```bash
docker compose up -d
npx prisma migrate deploy
```

**No Docker — use Prisma's built-in local dev database:**

```bash
npx prisma dev -d
npx prisma dev ls   # copy the "TCP" connection string (NOT the prisma+postgres:// one) into DATABASE_URL
npx prisma db push
```

> Important: the app connects via `@prisma/adapter-pg` (a plain `pg` driver), which needs a **standard `postgres://` connection string** — use the `TCP` URL printed by `prisma dev ls`, not the `prisma+postgres://...api_key=...` proxy URL (that one is only understood by Prisma's own query engine, and silently fails/disconnects when handed to `pg`). This tripped up local verification during development until traced down — see `git log` / the `lib/db.ts` comment if this resurfaces.
>
> Also on this machine, `npx prisma migrate dev` (which needs a shadow database) was unreliable against Prisma's embedded dev-Postgres — `prisma db push` was used instead to verify the schema end-to-end, and the versioned migration in `prisma/migrations/` was authored via `prisma migrate diff`. Against a real Postgres (Docker, or Azure Flexible Server), `prisma migrate dev` / `prisma migrate deploy` should work normally.

### 4. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Start the production server (binds to `$PORT`, defaults to 8080) |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript + jsx-a11y) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest |
| `npm run format` / `format:check` | Prettier (with Tailwind class sorting) |

## Content

All site copy — profile, tech stack, experience, and projects — lives in [`lib/content.ts`](lib/content.ts) as typed data. Add a new project or job by adding an object to the relevant array; no component changes needed.

## Architecture notes

- **Contact flow** (`app/api/contact/route.ts`): validates input with `zod`, checks a hidden honeypot field, rate-limits by IP using a Postgres query (3 submissions per 10 minutes — no Redis needed), persists the submission, then sends a notification email via Resend. Failures are tracked to Application Insights and surfaced to the user with an honest error message (the submission is still saved even if the email fails).
- **Health check** (`app/api/health/route.ts`): a `SELECT 1` DB ping, used by App Service's health-check probe.
- **Theming**: `next-themes` persists the user's preference in `localStorage` and respects `prefers-color-scheme` by default.
- **Motion**: shared `framer-motion` variants in `lib/motion.ts`; a global `prefers-reduced-motion` media query in `app/globals.css` disables animation for users who request it.

## Deploying to Azure

Infrastructure is defined in [`infra/main.bicep`](infra/main.bicep): a Linux App Service Plan + Web App (Node 20), Azure Database for PostgreSQL Flexible Server, and Application Insights + Log Analytics.

1. **Provision infrastructure** (adjust `infra/main.parameters.json` first — set a real `dbAdminPassword`):

   ```bash
   az group create -n portfolio-rg -l eastus
   az deployment group create \
     -g portfolio-rg \
     -f infra/main.bicep \
     -p infra/main.parameters.json
   ```

2. **Fill in real secrets** on the Web App (the Bicep template deploys placeholder values):

   ```bash
   az webapp config appsettings set -g portfolio-rg -n <webAppName> --settings \
     DATABASE_URL="postgresql://<admin>:<password>@<postgresServerFqdn>/portfolio?sslmode=require" \
     RESEND_API_KEY="..." \
     CONTACT_FROM_EMAIL="..." \
     CONTACT_TO_EMAIL="..." \
     NEXT_PUBLIC_RESUME_URL="..."
   ```

   (Wiring these through Key Vault references instead of plain app settings is a good follow-up hardening step — intentionally left out of this first pass.)

3. **Set up GitHub Actions secrets** for [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):
   - `AZURE_WEBAPP_PUBLISH_PROFILE` — download from the Web App's "Get publish profile" in the Azure Portal
   - `DATABASE_URL` — same connection string as above, used to run `prisma migrate deploy` before each deploy

4. Push to `main` — CI runs lint/typecheck/test/build, then the deploy workflow applies pending migrations and deploys to App Service.

### Explicitly out of scope for this pass

No authentication, no Blob Storage, no Container Apps (App Service was chosen instead), no Redis (Postgres-backed rate limiting instead), no CMS/admin panel, no Key Vault wiring, and no Sentry (Application Insights only — worth comparing later if you want deeper frontend error tracking).
