import type { Problem } from "../../types/amc";

interface TopicMapProps {
  problems: Problem[];
}

export function TopicMap({ problems }: TopicMapProps) {
  const counts = problems.reduce<Record<string, number>>((acc, problem) => {
    acc[problem.category] = (acc[problem.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className="fmj-topic-map">
      <h3>Topic Map</h3>
      <div className="fmj-topic-list">
        {Object.entries(counts).map(([category, count]) => (
          <div key={category} className="fmj-topic-row">
            <span>{category}</span>
            <strong>{count}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
