"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus } from "lucide-react";
import { DEPARTMENTS } from "@/lib/departments";

export default function BookAppointmentButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dept, setDept] = useState<string>(DEPARTMENTS[0]);
  const [open, setOpen] = useState(false);

  const handleBook = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/encounters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ department: dept }),
      });
      if (res.ok) {
        setOpen(false);
        router.refresh();
      } else {
        alert("Failed to book appointment");
      }
    } catch {
      alert("Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600/20 font-bold py-2.5 px-5 rounded-xl shadow-sm transition border border-indigo-200 dark:border-indigo-500/20">
        <CalendarPlus className="w-5 h-5" /> Book New OPD Appointment
      </button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-4 rounded-xl border border-slate-200 dark:border-slate-800">
      <select value={dept} onChange={(e) => setDept(e.target.value)}
        className="px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-semibold text-sm border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500">
        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
      <button onClick={handleBook} disabled={loading}
        className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-500 font-bold py-2.5 px-5 rounded-xl shadow-sm transition disabled:opacity-70 text-sm">
        <CalendarPlus className="w-4 h-4" />
        {loading ? "Booking..." : "Confirm Booking"}
      </button>
      <button onClick={() => setOpen(false)} className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition px-2">
        Cancel
      </button>
    </div>
  );
}
