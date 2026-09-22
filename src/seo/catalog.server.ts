import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { sampleProblems } from "../data/sampleProblems";
import { curriculumNodes } from "../data/curriculum";
import { getLessonBundle } from "../data/lessons";
import { curriculumProblemMappings } from "../data/curriculum/problemMappings";
import { SKILL_LANES } from "../lib/skills";
import { filterProblemsBySkill } from "../lib/problemFilters";
import overrides from "./content-overrides.json";
import { normalizePath } from "./site";
import type { ContentLink, PageData } from "./types";

const link = (label: string, path: string): ContentLink => ({ label, path });
export const notFoundPage: PageData = { kind: "not-found", path: "/404", title: "Page Not Found | Mathinking", heading: "We couldn't find that page.", description: "Find an AMC 8 lesson or return to the Mathinking problem archive.", indexable: false, breadcrumbs: [] };

export function createCatalog() {
  const records: PageData[] = [];
  const bank = new Map(sampleProblems.map(p => [p.id, p]));
  if (bank.size !== sampleProblems.length) throw new Error("Duplicate problem IDs");
  const published = new Set(overrides.problemIds);
  if (overrides.pilotReview.status !== "implementation-reviewed") throw new Error("Problem pilot requires a review record");
  if (published.size !== overrides.problemIds.length) throw new Error("Duplicate published problem ID");
  const problemLink = (id: string): ContentLink => {
    const p = bank.get(id);
    if (!p) throw new Error(`Unknown related problem ${id}`);
    return link(`${p.year} AMC 8 Problem ${p.problemNumber}`, published.has(id) ? `/problems/${id}` : `/problems?problem=${id}`);
  };
  const add = (kind: PageData["kind"], path: string, heading: string, description: string, extra: Partial<PageData> = {}) => {
    if (!/^\/(?:[A-Za-z0-9-]+(?:\/[A-Za-z0-9-]+)*)?$/.test(path)) throw new Error(`Unsafe public path ${path}`);
    records.push({ kind, path, heading, title: `${heading} | Mathinking`, description, indexable: true, breadcrumbs: [link("Home", "/"), link(heading, path)], ...extra });
  };
  const years = [...new Set(sampleProblems.map(p => p.year!))].sort((a,b) => b-a);
  const publishedYears = [...new Set(overrides.problemIds.map(id => {
    if (!bank.has(id)) throw new Error(`Unknown published problem ${id}`);
    return bank.get(id)!.year!;
  }))];
  const yearLinks = years.map(year => link(`${year} AMC 8`, publishedYears.includes(year) ? `/archive/${year}` : `/problems?year=${year}`));
  add("home", "/", "Free AMC 8 Lessons & Visual Math Practice", "Discover why the math works with guided AMC 8 lessons, visual explanations, and focused practice. Build ideas, then apply them to contest problems.", { problemCount: sampleProblems.length, breadcrumbs: [] });
  add("learn", "/learn", `${curriculumNodes.length} Guided AMC 8 Math Lessons`, "Explore guided math lessons across foundations, algebra, number theory, counting and probability, geometry, and problem-solving.");
  add("practice", "/practice", "AMC 8 Practice by Topic & Difficulty", "Choose a topic and difficulty, practice with hints, and review visual explanations. Progress is saved in this browser.", { lanes: SKILL_LANES.map(lane => {
    const problems = filterProblemsBySkill(sampleProblems, lane.id);
    return { ...lane, counts: [1,2,3,4,5].map(d => problems.filter(p => p.difficulty === d).length) };
  }) });
  add("archive", "/archive", "AMC 8 Past Problems & Solutions by Year", "Browse AMC 8 problems in contest order, open worked solutions, and use the problem bank to practice any year.", { links: yearLinks });
  add("problems", "/problems", "AMC 8 Problem Bank", `Search ${sampleProblems.length} AMC 8 problems by topic, year, and difficulty. Use hints and step-by-step explanations to develop your reasoning.`, { links: overrides.problemIds.map(problemLink) });
  add("tips", "/tips", "How to Prepare for AMC 8", "Build an AMC 8 study routine with guided lessons, focused practice, and review of past problems.");
  add("license", "/license", "Attribution & Content License", "Learn about AMC problem attribution, Mathinking's original explanations, and its independent educational purpose.");
  add("dashboard", "/dashboard", "Your Math Practice Progress", "Review attempts, bookmarks, and progress saved on this browser.", { indexable: false });

  for (const node of curriculumNodes) {
    const bundle = getLessonBundle(node.id);
    if (!bundle) throw new Error(`Missing registered lesson ${node.id}`);
    const lesson = bundle.lesson;
    const resolveLesson = (id: string) => {
      const target = curriculumNodes.find(n => n.id === id);
      if (!target) throw new Error(`Unknown lesson relationship ${id}`);
      return link(target.title, `/learn/${id}`);
    };
    const mapping = curriculumProblemMappings.find(m => m.lessonId === node.id && m.reviewStatus === "approved");
    const relatedIds = [...new Set(lesson.beats.filter(b => b.kind === "problem" && b.source === "bank").map(b => (b as {problemId:string}).problemId))];
    if (mapping?.bestBankCandidate) relatedIds.unshift(mapping.bestBankCandidate.problemId);
    add("lesson", `/learn/${node.id}`, lesson.title, `Explore ${lesson.title.toLowerCase()} with a guided AMC 8 lesson, worked reasoning, and related practice.`, {
      title: `${lesson.title}: AMC 8 Math Lesson | Mathinking`,
      breadcrumbs: [link("Home", "/"), link("Lessons", "/learn"), link(lesson.title, `/learn/${node.id}`)],
      lesson: { id: node.id, title: lesson.title, intro: lesson.coreInsight, objectives: lesson.learningObjectives, prerequisites: lesson.hardPrerequisites.map(resolveLesson), next: lesson.continuity.nextLessonIds.map(resolveLesson), recap: overrides.recaps[node.id as keyof typeof overrides.recaps] },
      related: [...new Set(relatedIds)].slice(0,3).map(problemLink),
    });
  }
  for (const id of published) {
    const p = bank.get(id)!;
    if (!p.statement || !p.solutionSteps.length || !p.choices?.some(c => c.label === p.answer)) throw new Error(`Incomplete published problem ${id}`);
    const { animation, animationFrames, ...publicProblem } = p;
    const descriptions = overrides.diagramDescriptions[id as keyof typeof overrides.diagramDescriptions];
    const diagrams = (p.imageUrls ?? []).map((url, i) => {
      if (!/^\/amc8-diagrams\/[\w/-]+\.png$/.test(url) || !descriptions?.[i]) throw new Error(`Missing reviewed diagram description: ${id}`);
      const bytes = readFileSync(resolve("public", url.slice(1)));
      if (bytes.toString("hex", 0, 8) !== "89504e470d0a1a0a") throw new Error(`Invalid diagram PNG: ${url}`);
      return { alt: descriptions[i], width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
    });
    const related = curriculumNodes.filter(n => {
      const lesson = getLessonBundle(n.id)!.lesson;
      return lesson.beats.some(b => b.kind === "problem" && b.source === "bank" && b.problemId === id);
    }).slice(0,3).map(n => link(n.title, `/learn/${n.id}`));
    const neighbor = sampleProblems.find(q => q.year === p.year && q.problemNumber === p.problemNumber! + 1 && published.has(q.id));
    if (neighbor) related.push(problemLink(neighbor.id));
    add("problem", `/problems/${id}`, `${p.year} AMC 8 Problem ${p.problemNumber}: Solution`, `Work through ${p.year} AMC 8 Problem ${p.problemNumber} on ${(p.subcategory ?? p.category).toLowerCase()} with a written solution, hints, and a visual explanation.`, { problem: publicProblem, diagrams, related, breadcrumbs: [link("Home", "/"), link("AMC Archive", "/archive"), link(`${p.year} AMC 8`, `/archive/${p.year}`), problemLink(id)] });
  }
  for (const year of publishedYears) add("year", `/archive/${year}`, `${year} AMC 8 Problems & Solutions`, `Explore all 25 ${year} AMC 8 problems in contest order. Open published worked solutions or try a question in the problem bank.`, { year, links: sampleProblems.filter(p => p.year === year).map(p => problemLink(p.id)), breadcrumbs: [link("Home", "/"), link("AMC Archive", "/archive"), link(`${year} AMC 8`, `/archive/${year}`)] });
  const byPath = new Map(records.map(p => [p.path, p]));
  if (byPath.size !== records.length) throw new Error("Duplicate public paths");
  return { pages: records, resolve: (path: string) => byPath.get(normalizePath(path)) ?? notFoundPage };
}

export function getInteractionData(kind: string, id: string) {
  if (kind === "problems" && overrides.problemIds.includes(id)) return sampleProblems.find(p => p.id === id);
  if (kind !== "lessons") return undefined;
  const bundle = getLessonBundle(id);
  if (!bundle || !curriculumNodes.some(n => n.id === id)) return undefined;
  const ids = new Set(bundle.lesson.beats.filter(b => b.kind === "problem" && b.source === "bank").map(b => (b as {problemId:string}).problemId));
  return {
    lesson: { lessonId: bundle.lesson.lessonId, title: bundle.lesson.title, beats: bundle.lesson.beats },
    generatedProblemArtifacts: bundle.generatedProblemArtifacts.map(({ problem }) => ({ problem })),
    bankProblems: sampleProblems.filter(p => ids.has(p.id)),
  };
}
