import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "sb_session";
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

/**
 * Read the anonymous session id from the httpOnly cookie.
 * Returns `null` if no cookie is set.
 */
export async function getSessionId(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

/**
 * Ensure a session id exists. If the cookie is missing, generate a new one
 * via `crypto.randomUUID()` and set it on the provided response.
 *
 * Returns `{ sessionId, isNew }`.
 */
export async function ensureSession(
  res?: NextResponse
): Promise<{ sessionId: string; isNew: boolean }> {
  const existing = await getSessionId();
  if (existing) return { sessionId: existing, isNew: false };

  const sessionId = crypto.randomUUID();

  // When we have a response object, set the cookie on it
  if (res) {
    res.cookies.set(COOKIE_NAME, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: MAX_AGE_SECONDS,
      path: "/",
    });
  }

  return { sessionId, isNew: true };
}

/**
 * Set the session cookie on a NextResponse.
 */
export function setSessionCookie(res: NextResponse, sessionId: string): void {
  res.cookies.set(COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE_SECONDS,
    path: "/",
  });
}
