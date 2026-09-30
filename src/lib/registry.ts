import fs from "fs/promises";
import path from "path";
import { list, put } from "@vercel/blob";

export type Gift = {
  id: string;
  name: string;
  link: string;
  claimedBy: string | null;
  claimedAt: string | null;
};

export type RegistryData = {
  gifts: Gift[];
};

const DATA_PATH = path.join(process.cwd(), "data", "registry.json");
const BLOB_PATHNAME = "wedding-registry/registry.json";

function hasBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readRegistryFromFile(): Promise<RegistryData> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as RegistryData;
}

async function readRegistryFromBlob(): Promise<RegistryData | null> {
  const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 });
  const blob = blobs.find((b) => b.pathname === BLOB_PATHNAME) ?? blobs[0];
  if (!blob) return null;

  const res = await fetch(blob.url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Could not load gift list from storage.");
  }
  return (await res.json()) as RegistryData;
}

export async function readRegistry(): Promise<RegistryData> {
  if (hasBlobStorage()) {
    try {
      const fromBlob = await readRegistryFromBlob();
      if (fromBlob) return fromBlob;
    } catch {
      /* fall back to bundled file */
    }
  }

  return readRegistryFromFile();
}

export async function writeRegistry(data: RegistryData): Promise<void> {
  const payload = JSON.stringify(data, null, 2);

  if (hasBlobStorage()) {
    await put(BLOB_PATHNAME, payload, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }

  try {
    await fs.writeFile(DATA_PATH, payload, "utf-8");
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as NodeJS.ErrnoException).code)
        : "";
    if (code === "EROFS" || code === "EPERM") {
      throw new Error(
        "Gift list cannot be saved on this host. Connect Vercel Blob (BLOB_READ_WRITE_TOKEN) or run locally."
      );
    }
    throw error;
  }
}

export function toPublicGift(gift: Gift) {
  return {
    id: gift.id,
    name: gift.name,
    link: gift.link,
    claimed: Boolean(gift.claimedBy),
  };
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}
