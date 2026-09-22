import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { load } from "cheerio";

const catalog = JSON.parse(await fs.readFile(".seo-build/report.json", "utf8"));
const origin = catalog.origin;
const errors = [];
const warnings = [];
const checked = [];
async function request(url) {
  const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(20000) });
  return { response, text: await response.text() };
}
async function checkPage(page) {
  try {
    const { response, text } = await request(origin + page.path);
    const $ = load(text);
    assert.equal(response.status, 200, "HTTP status");
    assert.equal($("h1").length, 1, "H1 count");
    assert.equal($("main").length, 1, "main landmark count");
    assert.equal($("title").text(), page.title, "title differs from catalog");
    assert.equal($('link[rel="canonical"]').length, 1, "canonical count");
    assert.equal($('link[rel="canonical"]').attr("href"), origin + page.path, "canonical URL");
    assert.equal($('meta[property="og:url"]').attr("content"), origin + page.path, "Open Graph URL");
    const indexable = page.kind !== "dashboard";
    assert.equal($('meta[name="robots"]').attr("content"), indexable ? "index, follow" : "noindex, follow", "robots metadata");
    if (indexable) assert(!/noindex/i.test(response.headers.get("x-robots-tag") ?? ""), "production noindex header");
    const data = JSON.parse($("#page-data").text());
    assert.equal(data.indexable, indexable, "hydration index policy");
    for (const [key,value] of Object.entries({title:page.title,description:data.description,image:origin+"/og-image.png"})) {
      for (const [attribute,prefix] of [["property","og"],["name","twitter"]]) {
        const tag=$(`meta[${attribute}="${prefix}:${key}"]`);
        assert.equal(tag.length,1,`${prefix}:${key} count`);
        assert.equal(tag.attr("content"),value,`${prefix}:${key} content`);
      }
    }
    assert.equal($('meta[name="description"]').attr("content"),data.description,"description");
    for(const node of $('script[type="application/ld+json"]').toArray()) JSON.parse($(node).text());
    if(page.kind==="lesson")assert($(".fmj-lesson-overview li").length>0,"lesson overview missing");
    if(page.kind==="problem")assert($("details .fmj-solution-steps li").length>0,"written solution missing");
    checked.push({ path:page.path, status:response.status, server:response.headers.get("server") });
  } catch(error) { errors.push(`${page.path}: ${error.message}`); }
}
// Keep the live crawl modest rather than opening every URL simultaneously.
for(let i=0;i<catalog.pages.length;i+=4)await Promise.all(catalog.pages.slice(i,i+4).map(checkPage));
try {
  const {response,text}=await request(origin+"/sitemap.xml");
  assert.equal(response.status,200);
  const $=load(text,{xmlMode:true});
  const urls=$("loc").map((i,e)=>$(e).text()).get();
  const wanted=catalog.pages.filter(p=>p.kind!=="dashboard").map(p=>origin+p.path);
  assert.deepEqual(urls.sort(),wanted.sort(),"live sitemap inventory");
  const robots=await request(origin+"/robots.txt");
  assert.equal(robots.response.status,200);
  assert(robots.text.includes(`Sitemap: ${origin}/sitemap.xml`),"robots sitemap reference");
  assert(!/^Disallow:\s*\/\s*$/m.test(robots.text),"robots blocks the whole site");
} catch(error) { errors.push(`Discovery files: ${error.message}`); }
const apex=await fetch("https://mathinking.org/",{redirect:"manual",signal:AbortSignal.timeout(20000)});
if(![301,308].includes(apex.status))warnings.push(`Apex redirect is ${apex.status}, not permanent; review existing Vercel domain settings.`);
if(apex.headers.get("location")!==origin+"/")errors.push("Apex redirect does not target the canonical homepage");
const result={checkedAt:new Date().toISOString(),origin,pagesChecked:checked.length,sitemapExpected:catalog.pages.filter(p=>p.kind!=="dashboard").length,errors,warnings,pages:checked};
await fs.writeFile(".seo-build/live-seo-results.json",JSON.stringify(result,null,2));
console.log(JSON.stringify({...result,pages:undefined},null,2));
if(errors.length)process.exitCode=1;
