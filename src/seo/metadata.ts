import { SITE, safeJson, hasFunctionalQuery } from "./site";
import type { PageData } from "./types";

export function structuredData(page: PageData) {
  if (page.kind === "home") return { "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: SITE.origin + "/" };
  if (!page.breadcrumbs.length) return null;
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: page.breadcrumbs.map((b, i) => ({ "@type": "ListItem", position: i+1, name: b.label, item: SITE.origin + b.path })) };
}

export function applyPageMetadata(page: PageData) {
  document.title = page.title;
  const meta = (attribute: "name" | "property", key: string, value: string) => {
    let node = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
    if (!node) { node = document.createElement("meta"); node.setAttribute(attribute, key); document.head.append(node); }
    node.content = value;
  };
  meta("name", "description", page.description);
  meta("name", "robots", !page.indexable || hasFunctionalQuery(page.path, window.location.search) ? "noindex, follow" : "index, follow");
  meta("property", "og:type", "website");
  meta("property", "og:site_name", SITE.name);
  meta("name", "twitter:card", "summary_large_image");
  for (const [key,value] of Object.entries({ title:page.title, description:page.description, image:SITE.origin+SITE.image })) {
    meta("property", `og:${key}`, value);
    meta("name", `twitter:${key}`, value);
  }
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (page.kind === "not-found") {
    canonical?.remove();
    document.head.querySelector('meta[property="og:url"]')?.remove();
  } else {
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.append(canonical); }
    canonical.href = SITE.origin + page.path;
    meta("property", "og:url", canonical.href);
  }
  let schema = document.getElementById("page-schema");
  const data = structuredData(page);
  if (!data) schema?.remove();
  else {
    if (!schema) { schema = document.createElement("script"); schema.id = "page-schema"; schema.setAttribute("type", "application/ld+json"); document.head.append(schema); }
    schema.textContent = safeJson(data);
  }
}
