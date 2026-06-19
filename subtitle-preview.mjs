/**
 * subtitle-preview.mjs — multi-frame subtitle position check
 *
 * Usage:
 *   node subtitle-preview.mjs [comp] [frames...] [--scale=0.4]
 *
 * Examples:
 *   node subtitle-preview.mjs ThirtyPerMonth
 *   node subtitle-preview.mjs ThirtyPerMonth 60 300 600
 *   node subtitle-preview.mjs ThirtyPerMonth 60 300 600 --scale=0.3
 *
 * Default frames: 10%, 40%, 75% of the way through (auto from composition duration)
 * Output: preview/sub-[comp]-f[frame].png
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import path from "path";

const args     = process.argv.slice(2).filter(a => !a.startsWith("--"));
const flagArgs = process.argv.slice(2).filter(a => a.startsWith("--"));

const comp    = args[0] || "ThirtyPerMonth";
const scale   = (flagArgs.find(a => a.startsWith("--scale="))?.split("=")[1]) ?? "0.4";
const outDir  = "preview";

if (!existsSync(outDir)) mkdirSync(outDir);

// ── Resolve frames ────────────────────────────────────────────────────────────
let frames = args.slice(1).map(Number).filter(n => !isNaN(n));

if (frames.length === 0) {
  // Auto-detect duration from composition via a quick bundle check
  // Fall back to sensible defaults if we can't determine it
  try {
    const result = execSync(
      `npx remotion compositions --quiet 2>/dev/null || npx remotion compositions 2>&1`,
      { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
    );
    const match = result.match(new RegExp(`${comp}.*?(\\d+)\\s*frames`));
    if (match) {
      const total = parseInt(match[1]);
      frames = [
        Math.round(total * 0.10),
        Math.round(total * 0.40),
        Math.round(total * 0.75),
      ];
      console.log(`🔍  זיהוי אוטומטי: ${total} פריימים → בודק ב-${frames.join(", ")}`);
    }
  } catch {
    // ignore
  }

  if (frames.length === 0) {
    frames = [30, 150, 400];
    console.log(`ℹ️  פריימי ברירת מחדל: ${frames.join(", ")}`);
  }
}

// ── Render frames ─────────────────────────────────────────────────────────────
const results = [];
for (const frame of frames) {
  const outFile = path.join(outDir, `sub-${comp}-f${frame}.png`);
  console.log(`📸  ${comp}  frame=${frame}  scale=${scale}`);
  try {
    execSync(
      `npx remotion still ${comp} "${outFile}" --frame=${frame} --scale=${scale}`,
      { stdio: "inherit" }
    );
    results.push({ frame, file: outFile, ok: true });
  } catch {
    results.push({ frame, file: outFile, ok: false });
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log("\n── תוצאות ────────────────────────────────────────────────────");
for (const r of results) {
  console.log(r.ok ? `✅  frame ${r.frame} → ${r.file}` : `❌  frame ${r.frame} — נכשל`);
}
