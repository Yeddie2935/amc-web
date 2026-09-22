import { Analytics } from "@vercel/analytics/react";
import { HomePage } from "./pages/HomePage";
import { LearnPage } from "./pages/LearnPage";
import { TipsPage } from "./pages/TipsPage";
import { LicensePage } from "./pages/LicensePage";
import { PublicContentPage } from "./pages/PublicContentPage";
import { usePageMeta } from "./hooks/usePageMeta";
import type { PageData } from "./seo/types";
import "./styles/amcComponents.css";
import "./styles/amcDiagramPatch.css";
import "./styles/fmjAnimations.css";
import "./styles/fmjScalablePlatform.css";
import "./styles/fmjAnimationFix.css";
import "./styles/seoPages.css";

export default function App({ page }: { page: PageData }) {
  usePageMeta(page);
  const content = page.kind === "home" ? <HomePage problemCount={page.problemCount!} />
    : page.kind === "learn" ? <LearnPage />
    : page.kind === "tips" ? <TipsPage />
    : page.kind === "license" ? <LicensePage />
    : <PublicContentPage page={page} />;
  return <>{content}<Analytics /></>;
}
