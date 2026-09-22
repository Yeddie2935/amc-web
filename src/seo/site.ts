export const SITE = {
  name: "Mathinking",
  origin: "https://www.mathinking.org",
  image: "/og-image.png",
} as const;

export const FUNCTIONAL_QUERIES: Record<string, readonly string[]> = {
  "/practice": ["skill", "category", "difficulty", "session"],
  "/problems": ["q", "problem", "year", "category", "difficulty", "status"],
};

export function hasFunctionalQuery(path: string, search: string) {
  const params = new URLSearchParams(search);
  return (FUNCTIONAL_QUERIES[path] ?? []).some(key => params.has(key));
}

export function normalizePath(input: string): string {
  let path = input.replace(/\/+$/, "") || "/";
  if (/^\/learn\/[a-z]\d+$/i.test(path)) path = `/learn/${path.split("/")[2].toUpperCase()}`;
  return path;
}

export function safeJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
