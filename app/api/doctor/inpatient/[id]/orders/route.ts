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

    const orders = await prisma.prescription.findMany({
      where: {
        encounterId: id,
        type: "INPATIENT",
      },
      orderBy: { drugName: "asc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Failed to fetch inpatient orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch inpatient orders" },
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
    const { drugName, dose, frequency, duration, route, instructions } =
      await req.json();

    const order = await prisma.prescription.create({
      data: {
        encounterId: id,
        type: "INPATIENT",
        status: "PENDING",
        drugName,
        dose,
        frequency,
        duration,
        route,
        instructions,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Failed to create inpatient order:", error);
    return NextResponse.json(
      { error: "Failed to create inpatient order" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "DOCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await params;
    const { prescriptionId } = await req.json();

    await prisma.prescription.delete({
      where: { id: prescriptionId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete inpatient order:", error);
    return NextResponse.json(
      { error: "Failed to delete inpatient order" },
      { status: 500 }
    );
  }
}
