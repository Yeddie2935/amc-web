import { useEffect, useState } from "react";
import type { Problem } from "../../types/amc";
import { Button } from "../common/Button";

interface AnimationRendererProps {
  problem: Problem;
}

export function AnimationRenderer({ problem }: AnimationRendererProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
  }, [problem.id]);

  const frames = problem.animationFrames ?? [
    {
      title: "Understand",
      narration: "Identify the key information in the problem.",
      visualHint: "Highlight the important numbers and relationships.",
    },
    {
      title: "Solve",
      narration: "Use the main math idea to work toward the answer.",
      visualHint: "Show the calculation, diagram relationship, or counting setup.",
    },
    {
      title: "Check",
      narration: "Compare the result with the answer choices.",
      visualHint: "Circle the final answer choice.",
    },
  ];

  const safeStep = Math.min(step, frames.length - 1);
  const current = frames[safeStep];

  return (
    <div className="fmj-fixed-animation">
      <div className="fmj-fixed-stage">
        <ProblemVisual problem={problem} step={safeStep} />
      </div>

      <div className="fmj-fixed-caption">
        <strong>{current.title}</strong>
        <p>{current.narration}</p>
        <small>{current.visualHint}</small>
      </div>

      <div className="fmj-animation-controls">
        <Button
          variant="secondary"
          onClick={() => setStep((value) => Math.max(0, value - 1))}
          disabled={safeStep === 0}
        >
          Back
        </Button>
        <Button
          onClick={() =>
            setStep((value) => (value >= frames.length - 1 ? 0 : value + 1))
          }
        >
          {safeStep >= frames.length - 1 ? "Replay" : "Next"}
        </Button>
      </div>
    </div>
  );
}

function ProblemVisual({ problem, step }: { problem: Problem; step: number }) {
  switch (problem.id) {
    case "amc8-1999-01":
      return <OperationVisual step={step} />;
    case "amc8-1999-02":
      return <ClockVisual step={step} />;
    case "amc8-1999-03":
      return <TripletVisual step={step} />;
    case "amc8-1999-04":
      return <BikerGraphVisual step={step} />;
    case "amc8-1999-05":
      return <GardenVisual step={step} />;
    case "amc8-1999-06":
      return <MoneyRankingVisual step={step} />;
    case "amc8-1999-07":
      return <MilepostVisual step={step} />;
    case "amc8-1999-08":
      return <CubeNetVisual step={step} />;
    case "amc8-1999-09":
      return <FlowerBedsVisual step={step} />;
    case "amc8-1999-10":
      return <TrafficLightVisual step={step} />;
    default:
      return <CleanFallbackVisual problem={problem} step={step} />;
  }
}

function OperationVisual({ step }: { step: number }) {
  return (
    <div className="fmj-visual-card operation-visual">
      <div className="equation-line">
        <span>(6</span>
        <span className={`operator-chip ${step >= 1 ? "solved" : ""}`}>
          {step >= 1 ? "÷" : "?"}
        </span>
        <span>3) + 4 − (2 − 1) = 5</span>
      </div>

      {step >= 1 && (
        <div className="work-line">
          <span>6 ÷ 3 = 2</span>
          <span>2 − 1 = 1</span>
        </div>
      )}

      {step >= 2 && (
        <div className="answer-ribbon">2 + 4 − 1 = 5, so the answer is A.</div>
      )}
    </div>
  );
}

function ClockVisual({ step }: { step: number }) {
  return (
    <div className="fmj-visual-card clock-visual">
      <div className="clean-clock">
        <span className="clock-num n12">12</span>
        <span className="clock-num n10">10</span>
        <span className="clock-center" />
        <span className="clock-hand minute" />
        <span className="clock-hand hour" />
        {step >= 1 && <span className="clock-gap one">30°</span>}
        {step >= 1 && <span className="clock-gap two">30°</span>}
        {step >= 2 && <span className="clock-answer">60°</span>}
      </div>
    </div>
  );
}

function TripletVisual({ step }: { step: number }) {
  const rows = [
    ["A", "1/2 + 1/3 + 1/6", "1"],
    ["B", "2 − 2 + 1", "1"],
    ["C", "0.1 + 0.3 + 0.6", "1"],
    ["D", "1.1 − 2.1 + 1.0", "0"],
    ["E", "−3/2 − 5/2 + 5", "1"],
  ];

  return (
    <div className="fmj-visual-card triplet-visual">
      {rows.map(([label, expression, sum]) => (
        <div
          key={label}
          className={`triplet-row ${label === "D" && step >= 1 ? "wrong-sum" : ""}`}
        >
          <strong>{label}</strong>
          <span>{expression}</span>
          <em>{step >= 1 || label !== "D" ? sum : "?"}</em>
        </div>
      ))}
      {step >= 2 && <div className="answer-ribbon">D is the only sum not equal to 1.</div>}
    </div>
  );
}

function BikerGraphVisual({ step }: { step: number }) {
  return (
    <div className="fmj-visual-card">
      <svg className="clean-graph" viewBox="0 0 420 260">
        <line x1="55" y1="210" x2="370" y2="210" className="axis" />
        <line x1="55" y1="210" x2="55" y2="35" className="axis" />

        {[1, 2, 3, 4, 5].map((x) => (
          <text key={x} x={55 + x * 58} y="238" className="graph-label">
            {x}
          </text>
        ))}
        {[15, 30, 45, 60, 75].map((y, i) => (
          <text key={y} x="18" y={210 - (i + 1) * 32} className="graph-label">
            {y}
          </text>
        ))}

        <text x="185" y="252" className="graph-label bold">hours</text>
        <text x="4" y="32" className="graph-label bold">miles</text>

        <polyline
          points="55,210 113,165 171,123 229,82 287,50"
          className="alberto-line"
        />
        <polyline
          points="55,210 113,185 171,160 229,135 287,112"
          className="bjorn-line"
        />

        <text x="294" y="54" className="graph-label blue">Alberto</text>
        <text x="294" y="116" className="graph-label orange">Bjorn</text>

        {step >= 1 && <line x1="287" y1="210" x2="287" y2="50" className="graph-guide" />}
        {step >= 1 && <circle cx="287" cy="50" r="7" className="blue-dot" />}
        {step >= 1 && <circle cx="287" cy="112" r="7" className="orange-dot" />}
        {step >= 2 && <text x="205" y="33" className="graph-answer">60 − 35 ≈ 25</text>}
      </svg>
    </div>
  );
}

function GardenVisual({ step }: { step: number }) {
  return (
    <div className="fmj-visual-card garden-visual">
      <div className="garden-row">
        <div className="old-garden">
          <strong>50 ft × 10 ft</strong>
          {step >= 1 && <span>area = 500</span>}
        </div>
        <div className="garden-arrow">same fence →</div>
        <div className="new-garden">
          <strong>30 ft × 30 ft</strong>
          {step >= 1 && <span>area = 900</span>}
        </div>
      </div>
      {step >= 2 && <div className="answer-ribbon">900 − 500 = 400 square feet</div>}
    </div>
  );
}

function MoneyRankingVisual({ step }: { step: number }) {
  const names = ["Flo", "Bo", "Joe", "Coe", "Moe"];

  return (
    <div className="fmj-visual-card ranking-visual">
      <div className="ranking-ladder">
        {names.map((name) => (
          <div key={name} className={`ranking-card ${name === "Moe" && step >= 2 ? "least" : ""}`}>
            {name}
          </div>
        ))}
      </div>
      {step >= 1 && (
        <div className="relation-list">
          <span>Bo &gt; Moe</span>
          <span>Coe &gt; Moe</span>
          <span>Joe &gt; Moe</span>
        </div>
      )}
      {step >= 2 && <div className="answer-ribbon">Moe is below everyone else.</div>}
    </div>
  );
}

function MilepostVisual({ step }: { step: number }) {
  return (
    <div className="fmj-visual-card milepost-visual">
      <div className="mile-line">
        <span className="mile-start">40</span>
        <span className="mile-end">160</span>
        {step >= 1 && <span className="mile-marker fraction">3/4 of the way</span>}
        {step >= 2 && <span className="mile-marker answer">130</span>}
      </div>
      {step >= 2 && <div className="answer-ribbon">160 − 40 = 120, and 40 + 90 = 130.</div>}
    </div>
  );
}

function CubeNetVisual({ step }: { step: number }) {
  return (
    <div className="fmj-visual-card cube-net-visual">
      <div className="clean-net">
        <span className="net-face r">R</span>
        <span className={`net-face b ${step >= 2 ? "opposite" : ""}`}>B</span>
        <span className="net-face g">G</span>
        <span className="net-face y">Y</span>
        <span className="net-face o">O</span>
        <span className={`net-face w ${step >= 1 ? "focus" : ""}`}>W</span>
      </div>
      {step >= 2 && <div className="answer-ribbon">When folded, W is opposite B.</div>}
    </div>
  );
}

function FlowerBedsVisual({ step }: { step: number }) {
  return (
    <div className="fmj-visual-card flower-visual">
      <div className="flower-stage">
        <div className="bed bed-a">A<br />500</div>
        <div className="bed bed-b">B<br />450</div>
        <div className="bed bed-c">C<br />350</div>
        {step >= 1 && <span className="overlap ab">50</span>}
        {step >= 1 && <span className="overlap ac">100</span>}
      </div>
      {step >= 2 && <div className="answer-ribbon">500 + 450 + 350 − 50 − 100 = 1150</div>}
    </div>
  );
}

function TrafficLightVisual({ step }: { step: number }) {
  return (
    <div className="fmj-visual-card traffic-visual">
      <div className="traffic-strip">
        <span className="green">25s green</span>
        <span className={`yellow ${step >= 1 ? "selected" : ""}`}>5s yellow</span>
        <span className={`red ${step >= 1 ? "selected" : ""}`}>30s red</span>
      </div>
      {step >= 2 && <div className="answer-ribbon">Not green = 35/60 = 7/12</div>}
    </div>
  );
}

function CleanFallbackVisual({ problem, step }: { problem: Problem; step: number }) {
  return (
    <div className="fmj-visual-card fallback-visual">
      <div className="fallback-steps">
        <span className={step === 0 ? "active" : ""}>1. Read</span>
        <span className={step === 1 ? "active" : ""}>2. Reason</span>
        <span className={step >= 2 ? "active" : ""}>3. Answer</span>
      </div>
      <p>{problem.category}</p>
    </div>
  );
}
