import { sampleProblems } from "../data/sampleProblems";
import { summarizeByCategory } from "../lib/problemUtils";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";

export function LearnPage() {
  const categories = summarizeByCategory(sampleProblems);

  return (
    <>
      <SiteHeader currentPage="learn" />
      <main className="fmj-page">
        <section className="fmj-page-heading">
          <p className="fmj-eyebrow">Learn</p>
          <h1>Choose a skill lane.</h1>
          <p>
            Each lane should eventually contain concept notes, warmups, AMC
            examples, challenge problems, and animations.
          </p>
        </section>

        <section className="fmj-learn-grid">
          {categories.map(({ category, count }) => (
            <a
              key={category}
              className="fmj-learn-card"
              href={`/practice?category=${encodeURIComponent(category)}`}
            >
              <strong>{category}</strong>
              <span>{count} loaded problems</span>
              <p>{getLaneDescription(category)}</p>
            </a>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function getLaneDescription(category: string) {
  switch (category) {
    case "Algebra":
      return "Ratios, percents, rates, equations, expressions, and statistics.";
    case "Geometry":
      return "Area, perimeter, angles, coordinate geometry, circles, and solids.";
    case "Number Theory":
      return "Divisibility, primes, factors, remainders, digits, and sequences.";
    case "Counting & Probability":
      return "Counting strategies, probability, cases, arrangements, and sets.";
    case "Logic":
      return "Deduction, rankings, constraints, and pattern reasoning.";
    default:
      return "Mixed AMC 8 skills that do not fit neatly in one lane yet.";
  }
}
