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
    } else if (type === "lab" || type === "radiology") {
      // payload is investigations string
      const tests = (payload || "")
        .split("\n")
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0);

      // We should probably only delete pending ones for the specific category if we want to separate them.
      // But for simplicity, we can delete all pending for this encounter, OR just append. 
      // Given the UX, if they click "Send to Lab", it resyncs the whole list.
      // Let's delete all pending for this encounter for now.
      await prisma.investigation.deleteMany({
        where: { encounterId: id, status: "PENDING" }
      });

      if (tests.length > 0) {
        const now = Date.now();
        await prisma.investigation.createMany({
          data: tests.map((testName: string, i: number) => ({
            invUid: `INV-${now}-${i}`,
            encounterId: id,
            testName,
            category: type === "radiology" ? "Radiology" : "Laboratory",
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
