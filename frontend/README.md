# Frontend

This folder contains the Next.js frontend for the Aapryl Clone Tool workspace.

## Architecture Rules

- Business code lives under `src/features/{feature}`.
- Route entry points stay thin and import from the owning feature.
- `src/components/layout` contains shell and layout building blocks only.
- `src/components/ui` is reserved for true shared primitives.
- `src/lib` contains infrastructure only, such as the backend proxy client and shared formatting helpers.

## Start The Frontend

From this folder, run:

```powershell
npm run dev
```

Open:

```text
http://127.0.0.1:3000
```

## Backend Dependency

This frontend expects the Flask backend in `../clone_tool` to already be running.

Default backend url:

```text
http://127.0.0.1:3001
```

If your backend runs somewhere else, copy `.env.example` to `.env.local` and update:

```text
BACKEND_BASE_URL=http://127.0.0.1:3001
NEXT_PUBLIC_BACKEND_BASE_URL=http://127.0.0.1:3001
```

## Quality Checks

```powershell
npm run lint
npm run build
```

## Current Screens

- `/setup`
- `/portfolio`
- `/peer-groups`
- `/manager-detail`
