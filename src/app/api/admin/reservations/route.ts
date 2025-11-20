import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import { prisma } from "@/lib/prisma";
import { ensureAdmin } from "@/lib/admin-protect";

export async function GET(req: NextRequest) {
  const check = ensureAdmin(req);
  if (!check.isAuthorized) return check.response;
  const { searchParams } = new URL(req.url);
  const filters: Record<string, unknown> = {};
  const where: any = {};

  const locationId = searchParams.get("locationId");
  if (locationId) where.locationId = Number(locationId);

  const status = searchParams.get("status");
  if (status) where.status = status;

  const paymentStatus = searchParams.get("paymentStatus");
  if (paymentStatus) where.paymentStatus = paymentStatus;

  const source = searchParams.get("source");
  if (source) where.source = source;

  const search = searchParams.get("search");
  if (search) {
    where.OR = [
      { customerPhone: { contains: search } },
      { bookingCode: { contains: search } }
    ];
  }

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (from || to) {
    where.date = {};
    if (from) where.date.gte = dayjs(from).startOf("day").toDate();
    if (to) where.date.lte = dayjs(to).endOf("day").toDate();
  }

  Object.assign(filters, { where });

  const reservations = await prisma.reservation.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      location: true,
      tableType: true
    },
    take: 200
  });

  return NextResponse.json(reservations);
}

