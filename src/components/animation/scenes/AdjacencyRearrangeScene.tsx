import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";

function strList(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => String(v)) : [];
}

function pairList(value: unknown): [string, string][] {
  return Array.isArray(value)
    ? value
        .filter((p) => Array.isArray(p) && p.length >= 2)
        .map((p) => [String(p[0]), String(p[1])] as [string, string])
    : [];
}

function arrList(value: unknown): string[][] {
  return Array.isArray(value)
    ? value.filter((a) => Array.isArray(a)).map((a) => (a as unknown[]).map((v) => String(v)))
    : [];
}

// A row of people (emoji + label) laid out horizontally.
function PeopleRow({
  order,
  icons,
  labelOf,
  dim = false,
}: {
  order: string[];
  icons: Record<string, string>;
  labelOf: (item: string) => string;
  dim?: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "flex-end", opacity: dim ? 0.55 : 1 }}>
      {order.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            width: 44,
            padding: "6px 0 4px",
            borderRadius: 10,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        >
          <span style={{ fontSize: 22, lineHeight: 1 }}>{icons[item] ?? "🙂"}</span>
          <span style={{ fontFamily: numberFont, fontSize: 13, fontWeight: 700, color: "#1f2a44" }}>
            {labelOf(item)}
          </span>
        </div>
      ))}
    </div>
  );
}

// "Rearrange so no one sits next to a former neighbor" — an adjacency-constraint
// counting problem. Step 1 shows the original row with the forbidden neighbor
// links marked ✕; the final step reveals every valid rearrangement (each checked
// against the forbidden set) and the count.
// Data: { items:[...], icons?:[...], forbidden:[[a,b],...], valid:[[...],...] }.
export function AdjacencyRearrangeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const items = strList(data.items);
  const iconArr = strList(data.icons);
  const forbidden = pairList(data.forbidden);
  const valid = arrList(data.valid);

  const icons: Record<string, string> = {};
  items.forEach((it, i) => {
    if (iconArr[i]) icons[it] = iconArr[i];
  });
  const labelOf = (item: string) => item;

  // A pair is forbidden regardless of order.
  const isForbidden = (a: string, b: string) =>
    forbidden.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
  // An arrangement is valid when no adjacent pair is forbidden (derived, not trusted).
  const arrangementOk = (order: string[]) =>
    order.every((_, i) => i === 0 || !isForbidden(order[i - 1], order[i]));

  const last = totalSteps - 1;
  const reveal = step >= last;
  // The scene already shows the count, so the badge points back with the letter.
  const answer = problem.answer ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%", padding: "8px 4px" }}>
      {/* Original seating with forbidden neighbor links */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: 0.4 }}>ORIGINAL ROW</span>
        <div style={{ position: "relative", display: "flex", gap: 6, alignItems: "flex-end" }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  width: 44,
                  padding: "6px 0 4px",
                  borderRadius: 10,
                  background: "#eef2ff",
                  border: "1px solid #c7d2fe",
                }}
              >
                <span style={{ fontSize: 22, lineHeight: 1 }}>{icons[item] ?? "🙂"}</span>
                <span style={{ fontFamily: numberFont, fontSize: 13, fontWeight: 700, color: "#1f2a44" }}>
                  {labelOf(item)}
                </span>
              </div>
              {i < items.length - 1 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.15 + i * 0.12 }}
                  title="were neighbors — can't sit together"
                  style={{ fontSize: 15, fontWeight: 900, color: "#dc2626" }}
                >
                  ✕
                </motion.span>
              )}
            </div>
          ))}
        </div>
        <span style={{ fontSize: 12, color: "#dc2626", fontWeight: 600 }}>
          ✕ = were neighbors, can't sit together again
        </span>
      </div>

      {/* Valid rearrangements */}
      <AnimatePresence>
        {reveal && (
          <motion.div
            key="valid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: 0.4 }}>
              VALID REARRANGEMENTS
            </span>
            {valid.map((order, i) => {
              const ok = arrangementOk(order);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.15 + i * 0.18 }}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <PeopleRow order={order} icons={icons} labelOf={labelOf} dim={!ok} />
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.35 + i * 0.18 }}
                    style={{ fontSize: 20, fontWeight: 900, color: ok ? "#16a34a" : "#dc2626" }}
                  >
                    {ok ? "✓" : "✗"}
                  </motion.span>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reveal && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 + valid.length * 0.18 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            {valid.length} valid → Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
