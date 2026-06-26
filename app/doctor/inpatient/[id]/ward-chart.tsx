"use client";

import React, { useState } from "react";
import {
  ArrowLeft, BedDouble, Pill, Plus, X, FlaskConical,
  FileText, Save, Activity, Heart, Thermometer, Wind, Droplets,
  ClipboardList, Trash2, ChevronDown, ChevronUp
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProgressNoteData {
  id: string;
  date: string;
  subjective: string | null;
  objective: string | null;
  assessment: string | null;
  plan: string | null;
  vitals: string | null;
  investigations: string | null;
  createdAt: string;
}

interface PrescriptionData {
  id: string;
  drugName: string;
  dose: string;
  route: string | null;
  frequency: string;
  duration: string;
  instructions: string | null;
  status: string;
}

interface InvestigationData {
  id: string;
  testName: string;
  category: string | null;
  status: string;
  result: string | null;
  createdAt: string;
}

interface ImagingData {
  id: string;
  modality: string;
  bodyPart: string;
  indication: string | null;
  status: string;
  report: string | null;
  createdAt: string;
}

interface WardChartProps {
  encounterId: string;
  patient: { name: string; age: number | null; gender: string; patientUid: string };
  diagnosis: string;
  chiefComplaints: string;
  currentOrders: PrescriptionData[];
  investigations: InvestigationData[];
  imagingOrders: ImagingData[];
  progressNotes: ProgressNoteData[];
  admissionDate: string;
}

export default function WardChart({
  encounterId, patient, diagnosis, chiefComplaints,
  currentOrders: initialOrders, investigations, imagingOrders,
  progressNotes: initialNotes, admissionDate,
}: WardChartProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"notes" | "orders" | "investigations">("notes");
  const [notes, setNotes] = useState<ProgressNoteData[]>(initialNotes);
  const [orders, setOrders] = useState<PrescriptionData[]>(initialOrders);
  const [saving, setSaving] = useState(false);
  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  // New note form state
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteForm, setNoteForm] = useState({
    subjective: "", objective: "", assessment: "", plan: "",
    pr: "", bp: "", rr: "", temp: "", spo2: "",
    newInvestigations: "",
  });

  // New order form state
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState({
    drugName: "", dose: "", frequency: "", duration: "", route: "IV", instructions: "",
  });

  const daysSinceAdmission = Math.ceil(
    (Date.now() - new Date(admissionDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  // ── Save Progress Note ──
  const saveNote = async () => {
    if (!noteForm.subjective && !noteForm.objective && !noteForm.assessment && !noteForm.plan) return;
    setSaving(true);
    try {
      const vitals = JSON.stringify({
        pr: noteForm.pr, bp: noteForm.bp, rr: noteForm.rr,
        temp: noteForm.temp, spo2: noteForm.spo2,
      });
      const res = await fetch(`/api/doctor/inpatient/${encounterId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjective: noteForm.subjective,
          objective: noteForm.objective,
          assessment: noteForm.assessment,
          plan: noteForm.plan,
          vitals,
          investigations: noteForm.newInvestigations,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setNotes([{ ...result.note, date: result.note.date, createdAt: result.note.createdAt }, ...notes]);
        setNoteForm({ subjective: "", objective: "", assessment: "", plan: "", pr: "", bp: "", rr: "", temp: "", spo2: "", newInvestigations: "" });
        setShowNoteForm(false);
      }
    } catch (err) {
      alert("Failed to save note");
    }
    setSaving(false);
  };

  // ── Add New Order ──
  const addOrder = async () => {
    if (!orderForm.drugName) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/doctor/inpatient/${encounterId}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderForm),
      });
      const result = await res.json();
      if (result.success) {
        setOrders([result.order, ...orders]);
        setOrderForm({ drugName: "", dose: "", frequency: "", duration: "", route: "IV", instructions: "" });
        setShowOrderForm(false);
      }
    } catch (err) {
      alert("Failed to add order");
    }
    setSaving(false);
  };

  // ── Remove Order ──
  const removeOrder = async (prescriptionId: string) => {
    if (!confirm("Remove this medication order?")) return;
    try {
      await fetch(`/api/doctor/inpatient/${encounterId}/orders`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prescriptionId }),
      });
      setOrders(orders.filter((o) => o.id !== prescriptionId));
    } catch (err) {
      alert("Failed to remove order");
    }
  };

  const parseVitals = (vitalsJson: string | null) => {
    if (!vitalsJson) return null;
    try { return JSON.parse(vitalsJson); } catch { return null; }
  };

  const tabs = [
    { id: "notes" as const, label: "Daily Notes", icon: FileText, count: notes.length },
    { id: "orders" as const, label: "Current Orders", icon: Pill, count: orders.filter(o => o.status === "PENDING").length },
    { id: "investigations" as const, label: "Investigations", icon: FlaskConical, count: investigations.length + imagingOrders.length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/doctor/queue?view=inpatient" className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                <BedDouble className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">{patient.name}</h1>
                <p className="text-xs text-slate-500">
                  {patient.age || "?"}y / {patient.gender} · Day {daysSinceAdmission} · {patient.patientUid}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/doctor/encounter/${encounterId}`}
              className="text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              View Full Case Sheet →
            </Link>
            <Link
              href={`/doctor/encounter/${encounterId}/discharge`}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg text-sm shadow-sm transition"
            >
              Discharge Summary
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Patient Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Diagnosis</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{diagnosis}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Chief Complaints</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">{chiefComplaints}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Admission Date</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">{new Date(admissionDate).toLocaleDateString()} ({daysSinceAdmission} day{daysSinceAdmission !== 1 ? "s" : ""})</p>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 bg-slate-200 dark:bg-slate-800 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition ${
                activeTab === tab.id
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                activeTab === tab.id ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400" : "bg-slate-300 dark:bg-slate-700"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ═══════ DAILY NOTES TAB ═══════ */}
        {activeTab === "notes" && (
          <div className="space-y-4">
            {!showNoteForm ? (
              <button
                onClick={() => setShowNoteForm(true)}
                className="w-full bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition group"
              >
                <Plus className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 mx-auto mb-2 transition" />
                <p className="font-bold text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Add Today&apos;s Progress Note</p>
                <p className="text-xs text-slate-400 mt-1">Document subjective, objective, assessment & plan (SOAP)</p>
              </button>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-indigo-200 dark:border-indigo-500/30 shadow-lg p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Progress Note — {new Date().toLocaleDateString()}
                  </h3>
                  <button onClick={() => setShowNoteForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Vitals Row */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Today&apos;s Vitals</p>
                  <div className="grid grid-cols-5 gap-3">
                    {[
                      { key: "pr", label: "Pulse", icon: Heart, unit: "bpm" },
                      { key: "bp", label: "BP", icon: Activity, unit: "mmHg" },
                      { key: "rr", label: "RR", icon: Wind, unit: "/min" },
                      { key: "temp", label: "Temp", icon: Thermometer, unit: "°F" },
                      { key: "spo2", label: "SpO2", icon: Droplets, unit: "%" },
                    ].map(({ key, label, icon: Icon, unit }) => (
                      <div key={key}>
                        <label className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
                          <Icon className="w-3 h-3" /> {label}
                        </label>
                        <input
                          type="text"
                          value={(noteForm as any)[key]}
                          onChange={(e) => setNoteForm({ ...noteForm, [key]: e.target.value })}
                          placeholder={unit}
                          className="w-full mt-1 px-2.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* SOAP Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: "subjective", label: "S — Subjective", placeholder: "Patient's complaints, symptoms today..." },
                    { key: "objective", label: "O — Objective", placeholder: "Examination findings, vitals interpretation..." },
                    { key: "assessment", label: "A — Assessment", placeholder: "Updated diagnosis, clinical impression..." },
                    { key: "plan", label: "P — Plan", placeholder: "Changes to management, orders, investigations..." },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400">{label}</label>
                      <textarea
                        value={(noteForm as any)[key]}
                        onChange={(e) => setNoteForm({ ...noteForm, [key]: e.target.value })}
                        placeholder={placeholder}
                        rows={3}
                        className="w-full mt-1 px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition resize-none"
                      />
                    </div>
                  ))}
                </div>

                {/* New Investigations */}
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">New Investigations Ordered</label>
                  <input
                    type="text"
                    value={noteForm.newInvestigations}
                    onChange={(e) => setNoteForm({ ...noteForm, newInvestigations: e.target.value })}
                    placeholder="e.g. CBC, RFT, CT Abdomen..."
                    className="w-full mt-1 px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowNoteForm(false)} className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition">Cancel</button>
                  <button onClick={saveNote} disabled={saving} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg transition text-sm flex items-center gap-2">
                    <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Note"}
                  </button>
                </div>
              </div>
            )}

            {/* Notes Timeline */}
            {notes.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="font-bold text-slate-500">No progress notes yet</p>
                <p className="text-xs text-slate-400 mt-1">Click above to add the first daily note.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => {
                  const vitals = parseVitals(note.vitals);
                  const isExpanded = expandedNote === note.id;
                  return (
                    <div key={note.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                      <button
                        onClick={() => setExpandedNote(isExpanded ? null : note.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400">
                            D{Math.ceil((Date.now() - new Date(note.date).getTime()) / (1000 * 60 * 60 * 24)) || 1}
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-sm">{new Date(note.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</p>
                            <p className="text-xs text-slate-500 truncate max-w-[400px]">
                              {note.subjective || note.assessment || "No details"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {vitals && (
                            <div className="hidden md:flex items-center gap-3 text-[10px] text-slate-500">
                              {vitals.pr && <span>PR: {vitals.pr}</span>}
                              {vitals.bp && <span>BP: {vitals.bp}</span>}
                              {vitals.temp && <span>T: {vitals.temp}</span>}
                              {vitals.spo2 && <span>SpO2: {vitals.spo2}</span>}
                            </div>
                          )}
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-slate-200 dark:border-slate-800 p-5 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
                          {vitals && (
                            <div className="flex gap-4 flex-wrap text-xs">
                              {vitals.pr && <span className="px-2.5 py-1 bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 rounded-full font-bold">PR: {vitals.pr} bpm</span>}
                              {vitals.bp && <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full font-bold">BP: {vitals.bp} mmHg</span>}
                              {vitals.rr && <span className="px-2.5 py-1 bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 rounded-full font-bold">RR: {vitals.rr}/min</span>}
                              {vitals.temp && <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full font-bold">Temp: {vitals.temp}°F</span>}
                              {vitals.spo2 && <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full font-bold">SpO2: {vitals.spo2}%</span>}
                            </div>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {note.subjective && (
                              <div><p className="text-[10px] font-bold uppercase text-slate-400 mb-1">S — Subjective</p><p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{note.subjective}</p></div>
                            )}
                            {note.objective && (
                              <div><p className="text-[10px] font-bold uppercase text-slate-400 mb-1">O — Objective</p><p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{note.objective}</p></div>
                            )}
                            {note.assessment && (
                              <div><p className="text-[10px] font-bold uppercase text-slate-400 mb-1">A — Assessment</p><p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{note.assessment}</p></div>
                            )}
                            {note.plan && (
                              <div><p className="text-[10px] font-bold uppercase text-slate-400 mb-1">P — Plan</p><p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{note.plan}</p></div>
                            )}
                          </div>
                          {note.investigations && (
                            <div className="text-sm">
                              <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Investigations Ordered</p>
                              <p className="text-slate-700 dark:text-slate-300">{note.investigations}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════ CURRENT ORDERS TAB ═══════ */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {!showOrderForm ? (
              <button
                onClick={() => setShowOrderForm(true)}
                className="w-full bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-5 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition group"
              >
                <Plus className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 mx-auto mb-1 transition" />
                <p className="font-bold text-sm text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Add New Medication Order</p>
              </button>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-indigo-200 dark:border-indigo-500/30 shadow-lg p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm flex items-center gap-2"><Pill className="w-4 h-4 text-indigo-500" /> New Medication Order</h3>
                  <button onClick={() => setShowOrderForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Drug Name</label>
                    <input type="text" value={orderForm.drugName} onChange={(e) => setOrderForm({ ...orderForm, drugName: e.target.value })} placeholder="e.g. Ceftriaxone" className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Dose</label>
                    <input type="text" value={orderForm.dose} onChange={(e) => setOrderForm({ ...orderForm, dose: e.target.value })} placeholder="1g" className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Frequency</label>
                    <input type="text" value={orderForm.frequency} onChange={(e) => setOrderForm({ ...orderForm, frequency: e.target.value })} placeholder="BD" className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Route</label>
                    <select value={orderForm.route} onChange={(e) => setOrderForm({ ...orderForm, route: e.target.value })} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                      <option value="IV">IV</option>
                      <option value="IM">IM</option>
                      <option value="Oral">Oral</option>
                      <option value="SC">SC</option>
                      <option value="Topical">Topical</option>
                      <option value="Nebulization">Nebulization</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Duration</label>
                    <input type="text" value={orderForm.duration} onChange={(e) => setOrderForm({ ...orderForm, duration: e.target.value })} placeholder="5 days" className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="col-span-2 md:col-span-5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Instructions</label>
                    <input type="text" value={orderForm.instructions} onChange={(e) => setOrderForm({ ...orderForm, instructions: e.target.value })} placeholder="After food, dilute in 100ml NS" className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="flex items-end">
                    <button onClick={addOrder} disabled={!orderForm.drugName || saving} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-2 rounded-lg text-sm transition">
                      {saving ? "..." : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Orders List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              {orders.length === 0 ? (
                <div className="p-12 text-center">
                  <Pill className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p className="font-bold text-slate-500">No medication orders</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-3 pl-5">Drug</th>
                      <th className="p-3">Dose</th>
                      <th className="p-3">Freq</th>
                      <th className="p-3">Route</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right pr-5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
                    {orders.map((rx) => (
                      <tr key={rx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition">
                        <td className="p-3 pl-5 font-semibold">{rx.drugName}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{rx.dose}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{rx.frequency}</td>
                        <td className="p-3"><span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-[10px] font-bold">{rx.route || "IV"}</span></td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{rx.duration}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${rx.status === "PENDING" ? "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400" : rx.status === "DISPENSED" ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : "bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400"}`}>
                            {rx.status}
                          </span>
                        </td>
                        <td className="p-3 text-right pr-5">
                          <button onClick={() => removeOrder(rx.id)} className="text-slate-400 hover:text-rose-500 transition"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ═══════ INVESTIGATIONS TAB ═══════ */}
        {activeTab === "investigations" && (
          <div className="space-y-6">
            {/* Lab Investigations */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-sm flex items-center gap-2"><FlaskConical className="w-4 h-4 text-emerald-500" /> Laboratory Investigations</h3>
              </div>
              {investigations.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">No laboratory investigations ordered.</div>
              ) : (
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3 pl-5">Test</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Result</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
                    {investigations.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition">
                        <td className="p-3 pl-5 font-semibold">{inv.testName}</td>
                        <td className="p-3 text-slate-500">{inv.category || "—"}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${inv.status === "COMPLETED" ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"}`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-emerald-700 dark:text-emerald-400">{inv.result || "—"}</td>
                        <td className="p-3 text-xs text-slate-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Imaging Orders */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-sm flex items-center gap-2"><Activity className="w-4 h-4 text-blue-500" /> Radiology / Imaging</h3>
              </div>
              {imagingOrders.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">No imaging orders.</div>
              ) : (
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3 pl-5">Modality</th>
                      <th className="p-3">Body Part</th>
                      <th className="p-3">Indication</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Report</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
                    {imagingOrders.map((img) => (
                      <tr key={img.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition">
                        <td className="p-3 pl-5 font-semibold">{img.modality}</td>
                        <td className="p-3">{img.bodyPart}</td>
                        <td className="p-3 text-slate-500">{img.indication || "—"}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${img.status === "COMPLETED" ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"}`}>
                            {img.status}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-slate-700 dark:text-slate-300 max-w-[200px] truncate">{img.report || "Pending"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
