export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAdmin } from "@/lib/admin-protect";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const check = ensureAdmin(req);
  if (!check.isAuthorized) return check.response;
  try {
    const data = await req.json();
    const type = await prisma.tableType.update({
      where: { id: Number(params.id) },
      data
    });
    return NextResponse.json(type);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to update table type" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const check = ensureAdmin(req);
  if (!check.isAuthorized) return check.response;
  try {
    await prisma.tableType.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to delete table type" }, { status: 400 });
  }
}

