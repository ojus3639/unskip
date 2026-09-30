import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  Gift,
  readRegistry,
  slugify,
  writeRegistry,
} from "@/lib/registry";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await readRegistry();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    gifts?: Array<{ id?: string; name: string; link?: string }>;
  };

  if (!body.gifts || !Array.isArray(body.gifts)) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const current = await readRegistry();
  const existingById = new Map(current.gifts.map((g) => [g.id, g]));

  const usedIds = new Set<string>();
  const nextGifts: Gift[] = body.gifts
    .map((item) => {
      const name = item.name?.trim();
      if (!name) return null;

      let id = item.id?.trim() || slugify(name);
      if (!id) id = `gift-${Math.random().toString(36).slice(2, 8)}`;

      let uniqueId = id;
      let suffix = 2;
      while (usedIds.has(uniqueId)) {
        uniqueId = `${id}-${suffix}`;
        suffix += 1;
      }
      usedIds.add(uniqueId);

      const previous = existingById.get(uniqueId) ?? existingById.get(id);
      return {
        id: uniqueId,
        name,
        link: item.link?.trim() ?? "",
        claimedBy: previous?.claimedBy ?? null,
        claimedAt: previous?.claimedAt ?? null,
      } satisfies Gift;
    })
    .filter(Boolean) as Gift[];

  try {
    await writeRegistry({ gifts: nextGifts });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save gift list.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ success: true, gifts: nextGifts });
}
