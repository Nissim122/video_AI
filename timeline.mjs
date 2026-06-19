/**
 * timeline.mjs — Visual event timeline for any video config
 *
 * Loads the compiled config for a composition and prints all events
 * sorted by frame, so you can understand what happens when — without
 * reading config code.
 *
 * Usage:
 *   node timeline.mjs <VideoName>
 *
 * Examples:
 *   node timeline.mjs ThirtyPerMonth
 *   node timeline.mjs Chofshi
 *
 * Output:
 *   frame   0  │ logo (top-right) · drift:both · grade:cinematic
 *   frame  15  │ fadeIn logo
 *   frame  50  │ AEText "עסק" (y=0.5)
 *   frame 120  │ textPop "חוסך 10 שעות" [pink]
 *   ...
 *   frame 870  │ ── FADE OUT ──
 *   frame 900  │ outro "רוצה אוטומציה?"
 *
 * Requires: esbuild-register (for importing .ts files directly)
 *   npm install -D esbuild-register   (if not already installed)
 */

import { execSync } from "child_process";
import { existsSync, writeFileSync, unlinkSync } from "fs";
import path from "path";

const compArg = process.argv[2];
if (!compArg) {
  console.log("Usage: node timeline.mjs <VideoName>");
  console.log("Example: node timeline.mjs ThirtyPerMonth");
  process.exit(1);
}

// ── Find the config file ──────────────────────────────────────────────────────
// Map comp name → directory (case-insensitive folder match)
import { readdirSync } from "fs";

const videosDir = path.join(process.cwd(), "src", "videos");
let configPath = null;

for (const dir of readdirSync(videosDir)) {
  if (dir.toLowerCase() === compArg.toLowerCase() ||
      dir.replace(/[-_]/g, "").toLowerCase() === compArg.toLowerCase().replace(/[-_]/g, "") ||
      compArg.toLowerCase().includes(dir.toLowerCase())) {
    const candidate = path.join(videosDir, dir, "config.ts");
    if (existsSync(candidate)) {
      configPath = candidate;
      break;
    }
  }
}

if (!configPath) {
  // Try direct match: "30bachodesh" → "ThirtyPerMonth" → no match → show list
  const dirs = readdirSync(videosDir).filter(d =>
    existsSync(path.join(videosDir, d, "config.ts"))
  );
  console.log(`❌  Could not find config for "${compArg}"`);
  console.log(`   Available: ${dirs.join(", ")}`);
  process.exit(1);
}

console.log(`\n📋  Timeline for: ${compArg}`);
console.log(`    Config: ${configPath.replace(process.cwd(), ".")}\n`);

// ── Extract config via esbuild-register ──────────────────────────────────────
// We write a small loader script and run it with esbuild-register
const loaderScript = path.join(process.cwd(), "__tl_loader__.cjs");
writeFileSync(loaderScript, `
const { register } = require("esbuild-register/dist/node.js");
register({ format: "cjs", target: "node18" });
const mod = require(${JSON.stringify(configPath)});
const config = mod.VIDEO_CONFIG || mod.CONFIG || mod.default;
if (!config) { console.error("No VIDEO_CONFIG export found"); process.exit(1); }
process.stdout.write(JSON.stringify(config, null, 2));
`);

let config;
try {
  const json = execSync(`node "${loaderScript}"`, { encoding: "utf-8", cwd: process.cwd(), stdio: ["pipe", "pipe", "pipe"] });
  config = JSON.parse(json);
} catch (e) {
  console.error("❌  Failed to load config:", e.message);
  process.exit(1);
} finally {
  try { unlinkSync(loaderScript); } catch { /* ignore */ }
}

const FPS = 30;
const events = [];

function t(frame) {
  const sec = frame / FPS;
  const m = Math.floor(sec / 60);
  const s = (sec % 60).toFixed(1);
  return `${m}:${s.padStart(4, "0")}`;
}

function push(frame, label, extra = "") {
  events.push({ frame: frame ?? 0, label, extra });
}

// ── Parse config into events ──────────────────────────────────────────────────

// Always-on features
if (config.grade?.show) push(0, "grade", `tone:${config.grade.tone} vignette:${config.grade.vignetteStrength}`);
if (config.topVignette) push(0, "topVignette", "");
if (config.logo?.show) push(config.logo.fadeInFrame ?? 0, "logo", `corner:${config.logo.corner}`);
if (config.drift?.enabled) push(0, "drift", `mode:${config.drift.mode} pan:${config.drift.panAmount}px`);
if (config.caConfig?.enabled) push(0, "chromaticAberration", `base:${config.caConfig.baseIntensity}`);
if (config.particleField?.show) push(config.particleField.enterFrame ?? 0, "particleField", `count:${config.particleField.count}`);

// Arrays
(config.aeTexts ?? []).forEach(x => push(x.enterFrame, "AEText", `"${x.text}" y=${x.positionY ?? "?"} mode=${x.mode ?? "chars"}`));
(config.textPops ?? []).forEach(x => push(x.enterFrame, "textPop", `"${x.text}" style=${x.style ?? "default"}`));
(config.kineticTexts ?? []).forEach((x, i) => {
  const first = x.words?.[0];
  push(first?.frame ?? 0, "kineticText", `${x.words?.length} words style:${x.style ?? "pop"}`);
});
(config.bulletLists ?? []).forEach(x => {
  const first = x.items?.[0];
  push(first?.frame ?? 0, "bulletList", `${x.items?.length} items`);
});
(config.statCards ?? []).forEach(x => push(x.enterFrame, "statCard", `${x.prefix ?? ""}${x.value}${x.suffix ?? ""} "${x.label}"`));
(config.ctaButtons ?? []).forEach(x => push(x.enterFrame, "CTA", `"${x.text}"`));
(config.lowerThirds ?? []).forEach(x => push(x.enterFrame, "lowerThird", `"${x.name}" | ${x.title ?? ""}`));
(config.callouts ?? []).forEach(x => push(x.enterFrame, "callout", `"${x.text}" @(${x.arrowX},${x.arrowY})`));
(config.highlights ?? []).forEach(x => push(x.enterFrame, "highlight", `${x.style ?? "box"} @(${x.x},${x.y}) ${x.width}×${x.height}`));
(config.brolls ?? []).forEach(x => push(x.enterFrame, "broll", `${x.content.type}:"${x.content.src}" → ${x.exitFrame}`));
(config.pips ?? []).forEach(x => push(x.enterFrame, "pip", `${x.content.type}:"${x.content.src}" from=${x.enterFrom ?? "bottom"}`));
(config.fades ?? []).forEach(x => {
  if (x.fadeOutFrame !== undefined) push(x.fadeOutFrame, "── FADE OUT ──", "");
  if (x.fadeInFrame !== undefined) push(x.fadeInFrame, "── FADE IN ──", "");
});
(config.stripTransitions ?? []).forEach(x => push(x.triggerFrame, "stripTransition", `mode:${x.mode} dir:${x.direction} strips:${x.strips}`));
(config.irisTransitions ?? []).forEach(x => push(x.triggerFrame, "irisTransition", `mode:${x.mode}`));
(config.smartZooms ?? []).forEach(x => push(x.startFrame, "smartZoom", `scale:${x.scale} focus:(${x.focusX},${x.focusY}) → frame ${x.endFrame}`));
(config.whipPans ?? []).forEach(x => push(x.frame, "whipPan", `dir:${x.direction} intensity:${x.intensity ?? 1}`));
(config.shakes ?? []).forEach(x => push(x.frame ?? x.startFrame ?? 0, "cameraShake", `intensity:${x.intensity}`));
(config.zoomBursts ?? []).forEach(x => push(x.frame ?? x.triggerFrame ?? 0, "zoomBurst", ""));
(config.punches ?? []).forEach(x => push(x.frame, "punch", `type:${x.type}`));
(config.motionBlurs ?? []).forEach(x => push(x.frame ?? 0, "motionBlur", `strength:${x.strength}`));
(config.dofEvents ?? []).forEach(x => push(x.frame ?? 0, "depthOfField", ""));
(config.lensFlares ?? []).forEach(x => push(x.frame ?? 0, "lensFlare", ""));
(config.anamorphicStreaks ?? []).forEach(x => push(x.frame ?? 0, "anamorphicStreak", ""));
(config.reactions ?? []).forEach(x => push(x.frame, "reaction", `"${x.text}" side:${x.side ?? "left"}`));
(config.checks ?? []).forEach(x => push(x.enterFrame, "checkmark", x.label ?? ""));
(config.progressRings ?? []).forEach(x => push(x.enterFrame, "progressRing", `${x.targetPercent ?? 100}% dur:${x.durationFrames}f`));
(config.flows ?? []).forEach(x => push(x.enterFrame, "automationFlow", `${x.nodes?.length} nodes`));
(config.chats ?? []).forEach(x => {
  const first = x.messages?.[0];
  push(first?.frame ?? 0, "chat", `${x.messages?.length} messages`);
});
(config.notifications ?? []).forEach(x => push(x.enterFrame, "notification", `[${x.app}] "${x.title}"`));
(config.typewriters ?? []).forEach(x => push(x.enterFrame, "typewriter", `"${x.text}"`));
(config.morphs ?? []).forEach(x => push(x.morphFrame, "morph", `"${x.from}" → "${x.to}"`));
(config.scrambles ?? []).forEach(x => push(x.enterFrame, "scramble", `"${x.text}"`));
(config.gradientTexts ?? []).forEach(x => push(x.enterFrame, "gradientText", `"${x.text}"`));
(config.wordHighlights ?? []).forEach(x => push(x.startFrame, "wordHighlight", `${x.words?.length} words`));
(config.socialHandles ?? []).forEach(x => push(x.enterFrame, "socialHandle", `${x.platform}:"${x.handle}"`));
(config.spotlights ?? []).forEach(x => push(x.enterFrame, "spotlight", `cx:${x.cx ?? "center"} r:${x.radius ?? "?"}`));
(config.glowPulses ?? []).forEach(x => push(x.enterFrame ?? 0, "glowPulse", `color:${x.color ?? "?"}`));
(config.drawPaths ?? []).forEach(x => push(x.enterFrame, "drawPath", `(${x.x1},${x.y1})→(${x.x2},${x.y2})`));
(config.countdowns ?? []).forEach(x => push(x.enterFrame, "countdown", `${x.from}→${x.to ?? 0}`));
(config.floatingEmojis ?? []).forEach(x => push(x.frame ?? 0, "floatingEmoji", x.emoji ?? ""));
(config.textLineReveals ?? []).forEach(x => {
  const first = x.lines?.[0];
  push(first?.frame ?? 0, "textLineReveal", `${x.lines?.length} lines`);
});
(config.personBursts ?? []).forEach(x => push(x.enterFrame, "personBurst", `${x.elements?.length} elements`));
(config.trackedOverlays ?? []).forEach(x => push(x.enterFrame ?? 0, "trackedOverlay", `type:${x.type}`));
(config.subtitles ?? []).forEach((x, i) => push(0, "subtitles", `track ${i + 1}: ${x.captions?.length ?? "?"} captions`));

if (config.outro?.show) push(config.outro.enterFrame, "── OUTRO ──", `"${config.outro.ctaText}"`);

// ── Sort and print ────────────────────────────────────────────────────────────
events.sort((a, b) => a.frame - b.frame || a.label.localeCompare(b.label));

const totalFrames = config.durationInFrames ?? "?";
const totalSec = typeof totalFrames === "number" ? (totalFrames / FPS).toFixed(1) : "?";
console.log(`  Duration: ${totalFrames} frames | ${totalSec}s | ${t(totalFrames ?? 0)}\n`);

const maxFrame = String(totalFrames).length;
const LINE = "─".repeat(70);
let lastFrame = null;

for (const { frame, label, extra } of events) {
  if (lastFrame !== null && frame - lastFrame > 60) {
    console.log(`  ${"·".repeat(50)}`);
  }
  const frameStr = String(frame).padStart(maxFrame, " ");
  const tc = t(frame).padStart(7, " ");
  const extStr = extra ? `  ·  ${extra}` : "";
  console.log(`  frame ${frameStr}  ${tc}  │  ${label}${extStr}`);
  lastFrame = frame;
}

console.log(`\n  ${LINE}`);
console.log(`  Total events: ${events.length}  |  ${totalFrames} frames  |  ${totalSec}s`);
console.log(`  FPS: ${FPS}\n`);
