import { createContext } from "react";
import type { Problem } from "../../types/amc";
export const LessonBankContext = createContext<readonly Problem[]>([]);
