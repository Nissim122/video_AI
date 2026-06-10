import { buildTimeline } from "../timeline";
import { SCREEN2_DURATION } from "./Screen2";
import { SCANNER_DURATION } from "./ScannerTransition";
import { SCREEN3_DURATION } from "./Screen3";
import { SCREEN4_DURATION } from "./Screen4";
import { SCREEN5_DURATION } from "./Screen5";

export const T = buildTimeline([
  { id: "hook",              duration: 36             },
  { id: "screen1",           duration: 114            },
  { id: "screen2",           duration: SCREEN2_DURATION },
  { id: "scannerTransition", duration: SCANNER_DURATION },
  { id: "screen3",           duration: SCREEN3_DURATION },
  { id: "screen4",           duration: SCREEN4_DURATION },
  { id: "screen5",           duration: SCREEN5_DURATION },
]);
