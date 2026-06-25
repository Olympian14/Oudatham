"use client";
import React from "react";
import { Patient, Vitals, Signs } from "@/lib/types";
import { SYS } from "@/lib/data";
import { Activity, Thermometer, Droplets, CheckCircle2 } from "lucide-react";
import SuggestionInput from "./suggestion-input";

const VITALS_SUGGESTIONS = {
  pu: ["72 bpm, regular", "88 bpm, regular", "110 bpm, irregular (AF)", "55 bpm, bradycardia"],
  bp: ["120/80 mmHg", "140/90 mmHg", "90/60 mmHg (Hypotension)", "160/100 mmHg (Hypertension)"],
  rr: ["14 /min", "22 /min (Tachypnea)", "28 /min, labored"],
  tp: ["98.6 °F (Afebr)", "101.2 °F (Febrile)", "97.0 °F"],
  o2: ["98% on room air", "92% on room air", "88% (Hypoxia)"],
  jv: ["Not elevated", "Elevated +3 cm", "Elevated +5 cm H2O"]
};

const IPPA_SUGGESTIONS_MAP: Record<string, Record<string, string[]>> = {
  CVS: {
    I: ["Chest clinically clear", "No visible pulsations", "Apical impulse visible 5th ICS MCL"],
    P: ["Apex beat palpable 5th ICS MCL", "No parasternal heave", "No palpable thrills"],
    Pe: ["Normal cardiac borders", "Cardiomegaly noted"],
    A: ["S1 S2 normal, no murmurs", "Pan-systolic murmur at apex", "Ejection systolic murmur at aortic area"]
  },
  CNS: {
    I: ["Conscious and oriented", "Normal gait", "No involuntary movements"],
    P: ["Normal tone globally", "Power 5/5 in all limbs", "Hypertonia in right UL"],
    Pe: ["Reflexes 2+ symmetrical", "Plantar bilateral flexor", "Brisk reflexes right side"],
    A: ["No carotid bruits", "Normal sensory perception"]
  },
  RS: {
    I: ["Normal chest movement", "No accessory muscle use", "Barrel chest"],
    P: ["Symmetrical expansion", "Trachea central", "Decreased vocal fremitus right base"],
    Pe: ["Resonant bilaterally", "Stony dullness right base"],
    A: ["Vesicular breath sounds bilaterally", "Coarse crepitations left base", "Widespread polyphonic wheeze"]
  },
  GIT: {
    I: ["Abdomen flat, moves with respiration", "No visible scars", "Distended abdomen"],
    P: ["Soft, non-tender", "Epigastric tenderness", "Hepatomegaly 3cm below costal margin", "Guarding in RIF"],
    Pe: ["Tympanic", "Shifting dullness present"],
    A: ["Normal bowel sounds", "Absent bowel sounds"]
  }
};

const CUSTOM_DESCRIPTIVE_SUGGESTIONS = [
  "No significant abnormality detected.",
  "Examination limited due to pain.",
  "Findings consistent with provisional diagnosis."
];

interface ExaminationProps {
  patient: Patient;
  onUpdatePatient: (updated: Patient) => void;
}

export default function Examination({ patient, onUpdatePatient }: ExaminationProps) {
  const updateVital = (key: keyof Vitals, val: string) => {
    const v = patient.vit || {} as Vitals;
    onUpdatePatient({ ...patient, status: "in-progress", vit: { ...v, [key]: val } });
  };

  const toggleSign = (key: keyof Signs) => {
    const s = patient.sgn || {} as Signs;
    onUpdatePatient({ ...patient, status: "in-progress", sgn: { ...s, [key]: !s[key] } });
  };

  const toggleExSystem = (sysKey: string) => {
    const sel = [...(patient.exSystems || [])];
    const i = sel.indexOf(sysKey);
    if (i >= 0) sel.splice(i, 1); else sel.push(sysKey);
    onUpdatePatient({ ...patient, status: "in-progress", exSystems: sel });
  };

  const updateExItem = (sysKey: string, section: string, itemKey: string, val: string) => {
    const exData = { ...(patient.exData || {}) };
    if (!exData[sysKey]) exData[sysKey] = {};
    if (!exData[sysKey][section]) exData[sysKey][section] = {};
    exData[sysKey][section][itemKey] = val;
    onUpdatePatient({ ...patient, status: "in-progress", exData });
  };

  const activeTab = patient.activeExTab || (patient.exSystems?.[0] || "");
  const setActiveTab = (tab: string) => onUpdatePatient({ ...patient, activeExTab: tab });

  const inputClass = "w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 text-sm transition";
  const systemIcons: Record<string, string> = { CVS: "🫀", CNS: "🧠", RS: "🫁", GIT: "🫄" };

  return (
    <div id="examination-component" className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Physical Examination</h2>
        <p className="text-sm text-slate-400 mt-1">Record vital signs, general signs, and detailed systemic IPPA findings.</p>
      </div>

      {/* Vitals */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2"><Activity className="w-4.5 h-4.5" /> Vital Signs</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="flex flex-col gap-1.5"><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Pulse</label><SuggestionInput value={patient.vit?.pu || ""} onChange={(val) => updateVital("pu", val)} placeholder="e.g. 72 bpm" suggestions={VITALS_SUGGESTIONS.pu} className={inputClass} /></div>
          <div className="flex flex-col gap-1.5"><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Blood Pressure</label><SuggestionInput value={patient.vit?.bp || ""} onChange={(val) => updateVital("bp", val)} placeholder="mmHg" suggestions={VITALS_SUGGESTIONS.bp} className={inputClass} /></div>
          <div className="flex flex-col gap-1.5"><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Resp Rate</label><SuggestionInput value={patient.vit?.rr || ""} onChange={(val) => updateVital("rr", val)} placeholder="/min" suggestions={VITALS_SUGGESTIONS.rr} className={inputClass} /></div>
          <div className="flex flex-col gap-1.5"><label className="text-xs font-bold uppercase tracking-wider text-slate-400">Temperature</label><SuggestionInput value={patient.vit?.tp || ""} onChange={(val) => updateVital("tp", val)} placeholder="°F / °C" suggestions={VITALS_SUGGESTIONS.tp} className={inputClass} /></div>
          <div className="flex flex-col gap-1.5"><label className="text-xs font-bold uppercase tracking-wider text-slate-400">SpO2</label><SuggestionInput value={patient.vit?.o2 || ""} onChange={(val) => updateVital("o2", val)} placeholder="%" suggestions={VITALS_SUGGESTIONS.o2} className={inputClass} /></div>
          <div className="flex flex-col gap-1.5"><label className="text-xs font-bold uppercase tracking-wider text-slate-400">JVP</label><SuggestionInput value={patient.vit?.jv || ""} onChange={(val) => updateVital("jv", val)} placeholder="cmH2O" suggestions={VITALS_SUGGESTIONS.jv} className={inputClass} /></div>
        </div>
      </div>

      {/* General Signs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2"><Thermometer className="w-4.5 h-4.5" /> General Signs Checklist</h3>
        <div className="flex flex-wrap gap-2">
          {["pallor", "icterus", "clubbing", "cyanosis", "oedema", "lymph", "febrile"].map((sign) => {
            const isSet = patient.sgn?.[sign as keyof Signs];
            return (
              <button key={sign} type="button" onClick={() => toggleSign(sign as keyof Signs)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${isSet ? "bg-red-100 border-red-300 text-red-700 dark:bg-red-600/20 dark:border-red-500/40 dark:text-red-300" : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-800 dark:hover:text-slate-300"}`}>
                {sign.charAt(0).toUpperCase() + sign.slice(1)} {sign === "lymph" ? "Nodes" : ""}
              </button>
            );
          })}
        </div>
      </div>

      {/* Systemic Exam */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Systemic Examination</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {Object.keys(SYS).map((key) => {
            const s = SYS[key];
            const isSelected = (patient.exSystems || []).includes(key);
            return (
              <button key={key} type="button" onClick={() => toggleExSystem(key)}
                className={`flex-shrink-0 flex items-center gap-2 p-3 rounded-xl border text-left transition relative ${isSelected ? "bg-white dark:bg-slate-950 border-indigo-600 shadow-md shadow-indigo-950/20 ring-1 ring-indigo-500/30" : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"}`}>
                <div className="text-xl">{systemIcons[key]}</div>
                <div className={`text-xs font-bold tracking-tight pr-6 ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300"}`}>{s.name}</div>
                {isSelected && <CheckCircle2 className="absolute top-1/2 -translate-y-1/2 right-2 w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
              </button>
            );
          })}
        </div>

        {(patient.exSystems || []).length > 0 && SYS[activeTab] && (
          <div className="space-y-4 pt-2">
            {(patient.exSystems || []).length > 1 && (
              <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl gap-1 border border-slate-200 dark:border-slate-800 overflow-x-auto">
                {(patient.exSystems || []).map((sk) => (
                  <button key={sk} onClick={() => setActiveTab(sk)}
                    className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === sk ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}>
                    {SYS[sk].name}
                  </button>
                ))}
              </div>
            )}

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
              {[
                { sec: "I", lb: "Inspection" },
                { sec: "P", lb: "Palpation" },
                { sec: "Pe", lb: "Percussion" },
                { sec: "A", lb: "Auscultation" },
              ].map(({ sec, lb }) => (
                <div key={sec} className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lb}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {SYS[activeTab].ex[sec as keyof typeof SYS[typeof activeTab]["ex"]].map((item) => {
                      const suggestions = IPPA_SUGGESTIONS_MAP[activeTab]?.[sec] || CUSTOM_DESCRIPTIVE_SUGGESTIONS;
                      const currentValue = patient.exData?.[activeTab]?.[sec]?.[item] || "";
                      return (
                      <div key={item} className="flex flex-col gap-1.5 bg-slate-50 dark:bg-slate-950/30 p-3 rounded-lg border border-slate-200 dark:border-slate-800/50">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item}</label>
                        <div className="flex flex-wrap gap-1.5 mb-1">
                          {suggestions.map((sug) => (
                            <button key={sug} type="button" onClick={() => {
                              const v = currentValue ? currentValue + ", " + sug : sug;
                              if (!currentValue.includes(sug)) updateExItem(activeTab, sec, item, v);
                            }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-1 rounded text-[10px] font-semibold transition text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                              + {sug}
                            </button>
                          ))}
                        </div>
                        <input 
                          type="text" 
                          value={currentValue} 
                          onChange={(e) => updateExItem(activeTab, sec, item, e.target.value)} 
                          placeholder="Normal / Abnormal findings..." 
                          className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" 
                        />
                      </div>
                    )})}
                    <div className="flex flex-col gap-1.5 bg-slate-50 dark:bg-slate-950/30 p-3 rounded-lg border border-slate-200 dark:border-slate-800/50 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Custom {lb} Notes</label>
                      <input type="text" value={(patient.exData?.[activeTab]?.["custom_"] as any)?.[sec] || ""} onChange={(e) => updateExItem(activeTab, "custom_" as any, sec, e.target.value)} placeholder="Additional descriptive findings..." className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
