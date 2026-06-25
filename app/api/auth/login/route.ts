import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

const roleDashboards: Record<string, string> = {
  DOCTOR: "/doctor/queue",
  LAB_TECH: "/lab/dashboard",
  RADIOLOGIST: "/radiology/dashboard",
  PHARMACIST: "/pharmacy/dashboard",
  ADMIN: "/admin/dashboard",
};

export async function POST(req: Request) {
  try {
    const { role, mobile, password, otp } = await req.json();

    if (role === "PATIENT") {
      const patient = await prisma.patient.findUnique({ where: { mobile } });
      if (!patient) return NextResponse.json({ error: "Patient not found. Please register." }, { status: 404 });
      if (!otp) return NextResponse.json({ error: "OTP required" }, { status: 400 });

      await setSession({ id: patient.id, role: "PATIENT", name: patient.name });
      return NextResponse.json({ success: true, redirect: "/patient/dashboard" });
    }

    const user = await prisma.user.findUnique({ where: { mobile } });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    await setSession({ id: user.id, role: user.role, name: user.name });
    return NextResponse.json({ success: true, redirect: roleDashboards[user.role] || "/" });
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
