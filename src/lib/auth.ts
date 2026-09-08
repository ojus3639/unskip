import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "registry_session";
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin";

function getSecret() {
  return process.env.REGISTRY_SECRET ?? "wedding-registry-dev-secret";
}

function createSessionToken() {
  return createHmac("sha256", getSecret())
    .update("registry-admin")
    .digest("hex");
}

export function verifyCredentials(username: string, password: string) {
  return username === ADMIN_USER && password === ADMIN_PASS;
}

export function getSessionTokenValue() {
  return createSessionToken();
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return false;
  const expected = createSessionToken();
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export const sessionCookieName = COOKIE_NAME;

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};
