# Aapryl Clone Tool

Portfolio cloning analysis tool with Flask web interface.

## Quick Start

### 1. Setup Virtual Environment

```bash
python -m venv venv
```

### 2. Install Dependencies

```bash
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

### 3. Run the App

For the legacy Flask UI on port `5050`:

```bash
.\venv\Scripts\python.exe app.py
```

For the Next.js frontend, start the backend on port `3001` instead:

```bash
.\venv\Scripts\python.exe run.py
```

Or explicitly on a custom port (e.g., `3001`):

```bash
.\venv\Scripts\python.exe -c "from app import app; app.run(host='127.0.0.1', port=3001)"
```

### 4. Open in Browser

- Legacy Flask UI: `http://localhost:5050`
- Next.js frontend backend target: `http://localhost:3001`

## Important Note

Do not run:

```bash
python run app.py
```

That tells Python to look for a file literally named `run`, which does not exist.

Use either:

```bash
python app.py
```

or:

```bash
python run.py
```

## Stop the Server

Press `CTRL+C` in the terminal.
