"use server";

import { getOrCreateGuestUser } from "@/lib/guest";
import { prisma } from "@/lib/prisma";
import { BadgeCode } from "@prisma/client";

const MODULE_LAST_LESSON_ORDER: Record<number, BadgeCode> = {
  4: "MODULE_1_COMPLETE",
  7: "MODULE_2_COMPLETE",
  11: "MODULE_3_COMPLETE",
  15: "MODULE_4_COMPLETE",
  18: "MODULE_5_COMPLETE",
  20: "MODULE_6_COMPLETE",
};

export type SubmitProgressResult = { ok: true } | { ok: false; error: string };

export async function submitLessonProgress(
  lessonOrderIndex: number,
  score: number,
  passed: boolean
): Promise<SubmitProgressResult> {
  try {
    const user = await getOrCreateGuestUser();
    const lesson = await prisma.lesson.findUnique({
      where: { orderIndex: lessonOrderIndex },
    });
    if (!lesson) return { ok: false, error: "Lesson not found" };

    const existing = await prisma.userLessonProgress.findUnique({
      where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
    });

    const bestScore = existing
      ? Math.max(existing.bestScore, score)
      : score;
    const attempts = (existing?.attempts ?? 0) + 1;

    await prisma.userLessonProgress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
      create: {
        userId: user.id,
        lessonId: lesson.id,
        status: passed ? "COMPLETED" : "UNLOCKED",
        bestScore,
        lastScore: score,
        attempts,
        passed,
        completedAt: passed ? new Date() : null,
      },
      update: {
        bestScore,
        lastScore: score,
        attempts,
        passed: existing?.passed || passed,
        status: passed ? "COMPLETED" : existing?.status ?? "UNLOCKED",
        completedAt: passed ? new Date() : existing?.completedAt,
      },
    });

    if (passed) {
      const nextOrderIndex = lessonOrderIndex + 1;
      if (nextOrderIndex <= 20) {
        const nextLesson = await prisma.lesson.findUnique({
          where: { orderIndex: nextOrderIndex },
        });
        if (nextLesson) {
          await prisma.userLessonProgress.upsert({
            where: {
              userId_lessonId: { userId: user.id, lessonId: nextLesson.id },
            },
            create: {
              userId: user.id,
              lessonId: nextLesson.id,
              status: "UNLOCKED",
              unlockedAt: new Date(),
            },
            update: {},
          });
        }
      }

      const badgeCode = MODULE_LAST_LESSON_ORDER[lessonOrderIndex];
      if (badgeCode) {
        await prisma.userBadge.upsert({
          where: { userId_code: { userId: user.id, code: badgeCode } },
          create: { userId: user.id, code: badgeCode },
          update: {},
        });
      }
      if (lessonOrderIndex === 20) {
        await prisma.userBadge.upsert({
          where: { userId_code: { userId: user.id, code: "COURSE_COMPLETE" } },
          create: { userId: user.id, code: "COURSE_COMPLETE" },
          update: {},
        });
      }
    }

    return { ok: true };
  } catch (e) {
    console.error(e);
    return { ok: false, error: e instanceof Error ? e.message : "Failed to save progress" };
  }
}
