import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import type { PageData } from "./seo/types";

async function start() {
  const root = document.getElementById("root")!;
  const embedded = document.getElementById("page-data");
  if (embedded) {
    const page = JSON.parse(embedded.textContent!) as PageData;
    hydrateRoot(root, <React.StrictMode><App page={page} /></React.StrictMode>);
    return;
  }
  if (import.meta.env.DEV) {
    const response = await fetch(`/__seo/page?path=${encodeURIComponent(location.pathname)}`);
    const page = await response.json() as PageData;
    createRoot(root).render(<React.StrictMode><App page={page} /></React.StrictMode>);
  } else {
    console.error("Missing page data; leaving static HTML intact.");
  }
}
start().catch(error => console.error("Unable to activate page", error));
