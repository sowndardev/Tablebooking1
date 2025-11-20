import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyTodook } from "@/lib/webhooks";

export async function POST(req: NextRequest) {
  const { bookingCode, phone } = await req.json();
  if (!bookingCode || !phone) {
    return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
  }

  const reservation = await prisma.reservation.findFirst({
    where: {
      bookingCode: bookingCode.toUpperCase(),
      customerPhone: phone
    }
  });

  if (!reservation) {
    return NextResponse.json({ message: "Reservation not found" }, { status: 404 });
  }

  if (reservation.status === "CANCELLED") {
    return NextResponse.json({ message: "Reservation already cancelled" }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    if (reservation.availabilityId) {
      await tx.dailyAvailability.update({
        where: { id: reservation.availabilityId },
        data: { availableTables: { increment: 1 } }
      });
    }

    await tx.reservation.update({
      where: { id: reservation.id },
      data: {
        status: "CANCELLED",
        paymentStatus: reservation.paymentStatus === "PAID" ? "REFUNDED" : reservation.paymentStatus
      }
    });
  });

  await notifyTodook({
    bookingCode: reservation.bookingCode,
    status: "CANCELLED",
    paymentStatus: reservation.paymentStatus === "PAID" ? "REFUNDED" : reservation.paymentStatus
  });

  return NextResponse.json({ success: true });
}

