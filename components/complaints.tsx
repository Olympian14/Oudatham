"use client";
import React from "react";
import { Patient, Complaint } from "@/lib/types";
import { AlertCircle, Plus, X } from "lucide-react";
import SuggestionInput from "./suggestion-input";

interface ComplaintsProps {
  patient: Patient;
  onUpdatePatient: (updated: Patient) => void;
}

const COMMON_COMPLAINTS = [
  "Chest pain", "Dyspnoea", "Palpitations", "Syncope", "Headache", "Fever",
  "Seizures", "Weakness", "Abdominal pain", "Cough", "Jaundice", "Haemoptysis", "Pedal oedema",
  "Nausea / Vomiting", "Diarrhoea", "Constipation", "Weight loss", "Joint pain",
];

export default function Complaints({ patient, onUpdatePatient }: ComplaintsProps) {
  const updateComplaint = (idx: number, field: keyof Complaint, value: string) => {
    const updated = [...(patient.cc || [])];
    updated[idx] = { ...updated[idx], [field]: value };
    onUpdatePatient({ ...patient, status: "in-progress", cc: updated });
  };

  const addComplaint = () => {
    onUpdatePatient({ ...patient, cc: [...(patient.cc || []), { text: "", durNum: "", durUnit: "days" }] });
  };

  const removeComplaint = (idx: number) => {
    if ((patient.cc || []).length <= 1) return;
    const updated = patient.cc.filter((_, i) => i !== idx);
    onUpdatePatient({ ...patient, cc: updated });
  };

  const complaints = patient.cc || [{ text: "", durNum: "", durUnit: "days" }];

  return (
    <div id="complaints-component" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Chief Complaints
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Document the patient's presenting symptoms with precise durations.</p>
      </div>

      <div className="space-y-4">
        {complaints.map((c, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/25">{idx + 1}</span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Complaint {idx + 1}</span>
              </div>
              {complaints.length > 1 && (
                <button onClick={() => removeComplaint(idx)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"><X className="w-4 h-4" /></button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Symptom</label>
                <SuggestionInput value={c.text || ""} onChange={(val) => updateComplaint(idx, "text", val)} placeholder="e.g. Chest pain, Dyspnoea, Fever..." suggestions={COMMON_COMPLAINTS} className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 text-sm transition" />
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Duration</label>
                  <input type="text" value={c.durNum || ""} onChange={(e) => updateComplaint(idx, "durNum", e.target.value)} placeholder="e.g. 3" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm transition" />
                </div>
                <div className="flex flex-col gap-1.5 w-28">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Unit</label>
                  <select value={c.durUnit || "days"} onChange={(e) => updateComplaint(idx, "durUnit", e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 text-sm transition">
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addComplaint} className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl text-sm font-semibold transition shadow-sm">
        <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Add Another Complaint
      </button>
    </div>
  );
}
