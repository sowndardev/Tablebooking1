import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

// PUT - Update availability
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { totalTables, availableTables } = await req.json();
        const id = Number(params.id);

        const updated = await prisma.dailyAvailability.update({
            where: { id },
            data: {
                totalTables: Number(totalTables),
                availableTables: Number(availableTables)
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to update availability" }, { status: 500 });
    }
}

// PATCH - Toggle isActive status
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { isActive } = await req.json();
        const id = Number(params.id);

        const updated = await prisma.dailyAvailability.update({
            where: { id },
            data: { isActive: Boolean(isActive) }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to toggle availability" }, { status: 500 });
    }
}

// DELETE - Delete availability slot
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = Number(params.id);

        await prisma.dailyAvailability.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Availability deleted" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to delete availability" }, { status: 500 });
    }
}
