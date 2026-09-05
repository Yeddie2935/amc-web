import type { Problem } from "../types/amc";
import type { CurriculumProblemMapping, ScoredProblemCandidate } from "../types/curriculumProblemMapping";
import { getCurriculumProblemMapping } from "../data/curriculum/problemMappings";

function normalize(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function problemSearchText(problem: Problem): string {
  const solutionText = problem.solutionSteps
    .map((step) => `${step.title} ${step.body} ${step.equation ?? ""}`)
    .join(" ");
  const frameText = (problem.animationFrames ?? [])
    .map((frame) => `${frame.title} ${frame.narration} ${frame.visualHint ?? ""}`)
    .join(" ");
  const animationText = problem.animation
    ? `${problem.animation.type} ${JSON.stringify(problem.animation.data ?? {})}`
    : "";

  return normalize([
    problem.title,
    problem.statement,
    problem.category,
    problem.subcategory ?? "",
    problem.tags.join(" "),
    solutionText,
    frameText,
    animationText,
  ].join(" "));
}

function phraseScore(text: string, phrase: string): number {
  const normalizedPhrase = normalize(phrase);
  if (!normalizedPhrase) return 0;
  if (text.includes(normalizedPhrase)) return 4;

  const tokens = normalizedPhrase.split(" ").filter((token) => token.length > 2);
  if (!tokens.length) return 0;
  const matched = tokens.filter((token) => text.includes(token)).length;
  return (matched / tokens.length) * 1.5;
}

function categoryPrior(lessonId: string, problem: Problem): number {
  const prefix = lessonId[0];
  if (prefix === "N" && problem.category === "Number Theory") return 2;
  if ((prefix === "C" || prefix === "P") && problem.category === "Counting & Probability") return 2;
  if (prefix === "G" && problem.category === "Geometry") return 2;
  if (prefix === "S" && problem.category === "Logic") return 1.75;
  if (prefix === "A" && problem.category === "Algebra") return 1.75;
  if (prefix === "F" && (problem.category === "Algebra" || problem.category === "Other")) return 0.75;
  return 0;
}

function scoreProblem(problem: Problem, mapping: CurriculumProblemMapping): ScoredProblemCandidate {
  const text = problemSearchText(problem);
  const reasons: string[] = [];
  let score = categoryPrior(mapping.lessonId, problem);
  if (score > 0) reasons.push(`category prior +${score.toFixed(2)}`);

  for (const cue of mapping.searchCues) {
    const cueScore = phraseScore(text, cue);
    if (cueScore <= 0) continue;
    score += cueScore;
    if (cueScore >= 1) reasons.push(`matched cue: ${cue}`);
  }

  for (const cue of mapping.avoidCues) {
    const penalty = phraseScore(text, cue);
    if (penalty <= 0) continue;
    score -= penalty * 1.25;
    reasons.push(`avoid cue: ${cue}`);
  }

  if (problem.animation) {
    score += 0.4;
    reasons.push("has animation");
  }

  // Broad retrieval should prefer teachable mid-range examples, while still
  // allowing hard problems to surface for transfer.
  if (problem.difficulty <= 2) score += 0.25;
  if (problem.difficulty === 5) score -= 0.15;

  return { problemId: problem.id, score, reasons };
}

/**
 * Broad-recall candidate retrieval across the full problem bank.
 *
 * IMPORTANT: this function does NOT approve a problem for lesson integration.
 * It only surfaces candidates for deeper review. The lesson generator must use
 * getApprovedIntegratedBankProblem() or an explicitly reviewed mapping before
 * weaving a bank problem into a teaching sequence.
 */
export function findProblemCandidatesForLesson(
  lessonId: string,
  problems: Problem[],
  limit = 12
): ScoredProblemCandidate[] {
  const mapping = getCurriculumProblemMapping(lessonId);
  if (!mapping) return [];

  return problems
    .map((problem) => scoreProblem(problem, mapping))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function findProblemCandidatesForAllLessons(
  lessonIds: string[],
  problems: Problem[],
  limitPerLesson = 12
): Record<string, ScoredProblemCandidate[]> {
  return Object.fromEntries(
    lessonIds.map((lessonId) => [
      lessonId,
      findProblemCandidatesForLesson(lessonId, problems, limitPerLesson),
    ])
  );
}
