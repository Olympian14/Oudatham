import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "DOCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const encounters = await prisma.encounter.findMany({
      where: {
        department: "General Medicine",
        status: { in: ["WAITING", "IN_CONSULTATION"] }
      },
      include: {
        patient: true
      },
      orderBy: { createdAt: "asc" }
    });

    return NextResponse.json(encounters);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
