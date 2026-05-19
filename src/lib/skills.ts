export type SkillId =
  | "algebra"
  | "geometry"
  | "number-theory"
  | "counting-probability"
  | "logic"
  | "other";

export type SkillLane = {
  id: SkillId;
  title: string;
  shortTitle: string;
  description: string;
};

export const SKILL_LANES: SkillLane[] = [
  {
    id: "algebra",
    title: "Algebra",
    shortTitle: "Algebra",
    description: "Variables, equations, expressions, ratios, sequences, operations, and patterns.",
  },
  {
    id: "geometry",
    title: "Geometry",
    shortTitle: "Geometry",
    description: "Angles, area, perimeter, circles, triangles, solids, and coordinate geometry.",
  },
  {
    id: "number-theory",
    title: "Number Theory",
    shortTitle: "Number Theory",
    description: "Divisibility, primes, factors, remainders, units digits, and integer patterns.",
  },
  {
    id: "counting-probability",
    title: "Counting & Probability",
    shortTitle: "Counting",
    description: "Cases, arrangements, combinations, probability, and expected outcomes.",
  },
  {
    id: "logic",
    title: "Logic & Reasoning",
    shortTitle: "Logic",
    description: "Deduction, constraints, elimination, strategy, and non-formula reasoning.",
  },
  {
    id: "other",
    title: "Other / Mixed",
    shortTitle: "Other",
    description: "Estimation, data interpretation, visual reasoning, puzzles, and mixed-skill problems.",
  },
];

export function slugifySkill(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\+/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeSkillId(value: unknown): SkillId | null {
  if (typeof value !== "string") return null;
  const slug = slugifySkill(value);

  if (["algebra", "alg", "pre-algebra", "arithmetic", "operations"].includes(slug)) {
    return "algebra";
  }

  if (["geometry", "geo"].includes(slug)) {
    return "geometry";
  }

  if (["number-theory", "number", "num-theory", "nt", "integers"].includes(slug)) {
    return "number-theory";
  }

  if (
    [
      "counting-probability",
      "counting-and-probability",
      "counting",
      "probability",
      "combinatorics",
      "combinations",
      "permutations",
      "counting-prob",
    ].includes(slug)
  ) {
    return "counting-probability";
  }

  if (
    [
      "logic",
      "logic-reasoning",
      "logical-reasoning",
      "reasoning",
      "deduction",
      "strategy",
      "constraints",
      "constraint-reasoning",
    ].includes(slug)
  ) {
    return "logic";
  }

  if (
    [
      "other",
      "other-mixed",
      "mixed",
      "misc",
      "miscellaneous",
      "estimation",
      "visual-reasoning",
      "data",
      "data-interpretation",
      "puzzle",
      "puzzles",
    ].includes(slug)
  ) {
    return "other";
  }

  return null;
}

export function getSkillLane(value: unknown): SkillLane | null {
  const id = normalizeSkillId(value);
  if (!id) return null;
  return SKILL_LANES.find((lane) => lane.id === id) ?? null;
}
