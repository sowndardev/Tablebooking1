export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAdmin } from "@/lib/admin-protect";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const check = ensureAdmin(req);
  if (!check.isAuthorized) return check.response;
  try {
    const data = await req.json();
    const location = await prisma.location.update({
      where: { id: Number(params.id) },
      data
    });
    return NextResponse.json(location);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to update location" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const check = ensureAdmin(req);
  if (!check.isAuthorized) return check.response;
  try {
    await prisma.location.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to delete location" }, { status: 400 });
  }
}

