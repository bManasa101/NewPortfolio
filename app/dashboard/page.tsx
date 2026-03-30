"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useReports } from "@/lib/useReports";
import { type Report } from "@/lib/reports-store";
import { ReportForm } from "@/components/ReportForm";

// ── Auth config ───────────────────────────────────────────────────────────────
const DASHBOARD_PASSWORD = "manasa2025";
const AUTH_SESSION_KEY   = "dashboard_auth_ts";
const AUTH_TTL_MS        = 5 * 60 * 1000; // 5 minutes

function getStoredAuth(): boolean {
  try {
    const raw = sessionStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return false;
    return Date.now() - parseInt(raw, 10) < AUTH_TTL_MS;
  } catch {
    return false;
  }
}

function setStoredAuth() {
  try {
    sessionStorage.setItem(AUTH_SESSION_KEY, String(Date.now()));
  } catch {}
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner({ size = 14 }: { size?: number }) {
  return (
    <span style={{
      display: "inline-block",
      width: size, height: size,
      border: "1.5px solid #3a4258",
      borderTopColor: "#c8a96e",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
      flexShrink: 0,
    }} />
  );
}

// Inject keyframes once (client-side only)
if (typeof document !== "undefined") {
  const id = "dash-spin-kf";
  if (!document.getElementById(id)) {
    const s = document.createElement("style");
    s.id = id;
    s.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
    document.head.appendChild(s);
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [authed,       setAuthed]       = useState(false);
  const [pw,           setPw]           = useState("");
  const [pwErr,        setPwErr]        = useState(false);
  const [view,         setView]         = useState<"list" | "add" | "edit">("list");
  const [editing,      setEditing]      = useState<Report | null>(null);
  const [saving,       setSaving]       = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const { reports, ready, loading, addReport, updateReport, deleteReport } = useReports();
  const router = useRouter();

  // Check sessionStorage on mount — skip password if within TTL
  useEffect(() => {
    if (getStoredAuth()) setAuthed(true);
  }, []);

  // ── Auth ───────────────────────────────────────────────────────────────────
  function handleSignIn() {
    if (pw === DASHBOARD_PASSWORD) {
      setStoredAuth();
      setAuthed(true);
    } else {
      setPwErr(true);
    }
  }

  // ── Save — async, awaits CRUD before switching view ────────────────────────
  async function handleSave(r: Report) {
    setSaving(true);
    try {
      if (editing) {
        await updateReport(editing.slug, r);
      } else {
        await addReport(r);
      }
      setView("list");
      setEditing(null);
    } catch {
      // error already alerted inside useReports
    } finally {
      setSaving(false);
    }
  }

  // ── Delete — awaits then refreshes list ───────────────────────────────────
  async function handleDelete(r: Report) {
    if (!confirm(`Delete "${r.title}"?`)) return;
    setDeletingSlug(r.slug);
    try {
      await deleteReport(r.slug);
    } catch {
      // error already alerted
    } finally {
      setDeletingSlug(null);
    }
  }

  // ── Auth gate ──────────────────────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight: "100vh", background: "#080a0f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ background: "#0e1117", border: "1px solid #3a4258", borderRadius: 8, padding: "2.5rem", width: "100%", maxWidth: 380 }}>
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#c8a96e", marginBottom: "1.5rem" }}>
          Dashboard Access
        </div>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 300, color: "#f0f2f5", marginBottom: "2rem" }}>
          Enter Password
        </h1>
        <input
          type="password"
          value={pw}
          placeholder="Password"
          autoFocus
          onChange={e => { setPw(e.target.value); setPwErr(false); }}
          onKeyDown={e => { if (e.key === "Enter") handleSignIn(); }}
          style={{
            width: "100%", background: "#13181f",
            border: `1px solid ${pwErr ? "#e74c3c" : "#3a4258"}`,
            color: "#f0f2f5", padding: "0.8rem 1rem", borderRadius: 4,
            fontFamily: "inherit", fontSize: "0.9rem", outline: "none",
            marginBottom: "0.6rem", boxSizing: "border-box",
          }}
        />
        {pwErr && (
          <div style={{ fontSize: "0.78rem", color: "#e74c3c", marginBottom: "1rem" }}>
            Incorrect password
          </div>
        )}
        <button
          onClick={handleSignIn}
          style={{ width: "100%", background: "#c8a96e", color: "#080a0f", border: "none", padding: "0.85rem", borderRadius: 4, fontFamily: "inherit", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", marginBottom: "1rem" }}
        >
          Sign In
        </button>
        <button
          onClick={() => router.push("/")}
          style={{ width: "100%", background: "none", border: "1px solid #3a4258", color: "#7a8499", padding: "0.7rem", borderRadius: 4, fontFamily: "inherit", fontSize: "0.78rem", cursor: "pointer", letterSpacing: "0.1em" }}
        >
          ← Back to Portfolio
        </button>
      </div>
    </div>
  );

  // ── Add / Edit form ────────────────────────────────────────────────────────
  if (view === "add" || view === "edit") return (
    <ReportForm
      initial={editing}
      saving={saving}
      onSave={handleSave}
      onCancel={() => { setView("list"); setEditing(null); }}
    />
  );

  // ── Report list ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#080a0f", fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#f0f2f5" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(200,169,110,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(200,169,110,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 2rem", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#c8a96e", marginBottom: "0.5rem" }}>
              Research Dashboard
            </div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 300 }}>
              Manage <strong style={{ fontWeight: 600 }}>Reports</strong>
            </h1>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => router.push("/#research")}
              style={{ background: "none", border: "1px solid #3a4258", color: "#7a8499", padding: "0.6rem 1.4rem", borderRadius: 2, cursor: "pointer", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "inherit" }}
            >
              ← Portfolio
            </button>
            <button
              onClick={() => { setEditing(null); setView("add"); }}
              style={{ background: "#c8a96e", color: "#080a0f", border: "none", padding: "0.6rem 1.6rem", borderRadius: 2, cursor: "pointer", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "inherit" }}
            >
              + Add Report
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
          {[
            { label: "Total Reports",   value: reports.length },
            { label: "Buy Ratings",     value: reports.filter(r => r.rec === "Buy").length },
            { label: "Sectors Covered", value: new Set(reports.map(r => r.sector)).size },
          ].map(s => (
            <div key={s.label} style={{ background: "#0e1117", border: "1px solid #3a4258", borderRadius: 6, padding: "1.2rem 1.5rem" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 200, color: "#c8a96e" }}>{s.value}</div>
              <div style={{ fontSize: "0.68rem", color: "#7a8499", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        {!ready || loading ? (
          <div style={{ color: "#7a8499", display: "flex", alignItems: "center", gap: "0.75rem", padding: "2rem 0" }}>
            <Spinner /> Loading reports…
          </div>
        ) : reports.length === 0 ? (
          <div style={{ background: "#0e1117", border: "1px solid #3a4258", borderRadius: 6, padding: "3rem", textAlign: "center", color: "#7a8499" }}>
            <div style={{ fontSize: "0.88rem" }}>No reports yet.</div>
            <button
              onClick={() => { setEditing(null); setView("add"); }}
              style={{ marginTop: "1rem", background: "#c8a96e", color: "#080a0f", border: "none", padding: "0.6rem 1.6rem", borderRadius: 2, cursor: "pointer", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "inherit" }}
            >
              + Add First Report
            </button>
          </div>
        ) : (
          <div style={{ background: "#0e1117", border: "1px solid #3a4258", borderRadius: 6, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #3a4258" }}>
                  {["Ticker", "Title", "Sector", "Rec", "Date", "Files", "Actions"].map(h => (
                    <th key={h} style={{ padding: "1rem 1.2rem", textAlign: "left", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#7a8499", fontWeight: 500 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => {
                  const isDeleting = deletingSlug === r.slug;
                  return (
                    <tr
                      key={r.slug}
                      style={{
                        borderBottom: i < reports.length - 1 ? "1px solid #1c2128" : "none",
                        opacity: isDeleting ? 0.4 : 1,
                        transition: "opacity 0.2s",
                      }}
                    >
                      <td style={{ padding: "1rem 1.2rem", color: "#c8a96e", fontWeight: 600, letterSpacing: "0.08em" }}>
                        {r.ticker}
                      </td>
                      <td style={{ padding: "1rem 1.2rem", maxWidth: 260 }}>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {r.title}
                        </div>
                      </td>
                      <td style={{ padding: "1rem 1.2rem", color: "#7a8499" }}>{r.sector}</td>
                      <td style={{ padding: "1rem 1.2rem" }}>
                        {r.rec ? (
                          <span style={{
                            fontSize: "0.66rem", padding: "2px 8px", borderRadius: 2, fontWeight: 600,
                            ...(r.rec === "Buy"
                              ? { background: "rgba(46,204,113,0.1)",  color: "#2ecc71", border: "1px solid rgba(46,204,113,0.2)" }
                              : r.rec === "Hold"
                              ? { background: "rgba(200,169,110,0.1)", color: "#c8a96e", border: "1px solid rgba(200,169,110,0.2)" }
                              : { background: "rgba(231,76,60,0.1)",   color: "#e74c3c", border: "1px solid rgba(231,76,60,0.2)" }),
                          }}>
                            {r.rec}
                          </span>
                        ) : <span style={{ color: "#3a4258" }}>—</span>}
                      </td>
                      <td style={{ padding: "1rem 1.2rem", color: "#7a8499", fontSize: "0.8rem" }}>{r.date}</td>
                      <td style={{ padding: "1rem 1.2rem", color: "#7a8499", fontSize: "0.8rem" }}>
                        {(r.supportingFiles?.length ?? 0) > 0
                          ? <span style={{ color: "#c8a96e" }}>{r.supportingFiles!.length} file{r.supportingFiles!.length > 1 ? "s" : ""}</span>
                          : <span style={{ color: "#3a4258" }}>—</span>}
                      </td>
                      <td style={{ padding: "1rem 1.2rem" }}>
                        <div style={{ display: "flex", gap: "0.6rem" }}>
                          <button
                            onClick={() => router.push(`/research/${r.slug}`)}
                            disabled={isDeleting}
                            style={{ background: "none", border: "1px solid #3a4258", color: "#7a8499", padding: "0.3rem 0.8rem", borderRadius: 2, cursor: "pointer", fontSize: "0.72rem", fontFamily: "inherit" }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => { setEditing(r); setView("edit"); }}
                            disabled={isDeleting}
                            style={{ background: "none", border: "1px solid rgba(200,169,110,0.3)", color: "#c8a96e", padding: "0.3rem 0.8rem", borderRadius: 2, cursor: "pointer", fontSize: "0.72rem", fontFamily: "inherit" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(r)}
                            disabled={isDeleting}
                            style={{
                              background: "none",
                              border: "1px solid rgba(231,76,60,0.3)",
                              color: isDeleting ? "#7a8499" : "#e74c3c",
                              padding: "0.3rem 0.8rem", borderRadius: 2,
                              cursor: isDeleting ? "not-allowed" : "pointer",
                              fontSize: "0.72rem", fontFamily: "inherit",
                              minWidth: 72,
                              display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                            }}
                          >
                            {isDeleting ? <><Spinner size={10} /> Deleting</> : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}