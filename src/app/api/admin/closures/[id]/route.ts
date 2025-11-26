export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE - Delete a closure
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = Number(params.id);

        await prisma.restaurantClosure.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Closure deleted" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to delete closure" }, { status: 500 });
    }
}
