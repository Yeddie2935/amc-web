import { useMemo, useState } from "react";
import type { Problem } from "../types/amc";
import type { ProblemAttempt, ProblemProgress } from "../types/progress";

const STORAGE_KEY = "fmj-amc8-progress-v2";

const EMPTY_PROGRESS: ProblemProgress = {
  solvedIds: [],
  missedIds: [],
  bookmarkedIds: [],
  attempts: [],
};

function readProgress(): ProblemProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;

    const parsed = JSON.parse(raw) as Partial<ProblemProgress>;

    return {
      solvedIds: parsed.solvedIds ?? [],
      missedIds: parsed.missedIds ?? [],
      bookmarkedIds: parsed.bookmarkedIds ?? [],
      attempts: parsed.attempts ?? [],
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

function saveProgress(progress: ProblemProgress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

export function useLocalProgress(problems: Problem[]) {
  const [progress, setProgress] = useState<ProblemProgress>(() => readProgress());

  function updateProgress(next: ProblemProgress) {
    setProgress(next);
    saveProgress(next);
  }

  function recordAttempt(problem: Problem, selectedAnswer: string) {
    const isCorrect = selectedAnswer === problem.answer;
    const attempt: ProblemAttempt = {
      problemId: problem.id,
      selectedAnswer,
      correctAnswer: problem.answer,
      isCorrect,
      attemptedAt: new Date().toISOString(),
    };

    const next: ProblemProgress = {
      ...progress,
      attempts: [attempt, ...progress.attempts].slice(0, 500),
      solvedIds: isCorrect
        ? unique([...progress.solvedIds, problem.id])
        : progress.solvedIds,
      missedIds: isCorrect
        ? progress.missedIds.filter((id) => id !== problem.id)
        : unique([...progress.missedIds, problem.id]),
    };

    updateProgress(next);
    return attempt;
  }

  function toggleBookmark(problemId: string) {
    const exists = progress.bookmarkedIds.includes(problemId);
    const next: ProblemProgress = {
      ...progress,
      bookmarkedIds: exists
        ? progress.bookmarkedIds.filter((id) => id !== problemId)
        : [...progress.bookmarkedIds, problemId],
    };

    updateProgress(next);
  }

  function resetProgress() {
    updateProgress(EMPTY_PROGRESS);
  }

  const stats = useMemo(() => {
    const total = problems.length;
    const solved = progress.solvedIds.filter((id) =>
      problems.some((problem) => problem.id === id)
    ).length;
    const missed = progress.missedIds.filter((id) =>
      problems.some((problem) => problem.id === id)
    ).length;
    const bookmarked = progress.bookmarkedIds.filter((id) =>
      problems.some((problem) => problem.id === id)
    ).length;
    const attempts = progress.attempts.length;
    const correctAttempts = progress.attempts.filter((attempt) => attempt.isCorrect).length;
    const accuracy = attempts === 0 ? 0 : Math.round((correctAttempts / attempts) * 100);

    return {
      total,
      solved,
      missed,
      bookmarked,
      attempts,
      accuracy,
      percentSolved: total === 0 ? 0 : Math.round((solved / total) * 100),
    };
  }, [problems, progress]);

  return {
    progress,
    stats,
    recordAttempt,
    toggleBookmark,
    resetProgress,
  };
}
