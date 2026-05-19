export type ProblemCategory =
  | "Algebra"
  | "Geometry"
  | "Number Theory"
  | "Counting & Probability"
  | "Logic"
  | "Other";

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export type ProblemSourceType = "AMC" | "Original";

export type LicenseCode = "CC BY-NC-SA" | "Original";

export type ProblemStatus = "unsolved" | "solved" | "missed" | "bookmarked";

export type AnimationTemplateType =
  | "equation"
  | "clock-angle"
  | "number-line"
  | "area-model"
  | "bar-model"
  | "venn"
  | "graph-read"
  | "probability"
  | "ranking"
  | "cube-net"
  | "generic";

export interface AnswerChoice {
  label: "A" | "B" | "C" | "D" | "E";
  text: string;
}

export interface SolutionStep {
  title: string;
  body: string;
  equation?: string;
}

export interface AnimationFrame {
  title: string;
  narration: string;
  visualHint: string;
}

export interface AnimationTemplate {
  type: AnimationTemplateType;
  data?: Record<string, string | number | boolean | Array<string | number>>;
}

export interface Problem {
  id: string;
  title: string;
  sourceType: ProblemSourceType;
  contest?: "AMC 8" | "AMC 10" | "AMC 12" | "AIME" | "Original";
  year?: number;
  problemNumber?: number;
  category: ProblemCategory;
  subcategory?: string;
  difficulty: DifficultyLevel;
  statement: string;
  choices?: AnswerChoice[];
  answer: string;
  shortAnswer?: string;
  hints?: string[];
  solutionSteps: SolutionStep[];
  animationFrames?: AnimationFrame[];
  animation?: AnimationTemplate;
  tags: string[];
  sourceName: string;
  sourceUrl?: string;
  license: LicenseCode;

  imageUrls?: string[];
  needsDiagram?: boolean;
  aopsUrl?: string;
  answerKeyUrl?: string;
}

export interface ProblemFilters {
  search: string;
  category: "All" | ProblemCategory;
  difficulty: "All" | DifficultyLevel;
  sourceType: "All" | ProblemSourceType;
  status: "All" | ProblemStatus;
  year: "All" | number;
  animation: "All" | "Animated" | "Needs animation";
}
