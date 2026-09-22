import assert from "node:assert/strict";
import fs from "node:fs/promises";

export async function checkHomeEquation(page) {
  const measurements = [];
  for (const width of [320, 375, 390, 620, 768, 1024, 1041, 1280, 1440]) {
    await page.send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
    await page.goto("/", "document.querySelector('.fmj-home-big-equation')");
    const measurement = await page.eval(`(() => {
      const card = document.querySelector('.fmj-home-preview-c5');
      const equation = card.querySelector('.fmj-home-big-equation');
      card.scrollIntoView({block:'center'});
      const box = equation.getBoundingClientRect();
      const style = getComputedStyle(equation);
      const left = box.left + parseFloat(style.paddingLeft);
      const right = box.right - parseFloat(style.paddingRight);
      return {
        viewport: innerWidth,
        fontSize: parseFloat(style.fontSize),
        equationWidth: box.width,
        contentFits: [...equation.children].every(child => {const r=child.getBoundingClientRect();return r.left>=left-1 && r.right<=right+1 && child.scrollWidth<=child.clientWidth+1;}),
        documentFits: document.documentElement.scrollWidth <= innerWidth + 1,
        text: equation.textContent,
      };
    })()`);
    measurements.push(measurement);
    if ([390, 1041, 1440].includes(width)) {
      const shot = await page.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
      await fs.writeFile(`.seo-build/home-equation-${width}.png`, Buffer.from(shot.data, "base64"));
    }
  }
  await fs.writeFile(".seo-build/home-equation-measurements.json", JSON.stringify(measurements, null, 2));
  console.table(measurements);
  for (const m of measurements) {
    assert(m.contentFits && m.documentFits, `Homepage equation overflows at ${m.viewport}px`);
    assert(m.fontSize <= 44.1, `Homepage equation is oversized at ${m.viewport}px: ${m.fontSize}px`);
    assert.equal(m.text, "900−729=171");
  }
}
