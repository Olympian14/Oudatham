import React from "react";

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Heart / Cross left side */}
      <path
        d="M 50 90 C 20 70 10 40 25 25 C 35 15 45 25 50 35 V 20 H 65 V 35 H 80 V 50 H 65 V 65 H 50 C 45 75 35 85 50 90"
        fill="url(#blueGrad)"
      />
      {/* Green Leaf right side */}
      <path
        d="M 50 90 C 60 70 90 60 90 30 C 90 20 70 20 50 40 C 60 50 70 70 50 90"
        fill="url(#greenGrad)"
      />
      <defs>
        <linearGradient id="blueGrad" x1="10" y1="10" x2="60" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="greenGrad" x1="90" y1="20" x2="50" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4ade80" />
          <stop offset="1" stopColor="#16a34a" />
        </linearGradient>
      </defs>
    </svg>
  );
}
