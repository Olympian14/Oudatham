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
  const [activeSection, setActiveSection] = useState("demo");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    STEPS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const updatePatient = (updated: Patient) => {
    setPatient(updated);
  };

  const completeEncounter = async () => {
    // Validation
    const missing: string[] = [];
    if (!patient.cc || patient.cc.length === 0 || !patient.cc.some(c => c.text.trim() !== "")) {
      missing.push("cc");
    }
    const hasHpi = Object.values(patient.hpiData || {}).some(d => Object.keys(d).length > 0) || Object.values(patient.customHpi || {}).some(t => t.trim() !== "");
    if (!hasHpi) {
      if (!missing.includes("hx")) missing.push("hx");
    }
    const hasSysHx = Object.keys(patient.sysPos || {}).length > 0 || Object.keys(patient.sysNeg || {}).length > 0;
    if (!hasSysHx) {
      if (!missing.includes("hx")) missing.push("hx");
    }
    const hasRx = patient.isAdmitted ? (patient.inpatientPrescriptions && patient.inpatientPrescriptions.length > 0) : (patient.prescriptions && patient.prescriptions.length > 0);
    if (!hasRx) {
      missing.push("dx");
    }

    if (missing.length > 0) {
      setMissingFields(missing);
      alert("Cannot complete visit. Please fill the mandatory fields: Chief Complaints, HPI, Systemic History, and Prescriptions.");
      scrollTo(missing[0]);
      return;
    }

    setMissingFields([]);
    if (!confirm("Are you sure you want to finalize this encounter? No further edits will be allowed.")) return;
    try {
      await fetch(`/api/doctor/encounter/${encounterId}/complete`, { method: "POST" });
      window.location.href = "/doctor/queue";
    } catch (err) {
      alert("Failed to complete encounter");
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setSidebarOpen(false);
  };

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
          {STEPS.map((s) => (
            <button key={s.id} onClick={() => scrollTo(s.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${activeSection === s.id ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-200 dark:border-indigo-500/20" : missingFields.includes(s.id) ? "text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50"}`}>
              <span className="text-base">{s.ic}</span> {s.lb}
              {missingFields.includes(s.id) && <span className="ml-auto w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
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
            <a href={`/doctor/encounter/${encounterId}/print`} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5">
              Print Case Sheet
            </a>
            <button onClick={completeEncounter} className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Complete Visit
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 relative scroll-smooth">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-slate-50 dark:from-indigo-900/10 dark:via-slate-950 dark:to-slate-950 pointer-events-none fixed" />
          <div className="max-w-full mx-auto pb-24 relative z-10 space-y-6">
            <div id="demo" className="scroll-mt-8"><Demographics patient={patient} onUpdatePatient={updatePatient} /></div>
            <div id="cc" className={`scroll-mt-8 rounded-xl transition ${missingFields.includes("cc") ? "ring-2 ring-rose-500 shadow-lg shadow-rose-500/20" : ""}`}><Complaints patient={patient} onUpdatePatient={updatePatient} /></div>
            <div id="hx" className={`scroll-mt-8 rounded-xl transition ${missingFields.includes("hx") ? "ring-2 ring-rose-500 shadow-lg shadow-rose-500/20" : ""}`}><History patient={patient} onUpdatePatient={updatePatient} /></div>
            <div id="bg" className="scroll-mt-8"><Background patient={patient} onUpdatePatient={updatePatient} /></div>
            <div id="ex" className="scroll-mt-8"><Examination patient={patient} onUpdatePatient={updatePatient} /></div>
            <div id="dx" className={`scroll-mt-8 rounded-xl transition ${missingFields.includes("dx") ? "ring-2 ring-rose-500 shadow-lg shadow-rose-500/20" : ""}`}><DiagnosisManagement patient={patient} onUpdatePatient={updatePatient} encounterId={encounterId} onComplete={completeEncounter} /></div>
          </div>
        </main>
      </div>
    </div>
  );
}
