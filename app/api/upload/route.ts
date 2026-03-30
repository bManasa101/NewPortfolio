// app/api/upload/route.ts
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Sanitize filename: replace spaces and special chars, keep extension
    const ext = file.name.split(".").pop() || "";
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")           // strip extension
      .replace(/[^a-zA-Z0-9-_]/g, "-")   // replace special chars with dash
      .replace(/-+/g, "-")               // collapse multiple dashes
      .replace(/^-|-$/g, "")            // trim leading/trailing dashes
      .toLowerCase();
    const sanitizedName = `uploads/${baseName}-${Date.now()}.${ext}`;

    const blob = await put(sanitizedName, file, {
      access: "public",
      contentType: file.type || "application/octet-stream",
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    return NextResponse.json({
      url:  blob.url,
      name: file.name,   // keep original display name
      size: file.size,
      type: file.type,
    });
  } catch (err) {
    console.error("Upload error:", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}