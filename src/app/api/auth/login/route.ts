import { NextResponse } from "next/server";
import {
  getSessionTokenValue,
  sessionCookieName,
  sessionCookieOptions,
  verifyCredentials,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    username?: string;
    password?: string;
  };

  if (!verifyCredentials(body.username ?? "", body.password ?? "")) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(
    sessionCookieName,
    getSessionTokenValue(),
    sessionCookieOptions
  );
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(sessionCookieName, "", {
    ...sessionCookieOptions,
    maxAge: 0,
  });
  return response;
}
