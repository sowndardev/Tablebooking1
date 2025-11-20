import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locationId = Number(searchParams.get("locationId"));
  const requestedPax = Number(searchParams.get("requestedPax"));
  const dateParam = searchParams.get("date");

  if (!locationId || !requestedPax || !dateParam) {
    return NextResponse.json({ message: "Missing query params" }, { status: 400 });
  }

  const date = dayjs(dateParam).startOf("day").toDate();

  // Check if restaurant is closed on this date
  const closure = await prisma.restaurantClosure.findFirst({
    where: {
      OR: [
        { locationId: null }, // Applies to all locations
        { locationId: locationId }
      ],
      startDate: { lte: date },
      endDate: { gte: date }
    }
  });

  if (closure) {
    return NextResponse.json({
      message: "Restaurant is closed on this date",
      closed: true,
      reason: closure.reason
    }, { status: 200 });
  }

  const rows = await prisma.dailyAvailability.findMany({
    where: {
      locationId,
      date,
      availableTables: { gt: 0 },
      tableType: { paxSize: { gte: requestedPax }, isActive: true }
    },
    include: { tableType: true },
    orderBy: [{ timeSlot: "asc" }, { tableType: { paxSize: "asc" } }]
  });

  const slotsMap = new Map<
    string,
    { timeSlot: string; tableTypeId: number; paxSize: number; availabilityId: number }
  >();

  rows.forEach((row) => {
    const existing = slotsMap.get(row.timeSlot);
    if (!existing || row.tableType.paxSize < existing.paxSize) {
      slotsMap.set(row.timeSlot, {
        timeSlot: row.timeSlot,
        tableTypeId: row.tableTypeId,
        paxSize: row.tableType.paxSize,
        availabilityId: row.id
      });
    }
  });

  const slots = Array.from(slotsMap.values());
  return NextResponse.json(slots);
}

