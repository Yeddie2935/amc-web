import type { ReactNode } from "react";
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

function LessonPreviewShell({
  className = "",
  lessonLabel,
  labelledBy,
  children,
}: {
  className?: string;
  lessonLabel: string;
  labelledBy: string;
  children: ReactNode;
}) {
  return (
    <aside className={`fmj-home-preview ${className}`.trim()} aria-labelledby={labelledBy}>
      <div className="fmj-home-preview-topline">
        <span>Inside a lesson</span>
        <span>{lessonLabel}</span>
      </div>
      {children}
    </aside>
  );
}

function ComplementaryCountingPreview() {
  return (
    <LessonPreviewShell
      className="fmj-home-preview-c5"
      lessonLabel="C5 · Complementary Counting"
      labelledBy="home-c5-preview-title"
    >
      <p className="fmj-home-preview-label">Try it</p>
      <h2 id="home-c5-preview-title">How many 3-digit numbers contain at least one 0?</h2>

      <div className="fmj-home-complement-panels">
        <div className="fmj-home-math-panel">
          <small>All 3-digit numbers</small>
          <div className="fmj-home-digit-slots" aria-label="9 choices times 10 choices times 10 choices">
            <span>1–9</span><b>×</b><span>0–9</span><b>×</b><span>0–9</span>
          </div>
          <strong>9 × 10 × 10 = <em>900</em></strong>
        </div>

        <div className="fmj-home-math-panel">
          <small>No zeros</small>
          <div className="fmj-home-digit-slots" aria-label="9 choices times 9 choices times 9 choices">
            <span>1–9</span><b>×</b><span>1–9</span><b>×</b><span>1–9</span>
          </div>
          <strong>9 × 9 × 9 = <em>729</em></strong>
        </div>
      </div>

      <div className="fmj-home-big-equation" aria-label="900 minus 729 equals 171">
        <span>900</span><b>−</b><span>729</span><b>=</b><em>171</em>
      </div>

      <p className="fmj-home-preview-point">
        Instead of untangling overlapping zero-cases, count everything, count the clean opposite, and subtract.
      </p>
      <a className="fmj-home-inline-link" href="/learn/C5">
        Open the full lesson →
      </a>
    </LessonPreviewShell>
  );
}

function DivisorCountingPreview() {
  return (
    <LessonPreviewShell
      className="fmj-home-preview-n4"
      lessonLabel="N4 · Factors & Divisor Counting"
      labelledBy="home-n4-preview-title"
    >
      <p className="fmj-home-preview-label">Try it</p>
      <h3 id="home-n4-preview-title">How many divisors does 72 have?</h3>

      <div className="fmj-home-factorization" aria-label="72 equals 2 cubed times 3 squared">
        <span>72</span><b>=</b><em>2<sup>3</sup></em><b>·</b><em>3<sup>2</sup></em>
      </div>

      <div className="fmj-home-exponent-choice">
        <small>Exponent for 2</small>
        <div><span>0</span><span>1</span><span>2</span><span>3</span></div>
      </div>
      <div className="fmj-home-exponent-choice">
        <small>Exponent for 3</small>
        <div><span>0</span><span>1</span><span>2</span></div>
      </div>

      <div className="fmj-home-n4-payoff" aria-label="4 times 3 equals 12">
        <span>4 × 3 =</span><em>12</em>
      </div>

      <p className="fmj-home-preview-point">
        Each divisor chooses one exponent for every prime. You don't memorize the formula—you see where 12 comes from.
      </p>
      <a className="fmj-home-inline-link" href="/learn/N4">
        Open the full lesson →
      </a>
    </LessonPreviewShell>
  );
}

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

          <ComplementaryCountingPreview />
        </section>

        <section className="fmj-home-method" aria-labelledby="home-method-title">
          <div className="fmj-home-section-copy fmj-home-method-copy">
            <p className="fmj-home-kicker">How a Mathinking lesson works</p>
            <h2 id="home-method-title">The explanation comes after you have something to notice.</h2>
            <p>
              Instead of opening with a formula, lessons are built around the moment
              where the idea becomes useful—then they keep going until you can use it yourself.
            </p>
          </div>

          <div className="fmj-home-method-content">
            <ol className="fmj-home-method-flow">
              <li><span>01</span><strong>Try</strong><p>Start with a problem before the idea is named.</p></li>
              <li><span>02</span><strong>Notice</strong><p>Use a visual, animation, or counterexample to expose the structure.</p></li>
              <li><span>03</span><strong>Name</strong><p>Only then compress the pattern into a reusable mathematical idea.</p></li>
              <li><span>04</span><strong>Transfer</strong><p>Recognize the same idea in a new setting, often inside an AMC problem.</p></li>
              <li><span>05</span><strong>Practice</strong><p>Use the idea independently until it starts to stick.</p></li>
            </ol>

            <DivisorCountingPreview />
          </div>
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
