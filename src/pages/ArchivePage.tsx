import { useState } from "react";
import { sampleProblems } from "../data/sampleProblems";
import { getAvailableYears } from "../lib/problemUtils";
import { useLocalProgress } from "../hooks/useLocalProgress";
import type { Problem } from "../types/amc";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";
import { CompactProblemList } from "../components/problem/CompactProblemList";
import { ProblemWorkspace } from "../components/problem/ProblemWorkspace";
import { usePageMeta } from "../hooks/usePageMeta";

export function ArchivePage() {
  usePageMeta(
    "AMC 8 Archive — Fun Math Journey",
    "Browse all AMC 8 competition problems by year. Step-by-step explanations for every problem."
  );
  const progressApi = useLocalProgress(sampleProblems);
  const years = [...getAvailableYears(sampleProblems)].reverse();
  const [selectedYear, setSelectedYear] = useState(years[0] ?? 1999);

  const yearProblems = sampleProblems.filter(
    (problem) => problem.year === selectedYear
  );
  const [selectedProblem, setSelectedProblem] = useState<Problem>(
    yearProblems[0] ?? sampleProblems[0]
  );

  function chooseYear(year: number) {
    const nextProblems = sampleProblems.filter((problem) => problem.year === year);
    setSelectedYear(year);
    setSelectedProblem(nextProblems[0] ?? sampleProblems[0]);
  }

  return (
    <>
      <SiteHeader currentPage="archive" />
      <main className="fmj-page">
        <section className="fmj-page-heading">
          <p className="fmj-eyebrow">AMC Archive</p>
          <h1>Browse by contest year.</h1>
          <p>
            This mode keeps the original AMC structure: year first, then problems
            1 through 25.
          </p>
        </section>

        <section className="fmj-archive-layout">
          <aside className="fmj-year-rail">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                className={year === selectedYear ? "active" : ""}
                onClick={() => chooseYear(year)}
              >
                {year}
                <span>
                  {sampleProblems.filter((problem) => problem.year === year).length}
                </span>
              </button>
            ))}
          </aside>

          <section>
            <CompactProblemList
              problems={yearProblems}
              selectedProblemId={selectedProblem.id}
              progress={progressApi.progress}
              onSelectProblem={setSelectedProblem}
            />
          </section>

          <aside>
            <ProblemWorkspace
              problem={selectedProblem}
              progress={progressApi.progress}
              onRecordAttempt={progressApi.recordAttempt}
              onToggleBookmark={progressApi.toggleBookmark}
            />
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
