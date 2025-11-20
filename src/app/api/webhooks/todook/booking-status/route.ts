import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  console.log("Todook webhook received:", payload);
  return NextResponse.json({ received: true });
}

