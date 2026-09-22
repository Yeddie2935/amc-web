import fs from "node:fs/promises";
import path from "node:path";
import { load } from "cheerio";
import { pathToFileURL } from "node:url";

export async function validateSeo() {
  const report=JSON.parse(await fs.readFile(".seo-build/report.json","utf8"));
  const expected=new Set(report.pages.map(p=>p.path));
  const errors=[];
  for(const page of [...report.pages,{path:"/404",kind:"not-found",indexable:false}]) {
    const html=await fs.readFile(path.join("dist",page.path==="/"?"index.html":page.path.slice(1)+".html"),"utf8");
    const $=load(html);
    const check=(ok,message)=>{if(!ok)errors.push(`${page.path}: ${message}`);};
    check($("h1").length===1,"must have one H1");
    check($("title").text().includes("Mathinking"),"wrong brand/title");
    check($("title").length===1,"duplicate title");
    check($('meta[name="description"]').length===1,"missing/duplicate description");
    check($('meta[name="robots"]').length===1,"missing/duplicate robots directive");
    check($("#root").text().length>100,"empty public body");
    check(!$("head").text().includes("Fun Math Journey"),"obsolete metadata");
    const canon=$('link[rel="canonical"]');
    check(page.kind==="not-found" ? canon.length===0 : canon.length===1&&canon.attr("href")===report.origin+page.path,"incorrect canonical");
    check($('meta[name="robots"]').attr("content")===(page.indexable?"index, follow":"noindex, follow"),"incorrect robots directive");
    if(page.kind==="problem")check($("details .fmj-solution-steps li").length>0,"solution missing from HTML");
    if(page.kind==="lesson")check($(".fmj-lesson-overview li").length>0,"lesson overview missing");
    const data=JSON.parse($("#page-data").text());check(data.path===page.path&&data.indexable===page.indexable,"page-data mismatch");
    for(const [key,value] of Object.entries({title:data.title,description:data.description,image:report.origin+"/og-image.png"})) {
      for(const [attribute,prefix] of [["property","og"],["name","twitter"]]) {
        const tag=$(`meta[${attribute}="${prefix}:${key}"]`);
        check(tag.length===1&&tag.attr("content")===value,`missing/incorrect ${prefix}:${key}`);
      }
    }
    const ogUrl=$('meta[property="og:url"]');
    check(page.kind==="not-found"?ogUrl.length===0:ogUrl.length===1&&ogUrl.attr("content")===report.origin+page.path,"incorrect Open Graph URL");
    check($('meta[name="twitter:card"]').attr("content")==="summary_large_image","incorrect Twitter card");
    check($("#page-data").length===1,"duplicate page data");
    for(const script of $("script[src]").toArray()) {
      const src=$(script).attr("src");
      if(src.startsWith("/"))try{await fs.access(path.join("dist",src));}catch{errors.push(`${page.path}: missing script ${src}`);}
    }
    for(const e of $('script[type="application/ld+json"]').toArray())JSON.parse($(e).text());
    for(const a of $("a[href]").toArray()) {
      const href=$(a).attr("href");
      if(!href.startsWith("/")||href.startsWith("//"))continue;
      const url=new URL(href,report.origin);
      check(expected.has(url.pathname),`broken internal link ${href}`);
    }
    for(const img of $("img[src]").toArray()) {
      const src=$(img).attr("src");
      check($(img).attr("alt")!==undefined,`missing image alt: ${src}`);
      if(page.kind==="problem")check(Number($(img).attr("width"))>0&&Number($(img).attr("height"))>0,`missing diagram dimensions: ${src}`);
      if(src.startsWith("/"))try{await fs.access(path.join("dist",src));}catch{errors.push(`${page.path}: missing image ${src}`);}
    }
  }
  const sitemap=load(await fs.readFile("dist/sitemap.xml","utf8"),{xmlMode:true});
  const actual=sitemap("loc").map((i,e)=>sitemap(e).text()).get();
  const wanted=report.pages.filter(p=>p.indexable).map(p=>report.origin+p.path);
  if(new Set(actual).size!==actual.length||actual.length!==wanted.length||wanted.some(u=>!actual.includes(u)))errors.push("Sitemap differs from indexable catalog");
  const image=await fs.readFile("dist/og-image.png");
  if(image.toString("hex",0,8)!=="89504e470d0a1a0a"||image.readUInt32BE(16)!==1200||image.readUInt32BE(20)!==630)errors.push("Invalid 1200×630 social PNG");
  const icon=await fs.readFile("dist/favicon.ico");
  if(icon.readUInt16LE(0)!==0||icon.readUInt16LE(2)!==1||icon.readUInt16LE(4)<1)errors.push("Invalid favicon ICO");
  const config=JSON.parse(await fs.readFile("vercel.json","utf8"));
  if(!report.functionalQueries)errors.push("Build report is missing the query policy");
  for(const [route,keys] of Object.entries(report.functionalQueries??{}))for(const key of keys) {
    if(!config.headers.some(rule=>rule.source===route&&rule.has?.length===1&&rule.has[0].type==="query"&&rule.has[0].key===key&&rule.headers.some(h=>h.key.toLowerCase()==="x-robots-tag"&&h.value.includes("noindex"))))errors.push(`Missing Vercel noindex query policy: ${route}?${key}`);
  }
  const robots=await fs.readFile("dist/robots.txt","utf8");
  if(report.preview&&(actual.length||report.pages.some(p=>p.indexable)||robots.includes("Sitemap:")))errors.push("Preview build is indexable or advertises a sitemap");
  if(!report.preview&&!robots.includes(`Sitemap: ${report.origin}/sitemap.xml`))errors.push("Production robots is missing the canonical sitemap");
  if(config.rewrites?.some(r=>r.destination==="/index.html"))errors.push("Catch-all SPA rewrite would hide real 404s");
  for(const page of report.pages.filter(p=>p.kind==="lesson")) {
    if(!config.redirects.some(r=>r.source===page.path.toLowerCase()&&r.destination===page.path&&r.permanent))errors.push(`Missing lowercase lesson redirect: ${page.path}`);
  }
  if(errors.length)throw new Error(errors.join("\n"));
  console.log(`SEO validation passed: ${report.pages.length} pages, ${actual.length} sitemap entries.`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)await validateSeo();
