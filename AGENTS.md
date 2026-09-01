# Repository Guidelines

French B2 immersion learning app: a React 19 + Vite SPA with an AI conversation partner (Claude) and neural text-to-speech pronunciation.

## Project Structure & Module Organization

- `src/App.tsx` wires four routes under a shared `AppShell` layout (React Router v7): flashcards (index), `chat`, `grammar`, `dashboard`. Feature UI lives in `src/components/<feature>/`.
- State is composed from custom hooks in `src/hooks/` (`useChat`, `useVocabulary`, `useProgress`, `useGrammar`, `useTheme`), all persisting through `useLocalStorage` and `src/lib/storage.ts`. There is no backend database.
- `src/lib/` holds logic: `claudeApi.ts` (streams SSE from `/api/chat`), `tts.ts` (`/api/tts`), and `spacedRepetition.ts` (SM-2-style scheduling for flashcards).
- Learning content is static TypeScript in `src/data/` (`vocabulary`, `grammarExercises`, `scenarios`). Shared types live in `src/types/index.ts`.
- **Two backends serve the same `/api` routes and must stay in sync:** `server/index.ts` (Express on port 3001, used in dev via Vite proxy) and `netlify/functions/{chat,tts}.ts` (production). The Claude system prompts, model (`claude-sonnet-4-20250514`), and streaming format are duplicated across both — change both when editing either.

## Build, Test, and Development Commands

- `npm run dev` — Vite dev server; proxies `/api` to `localhost:3001`.
- `npm run server` — the Express API proxy (run alongside `dev`; requires `ANTHROPIC_API_KEY`).
- `npm run build` — type-checks (`tsc -b`) then builds to `dist/`.
- `npm run lint` — ESLint over the repo.
- `npm run preview` — serve the production build.

Copy `.env.example` to `.env` and set `ANTHROPIC_API_KEY`.

## Coding Style & Naming Conventions

TypeScript strict mode is on, including `noUnusedLocals`/`noUnusedParameters` (tsconfig.app.json) — unused code fails the build. Lint with `typescript-eslint` recommended plus `react-hooks` and `react-refresh` rules. Components are PascalCase files (`FlashcardDeck.tsx`); hooks are camelCase `use*`. Styling is Tailwind CSS v4 via `@tailwindcss/vite` (utility classes, no separate config file).

## Commit Guidelines

Commit summaries are short, capitalized, imperative sentences with no prefix or scope (e.g. "Add AI pronunciation using Microsoft Edge neural TTS"). Keep the AI backend changes in `server/` and `netlify/functions/` in the same commit.
