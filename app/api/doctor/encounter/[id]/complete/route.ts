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

    // 1. Mark as completed
    await prisma.encounter.update({
      where: { id },
      data: { status: "COMPLETED" }
    });

    // 2. Normalize JSON Data to Database tables
    const caseSheet = await prisma.caseSheet.findUnique({ where: { encounterId: id } });
    if (caseSheet && caseSheet.jsonData) {
      const data = JSON.parse(caseSheet.jsonData as string);
      
      // Save Prescriptions (status defaults to PENDING for pharmacy)
      if (data.prescriptions && Array.isArray(data.prescriptions)) {
        for (const px of data.prescriptions) {
          await prisma.prescription.create({
            data: {
              encounterId: id,
              drugName: px.name || px.drugName || "Unknown",
              dose: px.dosage || px.dose || "",
              frequency: px.frequency || "",
              duration: px.duration || "",
              route: px.route || "Oral",
              instructions: px.instructions || "",
              status: "PENDING",
            }
          });
        }
      }

      // Save Investigations (Lab orders)
      if (data.prescribedInvestigations && data.prescribedInvestigations.trim() !== "") {
        const year = new Date().getFullYear();
        const invCount = await prisma.investigation.count();
        const invUid = `INV-${year}-${String(invCount + 1).padStart(3, '0')}`;
        
        await prisma.investigation.create({
          data: {
            invUid,
            encounterId: id,
            testName: "Comprehensive Labs",
            category: "General",
            status: "PENDING",
            result: data.prescribedInvestigations,
          }
        });
      }

      // Save Imaging Orders (Radiology)
      if (data.imagingOrders && Array.isArray(data.imagingOrders)) {
        for (const img of data.imagingOrders) {
          const year = new Date().getFullYear();
          const imgCount = await prisma.imagingOrder.count();
          const orderUid = `IMG-${year}-${String(imgCount + 1).padStart(3, '0')}`;

          await prisma.imagingOrder.create({
            data: {
              orderUid,
              encounterId: id,
              modality: img.modality || "X-Ray",
              bodyPart: img.bodyPart || img.region || "Chest",
              indication: img.indication || "",
              status: "PENDING",
            }
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Complete encounter error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
