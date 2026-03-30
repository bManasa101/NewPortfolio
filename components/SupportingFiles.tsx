// components/SupportingFiles.tsx
"use client";

import { SupportingFile } from "@/lib/reports-store";

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

function FileCard({ f }: { f: SupportingFile }) {
  return (
    <a
      href={f.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none" }}
    >
      <div
        style={{
          background: "#0e1117",
          border: "1px solid #3a4258",
          borderRadius: 6,
          padding: "1rem 1.2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.9rem",
          transition: "border-color 0.2s, background 0.2s",
          cursor: "pointer",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,169,110,0.4)";
          (e.currentTarget as HTMLDivElement).style.background = "#13181f";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#3a4258";
          (e.currentTarget as HTMLDivElement).style.background = "#0e1117";
        }}
      >
        <div style={{ fontSize: "1.5rem", flexShrink: 0, lineHeight: 1 }}>
          {fileIcon(f.name)}
        </div>
        <div style={{ overflow: "hidden" }}>
          <div style={{ fontSize: "0.82rem", color: "#f0f2f5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "0.2rem" }}>
            {f.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {f.size && (
              <span style={{ fontSize: "0.7rem", color: "#7a8499" }}>
                {formatSize(f.size)}
              </span>
            )}
            <span style={{ fontSize: "0.68rem", color: "#c8a96e", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {fileLabel(f.name)} ↓
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

export function SupportingFiles({ files }: { files: SupportingFile[] }) {
  const images = files.filter(f => isImage(f.name));

  return (
    <div>
      {/* Download cards for all files */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
        {files.map((f, i) => <FileCard key={i} f={f} />)}
      </div>

      {/* Image previews */}
      {images.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <div style={{ fontSize: "0.68rem", color: "#7a8499", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
            Image Previews
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
            {images.map((f, i) => (
              <a key={i} href={f.url} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.url}
                  alt={f.name}
                  style={{ width: "100%", borderRadius: 4, border: "1px solid #3a4258", display: "block", objectFit: "cover", aspectRatio: "16/9" }}
                />
                <div style={{ fontSize: "0.7rem", color: "#7a8499", marginTop: "0.3rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {f.name}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}