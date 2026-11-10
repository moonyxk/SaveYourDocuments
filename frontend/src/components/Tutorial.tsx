import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { NavParams, View } from "../lib/nav";

type Place = "right" | "bottom" | "left" | "top" | "center";
type Step = {
  title: string;
  text: string;
  tip?: string;
  view: View;
  params?: NavParams;
  target?: string; // Wert von data-tour
  place: Place;
  art?: "flow";
};

const STEPS: Step[] = [
  {
    title: "Willkommen!",
    text: "Hier sammelst du deine wichtigen Papiere an einem Ort: Rechnungen, Verträge, Briefe vom Amt. Alles bleibt verschlüsselt auf diesem Computer.",
    tip: "Die Tour dauert eine Minute. Mit der Esc-Taste kannst du sie jederzeit beenden.",
    view: "start",
    place: "center",
    art: "flow",
  },
  {
    title: "Hier fängt alles an: Fotos sortieren",
    text: "Fotografiere ein Dokument mit dem Handy und sende es per LocalSend an diesen Computer. Oder ziehe Fotos und PDFs einfach in das große Feld auf dieser Seite.",
    tip: "Mehrere Fotos, die zusammengehören (etwa Seiten eines Briefs), fasst du hier zu einem Dokument zusammen.",
    view: "import",
    target: "nav-import",
    place: "right",
  },
  {
    title: "Das Programm liest mit",
    text: "Nach dem Sortieren erkennt das Programm Firma, Datum, Betrag und Art des Dokuments. Unter „Prüfen“ siehst du das Ergebnis.",
    tip: "Stimmt alles, bestätigst du mit einem Klick. Stimmt etwas nicht, tippst du es kurz um.",
    view: "review",
    target: "nav-review",
    place: "right",
  },
  {
    title: "Dokumente wiederfinden",
    text: "Alles liegt geordnet unter „Dokumente“. Du kannst nach Firma, Jahr oder Art filtern und jedes Dokument öffnen.",
    view: "docs",
    target: "nav-docs",
    place: "right",
  },
  {
    title: "Schnell suchen",
    text: "Tippe oben eine Firma, einen Betrag oder ein Wort aus dem Brief ein. Das Programm sucht im gelesenen Text aller Dokumente.",
    tip: "Beispiel: „Telekom“ oder „Kündigung“.",
    view: "docs",
    target: "search",
    place: "bottom",
  },
  {
    title: "Keine Frist verpassen",
    text: "Erkennt das Programm eine Frist, etwa eine Zahlungsfrist oder ein Vertragsende, steht sie unter „Fristen“. Du bekommst rechtzeitig eine Erinnerung.",
    view: "fristen",
    target: "nav-fristen",
    place: "right",
  },
  {
    title: "Sicherung nicht vergessen",
    text: "In den Einstellungen legst du eine Sicherung auf einem USB-Stick oder einer externen Festplatte an. Bewahre auch deinen Wiederherstellungsschlüssel sicher auf.",
    view: "settings",
    target: "nav-settings",
    place: "right",
  },
  {
    title: "Anleitungen gibt es immer",
    text: "Über „Hilfe“ oben rechts findest du ausführliche Schritt-für-Schritt-Anleitungen zum Importieren, Sortieren und zu allen weiteren Funktionen.",
    view: "help",
    place: "center",
  },
];

export type TutorialGuide = {
  id: string;
  title: string;
  description: string;
  steps: Step[];
};

export const TUTORIALS: TutorialGuide[] = [
  {
    id: "introduction",
    title: "Einführung",
    description: "Die Tour vom ersten Start noch einmal ansehen.",
    steps: STEPS,
  },
  {
    id: "import",
    title: "Fotos sortieren und importieren",
    description: "Ein Beispiel durchgehen: zwei Briefseiten und eine Rechnung als zwei Dokumente ablegen.",
    steps: [
      {
        title: "Beispiel: drei Fotos, zwei Dokumente",
        text: "Stell dir vor, du hast drei Fotos: zwei Seiten eines Briefs und eine einzelne Rechnung. Wir gehen ihre Ablage Schritt für Schritt durch.",
        tip: "Diese Tour erklärt den Ablauf. Sie lädt keine Dateien hoch und verändert dein Archiv nicht.",
        view: "import", target: "nav-import", place: "right",
      },
      {
        title: "Fotos vom Computer auswählen",
        text: "Mit „Dateien auswählen“ wählst du die drei Bilder aus. Alternativ ziehst du sie in dieses Feld. Nach dem Hochladen erscheinen sie darunter zum Sortieren.",
        view: "import", target: "import-upload", place: "bottom",
      },
      {
        title: "Die beiden Briefseiten zusammenfassen",
        text: "Wähle die beiden Fotos des Briefs aus und klicke auf „Auswahl zu einem Dokument zusammenfassen“. Die Rechnung gehört nicht in diese Auswahl.",
        tip: "Mit „Ansehen“ kannst du ein Foto vor dem Zuordnen vergrößern.",
        view: "import", target: "nav-import", place: "right",
      },
      {
        title: "Reihenfolge und einzelne Rechnung",
        text: "Prüfe die Reihenfolge der Briefseiten und ändere sie bei Bedarf mit den Pfeilen. Für die Rechnung wählst du „Alle übrigen einzeln lassen“. Jetzt sind zwei Dokumente bereit.",
        tip: "Eine falsche Gruppe kannst du mit „Auflösen“ rückgängig machen. Aussortierte Fotos werden archiviert, nicht gelöscht.",
        view: "import", target: "nav-import", place: "right",
      },
      {
        title: "Erkennung starten",
        text: "Sobald alle Fotos zugeordnet oder aussortiert sind, wird „Erkennung starten“ aktiv. Nach dem Klick liest das Programm beide Dokumente im Hintergrund.",
        view: "import", target: "nav-import", place: "right",
      },
      {
        title: "Den Brief und die Rechnung prüfen",
        text: "Unter „Prüfen“ kontrollierst du die erkannten Angaben für jedes Dokument und bestätigst sie. Danach findest du beide unter „Dokumente“; bestätigte Fristen und Beträge erscheinen auch in Fristen und Auswertung.",
        view: "review", target: "nav-review", place: "right",
      },
    ],
  },
  {
    id: "localsend",
    title: "LocalSend auf dem Handy",
    description: "LocalSend einrichten, Fotos senden und die Anfrage am Computer annehmen.",
    steps: [
      {
        title: "Handy und Computer vorbereiten",
        text: "Verbinde beide Geräte mit demselben WLAN. Installiere auf dem Handy die kostenlose App LocalSend aus deinem App-Store und öffne sie.",
        tip: "Ein Gästenetz trennt Geräte häufig voneinander. Verwende dann dein normales Heimnetz.",
        view: "settings", params: { tab: "empfang" }, target: "settings-empfang", place: "right",
      },
      {
        title: "Den Empfang am Computer prüfen",
        text: "Hier schaltest du den Empfang ein und siehst den Gerätenamen, nach dem du auf dem Handy suchst. Prüfe bei Problemen auch die Windows-Firewall-Freigabe für dein Heimnetz.",
        view: "settings", params: { tab: "empfang" }, target: "settings-empfang", place: "right",
      },
      {
        title: "Fotos in LocalSend senden",
        text: "Wähle auf dem Handy in LocalSend die Fotos oder PDFs zum Senden aus. Tippe auf den hier eingestellten Computernamen, normalerweise „Save Your Documents“.",
        tip: "Falls eine PIN eingerichtet ist, gib sie auf dem Handy ein.",
        view: "settings", params: { tab: "empfang" }, target: "settings-empfang", place: "right",
      },
      {
        title: "Anfrage annehmen und Fotos sortieren",
        text: "Unter „Fotos sortieren“ erscheint die Sendeanfrage. Nimm sie an, wenn du den Absender kennst. Nach der Übertragung kannst du die angekommenen Seiten zu Dokumenten zusammenfassen.",
        tip: "Bei bereits vertrauten Geräten oder automatischer Annahme entfällt die manuelle Bestätigung.",
        view: "import", target: "nav-import", place: "right",
      },
    ],
  },
  {
    id: "start",
    title: "Startseite",
    description: "Den Überblick, offene Aufgaben und Erinnerungen verstehen.",
    steps: [
      {
        title: "Dein Überblick",
        text: "Die Startseite fasst dein Archiv zusammen und zeigt wichtige Hinweise. Bei einem leeren Archiv erklärt sie die ersten Schritte.",
        view: "start", target: "nav-start", place: "right",
      },
      {
        title: "Offene Aufgaben zuerst",
        text: "Achte auf wartende Fotos, Dokumente zur Prüfung und anstehende Fristen. Die Hinweise führen dich zu der jeweiligen Aufgabe.",
        view: "start", target: "nav-start", place: "right",
      },
      {
        title: "Schnell ein Dokument suchen",
        text: "Über die Suche oben findest du eine Firma, einen Betrag oder ein Stichwort. Nach dem Absenden werden die Treffer unter „Dokumente“ angezeigt.",
        view: "start", target: "search", place: "bottom",
      },
    ],
  },
  {
    id: "review",
    title: "Dokumente prüfen",
    description: "Erkannte Angaben vergleichen, korrigieren und bestätigen.",
    steps: [
      {
        title: "Erkannte Dokumente kontrollieren",
        text: "Nach dem Import erscheinen hier die fertig erkannten Dokumente. Wenn nichts wartet, siehst du „Alles geprüft“.",
        view: "review", target: "nav-review", place: "right",
      },
      {
        title: "Original und Angaben vergleichen",
        text: "Vergleiche das angezeigte Dokument mit Firma, Dokumentart, Datum, Betrag und Fristen im Formular. Korrigiere falsche oder fehlende Angaben.",
        tip: "Die automatische Erkennung kann Fehler machen. Prüfe besonders Beträge und Fristdaten.",
        view: "review", target: "nav-review", place: "right",
      },
      {
        title: "Bestätigen, wenn alles stimmt",
        text: "Bestätige die Angaben und gehe zum nächsten Dokument. Erst geprüfte Dokumente zählen für Fristen und Auswertungen.",
        view: "review", target: "nav-review", place: "right",
      },
    ],
  },
  {
    id: "docs",
    title: "Dokumente finden",
    description: "Suchen, filtern und archivierte Dokumente wiederfinden.",
    steps: [
      {
        title: "Im Archiv suchen",
        text: "Gib oben eine Firma, einen Betrag oder ein Wort aus einem Dokument ein und bestätige mit Enter. Gesucht wird auch im erkannten Text.",
        view: "docs", target: "search", place: "bottom",
      },
      {
        title: "Treffer eingrenzen und öffnen",
        text: "Nutze die Filter unter „Dokumente“, etwa für Firma, Jahr oder Dokumentart. Öffne anschließend einen Treffer, um Original und Angaben anzusehen.",
        view: "docs", target: "nav-docs", place: "right",
      },
      {
        title: "Archivierte Dokumente finden",
        text: "Ein archiviertes Dokument ist nicht gelöscht. Ändere den Archivfilter, um auch archivierte Dokumente oder aussortierte Dateien zu sehen.",
        view: "docs", target: "nav-docs", place: "right",
      },
    ],
  },
  {
    id: "fristen",
    title: "Fristen",
    description: "Offene Fristen verfolgen und Erinnerungen verwalten.",
    steps: [
      {
        title: "Zahlungen und Kündigungen im Blick",
        text: "Hier stehen Fristen in zeitlicher Reihenfolge. Fristen aus erkannten Dokumenten werden erst nach deiner Prüfung übernommen.",
        view: "fristen", target: "nav-fristen", place: "right",
      },
      {
        title: "Fristen eingrenzen",
        text: "Wähle beispielsweise offene, überfällige oder erledigte Fristen und grenze den Zeitraum ein. Öffne das zugehörige Dokument, wenn du etwas nachlesen möchtest.",
        view: "fristen", target: "nav-fristen", place: "right",
      },
      {
        title: "Erinnerungen und erledigte Aufgaben",
        text: "Markiere eine erledigte Aufgabe entsprechend oder verschiebe eine Erinnerung bei Bedarf. Erinnerungen erscheinen auf der Startseite und als Benachrichtigung.",
        view: "fristen", target: "nav-fristen", place: "right",
      },
    ],
  },
  {
    id: "stats",
    title: "Auswertung",
    description: "Bestätigte Beträge und Dokumente auswerten.",
    steps: [
      {
        title: "Deine bestätigten Daten",
        text: "Die Auswertung fasst die geprüften Dokumente zusammen. Ungeprüfte Angaben werden nicht mitgerechnet.",
        view: "stats", target: "nav-stats", place: "right",
      },
      {
        title: "Den passenden Zeitraum wählen",
        text: "Grenze die Auswertung mit den angebotenen Filtern ein. Fehlt ein Betrag, prüfe zuerst, ob das Dokument bestätigt ist und zu den Filtern passt.",
        view: "stats", target: "nav-stats", place: "right",
      },
    ],
  },
  {
    id: "export",
    title: "Exportieren",
    description: "Den Umfang auswählen und Dokumente außerhalb des Archivs verwenden.",
    steps: [
      {
        title: "Daten für die Weitergabe auswählen",
        text: "Wähle im Export aus, welche Dokumente und Angaben du außerhalb des Programms verwenden möchtest. Prüfe den Umfang und das angebotene Format.",
        view: "export", target: "nav-export", place: "right",
      },
      {
        title: "Export sicher aufbewahren",
        text: "Starte den Export und speichere die Datei an einem passenden Ort. Exportierte Dateien liegen außerhalb des verschlüsselten Archivs; gib sie nur bewusst weiter.",
        tip: "Für eine Sicherung deines gesamten Archivs verwende stattdessen „Sicherung und Speicher“ in den Einstellungen.",
        view: "export", target: "nav-export", place: "right",
      },
    ],
  },
  {
    id: "settings",
    title: "Einstellungen",
    description: "Anzeige, Empfang, Sicherheit und Erkennung einstellen.",
    steps: [
      {
        title: "Anzeige anpassen",
        text: "Unter „Anzeige“ passt du die Darstellung an. Änderungen werden sofort gespeichert.",
        view: "settings", params: { tab: "anzeige" }, target: "settings-anzeige", place: "right",
      },
      {
        title: "Empfang und Sicherheit",
        text: "Unter „Empfang vom Handy“ konfigurierst du LocalSend. Unter „Sicherheit“ findest du die Optionen für den Schutz deines Archivs.",
        view: "settings", params: { tab: "sicherheit" }, target: "settings-sicherheit", place: "right",
      },
      {
        title: "Erkennung und Diagnose",
        text: "Unter „Erkennung“ stellst du die Dokumenterkennung ein. Das „Protokoll“ hilft dir, Fehler nachzuvollziehen.",
        view: "settings", params: { tab: "erkennung" }, target: "settings-erkennung", place: "right",
      },
    ],
  },
  {
    id: "backup",
    title: "Sicherung und Speicher",
    description: "Eine sichere Archivkopie erstellen und den Speicher prüfen.",
    steps: [
      {
        title: "Das ganze Archiv sichern",
        text: "Hier siehst du den Speicherort des Archivs und deine Sicherungen. Wähle einen Sicherungsordner, möglichst auf einem anderen Datenträger.",
        view: "settings", params: { tab: "sicherung" }, target: "settings-sicherung", place: "right",
      },
      {
        title: "Jetzt sichern",
        text: "Mit „Jetzt sichern“ erstellst du eine aktuelle Kopie. Kopiere die geöffnete Archivdatei nicht direkt: Dabei können aktuelle Änderungen fehlen.",
        tip: "Bewahre auch deinen Wiederherstellungsschlüssel sicher und getrennt auf.",
        view: "settings", params: { tab: "sicherung" }, target: "settings-sicherung", place: "right",
      },
    ],
  },
];

type Box = { x: number; y: number; w: number; h: number };
const PAD = 8;
const CARD_W = 380;

function measure(sel?: string): Box | null {
  if (!sel) return null;
  const el = document.querySelector<HTMLElement>(`[data-tour="${sel}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (!r.width || !r.height) return null;
  return { x: r.left - PAD, y: r.top - PAD, w: r.width + PAD * 2, h: r.height + PAD * 2 };
}

function cardPos(box: Box | null, place: Place, cardH: number): { left: number; top: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const w = Math.min(CARD_W, vw - 32);
  if (!box || place === "center") return { left: (vw - w) / 2, top: Math.max(16, (vh - cardH) / 2) };
  let left = box.x + box.w + 20;
  let top = box.y - 12;
  if (place === "bottom") {
    left = box.x + box.w / 2 - w / 2;
    top = box.y + box.h + 20;
  } else if (place === "left") {
    left = box.x - w - 20;
  } else if (place === "top") {
    left = box.x + box.w / 2 - w / 2;
    top = box.y - cardH - 20;
  }
  return { left: clamp(left, 16, vw - w - 16), top: clamp(top, 16, vh - cardH - 16) };
}

function FlowArt() {
  const items = [
    ["📷", "Foto"],
    ["🔎", "Lesen"],
    ["🗂️", "Archiv"],
  ];
  return (
    <div className="tour-flow" aria-hidden="true">
      {items.map(([icon, label], i) => (
        <div className="tour-flow-item" key={label} style={{ animationDelay: `${i * 0.35}s` }}>
          <span className="tour-flow-icon">{icon}</span>
          <span>{label}</span>
          {i < items.length - 1 ? <i className="tour-flow-arrow" style={{ animationDelay: `${i * 0.35 + 0.2}s` }} /> : null}
        </div>
      ))}
    </div>
  );
}

export function Tutorial({ guide, onGo, onClose }: {
  guide?: TutorialGuide;
  onGo: (v: View, params?: NavParams) => void;
  onClose: () => void;
}) {
  const steps = guide?.steps ?? STEPS;
  const [i, setI] = useState(0);
  const [box, setBox] = useState<Box | null>(null);
  const [cardH, setCardH] = useState(260);
  const cardRef = useRef<HTMLDivElement>(null);
  const step = steps[i];
  const last = i === steps.length - 1;

  const update = useCallback(() => {
    setBox(measure(steps[i].target));
    if (cardRef.current) setCardH(cardRef.current.offsetHeight);
  }, [i, steps]);

  useLayoutEffect(() => {
    onGo(step.view, step.params);
    // Die Ansicht rendert erst nach dem Wechsel; danach neu messen.
    update();
    const t = window.setTimeout(update, 120);
    return () => window.clearTimeout(t);
  }, [step, onGo, update]);

  useEffect(() => {
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [update]);

  const next = useCallback(() => (last ? onClose() : setI((n) => n + 1)), [last, onClose]);
  const back = useCallback(() => setI((n) => Math.max(0, n - 1)), []);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        if (e.key === "ArrowRight") next();
        else back();
      } else if (e.key === "Tab" && cardRef.current) {
        const buttons = [...cardRef.current.querySelectorAll<HTMLButtonElement>("button")];
        const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
        if (index === -1 || (e.shiftKey && index === 0) || (!e.shiftKey && index === buttons.length - 1)) {
          e.preventDefault();
          buttons[e.shiftKey ? buttons.length - 1 : 0]?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [next, back, onClose]);

  const pos = cardPos(box, step.place, cardH);
  const arrow = box && step.place !== "center" ? step.place : null;

  return (
    <div className="tour" role="dialog" aria-modal="true" aria-label={guide ? `Tutorial: ${guide.title}` : "Kurze Tour durch das Programm"}>
      <div className="tour-block" />
      {box ? (
        <div className="tour-spot" style={{ left: box.x, top: box.y, width: box.w, height: box.h }} />
      ) : (
        <div className="tour-dim" />
      )}
      <div
        ref={cardRef}
        key={i}
        className={`tour-card ${arrow ? `arrow-${arrow}` : ""}`}
        style={{ left: pos.left, top: pos.top, width: Math.min(CARD_W, window.innerWidth - 32) }}
      >
        <div className="tour-steps" aria-hidden="true">
          {steps.map((_, n) => (
            <span key={n} className={n === i ? "on" : n < i ? "done" : ""} />
          ))}
        </div>
        {step.art === "flow" ? <FlowArt /> : null}
        <h2>{step.title}</h2>
        <p>{step.text}</p>
        {step.tip ? <p className="tour-tip">💡 {step.tip}</p> : null}
        <div className="tour-actions">
          <span className="muted" aria-live="polite">
            {i + 1} von {steps.length}
          </span>
          <span style={{ flex: 1 }} />
          {last ? null : (
            <button className="btn ghost small" onClick={onClose}>
              Überspringen
            </button>
          )}
          {i > 0 ? (
            <button className="btn secondary small" onClick={back}>
              Zurück
            </button>
          ) : null}
          <button className="btn primary small" onClick={next} autoFocus>
            {last ? "Fertig" : i === 0 ? "Los geht’s" : "Weiter"}
          </button>
        </div>
      </div>
    </div>
  );
}
