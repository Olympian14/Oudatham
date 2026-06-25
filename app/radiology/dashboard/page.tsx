import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Scan, Clock, CheckCircle } from "lucide-react";
import LogoutButton from "@/app/patient/dashboard/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import RadiologyActions from "./radiology-actions";

export default async function RadiologyDashboard() {
  const session = await getSession();
  if (!session || session.role !== "RADIOLOGIST") redirect("/auth/login");

  const orders = await prisma.imagingOrder.findMany({
    where: { status: "PENDING" },
    include: { encounter: { include: { patient: true } } },
    orderBy: { createdAt: "asc" },
  });

  const completedToday = await prisma.imagingOrder.count({
    where: {
      status: "COMPLETED",
      createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <h1 className="text-xl font-extrabold tracking-tight">Oudatham Radiology Portal</h1>
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
            <div className="text-sm font-bold text-slate-500 dark:text-slate-400">Pending Orders</div>
            <div className="text-3xl font-black text-violet-400 mt-1">{orders.length}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-sm font-bold text-slate-500 dark:text-slate-400">Completed Today</div>
            <div className="text-3xl font-black text-emerald-400 mt-1">{completedToday}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Clock className="w-5 h-5 text-violet-400" /> Pending Imaging Orders
            </h2>
          </div>
          {orders.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <CheckCircle className="w-12 h-12 text-emerald-500/50 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">All Clear</h3>
              <p className="text-sm mt-1">No pending imaging orders.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Patient</th>
                    <th className="p-4">Modality</th>
                    <th className="p-4">Body Part</th>
                    <th className="p-4">Indication</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-100/30 dark:hover:bg-slate-800/30 transition">
                      <td className="p-4 font-mono text-sm font-semibold text-slate-500 dark:text-slate-400">{order.orderUid}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{order.encounter.patient.name}</div>
                        <div className="text-xs text-slate-500">{order.encounter.patient.age}y / {order.encounter.patient.gender?.[0]}</div>
                      </td>
                      <td className="p-4 text-sm font-semibold">{order.modality}</td>
                      <td className="p-4 text-sm text-slate-700 dark:text-slate-300">{order.bodyPart}</td>
                      <td className="p-4 text-sm text-slate-500 dark:text-slate-400 max-w-[200px] truncate">{order.indication || "—"}</td>
                      <td className="p-4 text-right">
                        <RadiologyActions orderId={order.id} />
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
