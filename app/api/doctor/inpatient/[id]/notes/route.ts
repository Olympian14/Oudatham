import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "DOCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const notes = await prisma.progressNote.findMany({
      where: { encounterId: id },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Failed to fetch progress notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress notes" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "DOCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { subjective, objective, assessment, plan, vitals, investigations } =
      await req.json();

    const note = await prisma.progressNote.create({
      data: {
        encounterId: id,
        subjective,
        objective,
        assessment,
        plan,
        vitals,
        investigations,
      },
    });

    return NextResponse.json({ success: true, note });
  } catch (error) {
    console.error("Failed to create progress note:", error);
    return NextResponse.json(
      { error: "Failed to create progress note" },
      { status: 500 }
    );
  }
}
