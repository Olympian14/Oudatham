import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "LAB_TECH") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const { id } = await params;
    const formData = await req.formData();
    const result = formData.get("result") as string;

    await prisma.investigation.update({
      where: { id },
      data: { status: "COMPLETED", result }
    });

    return NextResponse.redirect(new URL("/lab/dashboard", req.url));
  } catch (error) {
    return NextResponse.redirect(new URL("/lab/dashboard?error=1", req.url));
  }
}
