import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "patients.json");

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf-8");
  }
}

export async function GET() {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const patients = JSON.parse(raw);
    return NextResponse.json(patients);
  } catch (error) {
    console.error("Error reading patients:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureDataFile();
    const patients = await request.json();
    fs.writeFileSync(DATA_FILE, JSON.stringify(patients, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error saving patients:", error);
    const message =
      error instanceof Error ? error.message : "Failed to save patients";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
