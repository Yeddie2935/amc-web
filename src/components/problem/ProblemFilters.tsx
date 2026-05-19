import type {
  DifficultyLevel,
  ProblemCategory,
  ProblemFilters as ProblemFiltersType,
} from "../../types/amc";

interface ProblemFiltersProps {
  filters: ProblemFiltersType;
  onChange: (filters: ProblemFiltersType) => void;
}

const categories: Array<"All" | ProblemCategory> = [
  "All",
  "Algebra",
  "Geometry",
  "Number Theory",
  "Counting & Probability",
  "Logic",
  "Other",
];

const difficulties: Array<"All" | DifficultyLevel> = ["All", 1, 2, 3, 4, 5];

export function ProblemFilters({ filters, onChange }: ProblemFiltersProps) {
  return (
    <div className="fmj-filter-panel">
      <label>
        <span>Search</span>
        <input
          value={filters.search}
          placeholder="Search topics, tags, years..."
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })
          }
        />
      </label>

      <label>
        <span>Category</span>
        <select
          value={filters.category}
          onChange={(event) =>
            onChange({
              ...filters,
              category: event.target.value as ProblemFiltersType["category"],
            })
          }
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Difficulty</span>
        <select
          value={filters.difficulty}
          onChange={(event) => {
            const value = event.target.value;
            onChange({
              ...filters,
              difficulty:
                value === "All"
                  ? "All"
                  : (Number(value) as DifficultyLevel),
            });
          }}
        >
          {difficulties.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty === "All" ? "All" : `Level ${difficulty}`}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Source</span>
        <select
          value={filters.sourceType}
          onChange={(event) =>
            onChange({
              ...filters,
              sourceType: event.target.value as ProblemFiltersType["sourceType"],
            })
          }
        >
          <option value="All">All</option>
          <option value="AMC">AMC</option>
          <option value="Original">Original</option>
        </select>
      </label>
    </div>
  );
}
