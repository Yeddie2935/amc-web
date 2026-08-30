import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const NAVY = "#1f2a44";
const INDIGO = "#4338ca";
const GREEN = "#16a34a";
const AMBER = "#b45309";

function permute<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr];
  return arr.flatMap((v, i) => permute([...arr.slice(0, i), ...arr.slice(i + 1)]).map((rest) => [v, ...rest]));
}

function CarSeats({ driver, front, backL, backR, driverColor }: { driver: string; front: string; backL: string; backR: string; driverColor: string }) {
  const seat = (x: number, y: number, label: string, color: string) => (
    <g>
      <rect x={x - 24} y={y - 16} width={48} height={32} rx={7} fill={`${color}22`} stroke={color} strokeWidth={1.6} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={color} fontFamily={FONT}>
        {label}
      </text>
    </g>
  );
  return (
    <g>
      <rect x={2} y={2} width={140} height={96} rx={16} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1.4} />
      {seat(38, 26, driver, driverColor)}
      {seat(104, 26, front, INDIGO)}
      {seat(38, 74, backL, INDIGO)}
      {seat(104, 74, backR, INDIGO)}
    </g>
  );
}

/**
 * A 4-seat car with one restricted seat (only some people can drive) and
 * three open seats. The driver choice and the permutation of everyone else
 * are independent, so the total is their product — enumerated, not asserted.
 * Data: { people: [...4 names], driversAllowed: [...names who can drive] }.
 */
export function CarSeatPermutationScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const people = (Array.isArray(data.people) ? data.people : []).map(String);
  const driversAllowed = (Array.isArray(data.driversAllowed) ? data.driversAllowed : []).map(String);

  const firstDriver = driversAllowed[0];
  const restForFirst = people.filter((p) => p !== firstDriver);
  const orders = permute(restForFirst);
  const total = driversAllowed.length * orders.length;

  const last = totalSteps - 1;
  const showDriverChoices = step >= 1;
  const showOrders = step >= 2;
  const isFinal = step >= last;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      {!showOrders && (
        <svg viewBox="0 0 144 100" width="100%" style={{ maxWidth: 200 }}>
          <CarSeats driver={showDriverChoices ? "?" : "?"} front="?" backL="?" backR="?" driverColor={AMBER} />
        </svg>
      )}

      <AnimatePresence>
        {showDriverChoices && !showOrders && (
          <motion.div key="drivers" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", gap: 16 }}>
            {driversAllowed.map((d) => (
              <div key={d} style={{ padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${AMBER}`, background: "#fffbeb", fontFamily: FONT, fontSize: 12, fontWeight: 800, color: AMBER }}>
                {d} drives
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOrders && (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {driversAllowed.filter((_, di) => isFinal || di === 0).map((d, di) => (
              <div key={d} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 800, color: AMBER, textAlign: "center" }}>
                  {d} drives — {orders.length} orders for the rest
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", maxWidth: 360 }}>
                  {(di === 0 ? orders : permute(people.filter((p) => p !== d))).map((order, oi) => (
                    <motion.svg
                      key={oi}
                      viewBox="0 0 144 100"
                      width={72}
                      height={50}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 240, damping: 20, delay: (di * orders.length + oi) * 0.03 }}
                    >
                      <CarSeats driver={d} front={order[0]} backL={order[1]} backR={order[2]} driverColor={AMBER} />
                    </motion.svg>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 700, color: NAVY, textAlign: "center", maxWidth: 320 }}>
        {!showDriverChoices
          ? "4 seats: driver, front passenger, 2 back seats"
          : !showOrders
          ? `only ${driversAllowed.join(" or ")} can drive — ${driversAllowed.length} choices for the driver seat`
          : `for each driver, the other 3 people fill 3 seats in ${orders.length} ways`}
      </motion.div>

      <AnimatePresence>
        {isFinal && (
          <motion.div key="mult" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: FONT, fontSize: 16, fontWeight: 800, color: GREEN }}>
            {driversAllowed.length} × {orders.length} = {total}
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
