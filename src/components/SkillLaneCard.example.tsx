import { Link } from "react-router-dom";
import type { SkillLane } from "../lib/skills";

type SkillLaneCardProps = {
  lane: SkillLane;
};

export function SkillLaneCard({ lane }: SkillLaneCardProps) {
  return (
    <Link
      to={`/practice?skill=${lane.id}`}
      className="block rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <p className="text-sm font-semibold text-slate-500">Skill Lane</p>
      <h3 className="mt-1 text-xl font-bold text-slate-900">{lane.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{lane.description}</p>
      <p className="mt-4 text-sm font-semibold text-blue-700">Start practice →</p>
    </Link>
  );
}
