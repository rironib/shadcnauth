# Project Instructions & Global Constraints

## 1. System Identity & Philosophy

**ShadcnUI Auth** is a premium, high-performance authentication and user management platform. It is a sophisticated foundation for Next.js applications with a Vercel-inspired minimalist aesthetic.

### Core Philosophy

1.  **Minimalism Over Clutter:** Reduce visual noise.
2.  **Performance First:** Leverage Next.js 16 App Router & React 19.
3.  **SEO-Driven:** Every page is optimized with dynamic SEO management.
4.  **Role-Based Access:** Clear separation between users, moderators, and admins.
5.  **Modern UX:** Premium aesthetics using Shadcn UI and Tailwind CSS v4.

---

## 2. Technical Fingerprint & Architecture

- **Framework:** Next.js 16.1.0 (App Router) / React 19
- **Database:** MongoDB (Mongoose 9.0.2)
- **Auth:** NextAuth.js 4.24.13 (Credentials & Social)
- **Styling:** Tailwind CSS v4 (@tailwindcss/postcss)
- **Package Manager:** **Yarn (Strictly enforced)**
- **Aliases:** `@/*` maps to `./*`

### Directory Map

- `app/`: Next.js App Router (pages/layouts/api)
- `components/`: UI and layout components
- `lib/`: Shared utilities and core logic
- `actions/`: Next.js Server Actions (Data mutations)
- `models/`: Mongoose database models
- `config/`: Static configuration and site metadata
- `public/`: Static assets and SEO fallbacks
- `.agent/`: Agent-specific documentation and state

---

## 3. Negative Constraints (Avoid These)

### Package Management

- ❌ **NEVER** use `npm`, `npx`, or `pnpm`.
- ❌ **NEVER** commit `package-lock.json` or `pnpm-lock.yaml`.
- ✅ **ALWAYS** use `yarn`.

### Architecture & Security

- ❌ **NEVER** Use Global State Management Libraries (Redux, Zustand, etc.). Use React Context.
- ❌ **NEVER** Use Inline Styles. Use Tailwind utility classes or `cn()` helper.
- ❌ **NEVER** Bypass Authentication Checks server-side.
- ❌ **NEVER** Use Synchronous Database Queries. Always `async/await`.
- ❌ **NEVER** Use `slug` field in Thread Model (if applicable). Use `_id`.
- ❌ **NEVER** Expose Sensitive Data in API Responses (passwords, tokens).
- ❌ **NEVER** Store Secrets in Code. Use `.env.local`.
- ❌ **NEVER** Use Class Components or `var` keyword.
- ❌ **NEVER** Mutate Props Directly.
- ❌ **NEVER** Implement "Unlike" functionality for Threads or Posts. Engagement is one-way only.

---

## 4. Backend & Systems Development

### Architecture

- **Server Actions:** Most data mutations and fetches should use Server Actions in `actions/`.
- **Consistent Responses:** Return objects: `{ success: boolean, data?: any, error?: string }`.
- **Security Gatekeeper:** Route protection, RBAC, and security headers are centralized in `proxy.js`.
- **Hierarchical Access:** Admin > Moderator > User. Access rules are defined in `DASHBOARD_ACCESS` and `API_ACCESS`.

### Database (Mongoose / MongoDB)

- **Connection:** Use cached connection in `lib/mongodb.js`.
- **Lean Queries:** Use `.lean()` for read-only operations.
- **Model Cache Pattern:** `export default mongoose.models.ModelName || mongoose.model("ModelName", Schema);`

---

## 5. Frontend & UI/UX Standards

### Aesthetic Guidelines

- **Tailwind CSS v4:** Use OKLCH color space (defined in `app/globals.css`).
- **Typography:** Primary font is **Hind Siliguri**. Use `tracking-tight` for headings.
- **Animations:** Use **Framer Motion** for state transitions and **tw-animate-css** for entrance animations.
- **Client Components:** Must have `"use client"` at the top. Use PascalCase for filenames.

### Component standards

- **Conditional Classes:** Always use the `cn()` utility.
- **Shadcn UI:** Do NOT modify `components/ui/` directly. Create wrappers or use `className` props.
- **Public Page Restriction:** Do NOT use Shadcn `Card` components on public-facing pages. Use standard `div` elements with `border`, `rounded-xl`.

---

## 6. SEO & Metadata Management

### Dynamic SEO System

- **Generator:** Use `generateSeoMetadataServer` from `lib/seo.js`.
- **Workflow:** Every page must export a `generateMetadata` function using a unique key defined in `config/routes.js` and synced with MongoDB or `public/seo.json`.
- **Metadata Utility:** Use `constructMetadata` from `@/lib/metadata`.

### Sitemap & Robots

- **Sitemap:** Update `app/sitemap.js` for new routes.
- **Robots:** Manage crawler rules in `app/robots.js`.

---

## 7. Agent Behavioral Guidelines

1.  **Understand Context:** Review conversation history and file structure before changes.
2.  **Plan Before Coding:** Outline changes, identify dependencies, and check side effects.
3.  **Implement Incrementally:** One logical change at a time.
4.  **Follow Existing Patterns:** Match naming conventions and component structures.
5.  **Environment Sync:** If building for production, ensure variables are added to the Vercel Dashboard.
