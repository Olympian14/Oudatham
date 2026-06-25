"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function PharmacyActions({ prescriptionId }: { prescriptionId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDispense = async () => {
    setLoading(true);
    try {
      await fetch(`/api/pharmacy/dispense/${prescriptionId}`, { method: "PATCH" });
      router.refresh();
    } catch {
      alert("Failed to dispense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleDispense} disabled={loading}
      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 rounded-lg shadow-sm transition text-sm disabled:opacity-50">
      <CheckCircle className="w-3.5 h-3.5" /> {loading ? "..." : "Dispense"}
    </button>
  );
}
