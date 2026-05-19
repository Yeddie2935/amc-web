import { Link, useSearchParams } from "react-router-dom";
import { problems } from "../data/problems";
import { getSkillLane, normalizeSkillId, SKILL_LANES } from "../lib/skills";
import { problemMatchesSkill } from "../lib/problemFilters";

export default function PracticePage() {
  const [searchParams] = useSearchParams();
  const selectedSkill = normalizeSkillId(searchParams.get("skill"));
  const selectedLane = getSkillLane(selectedSkill);

  const filteredProblems = problems.filter((problem) =>
    problemMatchesSkill(problem, selectedSkill)
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            Practice
          </p>
          <h1 className="text-3xl font-bold text-slate-950">
            {selectedLane ? `${selectedLane.title} Practice` : "All Practice Questions"}
          </h1>
          <p className="mt-2 text-slate-600">
            {filteredProblems.length} question{filteredProblems.length === 1 ? "" : "s"} available
            {selectedLane ? ` in ${selectedLane.title}.` : "."}
          </p>
        </div>

        <Link
          to="/"
          className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Back to skill lanes
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          to="/practice"
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            !selectedSkill ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
          }`}
        >
          All
        </Link>

        {SKILL_LANES.map((lane) => (
          <Link
            key={lane.id}
            to={`/practice?skill=${lane.id}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              selectedSkill === lane.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {lane.shortTitle}
          </Link>
        ))}
      </div>

      {filteredProblems.length === 0 ? (
        <section className="rounded-2xl border border-dashed bg-slate-50 p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">No questions here yet</h2>
          <p className="mt-2 text-slate-600">
            {selectedLane
              ? `No ${selectedLane.title} questions have been tagged yet.`
              : "No practice questions have been added yet."}
          </p>
          <Link
            to="/practice"
            className="mt-5 inline-block rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            View all questions
          </Link>
        </section>
      ) : (
        <section className="grid gap-4">
          {filteredProblems.map((problem) => (
            <article
              key={problem.id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-900">
                  {problem.year} AMC 8 Problem {problem.number}
                </h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  Difficulty {problem.difficulty ?? "?"}
                </span>
              </div>

              <p className="mt-3 text-slate-700">{problem.prompt}</p>

              <Link
                to={`/problem/${problem.id}`}
                className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline"
              >
                Open problem →
              </Link>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
