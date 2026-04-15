# 🚀 Campus Pulse

> A beginner-friendly college event and club management app built with Next.js, using browser storage instead of a real backend.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Status](https://img.shields.io/badge/Status-Learning_Project-blue)
![Storage](https://img.shields.io/badge/Data-Browser_Storage-orange)

---

## 📌 Executive Summary

- `Campus Pulse` is a web app for discovering campus events and managing club activity.
- Students can browse clubs, view upcoming and past events, search by keyword, filter by category, and switch between list and calendar views.
- Club admins can log in, create events, update club profiles, manage team members, and track expenses.
- The project exists as a learning-focused full-stack-like prototype without a real backend.
- Real-world use case: a college wanting one place where students can find events and clubs can maintain their own public presence.

---

## 🧠 Learning Note

This project was built with AI assistance while learning development.

- Learning-focused project
- Code is being actively understood and improved
- Not all parts were written manually
- The goal is practical growth, not pretending the project is production-ready

---

## ✨ Features

- Event discovery homepage with search, category filters, date range filters, and list/calendar toggle in `src/app/page.tsx`
- Club directory with search in `src/app/clubs/page.tsx`
- Dynamic club pages with team, resources, and event history in `src/app/[clubSlug]/page.tsx`
- Dynamic event pages with reviews, ratings, and gallery support for past events in `src/app/[clubSlug]/[eventSlug]/page.tsx`
- Club login and registration flow in `src/app/admin/page.tsx` and `src/components/admin/Auth.tsx`
- Admin event CRUD in `src/components/admin/EventTabs.tsx` and `src/components/admin/EventForm.tsx`
- Admin profile, resource links, theme color, and member management in `src/components/admin/ProfileTabs.tsx`
- Expense tracking, monthly budget view, and charting in `src/components/admin/ExpensesTab.tsx`
- Local seed data and browser persistence through `src/lib/events.ts` and `src/hooks/use-data.ts`

---

## 🛠️ Tech Stack

| Category | Tools |
|----------|------|
| Language | TypeScript |
| Framework | Next.js 15 (App Router), React 18 |
| Styling | Tailwind CSS, shadcn/ui, Radix UI |
| Forms & Validation | React Hook Form, Zod |
| Data & State | `localStorage`, `sessionStorage`, custom `useData` hook |
| Date Handling | `date-fns`, `react-day-picker` |
| Charts | Recharts |
| Icons | Lucide React |
| AI Tooling | Genkit + Google AI plugin scaffold in `src/ai/` |
| Hosting-Related Config | Firebase App Hosting config in `apphosting.yaml` |

---

## 📁 Project Structure

```bash
Campus-Pulse/
├── docs/
│   └── blueprint.md
├── src/
│   ├── ai/
│   ├── app/
│   │   ├── admin/
│   │   ├── clubs/
│   │   ├── features/
│   │   └── [clubSlug]/[eventSlug]/
│   ├── components/
│   │   ├── admin/
│   │   └── ui/
│   ├── hooks/
│   └── lib/
├── apphosting.yaml
├── components.json
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

### Folder Guide

- `src/app/` -> Next.js routes and pages
- `src/components/` -> reusable UI and feature components
- `src/components/admin/` -> dashboard forms and management panels
- `src/components/ui/` -> shadcn/ui-style primitive components
- `src/hooks/` -> shared hooks like toast and storage-backed data state
- `src/lib/` -> types, seed data, utilities, and placeholder images
- `src/ai/` -> AI tooling scaffold, currently minimal
- `docs/` -> project blueprint / planning notes

---

## ⚙️ How It Works

1. The app starts from `src/app/layout.tsx`, which sets global layout, theme, header, footer, and toaster.
2. The homepage `src/app/page.tsx` calls `useData()` to load clubs and events.
3. `useData()` in `src/hooks/use-data.ts` checks `localStorage` for saved data.
4. If no saved data exists, it seeds the app using `initialClubs` and `initialEvents` from `src/lib/events.ts`.
5. The homepage filters and sorts event data in memory based on search text, category, and date range.
6. Clicking a club opens a dynamic route like `/{clubSlug}`.
7. Clicking an event opens a dynamic route like `/{clubSlug}/{eventSlug}`.
8. Admins log in through `/admin`, where club credentials are checked against the stored club list.
9. Admin session state is stored in `sessionStorage`, not in a secure backend auth system.
10. Admin actions update the club/event arrays, then write those changes back into `localStorage`.
11. A custom browser event plus the normal `storage` event keep tabs and components roughly synchronized.

---

## 🔑 Key Files You Should Understand

- `src/hooks/use-data.ts` -> central data loading and persistence logic
- `src/lib/events.ts` -> starter data for clubs and events
- `src/lib/types.ts` -> main app data model
- `src/app/page.tsx` -> main student-facing event discovery experience
- `src/app/admin/page.tsx` -> login/registration entry for club admins
- `src/components/admin/EventTabs.tsx` -> event create/edit/delete logic
- `src/components/admin/ProfileTabs.tsx` -> club profile, resource, and team management
- `src/components/admin/ExpensesTab.tsx` -> budgeting and expense analytics
- `src/app/[clubSlug]/[eventSlug]/page.tsx` -> event details, reviews, and gallery logic
- `next.config.ts` -> build and image configuration

---

## 🧩 Important Code Explained

### `useData()` is the real backbone

- This hook acts like a tiny client-side database layer.
- It loads initial data from `localStorage`.
- If nothing exists yet, it seeds the app from hardcoded starter data.
- When clubs or events change, it writes the full updated arrays back to storage.
- It also dispatches a custom `storageChange` event so the UI refreshes after edits.

### Admin authentication is simple, not secure

- Admin login compares club name and password directly from stored club data.
- The logged-in club is saved in `sessionStorage`.
- This is useful for learning UI flow, but it is not real authentication.
- There is no password hashing, backend verification, token system, or role enforcement beyond client-side checks.

### Events are separated by time

- Club pages and the admin dashboard split events into `upcoming` and `past`.
- That logic is done by comparing each event date with `new Date()`.
- Past events unlock extra features like reviews and gallery uploads.

### Profile and finance updates rewrite the club object

- When a club changes description, resources, theme color, members, or expenses, the app creates an updated club object.
- Then it replaces the old club inside the full clubs array.
- That full array is saved back into `localStorage`.

---

## ⚙️ Configuration

| File | Purpose |
|------|---------|
| `next.config.ts` | Allows remote images and ignores TypeScript/ESLint errors during build |
| `tailwind.config.ts` | Tailwind theme, colors, radius, and animation config |
| `components.json` | shadcn/ui configuration and aliases |
| `tsconfig.json` | TypeScript path alias setup with `@/*` |
| `postcss.config.mjs` | Tailwind PostCSS plugin setup |
| `apphosting.yaml` | Minimal Firebase App Hosting config |

### Important honesty note

- `next.config.ts` disables build blocking for TypeScript and ESLint issues.
- That makes iteration easier, but it also means some code problems can slip through builds.

---

## 🔐 Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| None directly referenced in app source | The current app code does not read any environment variables directly | No |
| `GOOGLE_API_KEY` or similar AI credential | Inferred only if Genkit/Google AI tooling in `src/ai/` is actually used later | Inferred / unclear |

---

## 🚀 Installation & Setup

```bash
# install dependencies
npm install

# start development server on port 9002
npm run dev
```

### Helpful scripts

```bash
# production build
npm run build

# start production server
npm run start

# type check
npm run typecheck

# lint
npm run lint

# optional Genkit dev tools
npm run genkit:dev
npm run genkit:watch
```

---

## ▶️ How to Run

1. Install dependencies with `npm install`
2. Start the app with `npm run dev`
3. Open `http://localhost:9002`
4. Browse the public pages as a student
5. Visit `/admin` to test the club admin workflow

### Seed club logins from code

| Club | Password |
|------|----------|
| Tech Club | `tech` |
| Sports Club | `sports` |
| Music Club | `music` |
| Social Club | `social` |
| Academic Club | `academic` |

---

## 🌐 API / Interfaces

- There are no backend API routes in this repository
- There is no database API layer
- The main interfaces are page routes:

| Route | Purpose |
|------|---------|
| `/` | Event discovery homepage |
| `/clubs` | Club directory |
| `/features` | Project overview / showcase page |
| `/admin` | Club login and dashboard |
| `/:clubSlug` | Public club profile |
| `/:clubSlug/:eventSlug` | Public event details |

---

## 💾 Data Handling

- Clubs and events are seeded from `src/lib/events.ts`
- App data is stored in `localStorage`
- Admin login state is stored in `sessionStorage`
- Images uploaded through forms are converted to Base64 data URLs and stored in browser storage
- Reviews, gallery items, resources, members, and expenses all live inside stored JSON objects

### Storage keys used

- `campus-pulse-events`
- `campus-pulse-clubs`
- `campus-pulse-auth-club`

---

## 🔌 External Integrations

- Remote image hosts allowed in `next.config.ts`
  - `picsum.photos`
  - `images.unsplash.com`
  - `placehold.co`
- Firebase App Hosting config exists, but Firebase services are not actually wired into app logic
- Genkit + Google AI setup exists in `src/ai/`, but no actual AI flow is implemented yet

---

## 🧪 Testing

- No automated tests are present in this repository
- No `__tests__` folders, test scripts, or testing libraries were found in source code
- Current validation is mainly form validation with Zod and runtime UI behavior

---

# 🧠 Understanding This Project

## 🎯 What You MUST Understand for Interviews

- How Next.js App Router pages are organized
- How `useData()` simulates a data layer using browser storage
- The difference between `localStorage` and `sessionStorage`
- How forms are validated with React Hook Form + Zod
- How dynamic routes like `[clubSlug]` and `[eventSlug]` work
- Why this project feels full-stack-like even though it is currently frontend-heavy

## 🔄 Core Logic Explained Simply

When a user opens the site, the app loads clubs and events from browser storage. If nothing is stored yet, it loads starter data. Users browse public pages, while club admins log in, edit their club data, and those updates are saved back to the browser.

## ⚠️ Confusing Parts

- `club.id` and `club.slug` are different fields and both matter
- Event category sometimes comes from the club and sometimes from the event object
- Reviews and galleries only appear for past events
- Auth state is client-only, so it looks like login but is not secure authentication
- Uploaded images are stored as Base64 strings, which can grow storage usage quickly

## 🤖 AI-Generated Patterns

- Some generated UI structure is heavier than necessary for a small learning project
- There is duplicated session sync logic across admin-related components
- `next.config.ts` ignores TypeScript and ESLint build errors, which is convenient but risky
- Firebase and Genkit dependencies are present, but most of that stack is not actually used yet
- Many shadcn/ui primitives are included even though only part of them are used

---

## 🎤 How to Explain This Project in Interview

You can describe it as a student event platform prototype where the public side helps students discover campus events and clubs, while the admin side lets clubs manage their events, profile, members, and finances. The important technical point is that it uses browser storage to simulate persistence, so it demonstrates UI architecture and state management more than backend engineering.

### 🗣️ Example Answer

> I built Campus Pulse as a learning-focused Next.js project to centralize campus events and club information. Students can browse events, filter them, explore club pages, and leave reviews for past events. Clubs can log in to manage events, update their profile, maintain team members, and track expenses. Technically, I used React, TypeScript, Tailwind, shadcn/ui, React Hook Form, and Zod. Instead of a real backend, I used localStorage and sessionStorage to simulate persistence, which helped me focus on component structure, state flow, dynamic routes, and admin workflows while learning full-stack concepts gradually.

---

# 💼 For Hiring Managers

## 👨‍💻 Candidate Summary

- Learns by building working products
- Uses AI as a productivity tool, not as a substitute for understanding
- Is clearly exploring practical frontend architecture, form handling, and app state
- Is already thinking about future migration to a real backend

## 🚀 What This Project Shows

- Ability to turn an idea into a usable interface
- Comfort with modern React and Next.js patterns
- Practical form handling and validation
- Willingness to iterate and improve rather than oversell

## ⚡ Key Highlights

- Multi-page Next.js app with dynamic routes
- Clear separation between public and admin experiences
- Custom data hook for shared state and persistence
- Budget tracking and charts, not just static CRUD
- Honest prototype constraints instead of fake production claims

## 🧰 Skills Demonstrated

- React component design
- Next.js App Router
- TypeScript modeling
- Client-side state management
- Form validation with Zod
- UI composition with Tailwind and shadcn/ui
- Route-based architecture
- Basic product thinking

## 📊 Complexity Level

- Beginner to early-Intermediate
- Strong as a learning project
- Not yet production-grade because there is no secure backend, real auth, or database

## ✅ Strengths

- Broad feature coverage for a learning project
- Clear UI separation by user role
- Good use of reusable components
- Typed data models improve readability
- Realistic opportunity to discuss tradeoffs in interviews

## ⚠️ Improvements

- Replace browser storage with a real database
- Add secure authentication
- Add server-side validation and API routes
- Add automated tests
- Tighten TypeScript and ESLint build discipline

## ❓ Interview Questions

- Why did you choose `localStorage` and what are its limits?
- How would you migrate this to Firebase or another backend?
- What is the purpose of `useData()`?
- How do dynamic routes work in this project?
- What would you change first to make this production-ready?
- Why is current admin authentication not secure?

## 🧾 Recruiter TL;DR

Campus Pulse is a practical learning project that demonstrates modern frontend development with Next.js, React, TypeScript, forms, and state handling. It is honest about its limits: no real backend, no secure auth, and no tests yet. That honesty is a strength because the project still shows clear growth, functional problem-solving, and good learning momentum.

---

# 📈 How to Improve This Project

- Move data from `localStorage` to Firestore, Supabase, or PostgreSQL
- Replace session-based club login with real authentication
- Add API routes or server actions for protected writes
- Add role-based access control
- Add tests for `useData`, event creation, and profile updates
- Reduce unused dependencies and remove scaffolding that is not active
- Stop ignoring TypeScript and ESLint build errors
- Add pagination or better scaling if event volume grows
- Add image upload storage instead of Base64 browser storage
- Add student accounts, favorites, reminders, and notifications

---

# 📦 Appendix

## Project Reality Check

- This is a browser-persisted prototype, not a full production SaaS
- Data is tied to the browser unless storage is cleared
- Different users on different devices do not share the same data
- Firebase and Genkit are present mostly as setup/scaffold, not as fully implemented features

## Main Dependencies Seen in Code

| Package Group | Why It Exists |
|--------------|---------------|
| `next`, `react`, `react-dom` | app framework |
| `tailwindcss`, `tailwindcss-animate` | styling |
| `@radix-ui/*`, `class-variance-authority` | UI primitives |
| `react-hook-form`, `zod`, `@hookform/resolvers` | forms and validation |
| `date-fns`, `react-day-picker` | date handling |
| `recharts` | finance chart |
| `lucide-react` | icons |
| `firebase` | currently present but not actively integrated in app logic |
| `genkit`, `@genkit-ai/*` | AI tooling scaffold |

## Honest Summary

If you want a simple sentence: `Campus Pulse is a polished frontend-heavy campus event management prototype that demonstrates good learning progress, but it still needs a real backend and secure authentication to become production-ready.`
