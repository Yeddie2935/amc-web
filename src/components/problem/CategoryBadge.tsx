import type { ProblemCategory } from "../../types/amc";

interface CategoryBadgeProps {
  category: ProblemCategory;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return <span className="fmj-badge fmj-category-badge">{category}</span>;
}
