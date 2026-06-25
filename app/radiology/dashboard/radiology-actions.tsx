"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FileCheck } from "lucide-react";

export default function RadiologyActions({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [report, setReport] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!report.trim()) return;
    setLoading(true);
    try {
      await fetch(`/api/radiology/result/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report }),
      });
      router.refresh();
    } catch {
      alert("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition text-sm">
        <FileCheck className="w-4 h-4" /> Report
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input type="text" value={report} onChange={e => setReport(e.target.value)}
        placeholder="Enter report/findings"
        className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-lg text-sm w-48 focus:ring-violet-500 focus:border-violet-500" />
      <button onClick={handleSubmit} disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-sm disabled:opacity-50">
        {loading ? "..." : "Submit"}
      </button>
      <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-bold">✕</button>
    </div>
  );
}
