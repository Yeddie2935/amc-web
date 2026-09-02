import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const curriculumDir = path.join(root, "src", "data", "curriculum");
const mappingFiles = [
  "problem-mapping-foundations.json",
  "problem-mapping-algebra.json",
  "problem-mapping-number-theory.json",
  "problem-mapping-counting-probability.json",
  "problem-mapping-geometry.json",
  "problem-mapping-problem-solving.json",
];
const nodeFiles = [
  "foundations.json",
  "algebra.json",
  "number-theory.json",
  "counting-probability.json",
  "geometry.json",
  "problem-solving.json",
];

const mappings = mappingFiles.flatMap((file) =>
  JSON.parse(fs.readFileSync(path.join(curriculumDir, file), "utf8"))
);
const nodes = nodeFiles.flatMap((file) =>
  JSON.parse(fs.readFileSync(path.join(curriculumDir, file), "utf8"))
);
const nodeIds = new Set(nodes.map((node) => node.id));
const sampleProblemsSource = fs.readFileSync(
  path.join(root, "src", "data", "sampleProblems.ts"),
  "utf8"
);
const bankIds = new Set(
  [...sampleProblemsSource.matchAll(/"id"\s*:\s*"(amc8-[^"]+)"/g)].map((match) => match[1])
);

const errors = [];
const warnings = [];
const seenLessons = new Set();

if (mappings.length !== nodes.length) {
  errors.push(`Expected ${nodes.length} mappings, found ${mappings.length}.`);
}

for (const mapping of mappings) {
  if (!nodeIds.has(mapping.lessonId)) {
    errors.push(`Mapping references unknown lesson ${mapping.lessonId}.`);
  }
  if (seenLessons.has(mapping.lessonId)) {
    errors.push(`Duplicate mapping for ${mapping.lessonId}.`);
  }
  seenLessons.add(mapping.lessonId);

  if (!mapping.targetLearnerRealization?.trim()) {
    errors.push(`${mapping.lessonId}: missing targetLearnerRealization.`);
  }
  if (!Array.isArray(mapping.searchCues) || mapping.searchCues.length === 0) {
    errors.push(`${mapping.lessonId}: requires searchCues for broad retrieval.`);
  }

  const candidates = [
    ...(mapping.bestBankCandidate ? [mapping.bestBankCandidate] : []),
    ...(mapping.additionalBankCandidates ?? []),
  ];
  for (const candidate of candidates) {
    if (!candidate.problemId?.startsWith("amc8-")) {
      errors.push(`${mapping.lessonId}: invalid bank problem id ${candidate.problemId}.`);
      continue;
    }
    if (!bankIds.has(candidate.problemId)) {
      // A needs-review secondary candidate may be intentionally provisional, but
      // it can never authorize lesson integration.
      if (mapping.reviewStatus === "needs-review" && candidate !== mapping.bestBankCandidate) {
        warnings.push(`${mapping.lessonId}: provisional candidate ${candidate.problemId} not found in bank.`);
      } else {
        errors.push(`${mapping.lessonId}: bank problem ${candidate.problemId} not found in sampleProblems.ts.`);
      }
    }
  }

  if (mapping.bestBankCandidate?.metrics) {
    for (const [key, value] of Object.entries(mapping.bestBankCandidate.metrics)) {
      if (typeof value !== "number" || value < 0 || value > 1) {
        errors.push(`${mapping.lessonId}: metric ${key} must be between 0 and 1.`);
      }
    }
  }

  if (mapping.preferredSource === "bank") {
    if (!mapping.bestBankCandidate) {
      errors.push(`${mapping.lessonId}: preferredSource=bank requires bestBankCandidate.`);
    }
    if (mapping.reviewStatus !== "approved") {
      warnings.push(`${mapping.lessonId}: bank source is preferred but mapping is not approved.`);
    }
  }

  if (mapping.preferredSource === "generated") {
    if (!mapping.generatedTeachingPlan?.needed) {
      errors.push(`${mapping.lessonId}: preferredSource=generated requires generatedTeachingPlan.needed=true.`);
    }
    if (!mapping.generatedTeachingPlan?.reason?.trim()) {
      errors.push(`${mapping.lessonId}: generated teaching plan requires a reason.`);
    }
  }

  if (mapping.reviewStatus === "approved" && mapping.bestBankCandidate) {
    const integratedRoles = new Set(["anchor", "guided", "contrast"]);
    if (integratedRoles.has(mapping.bestBankCandidate.role)) {
      for (const field of ["whyNow", "entryBridge", "reusedRepresentation", "animationPlan", "exitBridge"]) {
        if (!mapping.bestBankCandidate[field]?.trim()) {
          errors.push(`${mapping.lessonId}: approved integrated problem is missing ${field}.`);
        }
      }
      if (!Array.isArray(mapping.bestBankCandidate.learnerPrompts) || mapping.bestBankCandidate.learnerPrompts.length === 0) {
        errors.push(`${mapping.lessonId}: approved integrated problem needs learnerPrompts.`);
      }
    }
  }
}

for (const nodeId of nodeIds) {
  if (!seenLessons.has(nodeId)) errors.push(`Missing mapping for ${nodeId}.`);
}

if (warnings.length) {
  console.warn("Problem mapping warnings:");
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length) {
  console.error("Problem mapping validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const approved = mappings.filter((mapping) => mapping.reviewStatus === "approved").length;
const bankPreferred = mappings.filter((mapping) => mapping.preferredSource === "bank").length;
const generatedPreferred = mappings.length - bankPreferred;
console.log(
  `Problem mapping valid: ${mappings.length} lessons, ${approved} approved, ${bankPreferred} bank-led, ${generatedPreferred} generated-led.`
);
