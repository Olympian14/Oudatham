import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import WardChart from "./ward-chart";

export default async function InpatientPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "DOCTOR") redirect("/auth/login");

  const { id } = await params;

  const encounter = await prisma.encounter.findUnique({
    where: { id },
    include: {
      patient: true,
      caseSheet: true,
      prescriptions: { orderBy: { drugName: "asc" } },
      investigations: { orderBy: { createdAt: "desc" } },
      imagingOrders: { orderBy: { createdAt: "desc" } },
      progressNotes: { orderBy: { date: "desc" } },
    },
  });

  if (!encounter || encounter.status !== "ADMITTED") redirect("/doctor/queue?view=inpatient");

  // Parse case sheet for diagnosis and CC
  let caseData: any = {};
  if (encounter.caseSheet?.jsonData) {
    try {
      caseData = JSON.parse(encounter.caseSheet.jsonData as string);
    } catch {}
  }

  return (
    <WardChart
      encounterId={id}
      patient={encounter.patient}
      diagnosis={caseData.diagnosis || caseData.provisionalDx || "—"}
      chiefComplaints={
        Array.isArray(caseData.cc)
          ? caseData.cc.map((c: any) => (typeof c === "object" ? c.text : c)).filter(Boolean).join(", ")
          : caseData.cc || "—"
      }
      currentOrders={encounter.prescriptions.filter((p) => p.type === "INPATIENT")}
      investigations={encounter.investigations.map((i) => ({ ...i, createdAt: i.createdAt.toISOString() }))}
      imagingOrders={encounter.imagingOrders.map((i) => ({ ...i, createdAt: i.createdAt.toISOString() }))}
      progressNotes={encounter.progressNotes.map((n) => ({
        ...n,
        date: n.date.toISOString(),
        createdAt: n.createdAt.toISOString(),
      }))}
      admissionDate={encounter.createdAt.toISOString()}
    />
  );
}
