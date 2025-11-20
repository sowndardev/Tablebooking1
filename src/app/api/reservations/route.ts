import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import { prisma } from "@/lib/prisma";
import { allocateTableOrThrow, generateBookingCode } from "@/lib/reservations";
import { createReservationSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const parsed = createReservationSchema.parse({
      ...data,
      locationId: Number(data.locationId),
      requestedPax: Number(data.requestedPax)
    });

    const date = dayjs(parsed.date).startOf("day").toDate();

    const result = await prisma.$transaction(async (tx) => {
      const allocation = await allocateTableOrThrow(tx, {
        locationId: parsed.locationId,
        date,
        timeSlot: parsed.timeSlot,
        requestedPax: parsed.requestedPax
      });

      const created = await tx.reservation.create({
        data: {
          bookingCode: "TEMP",
          customerName: parsed.customerName,
          customerPhone: parsed.customerPhone,
          customerEmail: parsed.customerEmail,
          locationId: parsed.locationId,
          date,
          timeSlot: parsed.timeSlot,
          requestedPax: parsed.requestedPax,
          allocatedTableTypeId: allocation.tableTypeId,
          availabilityId: allocation.availabilityId,
          status: "PENDING_PAYMENT",
          paymentStatus: "UNPAID",
          source: parsed.source
        }
      });

      const withCode = await tx.reservation.update({
        where: { id: created.id },
        data: { bookingCode: generateBookingCode(created.id) },
        include: { location: true, tableType: true }
      });

      return withCode;
    });

    return NextResponse.json({
      reservation: result,
      paymentUrl: `/payment/${result.bookingCode}`
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to create reservation" }, { status: 400 });
  }
}

