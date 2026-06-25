"use client";
import React, { useState, useEffect } from "react";
import { Patient, Step } from "@/lib/types";
import { Moon, Sun, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import Overview from "./overview";
import Demographics from "./demographics";
import Complaints from "./complaints";
import History from "./history";
import Background from "./background";
import Examination from "./examination";
import DiagnosisManagement from "./diagnosis-management";

const STEPS: Step[] = [
  { id: "dir", lb: "Directory", ic: "📋" },
  { id: "demo", lb: "Demographics", ic: "👤" },
  { id: "cc", lb: "Complaints", ic: "🩺" },
  { id: "hx", lb: "History", ic: "📝" },
  { id: "bg", lb: "Background", ic: "📂" },
  { id: "ex", lb: "Examination", ic: "🔬" },
  { id: "dx", lb: "Diagnosis & Mgmt", ic: "🩺" },
];

const emptyPatient = (): Patient => ({
  id: Date.now(),
  createdAt: new Date().toISOString().split("T")[0],
  status: "new",
  demo: { name: "", age: "", sex: "", addr: "", occ: "" },
  cc: [{ text: "", durNum: "", durUnit: "days" }],
  hxPhase: "hpi",
  hpiOpen: {},
  hpiData: {},
  customHpi: {},
  selectedSystems: [],
  sysData: {},
  sysPos: {},
  sysNeg: {},
  sysRisk: {},
  sysExtra: {},
  past: { sim: "", cond: "", surg: "", rf: "", dm: "", htn: "", tb: "", ibd: "" },
  fam: { det: "", htn_dm: "", cardiac: "", malignancy: "", other: "" },
  per: { sm: "", al: "", dt: "", mn: "", sexual: "", occ_hx: "" },
  drg: { cur: "", allergies: "", otc: "", herbal: "" },
  vit: { pu: "", bp: "", rr: "", tp: "", o2: "", jv: "" },
  sgn: { pallor: false, icterus: false, clubbing: false, cyanosis: false, oedema: false, lymph: false, febrile: false },
  exSystems: [],
  exData: {},
  summaryLoading: false,
  summaryText: "",
  summaryGenerated: false,
  provisionalDx: "",
  chat: [],
  aiTab: "summary",
  aiOut: { differentials: "", investigations: "", management: "", summary: "" },
  loading: false,
  prescriptions: [],
});

export default function AppShell() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.remove("light-mode");
    else document.documentElement.classList.add("light-mode");
  }, [darkMode]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("/api/patients");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPatients(data);
          } else {
            const local = localStorage.getItem("clinassist_patients");
            if (local) {
              const p = JSON.parse(local);
              setPatients(p);
              await syncServer(p);
            } else {
              setPatients([emptyPatient()]);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load from server", err);
        const local = localStorage.getItem("clinassist_patients");
        if (local) setPatients(JSON.parse(local));
        else setPatients([emptyPatient()]);
      } finally {
        setLoaded(true);
      }
    };
    fetchPatients();
  }, []);

  const syncServer = async (p: Patient[]) => {
    try {
      await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
    } catch (err) {
      console.error("Failed to sync to server", err);
    }
  };

  const updatePatient = (updated: Patient) => {
    const newPatients = [...patients];
    newPatients[currentIdx] = updated;
    setPatients(newPatients);
    localStorage.setItem("clinassist_patients", JSON.stringify(newPatients));
    syncServer(newPatients);
  };

  const newPatient = () => {
    const np = emptyPatient();
    const updated = [...patients, np];
    setPatients(updated);
    setCurrentIdx(updated.length - 1);
    setStep(1); // Go to demographics
    localStorage.setItem("clinassist_patients", JSON.stringify(updated));
    syncServer(updated);
    setSidebarOpen(false);
  };

  const deletePatient = (idx: number) => {
    if (!confirm("Delete this patient record?")) return;
    const updated = patients.filter((_, i) => i !== idx);
    if (updated.length === 0) updated.push(emptyPatient());
    setPatients(updated);
    setCurrentIdx(Math.min(currentIdx, updated.length - 1));
    if (step !== 0) setStep(0);
    localStorage.setItem("clinassist_patients", JSON.stringify(updated));
    syncServer(updated);
  };

  const renderContent = () => {
    if (!loaded) return <div className="p-8 text-center text-slate-500">Loading workspace...</div>;
    const p = patients[currentIdx] || emptyPatient();
    
    switch (step) {
      case 0: return <Overview patients={patients} currentIdx={currentIdx} onSelect={(idx) => { setCurrentIdx(idx); setStep(1); setSidebarOpen(false); }} onNew={newPatient} onDelete={deletePatient} />;
      case 1: return <Demographics patient={p} onUpdatePatient={updatePatient} />;
      case 2: return <Complaints patient={p} onUpdatePatient={updatePatient} />;
      case 3: return <History patient={p} onUpdatePatient={updatePatient} />;
      case 4: return <Background patient={p} onUpdatePatient={updatePatient} />;
      case 5: return <Examination patient={p} onUpdatePatient={updatePatient} />;
      case 6: return <DiagnosisManagement patient={p} onUpdatePatient={updatePatient} />;
      default: return <Overview patients={patients} currentIdx={currentIdx} onSelect={(idx) => { setCurrentIdx(idx); setStep(1); }} onNew={newPatient} onDelete={deletePatient} />;
    }
  };

  const canNext = step > 0 && step < STEPS.length - 1;
  const canPrev = step > 1;

  const currentPatient = patients[currentIdx] || emptyPatient();

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 shrink-0 bg-slate-950/20">
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Logo className="w-8 h-8" />
            Oudatham
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {STEPS.map((s, i) => (
            <button key={s.id} onClick={() => { setStep(i); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${step === i ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/50" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}>
              <span className="text-base">{s.ic}</span> {s.lb}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800/80 bg-slate-950/20">
          <div className="text-[10px] text-center text-slate-500 uppercase tracking-wider font-bold mb-2">Version 2.0.0</div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800 shadow-inner">
              <div className={`w-2 h-2 rounded-full ${currentPatient.status === "complete" ? "bg-emerald-500" : currentPatient.status === "in-progress" ? "bg-amber-500" : "bg-blue-500"} shadow-sm`} />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-200 leading-none">{currentPatient.demo?.name || "New Patient"}</span>
                <span className="text-[10px] text-slate-500 mt-0.5">ID: {currentPatient.id}</span>
              </div>
            </div>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700/50 shadow-sm">
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto pb-24">
            {renderContent()}
          </div>
        </main>

        {/* Navigation Footer */}
        {step > 0 && (
          <div className="h-16 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 sticky bottom-0">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{STEPS[step]?.lb} <span className="text-slate-600 mx-2">•</span> Step {step} of 7</div>
            <div className="flex gap-2.5">
              <button disabled={!canPrev} onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-slate-800 disabled:bg-slate-900 disabled:text-slate-600 disabled:border-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold transition border border-slate-700 flex items-center gap-1.5">
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <button disabled={!canNext} onClick={() => setStep(step + 1)}
                className="px-4 py-2 bg-indigo-600 disabled:bg-slate-800 hover:bg-indigo-500 disabled:text-slate-600 text-white rounded-lg text-sm font-semibold shadow-md shadow-indigo-900/30 transition flex items-center gap-1.5">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
