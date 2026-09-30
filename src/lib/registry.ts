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
const KV_KEY = "wedding-registry";

function isRunningOnVercel(): boolean {
  return process.env.VERCEL === "1";
}

function hasKvStorage(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function shouldTryBlobStorage(): boolean {
  return (
    Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID) ||
    isRunningOnVercel()
  );
}

function storageSetupMessage(): string {
  return (
    "Saving is not configured on Vercel yet. In your Vercel project go to Storage → Create → Blob " +
    "(recommended), connect it to this app, then redeploy. Reservations and gift edits will work after that."
  );
}

function mapStorageError(error: unknown): Error {
  const raw = error instanceof Error ? error.message : String(error);
  if (
    raw.includes("No blob credentials") ||
    raw.includes("BLOB_READ_WRITE_TOKEN") ||
    raw.includes("BLOB_STORE_ID") ||
    raw.includes("EROFS") ||
    raw.includes("EPERM")
  ) {
    return new Error(storageSetupMessage());
  }
  return error instanceof Error ? error : new Error(raw);
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
    throw new Error("Could not load gift list from blob storage.");
  }
  return (await res.json()) as RegistryData;
}

async function kvCommand<T>(command: unknown[]): Promise<T> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error("KV storage is not configured.");
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`KV request failed (${res.status}).`);
  }

  const body = (await res.json()) as { result?: T; error?: string };
  if (body.error) {
    throw new Error(body.error);
  }
  return body.result as T;
}

async function readRegistryFromKv(): Promise<RegistryData | null> {
  const raw = await kvCommand<string | null>(["GET", KV_KEY]);
  if (!raw) return null;
  return JSON.parse(raw) as RegistryData;
}

async function writeRegistryToKv(data: RegistryData): Promise<void> {
  await kvCommand(["SET", KV_KEY, JSON.stringify(data)]);
}

async function writeRegistryToBlob(data: RegistryData): Promise<void> {
  const payload = JSON.stringify(data, null, 2);
  await put(BLOB_PATHNAME, payload, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

async function readFromRemoteStorage(): Promise<RegistryData | null> {
  if (shouldTryBlobStorage()) {
    try {
      const fromBlob = await readRegistryFromBlob();
      if (fromBlob) return fromBlob;
    } catch {
      /* try KV or file fallback */
    }
  }

  if (hasKvStorage()) {
    try {
      const fromKv = await readRegistryFromKv();
      if (fromKv) return fromKv;
    } catch {
      /* fall through */
    }
  }

  return null;
}

export async function readRegistry(): Promise<RegistryData> {
  const remote = await readFromRemoteStorage();
  if (remote) return remote;

  return readRegistryFromFile();
}

export async function writeRegistry(data: RegistryData): Promise<void> {
  if (isRunningOnVercel()) {
    const errors: string[] = [];

    if (shouldTryBlobStorage()) {
      try {
        await writeRegistryToBlob(data);
        return;
      } catch (error) {
        errors.push(mapStorageError(error).message);
      }
    }

    if (hasKvStorage()) {
      try {
        await writeRegistryToKv(data);
        return;
      } catch (error) {
        errors.push(mapStorageError(error).message);
      }
    }

    throw new Error(errors[0] ?? storageSetupMessage());
  }

  if (shouldTryBlobStorage()) {
    try {
      await writeRegistryToBlob(data);
      return;
    } catch {
      /* local dev without blob token — use file */
    }
  }

  if (hasKvStorage()) {
    await writeRegistryToKv(data);
    return;
  }

  try {
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    throw mapStorageError(error);
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
