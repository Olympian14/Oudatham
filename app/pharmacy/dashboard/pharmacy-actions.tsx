"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckSquare, Square, XCircle } from "lucide-react";

export default function PharmacyActions({ prescriptionId }: { prescriptionId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fulfilled, setFulfilled] = useState(false);

  const handleAction = async (status: string) => {
    setLoading(true);
    try {
      if (status === "DISPENSED") setFulfilled(true);
      await fetch(`/api/pharmacy/dispense/${prescriptionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      router.refresh();
    } catch {
      alert("Failed to update status");
      if (status === "DISPENSED") setFulfilled(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-3">
      <button onClick={() => handleAction("NOT_AVAILABLE")} disabled={loading || fulfilled}
        className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 py-1.5 px-3 rounded-lg transition text-xs font-bold disabled:opacity-50">
        <XCircle className="w-4 h-4" /> Not Available
      </button>

      <button onClick={() => handleAction("DISPENSED")} disabled={loading || fulfilled}
        className={`inline-flex items-center gap-1.5 font-bold py-1.5 px-4 rounded-lg transition text-sm disabled:opacity-50 ${fulfilled ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"}`}>
        {fulfilled ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
        {fulfilled ? "Fulfilled" : "Fulfill"}
      </button>
    </div>
  );
}
