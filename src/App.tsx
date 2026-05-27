import { Analytics } from "@vercel/analytics/react";
import { HomePage } from "./pages/HomePage";
import { LearnPage } from "./pages/LearnPage";
import { PracticePage } from "./pages/PracticePage";
import { ArchivePage } from "./pages/ArchivePage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProblemBankPage } from "./pages/ProblemBankPage";
import { LicensePage } from "./pages/LicensePage";
import { TipsPage } from "./pages/TipsPage";
import "./styles/amcComponents.css";
import "./styles/amcDiagramPatch.css";
import "./styles/fmjAnimations.css";
import "./styles/fmjScalablePlatform.css";
import "./styles/fmjAnimationFix.css";

function App() {
  const path = window.location.pathname;

  let page;
  if (path.startsWith("/learn")) page = <LearnPage />;
  else if (path.startsWith("/practice")) page = <PracticePage />;
  else if (path.startsWith("/archive")) page = <ArchivePage />;
  else if (path.startsWith("/dashboard")) page = <DashboardPage />;
  else if (path.startsWith("/problems")) page = <ProblemBankPage />;
  else if (path.startsWith("/license")) page = <LicensePage />;
  else if (path.startsWith("/tips")) page = <TipsPage />;
  else page = <HomePage />;

  return (
    <>
      {page}
      <Analytics />
    </>
  );
}

export default App;
