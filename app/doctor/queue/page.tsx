import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Stethoscope, Users, Clock, PlayCircle } from "lucide-react";
import LogoutButton from "@/app/patient/dashboard/logout-button";
import { DEPARTMENTS } from "@/lib/departments";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

export default async function DoctorQueue({ searchParams }: { searchParams: Promise<{ dept?: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "DOCTOR") redirect("/auth/login");

  const params = await searchParams;
  const activeDept = params.dept || DEPARTMENTS[0];

  const encounters = await prisma.encounter.findMany({
    where: {
      department: activeDept,
      status: { in: ["WAITING", "IN_CONSULTATION"] }
    },
    include: { patient: true },
    orderBy: { createdAt: "asc" }
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <h1 className="text-xl font-extrabold tracking-tight">Oudatham Doctor Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm font-semibold text-slate-500 dark:text-slate-400">Dr. {session.name}</div>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Department Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {DEPARTMENTS.map(dept => (
            <a key={dept} href={`/doctor/queue?dept=${encodeURIComponent(dept)}`}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold border transition ${
                dept === activeDept
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-900/50"
                  : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}>
              {dept}
            </a>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> {activeDept} Queue
          </h2>
          <div className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-sm font-bold border border-indigo-200 dark:border-indigo-500/20">
            {encounters.length} Waiting
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          {encounters.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-500">
              <Clock className="w-12 h-12 text-slate-400 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Queue is Empty</h3>
              <p className="text-sm mt-1">No patients are currently waiting for {activeDept}.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Token</th>
                    <th className="p-4">Patient Name</th>
                    <th className="p-4">Age/Sex</th>
                    <th className="p-4">Arrival Time</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
                  {encounters.map(enc => (
                    <tr key={enc.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition">
                      <td className="p-4 font-mono text-sm font-semibold text-slate-500 dark:text-slate-400">{enc.encounterUid.split("-")[2]}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{enc.patient.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-500">ID: {enc.patient.patientUid}</div>
                      </td>
                      <td className="p-4 text-sm text-slate-700 dark:text-slate-300">{enc.patient.age || "?"}y / {enc.patient.gender?.[0] || "?"}</td>
                      <td className="p-4 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(enc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border
                          ${enc.status === "WAITING" ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20" :
                            "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"}`}>
                          {enc.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <a href={`/doctor/encounter/${enc.id}`}
                          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition text-sm">
                          {enc.status === "WAITING" ? (
                            <><PlayCircle className="w-4 h-4" /> Start</>
                          ) : (
                            <><Stethoscope className="w-4 h-4" /> Resume</>
                          )}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
