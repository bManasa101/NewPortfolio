"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useReports } from "@/lib/useReports";
import { useWeekly } from "@/lib/useWeekly";
import { type Report } from "@/lib/reports-store";
import { type WeeklyEntry } from "@/lib/weekly-store";
import { ReportForm } from "@/components/ReportForm";

// ── Auth ──────────────────────────────────────────────────────────────────────
const DASHBOARD_PASSWORD = "manasa2025";
const AUTH_SESSION_KEY   = "dashboard_auth_ts";
const AUTH_TTL_MS        = 5 * 60 * 1000;

function getStoredAuth(): boolean {
  try {
    const raw = sessionStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return false;
    return Date.now() - parseInt(raw, 10) < AUTH_TTL_MS;
  } catch { return false; }
}
function setStoredAuth() {
  try { sessionStorage.setItem(AUTH_SESSION_KEY, String(Date.now())); } catch {}
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner({ size = 14 }: { size?: number }) {
  return (
    <span style={{
      display: "inline-block", width: size, height: size,
      border: "1.5px solid #3a4258", borderTopColor: "#c8a96e",
      borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0,
    }} />
  );
}
if (typeof document !== "undefined") {
  const id = "dash-spin-kf";
  if (!document.getElementById(id)) {
    const s = document.createElement("style");
    s.id = id;
    s.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
    document.head.appendChild(s);
  }
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const inp: React.CSSProperties = {
  width: "100%", background: "#13181f", border: "1px solid #3a4258",
  color: "#f0f2f5", padding: "0.75rem 1rem", borderRadius: 4,
  fontFamily: "inherit", fontSize: "0.88rem", outline: "none", boxSizing: "border-box",
};

// ── Empty weekly entry ────────────────────────────────────────────────────────
const emptyWeekly = (): WeeklyEntry => ({
  id: `weekly-${Date.now()}`,
  week: "", reading: "", macro: "", tracking: "", thesis: "", weeklyNote: "",
  createdAt: Date.now(),
});

// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [authed,        setAuthed]        = useState(false);
  const [pw,            setPw]            = useState("");
  const [pwErr,         setPwErr]         = useState(false);
  const [tab,           setTab]           = useState<"reports" | "weekly">("reports");

  // Reports state
  const [reportView,    setReportView]    = useState<"list" | "add" | "edit">("list");
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [savingReport,  setSavingReport]  = useState(false);
  const [deletingSlug,  setDeletingSlug]  = useState<string | null>(null);

  // Weekly state
  const [weeklyView,    setWeeklyView]    = useState<"list" | "add" | "edit">("list");
  const [editingWeekly, setEditingWeekly] = useState<WeeklyEntry | null>(null);
  const [weeklyForm,    setWeeklyForm]    = useState<WeeklyEntry>(emptyWeekly());
  const [savingWeekly,  setSavingWeekly]  = useState(false);
  const [deletingId,    setDeletingId]    = useState<string | null>(null);

  const { reports, ready: rReady, loading: rLoading, addReport, updateReport, deleteReport } = useReports();
  const { entries, ready: wReady, loading: wLoading, addEntry, updateEntry, deleteEntry }    = useWeekly();
  const router = useRouter();

  useEffect(() => { if (getStoredAuth()) setAuthed(true); }, []);

  // ── Auth ───────────────────────────────────────────────────────────────────
  function handleSignIn() {
    if (pw === DASHBOARD_PASSWORD) { setStoredAuth(); setAuthed(true); }
    else setPwErr(true);
  }

  // ── Report handlers ────────────────────────────────────────────────────────
  async function handleReportSave(r: Report) {
    setSavingReport(true);
    try {
      editingReport ? await updateReport(editingReport.slug, r) : await addReport(r);
      setReportView("list"); setEditingReport(null);
    } catch {} finally { setSavingReport(false); }
  }

  async function handleReportDelete(r: Report) {
    if (!confirm(`Delete "${r.title}"?`)) return;
    setDeletingSlug(r.slug);
    try { await deleteReport(r.slug); } catch {} finally { setDeletingSlug(null); }
  }

  // ── Weekly handlers ────────────────────────────────────────────────────────
  function openAddWeekly() {
    const e = emptyWeekly();
    setEditingWeekly(null);
    setWeeklyForm(e);
    setWeeklyView("add");
  }

  function openEditWeekly(e: WeeklyEntry) {
    setEditingWeekly(e);
    setWeeklyForm({ ...e });
    setWeeklyView("edit");
  }

  async function handleWeeklySave() {
  if (!weeklyForm.week.trim()) { alert("Week label is required."); return; }
  setSavingWeekly(true);

  // Build the final entry before calling add/update so the optimistic
  // state update in useWeekly has the correct id and createdAt immediately
  const finalEntry: WeeklyEntry = editingWeekly
    ? { ...weeklyForm, id: editingWeekly.id, createdAt: editingWeekly.createdAt }
    : { ...weeklyForm, id: `weekly-${Date.now()}`, createdAt: Date.now() };

  try {
    if (editingWeekly) {
      await updateEntry(editingWeekly.id, finalEntry);
    } else {
      await addEntry(finalEntry);
    }
    // Switch back to list — entries already updated optimistically so
    // the new/edited entry is visible the moment the list renders
    setWeeklyView("list");
    setEditingWeekly(null);
  } catch {
    // error already alerted inside useWeekly
  } finally {
    setSavingWeekly(false);
  }
}

  async function handleWeeklyDelete(e: WeeklyEntry) {
    if (!confirm(`Delete entry "${e.week}"?`)) return;
    setDeletingId(e.id);
    try { await deleteEntry(e.id); } catch {} finally { setDeletingId(null); }
  }

  // ── Auth gate ──────────────────────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight: "100vh", background: "#080a0f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ background: "#0e1117", border: "1px solid #3a4258", borderRadius: 8, padding: "2.5rem", width: "100%", maxWidth: 380 }}>
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#c8a96e", marginBottom: "1.5rem" }}>Dashboard Access</div>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 300, color: "#f0f2f5", marginBottom: "2rem" }}>Enter Password</h1>
        <input
          type="password" value={pw} placeholder="Password" autoFocus
          onChange={e => { setPw(e.target.value); setPwErr(false); }}
          onKeyDown={e => { if (e.key === "Enter") handleSignIn(); }}
          style={{ ...inp, border: `1px solid ${pwErr ? "#e74c3c" : "#3a4258"}`, marginBottom: "0.6rem" }}
        />
        {pwErr && <div style={{ fontSize: "0.78rem", color: "#e74c3c", marginBottom: "1rem" }}>Incorrect password</div>}
        <button onClick={handleSignIn} style={{ width: "100%", background: "#c8a96e", color: "#080a0f", border: "none", padding: "0.85rem", borderRadius: 4, fontFamily: "inherit", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", marginBottom: "1rem" }}>
          Sign In
        </button>
        <button onClick={() => router.push("/")} style={{ width: "100%", background: "none", border: "1px solid #3a4258", color: "#7a8499", padding: "0.7rem", borderRadius: 4, fontFamily: "inherit", fontSize: "0.78rem", cursor: "pointer", letterSpacing: "0.1em" }}>
          ← Back to Portfolio
        </button>
      </div>
    </div>
  );

  // ── Report form ────────────────────────────────────────────────────────────
  if (reportView === "add" || reportView === "edit") return (
    <ReportForm
      initial={editingReport}
      saving={savingReport}
      onSave={handleReportSave}
      onCancel={() => { setReportView("list"); setEditingReport(null); }}
    />
  );

  // ── Weekly form ────────────────────────────────────────────────────────────
  if (weeklyView === "add" || weeklyView === "edit") return (
    <div style={{ minHeight: "100vh", background: "#080a0f", fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#f0f2f5" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(200,169,110,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(200,169,110,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "60px 2rem", position: "relative", zIndex: 1 }}>

        <div style={{ fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#c8a96e", marginBottom: "0.5rem" }}>
          {editingWeekly ? "Edit Entry" : "New Weekly Update"}
        </div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 300, marginBottom: "3rem" }}>
          {editingWeekly ? <><strong style={{ fontWeight: 600 }}>Edit</strong> Weekly Update</> : <>Add <strong style={{ fontWeight: 600 }}>Weekly Update</strong></>}
        </h1>

        {([
          { key: "week",       label: "Week Label",        placeholder: "e.g. Week of 5 Jul 2025",            rows: 1  },
          { key: "reading",    label: "Currently Reading", placeholder: "Book / author",                      rows: 2  },
          { key: "macro",      label: "Macro Views",       placeholder: "Current macro perspective…",         rows: 3  },
          { key: "tracking",   label: "Tracking",          placeholder: "Sector or theme being tracked…",     rows: 2  },
          { key: "thesis",     label: "Thesis in Progress",placeholder: "Work-in-progress investment thesis…",rows: 2  },
          { key: "weeklyNote", label: "Weekly Note",       placeholder: "Key observation or insight…",        rows: 4  },
        ] as const).map(f => (
          <div key={f.key} style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a8499", marginBottom: "0.6rem" }}>
              {f.label}
            </label>
            {f.rows === 1 ? (
              <input
                value={weeklyForm[f.key]}
                onChange={e => setWeeklyForm(p => ({ ...p, [f.key]: e.target.value }))}
                style={inp}
                placeholder={f.placeholder}
              />
            ) : (
              <textarea
                value={weeklyForm[f.key]}
                onChange={e => setWeeklyForm(p => ({ ...p, [f.key]: e.target.value }))}
                rows={f.rows}
                style={{ ...inp, resize: "vertical" }}
                placeholder={f.placeholder}
              />
            )}
          </div>
        ))}

        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          <button
            onClick={handleWeeklySave}
            disabled={savingWeekly}
            style={{ background: savingWeekly ? "#8a7040" : "#c8a96e", color: "#080a0f", border: "none", padding: "0.85rem 2.5rem", borderRadius: 4, fontFamily: "inherit", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: savingWeekly ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.6rem", opacity: savingWeekly ? 0.75 : 1 }}
          >
            {savingWeekly && <span style={{ display: "inline-block", width: 14, height: 14, border: "1.5px solid rgba(0,0,0,0.3)", borderTopColor: "#080a0f", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />}
            {savingWeekly ? "Saving…" : editingWeekly ? "Save Changes" : "Publish Update"}
          </button>
          <button
            onClick={() => { setWeeklyView("list"); setEditingWeekly(null); }}
            disabled={savingWeekly}
            style={{ background: "none", border: "1px solid #3a4258", color: "#7a8499", padding: "0.85rem 2rem", borderRadius: 4, fontFamily: "inherit", fontSize: "0.8rem", cursor: "pointer", letterSpacing: "0.1em" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // ── Main dashboard ─────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#080a0f", fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#f0f2f5" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(200,169,110,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(200,169,110,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 2rem", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#c8a96e", marginBottom: "0.5rem" }}>Research Dashboard</div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 300 }}>Manage <strong style={{ fontWeight: 600 }}>Content</strong></h1>
          </div>
          <button onClick={() => router.push("/#research")} style={{ background: "none", border: "1px solid #3a4258", color: "#7a8499", padding: "0.6rem 1.4rem", borderRadius: 2, cursor: "pointer", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "inherit" }}>
            ← Portfolio
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: "2.5rem", borderBottom: "1px solid #3a4258" }}>
          {(["reports", "weekly"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: "none", border: "none", borderBottom: `2px solid ${tab === t ? "#c8a96e" : "transparent"}`,
                color: tab === t ? "#c8a96e" : "#7a8499",
                padding: "0.75rem 1.6rem", cursor: "pointer", fontFamily: "inherit",
                fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase",
                fontWeight: tab === t ? 600 : 400, transition: "all 0.2s", marginBottom: -1,
              }}
            >
              {t === "reports" ? "Research Reports" : "Weekly Updates"}
            </button>
          ))}
        </div>

        {/* ── Reports tab ── */}
        {tab === "reports" && (
          <>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "2rem" }}>
              {[
                { label: "Total Reports",   value: reports.length },
                { label: "Buy Ratings",     value: reports.filter(r => r.rec === "Buy").length },
                { label: "Sectors",         value: new Set(reports.map(r => r.sector)).size },
              ].map(s => (
                <div key={s.label} style={{ background: "#0e1117", border: "1px solid #3a4258", borderRadius: 6, padding: "1rem 1.4rem" }}>
                  <div style={{ fontSize: "1.6rem", fontWeight: 200, color: "#c8a96e" }}>{s.value}</div>
                  <div style={{ fontSize: "0.65rem", color: "#7a8499", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
              <button onClick={() => { setEditingReport(null); setReportView("add"); }} style={{ background: "#c8a96e", color: "#080a0f", border: "none", padding: "0.6rem 1.6rem", borderRadius: 2, cursor: "pointer", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "inherit" }}>
                + Add Report
              </button>
            </div>

            {!rReady || rLoading ? (
              <div style={{ color: "#7a8499", display: "flex", alignItems: "center", gap: "0.75rem", padding: "2rem 0" }}><Spinner /> Loading…</div>
            ) : reports.length === 0 ? (
              <EmptyState label="No reports yet." onAdd={() => { setEditingReport(null); setReportView("add"); }} btnLabel="+ Add First Report" />
            ) : (
              <div style={{ background: "#0e1117", border: "1px solid #3a4258", borderRadius: 6, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #3a4258" }}>
                      {["Ticker", "Title", "Sector", "Rec", "Date", "Files", "Actions"].map(h => (
                        <th key={h} style={{ padding: "1rem 1.2rem", textAlign: "left", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#7a8499", fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r, i) => {
                      const isDel = deletingSlug === r.slug;
                      return (
                        <tr key={r.slug} style={{ borderBottom: i < reports.length - 1 ? "1px solid #1c2128" : "none", opacity: isDel ? 0.4 : 1, transition: "opacity 0.2s" }}>
                          <td style={{ padding: "1rem 1.2rem", color: "#c8a96e", fontWeight: 600, letterSpacing: "0.08em" }}>{r.ticker}</td>
                          <td style={{ padding: "1rem 1.2rem", maxWidth: 240 }}><div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</div></td>
                          <td style={{ padding: "1rem 1.2rem", color: "#7a8499" }}>{r.sector}</td>
                          <td style={{ padding: "1rem 1.2rem" }}>
                            {r.rec ? (
                              <span style={{ fontSize: "0.66rem", padding: "2px 8px", borderRadius: 2, fontWeight: 600, ...(r.rec === "Buy" ? { background: "rgba(46,204,113,0.1)", color: "#2ecc71", border: "1px solid rgba(46,204,113,0.2)" } : r.rec === "Hold" ? { background: "rgba(200,169,110,0.1)", color: "#c8a96e", border: "1px solid rgba(200,169,110,0.2)" } : { background: "rgba(231,76,60,0.1)", color: "#e74c3c", border: "1px solid rgba(231,76,60,0.2)" }) }}>{r.rec}</span>
                            ) : <span style={{ color: "#3a4258" }}>—</span>}
                          </td>
                          <td style={{ padding: "1rem 1.2rem", color: "#7a8499", fontSize: "0.8rem" }}>{r.date}</td>
                          <td style={{ padding: "1rem 1.2rem", color: "#7a8499", fontSize: "0.8rem" }}>
                            {(r.supportingFiles?.length ?? 0) > 0 ? <span style={{ color: "#c8a96e" }}>{r.supportingFiles!.length} file{r.supportingFiles!.length > 1 ? "s" : ""}</span> : <span style={{ color: "#3a4258" }}>—</span>}
                          </td>
                          <td style={{ padding: "1rem 1.2rem" }}>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <ActionBtn onClick={() => router.push(`/research/${r.slug}`)} disabled={isDel}>View</ActionBtn>
                              <ActionBtn onClick={() => { setEditingReport(r); setReportView("edit"); }} disabled={isDel} gold>Edit</ActionBtn>
                              <ActionBtn onClick={() => handleReportDelete(r)} disabled={isDel} danger loading={isDel}>
                                {isDel ? <><Spinner size={10} /> Deleting</> : "Delete"}
                              </ActionBtn>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── Weekly tab ── */}
        {tab === "weekly" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ fontSize: "0.82rem", color: "#7a8499", lineHeight: 1.6 }}>
                Entries are shown newest-first in the About section carousel. Add a new entry each week.
              </div>
              <button onClick={openAddWeekly} style={{ background: "#c8a96e", color: "#080a0f", border: "none", padding: "0.6rem 1.6rem", borderRadius: 2, cursor: "pointer", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "inherit", flexShrink: 0 }}>
                + New Weekly Update
              </button>
            </div>

            {!wReady || wLoading ? (
              <div style={{ color: "#7a8499", display: "flex", alignItems: "center", gap: "0.75rem", padding: "2rem 0" }}><Spinner /> Loading…</div>
            ) : entries.length === 0 ? (
              <EmptyState label="No weekly updates yet." onAdd={openAddWeekly} btnLabel="+ Add First Update" />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {entries.map((e, i) => {
                  const isDel = deletingId === e.id;
                  return (
                    <div key={e.id} style={{ background: "#0e1117", border: "1px solid #3a4258", borderRadius: 6, padding: "1.4rem 1.6rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "1.5rem", alignItems: "start", opacity: isDel ? 0.4 : 1, transition: "opacity 0.2s" }}>
                      <div>
                        {/* Week label + "latest" badge */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.9rem" }}>
                          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#c8a96e", letterSpacing: "0.04em" }}>{e.week}</span>
                          {i === 0 && <span style={{ fontSize: "0.6rem", padding: "2px 7px", background: "rgba(46,204,113,0.1)", color: "#2ecc71", border: "1px solid rgba(46,204,113,0.2)", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase" }}>Latest</span>}
                        </div>
                        {/* Preview rows */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.5rem 1.5rem" }}>
                          {[
                            { label: "Reading",  val: e.reading },
                            { label: "Macro",    val: e.macro },
                            { label: "Tracking", val: e.tracking },
                            { label: "Thesis",   val: e.thesis },
                          ].map(f => (
                            <div key={f.label}>
                              <span style={{ fontSize: "0.62rem", color: "#c8a96e", letterSpacing: "0.1em", textTransform: "uppercase" }}>{f.label} </span>
                              <span style={{ fontSize: "0.8rem", color: "#7a8499" }}>{f.val || "—"}</span>
                            </div>
                          ))}
                        </div>
                        {e.weeklyNote && (
                          <div style={{ marginTop: "0.7rem", fontSize: "0.82rem", color: "#7a8499", fontStyle: "italic", lineHeight: 1.6 }}>
                            "{e.weeklyNote}"
                          </div>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                        <ActionBtn onClick={() => openEditWeekly(e)} disabled={isDel} gold>Edit</ActionBtn>
                        <ActionBtn onClick={() => handleWeeklyDelete(e)} disabled={isDel} danger loading={isDel}>
                          {isDel ? <><Spinner size={10} /> Deleting</> : "Delete"}
                        </ActionBtn>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

// ── Reusable action button ────────────────────────────────────────────────────
function ActionBtn({ onClick, disabled, gold, danger, loading: _l, children }: {
  onClick: () => void; disabled?: boolean; gold?: boolean; danger?: boolean; loading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: "none",
        border: `1px solid ${danger ? "rgba(231,76,60,0.3)" : gold ? "rgba(200,169,110,0.3)" : "#3a4258"}`,
        color: disabled ? "#7a8499" : danger ? "#e74c3c" : gold ? "#c8a96e" : "#7a8499",
        padding: "0.3rem 0.8rem", borderRadius: 2,
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: "0.72rem", fontFamily: "inherit",
        display: "flex", alignItems: "center", gap: 4,
        minWidth: danger ? 68 : "auto",
      }}
    >
      {children}
    </button>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ label, onAdd, btnLabel }: { label: string; onAdd: () => void; btnLabel: string }) {
  return (
    <div style={{ background: "#0e1117", border: "1px solid #3a4258", borderRadius: 6, padding: "3rem", textAlign: "center", color: "#7a8499" }}>
      <div style={{ fontSize: "0.88rem", marginBottom: "1rem" }}>{label}</div>
      <button onClick={onAdd} style={{ background: "#c8a96e", color: "#080a0f", border: "none", padding: "0.6rem 1.6rem", borderRadius: 2, cursor: "pointer", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "inherit" }}>
        {btnLabel}
      </button>
    </div>
  );
}