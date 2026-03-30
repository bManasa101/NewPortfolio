// components/ReportForm.tsx
"use client";
import { useState, useRef } from "react";
import { type Report, type SupportingFile } from "@/lib/reports-store";

const emptyReport: Report = {
  slug: "",
  ticker: "",
  sector: "",
  tags: [],
  rec: null,
  title: "",
  desc: "",
  excerpt: "",
  date: "",
  detail: {
    thesis: "",
    keyFinancials: [],
    risks: [],
    conclusion: "",
  },
  supportingFiles: [],
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const inp: React.CSSProperties = {
  width: "100%",
  background: "#13181f",
  border: "1px solid #3a4258",
  color: "#f0f2f5",
  padding: "0.75rem 1rem",
  borderRadius: 4,
  fontFamily: "inherit",
  fontSize: "0.88rem",
  outline: "none",
  boxSizing: "border-box",
};

export function ReportForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Report | null;
  onSave: (r: Report) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Report>(initial ?? emptyReport);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Field helpers ────────────────────────────────────────
  const set = (path: string, val: unknown) => {
    setForm((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let cur: any = next;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = val;
      if (path === "title" && !initial) next.slug = slugify(val as string);
      return next;
    });
  };

  // ── Key financials (label/value pairs stored as "Label: Value" strings) ──
  // We keep them internally as {label, value} display rows but store as strings
  // for API compatibility. We use a local kfRows state for the UI.
  const [kfRows, setKfRows] = useState<{ label: string; value: string }[]>(() => {
    const kf = form.detail.keyFinancials;
    if (!kf || kf.length === 0) return [{ label: "", value: "" }];
    return kf.map((item) => {
      if (typeof item === "string") {
        const [label, ...rest] = item.split(":");
        return { label: label?.trim() || "", value: rest.join(":").trim() };
      }
      return item as { label: string; value: string };
    });
  });

  const updateKfRows = (rows: { label: string; value: string }[]) => {
    setKfRows(rows);
    set("detail.keyFinancials", rows.map((r) => `${r.label}: ${r.value}`));
  };

  // ── Risks ────────────────────────────────────────────────
  const [risks, setRisks] = useState<string[]>(() =>
    form.detail.risks.length > 0 ? form.detail.risks : [""]
  );

  const updateRisks = (next: string[]) => {
    setRisks(next);
    set("detail.risks", next);
  };

  // ── File upload to Vercel Blob ───────────────────────────
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const newFile: SupportingFile = {
        name: file.name,
        url: data.url,
        type: file.type,
        size: file.size,
      };
      setForm((prev) => ({
        ...prev,
        supportingFiles: [...(prev.supportingFiles || []), newFile],
      }));
    } catch {
      alert("File upload failed. Check your Vercel Blob token.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removeFile(index: number) {
    setForm((prev) => ({
      ...prev,
      supportingFiles: (prev.supportingFiles || []).filter((_, i) => i !== index),
    }));
  }

  // ── Save ─────────────────────────────────────────────────
  const handleSave = () => {
    if (!form.title.trim() || !form.ticker.trim()) {
      alert("Title and ticker are required.");
      return;
    }
    onSave({ ...form, slug: form.slug || slugify(form.title) });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080a0f", fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#f0f2f5" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(200,169,110,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(200,169,110,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 2rem", position: "relative", zIndex: 1 }}>

        <div style={{ fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#c8a96e", marginBottom: "0.5rem" }}>
          {initial ? "Edit Report" : "New Report"}
        </div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 300, marginBottom: "3rem" }}>
          {initial ? <><strong style={{ fontWeight: 600 }}>Edit</strong> Report</> : <>Add <strong style={{ fontWeight: 600 }}>New</strong> Report</>}
        </h1>

        {/* ── Basic Info ── */}
        <FormSection title="Basic Info">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Title">
              <input value={form.title} onChange={e => set("title", e.target.value)} style={inp} placeholder="Report title" />
            </Field>
            <Field label="Ticker">
              <input value={form.ticker} onChange={e => set("ticker", e.target.value)} style={inp} placeholder="e.g. INFY" />
            </Field>
            <Field label="Sector">
              <input value={form.sector} onChange={e => set("sector", e.target.value)} style={inp} placeholder="e.g. Technology" />
            </Field>
            <Field label="Recommendation">
              <select value={form.rec ?? ""} onChange={e => set("rec", e.target.value || null)} style={{ ...inp, appearance: "none" }}>
                <option value="">None</option>
                <option value="Buy">Buy</option>
                <option value="Hold">Hold</option>
                <option value="Sell">Sell</option>
              </select>
            </Field>
            <Field label="Date">
              <input value={form.date} onChange={e => set("date", e.target.value)} style={inp} placeholder="e.g. Jan 2025" />
            </Field>
            <Field label="Slug (auto-generated)">
              <input value={form.slug} onChange={e => set("slug", e.target.value)} style={{ ...inp, color: "#7a8499" }} />
            </Field>
          </div>
          <Field label="Short Description">
            <textarea value={form.desc} onChange={e => set("desc", e.target.value)} rows={2} style={{ ...inp, resize: "vertical" }} placeholder="1–2 sentence summary shown on portfolio card" />
          </Field>
          <Field label="Excerpt">
            <textarea value={form.excerpt} onChange={e => set("excerpt", e.target.value)} rows={2} style={{ ...inp, resize: "vertical" }} placeholder="Longer excerpt for preview" />
          </Field>
          <Field label="Tags (comma separated)">
            <input
              value={form.tags.join(", ")}
              onChange={e => set("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
              style={inp}
              placeholder="e.g. DCF, Large Cap, Growth"
            />
          </Field>
        </FormSection>

        {/* ── Investment Thesis ── */}
        <FormSection title="Investment Thesis">
          <textarea value={form.detail.thesis} onChange={e => set("detail.thesis", e.target.value)} rows={5} style={{ ...inp, resize: "vertical" }} placeholder="Full thesis narrative…" />
        </FormSection>

        {/* ── Key Financials ── */}
        <FormSection title="Key Financials">
          {kfRows.map((kf, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.75rem", marginBottom: "0.75rem", alignItems: "center" }}>
              <input value={kf.label} onChange={e => updateKfRows(kfRows.map((r, j) => j === i ? { ...r, label: e.target.value } : r))} style={inp} placeholder="Label (e.g. WACC)" />
              <input value={kf.value} onChange={e => updateKfRows(kfRows.map((r, j) => j === i ? { ...r, value: e.target.value } : r))} style={inp} placeholder="Value (e.g. 11.2%)" />
              <button onClick={() => updateKfRows(kfRows.filter((_, j) => j !== i))} style={{ background: "none", border: "1px solid rgba(231,76,60,0.3)", color: "#e74c3c", width: 34, height: 34, borderRadius: 4, cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>
          ))}
          <AddBtn onClick={() => updateKfRows([...kfRows, { label: "", value: "" }])}>+ Add Row</AddBtn>
        </FormSection>

        {/* ── Key Risks ── */}
        <FormSection title="Key Risks">
          {risks.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.75rem", marginBottom: "0.75rem", alignItems: "center" }}>
              <input value={r} onChange={e => updateRisks(risks.map((v, j) => j === i ? e.target.value : v))} style={inp} placeholder="Risk factor…" />
              <button onClick={() => updateRisks(risks.filter((_, j) => j !== i))} style={{ background: "none", border: "1px solid rgba(231,76,60,0.3)", color: "#e74c3c", width: 34, height: 34, borderRadius: 4, cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>
          ))}
          <AddBtn onClick={() => updateRisks([...risks, ""])}>+ Add Risk</AddBtn>
        </FormSection>

        {/* ── Conclusion ── */}
        <FormSection title="Conclusion">
          <textarea value={form.detail.conclusion} onChange={e => set("detail.conclusion", e.target.value)} rows={4} style={{ ...inp, resize: "vertical" }} placeholder="Conclusion and final recommendation…" />
        </FormSection>

        {/* ── Supporting Files ── */}
        <FormSection title="Supporting Files">
          <p style={{ fontSize: "0.8rem", color: "#7a8499", marginBottom: "1rem", lineHeight: 1.6 }}>
            Upload PDFs, Excel, PowerPoint, or images. Files are stored in Vercel Blob and will be available for download on the report page.
          </p>

          {/* Existing files */}
          {(form.supportingFiles || []).length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
              {(form.supportingFiles || []).map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#13181f", border: "1px solid #3a4258", borderRadius: 4, padding: "0.6rem 1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "1rem" }}>{fileIcon(f.name)}</span>
                    <div>
                      <div style={{ fontSize: "0.82rem", color: "#f0f2f5" }}>{f.name}</div>
                      {f.size && <div style={{ fontSize: "0.7rem", color: "#7a8499" }}>{formatSize(f.size)}</div>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <a href={f.url} target="_blank" rel="noopener noreferrer" style={{ background: "none", border: "1px solid #3a4258", color: "#7a8499", padding: "0.25rem 0.7rem", borderRadius: 2, fontSize: "0.72rem", cursor: "pointer", textDecoration: "none" }}>View</a>
                    <button onClick={() => removeFile(i)} style={{ background: "none", border: "1px solid rgba(231,76,60,0.3)", color: "#e74c3c", padding: "0.25rem 0.7rem", borderRadius: 2, fontSize: "0.72rem", cursor: "pointer", fontFamily: "inherit" }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload button */}
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.xlsx,.xls,.ppt,.pptx,.png,.jpg,.jpeg,.gif,.webp,.csv,.doc,.docx"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "none", border: "1px dashed #3a4258", color: uploading ? "#7a8499" : "#c8a96e",
              padding: "0.65rem 1.4rem", borderRadius: 4, cursor: uploading ? "not-allowed" : "pointer",
              fontSize: "0.78rem", fontFamily: "inherit", letterSpacing: "0.1em",
              transition: "border-color 0.2s",
            }}
          >
            {uploading ? "Uploading…" : "+ Upload File"}
          </label>
          <p style={{ fontSize: "0.72rem", color: "#3a4258", marginTop: "0.5rem" }}>
            Supported: PDF, Excel, PowerPoint, Word, Images, CSV
          </p>
        </FormSection>

        {/* ── Actions ── */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button
            onClick={handleSave}
            style={{ background: "#c8a96e", color: "#080a0f", border: "none", padding: "0.85rem 2.5rem", borderRadius: 4, fontFamily: "inherit", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}
          >
            {initial ? "Save Changes" : "Publish Report"}
          </button>
          <button
            onClick={onCancel}
            style={{ background: "none", border: "1px solid #3a4258", color: "#7a8499", padding: "0.85rem 2rem", borderRadius: 4, fontFamily: "inherit", fontSize: "0.8rem", cursor: "pointer", letterSpacing: "0.1em" }}
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c8a96e", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 20, height: 1, background: "#c8a96e", display: "inline-block" }} />
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#7a8499", marginBottom: "0.5rem" }}>{label}</label>
      {children}
    </div>
  );
}

function AddBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{ background: "none", border: "1px dashed #3a4258", color: "#7a8499", padding: "0.5rem 1.2rem", borderRadius: 4, cursor: "pointer", fontSize: "0.75rem", fontFamily: "inherit", letterSpacing: "0.1em", marginTop: "0.25rem" }}
    >
      {children}
    </button>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function fileIcon(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["pdf"].includes(ext)) return "📄";
  if (["xlsx", "xls", "csv"].includes(ext)) return "📊";
  if (["ppt", "pptx"].includes(ext)) return "📋";
  if (["doc", "docx"].includes(ext)) return "📝";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "🖼";
  return "📎";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}