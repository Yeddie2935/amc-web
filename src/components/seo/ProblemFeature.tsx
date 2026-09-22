import { lazy, Suspense, useState } from "react";
import { useLocalProgress } from "../../hooks/useLocalProgress";
import type { Problem } from "../../types/amc";
const Animation = lazy(() => import("../animation/AnimationRenderer").then(m => ({ default: m.AnimationRenderer })));
export default function ProblemFeature({ problem }: { problem: Problem }) {
  const progress = useLocalProgress([problem]);
  const [answer,setAnswer] = useState("");
  const [result,setResult] = useState<string | null>(null);
  const [animation,setAnimation] = useState(false);
  return <section className="fmj-card" aria-label="Try this problem">
    <h2>Try it yourself</h2>
    <fieldset><legend>Your answer</legend>{problem.choices?.map(c => <label key={c.label} className="fmj-public-answer"><input type="radio" name={`answer-${problem.id}`} value={c.label} checked={answer===c.label} onChange={() => {setAnswer(c.label);setResult(null);}} /> {c.label}</label>)}</fieldset>
    <div className="fmj-workspace-actions"><button disabled={!answer} onClick={() => setResult(progress.recordAttempt(problem, answer).isCorrect ? "Correct!" : "Not quite. Try a hint or review the written solution.")}>Check answer</button>
    <button onClick={() => progress.toggleBookmark(problem.id)}>{progress.progress.bookmarkedIds.includes(problem.id) ? "Remove bookmark" : "Bookmark problem"}</button>
    <button onClick={() => setAnimation(value => !value)}>{animation ? "Hide animated explanation" : "Play animated explanation"}</button></div>
    {result && <p role="status">{result}</p>}
    {animation && <Suspense fallback={<p>Loading the visual explanation…</p>}><Animation problem={problem} /></Suspense>}
  </section>;
}
