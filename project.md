# Super Dashboard Project

## Overview
This project is a modern, full-featured dashboard application built with Next.js, designed for extensibility, modularity, and scalability. It features a modular dashboard, comprehensive authentication, rich UI components, and a robust backend API structure.

## Key Features
- Modular dashboard with analytics, calendar, documents, menu, overview, tasks, and more
- Marketing pages for about, blog, contact, gallery, portfolio, team, and settings
- Comprehensive authentication system (login, register, password reset, email verification)
- Extensive API endpoints for dashboard, user, organization, menu, and more
- Reusable component library (UI, icons, forms, dialogs, etc.)
- Custom hooks for user, workspace, media queries, and more
- Shared utilities for data management, middleware, and services
- Organized folder structure for easy maintainability and scalability

## Directory Structure (src)
- `ai/` - AI-related utilities and flows
- `app/` - Main application logic, including:
  - `(dashboard)/` - Dashboard features and slices (see details below)
  - `(marketing)/` - Marketing/public-facing pages
  - `api/` - API endpoints
  - `auth/` - Authentication pages and logic
  - Shared layouts, providers, error handling, and CSS
- `components/` - Reusable UI components and icons
- `hooks/` - Custom React hooks
- `lib/` - Library code for API clients, services, middleware, and utilities
- `services/` - Business logic and service functions
- `shared/` - Shared stores, database management, providers, sidebar, status, styles, etc. (see details below)

---

## Detailed Folder Descriptions

### `shared/` Directory
Contains shared resources used across the application:
- `dashboard-store/` - State management and types for dashboard features.
- `database-management/` - Tools and components for managing database entities, constants, hooks, and utilities.
- `dev-tools/` - Developer utilities and components for debugging or enhancing the dev experience.
- `icon-picker/` - Components, hooks, and utilities for selecting and managing icons.
- `providers/` - React context providers (e.g., session, theme, toast notifications).
- `sidebar/` - Sidebar components, hooks, context, and types for navigation.
- `status/` - UI components for status displays (Error, Loading, Skeleton).
- `styles/` - Shared styling utilities, responsive helpers, and style-related hooks.

### `app/(dashboard)/_slices/` Directory
Contains feature modules ("slices") for the dashboard:
- `analytics/` - Analytics charts, headers, overview, table, hooks, and utilities.
- `calendar/` - Calendar feature components and logic.
- `documents/` - Document management: forms, previews, filters, context, and utilities.
- `menu/` - Menu management features.
- `overview/` - Overview widgets, charts, stats, recent activity, and hooks.
- `tasks/` - Task management: forms, lists, context, filters, and utilities.
Each slice typically contains:
  - `components/` - UI for the feature
  - `constants/` - Feature-specific constants
  - `context/` - React context for state management
  - `hooks/` - Custom hooks for feature logic
  - `lib/` - Utilities and helper functions
  - `types/` - TypeScript types and interfaces

---

## Developer Workflow
1. **Clone the repository** and install dependencies:
   ```sh
   git clone <repo-url>
   cd super-dashboard-414
   npm install
   ```
2. **Development server:**
   ```sh
   npm run dev
   ```
   - Visit `http://localhost:3000` to view the app.
3. **Code Structure:**
   - Add new features as slices under `app/(dashboard)/_slices/`
   - Place shared logic or UI in `shared/` or `components/`
   - Use `lib/` for utilities, API clients, and middleware
   - Define new API endpoints in `app/api/`
4. **Testing & Linting:**
   ```sh
   npm run lint
   # (add tests as needed)
   ```
5. **Build & Production:**
   ```sh
   npm run build
   npm start
   ```
6. **Authentication:**
   - Uses NextAuth.js with custom providers and flows (see `app/auth/` and `app/api/auth/`).
7. **Database:**
   - Managed via Prisma ORM (see `lib/prisma.ts`).
8. **Environment Variables:**
   - Configure `.env` for secrets, database URLs, and provider keys.

## Technologies Used
- **Framework:** Next.js
- **UI:** Radix UI, custom components, CSS modules
- **State Management:** React Context, custom hooks, stores
- **API:** RESTful endpoints, middleware, Prisma
- **Auth:** NextAuth.js (with custom providers and flows)
- **Utilities:** date-fns, clsx, autoprefixer, embla-carousel, etc.

## Getting Started
1. Install dependencies:
   ```sh
   npm install
   ```
2. Run the development server:
   ```sh
   npm run dev
   ```
3. Build for production:
   ```sh
   npm run build
   ```
4. Start the production server:
   ```sh
   npm start
   ```

## Notable Packages (from package.json)
- `@radix-ui/*` for accessible UI primitives
- `@hookform/resolvers` for form validation
- `date-fns` for date utilities
- `embla-carousel-react` for carousels
- `prisma` for database ORM
- `next-auth` for authentication

## Project Highlights
- Highly modular and extensible codebase
- Clean separation of concerns between dashboard, marketing, shared code, and APIs
- Ready for enterprise use with advanced authentication, role management, and workspace support
- Designed for rapid feature development and easy onboarding of new developers

## File Structure Reference
See `src/structure.json` for a machine-readable, up-to-date structure of the project files and directories.

---

For more details on any specific part of the project, explore the corresponding folder or ask for a deep dive into any feature or module.
