"use client";
import React, { useState } from "react";
import { Patient, PrescriptionItem } from "@/lib/types";
import { getPatientContext } from "@/lib/utils";
import { Sparkles, Activity, FileText, Pill, Plus, X, CheckCircle2 } from "lucide-react";
import SuggestionInput from "./suggestion-input";

interface DiagnosisManagementProps {
  patient: Patient;
  onUpdatePatient: (updated: Patient) => void;
}

const COMMON_DRUGS = [
  "Paracetamol", "Amoxicillin", "Azithromycin", "Pantoprazole",
  "Ibuprofen", "Amlodipine", "Metformin", "Atorvastatin",
  "Losartan", "Levothyroxine", "Cetirizine", "Salbutamol Inhaler"
];

const COMMON_DIAGNOSES = [
  "Essential Hypertension", "Type 2 Diabetes Mellitus", "Acute Upper Respiratory Infection",
  "Acute Bronchitis", "Asthma", "Gastroesophageal Reflux Disease",
  "Urinary Tract Infection", "Migraine", "Osteoarthritis", "Anxiety Disorder"
];

const COMMON_INVESTIGATIONS = [
  "Complete Blood Count (CBC)", "Basic Metabolic Panel (BMP)", "Comprehensive Metabolic Panel (CMP)",
  "Lipid Panel", "HbA1c", "Thyroid Stimulating Hormone (TSH)",
  "Urinalysis", "Chest X-Ray (CXR)", "Electrocardiogram (ECG)", "Liver Function Test (LFT)"
];

const DOSAGES = ["5mg", "10mg", "20mg", "40mg", "50mg", "250mg", "500mg", "1g"];
const FREQUENCIES = ["OD (Once daily)", "BD (Twice daily)", "TDS (Thrice daily)", "QID (Four times a day)", "SOS (As needed)", "Stat (Immediately)"];
const DURATIONS = ["3 days", "5 days", "7 days", "14 days", "1 month", "Ongoing"];

export default function DiagnosisManagement({ patient, onUpdatePatient }: DiagnosisManagementProps) {
  const [error, setError] = useState<string | null>(null);

  // New Prescription State
  const [newRx, setNewRx] = useState<Partial<PrescriptionItem>>({
    name: "", dosage: "", frequency: "BD (Twice daily)", duration: "5 days", instructions: ""
  });

  const updateDiagnosis = (val: string) => onUpdatePatient({ ...patient, status: "in-progress", diagnosis: val });
  const updateInvestigations = (val: string) => onUpdatePatient({ ...patient, status: "in-progress", prescribedInvestigations: val });

  const generateAI = async (field: "diagnosis" | "prescribedInvestigations" | "managementPlan", promptType: string) => {
    setError(null);
    onUpdatePatient({ ...patient, loading: true });
    
    const prompts: Record<string, string> = {
      differentials: `Generate structured differentials based on history and examination. TOP 3 DIFFERENTIALS (most likely first):\n1. [Diagnosis] - Clinical reasoning - Supporting evidence.\nBe rigorous.`,
      investigations: `Generate structured investigations plan:\n1. URGENT: Immediate first-line with rationales.\n2. CONFIRMATORY: Labs, cultures, imaging.\nState expected abnormal findings.`,
      prescriptions: `Suggest a pharmacological management plan (drugs, dosages, frequencies, duration) for the most likely diagnosis.`
    };
    
    const ctx = getPatientContext(patient);
    const systemInstruction = `You are a chief consulting physician. Formulate specific clinical workflows. Patient context:\n${ctx}`;
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompts[promptType] }], systemInstruction, model: "gemini-2.5-flash" }),
      });
      if (!response.ok) throw new Error("Failed to generate.");
      const data = await response.json();
      onUpdatePatient({ ...patient, [field]: data.text, loading: false });
    } catch (err: any) {
      setError("AI generation failed.");
      onUpdatePatient({ ...patient, loading: false });
    }
  };

  const addPrescription = () => {
    if (!newRx.name) return;
    const rx: PrescriptionItem = { 
      id: Date.now().toString(), 
      name: newRx.name || "", 
      dosage: newRx.dosage || "", 
      frequency: newRx.frequency || "", 
      duration: newRx.duration || "", 
      route: "", 
      instructions: newRx.instructions || "" 
    };
    onUpdatePatient({ ...patient, status: "in-progress", prescriptions: [...(patient.prescriptions || []), rx] });
    setNewRx({ name: "", dosage: "", frequency: "BD (Twice daily)", duration: "5 days", instructions: "" });
  };

  const removeRx = (idx: number) => {
    const arr = (patient.prescriptions || []).filter((_, i) => i !== idx);
    onUpdatePatient({ ...patient, status: "in-progress", prescriptions: arr });
  };

  const markComplete = () => {
    onUpdatePatient({ ...patient, status: "complete" });
  };

  const px = patient.prescriptions || [];

  return (
    <div id="diagnosis-management-component" className="space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Activity className="w-6 h-6 text-indigo-400" /> Diagnosis & Management
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Formulate differentials, order investigations, and manage prescriptions.</p>
      </div>

      {error && <div className="p-4 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-xs">{error}</div>}

      {/* Differential Diagnosis */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4.5 h-4.5" /> Differential Diagnosis
          </h3>
          <button onClick={() => generateAI("diagnosis", "differentials")} disabled={patient.loading}
            className="inline-flex items-center gap-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg transition">
            <Sparkles className={`w-3 h-3 ${patient.loading ? "animate-spin" : ""}`} /> {patient.loading ? "Generating..." : "AI Generate"}
          </button>
        </div>
        <SuggestionInput 
          value={patient.diagnosis || ""} 
          onChange={updateDiagnosis} 
          textarea={true}
          rows={5} 
          placeholder="Document the primary diagnosis and top differentials..."
          suggestions={COMMON_DIAGNOSES}
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/15 text-sm transition font-medium resize-y" 
        />
      </section>

      {/* Investigations */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4.5 h-4.5" /> Investigations
          </h3>
          <button onClick={() => generateAI("prescribedInvestigations", "investigations")} disabled={patient.loading}
            className="inline-flex items-center gap-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg transition">
            <Sparkles className={`w-3 h-3 ${patient.loading ? "animate-spin" : ""}`} /> {patient.loading ? "Generating..." : "AI Generate"}
          </button>
        </div>
        <SuggestionInput 
          value={patient.prescribedInvestigations || ""} 
          onChange={updateInvestigations} 
          textarea={true}
          rows={5} 
          placeholder="Order labs, imaging, and urgent bedside tests..."
          suggestions={COMMON_INVESTIGATIONS}
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/15 text-sm transition font-medium resize-y" 
        />
      </section>

      {/* Prescriptions */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Pill className="w-4.5 h-4.5" /> Prescriptions
          </h3>
          <button onClick={() => generateAI("managementPlan", "prescriptions")} disabled={patient.loading}
            className="inline-flex items-center gap-1.5 bg-amber-600/10 hover:bg-amber-600/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg transition">
            <Sparkles className={`w-3 h-3 ${patient.loading ? "animate-spin" : ""}`} /> {patient.loading ? "Suggest Drugs" : "AI Generate"}
          </button>
        </div>

        {patient.managementPlan && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200/80 text-sm whitespace-pre-wrap font-mono leading-relaxed">
            {patient.managementPlan}
          </div>
        )}

        {/* New Prescription Form (Horizontal) */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-inner mb-6">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800/80 pb-3 mb-4">New Prescription</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-500">Drug Name</label>
              <SuggestionInput value={newRx.name || ""} onChange={(val) => setNewRx({ ...newRx, name: val })} placeholder="e.g. Paracetamol" suggestions={COMMON_DRUGS} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm transition" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-500">Dosage</label>
              <input type="text" value={newRx.dosage || ""} onChange={(e) => setNewRx({ ...newRx, dosage: e.target.value })} placeholder="Custom dosage..." className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm transition" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-500">Frequency</label>
              <SuggestionInput value={newRx.frequency || ""} onChange={(val) => setNewRx({ ...newRx, frequency: val })} placeholder="BD, TDS..." suggestions={FREQUENCIES} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm transition" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-500">Duration</label>
              <SuggestionInput value={newRx.duration || ""} onChange={(val) => setNewRx({ ...newRx, duration: val })} placeholder="5 days..." suggestions={DURATIONS} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm transition" />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-4">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-500">Instructions</label>
              <input type="text" value={newRx.instructions || ""} onChange={(e) => setNewRx({ ...newRx, instructions: e.target.value })} placeholder="e.g. After meals" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm transition" />
            </div>
            <div className="md:col-span-1">
              <button onClick={addPrescription} disabled={!newRx.name} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 dark:disabled:text-slate-600 font-bold py-2 rounded-lg shadow-md transition text-sm border border-transparent disabled:border-slate-300 dark:disabled:border-slate-700">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Added Prescriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {px.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center text-slate-600 dark:text-slate-500 py-10 bg-slate-50/40 dark:bg-slate-950/40 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
              <Pill className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-sm font-medium">No active prescriptions.</p>
              <p className="text-xs mt-1">Use the entry form above to add drugs.</p>
            </div>
          ) : (
            px.map((rx, idx) => (
              <div key={rx.id} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex gap-4 relative shadow-sm group items-start">
                <div className="w-10 h-10 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/25 shrink-0">
                  <Pill className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{rx.name} <span className="text-indigo-400">{rx.dosage}</span></h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                    {rx.frequency} • {rx.duration}
                  </p>
                  {rx.instructions && (
                    <p className="text-xs text-slate-600 dark:text-slate-500 mt-1 bg-white dark:bg-slate-900 px-2 py-1 rounded inline-block border border-slate-200/60 dark:border-slate-800/60">{rx.instructions}</p>
                  )}
                </div>
                <button onClick={() => removeRx(idx)} className="p-1.5 text-slate-600 dark:text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition opacity-0 group-hover:opacity-100 shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Completion */}
      <div className="flex justify-end pt-4">
        <button onClick={markComplete} disabled={patient.status === "complete"}
          className={`inline-flex items-center gap-2 py-3 px-6 rounded-xl font-bold shadow-lg transition ${patient.status === "complete" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40"}`}>
          <CheckCircle2 className="w-5 h-5" />
          {patient.status === "complete" ? "Encounter Finalized" : "Complete Encounter"}
        </button>
      </div>
    </div>
  );
}
