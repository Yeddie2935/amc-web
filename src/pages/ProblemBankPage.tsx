import { useMemo, useState } from "react";
import type { Problem, ProblemFilters } from "../types/amc";
import { sampleProblems } from "../data/sampleProblems";
import { CATEGORIES, DEFAULT_FILTERS, filterProblems, getNextProblem } from "../lib/problemUtils";
import { useLocalProgress } from "../hooks/useLocalProgress";
import { AttributionNotice } from "../components/attribution/AttributionNotice";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";
import { AdvancedProblemFilters } from "../components/problem/AdvancedProblemFilters";
import { CompactProblemList } from "../components/problem/CompactProblemList";
import { ProblemWorkspace } from "../components/problem/ProblemWorkspace";

export function ProblemBankPage({ embedded = false }: { embedded?: boolean } = {}) {
  const Container = embedded ? "div" : "main";
  const Heading = embedded ? "h2" : "h1";
  const progressApi = useLocalProgress(sampleProblems);
  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get("problem");
  const requestedProblem = sampleProblems.find(p => p.id === requestedId);
  const requestedCategory = CATEGORIES.find(c => c === params.get("category"));
  const requestedDifficulty = [1,2,3,4,5].find(d => String(d) === params.get("difficulty")) as ProblemFilters["difficulty"] | undefined;
  const requestedStatus = (["All", "unsolved", "solved", "missed", "bookmarked"] as const).find(s => s === params.get("status"));
  const requestedYear = sampleProblems.find(p => String(p.year) === params.get("year"))?.year;
  const [filters, setFilters] = useState<ProblemFilters>(() => ({ ...DEFAULT_FILTERS,
    search: params.get("q") ?? "",
    year: requestedYear ?? "All",
    category: requestedCategory ?? "All",
    difficulty: requestedDifficulty ?? "All",
    status: requestedStatus ?? "All",
  }));
  const [selectedProblem, setSelectedProblem] = useState<Problem>(() => requestedProblem ?? filterProblems(sampleProblems, filters, progressApi.progress)[0] ?? sampleProblems[0]);

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
      {!embedded && <SiteHeader currentPage="problems" />}

      <Container className={embedded ? "fmj-interactive-body" : "fmj-page"}>
        <section className="fmj-page-heading fmj-page-heading-compact">
          <p className="fmj-eyebrow">Problem Bank</p>
          <Heading>Search, filter, solve, and review.</Heading>
          <p>
            Search by topic or year, choose a problem, and work through its solution.
          </p>
        </section>

        <AttributionNotice />
        {requestedId && !requestedProblem && <p role="alert">That problem was not found. Choose a problem from the bank below.</p>}
        {([['category', requestedCategory], ['difficulty', requestedDifficulty], ['status', requestedStatus], ['year', requestedYear]] as const).some(([key, value]) => params.has(key) && value === undefined) && <p role="alert">Some search filters were not recognized and have been ignored. Use the filters below to refine your search.</p>}

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
      </Container>

      {!embedded && <SiteFooter />}
    </>
  );
}
