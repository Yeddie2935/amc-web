import fs from "node:fs/promises";
import { spawn } from "node:child_process";

if (process.env.SEO_QA_BASE_URL) throw new Error("Preview isolation QA must use the local generated build; unset SEO_QA_BASE_URL.");

function run(script, environment) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script], {
      stdio: "inherit",
      env: { ...process.env, VERCEL_ENV: environment },
    });
    child.once("error", reject);
    child.once("exit", code => code === 0 ? resolve() : reject(new Error(`${script} exited ${code}`)));
  });
}

let previewResults;
try {
  await run("tools/build-site.mjs", "preview");
  await run("tools/qa-seo.mjs", "preview");
  previewResults = await fs.readFile(".seo-build/qa-results.json", "utf8");
} finally {
  // A failed preview check must not leave a noindex artifact ready for release.
  await run("tools/build-site.mjs", "production");
}
await run("tools/qa-seo.mjs", "production");
await fs.writeFile(".seo-build/qa-preview-results.json", previewResults);
console.log("Preview isolation passed; production output restored and verified.");
