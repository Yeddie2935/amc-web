import type {
  DifficultyLevel,
  Problem,
  ProblemCategory,
  ProblemFilters,
} from "../../types/amc";
import { CATEGORIES, getAvailableYears } from "../../lib/problemUtils";

interface AdvancedProblemFiltersProps {
  problems: Problem[];
  filters: ProblemFilters;
  onChange: (filters: ProblemFilters) => void;
}

const difficulties: Array<"All" | DifficultyLevel> = ["All", 1, 2, 3, 4, 5];

export function AdvancedProblemFilters({
  problems,
  filters,
  onChange,
}: AdvancedProblemFiltersProps) {
  const years = getAvailableYears(problems);

  return (
    <div className="fmj-advanced-filters">
      <div>
        <h3>Filters</h3>
        <button
          type="button"
          className="fmj-small-link-button"
          onClick={() =>
            onChange({
              search: "",
              category: "All",
              difficulty: "All",
              sourceType: "All",
              status: "All",
              year: "All",
              animation: "All",
            })
          }
        >
          Reset
        </button>
      </div>

      <label>
        <span>Search</span>
        <input
          value={filters.search}
          placeholder="ratios, area, graph..."
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
        />
      </label>

      <label>
        <span>Year</span>
        <select
          value={filters.year}
          onChange={(event) =>
            onChange({
              ...filters,
              year:
                event.target.value === "All" ? "All" : Number(event.target.value),
            })
          }
        >
          <option value="All">All years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Category</span>
        <select
          value={filters.category}
          onChange={(event) =>
            onChange({
              ...filters,
              category: event.target.value as "All" | ProblemCategory,
            })
          }
        >
          {CATEGORIES.map((category) => (
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
                value === "All" ? "All" : (Number(value) as DifficultyLevel),
            });
          }}
        >
          {difficulties.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty === "All" ? "All levels" : `Level ${difficulty}`}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Status</span>
        <select
          value={filters.status}
          onChange={(event) =>
            onChange({
              ...filters,
              status: event.target.value as ProblemFilters["status"],
            })
          }
        >
          <option value="All">All</option>
          <option value="unsolved">Unsolved</option>
          <option value="solved">Solved</option>
          <option value="missed">Missed</option>
          <option value="bookmarked">Bookmarked</option>
        </select>
      </label>

      <label>
        <span>Animation</span>
        <select
          value={filters.animation}
          onChange={(event) =>
            onChange({
              ...filters,
              animation: event.target.value as ProblemFilters["animation"],
            })
          }
        >
          <option value="All">All</option>
          <option value="Animated">Animated</option>
          <option value="Needs animation">Needs animation</option>
        </select>
      </label>
    </div>
  );
}
