import { problems } from "../data/problems.sample.js";

const difficultyLabels = {
  1: "Level 1 · Foundations",
  2: "Level 2 · Builder",
  3: "Level 3 · Core AMC 8",
  4: "Level 4 · Challenge",
  5: "Level 5 · Olympiad-lite"
};

const categoryInfo = {
  "Algebra": {
    icon: "x",
    description: "Variables, equations, ratios, averages, and systems."
  },
  "Geometry": {
    icon: "△",
    description: "Angles, area, perimeter, shapes, and visual reasoning."
  },
  "Number Theory": {
    icon: "#",
    description: "Factors, divisibility, primes, remainders, and modular thinking."
  },
  "Counting & Probability": {
    icon: "⊕",
    description: "Counting cases, combinations, probability, and organized lists."
  }
};

const state = {
  selectedProblem: null,
  selectedChoice: null,
  solved: new Set(JSON.parse(localStorage.getItem("fmj_solved") || "[]")),
  attempts: JSON.parse(localStorage.getItem("fmj_attempts") || "{}"),
  filters: {
    search: "",
    category: "all",
    difficulty: "all",
    status: "all"
  },
  animation: {
    frame: 0,
    timer: null,
    playing: false
  }
};

const els = {
  laneGrid: document.querySelector("#laneGrid"),
  problemList: document.querySelector("#problemList"),
  categoryFilter: document.querySelector("#categoryFilter"),
  difficultyFilter: document.querySelector("#difficultyFilter"),
  statusFilter: document.querySelector("#statusFilter"),
  searchInput: document.querySelector("#searchInput"),
  problemDialog: document.querySelector("#problemDialog"),
  closeDialogButton: document.querySelector("#closeDialogButton"),
  dialogMeta: document.querySelector("#dialogMeta"),
  dialogTitle: document.querySelector("#dialogTitle"),
  dialogQuestion: document.querySelector("#dialogQuestion"),
  dialogChoices: document.querySelector("#dialogChoices"),
  checkAnswerButton: document.querySelector("#checkAnswerButton"),
  showExplanationButton: document.querySelector("#showExplanationButton"),
  feedbackText: document.querySelector("#feedbackText"),
  explanationPanel: document.querySelector("#explanationPanel"),
  solutionIdea: document.querySelector("#solutionIdea"),
  solutionSteps: document.querySelector("#solutionSteps"),
  animationStage: document.querySelector("#animationStage"),
  animationCaption: document.querySelector("#animationCaption"),
  animationStepLabel: document.querySelector("#animationStepLabel"),
  animationDots: document.querySelector("#animationDots"),
  animationFrames: document.querySelector("#animationFrames"),
  prevAnimationButton: document.querySelector("#prevAnimationButton"),
  playAnimationButton: document.querySelector("#playAnimationButton"),
  nextAnimationButton: document.querySelector("#nextAnimationButton"),
  progressRing: document.querySelector("#progressRing"),
  progressPercent: document.querySelector("#progressPercent"),
  solvedCount: document.querySelector("#solvedCount"),
  totalCount: document.querySelector("#totalCount"),
  streakCount: document.querySelector("#streakCount"),
  bestCategory: document.querySelector("#bestCategory"),
  resetProgressButton: document.querySelector("#resetProgressButton")
};

function init() {
  renderFilterOptions();
  renderLanes();
  renderProblems();
  updateStats();
  bindEvents();
}

function bindEvents() {
  els.searchInput.addEventListener("input", (event) => {
    state.filters.search = event.target.value.trim().toLowerCase();
    renderProblems();
  });

  els.categoryFilter.addEventListener("change", (event) => {
    state.filters.category = event.target.value;
    renderProblems();
  });

  els.difficultyFilter.addEventListener("change", (event) => {
    state.filters.difficulty = event.target.value;
    renderProblems();
  });

  els.statusFilter.addEventListener("change", (event) => {
    state.filters.status = event.target.value;
    renderProblems();
  });

  els.closeDialogButton.addEventListener("click", () => els.problemDialog.close());
  els.problemDialog.addEventListener("close", resetDialogState);
  els.checkAnswerButton.addEventListener("click", checkAnswer);
  els.showExplanationButton.addEventListener("click", () => showExplanation(true));

  els.prevAnimationButton.addEventListener("click", () => moveAnimationFrame(-1));
  els.playAnimationButton.addEventListener("click", toggleAnimationPlayback);
  els.nextAnimationButton.addEventListener("click", () => moveAnimationFrame(1));

  els.resetProgressButton.addEventListener("click", () => {
    const shouldReset = confirm("Reset your local solved progress and attempts?");
    if (!shouldReset) return;
    state.solved.clear();
    state.attempts = {};
    persistProgress();
    updateStats();
    renderProblems();
    renderLanes();
  });
}

function renderFilterOptions() {
  const categories = ["all", ...new Set(problems.map((problem) => problem.category))];
  els.categoryFilter.innerHTML = categories
    .map((category) => `<option value="${escapeHtml(category)}">${category === "all" ? "All" : escapeHtml(category)}</option>`)
    .join("");

  els.difficultyFilter.innerHTML = ["all", "1", "2", "3", "4", "5"]
    .map((level) => `<option value="${level}">${level === "all" ? "All" : difficultyLabels[level]}</option>`)
    .join("");
}

function renderLanes() {
  const categories = Object.keys(categoryInfo);
  els.laneGrid.innerHTML = categories.map((category) => {
    const count = problems.filter((problem) => problem.category === category).length;
    const solvedCount = problems.filter((problem) => problem.category === category && state.solved.has(problem.id)).length;
    const info = categoryInfo[category];
    return `
      <article class="lane-card">
        <div class="lane-icon">${info.icon}</div>
        <h3>${escapeHtml(category)}</h3>
        <p>${escapeHtml(info.description)}</p>
        <div class="problem-meta">
          <span>${count} problems loaded</span>
          <strong>${solvedCount}/${count} solved</strong>
        </div>
        <button class="secondary-button" type="button" data-lane="${escapeHtml(category)}">Practice this lane</button>
      </article>
    `;
  }).join("");

  els.laneGrid.querySelectorAll("[data-lane]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filters.category = button.dataset.lane;
      els.categoryFilter.value = button.dataset.lane;
      document.querySelector("#problemBrowser").scrollIntoView({ behavior: "smooth" });
      renderProblems();
    });
  });
}

function renderProblems() {
  const filtered = getFilteredProblems();

  if (!filtered.length) {
    els.problemList.innerHTML = `<div class="empty-state">No problems match these filters yet. Try clearing a filter or adding more problems to the data file.</div>`;
    return;
  }

  els.problemList.innerHTML = filtered.map((problem) => {
    const solved = state.solved.has(problem.id);
    const attempts = state.attempts[problem.id]?.count || 0;
    return `
      <article class="problem-card ${solved ? "done" : ""}">
        <div>
          <div class="problem-meta">
            <span>${escapeHtml(problem.category)} · ${escapeHtml(problem.subcategory)}</span>
            <span>${solved ? "✅ Solved" : attempts ? `${attempts} attempt${attempts === 1 ? "" : "s"}` : "New"}</span>
          </div>
          <h3>${escapeHtml(problem.title)}</h3>
          <p>${escapeHtml(problem.question)}</p>
          <div class="tag-row">
            <span class="source-pill">${escapeHtml(problem.sourceLabel)}</span>
            <span class="tag">${difficultyLabels[problem.difficulty]}</span>
            ${problem.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
          </div>
        </div>
        <button class="primary-button" type="button" data-open-problem="${escapeHtml(problem.id)}">Solve</button>
      </article>
    `;
  }).join("");

  els.problemList.querySelectorAll("[data-open-problem]").forEach((button) => {
    button.addEventListener("click", () => openProblem(button.dataset.openProblem));
  });
}

function getFilteredProblems() {
  return problems.filter((problem) => {
    const text = [problem.title, problem.question, problem.category, problem.subcategory, ...problem.tags]
      .join(" ")
      .toLowerCase();
    const matchesSearch = !state.filters.search || text.includes(state.filters.search);
    const matchesCategory = state.filters.category === "all" || problem.category === state.filters.category;
    const matchesDifficulty = state.filters.difficulty === "all" || String(problem.difficulty) === state.filters.difficulty;
    const solved = state.solved.has(problem.id);
    const matchesStatus = state.filters.status === "all"
      || (state.filters.status === "solved" && solved)
      || (state.filters.status === "unsolved" && !solved);
    return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
  });
}

function openProblem(problemId) {
  const problem = problems.find((item) => item.id === problemId);
  if (!problem) return;

  state.selectedProblem = problem;
  state.selectedChoice = null;
  stopAnimation();
  els.dialogMeta.textContent = `${problem.category} · ${difficultyLabels[problem.difficulty]}`;
  els.dialogTitle.textContent = problem.title;
  els.dialogQuestion.textContent = problem.question;
  els.feedbackText.textContent = "";
  els.feedbackText.className = "feedback";
  els.explanationPanel.hidden = true;
  els.dialogChoices.innerHTML = problem.choices.map((choice, index) => `
    <button class="choice-button" type="button" data-choice="${index}">
      <span class="choice-letter">${String.fromCharCode(65 + index)}</span>
      <span>${escapeHtml(choice)}</span>
    </button>
  `).join("");

  els.dialogChoices.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => selectChoice(Number(button.dataset.choice)));
  });

  if (typeof els.problemDialog.showModal === "function") {
    els.problemDialog.showModal();
  } else {
    alert("Your browser does not support dialog windows. Try the latest Chrome, Edge, Safari, or Firefox.");
  }
}

function selectChoice(index) {
  state.selectedChoice = index;
  els.dialogChoices.querySelectorAll(".choice-button").forEach((button) => {
    button.classList.toggle("selected", Number(button.dataset.choice) === index);
  });
  els.feedbackText.textContent = "";
  els.feedbackText.className = "feedback";
}

function checkAnswer() {
  const problem = state.selectedProblem;
  if (!problem) return;

  if (state.selectedChoice === null) {
    els.feedbackText.textContent = "Choose an answer first.";
    els.feedbackText.className = "feedback incorrect";
    return;
  }

  const attempt = state.attempts[problem.id] || { count: 0, correct: 0 };
  attempt.count += 1;

  if (state.selectedChoice === problem.answerIndex) {
    attempt.correct += 1;
    state.solved.add(problem.id);
    els.feedbackText.textContent = `Correct — answer ${String.fromCharCode(65 + problem.answerIndex)}.`;
    els.feedbackText.className = "feedback correct";
    showExplanation(false);
  } else {
    els.feedbackText.textContent = "Not quite. Try another choice or view the explanation.";
    els.feedbackText.className = "feedback incorrect";
  }

  state.attempts[problem.id] = attempt;
  persistProgress();
  updateStats();
  renderLanes();
  renderProblems();
}

function showExplanation(forceOpen) {
  const problem = state.selectedProblem;
  if (!problem) return;

  els.explanationPanel.hidden = false;
  els.solutionIdea.textContent = problem.explanation.idea;
  els.solutionSteps.innerHTML = problem.explanation.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  setupAnimation(problem);

  els.animationFrames.innerHTML = getAnimationFrames(problem)
    .map((frame, index) => `<div class="frame"><strong>${index + 1}.</strong> ${escapeHtml(stripFramePrefix(frame))}</div>`)
    .join("");

  if (forceOpen) {
    els.feedbackText.textContent = `Answer: ${String.fromCharCode(65 + problem.answerIndex)}. Review the steps and animation on the right.`;
    els.feedbackText.className = "feedback correct";
  }
}

function setupAnimation(problem) {
  state.animation.frame = 0;
  stopAnimation();
  renderAnimationFrame(problem);
}

function getAnimationFrames(problem) {
  return problem.explanation.animationFrames?.length
    ? problem.explanation.animationFrames
    : problem.explanation.steps;
}

function toggleAnimationPlayback() {
  if (!state.selectedProblem) return;
  if (state.animation.playing) {
    stopAnimation();
    return;
  }

  state.animation.playing = true;
  els.playAnimationButton.textContent = "Pause";
  state.animation.timer = window.setInterval(() => moveAnimationFrame(1, true), 1500);
}

function stopAnimation() {
  if (state.animation.timer) {
    window.clearInterval(state.animation.timer);
  }
  state.animation.timer = null;
  state.animation.playing = false;
  if (els.playAnimationButton) els.playAnimationButton.textContent = "Play";
}

function moveAnimationFrame(delta, fromTimer = false) {
  const problem = state.selectedProblem;
  if (!problem) return;

  const frameCount = getAnimationFrames(problem).length || 1;
  state.animation.frame = (state.animation.frame + delta + frameCount) % frameCount;
  renderAnimationFrame(problem);

  if (!fromTimer && state.animation.playing) {
    stopAnimation();
  }
}

function renderAnimationFrame(problem) {
  const frames = getAnimationFrames(problem);
  const frameCount = frames.length || 1;
  const frameIndex = Math.min(state.animation.frame, frameCount - 1);

  els.animationStepLabel.textContent = `Step ${frameIndex + 1}/${frameCount}`;
  els.animationCaption.textContent = stripFramePrefix(frames[frameIndex] || "Animation step");
  els.animationStage.innerHTML = renderProblemAnimation(problem, frameIndex, frameCount);
  els.animationStage.classList.remove("pop-in");
  requestAnimationFrame(() => els.animationStage.classList.add("pop-in"));

  els.animationDots.innerHTML = frames.map((_, index) => `
    <button class="animation-dot ${index === frameIndex ? "active" : ""}" type="button" aria-label="Jump to step ${index + 1}" data-animation-frame="${index}"></button>
  `).join("");

  els.animationDots.querySelectorAll("[data-animation-frame]").forEach((button) => {
    button.addEventListener("click", () => {
      state.animation.frame = Number(button.dataset.animationFrame);
      renderAnimationFrame(problem);
      if (state.animation.playing) stopAnimation();
    });
  });
}

function renderProblemAnimation(problem, frameIndex, frameCount) {
  const renderers = {
    "orig-alg-001": renderRibbonRatio,
    "orig-geo-001": renderGardenBorder,
    "orig-nt-001": renderRemainderLadder,
    "orig-cp-001": renderTwoSocks,
    "orig-alg-002": renderMysteryAverage,
    "orig-geo-002": renderTriangleTurn,
    "orig-nt-002": renderDivisorDetective,
    "orig-cp-002": renderFlagStripes,
    "orig-alg-003": renderTicketTable,
    "orig-geo-003": renderFoldedSquare
  };

  const renderer = renderers[problem.id] || renderGenericAnimation;
  return renderer(problem, frameIndex, frameCount);
}

function renderRibbonRatio(problem, frameIndex) {
  const red = `<div class="math-block red">x</div>`;
  const blue = (label = "x", extraClass = "") => `<div class="math-block blue ${extraClass}">${label}</div>`;
  const frames = [
    `<div class="block-scene">${red}<div class="equation-chip">red = x</div></div>`,
    `<div class="block-scene">${red}<span class="plus">+</span>${blue()}${blue()}${blue()}<div class="equation-chip">blue = 3x</div></div>`,
    `<div class="block-scene">${red.replace(">x<", ">16<")}${blue("16")}${blue("16")}${blue("16")}<div class="equation-chip">4x = 64 → x = 16</div></div>`,
    `<div class="block-scene">${red.replace(">x<", ">16<")}${blue("16", "highlight")}${blue("16", "highlight")}${blue("16", "highlight")}<div class="equation-chip">blue = 16 + 16 + 16 = 48</div></div>`
  ];
  return frames[frameIndex] || frames.at(-1);
}

function renderGardenBorder(problem, frameIndex) {
  const showBorder = frameIndex >= 1;
  const showLabels = frameIndex >= 2;
  const shadePath = frameIndex >= 3;
  return `
    <svg class="math-svg" viewBox="0 0 360 220" role="img" aria-label="Garden border animation">
      <rect x="55" y="35" width="250" height="150" rx="6" class="svg-outer ${showBorder ? "visible" : "muted-shape"}"/>
      <rect x="75" y="55" width="210" height="110" rx="4" class="svg-inner"/>
      ${shadePath ? `<path class="svg-highlight" fill-rule="evenodd" d="M55 35 H305 V185 H55 Z M75 55 V165 H285 V55 Z"/>` : ""}
      <text x="180" y="177" text-anchor="middle" class="svg-label">10 ft</text>
      <text x="62" y="112" text-anchor="middle" class="svg-label" transform="rotate(-90 62 112)">6 ft</text>
      ${showLabels ? `<text x="180" y="28" text-anchor="middle" class="svg-label strong">outside: 12 × 8</text>` : ""}
      ${shadePath ? `<text x="180" y="208" text-anchor="middle" class="svg-answer">96 − 60 = 36 sq ft</text>` : ""}
    </svg>
  `;
}

function renderRemainderLadder(problem, frameIndex) {
  if (frameIndex === 0) {
    return renderClockMod11([7, 8, 9, 10], "7 · 8 · 9 · 10 around mod 11");
  }
  if (frameIndex === 1) {
    return `<div class="number-ladder"><span>7 ≡ −4</span><span>8 ≡ −3</span><span>9 ≡ −2</span><span>10 ≡ −1</span><div class="equation-chip">Use nearby negatives mod 11</div></div>`;
  }
  if (frameIndex === 2) {
    return `<div class="big-equation">(−4)(−3)(−2)(−1)<br><span>= 24</span></div>`;
  }
  return `<div class="wrap-scene"><div class="wrap-number">24</div><div class="wrap-arrow">− 11 − 11</div><div class="wrap-result">remainder 2</div></div>`;
}

function renderTwoSocks(problem, frameIndex) {
  const socks = ["B", "B", "B", "W", "W"].map((label, index) => `<div class="sock ${label === "B" ? "black-sock" : "white-sock"}">${label}</div>`).join("");
  if (frameIndex === 0) {
    return `<div class="sock-scene">${socks}<div class="equation-chip">5 socks total</div></div>`;
  }
  if (frameIndex === 1) {
    return `<div class="pair-grid">${Array.from({ length: 10 }, (_, i) => `<span>pair ${i + 1}</span>`).join("")}<div class="equation-chip">C(5,2) = 10 total pairs</div></div>`;
  }
  if (frameIndex === 2) {
    return `<div class="pair-grid highlight-pairs">${["BB", "BB", "BB", "WW", "BW", "BW", "BW", "BW", "BW", "BW"].map((pair, i) => `<span class="${pair === "BB" || pair === "WW" ? "good-pair" : ""}">${pair}</span>`).join("")}</div>`;
  }
  return `<div class="fraction-scene"><span class="fraction"><b>4</b><i></i><b>10</b></span><span>=</span><span class="fraction"><b>2</b><i></i><b>5</b></span></div>`;
}

function renderMysteryAverage(problem, frameIndex) {
  const values = frameIndex >= 1 ? [11, 16, 20, 24, "?"] : ["", "", "", "", ""];
  const boxes = values.map((value, index) => `<div class="average-box ${index === 4 && frameIndex >= 3 ? "highlight" : ""}">${value}</div>`).join("");
  const chips = ["5 boxes share total 90", "Known values fill 4 boxes", "Known sum = 71", "Missing = 90 − 71 = 19"];
  return `<div class="average-scene">${boxes}<div class="equation-chip">${chips[frameIndex] || chips.at(-1)}</div></div>`;
}

function renderTriangleTurn(problem, frameIndex) {
  const equation = ["x, 2x, x + 30", "angles make 180°", "4x + 30 = 180", "largest: 2x = 75°"][frameIndex] || "largest: 75°";
  return `
    <svg class="math-svg" viewBox="0 0 360 220" role="img" aria-label="Triangle angle animation">
      <polygon points="70,170 285,170 155,48" class="triangle-fill"/>
      <text x="91" y="157" class="svg-label">x</text>
      <text x="250" y="157" class="svg-label ${frameIndex >= 3 ? "svg-answer" : ""}">2x</text>
      <text x="151" y="75" text-anchor="middle" class="svg-label">x+30</text>
      ${frameIndex >= 1 ? `<line x1="55" y1="198" x2="305" y2="198" class="svg-line"/><text x="180" y="214" text-anchor="middle" class="svg-label">sum = 180°</text>` : ""}
      <text x="180" y="28" text-anchor="middle" class="svg-answer">${equation}</text>
    </svg>
  `;
}

function renderDivisorDetective(problem, frameIndex) {
  const frames = [
    `<div class="big-equation">wanted divisor = 6k</div>`,
    `<div class="big-equation">6k | 72<br><span>k | 12</span></div>`,
    `<div class="number-ladder divisors"><span>1</span><span>2</span><span>3</span><span>4</span><span>6</span><span>12</span><div class="equation-chip">six choices for k</div></div>`,
    `<div class="number-ladder divisors"><span>6</span><span>12</span><span>18</span><span>24</span><span>36</span><span>72</span><div class="equation-chip">six multiples of 6</div></div>`
  ];
  return frames[frameIndex] || frames.at(-1);
}

function renderFlagStripes(problem, frameIndex) {
  const labels = ["4 choices", "× 3 choices", "× 3 choices"];
  const slots = [0, 1, 2].map((slot) => {
    const active = frameIndex >= slot + 1;
    return `<div class="flag-stripe ${active ? "filled" : ""}"><span>${active ? labels[slot] : "?"}</span></div>`;
  }).join("");
  const chip = frameIndex === 0 ? "Start with three blank stripes" : frameIndex === 1 ? "First stripe: 4 colors" : frameIndex === 2 ? "Next stripe: not the same as previous" : "4 × 3 × 3 = 36";
  return `<div class="flag-scene"><div class="flag-preview">${slots}</div><div class="equation-chip">${chip}</div></div>`;
}

function renderTicketTable(problem, frameIndex) {
  const ticketCount = 40;
  const studentTickets = frameIndex >= 3 ? 22 : 0;
  const tickets = Array.from({ length: ticketCount }, (_, index) => `<span class="ticket ${index < studentTickets ? "student-ticket" : "adult-ticket"}">${index < studentTickets ? "S" : "A"}</span>`).join("");
  const chips = ["Pretend all 40 are adult tickets", "40 × $8 = $320", "$320 − $254 = $66 less", "$66 ÷ $3 = 22 student tickets"];
  return `<div class="ticket-scene"><div class="ticket-grid">${tickets}</div><div class="equation-chip">${chips[frameIndex] || chips.at(-1)}</div></div>`;
}

function renderFoldedSquare(problem, frameIndex) {
  if (frameIndex === 0) {
    return `<div class="square-scene"><div class="big-square"><span></span><span></span><span></span><span></span></div><div class="equation-chip">6 × 6 square, perimeter 24</div></div>`;
  }
  if (frameIndex === 1) {
    return `<div class="pieces-scene">${Array.from({ length: 4 }, () => `<div class="small-square"></div>`).join("")}<div class="equation-chip">four 3 × 3 squares</div></div>`;
  }
  if (frameIndex === 2) {
    return `<div class="row-rectangle">${Array.from({ length: 4 }, () => `<div class="small-square joined"></div>`).join("")}<div class="equation-chip">12 × 3 rectangle</div></div>`;
  }
  return `<div class="big-equation">new perimeter = 30<br><span>increase = 30 − 24 = 6</span></div>`;
}

function renderGenericAnimation(problem, frameIndex) {
  const frames = getAnimationFrames(problem);
  return `<div class="generic-animation"><span class="large-step-number">${frameIndex + 1}</span><p>${escapeHtml(stripFramePrefix(frames[frameIndex] || "Animation frame"))}</p></div>`;
}

function renderClockMod11(activeNumbers, label) {
  const cx = 180;
  const cy = 110;
  const radius = 72;
  const points = Array.from({ length: 11 }, (_, i) => {
    const angle = (-90 + (360 / 11) * i) * Math.PI / 180;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    const value = i;
    const isActive = activeNumbers.includes(value);
    return `<g><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="14" class="clock-node ${isActive ? "active" : ""}"/><text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle" class="clock-label">${value}</text></g>`;
  }).join("");

  return `
    <svg class="math-svg" viewBox="0 0 360 220" role="img" aria-label="Modulo 11 clock">
      <circle cx="${cx}" cy="${cy}" r="${radius}" class="clock-ring"/>
      ${points}
      <text x="180" y="210" text-anchor="middle" class="svg-answer">${label}</text>
    </svg>
  `;
}

function updateStats() {
  const solvedCount = state.solved.size;
  const total = problems.length;
  const percent = total ? Math.round((solvedCount / total) * 100) : 0;
  els.solvedCount.textContent = solvedCount;
  els.totalCount.textContent = total;
  els.progressPercent.textContent = `${percent}%`;
  els.progressRing.style.setProperty("--progress", `${percent * 3.6}deg`);

  const recentCorrect = Object.entries(state.attempts)
    .filter(([, attempt]) => attempt.correct > 0)
    .length;
  els.streakCount.textContent = recentCorrect;

  const categoryScores = Object.keys(categoryInfo).map((category) => {
    const categoryProblems = problems.filter((problem) => problem.category === category);
    const solvedInCategory = categoryProblems.filter((problem) => state.solved.has(problem.id)).length;
    return { category, solved: solvedInCategory, total: categoryProblems.length };
  }).filter((item) => item.total > 0);

  categoryScores.sort((a, b) => (b.solved / b.total) - (a.solved / a.total) || b.solved - a.solved);
  els.bestCategory.textContent = categoryScores.length && categoryScores[0].solved > 0 ? categoryScores[0].category : "—";
}

function persistProgress() {
  localStorage.setItem("fmj_solved", JSON.stringify([...state.solved]));
  localStorage.setItem("fmj_attempts", JSON.stringify(state.attempts));
}

function resetDialogState() {
  stopAnimation();
  state.selectedProblem = null;
  state.selectedChoice = null;
  els.explanationPanel.hidden = true;
}

function stripFramePrefix(value) {
  return String(value).replace(/^Frame\s*\d+\s*:\s*/i, "").trim();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

init();
