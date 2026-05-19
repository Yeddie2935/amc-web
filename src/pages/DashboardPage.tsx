import { sampleProblems } from "../data/sampleProblems";
import { summarizeByCategory } from "../lib/problemUtils";
import { useLocalProgress } from "../hooks/useLocalProgress";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";

export function DashboardPage() {
  const { progress, stats, resetProgress } = useLocalProgress(sampleProblems);
  const byCategory = summarizeByCategory(sampleProblems);

  return (
    <>
      <SiteHeader currentPage="dashboard" />
      <main className="fmj-page">
        <section className="fmj-page-heading">
          <p className="fmj-eyebrow">Dashboard</p>
          <h1>Your progress.</h1>
          <p>
            This is local-only for now, which is perfect for anonymous-first launch.
          </p>
        </section>

        <section className="fmj-dashboard-stats">
          <article>
            <strong>{stats.percentSolved}%</strong>
            <span>Solved</span>
          </article>
          <article>
            <strong>{stats.solved}</strong>
            <span>Correctly solved</span>
          </article>
          <article>
            <strong>{stats.missed}</strong>
            <span>Missed</span>
          </article>
          <article>
            <strong>{stats.bookmarked}</strong>
            <span>Bookmarked</span>
          </article>
          <article>
            <strong>{stats.accuracy}%</strong>
            <span>Attempt accuracy</span>
          </article>
        </section>

        <section className="fmj-dashboard-grid">
          <article className="fmj-dashboard-card">
            <h2>Loaded content</h2>
            {byCategory.map(({ category, count }) => (
              <div key={category} className="fmj-topic-row">
                <span>{category}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </article>

          <article className="fmj-dashboard-card">
            <h2>Recent attempts</h2>
            {progress.attempts.slice(0, 8).length === 0 && (
              <p>No attempts yet. Start a practice session to populate this.</p>
            )}
            {progress.attempts.slice(0, 8).map((attempt) => (
              <div key={`${attempt.problemId}-${attempt.attemptedAt}`} className="fmj-attempt-row">
                <span>{attempt.problemId}</span>
                <strong>{attempt.isCorrect ? "Correct" : "Missed"}</strong>
              </div>
            ))}
          </article>
        </section>

        <button type="button" className="fmj-reset-progress" onClick={resetProgress}>
          Reset local progress
        </button>
      </main>
      <SiteFooter />
    </>
  );
}
