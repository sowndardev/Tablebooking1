export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

// GET - Fetch availability for a specific location and date
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const locationId = searchParams.get("locationId");
    const date = searchParams.get("date");

    if (!locationId || !date) {
        return NextResponse.json({ message: "Missing locationId or date" }, { status: 400 });
    }

    const availability = await prisma.dailyAvailability.findMany({
        where: {
            locationId: Number(locationId),
            date: dayjs(date).startOf("day").toDate()
        },
        include: {
            location: { select: { name: true } },
            tableType: { select: { paxSize: true } }
        },
        orderBy: [{ timeSlot: "asc" }, { tableType: { paxSize: "asc" } }]
    });

    return NextResponse.json(availability);
}
