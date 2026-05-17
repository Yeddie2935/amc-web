import { problems } from "../data/problems.sample.js";

const requiredFields = [
  "id",
  "title",
  "sourceType",
  "sourceLabel",
  "category",
  "subcategory",
  "difficulty",
  "tags",
  "question",
  "choices",
  "answerIndex",
  "explanation"
];

let hasError = false;
const ids = new Set();

for (const problem of problems) {
  for (const field of requiredFields) {
    if (!(field in problem)) {
      console.error(`${problem.id || "UNKNOWN"}: missing ${field}`);
      hasError = true;
    }
  }

  if (ids.has(problem.id)) {
    console.error(`${problem.id}: duplicate id`);
    hasError = true;
  }
  ids.add(problem.id);

  if (!Number.isInteger(problem.difficulty) || problem.difficulty < 1 || problem.difficulty > 5) {
    console.error(`${problem.id}: difficulty must be integer 1-5`);
    hasError = true;
  }

  if (!Array.isArray(problem.choices) || problem.choices.length !== 5) {
    console.error(`${problem.id}: choices must contain exactly five answer choices`);
    hasError = true;
  }

  if (!Number.isInteger(problem.answerIndex) || problem.answerIndex < 0 || problem.answerIndex >= problem.choices.length) {
    console.error(`${problem.id}: answerIndex is invalid`);
    hasError = true;
  }

  if (!problem.explanation?.idea || !Array.isArray(problem.explanation?.steps)) {
    console.error(`${problem.id}: explanation must include idea and steps`);
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
}

console.log(`Validated ${problems.length} problems.`);
