import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const ROMAN = ["I", "II", "III", "IV", "V"];

type Statement = { type: "oldest" | "youngest"; person: string; negate: boolean };

function strList(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => String(v)) : [];
}
function statementList(value: unknown): Statement[] {
  if (!Array.isArray(value)) return [];
  return value.map((s) => {
    const o = (s ?? {}) as Record<string, unknown>;
    return {
      type: o.type === "youngest" ? "youngest" : "oldest",
      person: o.person != null ? String(o.person) : "?",
      negate: Boolean(o.negate),
    };
  });
}

function permutations<T>(items: T[]): T[][] {
  if (items.length <= 1) return [items];
  const out: T[][] = [];
  for (let i = 0; i < items.length; i++) {
    const rest = [...items.slice(0, i), ...items.slice(i + 1)];
    for (const p of permutations(rest)) out.push([items[i], ...p]);
  }
  return out;
}

function describe(s: Statement): string {
  return s.negate ? `${s.person} is not ${s.type}` : `${s.person} is ${s.type}`;
}

/**
 * Exactly one of several ranking statements is true — rather than chaining
 * implications by hand, the scene brute-forces every ordering of the
 * people and counts how many statements each one satisfies, keeping only
 * the ordering with exactly one true. Five beats: (0) the statements;
 * (1) every ordering tested, truth counts landing live; (2) the trap — the
 * orderings with two true statements, crossed out; (3) the lone survivor
 * isolated; (4) the final ranking and badge. Data: { people: string[],
 * statements: [{type:"oldest"|"youngest", person, negate}] }.
 */
export function SoleTrueStatementScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const people = strList(data.people);
  const statements = statementList(data.statements);
  if (people.length < 3 || statements.length < 2) return null;

  const perms = permutations(people);
  const evaluate = (order: string[], s: Statement) => {
    const rank = order.indexOf(s.person);
    const holds = s.type === "oldest" ? rank === 0 : rank === order.length - 1;
    return s.negate ? !holds : holds;
  };
  const rows = perms.map((order) => ({
    order,
    trueFlags: statements.map((s) => evaluate(order, s)),
    trueCount: statements.filter((s) => evaluate(order, s)).length,
  }));
  const survivors = rows.filter((r) => r.trueCount === 1);
  const winner = survivors.length === 1 ? survivors[0] : null;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showRows = step >= 1;
  const showElim = step >= 2;
  const showWinner = step >= 3 || isFinal;

  const caption = isFinal
    ? `${winner ? winner.order.join(", ") : "no unique ordering"} — oldest to youngest`
    : step === 0
    ? `exactly 1 of ${statements.length} statements is true`
    : showWinner
    ? "one ordering survives with exactly 1 true"
    : showElim
    ? "cross out every ordering with more than 1 true"
    : `testing all ${perms.length} orderings`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {statements.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              display: "flex",
              gap: 6,
              alignItems: "center",
              fontFamily: FONT,
              fontSize: 10.5,
              fontWeight: 700,
              color: INK,
            }}
          >
            <span style={{ width: 18, height: 18, borderRadius: 4, background: `${MARK}18`, border: `1.2px solid ${MARK}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: MARK }}>
              {ROMAN[i] ?? i + 1}
            </span>
            {describe(s)}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showRows && (
          <motion.div key="rows" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 3, maxHeight: 160, overflowY: "auto" }}>
            {rows.map((r, i) => {
              const eliminated = showElim && r.trueCount !== 1;
              const isWinner = showWinner && r.trueCount === 1;
              return (
                <motion.div
                  key={r.order.join("-")}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                    fontFamily: FONT,
                    fontSize: 9.5,
                    fontWeight: 700,
                    color: isWinner ? WIN : eliminated ? BAD : INK,
                    textDecoration: eliminated ? "line-through" : "none",
                    opacity: eliminated ? 0.5 : 1,
                  }}
                >
                  <span style={{ width: 130 }}>{r.order.join(", ")}</span>
                  <span
                    style={{
                      padding: "1px 6px",
                      borderRadius: 999,
                      background: r.trueCount === 1 ? "#dcfce7" : "#fee2e2",
                      color: r.trueCount === 1 ? WIN : BAD,
                      fontSize: 8.5,
                    }}
                  >
                    {r.trueCount} true
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 800,
          color: isFinal ? "#166534" : INK,
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      {isFinal && !winner && (
        <span style={{ fontFamily: FONT, fontSize: 10.5, fontWeight: 700, color: BAD }}>
          check failed: {survivors.length} orderings have exactly 1 true statement
        </span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
