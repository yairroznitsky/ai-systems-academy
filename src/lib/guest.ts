import { cookies } from "next/headers";
import { prisma } from "./prisma";

export const GUEST_COOKIE_NAME = "guest_key";
export const GUEST_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export type GuestUser = {
  id: string;
  guestKey: string;
};

/**
 * Resolves the current user by guest cookie (read-only).
 * Returns null if no cookie or user not found; then redirect to /api/guest to establish the cookie.
 * Use from Server Components. Do not set cookies here (Next.js allows that only in Route Handlers or Server Actions).
 */
export async function getGuestUser(): Promise<GuestUser | null> {
  const cookieStore = await cookies();
  const guestKey = cookieStore.get(GUEST_COOKIE_NAME)?.value;
  if (!guestKey) return null;

  const user = await prisma.user.findUnique({
    where: { guestKey },
  });
  if (!user) return null;

  return { id: user.id, guestKey };
}

/**
 * Use this when you must have a user (e.g. layout, dashboard). Redirects to /api/guest if none.
 */
export async function getOrCreateGuestUser(): Promise<GuestUser> {
  const user = await getGuestUser();
  if (user) return user;
  const { redirect } = await import("next/navigation");
  redirect("/api/guest");
  throw new Error("Redirect");
}

/** Creates a new guest user and ensures lesson 1 is UNLOCKED. Used by the /api/guest Route Handler. */
export async function createGuestUserAndUnlockLesson1(): Promise<GuestUser> {
  const guestKey = crypto.randomUUID();
  const user = await prisma.user.create({
    data: { guestKey },
  });
  await ensureLesson1Unlocked(user.id);
  return { id: user.id, guestKey };
}

/** Ensures lesson 1 has UserLessonProgress with status UNLOCKED for the given user. */
export async function ensureLesson1Unlocked(userId: string): Promise<void> {
  const lesson1 = await prisma.lesson.findUnique({
    where: { orderIndex: 1 },
  });
  if (!lesson1) return;

  await prisma.userLessonProgress.upsert({
    where: {
      userId_lessonId: { userId, lessonId: lesson1.id },
    },
    create: {
      userId,
      lessonId: lesson1.id,
      status: "UNLOCKED",
      unlockedAt: new Date(),
    },
    update: {},
  });
}
