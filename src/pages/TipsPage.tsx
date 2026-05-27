import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";
import { Card } from "../components/common/Card";
import { usePageMeta } from "../hooks/usePageMeta";

export function TipsPage() {
  usePageMeta(
    "How to Prepare for AMC 8 — Study Tips & Strategy | Fun Math Journey",
    "Practical AMC 8 preparation tips: which topics to study, how to manage time, common mistakes to avoid, and a week-by-week study plan."
  );

  return (
    <>
      <SiteHeader currentPage="tips" />

      <main className="fmj-page fmj-readable-page">
        <section className="fmj-page-heading">
          <p className="fmj-eyebrow">AMC 8 Preparation Guide</p>
          <h1>How to prepare for the AMC 8.</h1>
          <p>
            The AMC 8 is a 25-question, 40-minute multiple-choice exam for
            students in grade 8 and below. No calculus, no tricks — just clear
            mathematical reasoning across six topic areas. Here is what actually
            moves the needle.
          </p>
        </section>

        <Card>
          <h2>Understand the six topic areas</h2>
          <p>
            Every AMC 8 problem falls into one of six categories. Knowing where
            your gaps are lets you study efficiently instead of reviewing
            everything equally.
          </p>
          <ul>
            <li>
              <strong>Algebra</strong> — linear equations, inequalities,
              sequences, word problems. Usually the largest share of the exam.{" "}
              <a href="/practice?skill=algebra">Practice algebra problems →</a>
            </li>
            <li>
              <strong>Geometry</strong> — area, perimeter, angles, similar
              triangles, circles, coordinate geometry.{" "}
              <a href="/practice?skill=geometry">Practice geometry problems →</a>
            </li>
            <li>
              <strong>Number Theory</strong> — divisibility, prime
              factorization, GCD, LCM, remainders, digits.{" "}
              <a href="/practice?skill=number-theory">
                Practice number theory problems →
              </a>
            </li>
            <li>
              <strong>Counting &amp; Probability</strong> — combinations,
              permutations, basic probability, expected value.{" "}
              <a href="/practice?skill=counting">
                Practice counting problems →
              </a>
            </li>
            <li>
              <strong>Logic</strong> — pattern recognition, logical deduction,
              process of elimination.
            </li>
            <li>
              <strong>Other</strong> — mixed or cross-topic problems that blend
              two or more areas.
            </li>
          </ul>
        </Card>

        <Card>
          <h2>Start with problems, not lessons</h2>
          <p>
            The fastest way to improve on the AMC 8 is to attempt problems
            slightly above your current level, get them wrong, and then read the
            solution carefully. Passive review of formulas rarely transfers to
            competition problems.
          </p>
          <p>
            A good starting routine: spend 5 minutes attempting a problem
            without help, then 10 minutes studying the solution — even if you
            got it right. Competition solutions are usually more elegant than
            your first approach, and that elegance is worth learning.
          </p>
          <p>
            <a href="/learn">Browse problems by topic and difficulty →</a>
          </p>
        </Card>

        <Card>
          <h2>Use difficulty levels strategically</h2>
          <p>
            AMC 8 problems are arranged roughly by difficulty — problems 1–10
            are accessible, 11–20 are medium, and 21–25 are challenging. On
            this site, problems are rated 1–5:
          </p>
          <ul>
            <li>
              <strong>Level 1–2</strong> — build fluency and confidence.
              Master these before moving on.
            </li>
            <li>
              <strong>Level 3</strong> — the heart of the exam. Most students
              should spend the majority of their practice here.
            </li>
            <li>
              <strong>Level 4–5</strong> — target these only after Level 3 is
              comfortable. Rushing into hard problems too early is
              counterproductive.
            </li>
          </ul>
        </Card>

        <Card>
          <h2>Common mistakes to avoid</h2>
          <ul>
            <li>
              <strong>Skipping the re-read.</strong> Many wrong answers come
              from misreading the question. Read once to understand, solve, then
              re-read to check you answered what was actually asked.
            </li>
            <li>
              <strong>Ignoring units and constraints.</strong> "Positive
              integer," "even number," "less than 100" — these words eliminate
              most answer choices before you compute anything.
            </li>
            <li>
              <strong>Over-studying one topic.</strong> A balanced score across
              all six topics outperforms being excellent at two and weak at the
              rest.
            </li>
            <li>
              <strong>Not reviewing solved problems.</strong> Your Dashboard
              shows which problems you have solved and missed. Revisiting missed
              problems is the highest-leverage use of practice time.
            </li>
          </ul>
          <p>
            <a href="/dashboard">Check your progress on the Dashboard →</a>
          </p>
        </Card>

        <Card>
          <h2>A simple 4-week study plan</h2>
          <p>
            If you have about a month before the exam, here is a structure that
            works for most students:
          </p>
          <ul>
            <li>
              <strong>Week 1</strong> — Diagnostic. Do a full past AMC 8 under
              timed conditions. Identify your two weakest topics.
              <a href="/archive"> Browse past exams →</a>
            </li>
            <li>
              <strong>Week 2</strong> — Deep work on your weakest topic. Aim
              for 20 problems at Level 2–3.
            </li>
            <li>
              <strong>Week 3</strong> — Deep work on your second-weakest topic,
              plus mixed review of everything else.
            </li>
            <li>
              <strong>Week 4</strong> — Two timed full tests. Focus on
              execution: pacing, checking, not spending more than 3 minutes on
              any one problem.
            </li>
          </ul>
        </Card>

        <Card>
          <h2>On exam day</h2>
          <ul>
            <li>
              Work through problems 1–15 first. These should take about 20
              minutes.
            </li>
            <li>
              For problems 16–25, skip and come back. Mark any problem where
              you are unsure.
            </li>
            <li>
              There is no penalty for wrong answers — never leave a blank. A
              random guess gives you a 20% chance; an educated elimination
              (ruling out 2 choices) gives you 33%.
            </li>
            <li>
              Save 5 minutes at the end to check your answer sheet.
            </li>
          </ul>
        </Card>
      </main>

      <SiteFooter />
    </>
  );
}
