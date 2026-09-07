import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";
import { curriculumMeta, curriculumNodes } from "../data/curriculum";
import { usePageMeta } from "../hooks/usePageMeta";

function lessonTypeLabel(type: "foundation" | "technique" | "connector") {
  if (type === "foundation") return "Foundation";
  if (type === "technique") return "Technique";
  return "Connector";
}

export function LearnPage() {
  usePageMeta(
    "Learn Competition Math — Mathinking",
    "Explore all 50 interactive Mathinking lessons across foundations, algebra, number theory, counting and probability, geometry, and problem-solving strategy."
  );

  return (
    <>
      <SiteHeader currentPage="learn" />
      <main className="fmj-page">
        <section className="fmj-page-heading">
          <p className="fmj-eyebrow">Learn</p>
          <h1>Explore all 50 lessons.</h1>
          <p>
            Work through the full Mathinking curriculum, from core quantitative
            reasoning to contest-math techniques and problem-solving strategy.
            Choose any lesson below to open its interactive investigation.
          </p>
        </section>

        {curriculumMeta.strandOrder.map((strand) => {
          const lessons = curriculumNodes.filter((node) => node.strand === strand);
          const sectionId = `learn-${strand}`;

          return (
            <section key={strand} aria-labelledby={sectionId}>
              <div className="fmj-page-heading">
                <p className="fmj-eyebrow">
                  {lessons.length} lesson{lessons.length === 1 ? "" : "s"}
                </p>
                <h2 id={sectionId}>{curriculumMeta.strandLabels[strand]}</h2>
              </div>

              <div className="fmj-learn-grid">
                {lessons.map((lesson) => (
                  <a
                    key={lesson.id}
                    className="fmj-learn-card fmj-learn-card-link"
                    href={`/learn/${lesson.id}`}
                  >
                    <strong>
                      {lesson.id} · {lesson.title}
                    </strong>
                    <p>{lesson.coreInsight}</p>
                    <span>
                      {lessonTypeLabel(lesson.lessonType)}
                      {lesson.hardPrerequisites.length > 0
                        ? ` · Prerequisites: ${lesson.hardPrerequisites.join(", ")}`
                        : " · No prerequisites"}
                    </span>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </main>
      <SiteFooter />
    </>
  );
}
