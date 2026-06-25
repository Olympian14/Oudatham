import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EncounterShell from "./encounter-shell";

export default async function EncounterPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "DOCTOR") redirect("/auth/login");

  const { id } = await params;

  const encounter = await prisma.encounter.findUnique({
    where: { id },
    include: {
      patient: true,
      caseSheet: true
    }
  });

  if (!encounter) redirect("/doctor/queue");

  // Default empty state mapped from DB
  let initialData: any = {
    id: encounter.id,
    createdAt: encounter.createdAt.toISOString().split("T")[0],
    status: encounter.status,
    demo: {
      name: encounter.patient.name,
      age: encounter.patient.age?.toString() || "",
      sex: encounter.patient.gender,
      addr: encounter.patient.address || "",
      occ: ""
    },
    cc: [{ text: "", durNum: "", durUnit: "days" }],
    hxPhase: "hpi",
    hpiOpen: {}, hpiData: {}, customHpi: {}, selectedSystems: [], sysData: {},
    sysPos: {}, sysNeg: {}, sysRisk: {}, sysExtra: {},
    past: { sim: "", cond: "", surg: "", rf: "", dm: "", htn: "", tb: "", ibd: "" },
    fam: { det: "", htn_dm: "", cardiac: "", malignancy: "", other: "" },
    per: { sm: "", al: "", dt: "", mn: "", sexual: "", occ_hx: "" },
    drg: { cur: "", allergies: "", otc: "", herbal: "" },
    vit: { pu: "", bp: "", rr: "", tp: "", o2: "", jv: "" },
    sgn: { pallor: false, icterus: false, clubbing: false, cyanosis: false, oedema: false, lymph: false, febrile: false },
    exSystems: [], exData: {}, summaryLoading: false, summaryText: "", summaryGenerated: false,
    provisionalDx: "", chat: [], aiTab: "summary", loading: false, prescriptions: [],
    diagnosis: "", prescribedInvestigations: "", managementPlan: ""
  };

  // Hydrate from DB if CaseSheet exists
  if (encounter.caseSheet && encounter.caseSheet.jsonData) {
    try {
      const parsed = JSON.parse(encounter.caseSheet.jsonData as string);
      initialData = { ...initialData, ...parsed };
    } catch (e) {
      console.error("Failed to parse case sheet data", e);
    }
  }

  // Ensure encounter status is IN_CONSULTATION once opened
  if (encounter.status === "WAITING") {
    await prisma.encounter.update({
      where: { id: encounter.id },
      data: { status: "IN_CONSULTATION" }
    });
  }

  return <EncounterShell encounterId={encounter.id} initialData={initialData} />;
}
