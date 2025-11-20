import { NextRequest, NextResponse } from "next/server";
import { ensureAdmin } from "@/lib/admin-protect";

export async function GET(req: NextRequest) {
  const check = ensureAdmin(req);
  if (!check.isAuthorized) return check.response;
  return NextResponse.json({ admin: check.admin });
}

