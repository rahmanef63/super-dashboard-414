# **App Name**: TaskMaster

## Core Features:

- Task List Display: Display tasks in a clear, sortable, and filterable list, grouped by status (Todo, In Progress, Done).
- Task Creation: Allow users to create new tasks with a title, description, due date, and status within the current dashboard and workspace context.
- Task Editing: Enable users to edit existing tasks to modify their title, description, due date, and status.
- Task Status Update: Allow users to drag and drop tasks between status columns to update their status.
- Smart Due Date Suggestion: AI tool to suggest a fitting due date for a task based on its description and the current workload in the workspace.

## Style Guidelines:

- Primary color: Dark blue (#2c3e50) for a professional and reliable feel.
- Secondary color: Light gray (#ecf0f1) for backgrounds and subtle contrasts.
- Accent: Teal (#3498db) for interactive elements and status indicators.
- Clean and modern typography for readability and a professional look.
- Simple and consistent icons to represent task status and actions.
- Clear and organized layout with well-defined sections for tasks and controls.
- Subtle transitions and animations to provide feedback on user interactions.

## Original User Request:
Saya sedang membangun fitur Task Management untuk Super Dashboard berbasis Next.js (App Router) + Zustand + PostgreSQL.

Struktur proyek saya menggunakan pendekatan modular dengan pembagian:

- `src/components/shared/` → untuk komponen global
- `src/components/slices/tasks/` → untuk fitur Task Management
- `src/app/dashboard/[[...slug]]/page.tsx` → untuk halaman dinamis seperti /dashboard/[dashboard_id]/[workspace_id]/tasks
- `src/data/` → untuk dummy-data (sementara tanpa API)
- `src/utils/localStorageHelper.ts` → menyimpan workspace aktif

Tolong bantu saya:
- Buatkan **struktur folder & file** untuk `slices/tasks/` berdasarkan *Domain-Driven Design (DDD)*:
  - Pisahkan `entities/`, `value-objects/`, `services/`, `repositories/`, `controllers/`
- Gunakan **TypeScript** dan terapkan prinsip **SOLID** dan **DRY**
- Sertakan **contoh unit test dengan pendekatan TDD** menggunakan **Jest**
- Beri contoh implementasi lengkap:
  - `TaskEntity` (di folder `entities/`)
  - `TaskService` (di folder `services/`)
  - `TaskRepository` (di folder `repositories/`, dummy atau in-memory)
  - `TaskController` atau API handler (`tasks.api.ts`)
  - `types.ts` untuk tipe data dan enum status
  - `useTasks.ts` hook untuk akses Zustand store (state management)

Tambahan:
- Setiap task memiliki: id, title, description, status, dueDate, workspaceId, dashboardId
- Status enum: `todo`, `in-progress`, `done`
- Tampilkan contoh route path yang dinamis berdasarkan struktur ini:
  `/dashboard/[dashboard_id]/[workspace_id]/tasks`

---
# Super Dashboard – Task Management (DDD Structure)

## Tech Stack:
- Next.js (App Router)
- Zustand (state management)
- PostgreSQL (future DB, dummy for now)
- TypeScript
- Jest (TDD)

## Feature Path:
src/components/slices/tasks/

## URL Structure:
Dynamic (Based on file structure `src/app/(dashboard)/dashboard/[dashboard]/[...menu_item]/page.tsx`):
  /dashboard/[dashboardId]/[menu_item_path]
  Example: /dashboard/professional/tasks

Static Pages:
  /dashboard/profile
  /dashboard/settings

---

## ✅ Folder Structure (Domain-Driven Design)

src/components/slices/tasks/
│
├── entities/
│   └── TaskEntity.ts
│
├── value-objects/
│   └── TaskStatus.ts
│
├── repositories/
│   └── TaskRepository.ts
│
├── services/
│   └── TaskService.ts
│
├── controllers/
│   └── tasks.api.ts (handler for API routing)
│
├── store/
│   └── useTasks.ts (Zustand store)
│
├── components/
│   ├── TaskList.tsx
│   └── TaskCard.tsx
│
├── types/
│   └── types.ts
│
├── constants/
│   └── taskConstants.ts
│
├── utils/
│   └── taskUtils.ts
│
└── __tests__/
    └── TaskService.test.ts (Jest unit test)

---

## ✅ Data Model

### `Task`
- id: string (uuid)
- title: string
- description: string
- status: "todo" | "in-progress" | "done"
- dueDate: string (ISO format)
- workspaceId: string
- dashboardId: string

---

## ✅ Dummy Path Example

- Dashboard ID: `professional`
- Workspace ID: `team-alpha` (This seems to be managed via context/state, not the URL path segment based on the file structure)
- Slice/Menu Item: `tasks`

Full path based on `src/app/(dashboard)/dashboard/[dashboard]/[...menu_item]/page.tsx`:
  `/dashboard/professional/tasks`
