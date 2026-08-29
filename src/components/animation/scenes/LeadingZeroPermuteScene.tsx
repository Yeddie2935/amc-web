import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const TEAL = "#0d9488";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

function strList(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => String(v)) : [];
}

/** All distinct arrangements of a multiset of single-character strings. */
function distinctPerms(items: string[]): string[][] {
  if (items.length === 0) return [[]];
  const seen = new Set<string>();
  const out: string[][] = [];
  for (let i = 0; i < items.length; i++) {
    if (seen.has(items[i])) continue;
    seen.add(items[i]);
    const rest = [...items.slice(0, i), ...items.slice(i + 1)];
    for (const tail of distinctPerms(rest)) out.push([items[i], ...tail]);
  }
  return out;
}

/**
 * Rearranging a digit multiset into distinct numbers, excluding leading
 * zero. Six beats: (0) the digit tiles, noting the repeat and that a number
 * can't start with 0; (1) the trap — every arrangement, 0-led included,
 * totals a real (wrong) choice; (2) case "starts with 1" builds its
 * numbers; (3) case "starts with 2" builds its numbers; (4) the two cases
 * sum; (5) the badge. Data: { digits: string[] } (e.g. ["2","0","1","2"]).
 */
export function LeadingZeroPermuteScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const digits = strList(data.digits);
  if (digits.length < 2) return null;

  const distinctFirsts = Array.from(new Set(digits)).sort();
  const nonZeroFirsts = distinctFirsts.filter((d) => d !== "0");

  const allPerms = distinctPerms(digits).map((p) => p.join(""));
  const validNums = allPerms.filter((n) => n[0] !== "0");
  const invalidNums = allPerms.filter((n) => n[0] === "0");

  const caseGroups = nonZeroFirsts.map((first) => ({
    first,
    nums: validNums.filter((n) => n[0] === first),
  }));

  const trap = (problem.choices ?? []).find((c) => c.text.trim() === String(allPerms.length));

  const last = totalSteps - 1;
  const showTrap = step >= 1;
  const showTotal = step >= 2 + nonZeroFirsts.length;
  const isFinal = step >= last;

  const caseColors = [MARK, TEAL];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <div style={{ display: "flex", gap: 6 }}>
        {digits.map((d, i) => {
          const dup = digits.filter((x) => x === d).length > 1;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -10, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.08 }}
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: dup ? `${MARK}18` : "#f1f5f9",
                border: `1.6px solid ${dup ? MARK : "#cbd5e1"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT,
                fontSize: 16,
                fontWeight: 900,
                color: dup ? MARK : INK,
              }}
            >
              {d}
            </motion.div>
          );
        })}
      </div>
      <div style={{ fontFamily: FONT, fontSize: 9.5, fontWeight: 700, color: DIM }}>
        {digits.length} digits, one repeated — a leading 0 wouldn't make a 4-digit number
      </div>

      <AnimatePresence>
        {showTrap && (
          <motion.div key="trap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "center", maxWidth: 280 }}>
              {invalidNums.map((n, i) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.06 }}
                  style={{ position: "relative", padding: "3px 8px", borderRadius: 6, background: "#fee2e2", border: `1.4px solid ${BAD}`, fontFamily: FONT, fontSize: 11, fontWeight: 800, color: BAD }}
                >
                  {n}
                  <div style={{ position: "absolute", left: 2, right: 2, top: "50%", height: 1.6, background: BAD, transform: "rotate(-8deg)" }} />
                </motion.div>
              ))}
            </div>
            <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 800, color: "#d97706", textAlign: "center", maxWidth: 300 }}>
              all {allPerms.length} arrangements (0-led included){trap ? ` matches choice ${trap.label}` : ""} — but a leading 0 isn't a 4-digit number
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {caseGroups.map((group, ci) => {
        const show = step >= 2 + ci;
        if (!show) return null;
        const color = caseColors[ci % caseColors.length];
        return (
          <div key={group.first} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 800, color }}>
              starts with {group.first}: {group.nums.length} numbers
            </div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "center", maxWidth: 280 }}>
              {group.nums.map((n, i) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, y: -8, scale: 0.6 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.07 }}
                  style={{ padding: "3px 8px", borderRadius: 6, background: `${color}18`, border: `1.4px solid ${color}`, fontFamily: FONT, fontSize: 12, fontWeight: 800, color }}
                >
                  {n}
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}

      <AnimatePresence>
        {showTotal && (
          <motion.div
            key="total"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            style={{ fontFamily: FONT, fontSize: 13, fontWeight: 800, color: isFinal ? WIN : INK }}
          >
            {caseGroups.map((g) => g.nums.length).join(" + ")} = {validNums.length}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
