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
  | "ones-digit-column"
  | "fraction-decimal-sum"
  | "nested-squares"
  | "perfect-square-remove"
  | "dice-sum-grid"
  | "rink-paths"
  | "tile-minimum"
  | "branch-value-tree"
  | "ratio-unit"
  | "linear-trend"
  | "triangle-base-height"
  | "level-bars"
  | "hop-path"
  | "shortest-route"
  | "repeat-block"
  | "block-cover"
  | "king-placement"
  | "concentric-sector"
  | "two-way-table"
  | "cube-triangle"
  | "ratio-shift"
  | "unroll-tape"
  | "lattice-cross"
  | "mountain-overlap"
  | "seat-pair"
  | "precedence-group"
  | "paper-fold-cut"
  | "thermometer-drop"
  | "halving-gap"
  | "bite-split"
  | "trip-graph"
  | "spinner-square"
  | "split-blank"
  | "gap-placement"
  | "slope-sweep"
  | "overlap-pairs"
  | "units-digit-run"
  | "midpoint-rect"
  | "dot-plot-shift"
  | "magic-grid-slide"
  | "ceiling-squeeze"
  | "chase-schedule"
  | "line-pair-grid"
  | "prism-net"
  | "leaf-hop-return"
  | "recipe-chain"
  | "equalize-share"
  | "area-yield"
  | "hex-rings"
  | "pour-share"
  | "spiral-grid"
  | "sample-ratio"
  | "power-slots"
  | "line-box-hit"
  | "tournament-grid"
  | "band-time"
  | "pie-bites"
  | "magnitude-estimate"
  | "circle-ledger"
  | "two-scale-route"
  | "overshoot-remove"
  | "detour-pace"
  | "diagonal-letters"
  | "net-fold-ring"
  | "two-step-reach"
  | "triangle-ring-split"
  | "stat-insert"
  | "magic-square-lines"
  | "product-chain"
  | "tile-pattern-prob"
  | "triangle-area-split"
  | "interval-squeeze"
  | "grid-polygon-area"
  | "operation-machine"
  | "factor-triple"
  | "reflect-compose"
  | "age-bars"
  | "spaced-ratio"
  | "unit-chain"
  | "telescope-product"
  | "seat-deduce"
  | "increasing-digits"
  | "swap-value"
  | "iced-cube"
  | "glue-block"
  | "avg-speed-graph"
  | "factorial-regroup"
  | "mixture-topup"
  | "average-level"
  | "percent-slice"
  | "line-incidence"
  | "divisor-lattice"
  | "checker-paths"
  | "semicircle-rect"
  | "pattern-digits"
  | "halve-double-chain"
  | "reverse-machine"
  | "surjection-cases"
  | "tile-border-ratio"
  | "squared-rectangle"
  | "greedy-buy"
  | "identical-tiles"
  | "shared-remainder"
  | "rhombus-diagonal"
  | "graph-match-story"
  | "symmetry-line-grid"
  | "cap-fill"
  | "remaining-grid"
  | "cylinder-pair"
  | "stat-correction"
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
