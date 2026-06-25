"use client";
import React from "react";
import { Patient } from "@/lib/types";
import { Users, Plus, Trash2, User, Clock } from "lucide-react";

interface OverviewProps {
  patients: Patient[];
  currentIdx: number;
  onSelect: (idx: number) => void;
  onNew: () => void;
  onDelete: (idx: number) => void;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-blue-500/15 text-blue-400 border-blue-500/25" },
  "in-progress": { label: "In Progress", color: "bg-amber-500/15 text-amber-400 border-amber-500/25" },
  complete: { label: "Complete", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" },
};

export default function Overview({ patients, currentIdx, onSelect, onNew, onDelete }: OverviewProps) {
  return (
    <div id="overview-component" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Patient Directory
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{patients.length} case{patients.length !== 1 ? "s" : ""} on record</p>
        </div>
        <button onClick={onNew} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg shadow-indigo-950/40 transition text-sm">
          <Plus className="w-4 h-4" /> New Case
        </button>
      </div>

      {patients.length === 0 ? (
        <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-16 text-center flex flex-col items-center space-y-4">
          <Users className="w-14 h-14 text-slate-300 dark:text-slate-700" />
          <h3 className="text-slate-500 dark:text-slate-400 font-semibold">No Cases Yet</h3>
          <p className="text-xs text-slate-600 dark:text-slate-500 max-w-sm">Click "New Case" to begin a clinical consultation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((p, idx) => {
            const sc = statusConfig[p.status] || statusConfig.new;
            const isActive = idx === currentIdx;
            return (
              <button key={p.id} onClick={() => onSelect(idx)} className={`group relative text-left p-5 rounded-xl border transition-all duration-150 ${isActive ? "bg-white dark:bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-950/30 ring-1 ring-indigo-500/20" : "bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${isActive ? "bg-indigo-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate max-w-[160px]">{p.demo?.name || "Unnamed Patient"}</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-500">{p.demo?.age ? `${p.demo.age}y` : "—"} / {p.demo?.sex || "—"}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${sc.color}`}>{sc.label}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-500">
                  <Clock className="w-3 h-3" />
                  {p.createdAt}
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); onDelete(idx); }}>
                  <div className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 dark:text-slate-600 hover:text-red-400 transition cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
