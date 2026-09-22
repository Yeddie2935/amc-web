import { LessonRenderer } from "../lesson/LessonRenderer";
import { LessonBankContext } from "../lesson/LessonBankContext";
import type { Problem } from "../../types/amc";
import type { LessonSpec, GeneratedProblemArtifact } from "../../types/lesson";
export default function LessonFeature({ bundle }: { bundle: { lesson: Pick<LessonSpec, "lessonId" | "title" | "beats">; generatedProblemArtifacts: Pick<GeneratedProblemArtifact, "problem">[]; bankProblems: Problem[] } }) {
  return <LessonBankContext.Provider value={bundle.bankProblems}><LessonRenderer lesson={bundle.lesson} generatedProblemArtifacts={bundle.generatedProblemArtifacts} /></LessonBankContext.Provider>;
}
