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
  | "counting"
  | "grouped-sum"
  | "number-grid"
  | "budget-check"
  | "percent-bar"
  | "timeline"
  | "border-area"
  | "battery"
  | "fraction-reduce"
  | "radical-fraction"
  | "fibonacci-spiral"
  | "circle-sum-graph"
  | "lattice-square"
  | "gray-cube"
  | "fraction-count"
  | "ranking"
  | "adjacency-rearrange"
  | "consecutive-sum"
  | "round-trip-chase"
  | "coin-stack"
  | "markov-walk"
  | "median-of-medians"
  | "elastic-band"
  | "staircase-sum"
  | "corner-cut-hexagon"
  | "shaded-grid"
  | "additive-numeral"
  | "share-out"
  | "arithmetic-hop"
  | "grid-route"
  | "remainder-blocks"
  | "cumulative-bands"
  | "clock-pairs"
  | "rotated-overlap"
  | "tetromino-tiling"
  | "inscribed-circle"
  | "remainder-histogram"
  | "mean-median"
  | "fold-pairs"
  | "paired-choice"
  | "flow-graph"
  | "circle-square-shade"
  | "speed-zone-meet"
  | "halving-share"
  | "graph-label"
  | "equal-spacing"
  | "candidate-sieve"
  | "trapezoid-family"
  | "path-area-pairing"
  | "cube-net"
  | "solid-3d"
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
