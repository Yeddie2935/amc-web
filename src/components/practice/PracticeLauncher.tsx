interface PracticeLauncherProps {
  totalProblems: number;
  missedCount: number;
  onStart: (type: "mixed" | "unsolved" | "missed" | "challenge") => void;
}

export function PracticeLauncher({
  totalProblems,
  missedCount,
  onStart,
}: PracticeLauncherProps) {
  return (
    <section className="fmj-practice-grid">
      <button type="button" onClick={() => onStart("mixed")}>
        <strong>10-minute mixed practice</strong>
        <span>Pull from all {totalProblems} loaded problems.</span>
      </button>
      <button type="button" onClick={() => onStart("unsolved")}>
        <strong>Unsolved problems</strong>
        <span>Focus only on problems not yet solved.</span>
      </button>
      <button type="button" onClick={() => onStart("missed")}>
        <strong>Review missed</strong>
        <span>{missedCount} missed problems ready for review.</span>
      </button>
      <button type="button" onClick={() => onStart("challenge")}>
        <strong>Final-5 challenge</strong>
        <span>Harder Level 4–5 AMC-style problems.</span>
      </button>
    </section>
  );
}
