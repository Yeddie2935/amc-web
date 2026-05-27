import { sampleProblems } from "../data/sampleProblems";
import type { DifficultyLevel } from "../types/amc";
import { filterProblemsBySkill } from "../lib/problemFilters";
import { SKILL_LANES } from "../lib/skills";
import { getDifficultyDescription } from "../lib/problemUtils";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";
import { usePageMeta } from "../hooks/usePageMeta";

const DIFFICULTY_LEVELS: DifficultyLevel[] = [1, 2, 3, 4, 5];

export function LearnPage() {
  usePageMeta(
    "Learn AMC 8 Math — Fun Math Journey",
    "Explore AMC 8 topics by skill and difficulty. Guided lessons in algebra, geometry, number theory, counting and probability, and more."
  );
  return (
    <>
      <SiteHeader currentPage="learn" />
      <main className="fmj-page">
        <section className="fmj-page-heading">
          <p className="fmj-eyebrow">Learn</p>
          <h1>Choose a skill lane.</h1>
          <p>
            Each lane should eventually contain concept notes, warmups, AMC
            examples, challenge problems, and animations. Pick a difficulty level
            to jump straight to focused practice.
          </p>
        </section>

        <section className="fmj-learn-grid">
          {SKILL_LANES.map((lane) => {
            const laneProblems = filterProblemsBySkill(sampleProblems, lane.id);
            return (
              <div key={lane.id} className="fmj-learn-card">
                <a className="fmj-learn-card-link" href={`/practice?skill=${lane.id}`}>
                  <strong>{lane.title}</strong>
                  <span>{laneProblems.length} loaded problems</span>
                </a>
                <p>{lane.description}</p>
                <div className="fmj-difficulty-row">
                  {DIFFICULTY_LEVELS.map((level) => {
                    const count = laneProblems.filter(
                      (problem) => problem.difficulty === level
                    ).length;
                    return (
                      <a
                        key={level}
                        href={`/practice?skill=${lane.id}&difficulty=${level}`}
                        className={`fmj-difficulty-pill level-${level} ${
                          count === 0 ? "empty" : ""
                        }`}
                        title={getDifficultyDescription(level)}
                      >
                        <span>Level {level}</span>
                        <small>{count}</small>
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
