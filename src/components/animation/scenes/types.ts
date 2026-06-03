import type { ComponentType } from "react";
import type { Problem } from "../../../types/amc";

/**
 * Contract every animated scene implements. The player owns the timeline and
 * passes the current step down; the scene reads what it needs from the problem
 * (statement, solution steps, answer, animation data) and draws/animates it.
 */
export interface AnimatedSceneProps {
  problem: Problem;
  /** 0-based index of the current step in the timeline. */
  step: number;
  /** Total number of steps the player will advance through. */
  totalSteps: number;
}

export type AnimatedScene = ComponentType<AnimatedSceneProps>;
