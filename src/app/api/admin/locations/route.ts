import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAdmin } from "@/lib/admin-protect";

export async function GET(req: NextRequest) {
  const check = ensureAdmin(req);
  if (!check.isAuthorized) return check.response;
  const locations = await prisma.location.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(locations);
}

export async function POST(req: NextRequest) {
  const check = ensureAdmin(req);
  if (!check.isAuthorized) return check.response;
  try {
    const data = await req.json();
    const location = await prisma.location.create({
      data: {
        name: data.name,
        address: data.address ?? "",
        isActive: data.isActive ?? true
      }
    });
    return NextResponse.json(location);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to create location" }, { status: 400 });
  }
}

