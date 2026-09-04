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
import c1GeneratedProblemData from "./generated-problems/C1.json";
import c2GeneratedProblemData from "./generated-problems/C2.json";
import c3GeneratedProblemData from "./generated-problems/C3.json";
import c4GeneratedProblemData from "./generated-problems/C4.json";
import c5GeneratedProblemData from "./generated-problems/C5.json";
import c6GeneratedProblemData from "./generated-problems/C6.json";
import c7GeneratedProblemData from "./generated-problems/C7.json";
import c8GeneratedProblemData from "./generated-problems/C8.json";

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

/**
 * Declarative lesson catalog. Adding another lesson only requires registering
 * its spec and generated artifacts here; rendering remains lesson-agnostic.
 */
const lessonRegistry = new Map<string, LessonBundle>([
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
]);

export function getLessonBundle(lessonId: string): LessonBundle | undefined {
  return lessonRegistry.get(lessonId.trim().toUpperCase());
}
