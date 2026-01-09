# SmartLearn

SmartLearn is a comprehensive school management system built with React, TypeScript, Tailwind CSS, and Supabase.

## Prerequisites

-   **Node.js**: v16 or higher
-   **npm**: v7 or higher
-   **Supabase Account**: For the database

## Setup Instructions

### 1. Install Dependencies

Open a terminal in the project root and run:

```bash
npm install
```

### 2. Configure Supabase

1.  Create a new project in your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Go to the **SQL Editor** in Supabase.
3.  Copy the contents of `src/database-schema.sql` and run it to create the necessary tables and policies.
4.  Copy your Project URL and Anon Key from **Project Settings > API**.
5.  Open `src/utils/supabase/info.ts` and update the constants:

```typescript
export const projectId = "your-project-url";
export const publicAnonKey = "your-anon-key";
```

### 3. Run the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the URL shown in your terminal) to view the app.

### 4. Build for Production

To build the application for deployment:

```bash
npm run build
```

## Features

-   **Admin Dashboard**: Overview of system stats.
-   **Student & Teacher Management**: CRUD operations for school records.
-   **Class Management**: Organize classes and subjects.
-   **Timetable**: Schedule management with visual grid.
-   **Settings**: Dark/Light mode, profile management.

## Tech Stack

-   **Frontend**: React, Vite, TypeScript
-   **Styling**: Tailwind CSS
-   **Backend**: Supabase (Database, Auth, Edge Functions)