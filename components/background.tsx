"use client";
import React from "react";
import { Patient, PastHistory, FamilyHistory, PersonalHistory, DrugHistory } from "@/lib/types";
import { ShieldAlert, Users, Heart, Pill } from "lucide-react";

interface BackgroundProps {
  patient: Patient;
  onUpdatePatient: (updated: Patient) => void;
}

export default function Background({ patient, onUpdatePatient }: BackgroundProps) {
  const bgTab = patient.bgTab || "past";
  const setBgTab = (tab: string) => onUpdatePatient({ ...patient, bgTab: tab });

  const updatePastField = (field: keyof PastHistory, value: string) => {
    const past = patient.past || {} as PastHistory;
    onUpdatePatient({ ...patient, status: "in-progress", past: { ...past, [field]: value } });
  };
  const updateFamilyField = (field: keyof FamilyHistory, value: string) => {
    const fam = patient.fam || {} as FamilyHistory;
    onUpdatePatient({ ...patient, status: "in-progress", fam: { ...fam, [field]: value } });
  };
  const updatePersonalField = (field: keyof PersonalHistory, value: string) => {
    const per = patient.per || {} as PersonalHistory;
    onUpdatePatient({ ...patient, status: "in-progress", per: { ...per, [field]: value } });
  };
  const updateDrugField = (field: keyof DrugHistory, value: string) => {
    const drg = patient.drg || {} as DrugHistory;
    onUpdatePatient({ ...patient, status: "in-progress", drg: { ...drg, [field]: value } });
  };

  const tabs = [
    { id: "past", label: "Past Medical", icon: ShieldAlert },
    { id: "fam", label: "Family History", icon: Users },
    { id: "per", label: "Personal History", icon: Heart },
    { id: "drg", label: "Drug & Treatment", icon: Pill },
  ];

  const inputClass = "w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 text-xs leading-relaxed transition resize-y";
  const fieldClass = "flex flex-col gap-1.5 bg-slate-950/25 p-3.5 border border-slate-800/40 rounded-lg";

  return (
    <div id="background-component" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Background History</h2>
        <p className="text-sm text-slate-400 mt-1">Complete the patient's systemic profile including co-morbidities, hereditary risks, social behaviors, and active pharmacotherapy.</p>
      </div>

      <div className="flex border-b border-slate-800 bg-slate-900/50 p-1 rounded-xl gap-1 shrink-0 overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setBgTab(t.id)}
              className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold tracking-wide uppercase transition flex items-center justify-center gap-2 whitespace-nowrap ${bgTab === t.id ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`}>
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        {bgTab === "past" && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2"><ShieldAlert className="w-4.5 h-4.5" /> Past Medical History & Comorbidities</h3>
            <div className="flex flex-col gap-1.5"><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Previous Similar Episodes</label><textarea value={patient.past?.sim || ""} onChange={(e) => updatePastField("sim", e.target.value)} rows={2} placeholder="Detail past identical clinical syndromes..." className={inputClass} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5"><label className="text-xs font-bold uppercase tracking-wider text-slate-400">General Comorbidities</label><textarea value={patient.past?.cond || ""} onChange={(e) => updatePastField("cond", e.target.value)} rows={2} placeholder="Known chronic diagnoses (COPD, CKD, Stroke)..." className={inputClass} /></div>
              <div className="flex flex-col gap-1.5"><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Surgeries & Hospitalizations</label><textarea value={patient.past?.surg || ""} onChange={(e) => updatePastField("surg", e.target.value)} rows={2} placeholder="Major surgical procedures and admissions..." className={inputClass} /></div>
              <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Rheumatic Fever</label><input type="text" value={patient.past?.rf || ""} onChange={(e) => updatePastField("rf", e.target.value)} placeholder="Childhood history, migratory arthritis..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
              <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Diabetes Mellitus</label><input type="text" value={patient.past?.dm || ""} onChange={(e) => updatePastField("dm", e.target.value)} placeholder="Duration, HbA1c, complications..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
              <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Hypertension</label><input type="text" value={patient.past?.htn || ""} onChange={(e) => updatePastField("htn", e.target.value)} placeholder="Years diagnosed, compliance..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
              <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Tuberculosis</label><input type="text" value={patient.past?.tb || ""} onChange={(e) => updatePastField("tb", e.target.value)} placeholder="ATT history, duration..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
            </div>
          </div>
        )}

        {bgTab === "fam" && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2"><Users className="w-4.5 h-4.5" /> Family & Hereditary Risk Profile</h3>
            <div className="flex flex-col gap-1.5"><label className="text-xs font-bold uppercase tracking-wider text-slate-400">General Family Genogram</label><textarea value={patient.fam?.det || ""} onChange={(e) => updateFamilyField("det", e.target.value)} rows={2} placeholder="Hereditary illnesses in primary relatives..." className={inputClass} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">HTN / DM in Relatives</label><input type="text" value={patient.fam?.htn_dm || ""} onChange={(e) => updateFamilyField("htn_dm", e.target.value)} placeholder="Parents, siblings with metabolic disorders..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
              <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Cardiac Disease / SCD</label><input type="text" value={patient.fam?.cardiac || ""} onChange={(e) => updateFamilyField("cardiac", e.target.value)} placeholder="Premature IHD, sudden cardiac arrest..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
              <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Malignancy</label><input type="text" value={patient.fam?.malignancy || ""} onChange={(e) => updateFamilyField("malignancy", e.target.value)} placeholder="Colorectal, breast, ovarian cancers..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
              <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Other Hereditary Disorders</label><input type="text" value={patient.fam?.other || ""} onChange={(e) => updateFamilyField("other", e.target.value)} placeholder="Haemophilia, thalassemia..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
            </div>
          </div>
        )}

        {bgTab === "per" && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2"><Heart className="w-4.5 h-4.5" /> Personal, Social, & Environmental</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Smoking</label><input type="text" value={patient.per?.sm || ""} onChange={(e) => updatePersonalField("sm", e.target.value)} placeholder="Pack-years, active vs ex-smoker..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
              <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Alcohol</label><input type="text" value={patient.per?.al || ""} onChange={(e) => updatePersonalField("al", e.target.value)} placeholder="Units/week, type, CAGE..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
              <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Dietary Habits</label><input type="text" value={patient.per?.dt || ""} onChange={(e) => updatePersonalField("dt", e.target.value)} placeholder="Mixed/Veg, high-salt intake..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
              <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Occupational Exposures</label><input type="text" value={patient.per?.occ_hx || ""} onChange={(e) => updatePersonalField("occ_hx", e.target.value)} placeholder="Asbestos, chemical solvents..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
              <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Menstrual & Obstetric</label><input type="text" value={patient.per?.mn || ""} onChange={(e) => updatePersonalField("mn", e.target.value)} placeholder="LMP, cycle regularity, parity..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
              <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Sexual History</label><input type="text" value={patient.per?.sexual || ""} onChange={(e) => updatePersonalField("sexual", e.target.value)} placeholder="Risk assessment if relevant..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
            </div>
          </div>
        )}

        {bgTab === "drg" && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2"><Pill className="w-4.5 h-4.5" /> Pharmacotherapy, Allergies & Treatments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5"><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Prescriptions</label><textarea value={patient.drg?.cur || ""} onChange={(e) => updateDrugField("cur", e.target.value)} rows={4} placeholder="All regular medications, dosages, frequency..." className={inputClass} /></div>
              <div className="flex flex-col gap-1.5"><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Drug Allergies</label><textarea value={patient.drg?.allergies || ""} onChange={(e) => updateDrugField("allergies", e.target.value)} rows={4} placeholder="Active ingredients (Penicillin, NSAIDs), exact reaction..." className={inputClass} /></div>
              <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">OTC / Self-Treatment</label><input type="text" value={patient.drg?.otc || ""} onChange={(e) => updateDrugField("otc", e.target.value)} placeholder="Analgesics, cough syrups, self-prescribed..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
              <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Herbal / Alternative</label><input type="text" value={patient.drg?.herbal || ""} onChange={(e) => updateDrugField("herbal", e.target.value)} placeholder="Traditional preparations, complementary tonics..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
