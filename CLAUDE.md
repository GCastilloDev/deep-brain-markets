# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This repository contains the design file (`deepbrain.pen`) and the web project (`web/`) for Deep Brain Markets — a service website covering legal, accounting, imports, and ecommerce advisory.

## Web Project (`web/`)

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · next-intl · Supabase · Resend · Vercel

### SEO & Accessibility Rules (non-negotiable)
- Use semantic HTML: `<header>`, `<main>`, `<footer>`, `<nav>`, `<article>`, `<section>`, `<aside>`
- Every page must have a unique `<title>` and `<meta name="description">` via Next.js `generateMetadata`
- Images must always have descriptive `alt` attributes
- Headings must follow hierarchy: one `<h1>` per page, then `<h2>`, `<h3>`...
- Links must have descriptive text — never "click here"
- Use Next.js `<Link>` for internal navigation and `<Image>` for all images
- Structured data (JSON-LD) on every page

### Responsive Rules (non-negotiable)
- Mobile-first: design from 375px up
- Never use fixed pixel widths that break on small screens
- All interactive elements must be tappable (min 44×44px touch target)

### i18n
- All routes live under `app/[lang]/` (`es` default, `en` for international)
- All user-facing strings go in `messages/es.json` and `messages/en.json` — never hardcode text
- Geo-detection via `x-vercel-ip-country` header in middleware redirects root `/` to the correct locale

### Security Rules (non-negotiable)
- All API routes must validate and sanitize input before processing — never trust user data
- Environment variables for all secrets (`SUPABASE_URL`, `RESEND_API_KEY`, etc.) — never hardcode credentials
- HTTP security headers on every response: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`
- Rate limiting on all API routes (contact form, comments) to prevent abuse
- Admin panel (`/admin`) must be protected — never publicly accessible without authentication
- Supabase Row Level Security (RLS) enabled on all tables
- Sanitize all user-generated content before rendering to prevent XSS
- Form submissions must include CSRF protection
- Never expose stack traces or internal errors to the client

### Blog
- Posts are MDX files in `content/blog/es/` and `content/blog/en/`
- Post pages use ISR (revalidate on comment approval)
- Comments stored in Supabase, moderated via `/admin` panel

## Working with Design Files

- **Read/edit `.pen` files exclusively via the `pencil` MCP tools** — never use `Read`, `Grep`, or text editors on them, as their contents are encrypted.
- Key tools: `get_editor_state`, `batch_get`, `batch_design`, `get_screenshot`, `snapshot_layout`.

## Design Constraints

- **cornerRadius**: always `8` for buttons, badges, and chips. Never use `9999` (pill/oval shape).
- **Mobile versions**: every design must have a mobile version at 375px width, created alongside the desktop version.

### Code Style
- All comments must be in Spanish
- Never leave uncommented code — every function, component, and non-obvious block must have a Spanish comment explaining what it does

## Git Workflow

- Only `deepbrain.pen` and `CLAUDE.md` are tracked at root. The `ui/` folder and `.DS_Store` are gitignored.
- Do not add co-author lines to commit messages.
- Remote: `https://github.com/GCastilloDev/deep-brain-markets.git`
- Commits must follow Conventional Commits standard and be written in Spanish:
  - `feat: agregar header responsive`
  - `fix: corregir validación del formulario de contacto`
  - `chore: actualizar dependencias`
  - `refactor: extraer componente de navegación`
  - `style: ajustar espaciado del footer`
  - `docs: actualizar CLAUDE.md con reglas de seguridad`
