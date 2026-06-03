import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { answerOf, num, sceneData } from "./sceneKit";

// Counting via the multiplication principle (e.g. "numbers with no digit 1").
// Data: { slots, choices } for uniform slots, or { choicesPerSlot: [...] };
// optional { adjustment } for a final correction (e.g. -1 to drop 000).
// Walks the three beats: show the slots -> fill choices & multiply -> adjust.
export function DigitSlotsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const answer = answerOf(problem);

  const perSlot = Array.isArray(data.choicesPerSlot)
    ? data.choicesPerSlot.map((value) => num(value, 0))
    : null;
  const slotCount = perSlot ? perSlot.length : Math.max(1, Math.min(6, num(data.slots, 3)));
  const choices = perSlot ?? Array.from({ length: slotCount }, () => num(data.choices, 9));

  const product = choices.reduce((acc, value) => acc * value, 1);
  const adjustment = num(data.adjustment, 0);
  const result = product + adjustment;

  const last = totalSteps - 1;
  const showChoices = step >= 1;
  const showProduct = step >= 1;
  const final = step >= last;
  const showAdjust = final && adjustment !== 0;

  const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "100%", padding: "12px 4px" }}>
      <div style={{ display: "flex", gap: 10 }}>
        {choices.map((count, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 16, delay: i * 0.1 }}
            style={{ width: 50, height: 62, borderRadius: 10, border: "2px solid #1f2a44", display: "grid", placeItems: "center", background: "#fff" }}
          >
            <AnimatePresence mode="wait">
              {showChoices ? (
                <motion.span
                  key="count"
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 240, damping: 14, delay: i * 0.08 }}
                  style={{ fontSize: 26, fontWeight: 800, color: "#4338ca", fontFamily: numberFont }}
                >
                  {count}
                </motion.span>
              ) : (
                <motion.span key="q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 24, fontWeight: 700, color: "#cbd5e1" }}>
                  ?
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>
        {slotCount} slots · choices each
      </div>

      <AnimatePresence>
        {showProduct && (
          <motion.div
            key="product"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ fontSize: 22, fontWeight: 700, color: "#1f2a44", fontFamily: numberFont }}
          >
            {choices.join(" × ")} = {product}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdjust && (
          <motion.div
            key="adjust"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ fontSize: 20, fontWeight: 700, color: "#1f2a44", fontFamily: numberFont }}
          >
            {product} {adjustment < 0 ? "−" : "+"} {Math.abs(adjustment)} = {result}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {final && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
