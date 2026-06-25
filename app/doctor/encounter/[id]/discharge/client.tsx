"use client";

import React, { useState, useEffect } from "react";
import { Patient, PrescriptionItem } from "@/lib/types";
import { Printer, Save, Plus, X, Pill, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface DischargeClientProps {
  encounterId: string;
  initialPatientData: Patient;
  patientDetails: any;
}

export default function DischargeClient({ encounterId, initialPatientData, patientDetails }: DischargeClientProps) {
  const [patient, setPatient] = useState<Patient>(initialPatientData);
  const [saving, setSaving] = useState(false);
  
  const [newRx, setNewRx] = useState<Partial<PrescriptionItem>>({});
  
  // Debounce save
  useEffect(() => {
    const timer = setTimeout(async () => {
      setSaving(true);
      try {
        await fetch(`/api/doctor/encounter/${encounterId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patient),
        });
      } catch (err) {
        console.error("Failed to save discharge summary");
      }
      setSaving(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [patient, encounterId]);

  const updateCourse = (val: string) => setPatient(prev => ({ ...prev, dischargeCourse: val }));

  const addMed = () => {
    if (!newRx.name) return;
    const px: PrescriptionItem = { 
      id: crypto.randomUUID(), 
      name: newRx.name, 
      dosage: newRx.dosage || "1 Tab", 
      frequency: newRx.frequency || "OD", 
      duration: newRx.duration || "5 days", 
      instructions: newRx.instructions || "", 
      route: "Oral" 
    };
    setPatient(prev => ({ ...prev, dischargeMedications: [...(prev.dischargeMedications || []), px] }));
    setNewRx({});
  };

  const removeMed = (idx: number) => {
    setPatient(prev => ({ ...prev, dischargeMedications: (prev.dischargeMedications || []).filter((_, i) => i !== idx) }));
  };

  const getNormal = (val: any, defaultText = "None reported") => {
    if (!val) return defaultText;
    if (typeof val === "string") return val.trim() || defaultText;
    if (Array.isArray(val) && val.length > 0) return val.map(v => typeof v === 'object' ? v.text || v.name : v).join(", ");
    if (typeof val === "object" && Object.keys(val).length > 0) return JSON.stringify(val);
    return defaultText;
  };

  return (
    <>
      {/* Non-Printable UI Actions */}
      <div className="print:hidden mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link href={`/doctor/encounter/${encounterId}`} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Encounter
        </Link>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            {saving ? <span className="animate-pulse">Saving...</span> : <span className="text-emerald-600 flex items-center gap-1"><Save className="w-4 h-4"/> Saved</span>}
          </div>
          <button onClick={() => window.print()} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg transition">
            <Printer className="w-5 h-5" /> Print Summary
          </button>
        </div>
      </div>

      {/* Editor & Print Layout */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-none print:rounded-none p-8 print:p-0">
        
        {/* Header */}
        <div className="border-b-4 border-indigo-600 pb-6 mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">DISCHARGE SUMMARY</h1>
            <p className="text-slate-500 font-medium mt-1">Socrates Healthcare System</p>
          </div>
          <div className="text-right text-sm font-medium text-slate-600">
            <p>Date: {new Date().toLocaleDateString()}</p>
            <p>Encounter: #{encounterId.split("-")[0].toUpperCase()}</p>
          </div>
        </div>

        {/* Patient Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-slate-50 rounded-xl print:bg-transparent print:p-0 print:border-b print:border-slate-300 print:rounded-none">
          <div><p className="text-[10px] uppercase font-bold text-slate-400">Patient Name</p><p className="font-bold text-slate-900">{patientDetails.name}</p></div>
          <div><p className="text-[10px] uppercase font-bold text-slate-400">Age / Sex</p><p className="font-bold text-slate-900">{patientDetails.age || patient.demo?.age} / {patientDetails.gender || patient.demo?.sex}</p></div>
          <div><p className="text-[10px] uppercase font-bold text-slate-400">Patient ID</p><p className="font-bold text-slate-900">{patientDetails.patientUid}</p></div>
          <div><p className="text-[10px] uppercase font-bold text-slate-400">Admission Date</p><p className="font-bold text-slate-900">{new Date(patient.createdAt).toLocaleDateString()}</p></div>
        </div>

        {/* Clinical Info (Read Only in both views) */}
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-sm font-bold text-indigo-600 uppercase border-b border-slate-200 pb-1 mb-2">Diagnosis</h3>
            <p className="text-slate-800">{getNormal(patient.diagnosis)}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-indigo-600 uppercase border-b border-slate-200 pb-1 mb-2">Chief Complaints</h3>
            <p className="text-slate-800">{getNormal(patient.cc)}</p>
          </div>
        </div>

        {/* Course in Hospital */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-indigo-600 uppercase border-b border-slate-200 pb-1 mb-3">Course in Hospital</h3>
          
          <div className="print:hidden">
            <textarea 
              value={patient.dischargeCourse || ""} 
              onChange={(e) => updateCourse(e.target.value)}
              rows={6} 
              placeholder="Detail the patient's course during the hospital stay, interventions performed, and progress..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-sm transition"
            />
          </div>
          
          <div className="hidden print:block whitespace-pre-wrap text-slate-800 text-sm">
            {patient.dischargeCourse || "No course documented."}
          </div>
        </div>

        {/* Discharge Medications */}
        <div>
          <h3 className="text-sm font-bold text-indigo-600 uppercase border-b border-slate-200 pb-1 mb-4">Discharge Medications</h3>
          
          {/* Editor Mode */}
          <div className="print:hidden mb-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Drug Name</label>
                  <input type="text" value={newRx.name || ""} onChange={(e) => setNewRx({ ...newRx, name: e.target.value })} placeholder="e.g. Amoxicillin" className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Dosage</label>
                  <input type="text" value={newRx.dosage || ""} onChange={(e) => setNewRx({ ...newRx, dosage: e.target.value })} placeholder="500mg" className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Frequency</label>
                  <input type="text" value={newRx.frequency || ""} onChange={(e) => setNewRx({ ...newRx, frequency: e.target.value })} placeholder="TDS" className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Duration</label>
                  <input type="text" value={newRx.duration || ""} onChange={(e) => setNewRx({ ...newRx, duration: e.target.value })} placeholder="5 days" className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div className="md:col-span-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Instructions</label>
                  <input type="text" value={newRx.instructions || ""} onChange={(e) => setNewRx({ ...newRx, instructions: e.target.value })} placeholder="After meals" className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <button onClick={addMed} disabled={!newRx.name} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-1"><Plus className="w-4 h-4"/> Add</button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              {(patient.dischargeMedications || []).map((rx, idx) => (
                <div key={rx.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white">
                  <div>
                    <p className="font-bold text-sm text-slate-900">{rx.name} <span className="text-indigo-600">{rx.dosage}</span></p>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">{rx.frequency} • {rx.duration} {rx.instructions && `• ${rx.instructions}`}</p>
                  </div>
                  <button onClick={() => removeMed(idx)} className="text-slate-400 hover:text-red-500"><X className="w-5 h-5"/></button>
                </div>
              ))}
            </div>
          </div>

          {/* Print Mode */}
          <div className="hidden print:block">
            {!(patient.dischargeMedications || []).length ? (
              <p className="text-slate-500 text-sm italic">No medications prescribed at discharge.</p>
            ) : (
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300">
                    <th className="py-2 font-bold uppercase text-[10px] text-slate-500">Drug & Dosage</th>
                    <th className="py-2 font-bold uppercase text-[10px] text-slate-500">Frequency</th>
                    <th className="py-2 font-bold uppercase text-[10px] text-slate-500">Duration</th>
                    <th className="py-2 font-bold uppercase text-[10px] text-slate-500">Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.dischargeMedications!.map((rx, idx) => (
                    <tr key={idx} className="border-b border-slate-200">
                      <td className="py-3 font-semibold text-slate-900">{rx.name} <span className="text-slate-500 font-normal">{rx.dosage}</span></td>
                      <td className="py-3 text-slate-700">{rx.frequency}</td>
                      <td className="py-3 text-slate-700">{rx.duration}</td>
                      <td className="py-3 text-slate-700">{rx.instructions || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Footer Signature Block */}
        <div className="hidden print:flex mt-16 justify-between items-end border-t border-slate-200 pt-8">
          <div className="text-xs text-slate-500 font-medium">
            <p>Generated by Socrates Healthcare System</p>
            <p>Page 1 of 1</p>
          </div>
          <div className="text-center">
            <div className="w-48 border-b border-slate-400 mb-2"></div>
            <p className="font-bold text-slate-800 text-sm">Consultant Signature</p>
          </div>
        </div>

      </div>
    </>
  );
}
