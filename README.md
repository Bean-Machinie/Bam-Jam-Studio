# Bam-Jam-Studio

Minimal Vite + React + TypeScript app that connects to Supabase for auth and a todos table.

## Setup

```bash
npm install
npm run dev
```

Other commands:

```bash
npm run build
npm run preview
```

## Environment variables

Copy the example file and fill in values from your Supabase project:

```bash
cp .env.example .env
```

Required variables (Vite only exposes variables prefixed with `VITE_`):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Supabase SQL setup

Run the SQL in `supabase/sql/001_create_todos.sql` inside the Supabase SQL editor:

1. Open your Supabase project.
2. Go to SQL editor.
3. Paste the SQL file contents and run.

## Routes

- `/` Home (auth status + links)
- `/connect` Connection check (env presence + light request)
- `/login` Sign in / Sign up
- `/app` Protected todos CRUD app