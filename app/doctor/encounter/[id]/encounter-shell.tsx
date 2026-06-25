"use client";
import React, { useState, useEffect } from "react";
import { Patient, Step } from "@/lib/types";
import { ChevronLeft, ChevronRight, Menu, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/logo";
import Demographics from "@/components/demographics";
import Complaints from "@/components/complaints";
import History from "@/components/history";
import Background from "@/components/background";
import Examination from "@/components/examination";
import DiagnosisManagement from "@/components/diagnosis-management";

const STEPS: Step[] = [
  { id: "demo", lb: "Demographics", ic: "👤" },
  { id: "cc", lb: "Complaints", ic: "🩺" },
  { id: "hx", lb: "History", ic: "📝" },
  { id: "bg", lb: "Background", ic: "📂" },
  { id: "ex", lb: "Examination", ic: "🔬" },
  { id: "dx", lb: "Diagnosis & Mgmt", ic: "🩺" },
];

export default function EncounterShell({ encounterId, initialData }: { encounterId: string, initialData: Patient }) {
  const [patient, setPatient] = useState<Patient>(initialData);
  const [step, setStep] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync to backend automatically when patient data changes
  useEffect(() => {
    const sync = async () => {
      setSaving(true);
      try {
        await fetch(`/api/doctor/encounter/${encounterId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patient),
        });
      } catch (err) {
        console.error("Failed to sync case sheet", err);
      } finally {
        setSaving(false);
      }
    };
    
    // Simple debounce to avoid spamming the API on every keystroke
    const timeout = setTimeout(sync, 1000);
    return () => clearTimeout(timeout);
  }, [patient, encounterId]);

  const updatePatient = (updated: Patient) => {
    setPatient(updated);
  };

  const completeEncounter = async () => {
    if (!confirm("Are you sure you want to finalize this encounter? No further edits will be allowed.")) return;
    try {
      await fetch(`/api/doctor/encounter/${encounterId}/complete`, { method: "POST" });
      window.location.href = "/doctor/queue";
    } catch (err) {
      alert("Failed to complete encounter");
    }
  };

  const renderContent = () => {
    switch (step) {
      case 0: return <Demographics patient={patient} onUpdatePatient={updatePatient} />;
      case 1: return <Complaints patient={patient} onUpdatePatient={updatePatient} />;
      case 2: return <History patient={patient} onUpdatePatient={updatePatient} />;
      case 3: return <Background patient={patient} onUpdatePatient={updatePatient} />;
      case 4: return <Examination patient={patient} onUpdatePatient={updatePatient} />;
      case 5: return <DiagnosisManagement patient={patient} onUpdatePatient={updatePatient} />;
      default: return <Demographics patient={patient} onUpdatePatient={updatePatient} />;
    }
  };

  const canNext = step < STEPS.length - 1;
  const canPrev = step > 0;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-950">
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Logo className="w-8 h-8" />
            Oudatham
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {STEPS.map((s, i) => (
            <button key={s.id} onClick={() => { setStep(i); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${step === i ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-200 dark:border-indigo-500/20" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50"}`}>
              <span className="text-base">{s.ic}</span> {s.lb}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <a href="/doctor/queue" className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition shadow-sm">
            Exit to Queue
          </a>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-inner">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-none">{patient.demo?.name || "Unknown Patient"}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-500 mt-0.5">ENC: {encounterId.slice(-6)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${saving ? "text-amber-500 animate-pulse" : "text-slate-500 dark:text-slate-500"}`}>
              {saving ? "Saving..." : "Saved"}
            </span>
            <button onClick={completeEncounter} className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Complete Visit
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-950 to-slate-950 pointer-events-none" />
          <div className="max-w-4xl mx-auto pb-24 relative z-10">
            {renderContent()}
          </div>
        </main>

        {/* Navigation Footer */}
        <div className="h-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 sticky bottom-0 shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.5)]">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">{STEPS[step]?.lb} <span className="text-slate-400 dark:text-slate-700 mx-2">•</span> Step {step + 1} of 6</div>
          <div className="flex gap-2.5">
            <button disabled={!canPrev} onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-white dark:bg-slate-900 disabled:bg-slate-50 dark:disabled:bg-slate-950 disabled:border-slate-200 dark:disabled:border-slate-800/50 disabled:text-slate-500 dark:disabled:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold transition border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 shadow-sm">
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button disabled={!canNext} onClick={() => setStep(step + 1)}
              className="px-4 py-2 bg-indigo-600 disabled:bg-slate-800 hover:bg-indigo-500 disabled:text-slate-500 dark:disabled:text-slate-500 text-white rounded-lg text-sm font-semibold shadow-[0_0_15px_-3px_rgba(79,70,229,0.4)] disabled:shadow-none transition flex items-center gap-1.5 border border-indigo-500 disabled:border-slate-300 dark:disabled:border-slate-700">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
