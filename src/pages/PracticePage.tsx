import { useEffect, useMemo, useState } from "react";
import type { Problem } from "../types/amc";
import { sampleProblems } from "../data/sampleProblems";
import { useLocalProgress } from "../hooks/useLocalProgress";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";
import { PracticeLauncher } from "../components/practice/PracticeLauncher";
import { ProblemWorkspace } from "../components/problem/ProblemWorkspace";
import { buildPracticeSession } from "../lib/buildPracticeSession";
import { usePageMeta } from "../hooks/usePageMeta";

function normalizeSkill(value: string | null) {
  if (!value) return null;

  const loose = value.toLowerCase().trim();
  const normalized = loose.replace(/\s+/g, "-");

  const aliases: Record<string, string> = {
    algebra: "algebra",
    geometry: "geometry",
    "number-theory": "number-theory",
    numbertheory: "number-theory",
    "counting-probability": "counting-probability",
    "counting-&-probability": "counting-probability",
    "counting-and-probability": "counting-probability",
    counting: "counting-probability",
    probability: "counting-probability",
    logic: "logic",
    other: "other",
  };

  if (aliases[normalized]) return aliases[normalized];

  if (loose.includes("algebra")) return "algebra";
  if (loose.includes("geometry")) return "geometry";
  if (loose.includes("number")) return "number-theory";
  if (loose.includes("counting")) return "counting-probability";
  if (loose.includes("probability")) return "counting-probability";
  if (loose.includes("logic")) return "logic";
  if (loose.includes("other")) return "other";

  return normalized;
}

function textToSkill(value: unknown) {
  if (typeof value !== "string") return null;

  const loose = value.toLowerCase().trim();

  if (loose.includes("algebra")) return "algebra";
  if (loose.includes("geometry")) return "geometry";
  if (loose.includes("number")) return "number-theory";
  if (loose.includes("counting")) return "counting-probability";
  if (loose.includes("probability")) return "counting-probability";
  if (loose.includes("logic")) return "logic";
  if (loose.includes("other")) return "other";

  return normalizeSkill(value);
}

function problemMatchesSkill(problem: Problem, selectedSkill: string | null) {
  if (!selectedSkill) return true;

  const rawProblem = problem as Problem & {
    skill?: string;
    skills?: string[];
    category?: string;
    categories?: string[];
    topic?: string;
    topics?: string[];
    tags?: string[];
  };

  const possibleValues = [
    rawProblem.skill,
    rawProblem.category,
    rawProblem.topic,
    ...(rawProblem.skills ?? []),
    ...(rawProblem.categories ?? []),
    ...(rawProblem.topics ?? []),
    ...(rawProblem.tags ?? []),
  ];

  return possibleValues.some((value) => textToSkill(value) === selectedSkill);
}

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
  const selectedSkill = normalizeSkill(
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
    () =>
      sampleProblems.filter((problem) =>
        problemMatchesSkill(problem, selectedSkill)
      ),
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
