import { TUTORIALS, type TutorialGuide } from "../components/Tutorial";
import { PageHead } from "../components/ui";

export default function Help({ onStart }: { onStart: (guide: TutorialGuide) => void }) {
  return (
    <div className="stack">
      <PageHead
        title="Hilfe und Tutorials"
        lead="Wähle ein Thema. Die geführte Tour zeigt dir die passende Seite und erklärt sie Schritt für Schritt – wie beim ersten Start."
      />
      <p className="muted">
        Mit „Weiter“ und „Zurück“ bestimmst du das Tempo. Mit „Überspringen“ oder Esc kommst du zurück zur Hilfe.
        Die Tutorials verändern keine Dokumente oder Einstellungen.
      </p>
      <div className="grid-gap g2">
        {TUTORIALS.map((guide) => (
          <section className="card" key={guide.id} aria-labelledby={`help-${guide.id}`}>
            <h2 id={`help-${guide.id}`}>{guide.title}</h2>
            <p>{guide.description}</p>
            <div className="row spread wrap">
              <span className="muted">{guide.steps.length} Schritte</span>
              <button
                className="btn secondary small"
                aria-label={`${guide.title}: Tutorial starten`}
                onClick={() => onStart(guide)}
              >
                Tutorial starten
              </button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
