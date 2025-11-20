import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import { prisma } from "@/lib/prisma";
import { ensureAdmin } from "@/lib/admin-protect";

export async function GET(req: NextRequest) {
  const check = ensureAdmin(req);
  if (!check.isAuthorized) return check.response;
  const { searchParams } = new URL(req.url);
  const locationId = Number(searchParams.get("locationId"));
  const date = searchParams.get("date");

  const where: Record<string, unknown> = {};
  if (!Number.isNaN(locationId)) where.locationId = locationId;
  if (date) {
    where.date = dayjs(date).startOf("day").toDate();
  }

  const slots = await prisma.dailyAvailability.findMany({
    where,
    include: { tableType: true },
    orderBy: [{ timeSlot: "asc" }, { tableType: { paxSize: "asc" } }]
  });
  return NextResponse.json(slots);
}

export async function POST(req: NextRequest) {
  const check = ensureAdmin(req);
  if (!check.isAuthorized) return check.response;
  try {
    const data = await req.json();
    const date = dayjs(data.date).startOf("day").toDate();
    const availability = await prisma.dailyAvailability.upsert({
      where: {
        locationId_date_timeSlot_tableTypeId: {
          locationId: data.locationId,
          date,
          timeSlot: data.timeSlot,
          tableTypeId: data.tableTypeId
        }
      },
      update: {
        totalTables: data.totalTables,
        availableTables: data.availableTables ?? data.totalTables
      },
      create: {
        locationId: data.locationId,
        tableTypeId: data.tableTypeId,
        date,
        timeSlot: data.timeSlot,
        totalTables: data.totalTables,
        availableTables: data.availableTables ?? data.totalTables
      }
    });
    return NextResponse.json(availability);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to save availability" }, { status: 400 });
  }
}

