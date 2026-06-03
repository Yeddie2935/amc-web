import type { Problem } from "../../types/amc";

/** A single reasoning beat the animation walks through. */
export interface ExplanationStep {
  title: string;
  body: string;
  equation?: string;
}

const FALLBACK: ExplanationStep[] = [
  { title: "Understand", body: "Identify the key information in the problem." },
  { title: "Solve", body: "Use the main idea to work toward the answer." },
  { title: "Check", body: "Compare the result with the answer choices." },
];

// Pull a clean arithmetic expression (something with an = or ≈) out of prose,
// e.g. "Antonette got 7+16+27=50 correct" -> "7+16+27=50". Returns undefined
// when the body has no explicit computation.
export function extractEquation(body: string): string | undefined {
  const match = body.match(
    /[\d(][\d\s+\-−×x*/^().,]*[=≈][\d\s+\-−×x*/^().,%]*\d%?/
  );
  if (!match) return undefined;
  return match[0].replace(/\s+/g, " ").trim();
}

/**
 * The animation explains the *reasoning*, so it is driven by the problem's
 * written solution steps. Each step's equation comes from the explicit field
 * when present, otherwise it is extracted from the body text. Falls back to
 * narration frames, then to a generic three-beat outline.
 */
export function getExplanationSteps(problem: Problem): ExplanationStep[] {
  if (problem.solutionSteps && problem.solutionSteps.length > 0) {
    return problem.solutionSteps.map((step) => ({
      title: step.title,
      body: step.body,
      equation: step.equation ?? extractEquation(step.body),
    }));
  }
  if (problem.animationFrames && problem.animationFrames.length > 0) {
    return problem.animationFrames.map((frame) => ({
      title: frame.title,
      body: frame.narration,
      equation: extractEquation(frame.narration),
    }));
  }
  return FALLBACK;
}
