import { HomePage } from "./pages/HomePage";
import { LearnPage } from "./pages/LearnPage";
import { PracticePage } from "./pages/PracticePage";
import { ArchivePage } from "./pages/ArchivePage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProblemBankPage } from "./pages/ProblemBankPage";
import { LicensePage } from "./pages/LicensePage";
import "./styles/amcComponents.css";
import "./styles/amcDiagramPatch.css";
import "./styles/fmjAnimations.css";
import "./styles/fmjScalablePlatform.css";
import "./styles/fmjAnimationFix.css";

function App() {
  const path = window.location.pathname;

  if (path.startsWith("/learn")) return <LearnPage />;
  if (path.startsWith("/practice")) return <PracticePage />;
  if (path.startsWith("/archive")) return <ArchivePage />;
  if (path.startsWith("/dashboard")) return <DashboardPage />;
  if (path.startsWith("/problems")) return <ProblemBankPage />;
  if (path.startsWith("/license")) return <LicensePage />;

  return <HomePage />;
}

export default App;
