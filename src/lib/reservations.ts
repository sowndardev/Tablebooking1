import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { prisma } from "./prisma";
import { notifyTodook } from "./webhooks";

export function generateBookingCode(id: number): string {
  const year = dayjs().format("YY");
  return `RB${year}-${id.toString().padStart(5, "0")}`;
}

type AllocationInput = {
  locationId: number;
  date: Date;
  timeSlot: string;
  requestedPax: number;
};

export async function allocateTableOrThrow(
  tx: Prisma.TransactionClient,
  input: AllocationInput
) {
  const tableTypes = await tx.tableType.findMany({
    where: { isActive: true, paxSize: { gte: input.requestedPax } },
    orderBy: { paxSize: "asc" }
  });

  for (const tableType of tableTypes) {
    const availability = await tx.dailyAvailability.findUnique({
      where: {
        locationId_date_timeSlot_tableTypeId: {
          locationId: input.locationId,
          date: input.date,
          timeSlot: input.timeSlot,
          tableTypeId: tableType.id
        }
      }
    });

    if (availability && availability.availableTables > 0) {
      await tx.dailyAvailability.update({
        where: { id: availability.id },
        data: { availableTables: { decrement: 1 } }
      });

      return { tableTypeId: tableType.id, availabilityId: availability.id };
    }
  }

  throw new Error("No tables available for the selection");
}

export async function releaseAvailability(availabilityId: number) {
  await prisma.dailyAvailability.update({
    where: { id: availabilityId },
    data: { availableTables: { increment: 1 } }
  });
}

export async function markPaymentSuccess(reservationId: number, reference: string) {
  const updated = await prisma.reservation.update({
    where: { id: reservationId },
    data: {
      status: "CONFIRMED",
      paymentStatus: "PAID",
      paymentReference: reference
    }
  });
  await notifyTodook({
    bookingCode: updated.bookingCode,
    status: updated.status,
    paymentStatus: updated.paymentStatus
  });
  return updated;
}

export async function markPaymentFailure(reservationId: number) {
  const reservation = await prisma.reservation.update({
    where: { id: reservationId },
    data: {
      status: "PAYMENT_FAILED",
      paymentStatus: "FAILED"
    }
  });

  if (reservation.availabilityId) {
    await releaseAvailability(reservation.availabilityId);
  }

  await notifyTodook({
    bookingCode: reservation.bookingCode,
    status: reservation.status,
    paymentStatus: reservation.paymentStatus
  });

  return reservation;
}

