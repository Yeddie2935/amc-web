import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";
import { AttributionNotice } from "../components/attribution/AttributionNotice";
import { curriculumMeta, curriculumNodes } from "../data/curriculum";
import { sampleProblems } from "../data/sampleProblems";
import { usePageMeta } from "../hooks/usePageMeta";
import "../styles/homePage.css";

const STRAND_SUMMARIES: Record<string, string> = {
  foundations: "Fractions, rates, percent change, averages, graphs, and the number sense everything else leans on.",
  algebra: "Variables, equations, systems, functions, lines, sequences, exponents, and roots.",
  numberTheory: "Divisibility, primes, factors, remainders, cycles, digits, and bases.",
  countingProbability: "Systematic counting, casework, combinations, paths, sets, and probability.",
  geometry: "Angles, triangles, area, similarity, circles, transformations, solids, and nets.",
  problemSolving: "Work backwards, eliminate possibilities, track invariants, and force guaranteed outcomes.",
};

const STARTING_POINTS = [
  {
    href: "/learn/F1",
    quote: "I keep losing points on questions that should be easy.",
    label: "Build number sense first",
  },
  {
    href: "/learn/C4",
    quote: "I can follow a counting solution, but I never know how to organize it myself.",
    label: "Learn casework",
  },
  {
    href: "/learn/G4",
    quote: "Geometry diagrams look messy and I don't know what to do first.",
    label: "Learn to decompose area",
  },
];

export function HomePage() {
  usePageMeta(
    "Mathinking — Learn Competition Math by Thinking",
    "Free AMC 8 lessons that teach the reasoning behind competition math with guided discovery, visuals, animations, and targeted practice."
  );

  return (
    <>
      <SiteHeader currentPage="home" />

      <main className="fmj-page fmj-home-page">
        <section className="fmj-home-hero">
          <div className="fmj-home-hero-copy">
            <p className="fmj-home-kicker">Free AMC 8 learning, built around thinking</p>
            <h1>Don't memorize the trick. See why it works.</h1>
            <p className="fmj-home-lede">
              Mathinking teaches competition math the way a good tutor would: try
              something, notice the structure, make the reason visible, and then
              use the idea on a real problem.
            </p>

            <div className="fmj-home-actions">
              <a className="fmj-home-action fmj-home-action-primary" href="/learn">
                Explore the 50 lessons
              </a>
              <a className="fmj-home-action fmj-home-action-secondary" href="/practice">
                Practice a problem
              </a>
            </div>

            <div className="fmj-home-stats" aria-label="Mathinking at a glance">
              <div>
                <strong>{curriculumNodes.length}</strong>
                <span>guided lessons</span>
              </div>
              <div>
                <strong>{curriculumMeta.strandOrder.length}</strong>
                <span>curriculum strands</span>
              </div>
              <div>
                <strong>{sampleProblems.length}</strong>
                <span>AMC 8 problems loaded</span>
              </div>
            </div>
          </div>

          <aside className="fmj-home-preview" aria-labelledby="home-preview-title">
            <div className="fmj-home-preview-topline">
              <span>Inside a lesson</span>
              <span>A7 · Patterns & Sequences</span>
            </div>
            <p className="fmj-home-preview-label">Try it</p>
            <h2 id="home-preview-title">What comes next?</h2>
            <div className="fmj-home-sequence" aria-label="Sequence one, two, four, blank">
              <span>1</span>
              <span>2</span>
              <span>4</span>
              <span>?</span>
            </div>

            <div className="fmj-home-rule-pair">
              <div>
                <small>Rule A</small>
                <strong>Double each term → 8</strong>
              </div>
              <div>
                <small>Rule B</small>
                <strong>Add 1, then 2, then 3 → 7</strong>
              </div>
            </div>

            <p className="fmj-home-preview-point">
              Same first three terms. Two valid rules. The real question isn't
              “what number looks right?”—it's “what rule actually defines the sequence?”
            </p>
            <a className="fmj-home-inline-link" href="/learn/A7">
              Open the full lesson →
            </a>
          </aside>
        </section>

        <section className="fmj-home-method" aria-labelledby="home-method-title">
          <div className="fmj-home-section-copy">
            <p className="fmj-home-kicker">How a Mathinking lesson works</p>
            <h2 id="home-method-title">The explanation comes after you have something to notice.</h2>
            <p>
              Instead of opening with a formula, lessons are built around the moment
              where the idea becomes useful.
            </p>
          </div>

          <ol className="fmj-home-method-flow">
            <li><span>01</span><strong>Try</strong><p>Make a prediction or attack a small version first.</p></li>
            <li><span>02</span><strong>Notice</strong><p>Use a visual, animation, or counterexample to expose the structure.</p></li>
            <li><span>03</span><strong>Name</strong><p>Only then compress the pattern into a reusable mathematical idea.</p></li>
            <li><span>04</span><strong>Transfer</strong><p>Recognize the same idea when an AMC problem disguises it.</p></li>
          </ol>
        </section>

        <section className="fmj-home-curriculum" aria-labelledby="home-curriculum-title">
          <div className="fmj-home-section-copy">
            <p className="fmj-home-kicker">The full curriculum is live</p>
            <h2 id="home-curriculum-title">Pick the topic that's actually costing you points.</h2>
            <p>
              All 50 lessons are now on Learn. You can follow the curriculum or jump
              directly to the idea you need.
            </p>
          </div>

          <div className="fmj-home-strand-list">
            {curriculumMeta.strandOrder.map((strand, index) => {
              const lessonCount = curriculumNodes.filter((node) => node.strand === strand).length;
              return (
                <a key={strand} href={`/learn#learn-${strand}`} className="fmj-home-strand-row">
                  <span className="fmj-home-strand-number">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{curriculumMeta.strandLabels[strand]}</strong>
                    <p>{STRAND_SUMMARIES[strand]}</p>
                  </div>
                  <span className="fmj-home-strand-count">{lessonCount} lessons →</span>
                </a>
              );
            })}
          </div>
        </section>

        <section className="fmj-home-start" aria-labelledby="home-start-title">
          <div className="fmj-home-section-copy">
            <p className="fmj-home-kicker">Not sure where to start?</p>
            <h2 id="home-start-title">Start from the problem you're actually having.</h2>
          </div>

          <div className="fmj-home-start-list">
            {STARTING_POINTS.map((item) => (
              <a key={item.href} href={item.href}>
                <blockquote>“{item.quote}”</blockquote>
                <span>{item.label} →</span>
              </a>
            ))}
          </div>
        </section>

        <section className="fmj-home-new" aria-labelledby="home-new-title">
          <div>
            <p className="fmj-home-kicker">What's new</p>
            <h2 id="home-new-title">Mathinking is no longer just a problem browser.</h2>
          </div>
          <div className="fmj-home-new-list">
            <p><strong>50 guided lessons.</strong> Foundations through problem-solving strategy are now available from Learn.</p>
            <p><strong>Practice has its own home.</strong> Filter the AMC bank by skill and difficulty without mixing it into the lesson catalog.</p>
            <p><strong>Real problems stay connected.</strong> Lessons use AMC questions, written reasoning, and animated explanations when they genuinely help teach the idea.</p>
          </div>
        </section>

        <AttributionNotice />
      </main>

      <SiteFooter />
    </>
  );
}
