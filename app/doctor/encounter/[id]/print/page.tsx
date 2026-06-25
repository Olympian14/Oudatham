import React from "react";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Patient, PrescriptionItem } from "@/lib/types";

export default async function PrintCaseSheet({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const encounter = await prisma.encounter.findUnique({
    where: { id },
    include: { patient: true }
  });

  if (!encounter) return redirect("/doctor/queue");

  const caseSheetRecord = await prisma.caseSheet.findUnique({ where: { encounterId: id } });
  let data: Partial<Patient> = {};
  if (caseSheetRecord && caseSheetRecord.jsonData) {
    data = JSON.parse(caseSheetRecord.jsonData as string);
  }

  // Auto-fill defaults for printing
  const getNormal = (val: any, defaultText = "None reported") => {
    if (!val) return defaultText;
    if (typeof val === "string") return val.trim() !== "" ? val : defaultText;
    if (Array.isArray(val)) return val.length > 0 ? val.join(", ") : defaultText;
    return String(val);
  };
  
  const vitals = data.vit || {};
  const sysReview = data.sys || {};
  const exam = data.exam || {};
  const demo = data.demo || { name: encounter.patient.name, age: encounter.patient.age, sex: encounter.patient.gender?.[0] };

  return (
    <div className="bg-white min-h-screen text-black p-8 font-serif max-w-4xl mx-auto">
      {/* Auto print on load */}
      <script dangerouslySetInnerHTML={{ __html: `window.onload = function() { window.print(); }` }} />

      {/* Header */}
      <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase">Oudatham Hospital</h1>
          <p className="text-sm italic">Comprehensive Clinical Case Sheet</p>
        </div>
        <div className="text-right text-sm">
          <p><strong>Date:</strong> {new Date(encounter.createdAt).toLocaleDateString()}</p>
          <p><strong>Encounter:</strong> {encounter.encounterUid}</p>
          <p><strong>Dept:</strong> {encounter.department}</p>
        </div>
      </div>

      {/* Demographics */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase tracking-wide">Patient Demographics</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Name:</strong> {demo.name || "Unknown"}</div>
          <div><strong>Age / Sex:</strong> {demo.age || "?"}y / {demo.sex || "?"}</div>
          <div><strong>Occupation:</strong> {getNormal(demo.occ, "Not specified")}</div>
          <div><strong>Address:</strong> {getNormal(demo.addr, "Not specified")}</div>
        </div>
      </section>

      {/* Complaints & History */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase tracking-wide">Chief Complaints & History</h2>
        <div className="text-sm space-y-3">
          <div>
            <strong>Chief Complaints:</strong>
            <p className="whitespace-pre-wrap mt-1">{getNormal(data.cc)}</p>
          </div>
          <div>
            <strong>History of Presenting Illness (HPI):</strong>
            <p className="whitespace-pre-wrap mt-1">{getNormal(data.hpi)}</p>
          </div>
        </div>
      </section>

      {/* Background History */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase tracking-wide">Background History</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Past Medical:</strong> {getNormal(data.pmh)}</div>
          <div><strong>Past Surgical:</strong> {getNormal(data.psh)}</div>
          <div><strong>Family History:</strong> {getNormal(data.fh)}</div>
          <div><strong>Personal/Diet:</strong> {getNormal(data.ph)}</div>
          <div><strong>Drug/Allergies:</strong> {getNormal(data.dh)}</div>
          <div><strong>Immunization:</strong> {getNormal(data.imm, "Up to date")}</div>
        </div>
      </section>

      {/* Examination */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase tracking-wide">Clinical Examination</h2>
        
        <div className="mb-4">
          <strong className="text-sm">Vitals:</strong>
          <div className="grid grid-cols-3 gap-2 mt-1 text-sm bg-gray-50 p-2 border border-gray-200">
            <div><strong>PR:</strong> {getNormal(vitals.pu, "Normal")}</div>
            <div><strong>BP:</strong> {getNormal(vitals.bp, "Normal")}</div>
            <div><strong>RR:</strong> {getNormal(vitals.rr, "Normal")}</div>
            <div><strong>Temp:</strong> {getNormal(vitals.tp, "Normal")}</div>
            <div><strong>SpO2:</strong> {getNormal(vitals.sp, "Normal")}</div>
            <div><strong>BMI:</strong> {getNormal(vitals.bm, "Normal")}</div>
          </div>
        </div>

        <div className="text-sm space-y-2">
          <p><strong>General Examination:</strong> {getNormal(exam.gen, "Conscious, oriented, no acute distress.")}</p>
          <p><strong>Systemic Examination:</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>CVS:</strong> {getNormal(sysReview.cvs, "S1 S2 heard, no murmurs")}</li>
            <li><strong>RS:</strong> {getNormal(sysReview.rs, "Bilateral vesicular breath sounds, no added sounds")}</li>
            <li><strong>PA:</strong> {getNormal(sysReview.pa, "Soft, non-tender, no organomegaly")}</li>
            <li><strong>CNS:</strong> {getNormal(sysReview.cns, "No focal neurological deficits")}</li>
          </ul>
        </div>
      </section>

      {/* Diagnosis & Investigations */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase tracking-wide">Diagnosis & Investigations</h2>
        <div className="text-sm space-y-3">
          <div>
            <strong>Primary/Differential Diagnosis:</strong>
            <p className="whitespace-pre-wrap mt-1 font-semibold">{getNormal(data.diagnosis, "Pending evaluation")}</p>
          </div>
          <div>
            <strong>Ordered Investigations:</strong>
            <p className="whitespace-pre-wrap mt-1">{getNormal(data.prescribedInvestigations, "None ordered")}</p>
          </div>
        </div>
      </section>

      {/* Prescriptions */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase tracking-wide">Prescriptions & Management</h2>
        
        {data.managementPlan && (
          <div className="text-sm mb-4">
            <strong>Plan:</strong>
            <p className="whitespace-pre-wrap mt-1">{data.managementPlan}</p>
          </div>
        )}

        {data.prescriptions && data.prescriptions.length > 0 ? (
          <table className="w-full text-sm border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Drug Name</th>
                <th className="border border-gray-300 p-2 text-left">Dosage & Freq</th>
                <th className="border border-gray-300 p-2 text-left">Duration</th>
                <th className="border border-gray-300 p-2 text-left">Instructions</th>
              </tr>
            </thead>
            <tbody>
              {data.prescriptions.map((px: PrescriptionItem, i: number) => (
                <tr key={i}>
                  <td className="border border-gray-300 p-2 font-bold">{px.name}</td>
                  <td className="border border-gray-300 p-2">{px.dosage} - {px.frequency}</td>
                  <td className="border border-gray-300 p-2">{px.duration}</td>
                  <td className="border border-gray-300 p-2">{px.instructions || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm italic text-gray-500 mb-4">No outpatient medications prescribed.</p>
        )}

        {/* Inpatient Orders */}
        {data.isAdmitted && (
          <div>
            <h3 className="text-md font-bold mb-2">Inpatient Ward Orders</h3>
            {data.inpatientPrescriptions && data.inpatientPrescriptions.length > 0 ? (
              <table className="w-full text-sm border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-red-50">
                    <th className="border border-gray-300 p-2 text-left">Drug Name</th>
                    <th className="border border-gray-300 p-2 text-left">Dosage & Freq</th>
                    <th className="border border-gray-300 p-2 text-left">Route</th>
                    <th className="border border-gray-300 p-2 text-left">Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.inpatientPrescriptions.map((px: PrescriptionItem, i: number) => (
                    <tr key={i}>
                      <td className="border border-gray-300 p-2 font-bold">{px.name}</td>
                      <td className="border border-gray-300 p-2">{px.dosage} - {px.frequency}</td>
                      <td className="border border-gray-300 p-2">{px.route || "IV"}</td>
                      <td className="border border-gray-300 p-2">{px.instructions || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm italic text-gray-500">No specific inpatient drugs ordered yet.</p>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-gray-300 flex justify-between items-end">
        <div className="text-sm">
          <p><strong>Status:</strong> {encounter.status}</p>
          <p><strong>Printed:</strong> {new Date().toLocaleString()}</p>
        </div>
        <div className="text-center">
          <div className="w-48 border-b border-black mb-2"></div>
          <p className="text-sm font-bold">Doctor Signature</p>
        </div>
      </div>
    </div>
  );
}
