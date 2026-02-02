"use client";

import { useState } from "react";
import Link from "next/link";
import { submitLessonProgress } from "./submit-progress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

type Choice = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type Question = {
  id: string;
  prompt: string;
  explanation: string | null;
  choices: Choice[];
};

type QuizClientProps = {
  questions: Question[];
  passScore: number;
  lessonOrderIndex: number;
};

export function QuizClient({
  questions,
  passScore,
  lessonOrderIndex,
}: QuizClientProps) {
  const [selectedByQuestion, setSelectedByQuestion] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ ok: boolean; error?: string } | null>(null);

  const allAnswered =
    questions.length > 0 &&
    questions.every((q) => selectedByQuestion[q.id] !== undefined);
  const correctCount = questions.reduce((acc, q) => {
    const choiceId = selectedByQuestion[q.id];
    if (!choiceId) return acc;
    const choice = q.choices.find((c) => c.id === choiceId);
    return acc + (choice?.isCorrect ? 1 : 0);
  }, 0);
  const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const passed = score >= passScore;

  const handleSelect = (questionId: string, choiceId: string) => {
    if (submitted) return;
    setSelectedByQuestion((prev) => ({ ...prev, [questionId]: choiceId }));
  };

  const handleSubmit = async () => {
    if (!allAnswered || submitted) return;
    setSubmitted(true);
    const result = await submitLessonProgress(lessonOrderIndex, score, passed);
    setSubmitResult(result);
  };

  const handleRetake = () => {
    setSelectedByQuestion({});
    setSubmitted(false);
    setSubmitResult(null);
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-zinc-900 md:text-xl">
          Quiz
        </h3>
        <p className="mt-1 text-sm text-zinc-600">
          Pass score: {passScore}%. Answer all questions to see your result.
        </p>
      </CardHeader>
      <CardContent className="space-y-6 pt-0">
        {questions.map((q) => {
          const selectedId = selectedByQuestion[q.id];
          const showFeedback = submitted;
          return (
            <div
              key={q.id}
              className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors duration-150"
            >
              <p className="mb-4 font-semibold text-zinc-900">
                {q.prompt}
              </p>
              <ul className="space-y-2" role="radiogroup" aria-label={q.prompt}>
                {q.choices.map((c) => {
                  const isSelected = selectedId === c.id;
                  const showCorrect = showFeedback && c.isCorrect;
                  const showIncorrect = showFeedback && isSelected && !c.isCorrect;
                  const disabled = submitted;

                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={c.text}
                        onClick={() => handleSelect(q.id, c.id)}
                        disabled={disabled}
                        className={cn(
                          "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors duration-150",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                          disabled && "cursor-default",
                          !disabled && "cursor-pointer",
                          showCorrect &&
                            "border-green-300 bg-green-50 text-green-900",
                          showIncorrect &&
                            "border-red-300 bg-red-50 text-red-900",
                          !showCorrect &&
                            !showIncorrect &&
                            isSelected &&
                            "border-indigo-300 bg-indigo-50 text-indigo-900",
                          !showCorrect &&
                            !showIncorrect &&
                            !isSelected &&
                            "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50"
                        )}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span>{c.text}</span>
                          {showCorrect && (
                            <span className="shrink-0 text-green-600">✓</span>
                          )}
                          {showIncorrect && (
                            <span className="shrink-0 text-red-600">✗</span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              {showFeedback && q.explanation && (
                <p className="mt-3 border-t border-zinc-200 pt-3 text-sm leading-6 text-zinc-600">
                  {q.explanation}
                </p>
              )}
            </div>
          );
        })}

        {!submitted ? (
          <div className="pt-2">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!allAnswered}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Submit quiz
            </Button>
          </div>
        ) : (
          <div className="space-y-6 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xl font-semibold tabular-nums text-zinc-900">
                {correctCount}/{questions.length} correct · {score}%
              </span>
              <Badge variant={passed ? "success" : "warn"}>
                {passed ? "Passed" : "Not passed"}
              </Badge>
            </div>
            {submitResult && !submitResult.ok && (
              <p className="text-sm text-red-600">{submitResult.error}</p>
            )}
            <p className="text-sm text-zinc-600">
              {passed
                ? "You’ve unlocked the next lesson."
                : "You need " + passScore + "% to pass. Retake the quiz to try again."}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={handleRetake}
                variant="secondary"
                size="md"
              >
                Retake quiz
              </Button>
              <ButtonLink href="/" variant="ghost" size="md">
                Back to dashboard
              </ButtonLink>
              {passed && lessonOrderIndex < 20 && (
                <ButtonLink
                  href={`/lesson/${lessonOrderIndex + 1}`}
                  variant="success"
                  size="md"
                >
                  Next lesson →
                </ButtonLink>
              )}
              {passed && lessonOrderIndex === 20 && (
                <ButtonLink href="/capstone" variant="success" size="md">
                  Go to Capstone →
                </ButtonLink>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
