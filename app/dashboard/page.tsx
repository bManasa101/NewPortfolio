// app/dashboard/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useReports } from "@/lib/useReports";
import { type Report } from "@/lib/reports-store";
import { ReportForm } from "@/components/ReportForm";

const DASHBOARD_PASSWORD = "manasa2025";

export default function Dashboard() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editing, setEditing] = useState<Report | null>(null);
  const { reports, ready, addReport, updateReport, deleteReport } = useReports();
  const router = useRouter();

  // ── Auth gate ──────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight: "100vh", background: "#080a0f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ background: "#0e1117", border: "1px solid #3a4258", borderRadius: 8, padding: "2.5rem", width: "100%", maxWidth: 380 }}>
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#c8a96e", marginBottom: "1.5rem" }}>Dashboard Access</div>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 300, color: "#f0f2f5", marginBottom: "2rem" }}>Enter Password</h1>
        <input
          type="password" value={pw} placeholder="Password"
          onChange={(e) => { setPw(e.target.value); setPwErr(false); }}
          onKeyDown={(e) => { if (e.key === "Enter") { pw === DASHBOARD_PASSWORD ? setAuthed(true) : setPwErr(true); } }}
          style={{ width: "100%", background: "#13181f", border: `1px solid ${pwErr ? "#e74c3c" : "#3a4258"}`, color: "#f0f2f5", padding: "0.8rem 1rem", borderRadius: 4, fontFamily: "inherit", fontSize: "0.9rem", outline: "none", marginBottom: "0.6rem" }}
        />
        {pwErr && <div style={{ fontSize: "0.78rem", color: "#e74c3c", marginBottom: "1rem" }}>Incorrect password</div>}
        <button
          onClick={() => pw === DASHBOARD_PASSWORD ? setAuthed(true) : setPwErr(true)}
          style={{ width: "100%", background: "#c8a96e", color: "#080a0f", border: "none", padding: "0.85rem", borderRadius: 4, fontFamily: "inherit", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", marginBottom: "1rem" }}
        >
          Sign In
        </button>
        <button onClick={() => router.push("/")} style={{ width: "100%", background: "none", border: "1px solid #3a4258", color: "#7a8499", padding: "0.7rem", borderRadius: 4, fontFamily: "inherit", fontSize: "0.78rem", cursor: "pointer", letterSpacing: "0.1em" }}>
          ← Back to Portfolio
        </button>
      </div>
    </div>
  );

  // ── Add / Edit form ────────────────────────────────────────
  if (view === "add" || view === "edit") return (
    <ReportForm
      initial={editing}
      onSave={(r) => { editing ? updateReport(editing.slug, r) : addReport(r); setView("list"); setEditing(null); }}
      onCancel={() => { setView("list"); setEditing(null); }}
    />
  );

  // ── Report list ────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#080a0f", fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#f0f2f5" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(200,169,110,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(200,169,110,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 2rem", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#c8a96e", marginBottom: "0.5rem" }}>Research Dashboard</div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 300 }}>Manage <strong style={{ fontWeight: 600 }}>Reports</strong></h1>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => router.push("/#research")} style={{ background: "none", border: "1px solid #3a4258", color: "#7a8499", padding: "0.6rem 1.4rem", borderRadius: 2, cursor: "pointer", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "inherit" }}>
              ← Portfolio
            </button>
            <button onClick={() => { setEditing(null); setView("add"); }} style={{ background: "#c8a96e", color: "#080a0f", border: "none", padding: "0.6rem 1.6rem", borderRadius: 2, cursor: "pointer", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "inherit" }}>
              + Add Report
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
          {[
            { label: "Total Reports", value: reports.length },
            { label: "Buy Ratings", value: reports.filter(r => r.rec === "Buy").length },
            { label: "Sectors Covered", value: new Set(reports.map(r => r.sector)).size },
          ].map(s => (
            <div key={s.label} style={{ background: "#0e1117", border: "1px solid #3a4258", borderRadius: 6, padding: "1.2rem 1.5rem" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 200, color: "#c8a96e" }}>{s.value}</div>
              <div style={{ fontSize: "0.68rem", color: "#7a8499", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        {!ready ? <div style={{ color: "#7a8499" }}>Loading…</div> : (
          <div style={{ background: "#0e1117", border: "1px solid #3a4258", borderRadius: 6, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #3a4258" }}>
                  {["Ticker", "Title", "Sector", "Rec", "Date", "Actions"].map(h => (
                    <th key={h} style={{ padding: "1rem 1.2rem", textAlign: "left", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#7a8499", fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => (
                  <tr key={r.slug} style={{ borderBottom: i < reports.length - 1 ? "1px solid #1c2128" : "none" }}>
                    <td style={{ padding: "1rem 1.2rem", color: "#c8a96e", fontWeight: 600, letterSpacing: "0.08em" }}>{r.ticker}</td>
                    <td style={{ padding: "1rem 1.2rem", maxWidth: 280 }}><div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</div></td>
                    <td style={{ padding: "1rem 1.2rem", color: "#7a8499" }}>{r.sector}</td>
                    <td style={{ padding: "1rem 1.2rem" }}>
                      {r.rec
                        ? <span style={{ fontSize: "0.66rem", padding: "2px 8px", borderRadius: 2, fontWeight: 600, ...(r.rec === "Buy" ? { background: "rgba(46,204,113,0.1)", color: "#2ecc71", border: "1px solid rgba(46,204,113,0.2)" } : r.rec === "Hold" ? { background: "rgba(200,169,110,0.1)", color: "#c8a96e", border: "1px solid rgba(200,169,110,0.2)" } : { background: "rgba(231,76,60,0.1)", color: "#e74c3c", border: "1px solid rgba(231,76,60,0.2)" }) }}>{r.rec}</span>
                        : <span style={{ color: "#3a4258" }}>—</span>}
                    </td>
                    <td style={{ padding: "1rem 1.2rem", color: "#7a8499", fontSize: "0.8rem" }}>{r.date}</td>
                    <td style={{ padding: "1rem 1.2rem" }}>
                      <div style={{ display: "flex", gap: "0.6rem" }}>
                        <button onClick={() => router.push(`/research/${r.slug}`)} style={{ background: "none", border: "1px solid #3a4258", color: "#7a8499", padding: "0.3rem 0.8rem", borderRadius: 2, cursor: "pointer", fontSize: "0.72rem", fontFamily: "inherit" }}>View</button>
                        <button onClick={() => { setEditing(r); setView("edit"); }} style={{ background: "none", border: "1px solid rgba(200,169,110,0.3)", color: "#c8a96e", padding: "0.3rem 0.8rem", borderRadius: 2, cursor: "pointer", fontSize: "0.72rem", fontFamily: "inherit" }}>Edit</button>
                        <button onClick={() => { if (confirm(`Delete "${r.title}"?`)) deleteReport(r.slug); }} style={{ background: "none", border: "1px solid rgba(231,76,60,0.3)", color: "#e74c3c", padding: "0.3rem 0.8rem", borderRadius: 2, cursor: "pointer", fontSize: "0.72rem", fontFamily: "inherit" }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}