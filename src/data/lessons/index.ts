import type {
  GeneratedProblemArtifact,
  LessonSpec,
} from "../../types/lesson";
import c4LessonData from "./counting-probability/C4.json";
import c5LessonData from "./counting-probability/C5.json";
import c4GeneratedProblemData from "./generated-problems/C4.json";
import c5GeneratedProblemData from "./generated-problems/C5.json";

export interface LessonBundle {
  lesson: LessonSpec;
  generatedProblemArtifacts: readonly GeneratedProblemArtifact[];
}

const c4Lesson = c4LessonData as LessonSpec;
const c4GeneratedProblemArtifacts =
  c4GeneratedProblemData as GeneratedProblemArtifact[];
const c5Lesson = c5LessonData as LessonSpec;
const c5GeneratedProblemArtifacts =
  c5GeneratedProblemData as GeneratedProblemArtifact[];

/**
 * Declarative lesson catalog. Adding another lesson only requires registering
 * its spec and generated artifacts here; rendering remains lesson-agnostic.
 */
const lessonRegistry = new Map<string, LessonBundle>([
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
]);

export function getLessonBundle(lessonId: string): LessonBundle | undefined {
  return lessonRegistry.get(lessonId.trim().toUpperCase());
}
