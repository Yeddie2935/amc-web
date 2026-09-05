import fs from "node:fs";
import path from "node:path";

export const problemMappingFiles = [
  "problem-mapping-foundations.json",
  "problem-mapping-algebra.json",
  "problem-mapping-number-theory.json",
  "problem-mapping-counting-probability.json",
  "problem-mapping-geometry.json",
  "problem-mapping-problem-solving.json",
];

export function loadResolvedProblemMappings(curriculumDirectory) {
  const baseMappings = problemMappingFiles.flatMap((file) =>
    JSON.parse(fs.readFileSync(path.join(curriculumDirectory, file), "utf8"))
  );
  const overrides = JSON.parse(
    fs.readFileSync(
      path.join(curriculumDirectory, "problem-mapping-review-overrides.json"),
      "utf8"
    )
  );
  const overridesByLesson = Object.fromEntries(
    overrides.map((override) => [override.lessonId, override])
  );
  const mappings = baseMappings.map((mapping) => ({
    ...mapping,
    ...(overridesByLesson[mapping.lessonId] ?? {}),
  }));

  return { baseMappings, overrides, overridesByLesson, mappings };
}
