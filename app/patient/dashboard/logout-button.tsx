"use client";
import React from "react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/auth/login";
    } catch {
      window.location.href = "/auth/login";
    }
  };

  return (
    <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-red-400 transition">
      <LogOut className="w-4 h-4" /> Logout
    </button>
  );
}
