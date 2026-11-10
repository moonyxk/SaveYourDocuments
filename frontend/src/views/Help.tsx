import { PageHead } from "../components/ui";
import { useNav, type View } from "../lib/nav";

function GoButton({ view, children, tab }: { view: View; children: string; tab?: string }) {
  const { go } = useNav();
  return (
    <button className="btn secondary small" onClick={() => go(view, tab ? { tab } : {})}>
      {children}
    </button>
  );
}

export default function Help() {
  return (
    <div className="stack">
      <PageHead
        title="Hilfe und Anleitungen"
        lead="Hier findest du Anleitungen für den Weg vom Handyfoto bis zum geprüften Dokument und Erklärungen zu allen Bereichen."
      />

      <section className="card" aria-labelledby="help-example">
        <h2 id="help-example">Beispiel: Die Fotos eines Briefs sortieren und importieren</h2>
        <p>Du hast einen Brief mit zwei Seiten fotografiert und möchtest beide Seiten als ein Dokument ablegen.</p>
        <ol>
          <li>Öffne „Fotos sortieren“. Sende die Bilder mit LocalSend vom Handy oder wähle am Computer „Dateien auswählen“ beziehungsweise ziehe sie in das Feld.</li>
          <li>Wenn du LocalSend verwendest, bestätige zuerst die Anfrage auf dieser Seite. Die angekommenen Bilder erscheinen anschließend hier.</li>
          <li>Tippe beide Fotos an. Kontrolliere die Vorschau und fasse sie mit „Auswahl zu einem Dokument zusammenfassen“ zusammen.</li>
          <li>Prüfe die Seitenreihenfolge. Mit ‹ und › kannst du eine Seite nach vorn oder hinten schieben. Einzelne Fotos ohne Auswahl bleiben eigene Dokumente.</li>
          <li>Wenn alle Fotos sortiert sind, klicke auf „Erkennung starten“. Das Programm liest die Dokumente und zeigt sie danach unter „Prüfen“.</li>
          <li>Kontrolliere die erkannten Angaben, korrigiere sie bei Bedarf und bestätige das Dokument. Erst bestätigte Dokumente zählen für Fristen und Auswertungen.</li>
        </ol>
        <div className="row wrap">
          <GoButton view="import">Fotos sortieren öffnen</GoButton>
          <GoButton view="review">Prüfung öffnen</GoButton>
        </div>
      </section>

      <section className="card" aria-labelledby="help-localsend">
        <h2 id="help-localsend">Fotos mit LocalSend vom Handy senden</h2>
        <ol>
          <li>Stelle sicher, dass Handy und Computer im selben WLAN sind. Ein Gästenetz kann die Geräte voneinander trennen.</li>
          <li>Schalte den Empfang in „Einstellungen“ unter „Empfang vom Handy“ ein. Erlaube Save Your Documents bei einer Windows-Firewall-Abfrage den Zugriff im Heimnetz.</li>
          <li>Installiere und öffne LocalSend auf dem Handy. Wähle dort die Fotos oder PDFs aus, die du senden möchtest.</li>
          <li>Tippe in LocalSend auf den Computer „Save Your Documents“ (oder den dort eingestellten Gerätenamen).</li>
          <li>Nimm die Anfrage in Save Your Documents an. Die Dateien werden auf der Seite „Fotos sortieren“ angezeigt und können dort gruppiert werden.</li>
        </ol>
        <p className="hint">Wird der Computer nicht angezeigt? Prüfe, ob beide Geräte im selben WLAN sind, der Empfang eingeschaltet ist und das Programm läuft. Bei einer eingerichteten PIN fragt LocalSend danach.</p>
        <GoButton view="settings" tab="empfang">Empfang einstellen</GoButton>
      </section>

      <h2>Anleitungen nach Bereich</h2>
      <div className="grid-gap g2">
        <section className="card">
          <h3>Startseite</h3>
          <p>Die Startseite zeigt den Archivüberblick, anstehende Aufgaben und wichtige Hinweise. Ein leerer Bereich führt dich zu den ersten Importen.</p>
          <GoButton view="start">Startseite öffnen</GoButton>
        </section>
        <section className="card">
          <h3>Fotos sortieren</h3>
          <p>Fasse mehrere Seiten zu einem Dokument zusammen, ordne sie, sieh dir die Vorschau an oder sortiere ein Foto aus. Aussortierte Dateien werden nicht gelöscht.</p>
          <GoButton view="import">Fotos sortieren öffnen</GoButton>
        </section>
        <section className="card">
          <h3>Dokumente prüfen</h3>
          <p>Prüfe Firma, Dokumentart, Datum, Betrag und Fristen. Ändere falsche Angaben und bestätige nur, was stimmt.</p>
          <GoButton view="review">Prüfung öffnen</GoButton>
        </section>
        <section className="card">
          <h3>Dokumente finden</h3>
          <p>Suche oben nach Firma, Betrag oder Stichwort aus dem erkannten Text. Unter „Dokumente“ kannst du die Treffer weiter filtern und öffnen.</p>
          <GoButton view="docs">Dokumente öffnen</GoButton>
        </section>
        <section className="card">
          <h3>Fristen</h3>
          <p>Sieh offene, überfällige und erledigte Fristen an. Erinnerungen zu erkannten Dokumenten beginnen erst nach der Bestätigung.</p>
          <GoButton view="fristen">Fristen öffnen</GoButton>
        </section>
        <section className="card">
          <h3>Auswertung</h3>
          <p>Die Auswertung fasst deine bestätigten Dokumente und erkannten Beträge zusammen. Ungeprüfte Angaben fließen nicht in die Übersicht ein.</p>
          <GoButton view="stats">Auswertung öffnen</GoButton>
        </section>
        <section className="card">
          <h3>Exportieren</h3>
          <p>Nutze den Export, wenn du ausgewählte Archivdaten außerhalb des Programms weiterverwenden möchtest. Prüfe vor dem Speichern den gewählten Umfang.</p>
          <GoButton view="export">Export öffnen</GoButton>
        </section>
        <section className="card">
          <h3>Einstellungen und Sicherung</h3>
          <p>Hier stellst du unter anderem Anzeige, Empfang und Archivschutz ein. Für eine Sicherung bei laufendem Programm nutze „Jetzt sichern“.</p>
          <div className="row wrap">
            <GoButton view="settings">Einstellungen öffnen</GoButton>
            <GoButton view="settings" tab="sicherung">Sicherung ansehen</GoButton>
          </div>
        </section>
      </div>
    </div>
  );
}
