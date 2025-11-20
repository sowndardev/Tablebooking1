import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { isActive, sortOrder } = await req.json();
        const id = parseInt(params.id);

        const updated = await prisma.timeSlot.update({
            where: { id },
            data: {
                ...(typeof isActive === "boolean" && { isActive }),
                ...(typeof sortOrder === "number" && { sortOrder })
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to update time slot" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id);

        await prisma.timeSlot.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Time slot deleted" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to delete time slot" }, { status: 500 });
    }
}
