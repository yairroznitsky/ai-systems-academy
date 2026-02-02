import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createGuestUserAndUnlockLesson1,
  getGuestUser,
  GUEST_COOKIE_NAME,
  GUEST_COOKIE_MAX_AGE,
} from "@/lib/guest";

/**
 * GET /api/guest
 * Establishes a guest user and sets the cookie (allowed only in Route Handlers).
 * Then redirects to /. Call this when getGuestUser() returns null.
 */
export async function GET(request: Request) {
  const user = await getGuestUser();
  if (user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const guest = await createGuestUserAndUnlockLesson1();
  const cookieStore = await cookies();
  cookieStore.set(GUEST_COOKIE_NAME, guest.guestKey, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: GUEST_COOKIE_MAX_AGE,
  });

  return NextResponse.redirect(new URL("/", request.url));
}
