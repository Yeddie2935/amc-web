import { useEffect } from "react";
import { applyPageMetadata } from "../seo/metadata";
import type { PageData } from "../seo/types";

export function usePageMeta(page: PageData) {
  useEffect(() => {
    const update = () => applyPageMetadata(page);
    update();
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, [page]);
}
