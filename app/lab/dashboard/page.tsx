import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { FlaskConical, CheckCircle2 } from "lucide-react";
import LogoutButton from "@/app/patient/dashboard/logout-button";

export default async function LabDashboard() {
  const session = await getSession();
  if (!session || session.role !== "LAB_TECH") redirect("/auth/login");

  const pending = await prisma.investigation.findMany({
    where: { status: "PENDING" },
    include: { encounter: { include: { patient: true } } },
    orderBy: { createdAt: "asc" }
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">Laboratory Information System</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm font-semibold text-slate-600">{session.name}</div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Pending Investigations
          </h2>
          <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm font-bold border border-emerald-100">
            {pending.length} Requests
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          {pending.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="font-semibold text-lg">All caught up!</p>
              <p className="text-sm">No pending investigation requests at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pending.map(inv => (
                <div key={inv.id} className="border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-wider">{inv.invUid}</span>
                      <h3 className="font-bold text-slate-900">{inv.testName}</h3>
                    </div>
                    <div className="text-sm text-slate-600 mb-2">Patient: <span className="font-semibold">{inv.encounter.patient.name}</span> (ID: {inv.encounter.patient.patientUid})</div>
                    <div className="text-xs text-slate-500 font-mono bg-slate-50 p-2 rounded border border-slate-100">
                      <strong>Instructions:</strong> {inv.result}
                    </div>
                  </div>
                  <div className="w-full md:w-auto">
                    <form action={`/api/lab/result/${inv.id}`} method="POST" className="flex gap-2">
                      <input type="text" name="result" required placeholder="Enter result details..." className="flex-1 md:w-64 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition shadow-sm whitespace-nowrap">
                        Mark Complete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
