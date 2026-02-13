# Logic Puzzle Generator

Logic Puzzle Generator is a full‑stack app that currently focuses on generating and solving **Sudoku** puzzles, with a React UI and a Node/Express + SQLite backend. The architecture is ready for additional puzzle types (Nonograms, logic grids, etc.).

---

## Tech Stack

- **Frontend**: React 18, Vite, `styled-components`
- **Backend**: Node.js, Express, SQLite (via `sqlite3`)
- **Testing**: Playwright end‑to‑end tests

---

## Project Structure

- `backend/`
  - `src/puzzle_server.js` – Express API
  - `src/puzzle_db.js` – SQLite DB (`puzzles` table)
  - `src/sudokuGenerator.js` – Sudoku generator (board + solution)
- `frontend/`
  - `src/App.jsx` – app shell and API calls
  - `src/components/SudokuBoard.jsx` – interactive Sudoku grid + validation
  - `src/components/DifficultySelector.jsx` – difficulty selector
  - `tests/app.e2e.spec.mts` – Playwright E2E test

---

## Prerequisites

- Node.js 18+ and npm

---

## Backend – Setup & Run (Node/Express)

```bash
cd backend
npm install
npm run dev   # or: npm start
```

Default API URL: `http://localhost:4000`.  
On first start, `puzzle_db.js` creates `puzzles.db` with a `puzzles` table.

### Key Endpoints

- `POST /api/puzzles/generate`
  - Body: `{ "type": "sudoku", "difficulty": "easy" | "medium" | "hard" }`
  - Returns: `{ id, type, difficulty, puzzle, solution, createdAt }`
- `GET /api/puzzles/:id`
- `GET /api/puzzles`

---

## Frontend – Setup & Run (React/Vite)

```bash
cd frontend
npm install
npm run dev
```

By default Vite serves the app at `http://localhost:5173`.

The frontend expects the backend at `http://localhost:4000`.  
Override via `frontend/.env`:

```bash
VITE_API_URL=http://your-backend-url
```

---

## How It Works (Sudoku)

- **Generate**: Frontend calls `POST /api/puzzles/generate`.
- **Backend**:
  - Builds a full valid Sudoku board.
  - Removes cells based on difficulty.
  - Stores `{ puzzle, solution }` in SQLite and returns puzzle data + id.
- **Frontend**:
  - Shows the puzzle grid; givens are locked, blanks are editable.
  - Validates Sudoku rules (rows, columns, 3×3 boxes) and highlights conflicts.
  - When full, compares against the solution and shows success / error feedback.

---

## End‑to‑End Tests

E2E tests live in `frontend/tests` and are powered by Playwright.

1. Make sure **both servers are running**:

   ```bash
   # terminal 1
   cd backend
   npm run dev

   # terminal 2
   cd frontend
   npm run dev
   ```

2. From `frontend/`, run:

   ```bash
   npm run test:e2e
   ```

This runs a single flow that:

- Opens the app, checks the “No puzzle yet” state.
- Generates a puzzle and types a digit into an editable cell.

---

## Deployment Notes

This app has a **backend** and **frontend**; deploy them separately, then set `VITE_API_URL` on the frontend to the backend’s URL.

### Backend (Heroku / Railway / Render)

From `backend/`:

- `package.json`:
  - `"main": "src/puzzle_server.js"`
  - `"start": "node src/puzzle_server.js"`
- On your platform:
  - Root / working directory: `backend/`
  - Build command: `npm install`
  - Start command: `npm start`
  - Ensure `PORT` env var is provided (server uses `process.env.PORT || 4000`).
  - Ensure `sqlite3` is supported and, if needed, back `puzzles.db` with a persistent volume.

Note the deployed backend URL (for example `https://logic-puzzle-backend.your-host.app`).

### Frontend (Vercel / Netlify)

From `frontend/`:

- Build command: `npm run build`
- Output / publish directory: `dist`
- Environment:
  - `VITE_API_URL = https://logic-puzzle-backend.your-host.app`

After deploy, open the frontend URL and click **Generate Puzzle** to verify it talks to the deployed backend.

---

## Extending the App

- **More puzzle types**: Add new generators (e.g. `nonogramGenerator.js`) and branch in `/api/puzzles/generate`.
- **User accounts / scores**: Extend the `puzzles` table or add new tables; tie puzzle ids to users.
- **Richer solving UI**: Add notes, undo/redo, timers, and keyboard navigation on the Sudoku grid.

