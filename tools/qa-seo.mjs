import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { once } from "node:events";

const base=process.env.SEO_QA_BASE_URL??"http://127.0.0.1:4173";
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function wait(check,label,timeout=20000){const start=Date.now();while(Date.now()-start<timeout){try{if(await check())return;}catch{}await pause(100);}throw new Error(`Timed out: ${label}`);}
class Page {
  id=0;pending=new Map();errors=[];requests=[];
  constructor(ws){this.ws=ws;ws.addEventListener("message",event=>{const m=JSON.parse(event.data);if(m.id){const p=this.pending.get(m.id);this.pending.delete(m.id);if(m.error)p?.reject(new Error(m.error.message));else p?.resolve(m.result);}
    if(m.method==="Runtime.exceptionThrown")this.errors.push(m.params.exceptionDetails.exception?.description??m.params.exceptionDetails.text);
    if(m.method==="Runtime.consoleAPICalled"&&m.params.type==="error")this.errors.push(m.params.args.map(a=>a.value??a.description).join(" "));
    if(m.method==="Network.requestWillBeSent")this.requests.push(m.params.request.url);
  });}
  send(method,params={}){const id=++this.id;this.ws.send(JSON.stringify({id,method,params}));return new Promise((resolve,reject)=>this.pending.set(id,{resolve,reject}));}
  async eval(expression){const r=await this.send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text);return r.result.value;}
  async goto(route,ready="document.querySelector('h1')"){
    this.errors=[];this.requests=[];await this.send("Page.navigate",{url:base+route});
    try{await wait(()=>this.eval(`location.pathname===${JSON.stringify(route.split("?")[0])} && document.readyState!=='loading' && Boolean(${ready})`),route);}catch(error){console.error(await this.eval("({url:location.href,title:document.title,text:document.body?.innerText.slice(0,700)})"),this.errors);throw error;}
    await pause(200);
  }
  async click(text){assert(await this.eval(`(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(text)});if(!b||b.disabled)return false;b.click();return true})()`),`Button ${text}`);await pause(100);}
}
let server,chrome,page;
const profile=await fs.mkdtemp(path.join(os.tmpdir(),"mathinking-seo-qa-"));
const results=[];
const report=JSON.parse(await fs.readFile(".seo-build/report.json","utf8"));
try {
  if(!process.env.SEO_QA_BASE_URL)server=spawn(process.execPath,["tools/serve-static.mjs"],{stdio:["ignore","ignore","inherit"]});
  await wait(async()=>{const r=await fetch(base);return r.ok;},"static server");
  for(const {path:route} of report.pages){const r=await fetch(base+route);assert.equal(r.status,200,route);const html=await r.text();assert(html.includes('id="page-data"'));assert(/<h1(?:\s|>)/.test(html));}
  for(const route of ["/learn/UNKNOWN","/problems/not-a-problem","/archive/2099","/practice-extra","/missing.png"]){const r=await fetch(base+route);assert.equal(r.status,404,route);}
  for(const [from,to] of [["/learn/c1","/learn/C1"],["/learn/C1/","/learn/C1"],["/learn/C1.html","/learn/C1"],["/index.html","/"],["/archive/index.html","/archive"]]) {
    const r=await fetch(base+from+"?utm_source=qa",{redirect:"manual"});
    assert.equal(r.status,308,from);
    const location=new URL(r.headers.get("location"),base);
    // Allow Vercel's clean-URL normalization to take more than one hop.
    const final=await fetch(location);assert.equal(new URL(final.url).pathname,to,from);assert.equal(final.status,200,from);assert.equal(new URL(final.url).searchParams.get("utm_source"),"qa",from);
  }
  for(const [route,keys] of Object.entries(report.functionalQueries))for(const key of keys)assert.match((await fetch(base+route+"?"+key+"=qa")).headers.get("x-robots-tag"),/noindex/,`${route}?${key}`);
  const tracking=(await fetch(base+"/learn/C1?utm_source=qa")).headers.get("x-robots-tag");
  if(report.preview)assert.match(tracking,/noindex/);else assert.equal(tracking,null);
  assert.match((await fetch(base+"/content/lessons/C1.json")).headers.get("x-robots-tag"),/noindex/);
  for(const [asset,mime] of [["og-image.png","image/png"],["favicon.ico","image/"],["favicon.svg","image/svg+xml"]])assert((await fetch(`${base}/${asset}`)).headers.get("content-type").startsWith(mime),asset);
  results.push("HTTP status, redirects, functional-query and tracking-query policies");

  chrome=spawn(process.env.CHROME_PATH??"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",["--headless=new","--disable-gpu","--disable-background-networking","--disable-extensions","--disable-sync","--no-first-run","--no-default-browser-check","--remote-debugging-port=0",`--user-data-dir=${profile}`,"about:blank"],{stdio:"ignore"});
  let port;
  await wait(async()=>{port=(await fs.readFile(path.join(profile,"DevToolsActivePort"),"utf8")).split("\n")[0];return !!port;},"Chrome");
  const cdp=`http://127.0.0.1:${port}`;
  const target=await (await fetch(cdp+"/json/new?about:blank",{method:"PUT"})).json();
  const ws=new WebSocket(target.webSocketDebuggerUrl);await once(ws,"open");page=new Page(ws);
  await Promise.all([page.send("Runtime.enable"),page.send("Page.enable"),page.send("Network.enable")]);
  for(const route of ["/","/learn"]){await page.goto(route);assert.equal(await page.eval("document.querySelectorAll('h1').length"),1);assert.equal(await page.eval("document.querySelector('meta[name=robots]').content"),report.preview?"noindex, follow":"index, follow");assert(!page.requests.some(u=>/sampleProblems|ProblemAnimationStage|LessonFeature/.test(u)),"Public directory downloaded interactive libraries");assert.deepEqual(page.errors,[]);}
  results.push("Homepage and Learn hydrate without downloading bank/scene libraries");
  results.push(`${report.preview?"Preview noindex":"Production indexing"} survives hydration`);

  await page.send("Emulation.setScriptExecutionDisabled",{value:true});
  await page.goto("/problems/amc8-2026-01");
  assert(await page.eval("document.querySelector('#written-solution').textContent.includes('18')"));
  await page.send("Emulation.setScriptExecutionDisabled",{value:false});
  results.push("Written solution present with page scripts disabled");
  await page.send("Network.setBlockedURLs",{urls:["*/content/lessons/C1.json"]});
  await page.goto("/learn/C1","document.querySelector('[role=alert] button')");
  assert.match(await page.eval("document.querySelector('h1').textContent"),/Addition vs Multiplication/);
  assert(await page.eval("document.querySelectorAll('.fmj-lesson-overview li').length>0"));
  assert.equal(await page.eval("document.querySelector('link[rel=canonical]').href"),report.origin+"/learn/C1");
  await page.send("Network.setBlockedURLs",{urls:[]});
  await page.click("Try again");
  await wait(()=>page.eval("Boolean(document.querySelector('[aria-current=step]'))"),"lesson download retry");
  results.push("Public lesson content survives failed interaction download, and retry recovers");

  await page.goto("/problems/amc8-2026-01","document.querySelector('input[type=radio]')");
  await page.eval(`localStorage.setItem('fmj-amc8-progress-v2',JSON.stringify({solvedIds:['amc8-1999-01'],missedIds:['amc8-1999-02'],bookmarkedIds:['amc8-1999-03'],attempts:[]}))`);
  await page.goto("/problems/amc8-2026-01","document.querySelector('input[type=radio]')");
  await page.eval("document.querySelector('input[value=A]').click()");await pause(100);
  await page.click("Check answer");await page.click("Bookmark problem");
  const saved=await page.eval("JSON.parse(localStorage.getItem('fmj-amc8-progress-v2'))");
  assert(saved.solvedIds.includes("amc8-1999-01")&&saved.solvedIds.includes("amc8-2026-01"));
  assert(saved.missedIds.includes("amc8-1999-02"));assert(saved.bookmarkedIds.includes("amc8-1999-03")&&saved.bookmarkedIds.includes("amc8-2026-01"));assert.equal(saved.attempts.length,1);
  await page.click("Play animated explanation");await wait(()=>page.eval("!!document.querySelector('.fmj-fixed-stage')"),"problem animation");assert.deepEqual(page.errors,[]);
  results.push("Problem answer/bookmark/animation and existing saved progress preserved");

  await page.goto("/problems?q=geometry","document.querySelector('.fmj-result-count')");
  assert.equal(await page.eval("document.querySelector('.fmj-advanced-filters input').value"),"geometry");
  assert.notEqual(await page.eval("document.querySelector('.fmj-result-count').textContent"),"Showing 675 of 675 problems");
  assert.match(await page.eval("document.querySelector('meta[name=robots]').content"),/noindex/);assert.deepEqual(page.errors,[]);
  await page.goto("/problems?problem=amc8-2026-12","document.querySelector('.fmj-workspace h2')");
  assert.match(await page.eval("document.querySelector('.fmj-workspace h2').textContent"),/2026.*12/);
  results.push("Search query and unpublished-problem deep links work");
  await page.goto("/problems?year=2026&category=Geometry&difficulty=1","document.querySelector('.fmj-result-count')");
  assert.deepEqual(await page.eval("[...document.querySelectorAll('.fmj-advanced-filters select')].slice(0,3).map(s=>s.value)"),["2026","Geometry","1"]);
  assert.deepEqual(page.errors,[]);
  await page.goto("/problems?year=not-a-year&problem=missing","document.querySelector('[role=alert]')");
  assert.match(await page.eval("document.querySelector('[role=alert]').textContent"),/not found/);
  results.push("Year/category/difficulty deep links and invalid-filter recovery");

  await page.goto("/practice?skill=geometry&difficulty=1","document.querySelector('.fmj-workspace')");assert.deepEqual(page.errors,[]);assert.equal(await page.eval("document.querySelectorAll('main').length"),1);
  results.push("Filtered practice loads without duplicate main landmarks");
  // Exercise the existing archive entry point, not just new standalone pages.
  await page.goto("/archive","document.querySelector('.fmj-year-rail button')");
  for(const [year,number,answer] of [[2022,3,"E"],[2020,17,"B"]]) {
    await page.eval(`([...document.querySelectorAll('.fmj-year-rail button')].find(b=>b.firstChild.textContent.trim()===${JSON.stringify(String(year))})).click()`);
    await wait(()=>page.eval(`document.querySelector('.fmj-workspace h2').textContent.includes(${JSON.stringify(String(year))})`),`archive ${year}`);
    await page.eval(`([...document.querySelectorAll('.fmj-compact-row strong')].find(b=>b.textContent===${JSON.stringify(`AMC 8 ${year}, Problem ${number}`)})).closest('button').click()`);
    await wait(()=>page.eval(`document.querySelector('.fmj-workspace h2').textContent.includes(${JSON.stringify(`Problem ${number}:`)})`),`archive problem ${number}`);
    await page.click("Play animated explanation");
    await wait(()=>page.eval("document.querySelectorAll('.fmj-animation-dots button').length===4"),"archive animation timeline");
    for(const step of [0,1,2,3,1]) {
      await page.eval(`document.querySelectorAll('.fmj-animation-dots button')[${step}].click()`);
      await wait(()=>page.eval(`document.querySelector('.fmj-fixed-stage').dataset.step===${JSON.stringify(String(step))}`),`archive step ${step}`);
      assert(!(await page.eval("document.querySelector('.fmj-fixed-stage').textContent")).includes("check failed"));
      if(step===3){await pause(2300);assert((await page.eval("document.querySelector('.fmj-fixed-stage').textContent")).includes(`Answer ${answer}`));}
    }
    await page.click("Hide animated explanation");
    assert.equal(await page.eval("document.querySelectorAll('.fmj-fixed-stage').length"),0);
    assert.deepEqual(page.errors,[]);
  }
  assert.equal(await page.eval("document.querySelectorAll('main').length"),1);
  results.push("Archive year/problem selection and original four-step animations (2022/3, 2020/17), including back navigation");
  for(const id of ["C1","C5","N4","F1","C4","G4"]){await page.goto(`/learn/${id}`,"document.querySelector('[aria-current=step]')");assert.equal(await page.eval("document.querySelectorAll('h1').length"),1);assert.equal(await page.eval("document.querySelector('link[rel=canonical]').href"),`https://www.mathinking.org/learn/${id}`);assert(!page.requests.some(u=>/sampleProblems/.test(u)),"Lesson fetched full bank");assert.deepEqual(page.errors,[]);}
  results.push("Six pilot lessons hydrate and start with correct canonical, without full bank");
  await page.send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});
  for(const [route,name] of [["/","home"],["/learn/C5","lesson"],["/problems/amc8-2026-01","problem"]]){
    await page.goto(route);assert(await page.eval("document.documentElement.scrollWidth <= innerWidth + 1"),`Mobile overflow ${route}`);
    const shot=await page.send("Page.captureScreenshot",{format:"png",captureBeyondViewport:false});await fs.writeFile(path.join(".seo-build",`mobile-${name}.png`),Buffer.from(shot.data,"base64"));
  }
  results.push("390px mobile layout checks and screenshots");
  await fs.writeFile(".seo-build/qa-results.json",JSON.stringify(results,null,2));
  console.log(results.map(r=>`PASS ${r}`).join("\n"));
} finally {
  page?.ws.close();chrome?.kill("SIGTERM");server?.kill("SIGTERM");
  if(chrome)setTimeout(()=>chrome.kill("SIGKILL"),1000).unref();
}
