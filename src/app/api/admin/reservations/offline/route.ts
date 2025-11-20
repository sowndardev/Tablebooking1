import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import { prisma } from "@/lib/prisma";
import { ensureAdmin } from "@/lib/admin-protect";
import { allocateTableOrThrow, generateBookingCode } from "@/lib/reservations";
import { notifyTodook } from "@/lib/webhooks";

export async function POST(req: NextRequest) {
  const check = ensureAdmin(req);
  if (!check.isAuthorized) return check.response;
  try {
    const payload = await req.json();
    const date = dayjs(payload.date).startOf("day").toDate();

    const reservation = await prisma.$transaction(async (tx) => {
      const allocation = await allocateTableOrThrow(tx, {
        locationId: payload.locationId,
        date,
        timeSlot: payload.timeSlot,
        requestedPax: payload.requestedPax
      });

      const created = await tx.reservation.create({
        data: {
          bookingCode: "TEMP",
          customerName: payload.customerName,
          customerPhone: payload.customerPhone,
          customerEmail: payload.customerEmail,
          locationId: payload.locationId,
          date,
          timeSlot: payload.timeSlot,
          requestedPax: payload.requestedPax,
          allocatedTableTypeId: allocation.tableTypeId,
          availabilityId: allocation.availabilityId,
          status: "CONFIRMED",
          paymentStatus: payload.paymentStatus ?? "PAID",
          paymentReference: payload.paymentReference ?? "OFFLINE",
          source: payload.source ?? "OFFLINE"
        }
      });

      return tx.reservation.update({
        where: { id: created.id },
        data: { bookingCode: generateBookingCode(created.id) },
        include: { location: true, tableType: true }
      });
    });

    await notifyTodook({
      bookingCode: reservation.bookingCode,
      status: reservation.status,
      paymentStatus: reservation.paymentStatus
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to create offline booking" }, { status: 400 });
  }
}

