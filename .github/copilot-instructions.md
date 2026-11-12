# Repository instructions

## Build, test, and lint

Run commands from the indicated directory. CI uses Python 3.12 and Node 22; the backend requires Python 3.11+. OCR needs Tesseract with `deu`, `eng`, and `osd` language data. Linux Tauri checks also need GTK/WebKit system libraries; see `.github/workflows/ci.yml`.

Backend setup and checks, from `backend/` (POSIX; Windows venv executables are under `.venv\Scripts\`):

```bash
python -m venv .venv
.venv/bin/pip install -e ".[dev]"
.venv/bin/ruff check .
.venv/bin/ruff format --check .
.venv/bin/python -m pytest -q
# One test:
.venv/bin/python -m pytest -q tests/test_services.py::test_defaults_seeded_once
# Recognition gold set:
.venv/bin/python scripts/goldset.py
```

CI installs pinned backend dependencies with `pip install --only-binary=:all: -r requirements.txt`.

Frontend setup and checks, from `frontend/`:

```bash
npm ci
npm run typecheck
npm test
npm run build
# One test file:
node --experimental-strip-types --test tests/format.test.ts
# One named test:
node --experimental-strip-types --test --test-name-pattern="timestamps" tests/format.test.ts
```

`npm run build` runs TypeScript checking and Vite, producing `frontend/dist`. Frontend tests use Node's built-in test runner, not Playwright.

Rust check, from `src-tauri/`: `cargo check --locked`. On a fresh checkout, CI first creates `backend/dist/syd-backend/` (with a `.keep` file) and `frontend/dist/` as placeholder resource directories.

For the complete Windows installer, run `./scripts/build-windows.ps1` in PowerShell from the repository root. It builds the frontend, fetches Tesseract, freezes the Python sidecar with PyInstaller, smoke-tests its handshake/shutdown, then builds the Tauri NSIS installer.

## Architecture and local development

This is a German-language, local-first Windows document archive, not a hosted web application. Document recognition and storage must stay local. Optional Ollama enrichment accepts only local URLs; update checks are opt-in calls to public GitHub releases.

Tauri starts the Python sidecar with a random `SYD_TOKEN` and waits for stdout `SYD_READY {"port": ...}`. It opens the React UI at `http://127.0.0.1:<port>/#token=...`; FastAPI serves both `/api/` and the built frontend. Rust owns tray, autostart, single-instance behavior, notifications, and sidecar shutdown. The webview does not use Tauri IPC privileges.

To run without Tauri, build the frontend, then run `.venv/bin/python -m syd.main` from `backend/`. It prints the authenticated browser URL. Use `--data-dir` for an isolated development archive; `--no-browser`, `--no-multicast`, `--localsend-port`, and `--ui-dir` support controlled runs. For Vite development, start the backend separately and run `SYD_API=http://127.0.0.1:<port> npm run dev` from `frontend/`; open Vite on port 5173 with the backend's `#token=...` fragment. Vite proxies `/api`, including WebSockets.

`AppState` in `backend/syd/state.py` owns setup/locked/ready lifecycle and service activation. `api.py` handles HTTP validation/authentication and delegates to `Repo` and domain services. `Vault` owns SQLCipher storage, migrations, blobs, and FTS5 search.

The processing path is upload/LocalSend staging -> user grouping and import commit -> persistent `JobQueue` -> OCR and rule extraction (optional Ollama) -> review -> confirmation. Jobs run sequentially in a worker thread and recover interrupted work on startup. `EventHub` publishes small events to `/api/events`; `frontend/src/lib/events.ts` dispatches them and debounces React Query invalidation.

The frontend uses React Query for server state, `lib/api.ts` for authenticated requests, and `NavContext`/`useNav` for view navigation rather than a URL router. Views are lazy-loaded in `App.tsx`; reusable controls and dialogs live in `components/ui.tsx`.

## Key conventions

- **Review is a business boundary.** Document states are `eingegangen`, `verarbeitet`, `erkannt`, `geprueft`. Extraction produces reviewable proposals and must preserve manual corrections and already-reviewed documents. Statistics use reviewed, non-archived documents; reminder eligibility also requires confirmed deadlines. Preserve these filters when adding queries.
- **Archiving and trash are separate.** Deletion first moves a document to trash; permanent deletion is allowed only from trash. Field corrections are recorded as old/new values in `field_history`. Audit events are append-only and must not contain document text or secrets.
- **Use the vault boundary.** Archived originals, thumbnails, OCR text, metadata, and the search index belong in encrypted `archiv.syd`. Add schema changes by appending to `MIGRATIONS` in `vault.py`; migration order maps to `PRAGMA user_version`. Use vault query helpers and `with vault.tx():` for related writes; its shared connection is protected by an `RLock`, with savepoints for nested transactions. Preserve the explicit 8192-byte cipher page size on open.
- **Backups are not live file copies.** Use `backups.make_backup`/`Vault.backup_to`, which use SQLite's backup API for WAL-consistent snapshots. Unconfirmed upload and LocalSend staging files are temporarily plaintext; do not describe them as encrypted archive contents.
- **Seed defaults centrally.** Built-in areas belong in `DEFAULT_CATEGORIES` in `repo.py`; `Repo.ensure_defaults()` inserts missing entries idempotently at startup. Settings belong in `DEFAULT_SETTINGS` with validation in `_validate_setting`; stored values override defaults.
- **Preserve the local API guard.** The API binds to loopback and checks Host, Origin, and token, with `/api/health` unauthenticated. Setup/locked states return HTTP 423 outside the explicit lifecycle allowlist. Use `api` for requests and `mediaUrl` for image/download URLs. The UI consumes the fragment token into `sessionStorage` and clears the fragment; never put it in `localStorage`.
- **Keep errors and UI German.** Backend business failures use `ArchiveError(message, code, status, **extra)` and JSON `code`/`message`; frontend failures use `ApiError`/`errorText`. Amounts are integer cents and document dates are ISO dates; reuse backend `util.py` and frontend `lib/format.ts` for German formatting/parsing.
- **Reuse the implemented design system.** Follow `DESIGN.md`, shared UI components, and CSS tokens in `frontend/src/index.css`. The stylesheet's `KORREKTUR` overrides intentionally improve accessibility; do not replace them with the older values in the design document. Fonts are bundled locally.
- **Version source of truth is `version.txt`.** Change it rather than hand-editing version fields across Python, npm, and Rust manifests. `scripts/sync-version.py` propagates it during backend startup and npm dev/build/typecheck/Tauri hooks. Use `npm run tauri:dev`/`npm run tauri:build` for version-synchronized Tauri runs. Changes to `version.txt` on `main` trigger the release workflow.
- **Tests use isolated real archives.** Backend fixtures create SQLCipher vaults under `tmp_path`, inject dates/recognition functions, and use `AppState(background=False, multicast=False)` to avoid live services. `JobQueue.run_pending()` processes queued work synchronously. Real OCR cases render synthetic German documents from `tests/synth.py` and skip when German Tesseract data is unavailable.

Further context: `docs/ENTWICKLUNG.md` covers development, packaging, security, and storage; `docs/CODE_VERSTEHEN.md` explains cross-layer flows. `PLAN.md` records design decisions; `docs/SPIKES.md` records platform validation and remaining acceptance checks.
