<!-- Copilot instructions for repository-specific guidance -->
# SmartLearn — AI assistant instructions

This project is a Vite + React TypeScript frontend backed by Supabase (database, auth, and Edge Functions). Use these notes to work productively in this repository.

- Project entry: `src/main.tsx` -> `src/App.tsx` controls the simple screen state machine (login, dashboard, students, teachers, classes, timetable).
- Supabase client for the frontend: `src/utils/api.ts` (exports `studentAPI`, `teacherAPI`, `classAPI`, `timetableAPI`, `subjectAPI`, `authAPI`, and `seedData`). Prefer using these helpers rather than calling Supabase directly from components.
- Supabase config: `src/utils/supabase/info.tsx` contains `projectId` and `publicAnonKey`. This file currently contains a project id and anon key — when working locally, update or rotate keys as needed.
- Database schema: `src/database-schema.sql` — the app expects you to run this SQL in Supabase SQL Editor before the UI will operate fully. `App.tsx` prints instructions if the DB is not set up.

- Edge / server functions: `src/supabase/functions/server/index.tsx` (Deno + Hono). These are Supabase Edge Functions that assume env vars `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (service role key required for admin operations like seeding). `kv_store.tsx` provides a simple key-value interface used by some helper flows.

- Dev workflows (how to run):
  - Install: `npm install` (project root).
  - Start dev server: `npm run dev` (Vite — default port 5173).
  - Build: `npm run build`.
  - Supabase setup: open your Supabase project → SQL Editor → run `src/database-schema.sql`.

- Environment notes:
  - `src/utils/supabase/info.tsx` is where the frontend reads `projectId` and `publicAnonKey`.
  - Edge functions read `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from environment (Deno). To test server code locally, set those env vars or use Supabase CLI / Deno with the variables.

- Patterns & conventions found in this repo:
  - API helpers always throw on Supabase `error` (e.g., `throw new Error(error.message)`); callers expect exceptions to bubble up.
  - Many `.tsx` components use Tailwind utility classes; follow the existing styling approach in `src/styles/globals.css` and `tailwind.config.js`.
  - IDs use explicit names from the schema: `student_id`, `teacher_id`, `class_id`, `timetable_id`. Sorting is often by `*_id` as a fallback for created_at.
  - Some UI fields are simplified vs schema (example: `ClassForm` sends `subject` in the payload but `class_subjects` is a bridge table in the schema). When modifying schema-related code, check both `src/utils/api.ts` and relevant forms (e.g., `src/components/ClassForm.tsx`).

- Examples (common tasks):
  - To fetch students in the UI use: `const { students } = await studentAPI.getAll();` (see `src/utils/api.ts`).
  - To sign in: `await authAPI.signIn(email, password)` and `await authAPI.getSession()` to read session.
  - To run server seed endpoint (deployed): POST to `/make-server-e1fc0df5/seed` on the Edge Function; locally use the seed logic in `src/supabase/functions/server/index.tsx` with service role key set.

- Repository-specific gotchas discovered:
  - Client-side `seedData` is skipped by design (`seedData()` returns '{ message: "Seeding skipped" }'). Reliable seeding is performed by the server function (seed endpoint) or by running `database-schema.sql` manually.
  - `src/utils/supabase/info.tsx` currently exposes keys — verify whether you should replace them with environment-based injection. Do not commit new service-role keys.
  - The Edge Functions use Deno imports (Hono) and `createClient` from `@supabase/supabase-js` with a service key; running them requires Deno or the Supabase Functions runtime.

- Files to check first when editing behavior:
  - `src/utils/api.ts` — central API logic and error patterns.
  - `src/utils/supabase/info.tsx` — project id / anon key (frontend).
  - `src/supabase/functions/server/index.tsx` — server routes, seed logic, and admin operations.
  - `src/database-schema.sql` — canonical schema for local setup.
  - `src/App.tsx` — app bootstrapping and demo initialization flow.

If anything here is unclear or you'd like me to expand examples (e.g., how to run the Edge functions locally, or a short checklist for rotating keys), tell me which section to expand.
