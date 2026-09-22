import { renderToString } from "react-dom/server";
import App from "./App";
import type { PageData } from "./seo/types";
export { createCatalog, getInteractionData, notFoundPage } from "./seo/catalog.server";
export { structuredData } from "./seo/metadata";
export { SITE, safeJson, FUNCTIONAL_QUERIES } from "./seo/site";
export function renderPage(page: PageData) { return renderToString(<App page={page} />); }
