# Aapryl Clone Tool Workspace

This workspace now has two app layers:

- `clone_tool/` - Python Flask backend for cloning, risk, exposures, and portfolio analytics
- `frontend/` - Next.js frontend that proxies requests to the Flask backend

## Ports

- Backend: `http://127.0.0.1:3001`
- Frontend: `http://127.0.0.1:3000`

The frontend expects the Flask backend to be running first.

## Start The Backend

Open a terminal in `clone_tool/` and run:

```powershell
python run.py
```

If you are using the local virtual environment directly:

```powershell
.\venv\Scripts\python.exe run.py
```

When the backend is healthy, the browser app should respond at:

```text
http://127.0.0.1:3001
```

## Start The Frontend

Open a second terminal in `frontend/` and run:

```powershell
npm run dev
```

Then open:

```text
http://127.0.0.1:3000
```

## Environment Variables

The frontend proxies API calls through `src/app/api/backend/[...path]/route.ts`.

If your Flask backend is not running on port `3001`, create `frontend/.env.local` from `frontend/.env.example` and update the values:

```text
BACKEND_BASE_URL=http://127.0.0.1:3001
NEXT_PUBLIC_BACKEND_BASE_URL=http://127.0.0.1:3001
```

## First-Run Notes

- If `node` or `npm` are not recognized after installing Node, close the terminal and open a new one so PATH refreshes.
- The frontend uses a feature-first structure under `frontend/src/features/`.
- The Flask backend remains the source of truth for portfolio, peer-group, and manager-detail data.

## Useful Commands

Backend:

```powershell
python run.py
```

Frontend:

```powershell
npm run dev
npm run lint
npm run build
```