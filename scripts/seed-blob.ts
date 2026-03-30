import dotenv from "dotenv";
import path from "path";
import { put } from "@vercel/blob";
import { defaultReports } from "../lib/reports-store";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function seed() {
  console.log("Token exists:", !!process.env.BLOB_READ_WRITE_TOKEN);

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("ENV NOT LOADED");
  }

  await put(
    "reports.json",
    JSON.stringify(defaultReports, null, 2),
    {
      access: "public",
      contentType: "application/json",
    }
  );

  console.log("✅ Blob successfully seeded!");
}

seed();