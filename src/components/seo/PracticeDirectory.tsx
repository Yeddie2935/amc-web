import type { PracticeLane } from "../../seo/types";
export function PracticeDirectory({ lanes }: { lanes: PracticeLane[] }) {
  return <section aria-label="Practice topics" className="fmj-learn-grid">{lanes.map(lane => <div className="fmj-learn-card" key={lane.id}>
    <a href={`/practice?skill=${lane.id}`}><strong>{lane.title}</strong></a><p>{lane.description}</p>
    <div className="fmj-difficulty-row">{lane.counts.map((count,i) => <a className={`fmj-difficulty-pill level-${i+1}`} href={`/practice?skill=${lane.id}&difficulty=${i+1}`} key={i}><span>Level {i+1}</span><small>{count} problems</small></a>)}</div>
  </div>)}</section>;
}
