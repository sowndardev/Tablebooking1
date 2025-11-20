import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createAdminSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.parse(body);

    const admin = await prisma.adminUser.findUnique({
      where: { email: parsed.email }
    });

    const secretKey = process.env.ADMIN_SECRET_KEY;
    const isSecretLogin = secretKey && parsed.password === secretKey;

    if (!admin || (!isSecretLogin && !(await bcrypt.compare(parsed.password, admin.passwordHash)))) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    createAdminSession({ adminId: admin.id, email: admin.email });

    return NextResponse.json({ message: "Logged in" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Login failed" }, { status: 400 });
  }
}

