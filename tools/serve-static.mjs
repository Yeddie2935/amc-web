import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
const root=path.resolve("dist");
const types={".html":"text/html; charset=utf-8",".js":"application/javascript",".css":"text/css",".json":"application/json",".xml":"application/xml",".txt":"text/plain",".png":"image/png",".svg":"image/svg+xml",".ico":"image/x-icon"};
const report=JSON.parse(await fs.readFile(".seo-build/report.json","utf8"));
const config=JSON.parse(await fs.readFile("vercel.json","utf8"));
const pages=new Map(report.pages.map(page=>[page.path,page]));
const queryKeys=report.functionalQueries;
// Mirror literal local aliases. Host-based routing still needs Vercel review.
const aliases=new Map(config.redirects.filter(rule=>!rule.has&&!rule.source.includes(":")).map(rule=>[rule.source,rule.destination]));
http.createServer(async(req,res)=>{
  const url=new URL(req.url,"http://localhost");
  let name;
  try{name=decodeURIComponent(url.pathname);}catch{res.writeHead(400);res.end("Bad URL");return;}
  const canonical=name.replace(/\/+$/,"")||"/";
  const clean=canonical.endsWith(".html")?canonical.slice(0,-5):canonical;
  const target=aliases.get(clean)??(pages.has(clean)?clean:canonical);
  if(target!==name){res.writeHead(308,{Location:target+url.search});res.end();return;}
  let file=path.resolve(root,"."+name);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(404);res.end();return;}
  if(name==="/")file=path.join(root,"index.html");
  else if(!path.extname(file))file+=".html";
  let status=200;
  let body;
  try{body=await fs.readFile(file);}catch{status=404;file=path.join(root,"404.html");body=await fs.readFile(file);}
  const headers={"Content-Type":types[path.extname(file)]??"application/octet-stream"};
  if(status===404||pages.get(name)?.indexable===false||name.startsWith("/content/")||(queryKeys[name]??[]).some(k=>url.searchParams.has(k)))headers["X-Robots-Tag"]="noindex";
  res.writeHead(status,headers);res.end(req.method==="HEAD"?undefined:body);
}).listen(Number(process.env.PORT??4173),"127.0.0.1",()=>console.log("Static preview on http://127.0.0.1:"+(process.env.PORT??4173)));
