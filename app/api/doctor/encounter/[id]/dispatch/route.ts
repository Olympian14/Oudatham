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
    const body = await req.json();
    const { type, payload } = body;

    if (type === "pharmacy") {
      // payload is prescriptions array
      await prisma.prescription.deleteMany({
        where: { encounterId: id, status: "PENDING", type: "OUTPATIENT" }
      });
      if (payload && payload.length > 0) {
        await prisma.prescription.createMany({
          data: payload.map((p: any) => ({
            encounterId: id,
            drugName: p.name,
            dose: p.dosage,
            frequency: p.frequency,
            duration: p.duration,
            instructions: p.instructions,
            route: p.route || "Oral",
            status: "PENDING"
          }))
        });
      }
    } else if (type === "inpatient_pharmacy") {
      // payload is prescriptions array
      await prisma.prescription.deleteMany({
        where: { encounterId: id, status: "PENDING", type: "INPATIENT" }
      });
      if (payload && payload.length > 0) {
        await prisma.prescription.createMany({
          data: payload.map((p: any) => ({
            encounterId: id,
            drugName: p.name,
            dose: p.dosage,
            frequency: p.frequency,
            duration: p.duration,
            instructions: p.instructions,
            route: p.route || "Oral",
            status: "PENDING",
            type: "INPATIENT"
          }))
        });
      }
    } else if (type === "lab") {
      // payload is array of InvestigationItem
      await prisma.investigation.deleteMany({
        where: { encounterId: id, status: "PENDING" }
      });
      if (payload && payload.length > 0) {
        const now = Date.now();
        await prisma.investigation.createMany({
          data: payload.map((inv: any, i: number) => ({
            invUid: `INV-${now}-${i}`,
            encounterId: id,
            testName: inv.name,
            category: "Laboratory",
            status: "PENDING"
          }))
        });
      }
    } else if (type === "radiology") {
      // payload is array of InvestigationItem
      await prisma.imagingOrder.deleteMany({
        where: { encounterId: id, status: "PENDING" }
      });
      if (payload && payload.length > 0) {
        const now = Date.now();
        await prisma.imagingOrder.createMany({
          data: payload.map((inv: any, i: number) => ({
            orderUid: `IMG-${now}-${i}`,
            encounterId: id,
            modality: "Radiology",
            bodyPart: inv.name,
            status: "PENDING"
          }))
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to dispatch orders", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
