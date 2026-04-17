# CHANGELOG

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-04-18

### Added

- **Inquiry Management Module**: Renamed the legacy "Contact" system to a fully featured "Inquiry" module.
- **Inquiry Archiving**: Implemented a streamlined "New -> Read -> Archived" lifecycle for user messages.
- **Admin UI Overhaul**: Upgraded management interfaces to fully utilize `shadcn/ui` standards, replacing heavy Modals and Dropdowns with elegant Side Sheets and pure Grid layouts.
- **React 19 Compatibility**: Fixed Hook execution loops and purity issues across components (`InquiriesClient`, `sidebar.jsx`).

### Changed

- **SEO Management**: Refactored the SEO admin interface to use standard controlled components instead of standard `react-hook-form` dependencies for a lighter client profile.
- Escaped JSX entities correctly in empty-state descriptions.

## [1.0.0] - 2026-02-15

### Initial Release

- **Premium Authentication Suite**: Full registration, login, and password management with NextAuth.js.
- **Social Auth**: Native support for Google and Facebook login.
- **Role-Based Access Control**: Hierarchical system for Admin, Moderator, and User roles.
- **Administrator Dashboard**: Comprehensive management of users, pages, SEO, and system settings.
- **Moderator Dashboard**: Real-time system oversight and permanent moderation audit trails.
- **User Dashboard**: Highly interactive profile management and account settings.
- **Advanced Architecture**:
  - Built with **Next.js 16** (App Router) and **React 19**.
  - Styled with **Tailwind CSS v4** and **Shadcn UI**.
  - Database integration via **Mongoose** and **MongoDB**.
  - **Server Actions** used throughout for robust, secure data mutations.
  - **Dynamic SEO Engine** with custom meta tags management.
  - **Modern UI** features including dark mode, glassmorphism, and framer-motion animations.
- **Production Ready**: Optimized with Google Tag Manager, Sitemap/Robots generation, and resilient environment variable handling.
