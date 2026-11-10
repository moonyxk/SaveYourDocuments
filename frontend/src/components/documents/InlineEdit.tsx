import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ApiError, errorText } from "../../lib/api";

/** Eine Zeile "Bezeichnung / Wert / Aendern" mit eigenem Entwurf, damit Neuladen nichts ueberschreibt. */
export default function InlineEdit<T>({
  label,
  view,
  initial,
  editor,
  save,
}: {
  label: string;
  view: ReactNode;
  initial: T;
  editor: (draft: T, set: (v: T) => void, id: string) => ReactNode;
  save: (draft: T) => Promise<unknown>;
}) {
  const id = useId();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<T>(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const el = formRef.current;
    if (!editing || !el) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setEditing(false);
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [editing]);

  const submit = async () => {
    setBusy(true);
    setErr("");
    try {
      await save(draft);
      setEditing(false);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : errorText(e));
    } finally {
      setBusy(false);
    }
  };

  if (!editing) {
    return (
      <div>
        <dt>{label}</dt>
        <dd>{view}</dd>
        <dd>
          <button
            className="btn ghost small"
            aria-label={`${label} ändern`}
            onClick={() => {
              setDraft(initial);
              setErr("");
              setEditing(true);
            }}
          >
            Ändern
          </button>
        </dd>
      </div>
    );
  }
  return (
    <div>
      <dt>{label}</dt>
      <dd className="edit">
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <label className="sr" htmlFor={id}>
            {label}
          </label>
          {editor(draft, setDraft, id)}
          {err ? (
            <div className="hint err" role="alert">
              {err}
            </div>
          ) : null}
          <div className="row" style={{ marginTop: "0.5rem" }}>
            <button className="btn primary small" type="submit" disabled={busy}>
              {busy ? "Wird gespeichert …" : "Speichern"}
            </button>
            <button className="btn ghost small" type="button" onClick={() => setEditing(false)}>
              Abbrechen
            </button>
          </div>
        </form>
      </dd>
    </div>
  );
}
