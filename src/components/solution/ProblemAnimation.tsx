import { useEffect, useMemo, useState } from "react";
import type { Problem } from "../../types/amc";
import { Button } from "../common/Button";
import { AnimationTemplateVisual } from "../animation/AnimationTemplate";

interface ProblemAnimationProps {
  problem: Problem;
}

const DEFAULT_STEP_TITLES = ["Set up", "Work it out", "Answer"];

const DEFAULT_FALLBACK_FRAMES = [
  {
    title: "Set up",
    narration: "Find the important numbers and relationships in the problem.",
    visualHint: "Identify the key elements of the story or diagram.",
  },
  {
    title: "Work it out",
    narration: "Apply the right math idea to the setup.",
    visualHint: "Show the calculation, diagram, or reasoning step.",
  },
  {
    title: "Answer",
    narration: "Confirm that your result matches the correct choice.",
    visualHint: "Compare the final quantity to the answer options.",
  },
];

export function ProblemAnimation({ problem }: ProblemAnimationProps) {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const frames = problem.animationFrames ?? DEFAULT_FALLBACK_FRAMES;

  const stepTitles = useMemo(() => {
    const fromData = frames.map((frame) => frame.title);
    return fromData.length >= 3 ? fromData.slice(0, 3) : DEFAULT_STEP_TITLES;
  }, [frames]);

  useEffect(() => {
    setStep(0);
    setIsPlaying(false);
  }, [problem.id]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = window.setInterval(() => {
      setStep((current) => {
        if (current >= 2) {
          setIsPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1800);

    return () => window.clearInterval(interval);
  }, [isPlaying]);

  function goNext() {
    setStep((current) => Math.min(2, current + 1));
  }

  function goBack() {
    setStep((current) => Math.max(0, current - 1));
  }

  return (
    <div className="fmj-animated-explainer">
      <div className="fmj-animation-stage" data-step={step}>
        {renderScene(problem.id, step, problem)}
      </div>

      <div className="fmj-animation-controls">
        <Button variant="secondary" onClick={goBack} disabled={step === 0}>
          Back
        </Button>
        <Button onClick={() => setIsPlaying((value) => !value)}>
          {isPlaying ? "Pause" : step === 2 ? "Replay" : "Play animation"}
        </Button>
        <Button variant="secondary" onClick={goNext} disabled={step === 2}>
          Next
        </Button>
      </div>

      <div className="fmj-animation-dots" aria-label="Animation progress">
        {stepTitles.map((title, index) => (
          <button
            key={title}
            type="button"
            className={index === step ? "active" : ""}
            onClick={() => setStep(index)}
          >
            <span>{index + 1}</span>
            {title}
          </button>
        ))}
      </div>
    </div>
  );
}

function renderScene(problemId: string, step: number, problem: Problem) {
  switch (problemId) {
    case "amc8-1999-01":
      return <OperationScene step={step} />;
    case "amc8-1999-02":
      return <ClockScene step={step} />;
    case "amc8-1999-03":
      return <TripletScene step={step} />;
    case "amc8-1999-04":
      return <BikerGraphScene step={step} />;
    case "amc8-1999-05":
      return <GardenScene step={step} />;
    case "amc8-1999-06":
      return <RankingScene step={step} />;
    case "amc8-1999-07":
      return <MilepostScene step={step} />;
    case "amc8-1999-08":
      return <CubeNetScene step={step} />;
    case "amc8-1999-09":
      return <FlowerBedsScene step={step} />;
    case "amc8-1999-10":
      return <TrafficLightScene step={step} />;
    default:
      return <GenericScene problem={problem} step={step} />;
  }
}

function StageCaption({ title, body }: { title: string; body: string }) {
  return (
    <div className="fmj-stage-caption">
      <strong>{title}</strong>
      <span>{body}</span>
    </div>
  );
}

function OperationScene({ step }: { step: number }) {
  return (
    <div className="fmj-scene fmj-scene-operation">
      <div className="fmj-equation-large">
        <span>(6</span>
        <span className={`fmj-operation-token ${step >= 1 ? "solved" : ""}`}>
          {step >= 1 ? "÷" : "?"}
        </span>
        <span>3) + 4 − (2 − 1) = 5</span>
      </div>
      {step >= 1 && <div className="fmj-equation-small">2 + 4 − 1 = 5</div>}
      {step >= 2 && <div className="fmj-answer-pop">Choice A: ÷</div>}
      <StageCaption
        title={["Find the missing operation", "Try division", "Check the equation"][step]}
        body={[
          "The blank must make the whole equation equal 5.",
          "Division gives 6 ÷ 3 = 2, and 2 − 1 = 1.",
          "Now the left side is 2 + 4 − 1 = 5.",
        ][step]}
      />
    </div>
  );
}

function ClockScene({ step }: { step: number }) {
  return (
    <div className="fmj-scene fmj-scene-clock">
      <div className="fmj-clock">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className={`mark mark-${i + 1}`}>
            {i + 1}
          </span>
        ))}
        <span className="hand minute" />
        <span className="hand hour" />
        {step >= 1 && <span className="angle-wedge">60°</span>}
      </div>
      <StageCaption
        title={["Place the hands", "Count clock spaces", "Convert to degrees"][step]}
        body={[
          "At 10:00, the minute hand points at 12 and the hour hand points at 10.",
          "The smaller angle covers 2 hour spaces.",
          "Each space is 30°, so 2 × 30° = 60°.",
        ][step]}
      />
    </div>
  );
}

function TripletScene({ step }: { step: number }) {
  const rows = [
    ["A", "1/2 + 1/3 + 1/6", "1"],
    ["B", "2 − 2 + 1", "1"],
    ["C", "0.1 + 0.3 + 0.6", "1"],
    ["D", "1.1 − 2.1 + 1.0", "0"],
    ["E", "−3/2 − 5/2 + 5", "1"],
  ];
  return (
    <div className="fmj-scene fmj-scene-triplets">
      <div className="fmj-triplet-table">
        {rows.map(([label, expression, sum]) => (
          <div
            key={label}
            className={`fmj-triplet-row ${label === "D" && step >= 1 ? "highlight" : ""}`}
          >
            <strong>{label}</strong>
            <span>{expression}</span>
            <em>{step >= 1 || label !== "D" ? sum : "?"}</em>
          </div>
        ))}
      </div>
      {step >= 2 && <div className="fmj-answer-pop">Choice D is not equal to 1.</div>}
      <StageCaption
        title={["Compare sums", "The odd row", "Select D"][step]}
        body={[
          "Most answer choices are built to add to 1.",
          "Choice D gives 1.1 − 2.1 + 1.0 = 0.",
          "The question asks for the triplet NOT equal to 1.",
        ][step]}
      />
    </div>
  );
}

function BikerGraphScene({ step }: { step: number }) {
  return (
    <div className="fmj-scene">
      <svg className="fmj-svg-stage" viewBox="0 0 360 240" role="img">
        <line x1="45" y1="190" x2="320" y2="190" className="axis" />
        <line x1="45" y1="190" x2="45" y2="25" className="axis" />
        {[1, 2, 3, 4, 5].map((x) => (
          <text key={x} x={45 + x * 50} y="215" className="svg-label">{x}</text>
        ))}
        {[15, 30, 45, 60, 75].map((y, i) => (
          <text key={y} x="12" y={190 - (i + 1) * 30} className="svg-label">{y}</text>
        ))}
        <polyline points="45,190 95,145 145,110 195,75 245,45" className="line-a" />
        <polyline points="45,190 95,170 145,145 195,120 245,100" className="line-b" />
        <text x="205" y="66" className="svg-label bold">Alberto</text>
        <text x="210" y="122" className="svg-label bold">Bjorn</text>
        {step >= 1 && <line x1="245" y1="190" x2="245" y2="45" className="guide" />}
        {step >= 1 && <circle cx="245" cy="45" r="6" className="dot-a" />}
        {step >= 1 && <circle cx="245" cy="100" r="6" className="dot-b" />}
        {step >= 2 && <text x="250" y="78" className="svg-answer">60 − 35 = 25</text>}
      </svg>
      <StageCaption
        title={["Read the graph", "Use the 4-hour mark", "Subtract distances"][step]}
        body={[
          "The graph compares miles traveled over time.",
          "At 4 hours, Alberto is about 60 and Bjorn is about 35.",
          "Alberto biked about 25 more miles.",
        ][step]}
      />
    </div>
  );
}

function GardenScene({ step }: { step: number }) {
  return (
    <div className="fmj-scene fmj-scene-garden">
      <div className="shape-row">
        <div className="rect-garden">
          <span>50 × 10</span>
          {step >= 1 && <em>Area 500</em>}
        </div>
        <div className="arrow">→</div>
        <div className="square-garden">
          <span>30 × 30</span>
          {step >= 1 && <em>Area 900</em>}
        </div>
      </div>
      {step >= 2 && <div className="fmj-answer-pop">900 − 500 = 400</div>}
      <StageCaption
        title={["Original garden", "Same fence, new square", "Area increase"][step]}
        body={[
          "The rectangle has perimeter 120 and area 500.",
          "A square using 120 feet of fence has side length 30.",
          "The square is 400 square feet larger.",
        ][step]}
      />
    </div>
  );
}

function RankingScene({ step }: { step: number }) {
  const names = step === 0 ? ["Flo", "Bo", "Joe", "Coe", "Moe"] : ["Flo", "Bo", "Joe", "Coe", "Moe"];
  return (
    <div className="fmj-scene fmj-scene-ranking">
      <div className="money-ladder">
        {names.map((name) => (
          <div key={name} className={`money-card ${name === "Moe" && step >= 2 ? "least" : ""}`}>
            {name}
          </div>
        ))}
      </div>
      <StageCaption
        title={["Translate clues", "Place people above Moe", "Moe is least"][step]}
        body={[
          "Turn each sentence into a greater-than relationship.",
          "Bo, Coe, and Joe all have more than Moe; Flo is above Jo and Bo.",
          "Everyone is above Moe, so Moe has the least money.",
        ][step]}
      />
    </div>
  );
}

function MilepostScene({ step }: { step: number }) {
  return (
    <div className="fmj-scene fmj-scene-milepost">
      <div className="number-line">
        <span className="endpoint left">40</span>
        <span className="endpoint right">160</span>
        {step >= 1 && <span className="marker three-fourths">3/4 point</span>}
        {step >= 2 && <span className="marker answer">130</span>}
      </div>
      <StageCaption
        title={["Find the interval", "Move three-fourths", "Add from 40"][step]}
        body={[
          "The distance from milepost 40 to 160 is 120 miles.",
          "Three-fourths of 120 is 90.",
          "40 + 90 = 130.",
        ][step]}
      />
    </div>
  );
}

function CubeNetScene({ step }: { step: number }) {
  return (
    <div className="fmj-scene fmj-scene-cube">
      <div className="cube-net">
        <span className={`face r ${step >= 1 ? "dim" : ""}`}>R</span>
        <span className={`face b ${step >= 2 ? "opposite" : ""}`}>B</span>
        <span className="face g">G</span>
        <span className="face y">Y</span>
        <span className="face o">O</span>
        <span className={`face w ${step >= 1 ? "focus" : ""}`}>W</span>
      </div>
      {step >= 2 && <div className="fmj-answer-pop">W folds opposite B.</div>}
      <StageCaption
        title={["Read the net", "Track W", "Opposite face"][step]}
        body={[
          "The squares are hinged as a cube net.",
          "W is attached below Y, so it folds around the side.",
          "After folding, W is opposite B.",
        ][step]}
      />
    </div>
  );
}

function FlowerBedsScene({ step }: { step: number }) {
  return (
    <div className="fmj-scene fmj-scene-flowers">
      <div className="venn-stage">
        <div className="bed bed-a">A<br />500</div>
        <div className="bed bed-b">B<br />450</div>
        <div className="bed bed-c">C<br />350</div>
        {step >= 1 && <span className="overlap overlap-ab">50</span>}
        {step >= 1 && <span className="overlap overlap-ac">100</span>}
      </div>
      {step >= 2 && <div className="fmj-answer-pop">500 + 450 + 350 − 50 − 100 = 1150</div>}
      <StageCaption
        title={["Add all beds", "Subtract overlaps", "Total plants"][step]}
        body={[
          "Start with 500 + 450 + 350.",
          "The overlap plants were counted twice.",
          "The total is 1150 plants.",
        ][step]}
      />
    </div>
  );
}

function TrafficLightScene({ step }: { step: number }) {
  return (
    <div className="fmj-scene fmj-scene-traffic">
      <div className="traffic-bar">
        <span className="green">25s green</span>
        <span className={`yellow ${step >= 1 ? "selected" : ""}`}>5s yellow</span>
        <span className={`red ${step >= 1 ? "selected" : ""}`}>30s red</span>
      </div>
      {step >= 2 && <div className="fmj-answer-pop">Not green = 35/60 = 7/12</div>}
      <StageCaption
        title={["Full cycle", "Highlight not green", "Make probability"][step]}
        body={[
          "One complete light cycle is 60 seconds.",
          "Not green means yellow plus red: 5 + 30 = 35 seconds.",
          "Probability is 35 out of 60, or 7/12.",
        ][step]}
      />
    </div>
  );
}

function GenericScene({ problem, step }: { problem: Problem; step: number }) {
  const frames = problem.animationFrames ?? [
    {
      title: "Understand",
      narration: "Identify the given information and what the problem asks.",
      visualHint: "Identify the key numbers or diagram details.",
    },
    {
      title: "Solve",
      narration: "Use the main math idea to work toward the answer.",
      visualHint: "Show the calculation, diagram, or reasoning step.",
    },
    {
      title: "Check",
      narration: "Compare the result with the answer choices.",
      visualHint: "Circle the final answer choice.",
    },
  ];

  const safeIndex = Math.min(step, frames.length - 1);
  const current = frames[safeIndex];

  return (
    <div className="fmj-scene fmj-scene-generic">
      {problem.animation ? (
        <AnimationTemplateVisual problem={problem} step={safeIndex} />
      ) : (
        <div className="generic-board">
          {frames.slice(0, 3).map((frame, index) => (
            <span key={frame.title || index} className={index === safeIndex ? "active" : ""}>
              {index + 1}. {frame.title}
            </span>
          ))}
        </div>
      )}
      <StageCaption title={current.title} body={current.narration} />
      <div className="generic-visual-hint">
        <p>{current.visualHint}</p>
      </div>
    </div>
  );
}
