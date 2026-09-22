import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";
import { curriculumMeta, curriculumNodes } from "../data/curriculum";

function lessonTypeLabel(type: "foundation" | "technique" | "connector") {
  if (type === "foundation") return "Foundation";
  if (type === "technique") return "Technique";
  return "Connector";
}

export function LearnPage() {

  return (
    <>
      <SiteHeader currentPage="learn" />
      <main className="fmj-page">
        <section className="fmj-page-heading">
          <p className="fmj-eyebrow">Learn</p>
          <h1>Explore all {curriculumNodes.length} lessons.</h1>
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
                  <div
                    key={lesson.id}
                    className="fmj-learn-card fmj-learn-card-link"
                  >
                    <a href={`/learn/${lesson.id}`}><strong>
                      {lesson.id} · {lesson.title}
                    </strong></a>
                    <p>{lesson.coreInsight}</p>
                    <span>
                      {lessonTypeLabel(lesson.lessonType)}
                      {lesson.hardPrerequisites.length > 0 ? <> · Prerequisites: {lesson.hardPrerequisites.map((id,i) => <span key={id}>{i > 0 ? ", " : ""}<a href={`/learn/${id}`}>{id}</a></span>)}</> : " · No prerequisites"}
                    </span>
                  </div>
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
