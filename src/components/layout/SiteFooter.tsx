export function SiteFooter() {
  return (
    <footer className="fmj-site-footer">
      <div>
        <strong>Fun Math Journey</strong>
        <p>Free competition math practice for individual students.</p>
      </div>

      <div className="fmj-footer-links">
        <a href="/license">Attribution & License</a>
        <a href="https://maa.org/math-competitions/" target="_blank" rel="noreferrer">
          MAA Competitions
        </a>
      </div>

      <p className="fmj-footer-disclaimer">
        AMC problem content belongs to the Mathematical Association of America
        and is used under CC BY-NC-SA for non-commercial educational purposes.
        This site is not affiliated with or endorsed by MAA.
      </p>
    </footer>
  );
}
