import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { readRegistry, writeRegistry } from "@/lib/registry";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json()) as {
    name?: string;
    release?: boolean;
  };

  const data = await readRegistry();
  const gift = data.gifts.find((g) => g.id === id);

  if (!gift) {
    return NextResponse.json({ error: "Gift not found." }, { status: 404 });
  }

  if (body.release) {
    gift.claimedBy = null;
    gift.claimedAt = null;
    await writeRegistry(data);
    return NextResponse.json({ success: true, gift });
  }

  const name = body.name?.trim();
  if (!name || name.length < 2) {
    return NextResponse.json(
      { error: "Please enter a valid name." },
      { status: 400 }
    );
  }

  if (!gift.claimedBy) {
    return NextResponse.json(
      { error: "This gift is not reserved yet." },
      { status: 400 }
    );
  }

  gift.claimedBy = name;
  await writeRegistry(data);

  return NextResponse.json({ success: true, gift });
}
