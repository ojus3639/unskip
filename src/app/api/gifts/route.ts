import { NextResponse } from "next/server";
import { readRegistry, toPublicGift } from "@/lib/registry";

export async function GET() {
  const data = await readRegistry();
  return NextResponse.json({
    gifts: data.gifts.map(toPublicGift),
  });
}
