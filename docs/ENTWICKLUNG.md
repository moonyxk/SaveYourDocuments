# Entwickeln und bauen

## Voraussetzungen

- Python 3.11+ (getestet mit 3.14), Node 20+ (getestet mit 24), Rust stable
- Tesseract 5 mit `deu`, `eng`, `osd` (nur für Entwicklung und Tests; der Installer bringt eigenes mit)
- Windows-Installer: Visual Studio Build Tools, NSIS

## Backend

```bash
cd backend
python -m venv .venv && .venv/bin/pip install -e ".[dev]"
.venv/bin/ruff check . && .venv/bin/ruff format --check .
.venv/bin/pytest -q
```

- Die Tests nutzen echte Verschlüsselung und echte OCR auf synthetisch erzeugten deutschen Dokumenten (`tests/synth.py`). Ohne Tesseract werden die OCR-Tests übersprungen.
- Gold-Set der Erkennung: `.venv/bin/python scripts/goldset.py`
- Start im Browser ohne Hülle: `.venv/bin/python -m syd.main` (gibt `http://127.0.0.1:<port>/#token=…` aus). Hilfreiche Schalter: `--data-dir`, `--port`, `--localsend-port`, `--no-multicast`, `--no-browser`, `--ui-dir`.
- Umgebungsvariablen: `SYD_DATA_DIR` (Datenordner), `SYD_TOKEN` (Token von der Hülle), `SYD_TESSERACT`/`SYD_TESSDATA` (eigenes Tesseract).

Unter Windows startet `start.cmd` das Programm aus dem Quellcode und wiederholt bei Bedarf
eine fehlgeschlagene Installation. Dabei wird der pip-Cache nicht verwendet; ein benötigter
Conan-Cache liegt standardmäßig in `backend\.venv\conan` und kann über `CONAN_HOME`
vorgegeben werden. Falls für die Python-Version kein SQLCipher-Wheel verfügbar ist, wird
SQLCipher aus Quelltext gebaut; dafür sind Visual Studio C++ Build Tools erforderlich.

### API-Sicherheit

Jede Anfrage braucht den Token (Header `X-SYD-Token`, für Bilder/WebSocket `?token=`), einen `Host` aus `127.0.0.1`/`localhost` und einen erlaubten `Origin`. Solange das Archiv gesperrt oder noch nicht eingerichtet ist, antwortet die API mit `423`. Erlaubt bleiben dann nur Status, Einrichtung, Entsperren und Beenden.

## Oberfläche

```bash
cd frontend
npm ci
npm run dev        # Vite auf :5173; Backend-URL: SYD_API=http://127.0.0.1:<port>, Token im Fragment: #token=…
npm run typecheck
npm run build      # nach frontend/dist (das Backend liefert diesen Ordner aus)
```

Alle Texte sind Deutsch. Daten holt die Oberfläche mit `@tanstack/react-query`; bei jedem Backend-Ereignis (WebSocket `/api/events`) werden aktive Abfragen neu geladen.

## Hülle (Tauri)

```bash
cd src-tauri
cargo check        # Linux braucht libwebkit2gtk-4.1-dev, libgtk-3-dev, libayatana-appindicator3-dev
```

Entwicklung mit dem Python-Quelltext statt des eingefrorenen Dienstes:

```bash
SYD_BACKEND_CMD="/pfad/zum/.venv/bin/python -m syd.main" cargo run
```

Die Hülle lädt keine eigene Oberfläche, sondern öffnet ein Fenster auf den lokalen Dienst. Sie braucht deshalb keine Tauri-Rechte für die Webansicht (`capabilities/default.json` ist leer). Tray, Autostart (`--minimized`), Einzelinstanz und Benachrichtigungen steuert allein der Rust-Teil. Alle Minute fragt er `/api/reminders/notifications` ab.

## Windows-Installer

Auf einem Windows-Rechner (oder per Workflow `CI`, Job `windows-installer`, bei Tags `v*`):

```powershell
./scripts/build-windows.ps1
```

Schritte: Oberfläche bauen, Tesseract mit deutschen Sprachdaten holen (`scripts/fetch-tesseract.ps1`), Backend mit PyInstaller einfrieren (`backend/packaging/syd-backend.spec`, onedir), Rauchtest des eingefrorenen Dienstes (`scripts/smoke-backend.py`), Tauri-NSIS-Installer bauen. Die Installer-Hooks (`src-tauri/installer-hooks.nsh`) beenden vor Installation und Deinstallation laufende Prozesse und entfernen den alten Dienst, damit bei einer Neuinstallation nicht der alte liegen bleibt (tauri-apps/tauri#15134). Die Archivdatei im Datenordner wird dabei nie angefasst.

Der Installer ist **nicht signiert**. Windows SmartScreen zeigt deshalb eventuell eine Warnung („Weitere Informationen“, „Trotzdem ausführen“). Code-Signing ist ein offener Punkt.

## Version und Update-Prüfung

Die Version steht **nur in `version.txt`** (Projektordner, eine Zeile wie `1.2.3`). Ändere nur diese Datei. Die üblichen Build- und Startbefehle übernehmen sie automatisch nach `backend/syd/__init__.py`, `backend/pyproject.toml`, `src-tauri/Cargo.toml`, `src-tauri/Cargo.lock`, `src-tauri/tauri.conf.json`, `frontend/package.json` und `frontend/package-lock.json`: dazu zählen der Backend-Start `python -m syd.main`, `npm run dev`, `npm run build`, `npm run typecheck`, `npm run tauri:dev`, `npm run tauri:build`, CI und `scripts/build-windows.ps1`. Das Synchronisierungsskript ist dabei ein interner Schritt und muss nicht manuell gestartet werden. Tauri-Builds deshalb über `npm run tauri:dev` beziehungsweise `npm run tauri:build` starten; ein direkter `cargo run`-Aufruf umgeht den automatischen Versionsschritt. Ein Test prüft, dass alle Versionsangaben übereinstimmen.

Der Installer heißt danach `Save Your Documents_<Version>_x64-setup.exe`. Nach dem Commit auf `main` erstellt der Release-Workflow automatisch ein GitHub Release mit Tag `v<Version>` und hängt den Windows-Installer an. Vorabversionen (mit Suffix wie `-beta.1`) werden als „pre-release“ markiert.

Die Prüfung (`backend/syd/updates.py`, Regeln aus `docs/github-api-version-check.md`) liest `GET /repos/moonyxc/SaveYourDocuments/releases?per_page=100` ohne Token, folgt dem `Link`-Header, vergleicht nach SemVer und meldet `update`, `aktuell`, `kein_release` oder `fehler`. Sie lädt und installiert nichts. API: `GET /api/updates`, `POST /api/updates/check` (`{"auto": true}` nur bei eingeschalteter Einstellung `update_check_auto`, höchstens alle 12 Stunden), `POST /api/updates/open` (öffnet die zuletzt gefundene Release-Seite im Browser).

## Was wo gespeichert wird

| Was | Wo |
|---|---|
| Archiv (verschlüsselt) | `%APPDATA%\SaveYourDocuments\archiv.syd` (frei wählbar beim Einrichten) |
| Schlüssel (Schlüsselmodus) | `%APPDATA%\SaveYourDocuments`, per DPAPI an das Windows-Konto gebunden |
| Konfiguration | `config.json` im Datenordner (keine Geheimnisse) |
| Sicherungen | Unterordner `backups` oder frei gewählter Ordner |
| Logs | Unterordner `logs`, pro Tag eine Datei, ohne Dokumentinhalte |
| LocalSend-Quarantäne | Unterordner `staging/localsend`, **unverschlüsselt** bis der Import bestätigt ist |
