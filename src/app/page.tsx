import { getOrCreateGuestUser } from "@/lib/guest";
import { prisma } from "@/lib/prisma";
import { BadgeCode } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BADGE_LABELS: Record<BadgeCode, string> = {
  MODULE_1_COMPLETE: "Foundations of LLMs",
  MODULE_2_COMPLETE: "Using LLMs Effectively",
  MODULE_3_COMPLETE: "RAG",
  MODULE_4_COMPLETE: "Intelligent Agents",
  MODULE_5_COMPLETE: "AI Automation Systems",
  MODULE_6_COMPLETE: "Monitoring & Optimization",
  RAG_BUILDER: "RAG Builder",
  AGENT_ARCHITECT: "Agent Architect",
  AUTOMATION_ENGINEER: "Automation Engineer",
  QA_GUARDIAN: "QA Guardian",
  COURSE_COMPLETE: "Course Complete",
};

export default async function DashboardPage() {
  const user = await getOrCreateGuestUser();
  const [modulesRaw, progressList, badges] = await Promise.all([
    prisma.module.findMany({
      orderBy: { orderIndex: "asc" },
      include: { lessons: { orderBy: { orderIndex: "asc" } } },
    }),
    prisma.userLessonProgress.findMany({
      where: { userId: user.id },
    }),
    prisma.userBadge.findMany({
      where: { userId: user.id },
      orderBy: { earnedAt: "asc" },
    }),
  ]);

  const completedLessonIds = new Set(
    progressList.filter((p) => p.status === "COMPLETED" && p.passed).map((p) => p.lessonId)
  );
  const completedCount = completedLessonIds.size;

  const progressByLessonId = new Map(
    progressList.map((p) => [p.lessonId, { status: p.status, passed: p.passed }])
  );

  let nextLessonOrderIndex: number | null = null;
  for (let i = 1; i <= 20; i++) {
    const lesson = modulesRaw.flatMap((m) => m.lessons).find((l) => l.orderIndex === i);
    if (!lesson) continue;
    const prog = progressByLessonId.get(lesson.id);
    const status = prog?.status ?? "LOCKED";
    if (status === "UNLOCKED") {
      nextLessonOrderIndex = i;
      break;
    }
  }
  if (nextLessonOrderIndex === null && completedCount < 20) {
    nextLessonOrderIndex = 1;
  }

  const allComplete = completedCount === 20;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 text-base leading-7 text-zinc-600">
          Track your progress through the AI Systems Academy.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">
          Overall progress
        </h2>
        <Card>
          <CardContent className="pt-5">
            <div className="mb-3 flex items-baseline justify-between text-sm">
              <span className="text-zinc-600">
                {completedCount} of 20 lessons completed
              </span>
              <span className="font-medium tabular-nums text-zinc-900">
                {Math.round((completedCount / 20) * 100)}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-zinc-200">
              <div
                className="h-full rounded-full bg-indigo-600 transition-[width] duration-300"
                style={{ width: `${(completedCount / 20) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">
          Module progress
        </h2>
        <div className="space-y-3">
          {modulesRaw.map((mod) => {
            const total = mod.lessons.length;
            const completed = mod.lessons.filter((l) =>
              completedLessonIds.has(l.id)
            ).length;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
            return (
              <Card key={mod.id}>
                <CardContent className="py-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-zinc-900">
                      {mod.title}
                    </span>
                    <span className="tabular-nums text-zinc-600">
                      {completed}/{total}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-[width] duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">
          Badges
        </h2>
        <div className="flex flex-wrap gap-2">
          {badges.length === 0 ? (
            <p className="text-sm text-zinc-600">
              Complete modules to earn badges.
            </p>
          ) : (
            badges.map((b) => (
              <Badge key={b.id} variant="warn">
                {BADGE_LABELS[b.code]}
              </Badge>
            ))
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">
          Continue learning
        </h2>
        {allComplete ? (
          <ButtonLink href="/capstone" variant="success" size="lg">
            View Capstone
          </ButtonLink>
        ) : nextLessonOrderIndex !== null ? (
          <ButtonLink
            href={`/lesson/${nextLessonOrderIndex}`}
            variant="primary"
            size="lg"
          >
            {completedCount === 0 ? "Start course" : "Continue"} → Lesson{" "}
            {nextLessonOrderIndex}
          </ButtonLink>
        ) : null}
      </section>
    </div>
  );
}
