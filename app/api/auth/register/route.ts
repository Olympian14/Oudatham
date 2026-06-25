import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { mobile, name, gender, dob, age, address, district, state, bloodGroup, emergency } = data;

    if (!mobile || !name || !gender) {
      return NextResponse.json({ error: "Mobile, Name, and Gender are required" }, { status: 400 });
    }

    const existing = await prisma.patient.findUnique({ where: { mobile } });
    if (existing) {
      return NextResponse.json({ error: "Patient with this mobile number already exists" }, { status: 400 });
    }

    // Generate GHM-YYYY-XXXXXX UID
    const year = new Date().getFullYear();
    const count = await prisma.patient.count();
    const patientUid = `GHM-${year}-${String(count + 1).padStart(6, '0')}`;

    const newPatient = await prisma.patient.create({
      data: {
        patientUid,
        mobile,
        name,
        gender,
        dob: dob ? new Date(dob) : null,
        age: age && !isNaN(parseInt(age)) ? parseInt(age) : null,
        address,
        district,
        state,
        bloodGroup,
        emergency,
      }
    });

    // Auto-login the user
    await setSession({ id: newPatient.id, role: "PATIENT", name: newPatient.name });

    return NextResponse.json({ success: true, patient: newPatient, redirect: "/patient/dashboard" });
  } catch (error) {
    console.error("Registration error", error);
    return NextResponse.json({ error: "Failed to register patient" }, { status: 500 });
  }
}
