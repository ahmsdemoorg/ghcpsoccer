# SoccerApp

## Business overview
SoccerApp is a lightweight demo application for managing soccer teams, players, matches, and statistics. Typical business goals:
- Track teams, rosters, and player stats.
- Schedule and record match results.
- Provide a simple API and UI for coaches and analysts to view and update data.
- Demonstrate common full-stack patterns for onboarding new developers.

## Technical architecture (high level)
- Front-end: single-page app (likely React/Vue/Angular) served as static assets.
- Back-end API: RESTful service exposing CRUD endpoints for teams, players, matches, and stats.
- Persistence: relational or document store (SQLite/Postgres/Mongo/Cosmos DB). Local dev can use an embedded DB or in-memory storage.
- Optional: authentication layer (JWT), background jobs for stat aggregation, and tests (unit/integration/e2e).

Note: The repository may contain one or more of:
- package.json (Node.js front-end or back-end)
- .NET solution / .csproj files (C# API)
- requirements.txt / Pipfile (Python)
- Dockerfile or docker-compose.yml

## How to quickly determine the stack
1. Open the repository root and look for:
   - package.json → Node.js (frontend/backend)
   - server/ or api/ with .csproj or *.sln → .NET
   - requirements.txt or app.py → Python
   - docker-compose.yml or Dockerfile → containerized services
2. Inspect package.json scripts or .csproj targets to see start/test commands.

## Prerequisites
- Git
- One of: Node.js (LTS), .NET SDK (6/7+), or Python 3.8+ — install depending on detected stack
- Docker (optional, for containerized runs)
- A code editor (VS Code recommended)

## Local setup (generic)
1. Clone the repo:
   - git clone <repo-url>
   - cd <your-directory>/SoccerApp
2. Identify the stack (see previous section).

Node.js app example:
- Install deps: npm ci (or npm install)
- Environment: create a `.env` with required variables (API_PORT=3000, DATABASE_URL=..., JWT_SECRET=...)
- Run: npm start or npm run dev
- Build: npm run build

.NET app example:
- Restore: dotnet restore
- Run: dotnet run --project ./src/YourApiProject
- Tests: dotnet test

Python example:
- Create venv: python -m venv .venv && .\.venv\Scripts\activate (Windows) or source .venv/bin/activate (macOS/Linux)
- Install: pip install -r requirements.txt
- Run: python app.py or flask run

Docker example:
- docker-compose up --build

## Typical endpoints and quick manual tests
Assuming REST API, common endpoints:
- GET /api/teams — list teams
- POST /api/teams — create team
- GET /api/teams/{id}/players — list players for team
- POST /api/matches — create match result
- GET /api/stats/players/{id} — player stats

Use curl or HTTP client:
- curl http://localhost:3000/api/teams
- curl -X POST -H "Content-Type: application/json" -d '{"name":"My Team"}' http://localhost:3000/api/teams

If there is a front-end:
- Open http://localhost:3000 (or port from scripts) in a browser.

## Testing guidance
- Unit tests: run npm test, dotnet test, or pytest depending on stack.
- Integration tests: start the API and run tests that exercise endpoints (use test DB or in-memory stores).
- E2E tests: look for cypress/ or tests/e2e; start front-end and back-end and run npx cypress open or equivalent.
- Linting and formatting: run eslint/flake8/dotnet-format as configured.

If tests require a DB:
- Use an in-memory DB or a local dev DB (SQLite or Dockerized Postgres/Mongo).
- Seed test data if scripts are provided (look for scripts/seed or db/seed).

## Debugging and troubleshooting
- Check logs printed to console for stack traces and port information.
- Verify environment variables: missing DB connection or secrets are common issues.
- If port conflicts occur, change API_PORT in .env or in launch config.
- For unexpected 429 or DB throttling (cloud DBs), inspect request patterns and SDK diagnostics.

## Contributing / developer workflow
- Create a branch: git checkout -b feat/your-feature
- Run linters and tests locally before PR
- Keep changes small and document API contract changes
- Update README with any new environment variables or commands

## Next steps for you (practical checklist)
1. Inspect repository root for package.json, .csproj, or requirements.txt to identify stack.
2. Run the relevant "install" and "start" commands shown above.
3. Hit the most basic endpoint (GET /api/teams) and open the UI if present.
4. Run the test suite and fix any local issues (missing env, DB, ports).
5. Add or update documentation here if you create new env variables or commands.

## Example .env (adjust to your stack)
# API
API_PORT=3000
DATABASE_URL=sqlite://./data/dev.db
JWT_SECRET=change-me-for-dev

## Where to look next in the codebase
- src/ or server/ — backend implementation
- client/ or web/ — frontend
- tests/ or __tests__/ — unit and integration tests
- scripts/ or db/ — seed and migration scripts

If you want, I can:
- Detect the stack by inspecting the repository files and provide exact commands.
- Create a sample .env.example and a short run script.

## Running the frontend (step‑by‑step)

This frontend is a **plain JavaScript application** with no build step or npm dependencies required.

1. Locate the frontend folder
   - Look for: frontend/, client/, web/, or public/ containing HTML files.
   - Example: d:\ghcpsession\Intro\Demos\SoccerApp\frontend\

2. Serve the static files
   - Option 1 — Use VS Code Live Server extension:
     - Install "Live Server" extension in VS Code
     - Right-click on index.html and select "Open with Live Server"
     - Browser opens automatically at http://127.0.0.1:5500 (or similar)
   
   - Option 2 — Use Python built-in server:
     - cd frontend
     - python -m http.server 8000
     - Open http://localhost:8000 in your browser
   
   - Option 3 — Use Node.js http-server (if Node is installed):
     - npx http-server frontend -p 8000
     - Open http://localhost:8000 in your browser
   
   - Option 4 — Open directly in browser:
     - Double-click index.html (limited — CORS may block API calls)

3. Configure API endpoint (if needed)
   - Check for a config.js or inline `const API_URL = '...'` in the JavaScript files.
   - Update the API base URL to match your backend (e.g., http://localhost:3000).

4. Test the app
   - Open the served URL in your browser.
   - Interact with the UI to verify it connects to the backend API.
   - Check browser DevTools console for errors or network issues.

Troubleshooting quick tips
- CORS errors: Ensure your backend API allows requests from the frontend origin (check Access-Control-Allow-Origin headers).
- 404 on API calls: Verify the API_URL in the frontend code matches your running backend.
- No changes visible: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R) to clear browser cache.

Minimal example (commands)
- cd d:\ghcpsession\Intro\Demos\SoccerApp\frontend
- python -m http.server 8000
- open http://localhost:8000