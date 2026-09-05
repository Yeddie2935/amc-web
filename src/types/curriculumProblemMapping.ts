import type { ProblemRole } from "./curriculum";

export type TeachingProblemSource = "bank" | "generated";

export interface ProblemFitMetrics {
  conceptFit: number;
  conceptPurity: number;
  animationFit: number;
  discoveryValue: number;
  transferValue: number;
  prerequisiteLoad: number;
}

export interface DeepMappedBankProblem {
  problemId: string;
  role: ProblemRole;
  metrics: ProblemFitMetrics;
  whyNow: string;
  entryBridge: string;
  reusedRepresentation: string;
  animationPlan: string;
  learnerPrompts: string[];
  exitBridge: string;
}

export interface AdditionalBankCandidate {
  problemId: string;
  recommendedRole: ProblemRole;
  fitScore: number;
  reason: string;
}

export interface GeneratedTeachingPlan {
  needed: boolean;
  reason: string;
  targetLearnerRealization: string;
  suggestedShape: string;
  constraints: string[];
}

export interface CurriculumProblemMapping {
  lessonId: string;
  preferredSource: TeachingProblemSource;
  targetLearnerRealization: string;
  bestBankCandidate: DeepMappedBankProblem | null;
  additionalBankCandidates: AdditionalBankCandidate[];
  generatedTeachingPlan: GeneratedTeachingPlan;
  searchCues: string[];
  avoidCues: string[];
  reviewStatus: "approved" | "needs-review";
}

export interface ScoredProblemCandidate {
  problemId: string;
  score: number;
  reasons: string[];
}
