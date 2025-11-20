import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { bookingCode, phone } = await req.json();
  if (!bookingCode || !phone) {
    return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
  }
  const reservation = await prisma.reservation.findFirst({
    where: {
      bookingCode: bookingCode.toUpperCase(),
      customerPhone: phone
    },
    include: { location: true, tableType: true }
  });
  if (!reservation) {
    return NextResponse.json({ message: "Reservation not found" }, { status: 404 });
  }
  return NextResponse.json(reservation);
}

