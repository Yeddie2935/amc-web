import a1LessonData from "./algebra/A1.json";
import a1GeneratedProblemData from "./generated-problems/A1.json";
import a2LessonData from "./algebra/A2.json";
import a2GeneratedProblemData from "./generated-problems/A2.json";
import a3LessonData from "./algebra/A3.json";
import a3GeneratedProblemData from "./generated-problems/A3.json";
import a4LessonData from "./algebra/A4.json";
import a4GeneratedProblemData from "./generated-problems/A4.json";
import a5LessonData from "./algebra/A5.json";
import a5GeneratedProblemData from "./generated-problems/A5.json";
import a6LessonData from "./algebra/A6.json";
import a6GeneratedProblemData from "./generated-problems/A6.json";
import a7LessonData from "./algebra/A7.json";
import a7GeneratedProblemData from "./generated-problems/A7.json";
import a8LessonData from "./algebra/A8.json";
import a8GeneratedProblemData from "./generated-problems/A8.json";
import f1LessonData from "./foundations/F1.json";
import f1GeneratedProblemData from "./generated-problems/F1.json";
import f2LessonData from "./foundations/F2.json";
import f2GeneratedProblemData from "./generated-problems/F2.json";
import f3LessonData from "./foundations/F3.json";
import f3GeneratedProblemData from "./generated-problems/F3.json";
import f4LessonData from "./foundations/F4.json";
import f4GeneratedProblemData from "./generated-problems/F4.json";
import f5LessonData from "./foundations/F5.json";
import f5GeneratedProblemData from "./generated-problems/F5.json";
import f6LessonData from "./foundations/F6.json";
import f6GeneratedProblemData from "./generated-problems/F6.json";
import f7LessonData from "./foundations/F7.json";
import f7GeneratedProblemData from "./generated-problems/F7.json";
import type {
  GeneratedProblemArtifact,
  LessonSpec,
} from "../../types/lesson";
import c1LessonData from "./counting-probability/C1.json";
import c2LessonData from "./counting-probability/C2.json";
import c3LessonData from "./counting-probability/C3.json";
import c4LessonData from "./counting-probability/C4.json";
import c5LessonData from "./counting-probability/C5.json";
import c6LessonData from "./counting-probability/C6.json";
import c7LessonData from "./counting-probability/C7.json";
import c8LessonData from "./counting-probability/C8.json";
import c9LessonData from "./counting-probability/C9.json";
import c10LessonData from "./counting-probability/C10.json";
import p1LessonData from "./counting-probability/P1.json";
import p2LessonData from "./counting-probability/P2.json";
import p3LessonData from "./counting-probability/P3.json";
import s1LessonData from "./problem-solving/S1.json";
import s2LessonData from "./problem-solving/S2.json";
import s3LessonData from "./problem-solving/S3.json";
import s4LessonData from "./problem-solving/S4.json";
import c1GeneratedProblemData from "./generated-problems/C1.json";
import c2GeneratedProblemData from "./generated-problems/C2.json";
import c3GeneratedProblemData from "./generated-problems/C3.json";
import c4GeneratedProblemData from "./generated-problems/C4.json";
import c5GeneratedProblemData from "./generated-problems/C5.json";
import c6GeneratedProblemData from "./generated-problems/C6.json";
import c7GeneratedProblemData from "./generated-problems/C7.json";
import c8GeneratedProblemData from "./generated-problems/C8.json";
import c9GeneratedProblemData from "./generated-problems/C9.json";
import c10GeneratedProblemData from "./generated-problems/C10.json";
import p1GeneratedProblemData from "./generated-problems/P1.json";
import p2GeneratedProblemData from "./generated-problems/P2.json";
import p3GeneratedProblemData from "./generated-problems/P3.json";
import s1GeneratedProblemData from "./generated-problems/S1.json";
import s2GeneratedProblemData from "./generated-problems/S2.json";
import s3GeneratedProblemData from "./generated-problems/S3.json";
import s4GeneratedProblemData from "./generated-problems/S4.json";

export interface LessonBundle {
  lesson: LessonSpec;
  generatedProblemArtifacts: readonly GeneratedProblemArtifact[];
}

const c1Lesson = c1LessonData as LessonSpec;
const c1GeneratedProblemArtifacts =
  c1GeneratedProblemData as GeneratedProblemArtifact[];
const c2Lesson = c2LessonData as LessonSpec;
const c2GeneratedProblemArtifacts =
  c2GeneratedProblemData as GeneratedProblemArtifact[];
const c3Lesson = c3LessonData as LessonSpec;
const c3GeneratedProblemArtifacts =
  c3GeneratedProblemData as GeneratedProblemArtifact[];
const c4Lesson = c4LessonData as LessonSpec;
const c4GeneratedProblemArtifacts =
  c4GeneratedProblemData as GeneratedProblemArtifact[];
const c5Lesson = c5LessonData as LessonSpec;
const c5GeneratedProblemArtifacts =
  c5GeneratedProblemData as GeneratedProblemArtifact[];
const c6Lesson = c6LessonData as LessonSpec;
const c6GeneratedProblemArtifacts =
  c6GeneratedProblemData as GeneratedProblemArtifact[];
const c7Lesson = c7LessonData as LessonSpec;
const c7GeneratedProblemArtifacts =
  c7GeneratedProblemData as GeneratedProblemArtifact[];
const c8Lesson = c8LessonData as LessonSpec;
const c8GeneratedProblemArtifacts =
  c8GeneratedProblemData as GeneratedProblemArtifact[];
const c9Lesson = c9LessonData as LessonSpec;
const c9GeneratedProblemArtifacts =
  c9GeneratedProblemData as GeneratedProblemArtifact[];
const c10Lesson = c10LessonData as LessonSpec;
const c10GeneratedProblemArtifacts =
  c10GeneratedProblemData as GeneratedProblemArtifact[];
const p1Lesson = p1LessonData as LessonSpec;
const p1GeneratedProblemArtifacts =
  p1GeneratedProblemData as GeneratedProblemArtifact[];
const p2Lesson = p2LessonData as LessonSpec;
const p2GeneratedProblemArtifacts =
  p2GeneratedProblemData as GeneratedProblemArtifact[];
const p3Lesson = p3LessonData as LessonSpec;
const p3GeneratedProblemArtifacts =
  p3GeneratedProblemData as GeneratedProblemArtifact[];
const s1Lesson = s1LessonData as LessonSpec;
const s1GeneratedProblemArtifacts =
  s1GeneratedProblemData as GeneratedProblemArtifact[];
const s2Lesson = s2LessonData as LessonSpec;
const s2GeneratedProblemArtifacts =
  s2GeneratedProblemData as GeneratedProblemArtifact[];
const s3Lesson = s3LessonData as LessonSpec;
const s3GeneratedProblemArtifacts =
  s3GeneratedProblemData as GeneratedProblemArtifact[];
const s4Lesson = s4LessonData as LessonSpec;
const s4GeneratedProblemArtifacts =
  s4GeneratedProblemData as GeneratedProblemArtifact[];
const f1Lesson = f1LessonData as LessonSpec;
const f1GeneratedProblemArtifacts =
  f1GeneratedProblemData as GeneratedProblemArtifact[];
const f2Lesson = f2LessonData as LessonSpec;
const f2GeneratedProblemArtifacts =
  f2GeneratedProblemData as GeneratedProblemArtifact[];
const f3Lesson = f3LessonData as LessonSpec;
const f3GeneratedProblemArtifacts =
  f3GeneratedProblemData as GeneratedProblemArtifact[];
const f4Lesson = f4LessonData as LessonSpec;
const f4GeneratedProblemArtifacts =
  f4GeneratedProblemData as GeneratedProblemArtifact[];
const f5Lesson = f5LessonData as LessonSpec;
const f5GeneratedProblemArtifacts =
  f5GeneratedProblemData as GeneratedProblemArtifact[];
const f6Lesson = f6LessonData as LessonSpec;
const f6GeneratedProblemArtifacts =
  f6GeneratedProblemData as GeneratedProblemArtifact[];
const f7Lesson = f7LessonData as LessonSpec;
const f7GeneratedProblemArtifacts =
  f7GeneratedProblemData as GeneratedProblemArtifact[];

/**
 * Declarative lesson catalog. Adding another lesson only requires registering
 * its spec and generated artifacts here; rendering remains lesson-agnostic.
 */
const lessonRegistry = new Map<string, LessonBundle>([
  [
    f1Lesson.lessonId,
    {
      lesson: f1Lesson,
      generatedProblemArtifacts: f1GeneratedProblemArtifacts,
    },
  ],
  [
    f2Lesson.lessonId,
    {
      lesson: f2Lesson,
      generatedProblemArtifacts: f2GeneratedProblemArtifacts,
    },
  ],
  [
    f3Lesson.lessonId,
    {
      lesson: f3Lesson,
      generatedProblemArtifacts: f3GeneratedProblemArtifacts,
    },
  ],
  [
    f4Lesson.lessonId,
    {
      lesson: f4Lesson,
      generatedProblemArtifacts: f4GeneratedProblemArtifacts,
    },
  ],
  [
    f5Lesson.lessonId,
    {
      lesson: f5Lesson,
      generatedProblemArtifacts: f5GeneratedProblemArtifacts,
    },
  ],
  [
    f6Lesson.lessonId,
    {
      lesson: f6Lesson,
      generatedProblemArtifacts: f6GeneratedProblemArtifacts,
    },
  ],
  [
    f7Lesson.lessonId,
    {
      lesson: f7Lesson,
      generatedProblemArtifacts: f7GeneratedProblemArtifacts,
    },
  ],
  ["A1", { lesson: a1LessonData as LessonSpec, generatedProblemArtifacts: a1GeneratedProblemData as GeneratedProblemArtifact[] }],
  ["A2", { lesson: a2LessonData as LessonSpec, generatedProblemArtifacts: a2GeneratedProblemData as GeneratedProblemArtifact[] }],
  ["A3", { lesson: a3LessonData as LessonSpec, generatedProblemArtifacts: a3GeneratedProblemData as GeneratedProblemArtifact[] }],
  ["A4", { lesson: a4LessonData as LessonSpec, generatedProblemArtifacts: a4GeneratedProblemData as GeneratedProblemArtifact[] }],
  ["A5", { lesson: a5LessonData as LessonSpec, generatedProblemArtifacts: a5GeneratedProblemData as GeneratedProblemArtifact[] }],
  ["A6", { lesson: a6LessonData as LessonSpec, generatedProblemArtifacts: a6GeneratedProblemData as GeneratedProblemArtifact[] }],
  ["A7", { lesson: a7LessonData as LessonSpec, generatedProblemArtifacts: a7GeneratedProblemData as GeneratedProblemArtifact[] }],
  ["A8", { lesson: a8LessonData as LessonSpec, generatedProblemArtifacts: a8GeneratedProblemData as GeneratedProblemArtifact[] }],
  [
    c1Lesson.lessonId,
    {
      lesson: c1Lesson,
      generatedProblemArtifacts: c1GeneratedProblemArtifacts,
    },
  ],
  [
    c2Lesson.lessonId,
    {
      lesson: c2Lesson,
      generatedProblemArtifacts: c2GeneratedProblemArtifacts,
    },
  ],
  [
    c3Lesson.lessonId,
    {
      lesson: c3Lesson,
      generatedProblemArtifacts: c3GeneratedProblemArtifacts,
    },
  ],
  [
    c4Lesson.lessonId,
    {
      lesson: c4Lesson,
      generatedProblemArtifacts: c4GeneratedProblemArtifacts,
    },
  ],
  [
    c5Lesson.lessonId,
    {
      lesson: c5Lesson,
      generatedProblemArtifacts: c5GeneratedProblemArtifacts,
    },
  ],
  [
    c6Lesson.lessonId,
    {
      lesson: c6Lesson,
      generatedProblemArtifacts: c6GeneratedProblemArtifacts,
    },
  ],
  [
    c7Lesson.lessonId,
    {
      lesson: c7Lesson,
      generatedProblemArtifacts: c7GeneratedProblemArtifacts,
    },
  ],
  [
    c8Lesson.lessonId,
    {
      lesson: c8Lesson,
      generatedProblemArtifacts: c8GeneratedProblemArtifacts,
    },
  ],
  [
    c9Lesson.lessonId,
    {
      lesson: c9Lesson,
      generatedProblemArtifacts: c9GeneratedProblemArtifacts,
    },
  ],
  [
    c10Lesson.lessonId,
    {
      lesson: c10Lesson,
      generatedProblemArtifacts: c10GeneratedProblemArtifacts,
    },
  ],
  [
    p1Lesson.lessonId,
    {
      lesson: p1Lesson,
      generatedProblemArtifacts: p1GeneratedProblemArtifacts,
    },
  ],
  [
    p2Lesson.lessonId,
    {
      lesson: p2Lesson,
      generatedProblemArtifacts: p2GeneratedProblemArtifacts,
    },
  ],
  [
    p3Lesson.lessonId,
    {
      lesson: p3Lesson,
      generatedProblemArtifacts: p3GeneratedProblemArtifacts,
    },
  ],
  [
    s1Lesson.lessonId,
    {
      lesson: s1Lesson,
      generatedProblemArtifacts: s1GeneratedProblemArtifacts,
    },
  ],
  [
    s2Lesson.lessonId,
    {
      lesson: s2Lesson,
      generatedProblemArtifacts: s2GeneratedProblemArtifacts,
    },
  ],
  [
    s3Lesson.lessonId,
    {
      lesson: s3Lesson,
      generatedProblemArtifacts: s3GeneratedProblemArtifacts,
    },
  ],
  [
    s4Lesson.lessonId,
    {
      lesson: s4Lesson,
      generatedProblemArtifacts: s4GeneratedProblemArtifacts,
    },
  ],
]);

export function getLessonBundle(lessonId: string): LessonBundle | undefined {
  return lessonRegistry.get(lessonId.trim().toUpperCase());
}
