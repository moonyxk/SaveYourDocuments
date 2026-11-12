# Deinen Code verstehen – Schritt für Schritt

Du möchtest nicht nur Code von einer KI übernehmen, sondern selbst verstehen, wie dein Programm funktioniert und wie du es verändern kannst. Genau dafür ist diese Anleitung da.

**Du musst nicht alles auf einmal lernen.** Ein guter Anfang ist: eine kleine Stelle verstehen, selbst ändern und prüfen, was passiert.

Die Beispiele beziehen sich auf den aktuellen Aufbau von **Save Your Documents**. Du kannst die genannten Dateien direkt in deinem Editor öffnen.

## Wegweiser

- [1. Das große Bild: vier Ordner, vier Aufgaben](#1-das-große-bild-vier-ordner-vier-aufgaben)
- [2. Frontend: was du siehst und bedienst](#2-frontend-was-du-siehst-und-bedienst)
- [3. Backend: was im Hintergrund arbeitet](#3-backend-was-im-hintergrund-arbeitet)
- [4. Tauri: die Hülle als Desktopprogramm](#4-tauri-die-hülle-als-desktopprogramm)
- [5. Prototype: der frühere Entwurf](#5-prototype-der-frühere-entwurf)
- [6. Eine Suche durch den Code verfolgen](#6-eine-suche-durch-den-code-verfolgen)
- [7. Welche Datei ändere ich wofür?](#7-welche-datei-ändere-ich-wofür)
- [8. Das Projekt zum Lernen starten](#8-das-projekt-zum-lernen-starten)
- [9. Drei kleine Übungen zum Selbermachen](#9-drei-kleine-übungen-zum-selbermachen)
- [10. Änderungen prüfen und Fehler eingrenzen](#10-änderungen-prüfen-und-fehler-eingrenzen)
- [11. Mit KI lernen, ohne alles abzugeben](#11-mit-ki-lernen-ohne-alles-abzugeben)
- [12. Kleine Begriffshilfe](#12-kleine-begriffshilfe)

## 1. Das große Bild: vier Ordner, vier Aufgaben

Dein Programm besteht nicht aus einer einzigen riesigen Datei. Es ist in Teile mit unterschiedlichen Aufgaben aufgeteilt:

| Ordner | Einfach erklärt | Technik |
|---|---|---|
| `frontend/` | Zeigt die Oberfläche und reagiert auf deine Eingaben. | React, TypeScript, CSS |
| `backend/` | Verarbeitet Dokumente und verwaltet das Archiv. | Python, FastAPI, SQLCipher |
| `src-tauri/` | Macht daraus ein Desktopprogramm mit Fenster und Systemfunktionen. | Tauri, Rust |
| `prototype/` | Enthält einen früheren klickbaren Oberflächenentwurf. | HTML, CSS, JavaScript |

**Die ersten drei gehören zur eigentlichen App. Der Prototyp ist ein historischer Entwurf.**

Beim normalen Start als Desktopprogramm sieht das vereinfacht so aus:

```text
Tauri startet
    |
    +-- startet das Python-Backend
    |
    +-- öffnet ein Fenster mit dem Frontend
                              |
                              | Anfragen und Antworten
                              v
                           Backend
                              |
                              v
                    verschlüsseltes Archiv
```

Wichtig für dein Projekt: **Das Backend läuft auf deinem eigenen Computer.** Es ist kein Cloudserver. Die Oberfläche spricht über eine lokale Verbindung mit ihm.

Im Entwicklungsmodus kannst du die Oberfläche auch im Browser benutzen, ohne Tauri zu starten.

## 2. Frontend: was du siehst und bedienst

Das Frontend ist der sichtbare Teil: Navigation, Dokumentenliste, Eingabefelder, Buttons, Farben und Fehlermeldungen.

Es kümmert sich zum Beispiel darum, dass du einen Suchbegriff eingeben kannst und die gefundenen Dokumente angezeigt bekommst. Die eigentliche Suche im Archiv erledigt aber das Backend.

### Die wichtigsten Dateien und Unterordner

Alle folgenden Pfade sind vom Projektordner aus gemeint:

| Pfad | Aufgabe |
|---|---|
| `frontend/src/main.tsx` | Einstieg der Oberfläche: verbindet React mit der HTML-Seite und richtet gemeinsame Dienste ein. |
| `frontend/src/App.tsx` | Grundgerüst der App, Navigation und Auswahl der Ansicht. |
| `frontend/src/views/` | Ansichten wie Dokumente, Fristen oder Einstellungen. |
| `frontend/src/components/` | Bausteine der Oberfläche, teilweise auch größere zusammengehörige Bereiche. |
| `frontend/src/lib/api.ts` | Gemeinsame Funktionen für Anfragen an das Backend. |
| `frontend/src/lib/format.ts` | Kleine Helfer, etwa für Geldbeträge, Datumsangaben und Dateigrößen. |
| `frontend/src/index.css` | Zentrale Gestaltung. Zusätzlich gibt es CSS-Dateien für einzelne Bereiche. |
| `frontend/package.json` | Verwendete JavaScript-Pakete und Befehle zum Entwickeln, Testen und Bauen. |

### Was ist React?

React ist eine Bibliothek zum Bauen von Benutzeroberflächen. Du beschreibst die Oberfläche mit **Komponenten**, also wiederverwendbaren Bausteinen.

Ein stark vereinfachtes Beispiel:

```tsx
function Begruessung() {
  return <h1>Hallo!</h1>;
}
```

Die Funktion gibt hier eine Überschrift zurück. Die Schreibweise `<h1>…</h1>` sieht aus wie HTML. In einer React-Datei nennt man diese Schreibweise **JSX**.

Die Endung `.tsx` bedeutet: Hier darf TypeScript mit JSX kombiniert werden.

### Was macht TypeScript?

TypeScript ergänzt JavaScript um Typangaben. Damit beschreibst du zum Beispiel, dass eine Funktion eine Zahl erwartet und Text zurückgibt.

Aus deiner Datei `frontend/src/lib/format.ts`:

```ts
export function eur(cents: number | null | undefined): string {
  return cents === null || cents === undefined ? "–" : eurFmt.format(cents / 100);
}
```

So kannst du das lesen:

- `export`: Andere Dateien dürfen diese Funktion importieren und benutzen.
- `eur`: Name der Funktion.
- `cents`: Eingabewert, hier ein Geldbetrag in Cent.
- `number | null | undefined`: Erlaubt sind eine Zahl oder ein fehlender Wert.
- `: string`: Die Funktion gibt Text zurück.
- `return`: Liefert das Ergebnis an die aufrufende Stelle zurück.

**Was passiert konkret?** `eur(4990)` liefert einen formatierten Betrag wie `49,90 €`. Bei einem fehlenden Betrag erscheint ein Gedankenstrich.

Die Typprüfung hilft dir, Fehler früh zu entdecken. Sie ersetzt aber keine Prüfung von Daten im Backend: Eine Anfrage kann auch ohne dein Frontend ankommen.

### Was sind State und Hooks?

In React ist **State** ein Zustand, den sich eine Komponente merkt. Zum Beispiel: Welche Ansicht ist geöffnet?

In `App.tsx` findest du:

```tsx
const [view, setView] = useState<View>("start");
```

Das bedeutet:

- `view` enthält die aktuelle Ansicht.
- `setView` ändert die Ansicht und veranlasst React, die betroffene Oberfläche neu darzustellen.
- `"start"` ist der Anfangswert.
- `View` beschreibt die erlaubten Ansichten.

`useState` ist ein **Hook**: eine React-Funktion, mit der Komponenten bestimmte Fähigkeiten bekommen.

Du musst nicht sofort jeden Hook verstehen. Suche beim Lesen zuerst nach: **Welche Daten bekommt diese Komponente? Was merkt sie sich? Was zeigt sie an?**

## 3. Backend: was im Hintergrund arbeitet

Das Backend enthält die Datenverarbeitung und Regeln deiner App. Es nimmt Anfragen entgegen, prüft sie und führt die passende Arbeit aus.

Beispiele: ein Dokument importieren, Text erkennen, einen Betrag speichern, Fristen berechnen oder Dokumente suchen.

### Die wichtigsten Dateien

| Pfad | Aufgabe |
|---|---|
| `backend/syd/main.py` | Startet den lokalen Dienst. |
| `backend/syd/api.py` | Definiert die Schnittstelle, die das Frontend aufruft. |
| `backend/syd/state.py` | Verwaltet den gemeinsamen Anwendungszustand und das Zusammenspiel der Dienste. |
| `backend/syd/repo.py` | Enthält viele Regeln und Datenbankzugriffe für Dokumente, Einstellungen und weitere Daten. |
| `backend/syd/vault.py` | Verwaltet die verschlüsselte Datenbank, Dokumentinhalte und den Volltextindex. |
| `backend/syd/imports.py` | Kümmert sich um den Import und das Zusammenfassen von Dateien. |
| `backend/syd/jobs.py` | Verwaltet Verarbeitungsaufgaben im Hintergrund. |
| `backend/syd/extract/ocr.py` | Macht Text aus Dokumentseiten lesbar. |
| `backend/syd/extract/rules.py` | Erkennt Angaben anhand von Regeln im Text. |
| `backend/syd/extract/pipeline.py` | Verbindet die Erkennungsschritte und erzeugt Vorschläge. |
| `backend/syd/deadlines.py` | Kümmert sich um Fristen und Erinnerungen. |
| `backend/tests/` | Automatische Tests für das Backend. |

`syd` ist hier der Name des Python-Pakets: ein zusammengehöriger Bereich aus Python-Modulen.

### Was ist eine API?

Eine **API** ist eine vereinbarte Schnittstelle. Stell sie dir wie einen Schalter mit bestimmten Formularen vor: Für jede Aufgabe gibt es eine festgelegte Anfrage und eine passende Antwort.

Zum Beispiel:

```text
Frontend: GET /api/documents?q=Versicherung
Backend: Hier sind die passenden Dokumente und ihre Gesamtzahl.
```

`GET` bedeutet hier „Daten abfragen“. Andere häufige Anfragearten sind `POST`, `PUT`, `PATCH` und `DELETE`, etwa zum Auslösen einer Aktion, Ändern oder Löschen von Daten.

**FastAPI** ist die Python-Bibliothek, mit der dein Backend diese Schnittstelle bereitstellt. Eine Zeile wie:

```python
@app.get("/api/documents")
```

ordnet die darunterstehende Funktion einer `GET`-Anfrage auf diesem Pfad zu.

### Wo liegen die Dokumente?

Die dauerhaft archivierten Dokumente und ihre Daten liegen in der verschlüsselten Datei `archiv.syd`. Dafür benutzt dein Projekt **SQLCipher**, eine verschlüsselte Variante der Datenbank SQLite.

**Nicht jede Datei rund um die App ist dadurch automatisch verschlüsselt.** Beispielsweise liegen noch nicht bestätigte LocalSend-Eingänge vorübergehend unverschlüsselt im Staging-Ordner. Details zu den Speicherorten stehen in [ENTWICKLUNG.md](ENTWICKLUNG.md#was-wo-gespeichert-wird).

Für Lernversuche solltest du erfundene Dokumente und einen eigenen Test-Datenordner verwenden, nicht dein wichtiges Archiv.

### Ist Texterkennung dasselbe wie KI?

Nicht ganz. Bei dir sind das getrennte Schritte:

1. **OCR mit Tesseract:** Text aus einem Foto oder einer PDF-Seite lesen.
2. **Regeln:** Im Text nach Angaben wie Datum, Betrag oder Referenznummer suchen.
3. **Optional Ollama:** Ein lokal laufendes Sprachmodell kann die Erkennung ergänzen.

OCR macht aus einem Bild zunächst Text. Daraus zuverlässig abzuleiten, welcher Betrag etwa die Rechnungssumme ist, ist eine zusätzliche Aufgabe. Die Verarbeitung erzeugt Vorschläge, die du anschließend prüfen kannst.

## 4. Tauri: die Hülle als Desktopprogramm

Deine Oberfläche benutzt Webtechnik. Trotzdem kann sie in einem normalen Desktopfenster laufen. Dafür ist **Tauri** zuständig.

Tauri zeigt sie in einer **Webview** an: einem eingebetteten Browserbereich innerhalb des Programmfensters.

Der Ordner heißt `src-tauri`, weil dort der Quellcode und die Konfiguration dieser Hülle liegen. Dieser Name ist bei Tauri-Projekten üblich.

### Was macht dieser Teil bei dir?

Er startet das Python-Backend, öffnet das Fenster und übernimmt Aufgaben des Betriebssystems:

- Symbol im Infobereich neben der Uhr, auch „Tray“ genannt.
- Autostart und Systembenachrichtigungen.
- Verhindern mehrerer gleichzeitig gestarteter App-Instanzen.
- Weiterlaufen im Hintergrund, wenn du das Fenster schließt.
- Beenden des Backends beim vollständigen Beenden der App.

### Welche Dateien sind wichtig?

| Pfad | Aufgabe |
|---|---|
| `src-tauri/src/main.rs` | Einstieg des Desktopprogramms. |
| `src-tauri/src/lib.rs` | Fenster, Tray, Autostart, Benachrichtigungen und Lebenszyklus der App. |
| `src-tauri/src/backend.rs` | Start und Kommunikation mit dem Python-Prozess. |
| `src-tauri/tauri.conf.json` | Konfiguration, etwa Produktname, Symbole und Installer. |
| `src-tauri/Cargo.toml` | Beschreibung des Rust-Projekts und seiner Abhängigkeiten. |
| `src-tauri/icons/` | Programmsymbole. |

**Wichtige Besonderheit deiner App:** Das Frontend spricht normalerweise direkt über die lokale HTTP-API mit Python. Es schickt nicht jede Anfrage erst durch Rust.

Die Hülle lädt die Oberfläche vom Backend unter `127.0.0.1`. Diese Adresse bedeutet „dieser Computer“. Der **Port** ist die Nummer, unter der der Dienst erreichbar ist.

Ein zufälliger Zugriffstoken schützt die API. Er ist nicht dasselbe wie dein Archivpasswort oder Wiederherstellungsschlüssel. Poste vollständige Start-URLs mit Token nicht in Screenshots oder öffentlichen Fehlermeldungen.

## 5. Prototype: der frühere Entwurf

In `prototype/index.html` liegt ein **Klickprototyp**.

Damit konnte man früh ausprobieren: Ist die Navigation sinnvoll? Welche Informationen gehören auf eine Seite? Wie könnten Buttons und Listen aussehen?

Ein Prototyp kann wie ein fertiges Programm aussehen, ohne dessen echte Datenverarbeitung zu besitzen.

**Wenn du die heutige Oberfläche ändern möchtest, arbeite in `frontend/`, nicht in `prototype/`.** Den Prototyp kannst du als historischen Entwurf lesen.

## 6. Eine Suche durch den Code verfolgen

Am besten versteht man das Zusammenspiel an einem konkreten Weg. Nehmen wir die Suche im Bereich **Dokumente**.

### Schritt 1: Du gibst einen Suchbegriff ein

In `frontend/src/components/documents/DocumentsView.tsx` werden Suchtext und Filter verwaltet. Beim Tippen wartet die Ansicht kurz, bevor sie den Suchfilter übernimmt. So wird nicht für jeden einzelnen Tastendruck sofort eine Anfrage nötig.

### Schritt 2: Das Frontend fragt die Dokumentenliste ab

In derselben Datei findest du diesen Aufruf:

```ts
api.get<{ items: Json[]; total: number }>("/api/documents", apiParams)
```

Das bedeutet:

- Frage `/api/documents` ab.
- Schicke Suchbegriff, Filter und Angaben zur Seiteneinteilung in `apiParams` mit.
- Erwarte ein Ergebnis mit `items` für die Dokumente und `total` für die Gesamtzahl.

Der Aufruf steckt in `useQuery`. Diese Funktion aus **TanStack Query** verwaltet das Laden, Zwischenspeichern und Fehler bei Datenabfragen.

### Schritt 3: Der gemeinsame API-Helfer verschickt die Anfrage

`frontend/src/lib/api.ts` baut daraus eine HTTP-Anfrage. Er ergänzt den Zugriffstoken, benutzt `fetch` zum Senden und bereitet Fehler auf.

Du musst diesen Ablauf deshalb nicht in jeder Ansicht neu schreiben.

### Schritt 4: Python nimmt die Anfrage entgegen

In `backend/syd/api.py` findest du:

```python
@app.get("/api/documents")
def list_documents(
```

Die Funktion liest die Anfrageparameter und ruft `state.repo.list_documents(...)` auf.

### Schritt 5: Die Datenbank wird abgefragt

Die Methode `list_documents` in `backend/syd/repo.py` berücksichtigt unter anderem Suchtext, Filter und Sortierung. Für die Volltextsuche nutzt sie auch die Suchfunktion des Vaults.

### Schritt 6: Die Antwort wird angezeigt

Die Daten kommen als **JSON** zurück: strukturierte Daten mit benannten Feldern. Die Oberfläche liest daraus die Dokumente und stellt die Liste dar.

Der ganze Weg:

```text
DocumentsView.tsx
    -> lib/api.ts
    -> Python: api.py
    -> Python: repo.py / vault.py
    -> Antwort zurück zur Dokumentenansicht
```

**Zum Üben:** Öffne diese Dateien der Reihe nach und suche mit `Strg+F` nach `/api/documents` beziehungsweise `def list_documents`. Versuche zunächst nur, den Weg wiederzufinden, ohne etwas zu ändern.

## 7. Welche Datei ändere ich wofür?

| Dein Vorhaben | Guter Startpunkt |
|---|---|
| Einen Text in der Navigation ändern | `frontend/src/App.tsx` |
| Farben oder zentrale Abstände anpassen | `frontend/src/index.css` |
| Die Dokumentenliste anders darstellen | `frontend/src/components/documents/DocumentsView.tsx` |
| Eine Einstellung auf der Oberfläche ändern | `frontend/src/views/Settings.tsx`, dann die passende Komponente unter `components/settings/` |
| Die Darstellung eines Geldbetrags verstehen | `frontend/src/lib/format.ts` |
| Suchregeln oder Dokumentfilter ändern | `backend/syd/repo.py`, gegebenenfalls auch `api.py` und Frontend |
| Die Dokumentenerkennung nachvollziehen | `backend/syd/extract/pipeline.py`, danach `ocr.py` und `rules.py` |
| Verhalten beim Schließen des Fensters ändern | `src-tauri/src/lib.rs` |
| Die Programmversion ändern | Nur `version.txt`; die anderen Versionsangaben werden automatisch synchronisiert. |

Die Tabelle nennt **Startpunkte**, nicht immer alle betroffenen Dateien. Bei neuen Funktionen können Frontend, API und Datenverarbeitung zusammen geändert werden müssen.

Warum ist `views/Documents.tsx` so kurz? Manche Ansichten reichen die Arbeit an eine größere Komponente weiter. Das ist normal. Folge dann dem `import`, hier zu `components/documents/DocumentsView.tsx`.

### Welche Ordner sind nicht dein eigentlicher Quellcode?

| Ordner | Inhalt |
|---|---|
| `frontend/node_modules/` | Installierte JavaScript-Bibliotheken. |
| `backend/.venv/` | Eigene Python-Umgebung mit installierten Paketen. |
| `frontend/dist/` | Fertig gebaute Oberfläche. |
| `src-tauri/target/` | Rust-Builddateien und erzeugte Programme. |

**Ändere deinen Code in den Quelldateien, nicht in diesen Ordnern.** Änderungen an gebauten Dateien können beim nächsten Build überschrieben werden.

## 8. Das Projekt zum Lernen starten

Für Änderungen an Oberfläche und Backend brauchst du am Anfang keinen eigenen Windows-Installer. Die Browseransicht reicht meistens aus.

### Unter Windows: der einfache Einstieg

Wenn Python und Node.js installiert sind, kannst du im Projektordner in einer Eingabeaufforderung starten:

```bat
start.cmd --data-dir C:\Temp\syd-lernen --no-multicast
```

In PowerShell lautet der Aufruf:

```powershell
.\start.cmd --data-dir C:\Temp\syd-lernen --no-multicast
```

Das vorhandene Skript richtet bei Bedarf die Entwicklungsumgebung ein, baut das Frontend und startet das Backend mit Browseransicht.

`--data-dir` verwendet einen eigenen Datenordner für deine Lernversuche. Wähle bei der Einrichtung auch eine neue Test-Archivdatei und öffne nicht dein produktives Archiv. `--no-multicast` schaltet die automatische LocalSend-Erkennung per Multicast aus, **nicht den gesamten Empfangsdienst**.

Beim ersten Start werden Abhängigkeiten heruntergeladen. Falls SQLCipher aus Quellcode gebaut werden muss, sind zusätzlich Visual Studio C++ Build Tools nötig. Die genauen Voraussetzungen stehen in [ENTWICKLUNG.md](ENTWICKLUNG.md).

**Das ist kein Start mit Tauri:** Tray, Autostart und die Benachrichtigungen der Rust-Hülle kannst du so nicht prüfen.

Wenn du Quelldateien änderst, musst du bei dieser Startweise die Oberfläche erneut bauen beziehungsweise das Programm neu starten, damit die Änderungen geladen werden.

### Für häufige Frontend-Änderungen: Entwicklungsserver

Vite kann Änderungen an der Oberfläche meist direkt im Browser anzeigen. Voraussetzung: Die Abhängigkeiten sind wie in [ENTWICKLUNG.md](ENTWICKLUNG.md) eingerichtet.

**Beispiel für Linux oder einen Codespace:** Öffne zwei Terminals, jeweils im Projektordner.

Terminal 1 startet das Backend auf einem festen Port:

```bash
cd backend
.venv/bin/python -m syd.main --port 8765 --data-dir /tmp/syd-lernen --no-browser --no-multicast
```

Terminal 2 startet das Frontend:

```bash
cd frontend
npm run dev
```

Öffne die von Vite angezeigte Adresse und ergänze den Token aus der Backend-Ausgabe, zum Beispiel:

```text
http://localhost:5173/#token=DEIN_TOKEN_AUS_TERMINAL_1
```

`DEIN_TOKEN_AUS_TERMINAL_1` ist ein Platzhalter, kein gültiger Token. Falls Vite einen anderen Port anzeigt, müssen auch die erlaubten Ursprünge im Backend berücksichtigt werden; für den Einstieg sollte Port `5173` frei sein.

Vite leitet `/api`-Anfragen standardmäßig an `http://127.0.0.1:8765` weiter. Das Backend bleibt also nötig, auch wenn du nur am Frontend arbeitest.

Die Linux-Pfade `.venv/bin/python` gelten nicht für Windows. Dort liegt Python in der virtuellen Umgebung unter `.venv\Scripts\python.exe`.

**Im Codespace:** Eine weitergeleitete Browseradresse kann zusätzliche Host-/Origin-Anpassungen brauchen. Mache Ports nicht öffentlich und schalte die API-Schutzprüfungen nicht einfach ab, um eine Fehlermeldung zu umgehen.

## 9. Drei kleine Übungen zum Selbermachen

Mach die Übungen einzeln. Prüfe nach jeder Änderung das Ergebnis, bevor du die nächste beginnst.

### Übung 1: Einen Navigationstext ändern

**Ziel:** Die Verbindung zwischen einer Codezeile und der sichtbaren Oberfläche erkennen.

Öffne `frontend/src/App.tsx` und suche:

```tsx
{ id: "docs", label: "Dokumente", icon: "docs" },
```

Ändere nur den sichtbaren Text:

```tsx
{ id: "docs", label: "Meine Dokumente", icon: "docs" },
```

**Warum nur `label`?** `id` ist eine interne Kennung für die Navigation. Wenn du sie umbenennst, können andere Stellen nicht mehr passen. `label` ist die Beschriftung.

**Prüfen:** Erscheint „Meine Dokumente“ in der Navigation und öffnet der Eintrag weiterhin die Dokumentenansicht?

### Übung 2: Eine kleine Funktion lesen und testen

**Ziel:** Verstehen, wie Eingabe und Ausgabe zusammenhängen.

Öffne `frontend/src/lib/format.ts` und suche `parseEuro`. Diese Funktion wandelt einen eingegebenen Eurobetrag in Cent um.

Lies zuerst die vorhandenen Beispiele in `frontend/tests/format.test.ts`. Ergänze dann innerhalb des vorhandenen Tests für Beträge:

```ts
assert.equal(parseEuro("19,95"), 1995);
assert.equal(parseEuro("kein Betrag"), null);
```

Starte im Ordner `frontend`:

```bash
npm test
```

`assert.equal` prüft, ob das tatsächliche Ergebnis dem erwarteten Wert entspricht.

**Lernfrage für dich selbst:** Warum werden aus `19,95` genau `1995`? Welche Stelle in der Funktion lehnt einen ungültigen Text ab?

Hier musst du die Funktion noch gar nicht verändern. Auch vorhandenen Code mit eigenen Beispielen zu prüfen ist Programmierarbeit.

### Übung 3: Eine eigene kleine Funktion schreiben

**Ziel:** Eine überschaubare Logik selbst formulieren, bevor du sie in die Oberfläche einbaust.

Schreibe als lokale Lernübung eine Funktion mit diesem Vertrag:

```ts
function dokumentAnzahlText(anzahl: number): string
```

Sie soll für eine nichtnegative ganze Zahl Folgendes zurückgeben:

| Eingabe | Erwarteter Text |
|---|---|
| `0` | `Keine Dokumente` |
| `1` | `1 Dokument` |
| `5` | `5 Dokumente` |

Versuche die Umsetzung zunächst selbst mit `if` und `return`. Benutze keine Datenbank und ändere noch keine API.

Wenn du die Funktion in `frontend/src/lib/format.ts` exportierst, kannst du sie in `frontend/tests/format.test.ts` importieren und mit einem eigenen Test prüfen. Falls dir die Teststruktur noch unklar ist, orientiere dich am vorhandenen `parseEuro`-Test.

**Fertig ist die Übung, wenn alle drei Fälle stimmen und du erklären kannst, warum.** Du musst die Funktion nicht dauerhaft in die App übernehmen.

## 10. Änderungen prüfen und Fehler eingrenzen

### Ein einfacher Arbeitsablauf

1. Entscheide genau, was du ändern möchtest.
2. Finde die zuständige Datei und lies auch etwas Code davor und danach.
3. Ändere nur eine überschaubare Sache.
4. Prüfe das Ergebnis mit passenden Befehlen und in der Oberfläche.
5. Schau dir den Unterschied mit Git an.

Im Projektordner:

```bash
git status --short
git diff
```

`git status` zeigt die geänderten Dateien. `git diff` zeigt die geänderten Zeilen. Beide Befehle verändern deinen Code nicht.

### Welche Prüfungen gibt es?

Die folgenden Befehle setzen eine eingerichtete Entwicklungsumgebung voraus:

| Bereich | Befehl | Was er prüft |
|---|---|---|
| Frontend, im Ordner `frontend` | `npm run typecheck` | TypeScript-Typfehler. |
| Frontend, im Ordner `frontend` | `npm test` | Die vorhandenen automatischen Funktionstests. |
| Frontend, im Ordner `frontend` | `npm run build` | Typprüfung und Erzeugen der fertigen Oberfläche. |
| Backend, im Ordner `backend`, Linux | `.venv/bin/python -m pytest -q` | Die Backend-Tests. |
| Backend, im Ordner `backend`, Windows | `.\.venv\Scripts\python.exe -m pytest -q` | Dieselben Tests unter Windows. |
| Backend, im Ordner `backend`, Linux | `.venv/bin/ruff check .` | Bestimmte Codefehler und Verstöße gegen die Codekonventionen. |
| Backend, im Ordner `backend`, Linux | `.venv/bin/ruff format --check .` | Ob die Formatierung den Projektregeln entspricht. |
| Rust-Hülle, im Ordner `src-tauri` | `cargo check` | Ob sich der Rust-Code prüfen lässt; benötigt Tauri-Systembibliotheken und die nötigen Ressourcen. |

Für Ruff unter Windows verwendest du entsprechend `.venv\Scripts\ruff.exe`.

Du musst nicht für einen geänderten Buttontext sofort jedes Backend testen. **Prüfe passend zur Änderung.** Ein erfolgreicher Build beweist allerdings nicht, dass die Bedienung stimmt. Klicke den geänderten Ablauf zusätzlich selbst durch.

Die Frontend-Tests prüfen ausgewählte Hilfsfunktionen, nicht die komplette Oberfläche. OCR-Tests brauchen Tesseract mit den passenden Sprachdaten; ohne Tesseract werden entsprechende Tests übersprungen.

### Wenn etwas nicht funktioniert

| Beobachtung | Wo zuerst nachsehen? |
|---|---|
| Farbe oder Abstand ist falsch | Passende CSS-Regel und Komponente. |
| Die Ansicht reagiert nicht auf einen Klick | Ereignisbehandlung und Zustand der Komponente. |
| Die Oberfläche meldet „Programm im Hintergrund antwortet nicht“ | Läuft das Backend? Stimmen Port und Entwicklungsproxy? |
| Eine Anfrage wird abgelehnt | Statuscode, Token, Host/Origin und Sperrzustand des Archivs. |
| Ein gespeicherter Wert ist fachlich falsch | API, Backend-Regeln und dazugehörige Tests. |
| Nur Tray oder Autostart funktioniert nicht | Rust-Hülle und Betriebssystem, nicht nur Browseransicht. |

Im Browser öffnen `F12` beziehungsweise die Entwicklertools die Bereiche **Konsole** und **Netzwerk**. Die Konsole zeigt viele JavaScript-Fehler; im Netzwerkbereich siehst du Anfragen und Antworten. Achtung: Dort können Dokumentdaten und Zugriffstoken sichtbar sein.

Ein paar wichtige HTTP-Statuscodes deiner App: `401` bedeutet typischerweise fehlender oder falscher Token, `403` eine abgelehnte Herkunft beziehungsweise einen nicht erlaubten Host und `423`, dass das Archiv gesperrt oder noch nicht eingerichtet ist.

Lies bei Fehlermeldungen zuerst die konkrete Meldung und den genannten Dateipfad. Ändere nicht wahllos mehrere Stellen gleichzeitig.

## 11. Mit KI lernen, ohne alles abzugeben

Du kannst KI als Erklärhilfe benutzen, ohne ihr die ganze Aufgabe zu überlassen.

Hilfreiche Formulierungen:

> „Erkläre mir diese Funktion anhand einer konkreten Eingabe. Ändere noch keinen Code.“

> „Ich möchte diesen Button selbst ergänzen. Zeige mir nur die zuständigen Dateien und erkläre den Datenfluss.“

> „Gib mir einen Hinweis, aber noch keine fertige Lösung.“

> „Hier ist meine eigene Lösung. Prüfe sie auf Fehler und erkläre mir, warum etwas falsch ist.“

Ein guter Rhythmus ist: **selbst überlegen → klein umsetzen → testen → gezielt nachfragen**.

Bevor du einen Vorschlag übernimmst, solltest du ungefähr sagen können: Welche Datei ändert sich? Was war vorher anders? Warum löst die Änderung das Problem? Wie prüfe ich das?

Bei Verschlüsselung, Schlüsselverwaltung, Datenbankmigrationen und endgültigem Löschen ist besondere Vorsicht sinnvoll. Lerne Änderungen dort mit Testdaten und Sicherungen, nicht direkt am einzigen echten Archiv.

## 12. Kleine Begriffshilfe

| Begriff | Bedeutung in einfachen Worten |
|---|---|
| Quellcode | Die von Menschen bearbeiteten Programmdateien. |
| Funktion | Ein benannter Ablauf, der Eingaben verarbeiten und ein Ergebnis zurückgeben kann. |
| Variable | Ein Name für einen Wert. |
| Typ | Beschreibung, welche Art von Wert erlaubt ist, etwa Zahl oder Text. |
| Komponente | Ein Baustein der React-Oberfläche. |
| State | Der aktuelle Zustand, den sich eine Komponente oder Anwendung merkt. |
| Import / Export im Code | Funktionen oder andere Bausteine aus einer Datei benutzen beziehungsweise bereitstellen. Nicht mit dem Dokumentimport verwechseln. |
| API / Endpunkt | Schnittstelle / konkrete ansprechbare Stelle dieser Schnittstelle, etwa `/api/documents`. |
| JSON | Ein Textformat für strukturierte Daten, etwa `{"total": 3}`. |
| HTTP | Das Anfrage-Antwort-Protokoll zwischen Frontend und Backend; funktioniert auch rein lokal. |
| Token | Ein Zugriffsnachweis für die API, nicht dein Archivschlüssel. |
| Datenbank / SQL | Strukturierte Datenablage / Sprache zum Abfragen und Ändern dieser Daten. |
| Repository | Kann das Git-Projekt meinen. Im Namen `Repo` in deinem Backend meint es die Zugriffsschicht für Anwendungsdaten. |
| Abhängigkeit | Eine zusätzliche Bibliothek oder ein Werkzeug, das dein Projekt benötigt. |
| Virtuelle Umgebung | Ein eigener Bereich für die Python-Pakete dieses Projekts. |
| Build | Aus Quellcode ausführbare beziehungsweise auslieferbare Dateien erzeugen. |
| Test | Eine automatische Prüfung eines erwarteten Verhaltens. |
| Linter | Werkzeug, das bestimmte Codefehler und Regelverstöße findet. |
| Commit | Ein gespeicherter Änderungsstand in Git. |

**Dein nächster praktischer Schritt:** Fang mit Übung 1 an. Eine kleine Änderung, deren Wirkung du selbst erklären kannst, ist ein besserer Lernfortschritt als eine große Änderung, die du nur übernimmst.

Weitere Anleitungen: [Programm benutzen](ANLEITUNG.md), [Entwicklungsumgebung und Installer](ENTWICKLUNG.md), [manuelle Testanleitung](TESTEN.md).
