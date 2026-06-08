import { buildTimeline } from "../timeline";

/**
 * הוסף סצנות כאן בסדר. start/end/total מחושבים אוטומטית.
 * Root.tsx ו-Composition.tsx שניהם מייבאים מכאן.
 */
export const T = buildTimeline([
  { id: "hook",    duration: 36  },  // faster hook (was 45)
  { id: "screen1", duration: 114 },  // total = 150
]);
