# Migration Plan: Remove Supabase and Integrate Direct PostgreSQL

This plan outlines the steps required to remove the Supabase dependency from the project and directly integrate a PostgreSQL database, leveraging Prisma for database interactions.

## Phase 1: Project Setup and Initial Cleanup (Completed)

**Goal:** Prepare the project for Supabase removal and ensure a stable baseline.

**Tasks:**

1.  **Backup:** Create a full backup of the current project codebase and database. This is crucial for reverting changes if needed.
2.  **Environment Variables:**
    *   Identify all Supabase-related environment variables (e.g., `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
    *   Remove these variables from your `.env` file or equivalent configuration.
    *   Add or update environment variables for your direct PostgreSQL connection, such as `DATABASE_URL` (which Prisma already uses). Ensure these variables are correctly loaded in your Next.js application.
3.  **Supabase Provider Removal:**
    *   Remove the Supabase provider component from `src/app/layout.tsx`.  (This was already done in a previous step, but listing for completeness).
    *   Delete the provider file itself (was likely located at  `src/components/providers/supabase-provider.tsx` or a similar path).
4.  **Dependency Management:**
    *   Remove the `@supabase/` packages from your project's dependencies in `package.json`.
    *   Run `npm uninstall @supabase/<relevant packages>` or the equivalent command for your package manager.
    *   Install any necessary PostgreSQL client libraries if they are not already present (Prisma handles most direct database interaction).

## Phase 2: Authentication and Session Management

**Goal:** Replace Supabase authentication with a direct authentication mechanism.  This is a complex phase and might require significant code changes.

**Tasks:**

1.  **Authentication Strategy:** Determine the authentication method you'll use. Common options include:
    *   **Roll your own:** Implement user registration, login, password management, etc., from scratch.  This gives you the most control but is also the most work.
    *   **NextAuth.js (or similar):** Integrate a library like NextAuth.js, which provides authentication flows and can be configured to use your PostgreSQL database for user storage. This is a popular choice for Next.js applications.  *(Recommended)*
    *   **Other Libraries:** Explore other authentication libraries that integrate with PostgreSQL.
    *   **Chosen Strategy: NextAuth.js** - NextAuth.js was selected and implemented for authentication.
2.  **Database Schema (Completed):**
    *   If you don't already have one, create a `users` table (or similar) in your PostgreSQL database to store user credentials (email/username, password hash, etc.).  You may already have a `profiles` table, consider how the authentication data will relate to profile data.
    *   Update your Prisma schema (`prisma/schema.prisma`) to reflect this new table structure.
    *   Run Prisma migrations to apply the schema changes to your database.
3.  **API Routes:**
    *   Modify or create new API routes to handle user registration, login, logout, password reset, etc. These routes will interact with your PostgreSQL database (via Prisma) to authenticate users and manage sessions.  Refer to the existing Supabase API routes (e.g., in `src/app/api/auth/`) as a starting point, but adapt them to your new authentication logic.
4.  **Session Management:**
    *   Implement session management, likely using cookies or JWTs (JSON Web Tokens).  If using NextAuth.js, it will handle much of this for you.
    *   Update the `SessionProvider` (in `src/components/session-provider.tsx` or a similar location) to reflect your new authentication system and session structure. The session provider now fetches user data from the NextAuth.js session.
5.  **Frontend Updates (Completed):** Frontend components (e.g., login/registration forms, user profile, navigation) have been adjusted to use the NextAuth.js authentication system and session data.

## Phase 3: Data Access and Functionality (Completed with Notes)

**Goal:** Ensure all data access and other functionalities now use the direct PostgreSQL connection.

**Tasks:**

1.  **Client Updates (Completed):** Supabase client initialization has been removed from all relevant files.
    *   Instantiate a Prisma client where needed to interact with the database.  Consider creating a utility function or class to manage the Prisma client instance.
2.  **Data Queries (Completed):** All data queries now use Prisma for database interactions.
    *   Update all components, API routes, and other parts of your application that were previously using the Supabase client to now use Prisma for database queries and mutations.
    *   This involves replacing calls like `supabase.from('table').select('*')` with Prisma queries like `prisma.table.findMany()`.
3.  **Functionality Testing (Partially Completed):** Basic functionality testing has been performed to ensure the application functions with the new database connection and authentication system. **Note:** More thorough and comprehensive testing is recommended.

## Phase 4: Testing and Deployment

**Goal:**  Final testing and deployment of the Supabase-free application.

**Tasks:**
1.  **Thorough Testing:** Perform comprehensive testing of all application features, including authentication, data access, and user interactions.
2.  **Deployment:** Deploy the updated application to your chosen hosting platform, ensuring all environment variables are correctly configured.

**Note:** This is a high-level plan.  Each phase will likely involve more detailed sub-tasks as you implement the changes.  Be prepared to adjust the plan as needed based on the specifics of your application and chosen authentication strategy.

## Core Features

This section lists the core features of the application and their current status after the migration.

1.  **User Authentication:** Allows users to register, log in, and log out of the application.  Currently implemented using NextAuth.js.
2.  **Data Display:** Displays relevant information to the user, likely fetched from the database.  Functionality related to data display should be present but may require further testing.
3.  **User Profile Management:** Enables users to view and potentially edit their profile information. Basic profile viewing is implemented, but profile editing was removed during the migration and would need to be re-implemented.
4.  **(Add any other key functions specific to your application here)**  For example, if your application manages tasks, a core feature would be "Task Management," allowing users to create, view, update, and delete tasks.  List all such features.

**Note:** It's crucial to verify that all core features are fully functional after the migration.  While basic testing has been performed, comprehensive testing of all features is recommended before deploying the updated application.
