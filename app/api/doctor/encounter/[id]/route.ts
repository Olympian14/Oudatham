import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "DOCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();

    // Upsert the CaseSheet
    await prisma.caseSheet.upsert({
      where: { encounterId: id },
      update: { jsonData: JSON.stringify(data) },
      create: { encounterId: id, jsonData: JSON.stringify(data) }
    });

    const encounter = await prisma.encounter.findUnique({ where: { id } });
    if (encounter) {
      if (data.isAdmitted && encounter.status !== "ADMITTED") {
        await prisma.encounter.update({ where: { id }, data: { status: "ADMITTED" } });
      } else if (!data.isAdmitted && encounter.status === "ADMITTED") {
        await prisma.encounter.update({ where: { id }, data: { status: "IN_CONSULTATION" } });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save case sheet", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
