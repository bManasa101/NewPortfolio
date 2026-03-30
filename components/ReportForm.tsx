// components/ReportForm.tsx
"use client";
import { useState } from "react";
import { type Report } from "@/lib/reports-store";

const empty: Report = {
  slug: "", ticker: "", sector: "", rec: null, title: "", desc: "", date: "",
  detail: { thesis: "", keyFinancials: [{ label: "", value: "" }], risks: [""], conclusion: "" },
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const inp: React.CSSProperties = {
  width: "100%", background: "#13181f", border: "1px solid #3a4258",
  color: "#f0f2f5", padding: "0.75rem 1rem", borderRadius: 4,
  fontFamily: "inherit", fontSize: "0.88rem", outline: "none",
};

export function ReportForm({ initial, onSave, onCancel }: {
  initial: Report | null;
  onSave: (r: Report) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Report>(initial ?? empty);

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

  const setKF = (i: number, field: "label" | "value", v: string) =>
    setForm((p) => { const n = structuredClone(p); n.detail.keyFinancials[i][field] = v; return n; });

  const addKF = () => setForm((p) => ({ ...p, detail: { ...p.detail, keyFinancials: [...p.detail.keyFinancials, { label: "", value: "" }] } }));
  const removeKF = (i: number) => setForm((p) => ({ ...p, detail: { ...p.detail, keyFinancials: p.detail.keyFinancials.filter((_, j) => j !== i) } }));

  const setRisk = (i: number, v: string) =>
    setForm((p) => { const n = structuredClone(p); n.detail.risks[i] = v; return n; });
  const addRisk = () => setForm((p) => ({ ...p, detail: { ...p.detail, risks: [...p.detail.risks, ""] } }));
  const removeRisk = (i: number) => setForm((p) => ({ ...p, detail: { ...p.detail, risks: p.detail.risks.filter((_, j) => j !== i) } }));

  const handleSave = () => {
    if (!form.title || !form.ticker) return alert("Title and ticker are required.");
    onSave({ ...form, slug: form.slug || slugify(form.title) });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080a0f", fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#f0f2f5" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 2rem" }}>
        <div style={{ fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#c8a96e", marginBottom: "0.5rem" }}>
          {initial ? "Edit Report" : "New Report"}
        </div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 300, marginBottom: "3rem" }}>
          {initial ? <><strong style={{ fontWeight: 600 }}>Edit</strong> Report</> : <>Add <strong style={{ fontWeight: 600 }}>New</strong> Report</>}
        </h1>

        <FormSection title="Basic Info">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Title"><input value={form.title} onChange={e => set("title", e.target.value)} style={inp} placeholder="Report title" /></Field>
            <Field label="Ticker"><input value={form.ticker} onChange={e => set("ticker", e.target.value)} style={inp} placeholder="e.g. INFY" /></Field>
            <Field label="Sector"><input value={form.sector} onChange={e => set("sector", e.target.value)} style={inp} placeholder="e.g. Technology" /></Field>
            <Field label="Recommendation">
              <select value={form.rec ?? ""} onChange={e => set("rec", e.target.value || null)} style={{ ...inp, appearance: "none" }}>
                <option value="">None</option>
                <option value="Buy">Buy</option>
                <option value="Hold">Hold</option>
                <option value="Sell">Sell</option>
              </select>
            </Field>
            <Field label="Date"><input value={form.date} onChange={e => set("date", e.target.value)} style={inp} placeholder="e.g. Jan 2025" /></Field>
            <Field label="Slug (auto)"><input value={form.slug} onChange={e => set("slug", e.target.value)} style={{ ...inp, color: "#7a8499" }} /></Field>
          </div>
          <Field label="Short Description">
            <textarea value={form.desc} onChange={e => set("desc", e.target.value)} rows={2} style={{ ...inp, resize: "vertical" }} placeholder="1–2 sentence summary shown on the portfolio card" />
          </Field>
        </FormSection>

        <FormSection title="Investment Thesis">
          <textarea value={form.detail.thesis} onChange={e => set("detail.thesis", e.target.value)} rows={5} style={{ ...inp, resize: "vertical" }} placeholder="Full thesis narrative…" />
        </FormSection>

        <FormSection title="Key Financials">
          {form.detail.keyFinancials.map((kf, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.75rem", marginBottom: "0.75rem", alignItems: "center" }}>
              <input value={kf.label} onChange={e => setKF(i, "label", e.target.value)} style={inp} placeholder="Label (e.g. WACC)" />
              <input value={kf.value} onChange={e => setKF(i, "value", e.target.value)} style={inp} placeholder="Value (e.g. 11.2%)" />
              <button onClick={() => removeKF(i)} style={{ background: "none", border: "1px solid rgba(231,76,60,0.3)", color: "#e74c3c", width: 34, height: 34, borderRadius: 4, cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>
          ))}
          <AddBtn onClick={addKF}>+ Add Row</AddBtn>
        </FormSection>

        <FormSection title="Key Risks">
          {form.detail.risks.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.75rem", marginBottom: "0.75rem", alignItems: "center" }}>
              <input value={r} onChange={e => setRisk(i, e.target.value)} style={inp} placeholder="Risk factor…" />
              <button onClick={() => removeRisk(i)} style={{ background: "none", border: "1px solid rgba(231,76,60,0.3)", color: "#e74c3c", width: 34, height: 34, borderRadius: 4, cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>
          ))}
          <AddBtn onClick={addRisk}>+ Add Risk</AddBtn>
        </FormSection>

        <FormSection title="Conclusion">
          <textarea value={form.detail.conclusion} onChange={e => set("detail.conclusion", e.target.value)} rows={4} style={{ ...inp, resize: "vertical" }} placeholder="Conclusion and final recommendation…" />
        </FormSection>

        {/* Actions */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button onClick={handleSave} style={{ background: "#c8a96e", color: "#080a0f", border: "none", padding: "0.85rem 2.5rem", borderRadius: 4, fontFamily: "inherit", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
            {initial ? "Save Changes" : "Publish Report"}
          </button>
          <button onClick={onCancel} style={{ background: "none", border: "1px solid #3a4258", color: "#7a8499", padding: "0.85rem 2rem", borderRadius: 4, fontFamily: "inherit", fontSize: "0.8rem", cursor: "pointer", letterSpacing: "0.1em" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c8a96e", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 20, height: 1, background: "#c8a96e", display: "inline-block" }} />{title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>{children}</div>
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
    <button onClick={onClick} style={{ background: "none", border: "1px dashed #3a4258", color: "#7a8499", padding: "0.5rem 1.2rem", borderRadius: 4, cursor: "pointer", fontSize: "0.75rem", fontFamily: "inherit", letterSpacing: "0.1em", marginTop: "0.25rem" }}>
      {children}
    </button>
  );
}