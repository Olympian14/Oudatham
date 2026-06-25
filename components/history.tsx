"use client";
import React from "react";
import { Patient } from "@/lib/types";
import { getParams, getParamName, SYS } from "@/lib/data";
import { FileText, Layers, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import SuggestionInput from "./suggestion-input";

interface HistoryProps {
  patient: Patient;
  onUpdatePatient: (updated: Patient) => void;
}

export default function History({ patient, onUpdatePatient }: HistoryProps) {
  const phase = patient.hxPhase || "hpi";

  const setPhase = (p: "hpi" | "sysHx") => {
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
      <div className="flex bg-slate-900/50 p-1 rounded-xl gap-1 border border-slate-800">
        <button onClick={() => setPhase("hpi")} className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 ${phase === "hpi" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}>
          <FileText className="w-4 h-4" /> HPI (SOCRATES)
        </button>
        <button onClick={() => setPhase("sysHx")} className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 ${phase === "sysHx" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}>
          <Layers className="w-4 h-4" /> Systemic Review
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
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
                <button onClick={() => toggleHpiOpen(idx)} className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-800/30 transition">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-sm font-bold border border-indigo-500/25">{idx + 1}</span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">{c.text}</h3>
                      <p className="text-[11px] text-slate-500">{c.durNum} {c.durUnit} • {refName}</p>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 space-y-4 border-t border-slate-800/50">
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
                                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition ${isSelected ? "bg-indigo-600/15 border-indigo-500/30 text-indigo-300" : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"}`}>
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <input type="text" value={val as string} onChange={(e) => updateHpiField(idx, pm.key!, e.target.value)} placeholder={pm.ph || ""}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" />
                          )}
                        </div>
                      );
                    })}
                    <div className="pt-3 border-t border-slate-800/30">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Additional Clinical Notes</label>
                      <textarea value={(patient.customHpi || {})[idx] || ""} onChange={(e) => updateCustomHpi(idx, e.target.value)} rows={2} placeholder="Free-text observations, nuances, or additional details..."
                        className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition resize-y" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {(patient.cc || []).filter(c => c.text.trim()).length === 0 && (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500">
              <p className="text-sm">Enter chief complaints first to generate HPI parameter fields.</p>
            </div>
          )}
        </div>
      )}

      {/* Systemic Review Phase */}
      {phase === "sysHx" && (
        <div className="space-y-6">
          {/* System selector cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.keys(SYS).map((key) => {
              const s = SYS[key];
              const isSelected = (patient.selectedSystems || []).includes(key);
              return (
                <button key={key} type="button" onClick={() => toggleSystem(key)}
                  className={`p-4 rounded-xl border text-left transition relative ${isSelected ? "bg-slate-950 border-indigo-600 shadow-md shadow-indigo-950/20" : "bg-slate-950/40 border-slate-800 hover:border-slate-700"}`}>
                  <div className="text-2xl mb-1.5">{systemIcons[key]}</div>
                  <div className={`text-sm font-bold tracking-tight ${isSelected ? "text-indigo-400" : "text-slate-300"}`}>{s.name}</div>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{s.sym}</p>
                  {isSelected && <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-indigo-400" />}
                </button>
              );
            })}
          </div>

          {(patient.selectedSystems || []).length > 0 && (
            <div className="space-y-4">
              {/* System tabs */}
              {patient.selectedSystems!.length > 1 && (
                <div className="flex bg-slate-900/50 p-1 rounded-xl gap-1 border border-slate-800 overflow-x-auto">
                  {patient.selectedSystems!.map((sk) => (
                    <button key={sk} onClick={() => setActiveSysTab(sk)}
                      className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 whitespace-nowrap ${activeSysTab === sk ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}>
                      <span>{systemIcons[sk]}</span> {SYS[sk].name}
                    </button>
                  ))}
                </div>
              )}

              {/* Active system content */}
              {SYS[activeSysTab] && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                  {/* Extra fields */}
                  {SYS[activeSysTab].extra && SYS[activeSysTab].extra!.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Parameters</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {SYS[activeSysTab].extra!.map((ef) => (
                          <div key={ef.key} className="flex flex-col gap-1 bg-slate-950/30 p-3 rounded-lg border border-slate-800/50">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{ef.lb}</label>
                            <input type="text" value={(patient.sysExtra || {})[activeSysTab]?.[ef.key] || ""} onChange={(e) => updateSysExtra(activeSysTab, ef.key, e.target.value)} placeholder={ef.ph}
                              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition" />
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
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition ${isOn ? "bg-emerald-600/15 border-emerald-500/30 text-emerald-300" : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"}`}>
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
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition ${isOn ? "bg-red-600/15 border-red-500/30 text-red-300" : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"}`}>
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
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition ${isOn ? "bg-amber-600/15 border-amber-500/30 text-amber-300" : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"}`}>
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
    </div>
  );
}
