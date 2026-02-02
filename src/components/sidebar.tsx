"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/button";

export type LessonProgress = {
  status: string;
  passed: boolean;
};

export type SidebarLesson = {
  id: string;
  orderIndex: number;
  title: string;
};

export type SidebarModule = {
  id: string;
  orderIndex: number;
  title: string;
  lessons: SidebarLesson[];
};

type SidebarProps = {
  modules: SidebarModule[];
  progressByLessonId: Record<string, LessonProgress>;
  completedCount: number;
  nextLessonOrderIndex: number | null;
};

export function Sidebar({
  modules,
  progressByLessonId,
  completedCount,
  nextLessonOrderIndex,
}: SidebarProps) {
  const pathname = usePathname();
  const currentLessonMatch = pathname?.match(/^\/lesson\/(\d+)$/);
  const currentLessonOrderIndex = currentLessonMatch
    ? parseInt(currentLessonMatch[1], 10)
    : null;

  return (
    <aside className="flex w-80 shrink-0 flex-col border-r border-zinc-200 bg-white">
      <div className="flex shrink-0 flex-col border-b border-zinc-200 px-5 py-5">
        <Link
          href="/"
          className="font-semibold tracking-tight text-zinc-900 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-indigo-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          AI Systems Academy
        </Link>
        <p className="mt-1 text-xs text-zinc-500">
          20 lessons · quizzes · badges
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        <div className="mb-5 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-sm font-medium text-zinc-600">Progress</span>
            <span className="text-sm tabular-nums text-zinc-600">
              {completedCount}/20
            </span>
          </div>
          <div className="mb-4 h-2 overflow-hidden rounded-full bg-zinc-200">
            <div
              className="h-full rounded-full bg-indigo-600 transition-[width] duration-300"
              style={{ width: `${(completedCount / 20) * 100}%` }}
            />
          </div>
          {nextLessonOrderIndex !== null && completedCount < 20 && (
            <ButtonLink
              href={`/lesson/${nextLessonOrderIndex}`}
              variant="primary"
              size="sm"
              className="w-full"
            >
              Continue
            </ButtonLink>
          )}
          {completedCount === 20 && (
            <ButtonLink
              href="/capstone"
              variant="success"
              size="sm"
              className="w-full"
            >
              View Capstone
            </ButtonLink>
          )}
        </div>

        <nav className="space-y-6">
          {modules.map((mod) => {
            const modLessons = mod.lessons;
            const modCompleted = modLessons.filter(
              (l) => progressByLessonId[l.id]?.status === "COMPLETED" && progressByLessonId[l.id]?.passed
            ).length;
            const modPct = modLessons.length > 0 ? (modCompleted / modLessons.length) * 100 : 0;

            return (
              <div key={mod.id}>
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    {mod.title}
                  </span>
                  <span className="text-[10px] tabular-nums text-zinc-500">
                    {modCompleted}/{modLessons.length}
                  </span>
                </div>
                <div className="mb-1.5 h-0.5 overflow-hidden rounded-full bg-zinc-200">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-[width] duration-300"
                    style={{ width: `${modPct}%` }}
                  />
                </div>
                <ul className="space-y-0.5">
                  {modLessons.map((lesson) => {
                    const progress = progressByLessonId[lesson.id];
                    const status = progress?.status ?? "LOCKED";
                    const passed = progress?.passed ?? false;
                    const isLocked = status === "LOCKED";
                    const isCompleted = status === "COMPLETED" && passed;
                    const isCurrent = currentLessonOrderIndex === lesson.orderIndex;

                    return (
                      <li key={lesson.id}>
                        {isLocked ? (
                          <span className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-400">
                            <LockIcon className="h-4 w-4 shrink-0" />
                            <span className="truncate">Lesson {lesson.orderIndex}</span>
                          </span>
                        ) : (
                          <Link
                            href={`/lesson/${lesson.orderIndex}`}
                            className={cn(
                              "flex items-center gap-2.5 rounded-lg border-l-2 px-3 py-2 text-sm transition-colors duration-150",
                              "focus-visible:ring-2 focus-visible:ring-indigo-400/40 focus-visible:ring-inset focus-visible:ring-offset-0",
                              isCurrent &&
                                "border-l-indigo-600 border border-indigo-100 bg-indigo-50 text-indigo-800",
                              !isCurrent && "border-transparent",
                              !isCurrent && isCompleted && "text-zinc-900 hover:bg-zinc-100",
                              !isCurrent && !isCompleted && "text-zinc-700 hover:bg-zinc-100"
                            )}
                          >
                            {isCompleted ? (
                              <CheckIcon className="h-4 w-4 shrink-0 text-indigo-600" />
                            ) : (
                              <span className="h-4 w-4 shrink-0" />
                            )}
                            <span className="truncate">Lesson {lesson.orderIndex}</span>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="shrink-0 border-t border-zinc-200 p-4">
        <Link
          href="/capstone"
          className="block rounded-lg px-3 py-2 text-center text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-indigo-400/40 focus-visible:ring-inset"
        >
          Capstone
        </Link>
      </div>
    </aside>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}
