import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAdmin } from "@/lib/admin-protect";

export async function GET(req: NextRequest) {
  const check = ensureAdmin(req);
  if (!check.isAuthorized) return check.response;
  const tableTypes = await prisma.tableType.findMany({ orderBy: { paxSize: "asc" } });
  return NextResponse.json(tableTypes);
}

export async function POST(req: NextRequest) {
  const check = ensureAdmin(req);
  if (!check.isAuthorized) return check.response;
  try {
    const data = await req.json();
    const type = await prisma.tableType.create({
      data: {
        paxSize: Number(data.paxSize),
        description: data.description,
        isActive: data.isActive ?? true
      }
    });
    return NextResponse.json(type);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to create table type" }, { status: 400 });
  }
}

