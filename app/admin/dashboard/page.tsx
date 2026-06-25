import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ShieldAlert, Users, Stethoscope, FlaskConical, Scan, Pill, Activity } from "lucide-react";
import LogoutButton from "@/app/patient/dashboard/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { DEPARTMENTS } from "@/lib/departments";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/auth/login");

  const [patients, encounters, completed, pendingLabs, pendingImaging, pendingRx] = await Promise.all([
    prisma.patient.count(),
    prisma.encounter.count(),
    prisma.encounter.count({ where: { status: "COMPLETED" } }),
    prisma.investigation.count({ where: { status: "PENDING" } }),
    prisma.imagingOrder.count({ where: { status: "PENDING" } }),
    prisma.prescription.count({ where: { status: "PENDING" } }),
  ]);

  // Department-wise encounter breakdown
  const deptStats = await Promise.all(
    DEPARTMENTS.map(async (dept) => {
      const total = await prisma.encounter.count({ where: { department: dept } });
      const waiting = await prisma.encounter.count({ where: { department: dept, status: "WAITING" } });
      return { dept, total, waiting };
    })
  );

  const stats = [
    { label: "Total Patients", value: patients, icon: Users, color: "text-blue-600 bg-blue-50 border-blue-200" },
    { label: "Total Encounters", value: encounters, icon: Stethoscope, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
    { label: "Completed Visits", value: completed, icon: Activity, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { label: "Pending Labs", value: pendingLabs, icon: FlaskConical, color: "text-amber-600 bg-amber-50 border-amber-200" },
    { label: "Pending Imaging", value: pendingImaging, icon: Scan, color: "text-violet-600 bg-violet-50 border-violet-200" },
    { label: "Pending Prescriptions", value: pendingRx, icon: Pill, color: "text-rose-600 bg-rose-50 border-rose-200" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Oudatham Admin Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm font-semibold text-slate-500 dark:text-slate-400">{session.name}</div>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Global Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map(s => {
            // Transform colors for dark mode
            let darkColor = s.color;
            if (s.color.includes("blue")) darkColor = "text-blue-400 bg-blue-500/10 border-blue-500/20";
            if (s.color.includes("indigo")) darkColor = "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
            if (s.color.includes("emerald")) darkColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
            if (s.color.includes("amber")) darkColor = "text-amber-400 bg-amber-500/10 border-amber-500/20";
            if (s.color.includes("violet")) darkColor = "text-violet-400 bg-violet-500/10 border-violet-500/20";
            if (s.color.includes("rose")) darkColor = "text-rose-400 bg-rose-500/10 border-rose-500/20";
            
            return (
              <div key={s.label} className={`rounded-2xl p-5 border shadow-sm ${darkColor}`}>
                <s.icon className="w-5 h-5 mb-2" />
                <div className="text-2xl font-black">{s.value}</div>
                <div className="text-xs font-bold uppercase tracking-wider mt-1 opacity-70">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Department Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold">Department-wise Encounters</h2>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Department</th>
                <th className="p-4 text-center">Total Encounters</th>
                <th className="p-4 text-center">Currently Waiting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
              {deptStats.map(d => (
                <tr key={d.dept} className="hover:bg-slate-100/30 dark:hover:bg-slate-800/30 transition">
                  <td className="p-4 font-semibold">{d.dept}</td>
                  <td className="p-4 text-center font-bold">{d.total}</td>
                  <td className="p-4 text-center">
                    {d.waiting > 0 ? (
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-bold">{d.waiting}</span>
                    ) : (
                      <span className="text-slate-500">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
