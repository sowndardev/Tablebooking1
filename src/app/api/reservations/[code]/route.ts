import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  const reservation = await prisma.reservation.findUnique({
    where: { bookingCode: params.code.toUpperCase() },
    include: { location: true, tableType: true }
  });
  if (!reservation) {
    return NextResponse.json({ message: "Reservation not found" }, { status: 404 });
  }
  return NextResponse.json(reservation);
}

