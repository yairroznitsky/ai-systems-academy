import { redirect } from "next/navigation";
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

export default async function CapstonePage() {
  const user = await getOrCreateGuestUser();
  const lesson20 = await prisma.lesson.findUnique({
    where: { orderIndex: 20 },
  });
  if (!lesson20) {
    redirect("/");
  }

  const progress = await prisma.userLessonProgress.findUnique({
    where: {
      userId_lessonId: { userId: user.id, lessonId: lesson20.id },
    },
  });

  const passedLesson20 = progress?.status === "COMPLETED" && progress?.passed;
  if (!passedLesson20) {
    redirect("/lesson/20");
  }

  const badges = await prisma.userBadge.findMany({
    where: { userId: user.id },
    orderBy: { earnedAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-xl space-y-8 text-center">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
          Course complete
        </h1>
        <p className="mt-3 text-sm leading-7 text-zinc-400 md:text-base">
          You have completed all 20 lessons of the AI Systems Academy. Congratulations!
        </p>
      </header>

      <Badge variant="warn" className="text-sm">
        {BADGE_LABELS.COURSE_COMPLETE}
      </Badge>

      <Card>
        <CardContent className="pt-5">
          <h2 className="mb-4 text-lg font-semibold text-zinc-200 md:text-xl">
            Your badges
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {badges.map((b) => (
              <Badge key={b.id} variant="warn">
                {BADGE_LABELS[b.code]}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-zinc-500">
        20/20 lessons completed
      </p>

      <ButtonLink href="/" variant="primary" size="lg">
        Back to dashboard
      </ButtonLink>
    </div>
  );
}
