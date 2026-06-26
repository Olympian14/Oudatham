import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Stethoscope, Users, Clock, PlayCircle, BedDouble, Activity } from "lucide-react";
import LogoutButton from "@/app/patient/dashboard/logout-button";
import { DEPARTMENTS } from "@/lib/departments";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

export default async function DoctorQueue({ searchParams }: { searchParams: Promise<{ dept?: string; view?: string; status?: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "DOCTOR") redirect("/auth/login");

  const params = await searchParams;
  const activeDept = params.dept || DEPARTMENTS[0];
  const activeView = params.view || "outpatient";

  const allEncounters = await prisma.encounter.findMany({
    where: { department: activeDept },
    include: {
      patient: true,
      caseSheet: true,
      prescriptions: true,
      investigations: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const outpatientEncounters = allEncounters.filter(
    (e) => e.status === "WAITING" || e.status === "IN_CONSULTATION" || e.status === "COMPLETED"
  );
  const inpatientEncounters = allEncounters.filter((e) => e.status === "ADMITTED");

  const stats = {
    total: allEncounters.length,
    waiting: allEncounters.filter((e) => e.status === "WAITING" || e.status === "IN_CONSULTATION").length,
    admitted: inpatientEncounters.length,
    seen: allEncounters.filter((e) => e.status === "COMPLETED").length,
  };

  // For outpatient view, filter by status
  const statusFilter = params.status || "WAITING";
  const filteredOutpatient = outpatientEncounters.filter((e) => {
    if (statusFilter === "TOTAL") return true;
    if (statusFilter === "WAITING") return e.status === "WAITING" || e.status === "IN_CONSULTATION";
    return e.status === statusFilter;
  });

  // Helper to extract diagnosis from case sheet JSON
  const getDiagnosis = (enc: (typeof allEncounters)[0]) => {
    if (!enc.caseSheet?.jsonData) return "—";
    try {
      const data = JSON.parse(enc.caseSheet.jsonData as string);
      return data.diagnosis || data.provisionalDx || "—";
    } catch {
      return "—";
    }
  };

  const buildUrl = (overrides: Record<string, string>) => {
    const p = new URLSearchParams({ dept: activeDept, view: activeView, ...overrides });
    return `/doctor/queue?${p.toString()}`;
  };

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
          {DEPARTMENTS.map((dept) => (
            <a
              key={dept}
              href={buildUrl({ dept, view: activeView })}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold border transition ${
                dept === activeDept
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-900/50"
                  : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
            >
              {dept}
            </a>
          ))}
        </div>

        {/* Outpatient / Inpatient View Toggle */}
        <div className="flex gap-1 bg-slate-200 dark:bg-slate-800 rounded-xl p-1 w-fit">
          <a
            href={buildUrl({ view: "outpatient" })}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition ${
              activeView === "outpatient"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            Outpatients
            <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full font-mono ${
              activeView === "outpatient" ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400" : "bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
            }`}>
              {outpatientEncounters.length}
            </span>
          </a>
          <a
            href={buildUrl({ view: "inpatient" })}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition ${
              activeView === "inpatient"
                ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <BedDouble className="w-4 h-4" />
            Inpatients
            <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full font-mono ${
              activeView === "inpatient" ? "bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400" : "bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
            }`}>
              {inpatientEncounters.length}
            </span>
          </a>
        </div>

        {/* ═══════════════ OUTPATIENT VIEW ═══════════════ */}
        {activeView === "outpatient" && (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href={buildUrl({ status: "TOTAL" })} className={`p-4 rounded-2xl border transition shadow-sm flex flex-col ${statusFilter === "TOTAL" ? "bg-slate-800 text-white border-slate-700" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"}`}>
                <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${statusFilter === "TOTAL" ? "text-slate-400" : "text-slate-500"}`}>Total Patients</span>
                <span className="text-3xl font-extrabold">{stats.total}</span>
              </a>
              <a href={buildUrl({ status: "WAITING" })} className={`p-4 rounded-2xl border transition shadow-sm flex flex-col ${statusFilter === "WAITING" ? "bg-amber-600 text-white border-amber-500" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/50"}`}>
                <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${statusFilter === "WAITING" ? "text-amber-200" : "text-amber-600 dark:text-amber-500"}`}>Waiting</span>
                <span className="text-3xl font-extrabold">{stats.waiting}</span>
              </a>
              <a href={buildUrl({ status: "ADMITTED" })} className={`p-4 rounded-2xl border transition shadow-sm flex flex-col ${statusFilter === "ADMITTED" ? "bg-rose-600 text-white border-rose-500" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-500/50"}`}>
                <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${statusFilter === "ADMITTED" ? "text-rose-200" : "text-rose-600 dark:text-rose-500"}`}>Admitted</span>
                <span className="text-3xl font-extrabold">{stats.admitted}</span>
              </a>
              <a href={buildUrl({ status: "COMPLETED" })} className={`p-4 rounded-2xl border transition shadow-sm flex flex-col ${statusFilter === "COMPLETED" ? "bg-emerald-600 text-white border-emerald-500" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/50"}`}>
                <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${statusFilter === "COMPLETED" ? "text-emerald-200" : "text-emerald-600 dark:text-emerald-500"}`}>Seen</span>
                <span className="text-3xl font-extrabold">{stats.seen}</span>
              </a>
            </div>

            <div className="flex items-center justify-between mt-8">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> {activeDept} Queue
              </h2>
              <div className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-sm font-bold border border-indigo-200 dark:border-indigo-500/20">
                {filteredOutpatient.length} patients
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              {filteredOutpatient.length === 0 ? (
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
                      {filteredOutpatient.map((enc) => (
                        <tr key={enc.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition">
                          <td className="p-4 font-mono text-sm font-semibold text-slate-500 dark:text-slate-400">{enc.encounterUid.split("-")[2]}</td>
                          <td className="p-4">
                            <div className="font-bold text-slate-900 dark:text-slate-100">{enc.patient.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-500">ID: {enc.patient.patientUid}</div>
                          </td>
                          <td className="p-4 text-sm text-slate-700 dark:text-slate-300">{enc.patient.age || "?"}y / {enc.patient.gender?.[0] || "?"}</td>
                          <td className="p-4 text-sm text-slate-500 dark:text-slate-400">
                            {new Date(enc.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                              enc.status === "WAITING"
                                ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                                : enc.status === "COMPLETED"
                                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                                  : "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                            }`}>
                              {enc.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <a href={`/doctor/encounter/${enc.id}`} className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition text-sm">
                              {enc.status === "WAITING" ? (
                                <><PlayCircle className="w-4 h-4" /> Start</>
                              ) : enc.status === "COMPLETED" ? (
                                <><Stethoscope className="w-4 h-4" /> View</>
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
          </>
        )}

        {/* ═══════════════ INPATIENT VIEW ═══════════════ */}
        {activeView === "inpatient" && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BedDouble className="w-6 h-6 text-rose-600 dark:text-rose-400" /> Admitted Patients — {activeDept}
              </h2>
              <div className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 px-3 py-1 rounded-full text-sm font-bold border border-rose-200 dark:border-rose-500/20">
                {inpatientEncounters.length} admitted
              </div>
            </div>

            {inpatientEncounters.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center">
                <BedDouble className="w-12 h-12 text-slate-400 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No Inpatients</h3>
                <p className="text-sm text-slate-500 mt-1">No patients are currently admitted under {activeDept}.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inpatientEncounters.map((enc) => {
                  const diagnosis = getDiagnosis(enc);
                  const currentMeds = enc.prescriptions.filter((p) => p.type === "INPATIENT" && p.status === "PENDING");
                  const recentLabs = enc.investigations.filter((i) => i.status === "COMPLETED").slice(-3);
                  const daysSinceAdmission = Math.ceil(
                    (Date.now() - new Date(enc.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                  );

                  return (
                    <div key={enc.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                      {/* Patient Header */}
                      <div className="p-5 flex items-start justify-between border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-rose-50 to-white dark:from-rose-950/20 dark:to-slate-900">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                            <BedDouble className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{enc.patient.name}</h3>
                            <p className="text-sm text-slate-500">
                              {enc.patient.age || "?"}y / {enc.patient.gender} · Admitted {daysSinceAdmission} day{daysSinceAdmission !== 1 ? "s" : ""} ago
                              <span className="ml-2 font-mono text-xs text-slate-400">{enc.encounterUid}</span>
                            </p>
                          </div>
                        </div>
                        <a
                          href={`/doctor/inpatient/${enc.id}`}
                          className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-rose-900/20 transition text-sm"
                        >
                          <Activity className="w-4 h-4" /> Open Ward Chart
                        </a>
                      </div>

                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
                        {/* Diagnosis */}
                        <div className="p-4">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Diagnosis</h4>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">{diagnosis}</p>
                        </div>

                        {/* Current Medications */}
                        <div className="p-4">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Current Orders ({currentMeds.length})
                          </h4>
                          {currentMeds.length === 0 ? (
                            <p className="text-xs text-slate-500 italic">No active orders</p>
                          ) : (
                            <div className="space-y-1">
                              {currentMeds.slice(0, 3).map((rx) => (
                                <p key={rx.id} className="text-xs text-slate-700 dark:text-slate-300 truncate">
                                  <span className="font-semibold">{rx.drugName}</span>{" "}
                                  <span className="text-slate-500">{rx.dose} · {rx.frequency}</span>
                                </p>
                              ))}
                              {currentMeds.length > 3 && (
                                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">+{currentMeds.length - 3} more</p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Latest Labs */}
                        <div className="p-4">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Recent Investigations
                          </h4>
                          {recentLabs.length === 0 ? (
                            <p className="text-xs text-slate-500 italic">No results yet</p>
                          ) : (
                            <div className="space-y-1">
                              {recentLabs.map((inv) => (
                                <p key={inv.id} className="text-xs text-slate-700 dark:text-slate-300 truncate">
                                  <span className="font-semibold">{inv.testName}</span>{" "}
                                  <span className="text-emerald-600 dark:text-emerald-400">{inv.result || "—"}</span>
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
