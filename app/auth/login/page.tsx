"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Stethoscope, FlaskConical, ShieldAlert, Activity, ArrowRight, Scan, Pill } from "lucide-react";
import { Logo } from "@/components/logo";
import { DEPARTMENTS } from "@/lib/departments";

const ROLES = [
  { id: "PATIENT",      icon: User,          label: "Patient" },
  { id: "DOCTOR",       icon: Stethoscope,   label: "Doctor" },
  { id: "LAB_TECH",     icon: FlaskConical,  label: "Lab" },
  { id: "RADIOLOGIST",  icon: Scan,          label: "Radiology" },
  { id: "PHARMACIST",   icon: Pill,          label: "Pharmacy" },
  { id: "ADMIN",        icon: ShieldAlert,   label: "Admin" },
] as const;

const needsDept = (role: string) => role === "PATIENT" || role === "DOCTOR";

export default function LoginPage() {
  const [role, setRole] = useState("PATIENT");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, mobile, password, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = data.redirect;
      } else {
        setError(data.error);
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 text-sm transition shadow-inner shadow-black/20";
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1";

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex justify-center">
          <Logo className="w-24 h-24" />
        </div>
        <h2 className="mt-6 text-center text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight relative z-10">Oudatham</h2>
        <p className="mt-2 text-center text-sm font-medium text-slate-400 relative z-10">Hospital Information Management System</p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="bg-slate-900/50 backdrop-blur-xl py-10 px-4 shadow-2xl shadow-black/50 sm:rounded-3xl sm:px-10 border border-slate-800/80">
          
          {/* Role Tabs — 6 roles in a 3x2 grid */}
          <div className="grid grid-cols-3 gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl mb-8 border border-slate-800">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`flex flex-col items-center justify-center py-3 rounded-xl text-xs font-bold transition-all ${
                  role === r.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/50"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                }`}
              >
                <r.icon className="w-5 h-5 mb-1.5" />
                {r.label}
              </button>
            ))}
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className={labelClass}>Mobile Number</label>
              <input type="text" required value={mobile} onChange={(e) => setMobile(e.target.value)}
                className={inputClass} placeholder="Enter 10-digit mobile number" />
            </div>

            {role === "PATIENT" ? (
              <div>
                <label className={labelClass}>One-Time Password (OTP)</label>
                <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)}
                  className={inputClass} placeholder="Enter OTP (any number for testing)" />
              </div>
            ) : (
              <div>
                <label className={labelClass}>Staff Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className={inputClass} placeholder="Enter your password" />
              </div>
            )}

            {error && (
              <div className="text-rose-400 text-sm font-bold bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 border border-transparent rounded-xl shadow-[0_0_20px_-5px_rgba(79,70,229,0.4)] text-sm font-black text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:shadow-none hover:scale-[1.02] mt-4">
              {loading ? "Authenticating..." : "Secure Sign In"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {role === "PATIENT" && (
            <div className="mt-8 text-center border-t border-slate-800 pt-6">
              <p className="text-sm text-slate-400 font-medium">
                New patient? <a href="/auth/register" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Register a new profile</a>
              </p>
            </div>
          )}
        </div>

        {/* Quick reference card */}
        <div className="mt-6 bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 text-[11px] text-slate-500">
          <p className="font-bold text-slate-400 mb-2">Demo Credentials (Password: password123)</p>
          <div className="grid grid-cols-2 gap-1">
            <span>Doctor: 9999999991</span>
            <span>Lab: 9999999992</span>
            <span>Admin: 9999999993</span>
            <span>Radiology: 9999999994</span>
            <span>Pharmacy: 9999999995</span>
            <span>Patient: Register new</span>
          </div>
        </div>
      </div>
    </div>
  );
}
