import type {
  DifficultyLevel,
  Problem,
  ProblemCategory,
  ProblemFilters,
  ProblemStatus,
} from "../types/amc";
import type { ProblemProgress } from "../types/progress";

export const DEFAULT_FILTERS: ProblemFilters = {
  search: "",
  category: "All",
  difficulty: "All",
  sourceType: "All",
  status: "All",
  year: "All",
  animation: "All",
};

export const CATEGORIES: Array<"All" | ProblemCategory> = [
  "All",
  "Algebra",
  "Geometry",
  "Number Theory",
  "Counting & Probability",
  "Logic",
  "Other",
];

export function getDifficultyLabel(level: DifficultyLevel): string {
  const labels: Record<DifficultyLevel, string> = {
    1: "Level 1 · Warmup",
    2: "Level 2 · Core skill",
    3: "Level 3 · AMC-style",
    4: "Level 4 · Challenge",
    5: "Level 5 · Final stretch",
  };
  return labels[level];
}

export function getDifficultyDescription(level: DifficultyLevel): string {
  const descriptions: Record<DifficultyLevel, string> = {
    1: "Direct application of one idea.",
    2: "Requires one clean setup step.",
    3: "Typical middle AMC 8 problem.",
    4: "Requires combining multiple ideas.",
    5: "Hard problem requiring a clever insight.",
  };
  return descriptions[level];
}

export function getProblemSourceLabel(problem: Problem): string {
  if (problem.sourceType === "AMC") {
    const contest = problem.contest ?? "AMC";
    const year = problem.year ? `${problem.year}` : "Year unknown";
    const number = problem.problemNumber
      ? `Problem ${problem.problemNumber}`
      : "Problem number unknown";
    return `${contest} ${year}, ${number}`;
  }

  return "Original practice problem";
}

export function getProblemStatus(
  problem: Problem,
  progress: ProblemProgress
): ProblemStatus {
  if (progress.bookmarkedIds.includes(problem.id)) return "bookmarked";
  if (progress.missedIds.includes(problem.id)) return "missed";
  if (progress.solvedIds.includes(problem.id)) return "solved";
  return "unsolved";
}

export function getAvailableYears(problems: Problem[]): number[] {
  return Array.from(
    new Set(
      problems
        .map((problem) => problem.year)
        .filter((year): year is number => typeof year === "number")
    )
  ).sort((a, b) => a - b);
}

export function filterProblems(
  problems: Problem[],
  filters: ProblemFilters,
  progress: ProblemProgress
): Problem[] {
  const query = filters.search.trim().toLowerCase();

  return problems.filter((problem) => {
    const status = getProblemStatus(problem, progress);

    const matchesSearch =
      query.length === 0 ||
      [
        problem.title,
        problem.statement,
        problem.category,
        problem.subcategory ?? "",
        problem.year?.toString() ?? "",
        problem.problemNumber?.toString() ?? "",
        problem.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

    const matchesCategory =
      filters.category === "All" || problem.category === filters.category;

    const matchesDifficulty =
      filters.difficulty === "All" || problem.difficulty === filters.difficulty;

    const matchesSource =
      filters.sourceType === "All" || problem.sourceType === filters.sourceType;

    const matchesStatus = filters.status === "All" || filters.status === status;

    const matchesYear = filters.year === "All" || problem.year === filters.year;

    const hasAnimation =
      Boolean(problem.animation) ||
      (problem.animationFrames && problem.animationFrames.length > 0);

    const matchesAnimation =
      filters.animation === "All" ||
      (filters.animation === "Animated" && hasAnimation) ||
      (filters.animation === "Needs animation" && !hasAnimation);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesDifficulty &&
      matchesSource &&
      matchesStatus &&
      matchesYear &&
      matchesAnimation
    );
  });
}

export function getNextProblem(
  problems: Problem[],
  currentProblemId: string
): Problem | undefined {
  const index = problems.findIndex((problem) => problem.id === currentProblemId);
  if (index < 0) return problems[0];
  return problems[(index + 1) % problems.length];
}

export function summarizeByCategory(problems: Problem[]) {
  const order: ProblemCategory[] = [
    "Algebra",
    "Geometry",
    "Number Theory",
    "Counting & Probability",
    "Logic",
    "Other",
  ];

  return order.map((category) => ({
    category,
    count: problems.filter((problem) => problem.category === category).length,
  }));
}

export function summarizeByYear(problems: Problem[]) {
  return getAvailableYears(problems).map((year) => ({
    year,
    count: problems.filter((problem) => problem.year === year).length,
  }));
}
