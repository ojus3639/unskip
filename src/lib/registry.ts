import fs from "fs/promises";
import path from "path";

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

export async function readRegistry(): Promise<RegistryData> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as RegistryData;
}

export async function writeRegistry(data: RegistryData): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
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
