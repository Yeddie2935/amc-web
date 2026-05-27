import { useMemo, useState } from "react";
import type { Problem } from "../types/amc";
import { sampleProblems } from "../data/sampleProblems";
import { DEFAULT_FILTERS, filterProblems, getNextProblem } from "../lib/problemUtils";
import { useLocalProgress } from "../hooks/useLocalProgress";
import { AttributionNotice } from "../components/attribution/AttributionNotice";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";
import { AdvancedProblemFilters } from "../components/problem/AdvancedProblemFilters";
import { CompactProblemList } from "../components/problem/CompactProblemList";
import { ProblemWorkspace } from "../components/problem/ProblemWorkspace";
import { usePageMeta } from "../hooks/usePageMeta";

export function ProblemBankPage() {
  usePageMeta(
    "AMC 8 Problem Bank (600+ Problems) — Fun Math Journey",
    "Search and filter 600+ AMC 8 problems by skill, difficulty, and year. Full step-by-step solutions included."
  );
  const progressApi = useLocalProgress(sampleProblems);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedProblem, setSelectedProblem] = useState<Problem>(sampleProblems[0]);

  const filteredProblems = useMemo(
    () => filterProblems(sampleProblems, filters, progressApi.progress),
    [filters, progressApi.progress]
  );

  function handleNextProblem() {
    const nextProblem = getNextProblem(filteredProblems, selectedProblem.id);
    if (nextProblem) {
      setSelectedProblem(nextProblem);
    }
  }

  return (
    <>
      <SiteHeader currentPage="problems" />

      <main className="fmj-page">
        <section className="fmj-page-heading fmj-page-heading-compact">
          <p className="fmj-eyebrow">Problem Bank</p>
          <h1>Search, filter, solve, and review.</h1>
          <p>
            Designed for a large archive: use compact rows, status filters, and
            focused problem workspaces instead of scrolling through hundreds of cards.
          </p>
        </section>

        <AttributionNotice />

        <section className="fmj-problem-bank-shell">
          <aside className="fmj-bank-filters">
            <AdvancedProblemFilters
              problems={sampleProblems}
              filters={filters}
              onChange={setFilters}
            />
          </aside>

          <section className="fmj-bank-list">
            <div className="fmj-result-count">
              Showing {filteredProblems.length} of {sampleProblems.length} problems
            </div>
            <CompactProblemList
              problems={filteredProblems}
              selectedProblemId={selectedProblem.id}
              progress={progressApi.progress}
              onSelectProblem={setSelectedProblem}
            />
          </section>

          <aside className="fmj-bank-workspace">
            <ProblemWorkspace
              problem={selectedProblem}
              progress={progressApi.progress}
              onRecordAttempt={progressApi.recordAttempt}
              onToggleBookmark={progressApi.toggleBookmark}
              onNext={handleNextProblem}
            />
          </aside>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
