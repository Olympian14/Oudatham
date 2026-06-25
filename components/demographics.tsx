"use client";
import React from "react";
import { Patient, Demographic } from "@/lib/types";
import { UserCircle } from "lucide-react";

interface DemographicsProps {
  patient: Patient;
  onUpdatePatient: (updated: Patient) => void;
}

export default function Demographics({ patient, onUpdatePatient }: DemographicsProps) {
  const updateField = (field: keyof Demographic, value: string) => {
    onUpdatePatient({ ...patient, status: "in-progress", demo: { ...patient.demo, [field]: value } });
  };

  const inputClass = "w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 text-sm transition";

  return (
    <div id="demographics-component" className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <UserCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Patient Demographics
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Record core identifying information for the patient encounter.</p>
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full Name</label>
            <input type="text" value={patient.demo?.name || ""} onChange={(e) => updateField("name", e.target.value)} placeholder="Patient's full legal name" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Age (Years)</label>
            <input type="text" value={patient.demo?.age || ""} onChange={(e) => updateField("age", e.target.value)} placeholder="e.g. 45" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Biological Sex</label>
            <select value={patient.demo?.sex || ""} onChange={(e) => updateField("sex", e.target.value)} className={inputClass}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 lg:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Occupation</label>
            <input type="text" value={patient.demo?.occ || ""} onChange={(e) => updateField("occ", e.target.value)} placeholder="e.g. Construction worker, Teacher" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5 lg:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Address</label>
            <input type="text" value={patient.demo?.addr || ""} onChange={(e) => updateField("addr", e.target.value)} placeholder="Residential area / city" className={inputClass} />
          </div>
        </div>
      </div>
    </div>
  );
}
