# 🚀 ShadcnUI Auth - Premium Next.js Authentication Starter Kit

ShadcnUI Auth is a high-performance, ready-to-use authentication starter kit built with Next.js 16, Shadcn UI, and MongoDB. It provides a sophisticated foundation for developers who want to skip the repetitive setup of auth and focus on building their unique features.

---

## Table of Contents

- [🛠 Tech Stack](#-tech-stack)
- [✨ Features & Functionality](#-features--functionality)
  - [🔐 Authentication Suite](#-authentication-suite)
  - [👤 User Dashboard](#-user-dashboard)
  - [🛡 Control Panels](#-control-panels)
- [🏗 Project Structure](#-project-structure)
- [🚦 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [🎯 Purpose](#-purpose)

---

## 🛠 Tech Stack

The application is built on a modern tech stack prioritized for security, speed, and developer experience:

- **Core Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Credentials and Social Providers)
- **State & Forms**: React Hook Form, Zod
- **Monitoring**: Google Tag Manager integration
- **Messaging**: [Resend](https://resend.com/) for transactional emails
- **Icons**: [Lucide React](https://lucide.dev/)

---

## ✨ Features & Functionality

### 🔐 Authentication Suite

- **Full Auth Flow**: Secure Registration, Login, Forget Password, and Reset Password functionality.
- **Social Auth**: Support for Google and Facebook OAuth out of the box.
- **Middleware Protection**: Centralized route protection and RBAC (Role-Based Access Control) via `proxy.js`.
- **Security Headers**: Automatic injection of security best practices (XSS, Clickjacking, MIME sniffing protection).

### 👤 User Dashboard

- **Profile Management**: View and update personal information, bio, and social links.
- **Account Settings**: Password change and account deletion features.
- **Metrics**: Real-time stats on user activity and account status.

### 🛡 Control Panels

- **Administrator Dashboard**:
  - **User Management**: Search, view, and manage roles for all registered members.
  - **SEO Management**: Global control of meta titles, descriptions, and keywords.
  - **Page Engine**: Create and manage custom static pages (About, Contact, etc.).
  - **Analytics**: VisualTelemetry of registrations and system stats.
- **Moderator Dashboard**:
  - **System Oversight**: Real-time stats on pending reports and system activity.
  - **Moderation Logs**: Permanent audit trails of all administrative actions.

---

## 🏗 Project Structure

- `proxy.js`: Security gatekeeper and route protection.
- `actions/`: Centralized Server Actions for auth, admin, and user operations.
- `app/`: Next.js App Router (Pages, layouts, and API endpoints).
- `components/`: Modular building blocks (Shadcn UI primitives + custom features).
- `models/`: Mongoose schemas for Users, Pages, Contacts, and SEO.
- `lib/`: Shared utilities (MongoDB connector, SEO helpers, Mailer, etc.).
- `config/`: Global site configuration, navigation, and route definitions.

---

## 🚦 Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB instance (local or Atlas)
- Resend API Key for emails

### Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd shadcnauth
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file and add the following:

   ```env
   DB_URI=your_mongodb_uri
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   RESEND_API_KEY=your_resend_key
   EMAIL_FROM=ShadcnUI Auth <no-reply@shadcnauth.com>

   # Optional Social Auth
   GOOGLE_CLIENT_ID=your_google_id
   GOOGLE_CLIENT_SECRET=your_google_secret
   ```

4. Run the development server:
   ```bash
   yarn dev
   ```

---

## 🎯 Purpose

ShadcnUI Auth aims to redefine the "Starter Kit" experience by providing more than just a login page. It's a **fully-fledged system** with a minimalist, premium aesthetic and enterprise-grade architecture. It handles the "boring" parts of web development so you can start building your actual product immediately.
