import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oudatham — Clinical Decision Support",
  description:
    "An expert outpatient clinical clerkship companion and diagnostic assistant. AI-powered clinical reasoning, structured SOCRATES history taking, systemic examination, and prescription management.",
  keywords: [
    "clinical",
    "medical",
    "diagnosis",
    "SOCRATES",
    "outpatient",
    "AI",
    "prescription",
  ],
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
