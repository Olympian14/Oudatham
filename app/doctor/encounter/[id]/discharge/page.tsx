import React from "react";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DischargeClient from "./client";

export default async function DischargeSummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const encounter = await prisma.encounter.findUnique({
    where: { id },
    include: {
      patient: true,
      caseSheet: true,
    }
  });

  if (!encounter || !encounter.caseSheet) return redirect("/doctor/queue");

  const patientData = JSON.parse(encounter.caseSheet.jsonData);

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <DischargeClient 
          encounterId={id} 
          initialPatientData={patientData} 
          patientDetails={encounter.patient}
        />
      </div>
    </div>
  );
}
