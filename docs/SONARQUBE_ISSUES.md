# SonarQube-Issues – SaveYourDocuments

**Quelle:** SonarCloud-Exporte `docs\Issues.pdf` und `docs\Issues2.pdf`  
**Reihenfolge:** wie in den jeweiligen PDFs; zuerst `Issues.pdf`, danach `Issues2.pdf`.

> **Hinweis zu `Issues.pdf`:** Der PDF-Fuß zeigt „19 of 19 shown“. Die Screenshots ergänzen die Blocker 1–2 und klären die SHA-Issues 3–5 (`.github/workflows/ci.yml`, Zeilen 58, 71 und 92). Zusammen mit den 14 übrigen Einträgen aus dem PDF-Text sind alle 19 Issues abgebildet. `Issues2.pdf` enthält alle 35 angezeigten Einträge.

## Issues.pdf – Security

### Issues in PDF-Reihenfolge

| # | Datei und Zeile | Issue | Qualität / Schwere | Einordnung / Tags | Zuständig | Aufwand | Status / Alter |
|---:|---|---|---|---|---|---|---|
| 1 | `backend/syd/api.py`, Z. 695 | Reflected XSS via file content in create_app.import_file() | Security – Blocker | Intentionality; cwe | Nicht zugewiesen | 30 min | Open; vor 12 Tagen |
| 2 | `scripts/smoke-backend.py`, Z. 22 | Command Injection via command-line argument | Security – Blocker | Intentionality; cwe | Nicht zugewiesen | 30 min | Open; vor 12 Tagen |
| 3 | `.github/workflows/ci.yml`, Z. 58 | Use full commit SHA hash for this dependency. | Security 4 – High | Responsibility; cwe, former-hotspot | Nicht zugewiesen | 30 min | Open; vor 12 Tagen |
| 4 | `.github/workflows/ci.yml`, Z. 71 | Use full commit SHA hash for this dependency. | Security 4 – High | Responsibility; cwe, former-hotspot | moon | 30 min | Open; vor 6 h |
| 5 | `.github/workflows/ci.yml`, Z. 92 | Use full commit SHA hash for this dependency. | Security 4 – High | Responsibility; cwe, former-hotspot | Nicht zugewiesen | 30 min | Open; vor 12 Tagen |
| 6 | `.github/workflows/release.yml`, Z. 29 | Use full commit SHA hash for this dependency. | Security 4 – High | Responsibility; cwe, former-hotspot | moon | 30 min | Open; vor 6 h |
| 7 | `backend/syd/config.py`, Z. 62 | Path Traversal via faulty LLM-supplied CLI arguments in config.Paths() | Security 4 – High | Intentionality; cwe | Nicht zugewiesen | 30 min | Open; vor 12 Tagen |
| 8 | `backend/syd/localsend.py`, Z. 697 | Enable server hostname verification on this SSL/TLS connection. | Security 4 – High | Intentionality; cryptography, cwe … | moon | 5 min | Open; vor 8 Tagen |
| 9 | `backend/syd/localsend.py`, Z. 699 | Enable server certificate validation on this SSL/TLS connection. | Security 4 – High | Responsibility; cryptography, cwe … | moon | 5 min | Open; vor 8 Tagen |
| 10 | `frontend/src/lib/api.ts`, Z. 9 | Browser Storage Poisoning via unsanitized user input | Security 4 – High | Responsibility; cwe | Nicht zugewiesen | 20 min | Open; vor 12 Tagen |
| 11 | `frontend/src/lib/events.ts`, Z. 38 | Connection Hijacking via unsanitized user input | Security 4 – High | Responsibility; cwe | Nicht zugewiesen | 20 min | Open; vor 12 Tagen |
| 12 | `.github/workflows/ci.yml`, Z. 22 | Omitting "--only-binary :all:" can lead to the execution of setup scripts. Make sure it is safe here. | Security 2 – Medium | Responsibility; cwe | Nicht zugewiesen | 1 h | Open; vor 12 Tagen |
| 13 | `.github/workflows/ci.yml`, Z. 22 | Using dependencies without locking resolved versions is security-sensitive. | Security 2 – Medium | Intentionality; keine Tags | Nicht zugewiesen | 1 h | Open; vor 12 Tagen |
| 14 | `.github/workflows/ci.yml`, Z. 42 | Omitting "--ignore-scripts" allows lifecycle scripts to run during package installation. | Security 2 – Medium | Responsibility; cwe, former-hotspot | Nicht zugewiesen | 30 min | Open; vor 12 Tagen |
| 15 | `backend/pyproject.toml`, Zeile nicht angezeigt | Dependency versions are not predictable if the lock file (uv.lock, poetry.lock, pdm.lock, pylock.toml or a fully pinned requirements.txt) is missing. | Security 2 – Medium | Intentionality; keine Tags | Nicht zugewiesen | 5 min | Open; vor 13 Tagen |
| 16 | `.github/workflows/ci.yml`, Z. 66 | Make sure that using clear-text protocols is safe here. | Security 3 – Low | Intentionality; cryptography, cwe … | moon | 30 min | Open; vor 4 h |
| 17 | `backend/syd/api.py`, Z. 114 | Using HTTP protocol is insecure. Use HTTPS instead. | Security 3 – Low | Intentionality; cryptography, cwe … | Nicht zugewiesen | 30 min | Open; vor 12 Tagen |
| 18 | `backend/syd/localsend.py`, Z. 39 | Make sure using this hardcoded IP address "224.0.0.167" is safe here. | Security 3 – Low | Responsibility; bad-practice, former-hotspot | Nicht zugewiesen | 30 min | Open; vor 13 Tagen |
| 19 | `backend/syd/localsend.py`, Z. 102 | Make sure using this hardcoded IP address "1.1.1.1" is safe here. | Security 3 – Low | Responsibility; bad-practice, former-hotspot | moon | 30 min | Open; vor 8 Tagen |

## Issues2.pdf – Reliability

**Anzahl:** 35 Issues · **Gesamtaufwand laut PDF:** 4 h 34 min

| # | Datei und Zeile | Issue | Qualität / Schwere | Einordnung / Tags | Zuständig | Aufwand | Status / Alter |
|---:|---|---|---|---|---|---|---|
| 1 | `backend/syd/updates.py`, Z. 31 | Add the missing comparison methods or use `functools.total_ordering`. | Reliability 4 – High; Maintainability 4 – High | Intentionality; comparison, pitfall | Nicht zugewiesen | 5 min | Open; vor 9 Tagen |
| 2 | `frontend/src/components/review/ReviewForm.tsx`, Z. 406 | Provide a compare function to avoid sorting elements alphabetically. | Reliability 4 – High | Intentionality; bad-practice, type-dependent | Nicht zugewiesen | 10 min | Open; vor 12 Tagen |
| 3 | `frontend/src/components/review/ReviewForm.tsx`, Z. 406 | Provide a compare function to avoid sorting elements alphabetically. | Reliability 4 – High | Intentionality; bad-practice, type-dependent | Nicht zugewiesen | 10 min | Open; vor 12 Tagen |
| 4 | `frontend/src/views/Stats.tsx`, Z. 114 | Provide a compare function to avoid sorting elements alphabetically. | Reliability 4 – High | Intentionality; bad-practice, type-dependent | Nicht zugewiesen | 10 min | Open; vor 12 Tagen |
| 5 | `backend/syd/api.py`, Z. 91 | Cleanup after this "yield" may be skipped on early exit. | Reliability 2 – Medium | Intentionality; pitfall | Nicht zugewiesen | 5 min | Open; vor 12 Tagen |
| 6 | `backend/syd/extract/rules.py`, Z. 223 | Do not perform equality checks with floating point values. | Reliability 2 – Medium | Intentionality; data-science, numpy … | Nicht zugewiesen | 5 min | Open; vor 12 Tagen |
| 7 | `backend/syd/extract/rules.py`, Z. 247 | Simplify this regular expression to reduce its runtime, as it has super-linear performance due to backtracking. | Reliability 2 – Medium | Intentionality; performance, regex | Nicht zugewiesen | 20 min | Open; vor 12 Tagen |
| 8 | `backend/syd/extract/rules.py`, Z. 248 | Simplify this regular expression to reduce its runtime, as it has super-linear performance due to backtracking. | Reliability 2 – Medium | Intentionality; performance, regex | Nicht zugewiesen | 20 min | Open; vor 12 Tagen |
| 9 | `backend/syd/extract/rules.py`, Z. 408 | Simplify this regular expression to reduce its runtime, as it has super-linear performance due to backtracking. | Reliability 2 – Medium | Intentionality; performance, regex | Nicht zugewiesen | 20 min | Open; vor 12 Tagen |
| 10 | `frontend/src/components/deadlines/common.tsx`, Z. 80 | Prefer `Number.NaN` over `NaN`. | Reliability 2 – Medium; Maintainability 3 – Low | Consistency; convention, editable-source … | Nicht zugewiesen | 2 min | Open; vor 12 Tagen |
| 11 | `frontend/src/components/documents/Cards.tsx`, Z. 538 | `tabIndex` should only be declared on interactive elements. | Reliability 2 – Medium; Maintainability 3 – Low | Consistency; accessibility, react | Nicht zugewiesen | 5 min | Open; vor 12 Tagen |
| 12 | `frontend/src/components/documents/Viewer.tsx`, Z. 58 | `tabIndex` should only be declared on interactive elements. | Reliability 2 – Medium; Maintainability 3 – Low | Consistency; accessibility, react | Nicht zugewiesen | 5 min | Open; vor 12 Tagen |
| 13 | `frontend/src/components/export/ExportView.tsx`, Z. 54 | Simplify this regular expression to reduce its runtime, as it has super-linear performance due to backtracking. | Reliability 2 – Medium | Intentionality; performance, regex | Nicht zugewiesen | 20 min | Open; vor 12 Tagen |
| 14 | `frontend/src/components/export/ExportView.tsx`, Z. 498 | `tabIndex` should only be declared on interactive elements. | Reliability 2 – Medium; Maintainability 3 – Low | Consistency; accessibility, react | Nicht zugewiesen | 5 min | Open; vor 12 Tagen |
| 15 | `frontend/src/components/review/DocumentViewer.tsx`, Z. 25 | `tabIndex` should only be declared on interactive elements. | Reliability 2 – Medium; Maintainability 3 – Low | Consistency; accessibility, react | Nicht zugewiesen | 5 min | Open; vor 12 Tagen |
| 16 | `frontend/src/components/review/ReviewForm.tsx`, Z. 106 | `tabIndex` should only be declared on interactive elements. | Reliability 2 – Medium; Maintainability 3 – Low | Consistency; accessibility, react | Nicht zugewiesen | 5 min | Open; vor 12 Tagen |
| 17 | `frontend/src/components/settings/DisplayTab.tsx`, Z. 29 | Simplify this regular expression to reduce its runtime, as it has super-linear performance due to backtracking. | Reliability 2 – Medium | Intentionality; performance, regex | Nicht zugewiesen | 20 min | Open; vor 12 Tagen |
| 18 | `frontend/src/components/settings/DisplayTab.tsx`, Z. 30 | Simplify this regular expression to reduce its runtime, as it has super-linear performance due to backtracking. | Reliability 2 – Medium | Intentionality; performance, regex | Nicht zugewiesen | 20 min | Open; vor 12 Tagen |
| 19 | `frontend/src/components/settings/LogTab.tsx`, Z. 173 | `tabIndex` should only be declared on interactive elements. | Reliability 2 – Medium; Maintainability 3 – Low | Consistency; accessibility, react | Nicht zugewiesen | 5 min | Open; vor 12 Tagen |
| 20 | `frontend/src/components/ui.tsx`, Z. 179 | Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element. | Reliability 2 – Medium; Maintainability 3 – Low | Consistency; accessibility, react | Nicht zugewiesen | 5 min | Open; vor 12 Tagen |
| 21 | `frontend/src/views/Gate.tsx`, Z. 145 | Remove this "autoFocus" attribute, as it can reduce usability and accessibility for users. | Reliability 2 – Medium; Maintainability 3 – Low | Consistency; accessibility, react | Nicht zugewiesen | 5 min | Open; vor 12 Tagen |
| 22 | `frontend/src/views/Gate.tsx`, Z. 317 | Remove this "autoFocus" attribute, as it can reduce usability and accessibility for users. | Reliability 2 – Medium; Maintainability 3 – Low | Consistency; accessibility, react | Nicht zugewiesen | 5 min | Open; vor 12 Tagen |
| 23 | `prototype/index.html`, Z. 238 | A form label must be associated with a control and have accessible text. | Reliability 2 – Medium | Intentionality; accessibility | Nicht zugewiesen | 5 min | Open; vor 13 Tagen |
| 24 | `prototype/index.html`, Z. 357 | Prefer `Number.parseFloat` over `parseFloat`. | Reliability 2 – Medium; Maintainability 3 – Low | Consistency; convention, editable-source … | Nicht zugewiesen | 2 min | Open; vor 13 Tagen |
| 25 | `backend/syd/localsend.py`, Z. 211 | Use asynchronous features in this function or remove the `async` keyword. | Reliability 3 – Low; Maintainability 2 – Medium | Consistency; async | Nicht zugewiesen | 5 min | Open; vor 13 Tagen |
| 26 | `frontend/src/components/documents/InlineEdit.tsx`, Z. 62 | Non-interactive elements should not be assigned mouse or keyboard event listeners. | Reliability 3 – Low | Consistency; accessibility, react | Nicht zugewiesen | 5 min | Open; vor 12 Tagen |
| 27 | `frontend/src/components/review/CompanyCombobox.tsx`, Z. 89 | Visible, non-interactive elements with click handlers must have at least one keyboard listener. | Reliability 3 – Low | Intentionality; accessibility, react | Nicht zugewiesen | 5 min | Open; vor 12 Tagen |
| 28 | `frontend/src/components/review/CompanyCombobox.tsx`, Z. 102 | Visible, non-interactive elements with click handlers must have at least one keyboard listener. | Reliability 3 – Low | Intentionality; accessibility, react | Nicht zugewiesen | 5 min | Open; vor 12 Tagen |
| 29 | `frontend/src/components/review/ReviewForm.tsx`, Z. 490 | Non-interactive elements should not be assigned mouse or keyboard event listeners. | Reliability 3 – Low; Maintainability 2 – Medium | Consistency; accessibility, react | Nicht zugewiesen | 5 min | Open; vor 12 Tagen |
| 30 | `frontend/src/components/ui.tsx`, Z. 197 | Review this async function: it has no await expression. | Reliability 3 – Low; Maintainability 2 – Medium | Consistency; async, type-dependent | Nicht zugewiesen | 5 min | Open; vor 12 Tagen |
| 31 | `frontend/src/lib/format.ts`, Z. 14 | Use `replaceAll()` with a string literal instead of this global regex. | Reliability 3 – Low; Maintainability 3 – Low | Intentionality; editable-source, es2021 … | moon | 5 min | Open; vor 7 Tagen |
| 32 | `frontend/src/lib/format.ts`, Z. 16 | Use `replaceAll()` with a string literal instead of this global regex. | Reliability 3 – Low; Maintainability 3 – Low | Intentionality; editable-source, es2021 … | moon | 5 min | Open; vor 7 Tagen |
| 33 | `frontend/src/views/Settings.tsx`, Z. 45 | Non-interactive elements should not be assigned mouse or keyboard event listeners. | Reliability 3 – Low; Maintainability 2 – Medium | Consistency; accessibility, react | Nicht zugewiesen | 5 min | Open; vor 12 Tagen |
| 34 | `frontend/src/views/Stats.tsx`, Z. 153 | Ambiguous spacing after previous element input | Reliability 3 – Low; Maintainability 2 – Medium | Consistency; react | Nicht zugewiesen | 5 min | Open; vor 12 Tagen |
| 35 | `prototype/index.html`, Z. 356 | Use `replaceAll()` with a string literal instead of this global regex. | Reliability 3 – Low; Maintainability 3 – Low | Intentionality; editable-source, es2021 … | Nicht zugewiesen | 5 min | Open; vor 13 Tagen |
