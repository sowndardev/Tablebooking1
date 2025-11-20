import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "./auth";

export function ensureAdmin(req: NextRequest):
  | { isAuthorized: true; admin: { adminId: number; email: string } }
  | { isAuthorized: false; response: NextResponse } {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return {
      isAuthorized: false,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    };
  }
  return { isAuthorized: true, admin };
}

