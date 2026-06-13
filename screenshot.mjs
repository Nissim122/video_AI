/**
 * Screenshot helper — renders a single frame from any composition.
 *
 * Usage:
 *   node screenshot.mjs [comp] [frame] [scale]
 *
 * Examples:
 *   node screenshot.mjs                          → MyComp, frame 0, scale 0.4
 *   node screenshot.mjs MyComp 90          → frame 90
 *   node screenshot.mjs ChofshiVideo 150 0.3     → different scale
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import path from "path";

const comp  = process.argv[2] || "MyComp";
const frame = process.argv[3] || "0";
const scale = process.argv[4] || "0.4";

const outDir = "preview";
if (!existsSync(outDir)) mkdirSync(outDir);

const outFile = path.join(outDir, `${comp}-f${frame}.png`);

console.log(`📸  ${comp}  frame=${frame}  scale=${scale}`);

execSync(
  `npx remotion still ${comp} ${outFile} --frame=${frame} --scale=${scale}`,
  { stdio: "inherit" }
);

console.log(`✅  Saved → ${outFile}`);
