"use client";
import React, { useState } from "react";
import { Patient, PrescriptionItem } from "@/lib/types";
import { getPatientContext } from "@/lib/utils";
import { Sparkles, Activity, FileText, Pill, Plus, X, CheckCircle2 } from "lucide-react";
import SuggestionInput from "./suggestion-input";

interface DiagnosisManagementProps {
  patient: Patient;
  onUpdatePatient: (updated: Patient) => void;
  encounterId: string;
  onComplete?: () => void;
}

const SMART_DRUGS = [
  { name: "Paracetamol", dosage: "500mg", defaultFreq: "SOS (As needed)", defaultDuration: "3 days", instructions: "After meals" },
  { name: "Amoxicillin", dosage: "500mg", defaultFreq: "TDS (Thrice daily)", defaultDuration: "5 days", instructions: "After meals" },
  { name: "Azithromycin", dosage: "500mg", defaultFreq: "OD (Once daily)", defaultDuration: "3 days", instructions: "Before meals" },
  { name: "Pantoprazole", dosage: "40mg", defaultFreq: "OD (Once daily)", defaultDuration: "5 days", instructions: "Before breakfast" },
  { name: "Ibuprofen", dosage: "400mg", defaultFreq: "BD (Twice daily)", defaultDuration: "3 days", instructions: "After meals" },
  { name: "Amlodipine", dosage: "5mg", defaultFreq: "OD (Once daily)", defaultDuration: "1 month", instructions: "Morning" },
  { name: "Metformin", dosage: "500mg", defaultFreq: "BD (Twice daily)", defaultDuration: "1 month", instructions: "With meals" },
  { name: "Atorvastatin", dosage: "10mg", defaultFreq: "OD (Once daily)", defaultDuration: "1 month", instructions: "At bedtime" },
  { name: "Levothyroxine", dosage: "50mcg", defaultFreq: "OD (Once daily)", defaultDuration: "1 month", instructions: "Early morning, empty stomach" },
  { name: "Cetirizine", dosage: "10mg", defaultFreq: "OD (Once daily)", defaultDuration: "5 days", instructions: "At bedtime" },
];

const COMMON_DRUG_NAMES = SMART_DRUGS.map(d => d.name);

const COMMON_DIAGNOSES = [
  "Essential Hypertension", "Type 2 Diabetes Mellitus", "Acute Upper Respiratory Infection",
  "Acute Bronchitis", "Asthma", "Gastroesophageal Reflux Disease",
  "Urinary Tract Infection", "Migraine", "Osteoarthritis", "Anxiety Disorder"
];

const HEMATO_INV = [
  "Complete Blood Count (CBC)", "Basic Metabolic Panel (BMP)", "Comprehensive Metabolic Panel (CMP)",
  "Lipid Panel", "HbA1c", "Thyroid Stimulating Hormone (TSH)", "Liver Function Test (LFT)", "Urinalysis"
];

const RADIO_INV = [
  "Chest X-Ray (CXR)", "Electrocardiogram (ECG)", "Ultrasound Abdomen", "CT Scan Head", "MRI Brain"
];

const DOSAGES = ["5mg", "10mg", "20mg", "40mg", "50mg", "250mg", "500mg", "1g"];
const FREQUENCIES = ["OD (Once daily)", "BD (Twice daily)", "TDS (Thrice daily)", "QID (Four times a day)", "SOS (As needed)", "Stat (Immediately)"];
const DURATIONS = ["3 days", "5 days", "7 days", "14 days", "1 month", "Ongoing"];

export default function DiagnosisManagement({ patient, onUpdatePatient, encounterId, onComplete }: DiagnosisManagementProps) {
  const [error, setError] = useState<string | null>(null);

  const [newRx, setNewRx] = useState<Partial<PrescriptionItem>>({});
  const [rxQty, setRxQty] = useState("1 Tab");
  const [newInpatientRx, setNewInpatientRx] = useState<Partial<PrescriptionItem>>({});
  const [inpatientRxQty, setInpatientRxQty] = useState("1 Ampoule");
  const [newInv, setNewInv] = useState("");
  const [invTab, setInvTab] = useState<"hemato" | "radio">("hemato");
  const [dispatchStatus, setDispatchStatus] = useState<Record<string, "idle" | "loading" | "success" | "error">>({
    pharmacy: "idle", lab: "idle", radiology: "idle", inpatient_pharmacy: "idle"
  });

  const dispatchOrders = async (type: "pharmacy" | "lab" | "radiology" | "inpatient_pharmacy") => {
    setDispatchStatus({ ...dispatchStatus, [type]: "loading" });
    try {
      let payload;
      if (type === "pharmacy") payload = patient.prescriptions || [];
      else if (type === "inpatient_pharmacy") payload = patient.inpatientPrescriptions || [];
      else if (type === "lab") payload = patient.labInvestigations || [];
      else if (type === "radiology") payload = patient.radiologyInvestigations || [];
      else payload = patient.prescribedInvestigations || "";
      
      const res = await fetch(`/api/doctor/encounter/${encounterId}/dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, payload })
      });
      if (!res.ok) throw new Error("Dispatch failed");
      setDispatchStatus({ ...dispatchStatus, [type]: "success" });
      setTimeout(() => setDispatchStatus(prev => ({ ...prev, [type]: "idle" })), 3000);
    } catch (e) {
      setDispatchStatus(prev => ({ ...prev, [type]: "error" }));
      setTimeout(() => setDispatchStatus(prev => ({ ...prev, [type]: "idle" })), 3000);
    }
  };

  const updateDiagnosis = (val: string) => onUpdatePatient({ ...patient, status: "in-progress", diagnosis: val });
  const updateInvestigations = (val: string) => onUpdatePatient({ ...patient, status: "in-progress", prescribedInvestigations: val });
  const toggleAdmit = () => onUpdatePatient({ ...patient, isAdmitted: !patient.isAdmitted });

  const handleDrugNameChange = (val: string) => {
    const match = SMART_DRUGS.find(d => d.name.toLowerCase() === val.toLowerCase());
    if (match) {
      setNewRx({
        ...newRx,
        name: match.name,
        dosage: match.dosage,
        frequency: match.defaultFreq,
        duration: match.defaultDuration,
        instructions: match.instructions
      });
    } else {
      setNewRx({ ...newRx, name: val });
    }
  };

  const handleInpatientDrugNameChange = (val: string) => {
    const match = SMART_DRUGS.find(d => d.name.toLowerCase() === val.toLowerCase());
    if (match) {
      setNewInpatientRx({
        ...newInpatientRx,
        name: match.name,
        dosage: match.dosage,
        frequency: match.defaultFreq,
        duration: match.defaultDuration,
        instructions: match.instructions
      });
    } else {
      setNewInpatientRx({ ...newInpatientRx, name: val });
    }
  };

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
      id: crypto.randomUUID(), 
      name: newRx.name, 
      dosage: newRx.dosage || rxQty, 
      frequency: newRx.frequency || "OD", 
      duration: newRx.duration || "1 day", 
      route: "Oral", 
      instructions: newRx.instructions || "" 
    };
    onUpdatePatient({ ...patient, status: "in-progress", prescriptions: [...(patient.prescriptions || []), rx] });
    setNewRx({});
    setRxQty("1 Tab");
  };

  const removeRx = (idx: number) => {
    const arr = (patient.prescriptions || []).filter((_, i) => i !== idx);
    onUpdatePatient({ ...patient, status: "in-progress", prescriptions: arr });
  };

  const addInpatientPrescription = () => {
    if (!newInpatientRx.name) return;
    const px: PrescriptionItem = { id: crypto.randomUUID(), name: newInpatientRx.name, dosage: newInpatientRx.dosage || inpatientRxQty, frequency: newInpatientRx.frequency || "Stat", duration: newInpatientRx.duration || "1 dose", instructions: newInpatientRx.instructions || "", route: "IV" };
    onUpdatePatient({ ...patient, inpatientPrescriptions: [...(patient.inpatientPrescriptions || []), px] });
    setNewInpatientRx({});
    setInpatientRxQty("1 Ampoule");
  };

  const removeInpatientRx = (idx: number) => {
    const arr = (patient.inpatientPrescriptions || []).filter((_, i) => i !== idx);
    onUpdatePatient({ ...patient, inpatientPrescriptions: arr });
  };

  const markComplete = async () => {
    if (onComplete) {
      onComplete();
    }
  };

  const px = patient.prescriptions || [];
  const ipx = patient.inpatientPrescriptions || [];

  return (
    <div id="diagnosis-management-component" className="space-y-4 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Diagnosis & Management
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Formulate differentials, order investigations, and manage prescriptions.</p>
      </div>

      {error && <div className="p-4 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-xs">{error}</div>}

      {/* Differential Diagnosis */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-2">
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
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4.5 h-4.5" /> Investigations
          </h3>
          <div className="flex gap-2">
            <button onClick={() => dispatchOrders("lab")} className="inline-flex items-center gap-1.5 bg-sky-600/10 hover:bg-sky-600/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg transition">
              {dispatchStatus.lab === "loading" ? "Sending..." : dispatchStatus.lab === "success" ? "Sent ✓" : "Send to Lab"}
            </button>
            <button onClick={() => dispatchOrders("radiology")} className="inline-flex items-center gap-1.5 bg-fuchsia-600/10 hover:bg-fuchsia-600/20 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-500/30 text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg transition">
              {dispatchStatus.radiology === "loading" ? "Sending..." : dispatchStatus.radiology === "success" ? "Sent ✓" : "Send to Radiology"}
            </button>
          </div>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl gap-1 border border-slate-200 dark:border-slate-800 mb-4">
          <button onClick={() => setInvTab("hemato")} className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition ${invTab === "hemato" ? "bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}>Hematological / Lab</button>
          <button onClick={() => setInvTab("radio")} className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition ${invTab === "radio" ? "bg-white dark:bg-slate-800 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}>Radiological / Imaging</button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {(invTab === "hemato" ? HEMATO_INV : RADIO_INV).map((inv) => (
            <button key={inv} onClick={() => {
              if (invTab === "hemato") {
                if (!(patient.labInvestigations || []).find(i => i.name === inv)) {
                  onUpdatePatient({ ...patient, labInvestigations: [...(patient.labInvestigations || []), { id: crypto.randomUUID(), name: inv, type: "lab", status: "PENDING" }] });
                }
              } else {
                if (!(patient.radiologyInvestigations || []).find(i => i.name === inv)) {
                  onUpdatePatient({ ...patient, radiologyInvestigations: [...(patient.radiologyInvestigations || []), { id: crypto.randomUUID(), name: inv, type: "radiology", status: "PENDING" }] });
                }
              }
            }} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition">{inv}</button>
          ))}
        </div>
        
        <div className="flex gap-2 items-start mb-4">
          <div className="flex-1">
            <input 
              type="text"
              value={newInv} 
              onChange={(e) => setNewInv(e.target.value)} 
              placeholder={`Type custom ${invTab === "hemato" ? "lab" : "radiology"} investigation...`}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm transition font-medium" 
            />
          </div>
          <button onClick={() => {
            if (!newInv.trim()) return;
            if (invTab === "hemato") {
              if (!(patient.labInvestigations || []).find(i => i.name === newInv.trim())) {
                onUpdatePatient({ ...patient, labInvestigations: [...(patient.labInvestigations || []), { id: crypto.randomUUID(), name: newInv.trim(), type: "lab", status: "PENDING" }] });
              }
            } else {
              if (!(patient.radiologyInvestigations || []).find(i => i.name === newInv.trim())) {
                onUpdatePatient({ ...patient, radiologyInvestigations: [...(patient.radiologyInvestigations || []), { id: crypto.randomUUID(), name: newInv.trim(), type: "radiology", status: "PENDING" }] });
              }
            }
            setNewInv("");
          }} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-md transition whitespace-nowrap">Add</button>
        </div>
        
        <div className="space-y-2">
          {(invTab === "hemato" ? (patient.labInvestigations || []) : (patient.radiologyInvestigations || [])).map((inv, idx) => (
            <div key={inv.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{inv.name}</span>
              <button onClick={() => {
                if (invTab === "hemato") {
                  onUpdatePatient({ ...patient, labInvestigations: (patient.labInvestigations || []).filter((_, i) => i !== idx) });
                } else {
                  onUpdatePatient({ ...patient, radiologyInvestigations: (patient.radiologyInvestigations || []).filter((_, i) => i !== idx) });
                }
              }} className="text-slate-400 hover:text-red-500 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {(invTab === "hemato" ? (patient.labInvestigations || []) : (patient.radiologyInvestigations || [])).length === 0 && (
            <p className="text-xs text-slate-500 text-center py-4">No {invTab === "hemato" ? "lab" : "radiology"} investigations added yet.</p>
          )}
        </div>
      </section>

      {/* Prescriptions */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Pill className="w-4.5 h-4.5" /> Prescriptions
          </h3>
          <div className="flex gap-2">
            <button onClick={() => dispatchOrders("pharmacy")} className="inline-flex items-center gap-1.5 bg-orange-600/10 hover:bg-orange-600/20 text-orange-600 dark:text-orange-400 border border-orange-500/30 text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg transition">
              {dispatchStatus.pharmacy === "loading" ? "Sending..." : dispatchStatus.pharmacy === "success" ? "Sent ✓" : "Send to Pharmacy"}
            </button>
            <button onClick={() => generateAI("managementPlan", "prescriptions")} disabled={patient.loading}
              className="inline-flex items-center gap-1.5 bg-amber-600/10 hover:bg-amber-600/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg transition">
              <Sparkles className={`w-3 h-3 ${patient.loading ? "animate-spin" : ""}`} /> {patient.loading ? "Suggest Drugs" : "AI Generate"}
            </button>
          </div>
        </div>

        {patient.managementPlan && (
          <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-900 dark:text-amber-200/80 text-sm whitespace-pre-wrap font-mono leading-relaxed">
            {patient.managementPlan}
          </div>
        )}

        {/* New Prescription Form (Horizontal) */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-inner mb-6">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800/80 pb-3 mb-4">New Prescription</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Drug Name</label>
              <SuggestionInput value={newRx.name || ""} onChange={handleDrugNameChange} placeholder="e.g. Paracetamol" suggestions={COMMON_DRUG_NAMES} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm transition" />
            </div>
            <div className="flex gap-2 md:col-span-1">
              <div className="flex flex-col gap-1.5 w-1/2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Dosage</label>
                <input type="text" value={newRx.dosage || ""} onChange={(e) => setNewRx({ ...newRx, dosage: e.target.value })} placeholder="500mg..." className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm transition" />
              </div>
              <div className="flex flex-col gap-1.5 w-1/2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Qty/Form</label>
                <select value={rxQty} onChange={(e) => setRxQty(e.target.value)} className="w-full px-2 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 text-xs transition">
                  <option value="0.5 Tab">0.5 Tab</option>
                  <option value="1 Tab">1 Tab</option>
                  <option value="2 Tabs">2 Tabs</option>
                  <option value="5 ml">5 ml</option>
                  <option value="10 ml">10 ml</option>
                  <option value="1 Sachet">1 Sachet</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Frequency</label>
              <SuggestionInput value={newRx.frequency || ""} onChange={(val) => setNewRx({ ...newRx, frequency: val })} placeholder="BD, TDS..." suggestions={FREQUENCIES} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm transition" />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Duration</label>
              <SuggestionInput value={newRx.duration || ""} onChange={(val) => setNewRx({ ...newRx, duration: val })} placeholder="5 days..." suggestions={DURATIONS} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm transition" />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-4">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Instructions</label>
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
            <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 py-10 bg-slate-50/40 dark:bg-slate-950/40 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
              <Pill className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-sm font-medium">No active prescriptions.</p>
              <p className="text-xs mt-1">Use the entry form above to add drugs.</p>
            </div>
          ) : (
            px.map((rx, idx) => (
              <div key={rx.id} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex gap-4 relative shadow-sm group items-start">
                <div className="w-10 h-10 rounded-full bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/25 shrink-0">
                  <Pill className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{rx.name} <span className="text-indigo-600 dark:text-indigo-400">{rx.dosage}</span></h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                    {rx.frequency} • {rx.duration}
                  </p>
                  {rx.instructions && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 bg-white dark:bg-slate-900 px-2 py-1 rounded inline-block border border-slate-200/60 dark:border-slate-800/60">{rx.instructions}</p>
                  )}
                </div>
                <button onClick={() => removeRx(idx)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 rounded-md transition opacity-0 group-hover:opacity-100 shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Inpatient Drug Orders Section */}
      {patient.isAdmitted && (
        <section className="bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800/50 rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-rose-200 dark:border-rose-800/50 pb-3">
            <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4.5 h-4.5" /> Inpatient Drug Orders (Ward Chart)
            </h3>
            <button onClick={() => dispatchOrders("inpatient_pharmacy")} className="inline-flex items-center gap-1.5 bg-rose-600/10 hover:bg-rose-600/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg transition">
              {dispatchStatus.inpatient_pharmacy === "loading" ? "Sending..." : dispatchStatus.inpatient_pharmacy === "success" ? "Sent ✓" : "Send to IP Pharmacy"}
            </button>
          </div>

          <div className="bg-white dark:bg-slate-950 border border-rose-200/50 dark:border-rose-800/50 rounded-xl p-4 shadow-inner mb-6">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800/80 pb-3 mb-4">New Inpatient Order</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Drug Name</label>
                <SuggestionInput value={newInpatientRx.name || ""} onChange={handleInpatientDrugNameChange} placeholder="e.g. Ceftriaxone" suggestions={COMMON_DRUG_NAMES} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-rose-500 text-sm transition" />
              </div>
              <div className="flex gap-2 md:col-span-1">
                <div className="flex flex-col gap-1.5 w-1/2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Dosage</label>
                  <input type="text" value={newInpatientRx.dosage || ""} onChange={(e) => setNewInpatientRx({ ...newInpatientRx, dosage: e.target.value })} placeholder="1g..." className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-rose-500 text-sm transition" />
                </div>
                <div className="flex flex-col gap-1.5 w-1/2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Qty/Form</label>
                  <select value={inpatientRxQty} onChange={(e) => setInpatientRxQty(e.target.value)} className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500 text-xs transition">
                    <option value="1 Ampoule">1 Ampoule</option>
                    <option value="1 Vial">1 Vial</option>
                    <option value="1 Pint">1 Pint</option>
                    <option value="1 Tab">1 Tab</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Frequency</label>
                <SuggestionInput value={newInpatientRx.frequency || ""} onChange={(val) => setNewInpatientRx({ ...newInpatientRx, frequency: val })} placeholder="Stat, BD..." suggestions={["Stat", "OD", "BD", "TDS", "QID", "SOS"]} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-rose-500 text-sm transition" />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Duration</label>
                <SuggestionInput value={newInpatientRx.duration || ""} onChange={(val) => setNewInpatientRx({ ...newInpatientRx, duration: val })} placeholder="1 dose..." suggestions={["1 dose", "1 day", "3 days", "Until discharge"]} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-rose-500 text-sm transition" />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-4">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Instructions / Route</label>
                <input type="text" value={newInpatientRx.instructions || ""} onChange={(e) => setNewInpatientRx({ ...newInpatientRx, instructions: e.target.value })} placeholder="e.g. Slow IV push" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-rose-500 text-sm transition" />
              </div>
              <div className="md:col-span-1">
                <button onClick={addInpatientPrescription} disabled={!newInpatientRx.name} className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 dark:disabled:text-slate-600 font-bold py-2 rounded-lg shadow-md transition text-sm border border-transparent disabled:border-slate-300 dark:disabled:border-slate-700">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
          </div>

          {/* Added Inpatient Prescriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ipx.length === 0 ? (
              <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 py-6 bg-white/50 dark:bg-slate-950/40 rounded-xl border border-rose-200/50 dark:border-rose-800/50">
                <p className="text-sm font-medium">No inpatient orders.</p>
              </div>
            ) : (
              ipx.map((rx, idx) => (
                <div key={rx.id} className="bg-white dark:bg-slate-950 border border-rose-200/50 dark:border-rose-800/50 rounded-xl p-4 flex gap-4 relative shadow-sm group items-start">
                  <div className="w-10 h-10 rounded-full bg-rose-600/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold border border-rose-500/25 shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{rx.name} <span className="text-rose-600 dark:text-rose-400">{rx.dosage}</span></h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                      {rx.frequency} • {rx.duration}
                    </p>
                    {rx.instructions && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded inline-block border border-slate-200/60 dark:border-slate-800/60">{rx.instructions}</p>
                    )}
                  </div>
                  <button onClick={() => removeInpatientRx(idx)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 rounded-md transition opacity-0 group-hover:opacity-100 shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* Completion */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
        <button onClick={toggleAdmit}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold transition ${patient.isAdmitted ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700 shadow-inner" : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"}`}>
          <Activity className="w-5 h-5" />
          {patient.isAdmitted ? "Admitted (Inpatient)" : "Admit Patient"}
        </button>

        {patient.isAdmitted && (
          <a href={`/doctor/encounter/${encounterId}/discharge`} target="_blank" rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-lg transition">
            <FileText className="w-5 h-5" />
            Create Discharge Summary
          </a>
        )}

        <button onClick={markComplete} disabled={patient.status === "complete"}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold shadow-lg transition ${patient.status === "complete" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40"}`}>
          <CheckCircle2 className="w-5 h-5" />
          {patient.status === "complete" ? "Encounter Finalized" : "Complete Encounter"}
        </button>
      </div>
    </div>
  );
}
