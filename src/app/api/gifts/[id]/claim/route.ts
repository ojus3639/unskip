import { NextResponse } from "next/server";
import { readRegistry, writeRegistry } from "@/lib/registry";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const body = (await request.json()) as { name?: string };
  const name = body.name?.trim();

  if (!name || name.length < 2) {
    return NextResponse.json(
      { error: "Please enter your name or family name." },
      { status: 400 }
    );
  }

  const data = await readRegistry();
  const gift = data.gifts.find((g) => g.id === id);

  if (!gift) {
    return NextResponse.json({ error: "Gift not found." }, { status: 404 });
  }

  if (gift.claimedBy) {
    return NextResponse.json(
      { error: "This gift has already been reserved." },
      { status: 409 }
    );
  }

  gift.claimedBy = name;
  gift.claimedAt = new Date().toISOString();
  await writeRegistry(data);

  return NextResponse.json({ success: true });
}
