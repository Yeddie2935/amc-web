#!/usr/bin/env node

import { spawn } from "node:child_process";
import { once } from "node:events";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { findBankProblem, findRepoRoot } from "../.agents/skills/mathinking-lesson/scripts/lesson_context.mjs";

const pause = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

function fail(message) {
  throw new Error(message);
}

function parseArguments(argv) {
  const lessonId = String(argv[0] ?? "").trim().toUpperCase();
  const screenshots = argv.includes("--screenshots");
  if (!/^[A-Z][0-9]+$/.test(lessonId) || argv.some((arg, index) => index > 0 && arg !== "--screenshots")) {
    fail("Usage: npm run qa:lesson -- <LESSON_ID> [--screenshots]");
  }
  return { lessonId, screenshots };
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function findLesson(repoRoot, lessonId) {
  const root = path.join(repoRoot, "src", "data", "lessons");
  const directories = fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "generated-problems");
  for (const directory of directories) {
    const file = path.join(root, directory.name, `${lessonId}.json`);
    if (fs.existsSync(file)) return { file, lesson: readJson(file) };
  }
  fail(`No authored lesson was found for ${lessonId}.`);
}

function problemData(repoRoot, lessonId, lesson) {
  const generatedPath = path.join(
    repoRoot,
    "src",
    "data",
    "lessons",
    "generated-problems",
    `${lessonId}.json`
  );
  const generated = fs.existsSync(generatedPath) ? readJson(generatedPath) : [];
  const generatedById = new Map(
    generated.map((artifact) => [artifact.problem.id, artifact.problem])
  );
  return new Map(
    lesson.beats
      .filter((beat) => beat.kind === "problem")
      .map((beat) => [
        beat.id,
        beat.source === "generated"
          ? generatedById.get(beat.problemId)
          : findBankProblem(repoRoot, beat.problemId),
      ])
  );
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
  });
}

async function waitForUrl(url, label, timeout = 20_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await pause(100);
  }
  fail(`Timed out waiting for ${label} at ${url}.`);
}

function executableOnPath(name) {
  for (const directory of (process.env.PATH ?? "").split(path.delimiter)) {
    const candidate = path.join(directory, name);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function chromeExecutable() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    executableOnPath("google-chrome"),
    executableOnPath("google-chrome-stable"),
    executableOnPath("chromium"),
    executableOnPath("chromium-browser"),
  ].filter(Boolean);
  const executable = candidates.find((candidate) => fs.existsSync(candidate));
  if (!executable) {
    fail("Chrome/Chromium was not found. Set CHROME_PATH to its executable.");
  }
  return executable;
}

async function startServer(repoRoot) {
  if (process.env.LESSON_QA_BASE_URL) {
    const url = process.env.LESSON_QA_BASE_URL.replace(/\/$/, "");
    await waitForUrl(url, "the configured lesson server");
    return { url, process: null };
  }
  const port = await freePort();
  const vite = path.join(repoRoot, "node_modules", "vite", "bin", "vite.js");
  if (!fs.existsSync(vite)) fail("Vite is not installed; run npm install first.");
  const child = spawn(
    process.execPath,
    [vite, "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    { cwd: repoRoot, stdio: "ignore" }
  );
  const url = `http://127.0.0.1:${port}`;
  try {
    await waitForUrl(url, "the lesson server");
  } catch (error) {
    child.kill("SIGTERM");
    throw error;
  }
  return { url, process: child };
}

async function startChrome() {
  if (process.env.LESSON_QA_CDP_URL) {
    const url = process.env.LESSON_QA_CDP_URL.replace(/\/$/, "");
    await waitForUrl(`${url}/json/version`, "the configured Chrome debugger");
    return { url, process: null, profile: null };
  }
  const port = await freePort();
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "lesson-qa-chrome-"));
  const child = spawn(
    chromeExecutable(),
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-background-networking",
      "--disable-default-apps",
      "--disable-extensions",
      "--disable-sync",
      "--metrics-recording-only",
      "--mute-audio",
      "--no-first-run",
      "--no-default-browser-check",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      "about:blank",
    ],
    { stdio: "ignore" }
  );
  const url = `http://127.0.0.1:${port}`;
  try {
    await waitForUrl(`${url}/json/version`, "Chrome DevTools");
  } catch (error) {
    child.kill("SIGTERM");
    throw error;
  }
  return { url, process: child, profile };
}

class CdpPage {
  constructor(socket, targetId) {
    this.socket = socket;
    this.targetId = targetId;
    this.nextId = 0;
    this.pending = new Map();
    this.errors = [];
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const request = this.pending.get(message.id);
        if (!request) return;
        this.pending.delete(message.id);
        if (message.error) request.reject(new Error(message.error.message));
        else request.resolve(message.result);
        return;
      }
      if (message.method === "Runtime.exceptionThrown") {
        this.errors.push(message.params.exceptionDetails.text ?? "Uncaught exception");
      }
      if (
        message.method === "Runtime.consoleAPICalled" &&
        message.params.type === "error"
      ) {
        this.errors.push(
          message.params.args.map((argument) => argument.value ?? argument.description).join(" ")
        );
      }
      if (
        message.method === "Log.entryAdded" &&
        message.params.entry.level === "error" &&
        message.params.entry.source !== "network"
      ) this.errors.push(message.params.entry.text);
    });
  }

  send(method, params = {}) {
    const id = ++this.nextId;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  async evaluate(expression) {
    const result = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) fail(result.exceptionDetails.text);
    return result.result.value;
  }
}

async function openPage(cdpUrl) {
  const response = await fetch(`${cdpUrl}/json/new?about%3Ablank`, { method: "PUT" });
  if (!response.ok) fail(`Chrome target creation failed (${response.status}).`);
  const target = await response.json();
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  const page = new CdpPage(socket, target.id);
  await Promise.all([
    page.send("Runtime.enable"),
    page.send("Page.enable"),
    page.send("Log.enable"),
  ]);
  return page;
}

async function waitFor(page, expression, label, timeout = 8_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await page.evaluate(expression)) return;
    await pause(40);
  }
  fail(`Timed out waiting for ${label}.`);
}

async function click(page, selector, index = 0) {
  const result = await page.evaluate(`(() => {
    const active = document.querySelector('[aria-current="step"]');
    const nodes = active ? [...active.querySelectorAll(${JSON.stringify(selector)})] : [];
    const node = nodes[${index}];
    if (!node) return { ok: false, count: nodes.length };
    if (node.disabled) return { ok: false, disabled: true, text: node.textContent.trim() };
    node.click();
    return { ok: true, text: node.textContent.trim() };
  })()`);
  if (!result.ok) fail(`Could not click ${selector}[${index}]: ${JSON.stringify(result)}`);
  await pause(50);
}

async function fill(page, selector, value) {
  const result = await page.evaluate(`(() => {
    const active = document.querySelector('[aria-current="step"]');
    const node = active?.querySelector(${JSON.stringify(selector)});
    if (!node) return false;
    const prototype = node instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(prototype, 'value').set.call(node, ${JSON.stringify(String(value))});
    node.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  })()`);
  if (!result) fail(`Could not fill ${selector}.`);
  await pause(30);
}

async function snapshot(page) {
  return page.evaluate(`(() => {
    const active = document.querySelector('[aria-current="step"]');
    if (!active) return null;
    active.scrollIntoView({ block: 'start' });
    const textSizes = [...active.querySelectorAll('p, button, li, code, text, input, textarea')]
      .map((node) => parseFloat(getComputedStyle(node).fontSize)).filter(Number.isFinite);
    return {
      id: active.dataset.beatId,
      kind: active.dataset.beatKind,
      advanceDisabled: Boolean(active.querySelector('.fmj-lesson-advance button:disabled')),
      resolutionVisible: Boolean(active.querySelector('.fmj-lesson-resolution')),
      correct: Boolean(active.querySelector('.fmj-lesson-feedback.correct')),
      incorrect: Boolean(active.querySelector('.fmj-lesson-feedback.incorrect')),
      fallbacks: [...document.querySelectorAll('.fmj-lesson-fallback')]
        .filter((node) => getComputedStyle(node).display !== 'none')
        .map((node) => node.textContent.trim()),
      documentOverflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
      minTextSize: textSizes.length ? Math.min(...textSizes) : null,
      animationStep: active.querySelector('.fmj-fixed-stage')?.dataset.step ?? null,
      animationControls: [...active.querySelectorAll('.fmj-lesson-animation-controls button')]
        .map((node) => ({ text: node.textContent.trim(), disabled: node.disabled })),
      fullAnimationControls: active.querySelectorAll('.fmj-animation-controls').length,
    };
  })()`);
}

async function assertBaseState(state, beat, viewport) {
  if (!state || state.id !== beat.id) {
    fail(`${viewport}: expected active beat ${beat.id}, found ${state?.id ?? "none"}.`);
  }
  if (state.fallbacks.length) fail(`${beat.id}: rendered fallback: ${state.fallbacks.join(" | ")}`);
  if (state.documentOverflow > 1) {
    fail(`${viewport}/${beat.id}: page is ${state.documentOverflow}px wider than the viewport.`);
  }
  if (state.minTextSize !== null && state.minTextSize < 9) {
    fail(`${viewport}/${beat.id}: text rendered below 9px (${state.minTextSize}px).`);
  }
  if (state.fullAnimationControls) {
    fail(`${beat.id}: full animation-player controls appeared inside the lesson.`);
  }
}

function requiresResolution(beat) {
  return (
    beat.kind === "interaction" ||
    beat.kind === "problem" ||
    (beat.kind === "reflection" && Boolean(beat.takeaway))
  );
}

async function submitInteraction(page, beat, tryIncorrect) {
  const response = beat.response;
  if (response.kind === "none") {
    await click(page, ".fmj-lesson-response-actions button");
    return false;
  }
  if (response.kind === "free-response") {
    await fill(page, "textarea", "I compared the structure and checked the cases.");
    await click(page, ".fmj-lesson-response-actions button");
    return false;
  }
  if (response.kind === "match") {
    fail(`${beat.id}: match responses are not supported by the current renderer.`);
  }

  let exercised = false;
  if (tryIncorrect && beat.allowRetry) {
    if (response.kind === "single-choice") {
      const wrong = response.options.findIndex((option) => option.id !== response.correctId);
      if (wrong >= 0) {
        await click(page, ".fmj-lesson-choice-buttons button", wrong);
        await click(page, ".fmj-lesson-response-actions button");
        exercised = true;
      }
    } else if (response.kind === "multi-select") {
      const wrong = response.options.findIndex(
        (option) => !response.correctIds.includes(option.id)
      );
      const index = wrong >= 0 ? wrong : 0;
      if (response.options.length > 1 || wrong >= 0) {
        await click(page, ".fmj-lesson-choice-buttons button", index);
        await click(page, ".fmj-lesson-response-actions button");
        exercised = true;
      }
    } else if (response.kind === "numeric") {
      await fill(page, "input", response.answer + Math.max(1, (response.tolerance ?? 0) + 1));
      await click(page, ".fmj-lesson-response-actions button");
      exercised = true;
    } else if (response.kind === "sort" && response.buckets.length > 1) {
      for (let item = 0; item < response.items.length; item += 1) {
        const correctBucket = response.correctBucketByItem[response.items[item].id];
        const wrongBucket = response.buckets.findIndex((bucket) => bucket.id !== correctBucket);
        await click(page, `.fmj-lesson-sort-item:nth-of-type(${item + 1}) button`, wrongBucket);
      }
      await click(page, ".fmj-lesson-response-actions button");
      exercised = true;
    }
    if (exercised) {
      const state = await snapshot(page);
      if (!state.incorrect || !state.advanceDisabled || state.resolutionVisible) {
        fail(`${beat.id}: incorrect retry did not stay blocked with its resolution hidden.`);
      }
    }
  }

  if (response.kind === "single-choice") {
    const index = response.options.findIndex((option) => option.id === response.correctId);
    await click(page, ".fmj-lesson-choice-buttons button", index);
    await click(page, ".fmj-lesson-response-actions button");
  } else if (response.kind === "multi-select") {
    const selected = await page.evaluate(`(() => [...document.querySelector('[aria-current="step"]').querySelectorAll('.fmj-lesson-choice-buttons button')].map((button) => button.getAttribute('aria-pressed') === 'true'))()`);
    for (let index = 0; index < response.options.length; index += 1) {
      const shouldSelect = response.correctIds.includes(response.options[index].id);
      if (selected[index] !== shouldSelect) {
        await click(page, ".fmj-lesson-choice-buttons button", index);
      }
    }
    await click(page, ".fmj-lesson-response-actions button");
  } else if (response.kind === "numeric") {
    await fill(page, "input", response.answer);
    await click(page, ".fmj-lesson-response-actions button");
  } else if (response.kind === "sort") {
    for (let item = 0; item < response.items.length; item += 1) {
      const bucketId = response.correctBucketByItem[response.items[item].id];
      const bucket = response.buckets.findIndex((candidate) => candidate.id === bucketId);
      await click(page, `.fmj-lesson-sort-item:nth-of-type(${item + 1}) button`, bucket);
    }
    await click(page, ".fmj-lesson-response-actions button");
  }
  return exercised;
}

async function submitProblem(page, beat, problem, tryIncorrect) {
  if (!problem) fail(`${beat.id}: could not load problem ${beat.problemId}.`);
  const accepted = [problem.answer, problem.shortAnswer]
    .filter(Boolean)
    .map((answer) => String(answer).trim().toLowerCase());
  let exercised = false;
  if (tryIncorrect && beat.role === "transfer") {
    if (problem.choices?.length) {
      const wrong = problem.choices.findIndex(
        (choice) => !accepted.includes(String(choice.label).trim().toLowerCase())
      );
      if (wrong >= 0) {
        await click(page, ".fmj-answer-buttons button", wrong);
        await click(page, ".fmj-lesson-response-actions button");
        exercised = true;
      }
    } else {
      await fill(page, ".fmj-lesson-problem-answer input", "definitely-wrong");
      await click(page, ".fmj-lesson-response-actions button");
      exercised = true;
    }
    if (exercised) {
      const state = await snapshot(page);
      if (!state.incorrect || !state.advanceDisabled || state.resolutionVisible) {
        fail(`${beat.id}: transfer retry did not stay blocked with its resolution hidden.`);
      }
    }
  }
  if (problem.choices?.length) {
    const correct = problem.choices.findIndex((choice) =>
      accepted.includes(String(choice.label).trim().toLowerCase())
    );
    if (correct < 0) fail(`${beat.id}: answer ${problem.answer} is not a rendered choice.`);
    await click(page, ".fmj-answer-buttons button", correct);
  } else {
    await fill(page, ".fmj-lesson-problem-answer input", problem.answer ?? problem.shortAnswer);
  }
  await click(page, ".fmj-lesson-response-actions button");
  return exercised;
}

function explanationStepCount(problem) {
  if (problem.solutionSteps?.length) return problem.solutionSteps.length;
  if (problem.animationFrames?.length) return problem.animationFrames.length;
  return 3;
}

async function testAnimation(page, beat, problem) {
  if (beat.animation.mode === "none") return 0;
  const expected = beat.animation.mode === "slice"
    ? beat.animation.stepIndices
    : Array.from({ length: explanationStepCount(problem) }, (_, index) => index);
  if (!expected?.length) fail(`${beat.id}: animation declares no usable steps.`);
  let state = await snapshot(page);
  if (String(state.animationStep) !== String(expected[0])) {
    fail(`${beat.id}: expected animation step ${expected[0]}, found ${state.animationStep}.`);
  }
  await pause(350);
  const unchanged = await snapshot(page);
  if (unchanged.animationStep !== state.animationStep) fail(`${beat.id}: animation autoplayed.`);
  for (const step of expected.slice(1)) {
    await click(page, ".fmj-lesson-animation-controls button:last-of-type");
    state = await snapshot(page);
    if (String(state.animationStep) !== String(step)) {
      fail(`${beat.id}: animation left its declared timeline at step ${state.animationStep}.`);
    }
  }
  if (expected.length > 1) {
    const next = state.animationControls.find((control) => control.text === "Next visual");
    if (!next?.disabled) fail(`${beat.id}: final Next visual control is not disabled.`);
  }
  return 1;
}

async function capture(page, directory, name) {
  const result = await page.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  fs.writeFileSync(path.join(directory, `${name}.png`), Buffer.from(result.data, "base64"));
}

async function runViewport({ page, baseUrl, lesson, problems, viewport, screenshots }) {
  await page.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile,
  });
  page.errors.length = 0;
  await page.send("Page.navigate", {
    url: `${baseUrl}/learn/${encodeURIComponent(lesson.lessonId)}`,
  });
  await waitFor(
    page,
    `Boolean(document.querySelector('[aria-current="step"]'))`,
    `${viewport.name} lesson render`
  );
  const heading = await page.evaluate(
    `document.querySelector('.fmj-lesson-heading h2')?.textContent ?? ''`
  );
  if (heading.trim() !== lesson.title) {
    fail(`${viewport.name}: expected title ${lesson.title}, found ${heading}.`);
  }
  if (screenshots) await capture(page, screenshots, `${viewport.name}-start`);

  let retryExercised = false;
  let animations = 0;
  for (let index = 0; index < lesson.beats.length; index += 1) {
    const beat = lesson.beats[index];
    let state = await snapshot(page);
    await assertBaseState(state, beat, viewport.name);
    if (requiresResolution(beat)) {
      if (!state.advanceDisabled) fail(`${beat.id}: progression was not initially gated.`);
      if (beat.resolution && state.resolutionVisible) {
        fail(`${beat.id}: worked resolution was visible before a response.`);
      }
    } else if (state.advanceDisabled) {
      fail(`${beat.id}: non-interactive beat unexpectedly blocked progression.`);
    }

    const tryIncorrect = viewport.name === "desktop" && !retryExercised;
    if (beat.kind === "interaction") {
      retryExercised =
        (await submitInteraction(page, beat, tryIncorrect)) || retryExercised;
    } else if (beat.kind === "problem") {
      const problem = problems.get(beat.id);
      retryExercised =
        (await submitProblem(page, beat, problem, tryIncorrect)) || retryExercised;
      animations += await testAnimation(page, beat, problem);
    } else if (beat.kind === "reflection" && beat.takeaway) {
      await click(page, ".fmj-lesson-reflection button");
    }

    state = await snapshot(page);
    await assertBaseState(state, beat, viewport.name);
    if (requiresResolution(beat) && state.advanceDisabled) {
      fail(`${beat.id}: correct response/reveal did not unlock progression.`);
    }
    if (beat.resolution && !state.resolutionVisible) {
      fail(`${beat.id}: worked resolution did not appear after resolution.`);
    }
    await click(page, ".fmj-lesson-advance button");
  }

  await waitFor(page, `document.body.textContent.includes('Lesson complete')`, "lesson completion");
  const finalOverflow = await page.evaluate(
    `Math.max(0, document.documentElement.scrollWidth - innerWidth)`
  );
  if (finalOverflow > 1) fail(`${viewport.name}: completed page has ${finalOverflow}px overflow.`);
  if (screenshots) await capture(page, screenshots, `${viewport.name}-complete`);
  if (page.errors.length) {
    fail(`${viewport.name}: browser errors: ${[...new Set(page.errors)].join(" | ")}`);
  }
  return {
    beats: lesson.beats.length,
    animations,
    retryPath: retryExercised,
    overflow: finalOverflow,
    errors: 0,
  };
}

const owned = { server: null, chrome: null, page: null };

async function stopChild(child) {
  if (!child || child.exitCode !== null || child.signalCode) return;
  child.kill("SIGTERM");
  await Promise.race([once(child, "exit"), pause(2_000)]);
  if (child.exitCode === null && !child.signalCode) {
    child.kill("SIGKILL");
    await Promise.race([once(child, "exit"), pause(1_000)]);
  }
}

async function cleanup() {
  if (owned.page) {
    try {
      await fetch(`${owned.chrome.url}/json/close/${owned.page.targetId}`);
      owned.page.socket.close();
    } catch {}
  }
  await stopChild(owned.chrome?.process);
  await stopChild(owned.server?.process);
  if (owned.chrome?.profile && fs.existsSync(owned.chrome.profile)) {
    fs.rmSync(owned.chrome.profile, { recursive: true, force: true });
  }
}

async function main() {
  const started = Date.now();
  const { lessonId, screenshots: wantsScreenshots } = parseArguments(process.argv.slice(2));
  const repoRoot = findRepoRoot(process.cwd());
  const { lesson } = findLesson(repoRoot, lessonId);
  const problems = problemData(repoRoot, lessonId, lesson);
  const screenshots = wantsScreenshots
    ? fs.mkdtempSync(path.join(os.tmpdir(), `${lessonId.toLowerCase()}-lesson-qa-`))
    : null;

  owned.server = await startServer(repoRoot);
  owned.chrome = await startChrome();
  owned.page = await openPage(owned.chrome.url);
  const desktop = await runViewport({
    page: owned.page,
    baseUrl: owned.server.url,
    lesson,
    problems,
    viewport: { name: "desktop", width: 1280, height: 900, mobile: false },
    screenshots,
  });
  const mobile = await runViewport({
    page: owned.page,
    baseUrl: owned.server.url,
    lesson,
    problems,
    viewport: { name: "mobile", width: 390, height: 844, mobile: true },
    screenshots,
  });
  if (!desktop.retryPath) {
    const retryWasPossible = lesson.beats.some(
      (beat) =>
        (beat.kind === "interaction" && beat.allowRetry && !["none", "free-response", "match"].includes(beat.response.kind)) ||
        (beat.kind === "problem" && beat.role === "transfer")
    );
    if (retryWasPossible) fail("No applicable incorrect/retry path was exercised.");
  }

  console.log(`Lesson QA passed: ${lessonId}`);
  console.log(
    `desktop ${desktop.beats}/${lesson.beats.length} beats | mobile ${mobile.beats}/${lesson.beats.length} beats | animations ${desktop.animations} | retry ${desktop.retryPath ? "verified" : "not applicable"} | console errors 0 | overflow 0`
  );
  if (screenshots) console.log(`screenshots ${screenshots}`);
  console.log(`duration ${((Date.now() - started) / 1000).toFixed(1)}s`);
}

try {
  await main();
} catch (error) {
  console.error(`Lesson QA failed: ${error.message}`);
  if (process.env.LESSON_QA_DEBUG) console.error(error.stack);
  process.exitCode = 1;
} finally {
  await cleanup();
}
