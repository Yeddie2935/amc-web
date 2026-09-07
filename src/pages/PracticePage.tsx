import { useEffect, useMemo, useState } from "react";
import type { DifficultyLevel, Problem } from "../types/amc";
import { sampleProblems } from "../data/sampleProblems";
import { useLocalProgress } from "../hooks/useLocalProgress";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";
import { PracticeLauncher } from "../components/practice/PracticeLauncher";
import { ProblemWorkspace } from "../components/problem/ProblemWorkspace";
import { buildPracticeSession } from "../lib/buildPracticeSession";
import { filterProblemsBySkill } from "../lib/problemFilters";
import { normalizeSkillId, SKILL_LANES } from "../lib/skills";
import { getDifficultyDescription } from "../lib/problemUtils";
import { usePageMeta } from "../hooks/usePageMeta";

const DIFFICULTY_LEVELS: DifficultyLevel[] = [1, 2, 3, 4, 5];

function getSkillTitle(skill: string | null) {
  if (!skill) return "Start a focused session.";

  const titles: Record<string, string> = {
    algebra: "Algebra Practice",
    geometry: "Geometry Practice",
    "number-theory": "Number Theory Practice",
    "counting-probability": "Counting & Probability Practice",
    logic: "Logic Practice",
    other: "Other Practice",
  };

  return titles[skill] ?? "Skill Practice";
}

export function PracticePage() {
  usePageMeta(
    "Practice AMC 8 Problems — Fun Math Journey",
    "Practice AMC 8 math problems one at a time with progress tracking. Filter by skill and difficulty across algebra, geometry, number theory, and more."
  );
  const urlParams = new URLSearchParams(window.location.search);

  // Supports both URL styles:
  // /practice?skill=algebra
  // /practice?category=Algebra
  const selectedSkill = normalizeSkillId(
    urlParams.get("skill") ?? urlParams.get("category")
  );

  const selectedDifficulty = (() => {
    const difficultyValue = Number(urlParams.get("difficulty"));
    return [1, 2, 3, 4, 5].includes(difficultyValue)
      ? difficultyValue
      : null;
  })();

  const progressApi = useLocalProgress(sampleProblems);
  const [sessionProblems, setSessionProblems] = useState<Problem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const skillProblems = useMemo(
    () => filterProblemsBySkill(sampleProblems, selectedSkill),
    [selectedSkill]
  );

  const filteredProblems = useMemo(
    () =>
      skillProblems.filter(
        (problem) =>
          selectedDifficulty === null || problem.difficulty === selectedDifficulty
      ),
    [skillProblems, selectedDifficulty]
  );

  const currentProblem = sessionProblems[currentIndex];

  const recommendedMissed = useMemo(
    () =>
      skillProblems.filter((problem) =>
        progressApi.progress.missedIds.includes(problem.id)
      ),
    [skillProblems, progressApi.progress]
  );

  useEffect(() => {
    if (!selectedSkill && selectedDifficulty === null) return;

    setSessionProblems(
      buildPracticeSession(sampleProblems, selectedSkill, selectedDifficulty)
    );
    setCurrentIndex(0);
  }, [selectedSkill, selectedDifficulty]);

  function startSession(type: "mixed" | "unsolved" | "missed" | "challenge") {
    let pool = skillProblems;

    if (type === "unsolved") {
      pool = skillProblems.filter(
        (problem) => !progressApi.progress.solvedIds.includes(problem.id)
      );
    }

    if (type === "missed") {
      pool = recommendedMissed.length > 0 ? recommendedMissed : skillProblems;
    }

    if (type === "challenge") {
      pool = skillProblems.filter((problem) => problem.difficulty >= 4);
    }

    setSessionProblems(buildPracticeSession(pool, null, null));
    setCurrentIndex(0);
  }

  function nextProblem() {
    setCurrentIndex((index) => {
      if (index + 1 >= sessionProblems.length) return index;
      return index + 1;
    });
  }

  const practiceTitle = selectedDifficulty
    ? selectedSkill
      ? `Level ${selectedDifficulty} ${getSkillTitle(selectedSkill)}`
      : `Level ${selectedDifficulty} Practice`
    : getSkillTitle(selectedSkill);

  const practiceDescription = selectedSkill || selectedDifficulty
    ? `${filteredProblems.length} problem${
        filteredProblems.length === 1 ? "" : "s"
      } available${selectedSkill ? " in this skill lane" : ""}${
        selectedDifficulty ? ` at Level ${selectedDifficulty}` : ""
      }.`
    : "Practice mode should feel different from archive browsing: fewer distractions, one clean problem at a time, and progress tracking.";

  return (
    <>
      <SiteHeader currentPage="practice" />
      <main className="fmj-page">
        <section className="fmj-page-heading">
          <p className="fmj-eyebrow">Practice</p>
          <h1>{practiceTitle}</h1>
          <p>{practiceDescription}</p>
        </section>

        <section aria-labelledby="practice-skill-lanes">
          <div className="fmj-page-heading">
            <p className="fmj-eyebrow">Browse practice</p>
            <h2 id="practice-skill-lanes">Choose a skill lane.</h2>
            <p>
              Each lane contains AMC examples, challenge problems, and animations.
              Pick a difficulty level to jump straight to focused practice.
            </p>
          </div>

          <div className="fmj-learn-grid">
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
          </div>
        </section>

        {(selectedSkill || selectedDifficulty !== null) &&
          filteredProblems.length === 0 && (
            <section className="fmj-card">
              <h2>No problems found for this selection.</h2>
              <p>
                {selectedSkill && selectedDifficulty !== null
                  ? `No Level ${selectedDifficulty} problems were found for this skill lane yet.`
                  : selectedSkill
                  ? "This route is working, but no loaded problems are tagged with this skill yet."
                  : `No Level ${selectedDifficulty} problems were found in the current question bank.`}
              </p>
            </section>
          )}

        {!currentProblem && filteredProblems.length > 0 && (
          <PracticeLauncher
            totalProblems={filteredProblems.length}
            missedCount={recommendedMissed.length}
            onStart={startSession}
          />
        )}

        {currentProblem && (
          <>
            <p className="fmj-session-status">
              Problem {currentIndex + 1} of {sessionProblems.length}
            </p>
            <ProblemWorkspace
              problem={currentProblem}
              progress={progressApi.progress}
              onRecordAttempt={progressApi.recordAttempt}
              onToggleBookmark={progressApi.toggleBookmark}
              onNext={nextProblem}
            />
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
