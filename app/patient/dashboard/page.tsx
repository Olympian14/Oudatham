import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { LogOut, CalendarPlus, Clock, Activity, Pill, User as UserIcon } from "lucide-react";
import BookAppointmentButton from "./book-appointment-button";
import LogoutButton from "./logout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

export default async function PatientDashboard() {
  const session = await getSession();
  if (!session || session.role !== "PATIENT") redirect("/auth/login");

  const patient = await prisma.patient.findUnique({
    where: { id: session.id },
    include: {
      encounters: {
        orderBy: { createdAt: "desc" },
      }
    }
  });

  if (!patient) redirect("/auth/login");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Oudatham Patient Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm font-semibold text-slate-500 dark:text-slate-400">ID: {patient.patientUid}</div>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-indigo-600 rounded-2xl p-6 sm:p-10 text-white shadow-xl shadow-indigo-900/50 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">Welcome, {patient.name}</h2>
            <p className="text-indigo-100 font-medium max-w-xl">
              Manage your outpatient visits, view your digital case sheets, and track your prescribed medications.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <BookAppointmentButton />
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
            <Activity className="w-64 h-64" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar / Profile */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Patient Profile
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                  <span className="text-slate-500 dark:text-slate-500">Age / Gender</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{patient.age || "N/A"}y / {patient.gender}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                  <span className="text-slate-500 dark:text-slate-500">Blood Group</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{patient.bloodGroup || "Not specified"}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                  <span className="text-slate-500 dark:text-slate-500">Mobile</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{patient.mobile}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-slate-500 dark:text-slate-500">Emergency</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{patient.emergency || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content / Encounters */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Encounter History
            </h3>
            
            {patient.encounters.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <CalendarPlus className="w-12 h-12 text-slate-400 dark:text-slate-700 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No visits recorded</h4>
                <p className="text-slate-500 dark:text-slate-500 text-sm mt-1 mb-6">You haven't visited the OPD yet. Book your first appointment to get started.</p>
                <BookAppointmentButton />
              </div>
            ) : (
              <div className="space-y-4">
                {patient.encounters.map(enc => (
                  <div key={enc.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg">{enc.department}</h4>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider">{enc.encounterUid}</p>
                      </div>
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border
                        ${enc.status === "WAITING" ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20" : 
                          enc.status === "IN_CONSULTATION" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20" : 
                          "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"}`}>
                        {enc.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500 dark:text-slate-500" />
                      {new Date(enc.createdAt).toLocaleString()}
                    </div>
                    
                    {enc.status === "COMPLETED" && (
                      <div className="flex gap-3 pt-3 border-t border-slate-200 dark:border-slate-800/80">
                        <button className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                          <Activity className="w-4 h-4" /> Case Sheet PDF
                        </button>
                        <button className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
                          <Pill className="w-4 h-4" /> Prescriptions
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
