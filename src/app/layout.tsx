import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getOrCreateGuestUser } from "@/lib/guest";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/sidebar";
import type { SidebarModule } from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Systems Academy",
  description: "Learn AI systems: LLMs, RAG, agents, and more.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getOrCreateGuestUser();
  const modulesRaw = await prisma.module.findMany({
    orderBy: { orderIndex: "asc" },
    include: {
      lessons: { orderBy: { orderIndex: "asc" } },
    },
  });
  const lessonIds = modulesRaw.flatMap((m) => m.lessons.map((l) => l.id));
  const progressList = await prisma.userLessonProgress.findMany({
    where: { userId: user.id, lessonId: { in: lessonIds } },
  });
  const progressByLessonId: Record<string, { status: string; passed: boolean }> = {};
  for (const p of progressList) {
    progressByLessonId[p.lessonId] = { status: p.status, passed: p.passed };
  }
  const completedCount = progressList.filter(
    (p) => p.status === "COMPLETED" && p.passed
  ).length;

  const progressByLessonIdMap = new Map(
    progressList.map((p) => [p.lessonId, { status: p.status, passed: p.passed }])
  );
  let nextLessonOrderIndex: number | null = null;
  for (let i = 1; i <= 20; i++) {
    const lesson = modulesRaw.flatMap((m) => m.lessons).find((l) => l.orderIndex === i);
    if (!lesson) continue;
    const prog = progressByLessonIdMap.get(lesson.id);
    const status = prog?.status ?? "LOCKED";
    if (status === "UNLOCKED") {
      nextLessonOrderIndex = i;
      break;
    }
  }
  if (nextLessonOrderIndex === null && completedCount < 20) nextLessonOrderIndex = 1;

  const modules: SidebarModule[] = modulesRaw.map((m) => ({
    id: m.id,
    orderIndex: m.orderIndex,
    title: m.title,
    lessons: m.lessons.map((l) => ({
      id: l.id,
      orderIndex: l.orderIndex,
      title: l.title,
    })),
  }));

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-zinc-50 antialiased`}
      >
        <div className="flex min-h-screen">
          <Sidebar
            modules={modules}
            progressByLessonId={progressByLessonId}
            completedCount={completedCount}
            nextLessonOrderIndex={nextLessonOrderIndex}
          />
          <main className="flex-1 overflow-auto bg-zinc-50">
            <div className="mx-auto min-h-full max-w-[860px] px-6 py-8 md:px-10">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
