import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

export async function POST(req: NextRequest) {
    try {
        const {
            locationId,
            startDate,
            endDate,
            daysOfWeek, // [0-6] for Sun-Sat, empty array means all days
            slots // [{ timeSlot, tableTypeId, totalTables, availableTables }]
        } = await req.json();

        if (!locationId || !startDate || !endDate || !slots || slots.length === 0) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const start = dayjs(startDate).startOf("day");
        const end = dayjs(endDate).startOf("day");
        const daysDiff = end.diff(start, "day");

        if (daysDiff < 0) {
            return NextResponse.json({ message: "End date must be after start date" }, { status: 400 });
        }

        if (daysDiff > 90) {
            return NextResponse.json({ message: "Date range cannot exceed 90 days" }, { status: 400 });
        }

        const created = [];

        // Iterate through each day in the range
        for (let i = 0; i <= daysDiff; i++) {
            const currentDate = start.add(i, "day");
            const dayOfWeek = currentDate.day(); // 0 = Sunday, 6 = Saturday

            // Skip if daysOfWeek filter is provided and this day is not included
            if (daysOfWeek && daysOfWeek.length > 0 && !daysOfWeek.includes(dayOfWeek)) {
                continue;
            }

            // Create availability for each slot
            for (const slot of slots) {
                const availability = await prisma.dailyAvailability.upsert({
                    where: {
                        locationId_date_timeSlot_tableTypeId: {
                            locationId: Number(locationId),
                            date: currentDate.toDate(),
                            timeSlot: slot.timeSlot,
                            tableTypeId: Number(slot.tableTypeId)
                        }
                    },
                    update: {
                        totalTables: Number(slot.totalTables),
                        availableTables: Number(slot.availableTables)
                    },
                    create: {
                        locationId: Number(locationId),
                        date: currentDate.toDate(),
                        timeSlot: slot.timeSlot,
                        tableTypeId: Number(slot.tableTypeId),
                        totalTables: Number(slot.totalTables),
                        availableTables: Number(slot.availableTables)
                    }
                });
                created.push(availability);
            }
        }

        return NextResponse.json({
            message: `Created ${created.length} availability slots`,
            count: created.length
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to create bulk availability" }, { status: 500 });
    }
}
