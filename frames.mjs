/**
 * frames.mjs — Time ↔ Frame converter
 *
 * Usage:
 *   node frames.mjs <value> [fps]
 *
 * Input formats:
 *   node frames.mjs 1500ms        → frames (at 30fps)
 *   node frames.mjs 1.5s          → frames
 *   node frames.mjs 1:23.5        → frames  (mm:ss.ms)
 *   node frames.mjs 0:01:23.500   → frames  (hh:mm:ss.ms)
 *   node frames.mjs 45            → ms + seconds + timecode
 *   node frames.mjs 1500ms 25     → use 25fps instead of 30
 *
 * Range queries:
 *   node frames.mjs 30 90         → range info: duration in ms + seconds
 */

const args = process.argv.slice(2);
const FPS_DEFAULT = 30;

if (!args.length) {
  console.log("Usage: node frames.mjs <value> [fps]");
  console.log("Examples:");
  console.log("  node frames.mjs 1500ms     → 45 frames at 30fps");
  console.log("  node frames.mjs 45         → 1500ms | 1.500s | 0:01.500");
  console.log("  node frames.mjs 1:23.5     → 2505 frames");
  console.log("  node frames.mjs 30 90      → range: 60 frames = 2s");
  process.exit(0);
}

function parseTime(input) {
  // ms: "1500ms"
  if (/^\d+(\.\d+)?ms$/.test(input)) return parseFloat(input) / 1000;
  // s: "1.5s"
  if (/^\d+(\.\d+)?s$/.test(input)) return parseFloat(input);
  // mm:ss.ms
  if (/^\d+:\d{2}(\.\d+)?$/.test(input)) {
    const [min, sec] = input.split(":");
    return parseInt(min) * 60 + parseFloat(sec);
  }
  // hh:mm:ss.ms
  if (/^\d+:\d{2}:\d{2}(\.\d+)?$/.test(input)) {
    const [h, m, s] = input.split(":");
    return parseInt(h) * 3600 + parseInt(m) * 60 + parseFloat(s);
  }
  return null;
}

function toTimecode(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = (totalSeconds % 60).toFixed(3);
  return `${m}:${s.padStart(6, "0")}`;
}

// Detect fps argument (pure number as last arg if ≤ 120)
let fps = FPS_DEFAULT;
let inputs = [...args];
const lastArg = parseFloat(args[args.length - 1]);
if (args.length >= 2 && !isNaN(lastArg) && lastArg <= 120 && !/ms$/.test(args[args.length - 1]) && !/s$/.test(args[args.length - 1])) {
  // Could be fps or frame number — only treat as fps if there are >=2 inputs and first is time-like
  const firstIsTime = parseTime(args[0]) !== null;
  if (firstIsTime) {
    fps = lastArg;
    inputs = args.slice(0, -1);
  }
}

// Range mode: two plain integers
if (inputs.length === 2 && /^\d+$/.test(inputs[0]) && /^\d+$/.test(inputs[1])) {
  const a = parseInt(inputs[0]);
  const b = parseInt(inputs[1]);
  const [from, to] = a < b ? [a, b] : [b, a];
  const dur = to - from;
  const ms = (dur / fps) * 1000;
  console.log(`\n  Range: frame ${from} → ${to}`);
  console.log(`  ─────────────────────────`);
  console.log(`  Duration : ${dur} frames`);
  console.log(`  Time     : ${ms.toFixed(0)}ms | ${(ms/1000).toFixed(3)}s | ${toTimecode(ms/1000)}`);
  console.log(`  (at ${fps} fps)\n`);
  process.exit(0);
}

for (const input of inputs) {
  const seconds = parseTime(input);

  if (seconds !== null) {
    // Time → frames
    const frames = Math.round(seconds * fps);
    const ms = seconds * 1000;
    console.log(`\n  Input  : ${input}`);
    console.log(`  ─────────────────────────`);
    console.log(`  Frames : ${frames}  (at ${fps} fps)`);
    console.log(`  Time   : ${ms.toFixed(0)}ms | ${seconds.toFixed(3)}s | ${toTimecode(seconds)}`);
    console.log();
  } else if (/^\d+$/.test(input)) {
    // Frames → time
    const f = parseInt(input);
    const ms = (f / fps) * 1000;
    const sec = ms / 1000;
    console.log(`\n  Input  : ${f} frames`);
    console.log(`  ─────────────────────────`);
    console.log(`  Time   : ${ms.toFixed(0)}ms | ${sec.toFixed(3)}s | ${toTimecode(sec)}`);
    console.log(`  (at ${fps} fps)`);
    console.log();
  } else {
    console.log(`  ❌  Could not parse: "${input}"`);
  }
}
