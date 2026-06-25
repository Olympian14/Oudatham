import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Pill, Clock, CheckCircle } from "lucide-react";
import LogoutButton from "@/app/patient/dashboard/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import PharmacyActions from "./pharmacy-actions";

export default async function PharmacyDashboard() {
  const session = await getSession();
  if (!session || session.role !== "PHARMACIST") redirect("/auth/login");

  const prescriptions = await prisma.prescription.findMany({
    where: { status: "PENDING" },
    include: { encounter: { include: { patient: true } } },
    orderBy: { encounter: { createdAt: "desc" } },
  });

  const dispensedToday = await prisma.prescription.count({
    where: { status: "DISPENSED" },
  });

  // Group by encounter for cleaner display
  const grouped = new Map<string, { patient: string; age: number | null; gender: string; encUid: string; items: typeof prescriptions }>();
  for (const rx of prescriptions) {
    const key = rx.encounterId;
    if (!grouped.has(key)) {
      grouped.set(key, {
        patient: rx.encounter.patient.name,
        age: rx.encounter.patient.age,
        gender: rx.encounter.patient.gender,
        encUid: rx.encounter.encounterUid,
        items: [],
      });
    }
    grouped.get(key)!.items.push(rx);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <h1 className="text-xl font-extrabold tracking-tight">Oudatham Pharmacy Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm font-semibold text-slate-500 dark:text-slate-400">{session.name}</div>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-sm font-bold text-slate-500 dark:text-slate-400">Pending Prescriptions</div>
            <div className="text-3xl font-black text-amber-400 mt-1">{prescriptions.length}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-sm font-bold text-slate-500 dark:text-slate-400">Total Dispensed</div>
            <div className="text-3xl font-black text-emerald-400 mt-1">{dispensedToday}</div>
          </div>
        </div>

        {grouped.size === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500/50 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">All Dispensed</h3>
            <p className="text-sm text-slate-500 mt-1">No pending prescriptions to fill.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from(grouped.entries()).map(([encId, group]) => (
              <div key={encId} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{group.patient}</span>
                    <span className="text-sm text-slate-500 ml-2">{group.age}y / {group.gender?.[0]}</span>
                  </div>
                  <span className="font-mono text-xs text-slate-500">{group.encUid}</span>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800/80">
                      <th className="p-3 pl-4">Drug</th>
                      <th className="p-3">Dose</th>
                      <th className="p-3">Frequency</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Route</th>
                      <th className="p-3 text-right pr-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
                    {group.items.map(rx => (
                      <tr key={rx.id} className="hover:bg-slate-100/30 dark:hover:bg-slate-800/30 transition">
                        <td className="p-3 pl-4 font-semibold text-sm">{rx.drugName}</td>
                        <td className="p-3 text-sm">{rx.dose}</td>
                        <td className="p-3 text-sm">{rx.frequency}</td>
                        <td className="p-3 text-sm">{rx.duration}</td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-400">{rx.route || "Oral"}</td>
                        <td className="p-3 text-right pr-4">
                          <PharmacyActions prescriptionId={rx.id} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
