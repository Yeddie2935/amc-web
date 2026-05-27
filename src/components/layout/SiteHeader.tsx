interface SiteHeaderProps {
  currentPage?: "home" | "learn" | "practice" | "archive" | "dashboard" | "problems" | "license" | "tips";
}

export function SiteHeader({ currentPage = "home" }: SiteHeaderProps) {
  return (
    <header className="fmj-site-header">
      <a className="fmj-logo" href="/">
        <span className="fmj-logo-mark">∑</span>
        <span>
          <strong>Math Thinking</strong>
          <small>AMC 8 from the ground up</small>
        </span>
      </a>

      <nav className="fmj-nav" aria-label="Main navigation">
        <a className={currentPage === "learn" ? "active" : ""} href="/learn">
          Learn
        </a>
        <a className={currentPage === "practice" ? "active" : ""} href="/practice">
          Practice
        </a>
        <a className={currentPage === "archive" ? "active" : ""} href="/archive">
          AMC Archive
        </a>
        <a className={currentPage === "dashboard" ? "active" : ""} href="/dashboard">
          Dashboard
        </a>
        <a className={currentPage === "tips" ? "active" : ""} href="/tips">
          Study Tips
        </a>
        <a className={currentPage === "license" ? "active" : ""} href="/license">
          Attribution
        </a>
      </nav>
    </header>
  );
}
