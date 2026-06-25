import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Patient } from "./types";
import { getParams, SYS } from "./data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPatientContext(p: Patient): string {
  if (!p) return "";

  const demoText = `PATIENT: ${p.demo.name || "Unnamed"}, ${p.demo.age || "Unknown Age"}y, ${p.demo.sex || "Unknown Sex"}, Occupation: ${p.demo.occ || "None Specified"}. Address: ${p.demo.addr || "None Specified"}.`;

  const ccText = p.cc
    .filter((c) => c.text.trim() !== "")
    .map((c, i) => {
      const d = p.hpiData[i] || {};
      const cust = p.customHpi[i] || "";
      const params = getParams(c.text);
      const filled = params
        .filter((pm) => pm.key)
        .map((pm) => {
          const v = d[pm.key!];
          if (!v) return "";
          return `${pm.lb}: ${Array.isArray(v) ? v.join(", ") : v}`;
        })
        .filter(Boolean)
        .join("; ");

      return `  - Complaint [${c.text} for ${c.durNum} ${c.durUnit}]: ${filled || "No parameters specified"}.${cust ? ` (Additional notes: ${cust})` : ""}`;
    })
    .join("\n");

  let sysHxText = "";
  if (p.selectedSystems && p.selectedSystems.length > 0) {
    p.selectedSystems.forEach((sk) => {
      const sd = p.sysData[sk] || {};
      const s = SYS[sk];
      if (!s) return;

      const extras = s.extra
        ? s.extra
            .filter((e) => sd[e.key])
            .map((e) => `${e.lb}: ${sd[e.key]}`)
            .join("; ")
        : "";

      const pos = Object.keys(p.sysPos || {})
        .filter((k) => p.sysPos[k] && s.pos.includes(k))
        .join(", ");

      const neg = Object.keys(p.sysNeg || {})
        .filter((k) => p.sysNeg[k] && s.neg.includes(k))
        .join(", ");

      const risk = Object.keys(p.sysRisk || {})
        .filter((k) => p.sysRisk[k] && s.risk.includes(k))
        .join(", ");

      sysHxText += `  - ${s.name} System Review:\n`;
      if (extras) sysHxText += `    * Key Parameters: ${extras}\n`;
      if (pos) sysHxText += `    * Positives: ${pos}\n`;
      if (neg) sysHxText += `    * Negatives: ${neg}\n`;
      if (risk) sysHxText += `    * Risk Factors: ${risk}\n`;
    });
  }

  const bgText = `  - Past Medical: Previous similar: ${p.past.sim || "None"}. Comorbidities: ${p.past.cond || "None"}. Surgeries: ${p.past.surg || "None"}. Rheumatic fever: ${p.past.rf || "None"}. DM: ${p.past.dm || "None"}. HTN: ${p.past.htn || "None"}. TB: ${p.past.tb || "None"}.
  - Family Hx: Details: ${p.fam.det || "None"}. HTN/DM: ${p.fam.htn_dm || "None"}. Cardiac/SCD: ${p.fam.cardiac || "None"}. Malignancy: ${p.fam.malignancy || "None"}. Other: ${p.fam.other || "None"}.
  - Personal Hx: Smoking: ${p.per.sm || "None"}. Alcohol: ${p.per.al || "None"}. Diet: ${p.per.dt || "None"}. Menstrual: ${p.per.mn || "None"}. Sexual: ${p.per.sexual || "None"}. Occupational: ${p.per.occ_hx || "None"}.
  - Drug & Treatments: Current drugs: ${p.drg.cur || "None"}. Allergies: ${p.drg.allergies || "None"}. OTC/Self: ${p.drg.otc || "None"}. Herbal/Alternative: ${p.drg.herbal || "None"}.`;

  const vitalsText = `  - Vitals: Pulse: ${p.vit.pu || "—"} bpm, BP: ${p.vit.bp || "—"} mmHg, RR: ${p.vit.rr || "—"} /min, Temp: ${p.vit.tp || "—"} °F, SpO2: ${p.vit.o2 || "—"} %, JVP: ${p.vit.jv || "—"} cmH₂O.
  - General Signs: ${Object.keys(p.sgn)
    .filter((k) => p.sgn[k as keyof typeof p.sgn])
    .join(", ") || "No abnormal general signs detected"}.`;

  let examText = "";
  if (p.exSystems && p.exSystems.length > 0) {
    p.exSystems.forEach((sk) => {
      const ex = p.exData[sk] || {};
      const s = SYS[sk];
      if (!s) return;

      examText += `  - ${s.name} System Examination:\n`;
      ["I", "P", "Pe", "A"].forEach((sec) => {
        const secLabel =
          sec === "I"
            ? "Inspection"
            : sec === "P"
            ? "Palpation"
            : sec === "Pe"
            ? "Percussion"
            : "Auscultation";

        const items = Object.keys(ex[sec] || {})
          .filter((k) => ex[sec]?.[k])
          .map((k) => `${k}: ${ex[sec]?.[k]}`)
          .join("; ");

        const customKey = `custom_${sec}`;
        const customVal = ex[customKey] || "";

        if (items || customVal) {
          examText += `    * ${secLabel}: ${items}${customVal ? ` (Additional: ${customVal})` : ""}\n`;
        }
      });
    });
  }

  return `${demoText}

CHIEF COMPLAINTS & HISTORY OF PRESENTING ILLNESS:
${ccText || "No active chief complaints recorded."}

SYSTEM-SPECIFIC HISTORY REVIEW:
${sysHxText || "No systemic review completed."}

BACKGROUND HISTORIES:
${bgText}

CLINICAL VITALS & GENERAL SIGNS:
${vitalsText}

SYSTEMIC PHYSICAL EXAMINATION FINDINGS:
${examText || "No systemic examination completed."}`;
}
