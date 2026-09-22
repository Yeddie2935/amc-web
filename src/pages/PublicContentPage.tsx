import { useMemo } from "react";
import type { PageData, ContentLink } from "../seo/types";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";
import { AttributionNotice } from "../components/attribution/AttributionNotice";
import { ClientFeature } from "../components/seo/ClientFeature";
import { PracticeDirectory } from "../components/seo/PracticeDirectory";
import { ProblemStatement } from "../components/problem/ProblemStatement";
import { WrittenSolution } from "../components/problem/WrittenSolution";

function Links({ links }: { links: ContentLink[] }) {
  return <ul className="fmj-public-links">{links.map(l => <li key={l.path}><a href={l.path}>{l.label}{l.path.includes("?problem=") ? " — try in the problem bank" : ""}</a></li>)}</ul>;
}
async function fetchContent(kind: string, id: string) {
  const response = await fetch(`/content/${kind}/${encodeURIComponent(id)}.json`);
  if (!response.ok) throw new Error("Content unavailable");
  return response.json();
}

export function PublicContentPage({ page }: { page: PageData }) {
  const load = useMemo(() => {
    if (page.kind === "lesson") return async () => {
      const [module,bundle] = await Promise.all([import("../components/seo/LessonFeature"),fetchContent("lessons",page.lesson!.id)]);
      return { default: () => <module.default bundle={bundle} /> };
    };
    if (page.kind === "problem") return async () => {
      const [module,problem] = await Promise.all([import("../components/seo/ProblemFeature"),fetchContent("problems",page.problem!.id)]);
      return { default: () => <module.default problem={problem} /> };
    };
    if (page.kind === "practice") return async () => { const m = await import("./PracticePage");return {default: () => <m.PracticePage embedded />}; };
    if (page.kind === "archive") return async () => { const m = await import("./ArchivePage");return {default: () => <m.ArchivePage embedded />}; };
    if (page.kind === "problems") return async () => { const m = await import("./ProblemBankPage");return {default: () => <m.ProblemBankPage embedded />}; };
    if (page.kind === "dashboard") return async () => { const m = await import("./DashboardPage");return {default: () => <m.DashboardPage embedded />}; };
    return null;
  }, [page]);
  const current = page.kind === "lesson" ? "learn" : page.kind === "year" ? "archive" : page.kind === "problem" ? "problems" : page.kind === "not-found" ? "home" : page.kind;
  return <><SiteHeader currentPage={current} /><main className="fmj-page fmj-public-page">
    {page.breadcrumbs.length > 0 && <nav aria-label="Breadcrumb"><ol className="fmj-breadcrumbs">{page.breadcrumbs.map((b,i) => <li key={b.path}>{i===page.breadcrumbs.length-1 ? <span aria-current="page">{b.label}</span> : <a href={b.path}>{b.label}</a>}</li>)}</ol></nav>}
    <section className="fmj-page-heading"><h1>{page.heading}</h1><p>{page.lesson?.intro ?? page.description}</p></section>
    {page.lesson && <section className="fmj-lesson-overview"><h2>What you'll learn</h2><ul>{page.lesson.objectives.map(o => <li key={o}>{o}</li>)}</ul>{page.lesson.prerequisites.length > 0 && <><h2>Before you start</h2><Links links={page.lesson.prerequisites} /></>}</section>}
    {page.kind === "not-found" && <Links links={[{ label:"Explore the lessons",path:"/learn"},{label:"Browse AMC 8 problems",path:"/archive"}]} />}
    {page.lanes && <PracticeDirectory lanes={page.lanes} />}
    {page.links && <section><h2>{page.kind === "year" ? "Problems in contest order" : page.kind === "archive" ? "Choose a contest year" : "Published worked solutions"}</h2><Links links={page.links} /></section>}
    {page.problem && <><ProblemStatement problem={page.problem} showTitle={false} diagrams={page.diagrams} />
      {page.problem.hints?.length ? <details className="fmj-public-details"><summary>Hints</summary><ol>{page.problem.hints.map(h => <li key={h}>{h}</li>)}</ol></details> : null}
      <details className="fmj-public-details" id="written-solution"><summary>Read the step-by-step solution</summary><WrittenSolution problem={page.problem} /></details><AttributionNotice /></>}
    {load && <ClientFeature load={load} label={page.kind === "lesson" ? "guided lesson" : "practice tools"} />}
    {page.lesson?.recap && <details className="fmj-public-details"><summary>Worked recap: {page.lesson.recap.title}</summary>{page.lesson.recap.paragraphs.map(p => <p key={p}>{p}</p>)}</details>}
    {page.related && page.related.length > 0 && <section><h2>Keep exploring</h2><Links links={page.related} /></section>}
    {page.lesson?.next.length ? <section><h2>Continue learning</h2><Links links={page.lesson.next} /></section> : null}
  </main><SiteFooter /></>;
}
