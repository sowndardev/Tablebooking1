import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

// GET - Fetch all closures
export async function GET() {
    const closures = await prisma.restaurantClosure.findMany({
        include: {
            location: { select: { name: true } }
        },
        orderBy: { startDate: "asc" }
    });

    return NextResponse.json(closures);
}

// POST - Create a new closure
export async function POST(req: NextRequest) {
    try {
        const { locationId, startDate, endDate, reason } = await req.json();

        if (!startDate || !endDate || !reason) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const closure = await prisma.restaurantClosure.create({
            data: {
                locationId: locationId && locationId !== "" ? Number(locationId) : null,
                startDate: dayjs(startDate).startOf("day").toDate(),
                endDate: dayjs(endDate).endOf("day").toDate(),
                reason
            }
        });

        return NextResponse.json(closure);
    } catch (error: any) {
        console.error("Error creating closure:", error);
        console.error("Error details:", {
            message: error.message,
            code: error.code,
            meta: error.meta
        });
        return NextResponse.json({
            message: "Failed to create closure",
            error: error.message
        }, { status: 500 });
    }
}
