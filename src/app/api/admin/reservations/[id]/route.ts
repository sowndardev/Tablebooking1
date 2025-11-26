export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAdmin } from "@/lib/admin-protect";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const check = ensureAdmin(req);
  if (!check.isAuthorized) return check.response;

  try {
    const id = Number(params.id);
    const body = await req.json();

    const reservation = await prisma.reservation.update({
      where: { id },
      data: {
        status: body.status,
        paymentStatus: body.paymentStatus,
        requestedPax: body.requestedPax ? Number(body.requestedPax) : undefined,
        date: body.date ? new Date(body.date) : undefined,
        timeSlot: body.timeSlot,
      },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update reservation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const check = ensureAdmin(req);
  if (!check.isAuthorized) return check.response;

  try {
    const id = Number(params.id);
    await prisma.reservation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete reservation" },
      { status: 500 }
    );
  }
}
