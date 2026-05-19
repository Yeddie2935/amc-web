import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";
import { AttributionNotice } from "../components/attribution/AttributionNotice";
import { Button } from "../components/common/Button";

export function HomePage() {
  return (
    <>
      <SiteHeader currentPage="home" />

      <main className="fmj-page">
        <section className="fmj-hero">
          <div>
            <p className="fmj-eyebrow">Competition math learning platform</p>
            <h1>Learn AMC 8 concepts by topic, difficulty, and guided explanations.</h1>
            <p>
              Browse algebra, geometry, number theory, and counting/probability
              problems. Track solved questions locally, review solution steps,
              and play interactive animated explanations.
            </p>
            <div className="fmj-hero-actions">
              <a href="/learn">
                <Button>Start learning</Button>
              </a>
              <a href="/practice">
                <Button variant="secondary">Practice now</Button>
              </a>
            </div>
          </div>

          <div className="fmj-hero-card">
            <h2>Built for 600+ problems</h2>
            <ul>
              <li>Learn by topic</li>
              <li>Practice by weakness</li>
              <li>Browse by AMC year</li>
              <li>Track progress locally</li>
              <li>Use reusable animation templates</li>
            </ul>
          </div>
        </section>

        <section className="fmj-mode-grid">
          <a href="/learn" className="fmj-mode-card">
            <strong>Learn</strong>
            <span>Concept notes and guided lanes by topic.</span>
          </a>
          <a href="/practice" className="fmj-mode-card">
            <strong>Practice</strong>
            <span>Start focused practice sets and review missed questions.</span>
          </a>
          <a href="/archive" className="fmj-mode-card">
            <strong>AMC Archive</strong>
            <span>Browse original AMC 8 years and problem numbers.</span>
          </a>
          <a href="/dashboard" className="fmj-mode-card">
            <strong>Dashboard</strong>
            <span>See solved count, accuracy, bookmarks, and weak areas.</span>
          </a>
        </section>

        <AttributionNotice />
      </main>

      <SiteFooter />
    </>
  );
}
