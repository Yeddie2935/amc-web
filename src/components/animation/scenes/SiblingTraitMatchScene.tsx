import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const NAVY = "#1f2a44";
const GREEN = "#16a34a";
const RED = "#dc2626";

type Child = { name: string; eye: string; hair: string };

const eyeColor: Record<string, string> = { Blue: "#2563eb", Brown: "#92400e" };
const hairColor: Record<string, string> = { Black: "#1f2a44", Blonde: "#eab308" };

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontFamily: FONT, fontSize: 9.5, fontWeight: 700, color }}>
      <span style={{ width: 8, height: 8, borderRadius: 4, background: color, display: "inline-block" }} />
      {label}
    </span>
  );
}

/**
 * Six children, two traits each, split into two families of three where
 * every pair within a family shares at least one trait. Jim's candidates are
 * whoever shares a trait with him directly; among those candidates, the only
 * pair that ALSO shares a trait with each other is the valid pair of
 * siblings — computed by real pairwise comparison, not asserted.
 * Data: { children: [{name,eye,hair}, ...], jim: "Jim" }.
 */
export function SiblingTraitMatchScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const children: Child[] = Array.isArray(data.children) ? (data.children as Child[]) : [];
  const jimName = data.jim != null ? String(data.jim) : "Jim";
  const jim = children.find((c) => c.name === jimName);

  const shares = (a: Child, b: Child) => a.eye === b.eye || a.hair === b.hair;

  const others = children.filter((c) => c.name !== jimName);
  const candidates = jim ? others.filter((c) => shares(jim, c)) : [];
  const rejected = jim ? others.filter((c) => !shares(jim, c)) : [];

  // among candidates, find a pair that also share a trait with each other
  let siblingPair: [Child, Child] | null = null;
  for (let i = 0; i < candidates.length && !siblingPair; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      if (shares(candidates[i], candidates[j])) {
        siblingPair = [candidates[i], candidates[j]];
        break;
      }
    }
  }

  const last = totalSteps - 1;
  const showCompare = step >= 1;
  const showPairwise = step >= 2;
  const isFinal = step >= last;

  const siblingNames = new Set(siblingPair ? [siblingPair[0].name, siblingPair[1].name] : []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%", maxWidth: 320 }}>
        {children.map((c) => {
          const isJim = c.name === jimName;
          const isCandidate = showCompare && candidates.includes(c);
          const isRejected = showCompare && rejected.includes(c);
          const isSibling = showPairwise && siblingNames.has(c.name);
          const bg = isJim ? "#eef2ff" : isSibling ? "#f0fdf4" : isRejected ? "#fef2f2" : "#f8fafc";
          const border = isJim ? "#4338ca" : isSibling ? GREEN : isRejected ? "#fca5a5" : "#e2e8f0";
          return (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 1fr 20px",
                alignItems: "center",
                gap: 6,
                padding: "4px 8px",
                borderRadius: 6,
                background: bg,
                border: `1.3px solid ${border}`,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: isJim ? 900 : 700, color: NAVY, fontFamily: FONT }}>{c.name}</span>
              <Chip label={c.eye} color={eyeColor[c.eye] ?? NAVY} />
              <Chip label={c.hair} color={hairColor[c.hair] ?? NAVY} />
              {showCompare && !isJim && (
                <span style={{ fontSize: 11, fontWeight: 900, color: candidates.includes(c) ? GREEN : RED, textAlign: "center" }}>{candidates.includes(c) ? "✓" : "✗"}</span>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: NAVY, textAlign: "center", maxWidth: 320 }}>
        {!showCompare
          ? `${jimName} has ${jim?.eye} eyes and ${jim?.hair} hair`
          : !showPairwise
          ? `${candidates.map((c) => c.name).join(", ")} each share a trait with ${jimName}; ${rejected.map((c) => c.name).join(" and ")} share nothing`
          : siblingPair
          ? `${siblingPair[0].name} and ${siblingPair[1].name} also share a trait with each other — the only valid pair`
          : "no valid pair found among the candidates"}
      </motion.div>

      <AnimatePresence>
        {showPairwise && candidates.length === 3 && (
          <motion.div key="pairwise" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {candidates.flatMap((a, i) =>
              candidates.slice(i + 1).map((b) => {
                const ok = shares(a, b);
                return (
                  <div key={`${a.name}-${b.name}`} style={{ fontFamily: FONT, fontSize: 10, fontWeight: 800, color: ok ? GREEN : RED, textAlign: "center" }}>
                    {a.name} & {b.name}: {ok ? "share a trait ✓" : "share nothing ✗"}
                  </div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && siblingPair && (
          <motion.div key="win" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: FONT, fontSize: 14, fontWeight: 800, color: GREEN }}>
            {jimName}'s siblings: {siblingPair[0].name} and {siblingPair[1].name}
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
            style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
