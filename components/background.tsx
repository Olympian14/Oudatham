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

  const inputClass = "w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 text-xs leading-relaxed transition resize-y";
  const fieldClass = "flex flex-col gap-1.5 bg-slate-50 dark:bg-slate-950/25 p-3.5 border border-slate-200 dark:border-slate-800/40 rounded-lg";

  return (
    <div id="background-component" className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Background</h2>
        <p className="text-sm text-slate-400 mt-1">Co-morbidities, hereditary, social, and pharmacotherapy.</p>
      </div>

      <div className="flex flex-col gap-4 sm:p-5">
        
        {/* Past Medical History */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-2"><ShieldAlert className="w-4.5 h-4.5" /> Past Medical History & Comorbidities</h3>
          
          <div className="flex flex-col gap-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Select Comorbidities</label>
            <div className="flex flex-wrap gap-2">
              {["DM", "HTN", "Epilepsy", "Thyroid", "Bronchial Asthma", "COVID-19", "TB"].map(cond => {
                const currentConds = (patient.past?.cond || "").split(",").map(p => p.trim()).filter(Boolean);
                const isActive = currentConds.includes(cond);
                return (
                  <button 
                    key={cond}
                    onClick={() => {
                      if (isActive) {
                        updatePastField("cond", currentConds.filter(c => c !== cond).join(", "));
                      } else {
                        updatePastField("cond", [...currentConds, cond].join(", "));
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${isActive ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"}`}
                  >
                    {cond}
                  </button>
                );
              })}
            </div>
            <textarea value={patient.past?.cond || ""} onChange={(e) => updatePastField("cond", e.target.value)} rows={2} placeholder="Type other chronic diagnoses..." className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5"><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Previous Similar Episodes</label><textarea value={patient.past?.sim || ""} onChange={(e) => updatePastField("sim", e.target.value)} rows={2} placeholder="Detail past identical clinical syndromes..." className={inputClass} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5"><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Surgeries & Hospitalizations</label><textarea value={patient.past?.surg || ""} onChange={(e) => updatePastField("surg", e.target.value)} rows={2} placeholder="Major surgical procedures and admissions..." className={inputClass} /></div>
            <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Rheumatic Fever</label><input type="text" value={patient.past?.rf || ""} onChange={(e) => updatePastField("rf", e.target.value)} placeholder="Childhood history, migratory arthritis..." className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
          </div>
        </div>

        {/* Family History */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-2"><Users className="w-4.5 h-4.5" /> Family & Hereditary Risk Profile</h3>
          <div className="flex flex-col gap-1.5"><label className="text-xs font-bold uppercase tracking-wider text-slate-400">General Family Genogram</label><textarea value={patient.fam?.det || ""} onChange={(e) => updateFamilyField("det", e.target.value)} rows={2} placeholder="Hereditary illnesses in primary relatives..." className={inputClass} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">HTN / DM in Relatives</label><input type="text" value={patient.fam?.htn_dm || ""} onChange={(e) => updateFamilyField("htn_dm", e.target.value)} placeholder="Parents, siblings with metabolic disorders..." className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
            <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Cardiac Disease / SCD</label><input type="text" value={patient.fam?.cardiac || ""} onChange={(e) => updateFamilyField("cardiac", e.target.value)} placeholder="Premature IHD, sudden cardiac arrest..." className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
            <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Malignancy</label><input type="text" value={patient.fam?.malignancy || ""} onChange={(e) => updateFamilyField("malignancy", e.target.value)} placeholder="Colorectal, breast, ovarian cancers..." className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
            <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Other Hereditary Disorders</label><input type="text" value={patient.fam?.other || ""} onChange={(e) => updateFamilyField("other", e.target.value)} placeholder="Haemophilia, thalassemia..." className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
          </div>
        </div>

        {/* Personal History */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-2"><Heart className="w-4.5 h-4.5" /> Personal, Social, & Environmental</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={fieldClass}>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Smoking</label>
              <div className="flex flex-wrap gap-1 mb-1">
                {["Non-smoker", "Ex-smoker", "Active Smoker"].map(st => (
                  <button key={st} onClick={() => updatePersonalField("sm", st)} className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition border ${patient.per?.sm?.startsWith(st) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500"}`}>{st}</button>
                ))}
              </div>
              <input type="text" value={patient.per?.sm || ""} onChange={(e) => updatePersonalField("sm", e.target.value)} placeholder="Pack-years..." className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" />
            </div>
            <div className={fieldClass}>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Alcohol</label>
              <div className="flex flex-wrap gap-1 mb-1">
                {["Teetotaler", "Social Drinker", "Heavy Drinker"].map(st => (
                  <button key={st} onClick={() => updatePersonalField("al", st)} className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition border ${patient.per?.al?.startsWith(st) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500"}`}>{st}</button>
                ))}
              </div>
              <input type="text" value={patient.per?.al || ""} onChange={(e) => updatePersonalField("al", e.target.value)} placeholder="Units/week..." className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" />
            </div>
            <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Dietary Habits</label><input type="text" value={patient.per?.dt || ""} onChange={(e) => updatePersonalField("dt", e.target.value)} placeholder="Mixed/Veg, high-salt intake..." className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
            <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Occupational Exposures</label><input type="text" value={patient.per?.occ_hx || ""} onChange={(e) => updatePersonalField("occ_hx", e.target.value)} placeholder="Asbestos, chemical solvents..." className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
            <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Menstrual & Obstetric</label><input type="text" value={patient.per?.mn || ""} onChange={(e) => updatePersonalField("mn", e.target.value)} placeholder="LMP, cycle regularity, parity..." className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
            <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Sexual History</label><input type="text" value={patient.per?.sexual || ""} onChange={(e) => updatePersonalField("sexual", e.target.value)} placeholder="Risk assessment if relevant..." className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
          </div>
        </div>

        {/* Drug History */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-2"><Pill className="w-4.5 h-4.5" /> Pharmacotherapy, Allergies & Treatments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5"><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Prescriptions</label><textarea value={patient.drg?.cur || ""} onChange={(e) => updateDrugField("cur", e.target.value)} rows={4} placeholder="All regular medications, dosages, frequency..." className={inputClass} /></div>
            <div className="flex flex-col gap-1.5"><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Drug Allergies</label><textarea value={patient.drg?.allergies || ""} onChange={(e) => updateDrugField("allergies", e.target.value)} rows={4} placeholder="Active ingredients (Penicillin, NSAIDs), exact reaction..." className={inputClass} /></div>
            <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">OTC / Self-Treatment</label><input type="text" value={patient.drg?.otc || ""} onChange={(e) => updateDrugField("otc", e.target.value)} placeholder="Analgesics, cough syrups, self-prescribed..." className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
            <div className={fieldClass}><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Herbal / Alternative</label><input type="text" value={patient.drg?.herbal || ""} onChange={(e) => updateDrugField("herbal", e.target.value)} placeholder="Traditional preparations, complementary tonics..." className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" /></div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
