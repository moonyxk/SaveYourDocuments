import os

import pytest
import sqlcipher3

from syd.vault import (
    MIGRATIONS,
    Vault,
    VaultMissingError,
    WrongKeyError,
    _apply_key,
    format_recovery_key,
    generate_key,
    parse_recovery_key,
)


@pytest.fixture
def path(tmp_path):
    return tmp_path / "archiv.syd"


def test_file_is_encrypted_and_wrong_key_rejected(path):
    key = generate_key()
    with Vault.open(path, key, create=True) as v:
        v.add_document("brief.jpg", "image/jpeg", [b"GEHEIM" * 100])
    raw = path.read_bytes()
    assert b"SQLite format 3" not in raw[:16]
    assert b"GEHEIM" not in raw
    with pytest.raises(WrongKeyError):
        Vault.open(path, generate_key())
    with pytest.raises(WrongKeyError):
        Vault.open(path, "falsches passwort")
    with Vault.open(path, key) as v:
        assert v.get_document(1)["original_name"] == "brief.jpg"


def test_missing_file_does_not_create_empty_archive(path):
    with pytest.raises(VaultMissingError):
        Vault.open(path, generate_key())
    assert not path.exists()


def test_existing_empty_file_is_not_initialized_as_an_archive(path):
    path.touch()
    with pytest.raises(WrongKeyError):
        Vault.open(path, generate_key())
    assert path.stat().st_size == 0


def test_fts5_search_german_and_archive_filter(path):
    with Vault.open(path, generate_key(), create=True) as v:
        a, _ = v.add_document("a.pdf", "application/pdf", [b"a"])
        b, _ = v.add_document("b.pdf", "application/pdf", [b"b"])
        v.index_text(a, 1, "Haftpflichtversicherung Beitragsrechnung für Müller")
        v.index_text(b, 1, "Kaufbeleg Waschmaschine")
        assert v.search("haftpflicht") == [a]
        assert v.search("muller") == [a]  # Diakritika werden ignoriert
        assert v.search("Waschmaschine kauf") == [b]
        assert v.search('" OR 1=1 --') == []  # kein FTS-Syntax durchreichen
        v.archive(a, "Testdaten")
        assert v.search("haftpflicht") == []
        assert v.search("haftpflicht", include_archived=True) == [a]
        v.restore(a)
        assert v.search("haftpflicht") == [a]


def test_blob_roundtrip_and_incremental_stream(path):
    data = os.urandom(3 * 1024 * 1024 + 17)
    with Vault.open(path, generate_key(), create=True) as v:
        doc, dup = v.add_document("foto.jpg", "image/jpeg", [data, b"seite2"])
        assert not dup
        chunks = list(v.stream_page(doc, 1, chunk=1024 * 1024))
        assert len(chunks) == 4 and max(map(len, chunks)) <= 1024 * 1024
        assert b"".join(chunks) == data
        assert v.read_page(doc, 2) == b"seite2"
        assert v.integrity_check()


def test_hash_dedup(path):
    with Vault.open(path, generate_key(), create=True) as v:
        first, dup1 = v.add_document("x.jpg", "image/jpeg", [b"same"])
        second, dup2 = v.add_document("y.jpg", "image/jpeg", [b"same"])
        assert (dup1, dup2) == (False, True) and first == second


def test_never_delete(path):
    with Vault.open(path, generate_key(), create=True) as v:
        doc, _ = v.add_document("x.jpg", "image/jpeg", [b"x"])
        with pytest.raises(sqlcipher3.DatabaseError, match="zuerst in den Papierkorb"):
            v._conn.execute("DELETE FROM document WHERE id = ?", (doc,))
        with pytest.raises(sqlcipher3.DatabaseError, match="nur aus dem Papierkorb"):
            v._conn.execute("DELETE FROM blob_store WHERE document_id = ?", (doc,))
        with pytest.raises(ValueError):
            v.archive(doc, "  ")
        v.archive(doc, "Fehlimport")
        d = v.get_document(doc)
        assert d["archived"] == 1 and d["archive_reason"] == "Fehlimport"


def test_trash_hides_search_results_and_restores_previous_archive_state(path):
    with Vault.open(path, generate_key(), create=True) as v:
        active, _ = v.add_document("aktiv.pdf", "application/pdf", [b"active"])
        archived, _ = v.add_document("archiv.pdf", "application/pdf", [b"archived"])
        v.index_text(active, 1, "Suchbarer Brief")
        v.archive(archived, "Vertrag beendet")

        v.trash(active)
        assert v.get_document(active)["deleted"] == 1
        assert v.get_document(active)["deleted_at"]
        assert v.search("suchbarer") == []
        assert v.search("suchbarer", include_archived=True, include_deleted=True) == [active]
        v.restore_from_trash(active)
        assert v.get_document(active)["deleted"] == 0
        assert v.search("suchbarer") == [active]

        v.trash(archived)
        v.restore_from_trash(archived)
        restored = v.get_document(archived)
        assert restored["deleted"] == 0
        assert restored["archived"] == 1
        assert restored["archive_reason"] == "Vertrag beendet"


def test_purge_removes_document_data_and_keeps_id_only_audit(path):
    with Vault.open(path, generate_key(), create=True) as v:
        doc, _ = v.add_document("vertrag.pdf", "application/pdf", [b"secret original"])
        other, _ = v.add_document("other.pdf", "application/pdf", [b"other"])
        v.index_text(doc, 1, "secret OCR text")
        v.execute(
            "INSERT INTO thumbnail (document_id, page, image) VALUES (?,?,?)", (doc, 1, b"thumb")
        )
        v.execute("INSERT INTO tag (name) VALUES (?)", ("zuordnung",))
        tag = v.scalar("SELECT id FROM tag WHERE name = ?", ("zuordnung",))
        v.execute("INSERT INTO document_tag (document_id, tag_id) VALUES (?,?)", (doc, tag))
        v.execute(
            "INSERT INTO extraction (document_id, run_id, field, value, confidence, source)"
            " VALUES (?,?,?,?,?,?)",
            (doc, "run", "doc_type", "Vertrag", 0.9, "regex"),
        )
        v.execute(
            "INSERT INTO reference_number (document_id, type, value, value_norm, source)"
            " VALUES (?,?,?,?,?)",
            (doc, "vertragsnummer", "abc", "ABC", "manuell"),
        )
        v.execute(
            "INSERT INTO field_history (document_id, field, old, new, changed_at)"
            " VALUES (?,?,?,?,?)",
            (doc, "note", None, "secret note", "2026-01-01T00:00:00Z"),
        )
        v.execute(
            "INSERT INTO import_batch (source, received_at) VALUES ('upload', '2026-01-01T00:00:00Z')"
        )
        batch = v.scalar("SELECT last_insert_rowid()")
        v.execute(
            "INSERT INTO import_file (batch_id, name, path, size, sha256, mime, state, document_id)"
            " VALUES (?,?,?,?,?,?,?,?)",
            (
                batch,
                "vertrag.pdf",
                "staging/file",
                1,
                "hash",
                "application/pdf",
                "uebernommen",
                doc,
            ),
        )
        v.execute(
            "INSERT INTO deadline (document_id, type, due_date, source, created_at)"
            " VALUES (?,?,?,?,?)",
            (doc, "vertragsende", "2027-01-01", "manuell", "2026-01-01T00:00:00Z"),
        )
        parent = v.scalar("SELECT last_insert_rowid()")
        v.execute(
            "INSERT INTO deadline (document_id, type, due_date, source, parent_id, created_at)"
            " VALUES (?,?,?,?,?,?)",
            (doc, "vertragsende", "2028-01-01", "manuell", parent, "2026-01-01T00:00:00Z"),
        )
        child = v.scalar("SELECT last_insert_rowid()")
        v.execute(
            "INSERT INTO reminder (deadline_id, lead_days, due_on) VALUES (?,?,?)",
            (child, 7, "2027-12-25"),
        )
        v.execute(
            "INSERT INTO document_link (from_id, to_id, type, created_at) VALUES (?,?,?,?)",
            (doc, other, "gehoert_zu", "2026-01-01T00:00:00Z"),
        )
        v.execute(
            "INSERT INTO job (document_id, kind, created_at, updated_at) VALUES (?,?,?,?)",
            (doc, "process", "2026-01-01T00:00:00Z", "2026-01-01T00:00:00Z"),
        )

        v.trash(doc)
        assert v.purge(doc) is True
        assert v.scalar("SELECT count(*) FROM document WHERE id = ?", (doc,)) == 0
        document_tables = (
            "blob_store",
            "thumbnail",
            "ocr_fts",
            "document_tag",
            "extraction",
            "reference_number",
            "field_history",
            "ocr_text",
            "deadline",
            "job",
            "import_file",
        )
        for table in document_tables:
            assert v.scalar(f"SELECT count(*) FROM {table} WHERE document_id = ?", (doc,)) == 0, (
                table
            )
        assert v.scalar("SELECT count(*) FROM reminder WHERE deadline_id = ?", (child,)) == 0
        assert (
            v.scalar(
                "SELECT count(*) FROM document_link WHERE from_id = ? OR to_id = ?",
                (doc, doc),
            )
            == 0
        )
        assert v.scalar("SELECT count(*) FROM document WHERE id = ?", (other,)) == 1
        assert v.scalar("SELECT count(*) FROM tag WHERE id = ?", (tag,)) == 1
        audit = v.rows("SELECT event, document_id FROM audit_log WHERE document_id = ?", (doc,))
        assert [row["event"] for row in audit][-2:] == ["document.trashed", "document.purged"]
        assert v.scalar("SELECT id FROM purged_document WHERE id = ?", (doc,)) == doc
        assert v.scalar("PRAGMA secure_delete") == 1
        v.trash(other)
        assert v.purge(other) is True
        following, _ = v.add_document("following.pdf", "application/pdf", [b"new"])
        assert following > other
        assert v.integrity_check()


def test_audit_log_ids_only_and_append_only(path):
    with Vault.open(path, generate_key(), create=True) as v:
        doc, _ = v.add_document("Firma GmbH 49,99.pdf", "application/pdf", [b"x"])
        v.set_state(doc, "erkannt")
        v.audit("device.accepted", device_id=3, batch_id=1)
        with pytest.raises(TypeError):
            v.audit("document.corrected", document_id="Telekom GmbH")
        with pytest.raises(ValueError):
            v.audit("document.corrected", document_id=doc, field="Betrag 49,99")
        rows = v.audit_day(v._conn.execute("SELECT day FROM audit_log").fetchone()[0])
        assert [r["event"] for r in rows] == [
            "document.imported",
            "document.state_changed",
            "device.accepted",
        ]
        with pytest.raises(sqlcipher3.DatabaseError, match="append-only"):
            v._conn.execute("UPDATE audit_log SET event = 'x'")
        with pytest.raises(sqlcipher3.DatabaseError, match="append-only"):
            v._conn.execute("DELETE FROM audit_log")
        assert "Telekom" not in str(rows) and "49,99" not in str(rows)


def test_rekey_key_to_password_and_back(path):
    key = generate_key()
    with Vault.open(path, key, create=True) as v:
        v.add_document("x.jpg", "image/jpeg", [b"x"])
        v.rekey("mein passwort mit ' Hochkomma")
    with pytest.raises(WrongKeyError):
        Vault.open(path, key)  # nur ein aktiver Schluessel
    with Vault.open(path, "mein passwort mit ' Hochkomma") as v:
        assert v.get_document(1)["original_name"] == "x.jpg"
        v.rekey(key)
    with Vault.open(path, key) as v:
        assert v.integrity_check()


def test_recovery_key_roundtrip():
    key = generate_key()
    text = format_recovery_key(key)
    assert parse_recovery_key(text) == key
    assert parse_recovery_key(text.lower().replace("-", " ")) == key
    with pytest.raises(ValueError):
        parse_recovery_key("ABCD-EFGH")


def test_backup_opens_with_same_key_and_refuses_overwrite(path, tmp_path):
    key = generate_key()
    dest = tmp_path / "stick" / "kopie.syd"
    dest.parent.mkdir()
    with Vault.open(path, key, create=True) as v:
        doc, _ = v.add_document("x.jpg", "image/jpeg", [os.urandom(500_000)])
        v.backup_to(dest)
        with pytest.raises(Exception, match="existiert"):
            v.backup_to(dest)
        expected = v.read_page(doc, 1)
    with Vault.open(dest, parse_recovery_key(format_recovery_key(key))) as copy:
        assert copy.read_page(doc, 1) == expected
        assert copy.integrity_check()


def test_migration_version(path):
    key = generate_key()
    with Vault.open(path, key, create=True) as v:
        assert v.schema_version == len(MIGRATIONS)
    with Vault.open(path, key) as v:
        assert v.schema_version == len(MIGRATIONS)


def test_existing_repeat_series_is_migrated_with_original_anchor(path):
    key = generate_key()
    conn = sqlcipher3.connect(str(path))
    _apply_key(conn, key)
    for migration in MIGRATIONS[:3]:
        conn.executescript(migration)
    conn.execute("PRAGMA user_version = 3")
    conn.execute(
        "INSERT INTO document (id, sha256, original_name, mime, pages, imported_at)"
        " VALUES (1, 'hash', 'scan.png', 'image/png', 1, '2024-01-01')"
    )
    conn.execute(
        "INSERT INTO deadline (id, document_id, type, due_date, source, repeat_months, created_at)"
        " VALUES (1, 1, 'sonstige', '2024-01-31', 'manuell', 1, '2024-01-01')"
    )
    conn.execute(
        "INSERT INTO deadline (id, document_id, type, due_date, source, repeat_months, parent_id, created_at)"
        " VALUES (2, 1, 'sonstige', '2024-02-29', 'manuell', 1, 1, '2024-01-01')"
    )
    conn.commit()
    conn.close()

    with Vault.open(path, key) as vault:
        rows = vault.rows("SELECT due_date, repeat_anchor FROM deadline ORDER BY id")
        assert [row["repeat_anchor"] for row in rows] == ["2024-01-31", "2024-01-31"]
        assert vault.scalar("SELECT last_extraction_run FROM document WHERE id = 1") is None
