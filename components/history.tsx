"use client";
import React from "react";
import { Patient } from "@/lib/types";
import { getParams, getParamName, SYS } from "@/lib/data";
import { FileText, Layers, ChevronDown, ChevronUp, CheckCircle2, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import SuggestionInput from "./suggestion-input";

const MOCK_LAB_DATA = [
  { date: 'Jan', hba1c: 6.2, fbs: 110, cr: 0.9 },
  { date: 'Feb', hba1c: 6.4, fbs: 118, cr: 0.9 },
  { date: 'Mar', hba1c: 6.7, fbs: 125, cr: 1.0 },
  { date: 'Apr', hba1c: 7.1, fbs: 140, cr: 1.1 },
  { date: 'May', hba1c: 6.9, fbs: 135, cr: 1.0 },
  { date: 'Jun', hba1c: 6.5, fbs: 115, cr: 0.9 },
];

interface HistoryProps {
  patient: Patient;
  onUpdatePatient: (updated: Patient) => void;
}

export default function History({ patient, onUpdatePatient }: HistoryProps) {
  const phase = patient.hxPhase || "hpi";

  const setPhase = (p: "hpi" | "sysHx" | "trends") => {
    onUpdatePatient({ ...patient, hxPhase: p });
  };

  const toggleHpiOpen = (idx: number) => {
    const newOpen = { ...(patient.hpiOpen || {}) };
    newOpen[idx] = !(newOpen[idx] !== false);
    onUpdatePatient({ ...patient, hpiOpen: newOpen });
  };

  const updateHpiField = (idx: number, key: string, value: string | string[]) => {
    const hpiData = patient.hpiData || {};
    onUpdatePatient({
      ...patient, status: "in-progress",
      hpiData: { ...hpiData, [idx]: { ...(hpiData[idx] || {}), [key]: value } },
    });
  };

  const updateCustomHpi = (idx: number, value: string) => {
    onUpdatePatient({ ...patient, status: "in-progress", customHpi: { ...(patient.customHpi || {}), [idx]: value } });
  };

  const toggleSystem = (sysKey: string) => {
    const sel = [...(patient.selectedSystems || [])];
    const i = sel.indexOf(sysKey);
    if (i >= 0) sel.splice(i, 1); else sel.push(sysKey);
    onUpdatePatient({ ...patient, status: "in-progress", selectedSystems: sel });
  };

  const toggleFlag = (store: "sysPos" | "sysNeg" | "sysRisk", key: string) => {
    const newStore = { ...(patient[store] || {}) };
    newStore[key] = !newStore[key];
    onUpdatePatient({ ...patient, status: "in-progress", [store]: newStore });
  };

  const updateSysExtra = (sysKey: string, fieldKey: string, value: string) => {
    const sysExtra = patient.sysExtra || {};
    onUpdatePatient({
      ...patient, status: "in-progress",
      sysExtra: { ...sysExtra, [sysKey]: { ...(sysExtra[sysKey] || {}), [fieldKey]: value } },
    });
  };

  const activeSysTab = patient.activeSysHxTab || (patient.selectedSystems?.[0] || "");
  const setActiveSysTab = (tab: string) => {
    onUpdatePatient({ ...patient, activeSysHxTab: tab });
  };

  const systemIcons: Record<string, string> = { CVS: "🫀", CNS: "🧠", RS: "🫁", GIT: "🫄" };

  return (
    <div id="history-component" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Clinical History</h2>
        <p className="text-sm text-slate-400 mt-1">Document the history of presenting illness and perform a targeted systemic review.</p>
      </div>

      {/* Phase toggle */}
      <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl gap-1 border border-slate-200 dark:border-slate-800">
        <button onClick={() => setPhase("hpi")} className={`flex-1 py-2 px-3 rounded-lg text-[11px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${phase === "hpi" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}>
          <FileText className="w-3.5 h-3.5" /> HPI
        </button>
        <button onClick={() => setPhase("sysHx")} className={`flex-1 py-2 px-3 rounded-lg text-[11px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${phase === "sysHx" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}>
          <Layers className="w-3.5 h-3.5" /> Systems
        </button>
        <button onClick={() => setPhase("trends")} className={`flex-1 py-2 px-3 rounded-lg text-[11px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${phase === "trends" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}>
          <TrendingUp className="w-3.5 h-3.5" /> Trends
        </button>
      </div>

      {/* HPI Phase */}
      {phase === "hpi" && (
        <div className="space-y-4">
          {(patient.cc || []).filter(c => c.text.trim()).map((c, idx) => {
            const params = getParams(c.text);
            const refName = getParamName(c.text);
            const isOpen = (patient.hpiOpen || {})[idx] !== false;
            const data = (patient.hpiData || {})[idx] || {};

            return (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden">
                <button onClick={() => toggleHpiOpen(idx)} className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-sm font-bold border border-indigo-500/25">{idx + 1}</span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{c.text}</h3>
                      <p className="text-[11px] text-slate-500">{c.durNum} {c.durUnit} • {refName}</p>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 space-y-4 border-t border-slate-200 dark:border-slate-800/50">
                    {params.map((pm, pi) => {
                      if (pm.g) return <h4 key={pi} className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider pt-3 border-t border-slate-800/30 first:border-0 first:pt-4">{pm.g}</h4>;
                      if (!pm.key) return null;
                      const val = data[pm.key] || "";
                      return (
                        <div key={pi} className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                            {pm.tag && <span className="text-[9px] bg-indigo-600/20 text-indigo-400 px-1.5 py-0.5 rounded font-mono">{pm.tag}</span>}
                            {pm.lb}
                          </label>
                          {pm.opts ? (
                            <div className="flex flex-wrap gap-1.5">
                              {pm.opts.map((opt) => {
                                const isMulti = Array.isArray(val);
                                const isSelected = isMulti ? val.includes(opt) : val === opt;
                                return (
                                  <button key={opt} type="button" onClick={() => {
                                    if (pm.key === "assoc" || pm.key === "triggers" || pm.key === "prodrome" || pm.key === "provoke" || pm.key === "relieve") {
                                      const arr = Array.isArray(val) ? [...val] : val ? [val as string] : [];
                                      const ai = arr.indexOf(opt);
                                      if (ai >= 0) arr.splice(ai, 1); else arr.push(opt);
                                      updateHpiField(idx, pm.key!, arr);
                                    } else {
                                      updateHpiField(idx, pm.key!, isSelected ? "" : opt);
                                    }
                                  }}
                                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition ${isSelected ? "bg-indigo-600/15 border-indigo-500/30 text-indigo-600 dark:text-indigo-300" : "bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-800 dark:hover:text-slate-300"}`}>
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <input type="text" value={val as string} onChange={(e) => updateHpiField(idx, pm.key!, e.target.value)} placeholder={pm.ph || ""}
                              className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" />
                          )}
                        </div>
                      );
                    })}
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800/30">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Additional Clinical Notes</label>
                      <textarea value={(patient.customHpi || {})[idx] || ""} onChange={(e) => updateCustomHpi(idx, e.target.value)} rows={2} placeholder="Free-text observations, nuances, or additional details..."
                        className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition resize-y" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {(patient.cc || []).filter(c => c.text.trim()).length === 0 && (
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-12 text-center text-slate-500">
              <p className="text-sm">Enter chief complaints first to generate HPI parameter fields.</p>
            </div>
          )}
        </div>
      )}

      {/* Systemic Review Phase */}
      {phase === "sysHx" && (
        <div className="space-y-6">
          {/* System selector cards */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {Object.keys(SYS).map((key) => {
              const s = SYS[key];
              const isSelected = (patient.selectedSystems || []).includes(key);
              return (
                <button key={key} type="button" onClick={() => toggleSystem(key)}
                  className={`flex-shrink-0 flex items-center gap-2 p-3 rounded-xl border text-left transition relative ${isSelected ? "bg-white dark:bg-slate-950 border-indigo-600 shadow-md shadow-indigo-950/20 ring-1 ring-indigo-500/30" : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"}`}>
                  <div className="text-xl">{systemIcons[key]}</div>
                  <div className={`text-xs font-bold tracking-tight pr-6 ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300"}`}>{s.name}</div>
                  {isSelected && <CheckCircle2 className="absolute top-1/2 -translate-y-1/2 right-2 w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                </button>
              );
            })}
          </div>

          {(patient.selectedSystems || []).length > 0 && (
            <div className="space-y-4">
              {/* System tabs */}
              {patient.selectedSystems!.length > 1 && (
                <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl gap-1 border border-slate-200 dark:border-slate-800 overflow-x-auto">
                  {patient.selectedSystems!.map((sk) => (
                    <button key={sk} onClick={() => setActiveSysTab(sk)}
                      className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 whitespace-nowrap ${activeSysTab === sk ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}>
                      <span>{systemIcons[sk]}</span> {SYS[sk].name}
                    </button>
                  ))}
                </div>
              )}

              {/* Active system content */}
              {SYS[activeSysTab] && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
                  {/* Extra fields */}
                  {SYS[activeSysTab].extra && SYS[activeSysTab].extra!.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Parameters</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {SYS[activeSysTab].extra!.map((ef) => (
                          <div key={ef.key} className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-950/30 p-3 rounded-lg border border-slate-200 dark:border-slate-800/50">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{ef.lb}</label>
                            <input type="text" value={(patient.sysExtra || {})[activeSysTab]?.[ef.key] || ""} onChange={(e) => updateSysExtra(activeSysTab, ef.key, e.target.value)} placeholder={ef.ph}
                              className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Positive symptoms */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">✓ Positive Symptoms</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {SYS[activeSysTab].pos.map((item) => {
                        const isOn = !!(patient.sysPos || {})[item];
                        return (
                          <button key={item} type="button" onClick={() => toggleFlag("sysPos", item)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition ${isOn ? "bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-600/15 dark:border-emerald-500/30 dark:text-emerald-300" : "bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"}`}>
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Negative symptoms */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">✗ Pertinent Negatives</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {SYS[activeSysTab].neg.map((item) => {
                        const isOn = !!(patient.sysNeg || {})[item];
                        return (
                          <button key={item} type="button" onClick={() => toggleFlag("sysNeg", item)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition ${isOn ? "bg-red-100 border-red-300 text-red-700 dark:bg-red-600/15 dark:border-red-500/30 dark:text-red-300" : "bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"}`}>
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Risk factors */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">⚠ Risk Factors</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {SYS[activeSysTab].risk.map((item) => {
                        const isOn = !!(patient.sysRisk || {})[item];
                        return (
                          <button key={item} type="button" onClick={() => toggleFlag("sysRisk", item)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition ${isOn ? "bg-amber-100 border-amber-300 text-amber-700 dark:bg-amber-600/15 dark:border-amber-500/30 dark:text-amber-300" : "bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"}`}>
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Trends Phase */}
      {phase === "trends" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
            <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5" /> Lab Result Trends
            </h3>
            <p className="text-xs text-slate-500">Visualizing historical data to track patient progression over time.</p>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_LAB_DATA} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="hba1c" name="HbA1c (%)" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="fbs" name="Fasting Sugar (mg/dL)" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="cr" name="Creatinine (mg/dL)" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Latest HbA1c</span>
                <span className="text-xl font-black text-indigo-500">6.5%</span>
                <span className="text-[10px] text-emerald-500 flex items-center gap-1"><TrendingUp className="w-3 h-3 rotate-180" /> -0.4% from May</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Latest Fasting Blood Sugar</span>
                <span className="text-xl font-black text-rose-500">115</span>
                <span className="text-[10px] text-emerald-500 flex items-center gap-1"><TrendingUp className="w-3 h-3 rotate-180" /> -20 mg/dL from May</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Latest Creatinine</span>
                <span className="text-xl font-black text-emerald-500">0.9</span>
                <span className="text-[10px] text-emerald-500 flex items-center gap-1">Stable</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
