import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("activeOnly") === "true";

    const timeSlots = await prisma.timeSlot.findMany({
        where: activeOnly ? { isActive: true } : {},
        orderBy: { slot: "asc" } // Sort by time slot string (chronological)
    });

    return NextResponse.json(timeSlots);
}

export async function POST(req: NextRequest) {
    try {
        const { slot } = await req.json();

        if (!slot || typeof slot !== "string") {
            return NextResponse.json({ message: "Invalid slot format" }, { status: 400 });
        }

        // Get the highest sortOrder to append new slot at the end
        const lastSlot = await prisma.timeSlot.findFirst({
            orderBy: { sortOrder: "desc" }
        });

        const newSlot = await prisma.timeSlot.create({
            data: {
                slot,
                isActive: true,
                sortOrder: (lastSlot?.sortOrder ?? -1) + 1
            }
        });

        return NextResponse.json(newSlot);
    } catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json({ message: "Time slot already exists" }, { status: 409 });
        }
        console.error(error);
        return NextResponse.json({ message: "Failed to create time slot" }, { status: 500 });
    }
}
