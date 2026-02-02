import { redirect, notFound } from "next/navigation";
import { getOrCreateGuestUser } from "@/lib/guest";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { QuizClient } from "./quiz-client";
import { Card, CardContent } from "@/components/ui/card";

type ContentJson = {
  bullets: string[];
  example: string;
  takeaways: string[];
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderIndex = parseInt(id, 10);
  if (Number.isNaN(orderIndex) || orderIndex < 1 || orderIndex > 20) {
    notFound();
  }

  const user = await getOrCreateGuestUser();
  const lesson = await prisma.lesson.findUnique({
    where: { orderIndex },
    include: {
      module: true,
      quiz: {
        include: {
          questions: {
            orderBy: { orderIndex: "asc" },
            include: {
              choices: { orderBy: { orderIndex: "asc" } },
            },
          },
        },
      },
    },
  });

  if (!lesson) notFound();

  const progress = await prisma.userLessonProgress.findUnique({
    where: {
      userId_lessonId: { userId: user.id, lessonId: lesson.id },
    },
  });
  const status = progress?.status ?? "LOCKED";
  if (status === "LOCKED") {
    redirect("/");
  }

  let content: ContentJson;
  try {
    content = JSON.parse(lesson.contentJson) as ContentJson;
  } catch {
    content = { bullets: [], example: "", takeaways: [] };
  }

  return (
    <article className="space-y-8">
      <header className="rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
        <nav className="mb-2 flex items-center gap-2 text-sm text-zinc-600">
          <Link href="/" className="hover:text-zinc-900 focus-visible:underline">
            Dashboard
          </Link>
          <span>/</span>
          <span>{lesson.module.title}</span>
          <span>/</span>
          <span>Lesson {lesson.orderIndex}</span>
        </nav>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            {lesson.title}
          </h1>
          <span className="text-sm text-zinc-500">
            {lesson.timeMinutes} min read
          </span>
        </div>
      </header>

      <p className="text-base leading-7 text-zinc-800">
        {lesson.overview}
      </p>

      {content.bullets.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900">
            Key points
          </h2>
          <Card>
            <CardContent className="pt-5">
              <ul className="space-y-2.5">
                {content.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3 text-base leading-7 text-zinc-800">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}

      {content.example && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900">
            Example
          </h2>
          <div className="rounded-lg border-l-4 border-l-indigo-500 border border-indigo-100 bg-indigo-50 py-3 pl-5 pr-5 text-indigo-900">
            <p className="text-base leading-7">
              {content.example}
            </p>
          </div>
        </section>
      )}

      {content.takeaways.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900">
            Takeaways
          </h2>
          <ul className="space-y-2.5">
            {content.takeaways.map((t, i) => (
              <li key={i} className="flex gap-3 text-base leading-7 text-zinc-800">
                <CheckIcon className="mt-1.5 h-4 w-4 shrink-0 text-indigo-600" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {lesson.quiz && lesson.quiz.questions.length > 0 && (
        <QuizClient
          questions={lesson.quiz.questions.map((q) => ({
            id: q.id,
            prompt: q.prompt,
            explanation: q.explanation,
            choices: q.choices.map((c) => ({
              id: c.id,
              text: c.text,
              isCorrect: c.isCorrect,
            })),
          }))}
          passScore={lesson.quiz.passScore}
          lessonOrderIndex={lesson.orderIndex}
        />
      )}
    </article>
  );
}
