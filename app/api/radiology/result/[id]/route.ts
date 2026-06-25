import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "RADIOLOGIST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { report } = await req.json();

    await prisma.imagingOrder.update({
      where: { id },
      data: { status: "COMPLETED", report },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Radiology result error", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
