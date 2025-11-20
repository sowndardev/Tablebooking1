import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const types = await prisma.tableType.findMany({
    where: { isActive: true },
    orderBy: { paxSize: "asc" }
  });
  return NextResponse.json(types);
}

