import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAdmin } from "@/lib/admin-protect";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const check = ensureAdmin(req);
  if (!check.isAuthorized) return check.response;
  try {
    const data = await req.json();
    const availability = await prisma.dailyAvailability.update({
      where: { id: Number(params.id) },
      data
    });
    return NextResponse.json(availability);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to update availability" }, { status: 400 });
  }
}

