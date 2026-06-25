"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    mobile: "", name: "", gender: "", age: "", dob: "",
    address: "", district: "", state: "", bloodGroup: "", emergency: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = data.redirect;
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 text-sm transition shadow-inner shadow-black/20";
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1";

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="max-w-3xl mx-auto relative">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="text-center mb-10 relative z-10">
          <Logo className="w-16 h-16 mx-auto mb-5" />
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Patient Registration</h2>
          <p className="mt-2 text-sm text-slate-400 font-medium">Join Oudatham Electronic Medical Records System</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl py-10 px-6 sm:px-12 border border-slate-800/80 rounded-3xl shadow-2xl shadow-black/50 relative z-10">
          <form className="space-y-8" onSubmit={handleRegister}>
            
            {/* Core Info */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Primary Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Full Name <span className="text-rose-500">*</span></label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange}
                    className={inputClass} placeholder="Legal name" />
                </div>
                <div>
                  <label className={labelClass}>Mobile Number <span className="text-rose-500">*</span></label>
                  <input type="tel" name="mobile" required value={formData.mobile} onChange={handleChange}
                    className={inputClass} placeholder="10-digit mobile number" />
                </div>
                <div>
                  <label className={labelClass}>Biological Sex <span className="text-rose-500">*</span></label>
                  <select name="gender" required value={formData.gender} onChange={handleChange} className={inputClass}>
                    <option value="" className="bg-slate-900">Select Sex</option>
                    <option value="Male" className="bg-slate-900">Male</option>
                    <option value="Female" className="bg-slate-900">Female</option>
                    <option value="Other" className="bg-slate-900">Other</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="w-1/3">
                    <label className={labelClass}>Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange}
                      className={inputClass} placeholder="e.g. 35" />
                  </div>
                  <div className="flex-1">
                    <label className={labelClass}>Date of Birth</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange}
                      className={inputClass} style={{ colorScheme: 'dark' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Info */}
            <div className="space-y-5 pt-2">
              <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span> Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Blood Group</label>
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={inputClass}>
                    <option value="" className="bg-slate-900">Select</option>
                    <option value="A+" className="bg-slate-900">A+</option><option value="A-" className="bg-slate-900">A-</option>
                    <option value="B+" className="bg-slate-900">B+</option><option value="B-" className="bg-slate-900">B-</option>
                    <option value="AB+" className="bg-slate-900">AB+</option><option value="AB-" className="bg-slate-900">AB-</option>
                    <option value="O+" className="bg-slate-900">O+</option><option value="O-" className="bg-slate-900">O-</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Emergency Contact (Mobile)</label>
                  <input type="tel" name="emergency" value={formData.emergency} onChange={handleChange}
                    className={inputClass} placeholder="Relative or Guardian" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Home Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange}
                    className={inputClass} placeholder="Street address or locality" />
                </div>
                <div>
                  <label className={labelClass}>District</label>
                  <input type="text" name="district" value={formData.district} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            {error && (
              <div className="text-rose-400 text-sm font-bold bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 flex items-center gap-3">
                <Activity className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-800 gap-6">
              <a href="/auth/login" className="text-sm font-bold text-slate-400 hover:text-indigo-400 transition-colors">
                Already registered? Sign In
              </a>
              <button type="submit" disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl shadow-[0_0_20px_-5px_rgba(79,70,229,0.4)] text-sm font-black text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:shadow-none hover:scale-[1.02]">
                {loading ? "Processing..." : "Create Account"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
