import { LessonRenderer } from "../components/lesson/LessonRenderer";
import { SiteFooter } from "../components/layout/SiteFooter";
import { SiteHeader } from "../components/layout/SiteHeader";
import { getLessonBundle } from "../data/lessons";
import { usePageMeta } from "../hooks/usePageMeta";

interface LessonPageProps {
  lessonId: string;
}

export function LessonPage({ lessonId }: LessonPageProps) {
  const bundle = getLessonBundle(lessonId);

  usePageMeta(
    bundle
      ? `${bundle.lesson.title} — Fun Math Journey`
      : "Lesson Not Found — Fun Math Journey",
    bundle
      ? `Work through the interactive ${bundle.lesson.title} lesson.`
      : "The requested interactive lesson could not be found."
  );

  return (
    <>
      <SiteHeader currentPage="learn" />
      <main className="fmj-page">
        {bundle ? (
          <LessonRenderer
            lesson={bundle.lesson}
            generatedProblemArtifacts={bundle.generatedProblemArtifacts}
          />
        ) : (
          <section
            className="fmj-page-heading"
            aria-labelledby="lesson-not-found-title"
          >
            <p className="fmj-eyebrow">Learn</p>
            <h1 id="lesson-not-found-title">Lesson not found.</h1>
            <p>
              No lesson is registered for <strong>{lessonId}</strong>.
            </p>
            <a href="/learn">Return to Learn</a>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

