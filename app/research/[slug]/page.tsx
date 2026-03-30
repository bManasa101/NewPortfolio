// app/research/[slug]/page.tsx
import { notFound } from "next/navigation";
import { readReports, Report, SupportingFile } from "@/lib/reports-store";

const recStyle: Record<string, React.CSSProperties> = {
  Buy:  { background: "rgba(46,204,113,0.12)", color: "#2ecc71", border: "1px solid rgba(46,204,113,0.3)" },
  Hold: { background: "rgba(200,169,110,0.12)", color: "#c8a96e", border: "1px solid rgba(200,169,110,0.3)" },
  Sell: { background: "rgba(231,76,60,0.12)", color: "#e74c3c", border: "1px solid rgba(231,76,60,0.3)" },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ReportPage({ params }: Props) {
  const { slug } = await params;

  const reports: Report[] = await readReports();
  const report = reports.find(r => r.slug === slug);

  if (!report) return notFound();

  const files = report.supportingFiles || [];

  return (
    <div style={{ minHeight: "100vh", background: "#080a0f", color: "#f0f2f5", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Grid background */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(200,169,110,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(200,169,110,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "60px 2rem", position: "relative", zIndex: 1 }}>

        {/* Back */}
        <a
          href="/#research"
          style={{ background: "none", border: "1px solid #3a4258", color: "#7a8499", padding: "0.45rem 1.2rem", borderRadius: 2, fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "3rem", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}
        >
          ← Back
        </a>

        {/* Header */}
        <div style={{ borderBottom: "1px solid #3a4258", paddingBottom: "2rem", marginBottom: "3rem", marginTop: "1.5rem" }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: "1.2rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.68rem", padding: "3px 10px", borderRadius: 2, background: "#13181f", border: "1px solid #3a4258", color: "#7a8499", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {report.sector}
            </span>
            {report.rec && (
              <span style={{ fontSize: "0.68rem", padding: "3px 10px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, ...recStyle[report.rec] }}>
                {report.rec}
              </span>
            )}
            {(report.tags || []).map(tag => (
              <span key={tag} style={{ fontSize: "0.66rem", padding: "3px 10px", borderRadius: 2, background: "rgba(200,169,110,0.06)", border: "1px solid rgba(200,169,110,0.15)", color: "#c8a96e", letterSpacing: "0.08em" }}>
                {tag}
              </span>
            ))}
            <span style={{ fontSize: "0.72rem", color: "#7a8499", marginLeft: "auto" }}>{report.date}</span>
          </div>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#c8a96e", letterSpacing: "0.15em", marginBottom: "0.8rem" }}>
            {report.ticker}
          </div>
          <h1 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 300, lineHeight: 1.3, letterSpacing: "-0.02em" }}>
            {report.title}
          </h1>
        </div>

        {/* Investment Thesis */}
        <Section label="Investment Thesis">
          <p style={{ color: "#9aa3b0", lineHeight: 1.9, fontSize: "0.97rem" }}>
            {report.detail.thesis}
          </p>
        </Section>

        {/* Key Financials */}
        {report.detail.keyFinancials.length > 0 && (
          <Section label="Key Financials">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: "1rem" }}>
              {report.detail.keyFinancials.map((item, i) => {
                // Support both "Label: Value" string format and legacy object format
                let label: string;
                let value: string;
                if (typeof item === "string" && item.includes(":")) {
                  const colonIdx = item.indexOf(":");
                  label = item.slice(0, colonIdx).trim();
                  value = item.slice(colonIdx + 1).trim();
                } else {
                  label = `Metric ${i + 1}`;
                  value = String(item);
                }
                return (
                  <div key={i} style={{ background: "#0e1117", border: "1px solid #3a4258", borderRadius: 6, padding: "1rem 1.2rem" }}>
                    <div style={{ fontSize: "0.68rem", color: "#7a8499", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{label}</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 500, color: "#c8a96e" }}>{value}</div>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* Key Risks */}
        {report.detail.risks.length > 0 && (
          <Section label="Key Risks">
            <ul style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: 0, listStyle: "none" }}>
              {report.detail.risks.map((r, i) => (
                <li key={i} style={{ display: "flex", gap: "0.8rem", color: "#9aa3b0", fontSize: "0.93rem", lineHeight: 1.7 }}>
                  <span style={{ color: "#e74c3c", marginTop: 2, flexShrink: 0 }}>▲</span>
                  {String(r)}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Supporting Documents — shown before Conclusion */}
        {files.length > 0 && (
          <Section label="Supporting Documents">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
              {files.map((f, i) => (
                <a
                  key={i}
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{ background: "#0e1117", border: "1px solid #3a4258", borderRadius: 6, padding: "1rem 1.2rem", display: "flex", alignItems: "center", gap: "0.9rem", transition: "border-color 0.2s, background 0.2s", cursor: "pointer" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,169,110,0.4)"; (e.currentTarget as HTMLDivElement).style.background = "#13181f"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#3a4258"; (e.currentTarget as HTMLDivElement).style.background = "#0e1117"; }}
                  >
                    <div style={{ fontSize: "1.5rem", flexShrink: 0, lineHeight: 1 }}>
                      {fileIcon(f.name)}
                    </div>
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: "0.82rem", color: "#f0f2f5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "0.2rem" }}>
                        {f.name}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {f.size && <span style={{ fontSize: "0.7rem", color: "#7a8499" }}>{formatSize(f.size)}</span>}
                        <span style={{ fontSize: "0.68rem", color: "#c8a96e", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          {fileLabel(f.name)} ↓
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Image previews */}
            {files.filter(f => isImage(f.name)).length > 0 && (
              <div style={{ marginTop: "1.5rem" }}>
                <div style={{ fontSize: "0.68rem", color: "#7a8499", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.8rem" }}>Image Previews</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
                  {files.filter(f => isImage(f.name)).map((f, i) => (
                    <a key={i} href={f.url} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={f.url}
                        alt={f.name}
                        style={{ width: "100%", borderRadius: 4, border: "1px solid #3a4258", display: "block", objectFit: "cover", aspectRatio: "16/9" }}
                      />
                      <div style={{ fontSize: "0.7rem", color: "#7a8499", marginTop: "0.3rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </Section>
        )}

        {/* Conclusion */}
        <Section label="Conclusion">
          <div style={{ background: "#0e1117", border: "1px solid rgba(200,169,110,0.2)", borderLeft: "3px solid #c8a96e", borderRadius: 4, padding: "1.5rem 1.8rem" }}>
            <p style={{ color: "#f0f2f5", lineHeight: 1.9, fontSize: "0.97rem", fontStyle: "italic" }}>
              {report.detail.conclusion}
            </p>
          </div>
        </Section>

      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "3rem" }}>
      <div style={{ fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#c8a96e", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 20, height: 1, background: "#c8a96e", display: "inline-block" }} />
        {label}
      </div>
      {children}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getExt(name: string): string {
  return name.split(".").pop()?.toLowerCase() || "";
}

function isImage(name: string): boolean {
  return ["png", "jpg", "jpeg", "gif", "webp"].includes(getExt(name));
}

function fileIcon(name: string): string {
  const ext = getExt(name);
  if (ext === "pdf") return "📄";
  if (["xlsx", "xls", "csv"].includes(ext)) return "📊";
  if (["ppt", "pptx"].includes(ext)) return "📋";
  if (["doc", "docx"].includes(ext)) return "📝";
  if (isImage(name)) return "🖼";
  return "📎";
}

function fileLabel(name: string): string {
  const ext = getExt(name);
  if (ext === "pdf") return "PDF";
  if (["xlsx", "xls"].includes(ext)) return "Excel";
  if (ext === "csv") return "CSV";
  if (["ppt", "pptx"].includes(ext)) return "PowerPoint";
  if (["doc", "docx"].includes(ext)) return "Word";
  if (isImage(name)) return "Image";
  return "File";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}