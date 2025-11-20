import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const ADMIN_COOKIE = "admin_token";

type TokenPayload = {
  adminId: number;
  email: string;
};

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
}

export function createAdminSession(payload: TokenPayload) {
  const token = jwt.sign(payload, getSecret(), { expiresIn: "12h" });
  cookies().set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 12,
    path: "/"
  });
}

export function clearAdminSession() {
  cookies().delete(ADMIN_COOKIE);
}

export function verifyAdminToken(token: string | undefined): TokenPayload | null {
  if (!token) return null;
  try {
    return jwt.verify(token, getSecret()) as TokenPayload;
  } catch {
    return null;
  }
}

export function getAdminFromRequest(req: NextRequest): TokenPayload | null {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(token);
}

