#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const lessonId = String(process.argv[2] ?? "").trim().toUpperCase();
if (!/^[A-Z][0-9]+$/.test(lessonId)) {
  console.error("Usage: node tools/verify-authored-lesson.mjs <LESSON_ID>");
  process.exit(1);
}

const root = process.cwd();
const trackedChanges = execFileSync(
  "git",
  ["diff", "--name-only", "--no-renames", "--diff-filter=ACM", "-z", "HEAD"],
  { cwd: root, encoding: "utf8" }
);
const untrackedChanges = execFileSync(
  "git",
  ["ls-files", "--others", "--exclude-standard", "-z"],
  { cwd: root, encoding: "utf8" }
);
const changedPaths = `${trackedChanges}${untrackedChanges}`
  .split("\0")
  .filter(Boolean);
const lessonFiles = changedPaths.filter(
  (file) =>
    file.startsWith("src/data/lessons/") &&
    !file.startsWith("src/data/lessons/generated-problems/") &&
    file.endsWith(".json")
);
const authoredLesson = lessonFiles.find((file) => {
  try {
    const lesson = JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
    return lesson.lessonId === lessonId;
  } catch {
    return false;
  }
});

if (!authoredLesson) {
  console.error(
    `BATCH STOPPED: Codex returned without authoring or modifying lesson ${lessonId}.`
  );
  console.error("Lesson-specific QA and commit were not attempted.");
  process.exit(1);
}

console.log(`Verified authored lesson ${lessonId}: ${authoredLesson}`);
