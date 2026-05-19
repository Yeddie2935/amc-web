import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";
import { Card } from "../components/common/Card";

export function LicensePage() {
  return (
    <>
      <SiteHeader currentPage="license" />

      <main className="fmj-page fmj-readable-page">
        <section className="fmj-page-heading">
          <p className="fmj-eyebrow">Attribution & License</p>
          <h1>How AMC materials are used on this site.</h1>
          <p>
            Mathinking is a non-commercial educational website. AMC problem
            content is attributed to the Mathematical Association of America.
          </p>
        </section>

        <Card>
          <h2>AMC problem attribution</h2>
          <p>
            AMC problems are created by the Mathematical Association of
            America&apos;s American Mathematics Competitions. MAA has stated
            that its competition questions are available under a Creative
            Commons Attribution-NonCommercial-ShareAlike license.
          </p>
          <p>
            This site uses AMC problem content for non-commercial educational
            purposes, with attribution. This website is not affiliated with or
            endorsed by the Mathematical Association of America.
          </p>
        </Card>

        <Card>
          <h2>Recommended citation format</h2>
          <p>
            Source: Mathematical Association of America, American Mathematics
            Competitions, AMC 8 [Year], Problem [#]. Licensed under CC BY-NC-SA.
            Used for non-commercial educational purposes.
          </p>
        </Card>

        <Card>
          <h2>Original content</h2>
          <p>
            Explanations, difficulty labels, categorization, interface design,
            and animation storyboards are created separately for Mathinking
            unless otherwise noted.
          </p>
        </Card>
      </main>

      <SiteFooter />
    </>
  );
}
