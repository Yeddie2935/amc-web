import fs from "fs";
import path from "path";
import { load } from "cheerio";

const DIST = path.resolve("dist");

const ROUTES = [
  {
    route: "/",
    title: "Fun Math Journey — AMC 8 Problem Explanations",
    description:
      "Free AMC 8 prep with 600+ problems across 5 difficulty levels. Learn, practice, and track your progress in algebra, geometry, number theory, and more.",
  },
  {
    route: "/learn",
    title: "Learn AMC 8 Math — Fun Math Journey",
    description:
      "Explore AMC 8 topics by skill and difficulty. Guided lessons in algebra, geometry, number theory, counting and probability, and more.",
  },
  {
    route: "/practice",
    title: "Practice AMC 8 Problems — Fun Math Journey",
    description:
      "Practice AMC 8 math problems one at a time with progress tracking. Filter by skill and difficulty across algebra, geometry, number theory, and more.",
  },
  {
    route: "/archive",
    title: "AMC 8 Archive — Fun Math Journey",
    description:
      "Browse all AMC 8 competition problems by year. Step-by-step explanations for every problem.",
  },
  {
    route: "/problems",
    title: "AMC 8 Problem Bank (600+ Problems) — Fun Math Journey",
    description:
      "Search and filter 600+ AMC 8 problems by skill, difficulty, and year. Full step-by-step solutions included.",
  },
  {
    route: "/dashboard",
    title: "My Progress — Fun Math Journey",
    description:
      "Track your AMC 8 practice progress. See solved problems, missed problems, and performance by skill category.",
  },
  {
    route: "/tips",
    title: "How to Prepare for AMC 8 — Study Tips & Strategy | Fun Math Journey",
    description:
      "Practical AMC 8 preparation tips: which topics to study, how to manage time, common mistakes to avoid, and a week-by-week study plan.",
  },
];

const baseHtml = fs.readFileSync(path.join(DIST, "index.html"), "utf-8");

for (const { route, title, description } of ROUTES) {
  const $ = load(baseHtml);

  $("title").text(title);
  $('meta[name="description"]').attr("content", description);
  $('link[rel="canonical"]').attr("href", `https://mathinking.org${route}`);
  $('meta[property="og:url"]').attr("content", `https://mathinking.org${route}`);
  $('meta[property="og:title"]').attr("content", title);
  $('meta[property="og:description"]').attr("content", description);
  $('meta[name="twitter:title"]').attr("content", title);
  $('meta[name="twitter:description"]').attr("content", description);

  if (route === "/") {
    fs.writeFileSync(path.join(DIST, "index.html"), $.html());
    console.log(`  prerendered /`);
  } else {
    const dir = path.join(DIST, route);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), $.html());
    console.log(`  prerendered ${route}`);
  }
}

console.log("prerender complete.");
