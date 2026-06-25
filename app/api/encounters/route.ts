import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PATIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const patient = await prisma.patient.findUnique({ where: { id: session.id } });
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const year = new Date().getFullYear();
    const count = await prisma.encounter.count();
    const encounterUid = `ENC-${year}-${String(count + 1).padStart(5, '0')}`;

    let department = "General Medicine";
    try {
      const body = await req.json();
      if (body.department) department = body.department;
    } catch { /* no body is fine, use default */ }

    const encounter = await prisma.encounter.create({
      data: {
        encounterUid,
        patientId: patient.id,
        department,
        status: "WAITING"
      }
    });

    return NextResponse.json({ success: true, encounter });
  } catch (error) {
    console.error("Booking error", error);
    return NextResponse.json({ error: "Failed to book appointment" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PATIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const encounters = await prisma.encounter.findMany({
      where: { patientId: session.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(encounters);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch encounters" }, { status: 500 });
  }
}
