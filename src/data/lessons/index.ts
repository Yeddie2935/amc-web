import type {
  GeneratedProblemArtifact,
  LessonSpec,
} from "../../types/lesson";
import c4LessonData from "./counting-probability/C4.json";
import c4GeneratedProblemData from "./generated-problems/C4.json";

export interface LessonBundle {
  lesson: LessonSpec;
  generatedProblemArtifacts: readonly GeneratedProblemArtifact[];
}

const c4Lesson = c4LessonData as LessonSpec;
const c4GeneratedProblemArtifacts =
  c4GeneratedProblemData as GeneratedProblemArtifact[];

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
]);

export function getLessonBundle(lessonId: string): LessonBundle | undefined {
  return lessonRegistry.get(lessonId.trim().toUpperCase());
}

