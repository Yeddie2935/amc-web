import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";
import { load } from "cheerio";
import { validateSeo } from "./validate-seo.mjs";

await build({ build: { ssr: "src/entry-static.tsx", outDir: ".seo-build", emptyOutDir: true } });
const renderer = await import(pathToFileURL(path.resolve(".seo-build/entry-static.js")).href);
const { createCatalog, renderPage, getInteractionData, notFoundPage, structuredData, SITE, safeJson, FUNCTIONAL_QUERIES } = renderer;
const catalog = createCatalog();
// Carry preview noindex into page data so hydration cannot undo it.
const preview = process.env.VERCEL_ENV === "preview";
if (preview) for (const page of catalog.pages) page.indexable = false;
await build({ build: { outDir: "dist", emptyOutDir: true, manifest: true } });
const template = await fs.readFile("dist/index.html", "utf8");
const meta = ($, attr, key, value) => {
  $(`meta[${attr}="${key}"]`).remove();
  $("<meta>").attr(attr,key).attr("content",value).appendTo("head");
};
for (const page of [...catalog.pages,notFoundPage]) {
  const $ = load(template);
  $("title").text(page.title);
  meta($,"name","description",page.description);
  meta($,"name","robots",page.indexable ? "index, follow" : "noindex, follow");
  meta($,"property","og:type","website");
  meta($,"property","og:site_name",SITE.name);
  meta($,"property","og:image:width","1200");
  meta($,"property","og:image:height","630");
  meta($,"name","twitter:card","summary_large_image");
  for (const [key,value] of Object.entries({title:page.title,description:page.description,image:SITE.origin+SITE.image})) {
    meta($,"property",`og:${key}`,value);meta($,"name",`twitter:${key}`,value);
  }
  $('link[rel="canonical"]').remove();
  if (page.kind !== "not-found") {
    $("<link>").attr("rel","canonical").attr("href",SITE.origin+page.path).appendTo("head");
    meta($,"property","og:url",SITE.origin+page.path);
  }
  const schema=structuredData(page);
  if (schema) $('<script id="page-schema" type="application/ld+json"></script>').text(safeJson(schema)).appendTo("head");
  $("#root").html(renderPage(page));
  $('<script id="page-data" type="application/json"></script>').text(safeJson(page)).appendTo("body");
  const file=path.join("dist",page.path==="/" ? "index.html" : `${page.path.slice(1)}.html`);
  await fs.mkdir(path.dirname(file),{recursive:true});
  await fs.writeFile(file,$.html());
  if (page.lesson || page.problem) {
    const kind=page.lesson ? "lessons":"problems";
    const id=page.lesson?.id ?? page.problem.id;
    const file=path.join("dist","content",kind,`${id}.json`);
    await fs.mkdir(path.dirname(file),{recursive:true});
    await fs.writeFile(file,safeJson(getInteractionData(kind,id)));
  }
}
const urls=catalog.pages.filter(p=>p.indexable).map(p=>`${SITE.origin}${p.path}`);
await fs.writeFile("dist/sitemap.xml",`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url=>`  <url><loc>${url}</loc></url>`).join("\n")}\n</urlset>\n`);
await fs.writeFile("dist/robots.txt",`User-agent: *\nAllow: /\n${preview ? "" : `\nSitemap: ${SITE.origin}/sitemap.xml\n`}`);
await fs.writeFile(".seo-build/report.json",JSON.stringify({origin:SITE.origin,preview,functionalQueries:FUNCTIONAL_QUERIES,pages:catalog.pages.map(({path,kind,title,indexable})=>({path,kind,title,indexable})),counts:{pages:catalog.pages.length,indexable:urls.length}},null,2));
await validateSeo();
