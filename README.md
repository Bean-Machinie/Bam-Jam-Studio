# Bam-Jam-Studio

Minimal Vite + React + TypeScript app with Supabase email/password auth.

## Install

```bash
npm install
```

## Run

```bash
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