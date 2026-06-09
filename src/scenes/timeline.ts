import { buildTimeline } from "../timeline";
import { SCREEN2_DURATION } from "./Screen2";
import { SCANNER_DURATION } from "./ScannerTransition";

export const T = buildTimeline([
  { id: "hook",              duration: 36             },
  { id: "screen1",           duration: 114            },
  { id: "screen2",           duration: SCREEN2_DURATION },
  { id: "scannerTransition", duration: SCANNER_DURATION },
]);
