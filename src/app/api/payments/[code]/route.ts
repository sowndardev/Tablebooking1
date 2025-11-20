import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { markPaymentFailure, markPaymentSuccess } from "@/lib/reservations";

export async function POST(req: NextRequest, { params }: { params: { code: string } }) {
  const { action } = await req.json();
  const reservation = await prisma.reservation.findUnique({
    where: { bookingCode: params.code.toUpperCase() }
  });
  if (!reservation) {
    return NextResponse.json({ message: "Reservation not found" }, { status: 404 });
  }

  if (action === "success") {
    const reference = `PAY-${crypto.randomUUID().split("-")[0].toUpperCase()}`;
    const updated = await markPaymentSuccess(reservation.id, reference);
    return NextResponse.json(updated);
  }

  if (action === "failure") {
    const updated = await markPaymentFailure(reservation.id);
    return NextResponse.json(updated);
  }

  return NextResponse.json({ message: "Unsupported action" }, { status: 400 });
}

