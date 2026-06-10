import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
  Img,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Heebo";
import { z } from "zod";
import { BRAND } from "./brand";
import { Sequence } from "remotion";
import { PhoneEntrance } from "./components/PhoneEntrance";
import { CircleClick } from "./components/CircleClick";
import { T } from "./scenes/timeline";
import { Screen2 } from "./scenes/Screen2";
import { ScannerTransition } from "./scenes/ScannerTransition";
import { Screen3 } from "./scenes/Screen3";
import { Screen4 } from "./scenes/Screen4";
import { Screen5 } from "./scenes/Screen5";

const { fontFamily } = loadFont();

export const CompositionSchema = z.object({
  hookText: z.string(),
  subText: z.string(),
  ctaText: z.string(),
  screenImage: z.string(),
});

export type CompositionProps = z.infer<typeof CompositionSchema>;

// ── Speed sections (raw output frame ranges) ─────────────────────────────────
// Section 1: raw 30–45   → logical 30–60   (2×, saves 15 frames)
// Section 2: raw 95–120  → logical 110–185 (3×, saves 50 frames)
// Section 3: raw 180–195 → logical 245–290 (3×, saves 30 frames) [screen2 local 95–110]
// Section 4: raw 210–240 → logical 305–365 (2×, saves 30 frames)
export const SPEED_SAVINGS = 125; // total saved output frames

function remapFrame(raw: number): number {
  if (raw <= 30)   return raw;
  if (raw <= 45)   return 30 + (raw - 30) * 2;
  if (raw < 95)    return raw + 15;
  if (raw <= 120)  return 110 + (raw - 95) * 3;
  if (raw < 180)   return raw + 65;
  if (raw <= 195)  return 245 + (raw - 180) * 3;
  if (raw < 210)   return raw + 95;
  if (raw <= 240)  return 305 + (raw - 210) * 2;
  return raw + 125;
}

// Inverse of remapFrame — logical → raw (used for Sequence from/duration)
function logicalToRaw(logical: number): number {
  if (logical <= 30)   return logical;
  if (logical <= 60)   return 30 + (logical - 30) / 2;
  if (logical < 110)   return logical - 15;
  if (logical <= 185)  return 95 + (logical - 110) / 3;
  if (logical < 245)   return logical - 65;
  if (logical <= 290)  return 180 + (logical - 245) / 3;
  if (logical < 305)   return logical - 95;
  if (logical <= 365)  return 210 + (logical - 305) / 2;
  return logical - 125;
}

// ── Timings ───────────────────────────────────────────────────────────────────
const HOOK_PEAK  = 10;                          // fast punch (was 18)
const HOOK_HOLD  = 100;                         // hold until frame 100

const PHONE_IN   = T.screen1.start;             // 36 — enters immediately
const ZOOM_START = T.screen1.start + 26;        // 62
const ZOOM_END   = T.screen1.start + 54;        // 90 — aggressive ramp (was +75)
const GLOW_START = T.screen1.start + 54;        // 90

export const MyComposition: React.FC<CompositionProps> = ({
  hookText,
  subText,
  ctaText,
  screenImage,
}) => {
  const rawFrame = useCurrentFrame();
  const frame = remapFrame(rawFrame);
  useVideoConfig();

  // ── Hook text — scale punch + fast fade ──────────────────────────────────
  const hookOpacity = interpolate(
    frame,
    [T.hook.start, T.hook.start + HOOK_PEAK, HOOK_HOLD, T.hook.duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const hookY = interpolate(frame, [T.hook.start, HOOK_PEAK], [48, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const hookScale = interpolate(frame, [T.hook.start, HOOK_PEAK], [1.14, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Sub-text — staggered +5 frames
  const subOpacity = interpolate(
    frame,
    [T.hook.start + 5, T.hook.start + 14, HOOK_HOLD, T.hook.duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const subY = interpolate(frame, [T.hook.start + 5, HOOK_PEAK + 5], [26, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Slide out to left at end of screen 1 ─────────────────────────────────
  const slideOutX = interpolate(
    frame,
    [T.screen1.start + 94, T.screen1.start + 114],
    [0, -860],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    }
  );

  // ── Flash on phone arrival ────────────────────────────────────────────────
  const flashOpacity = interpolate(
    frame,
    [PHONE_IN, PHONE_IN + 4, PHONE_IN + 16],
    [0, 0.14, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Zoom into phone — more aggressive ────────────────────────────────────
  const zoomScale = interpolate(frame, [ZOOM_START, ZOOM_END], [1, 1.28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  return (
    <AbsoluteFill
      style={{ background: BRAND.bg, fontFamily, direction: "rtl", overflow: "hidden" }}
    >
      {/* Ambient glow */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(33,150,176,0.10) 0%, transparent 65%)",
        }}
      />

      {/* ════ LOGO ════ */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
          gap: 6,
          direction: "ltr",
          opacity: hookOpacity,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: 82,
            letterSpacing: "-0.04em",
            color: BRAND.text,
          }}
        >
          Clix
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: 70,
            letterSpacing: "-0.02em",
            color: BRAND.pink,
          }}
        >
          Automations
        </span>
      </div>

      {/* ════ HOOK TEXT ════ */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 22,
          padding: "0 80px",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            color: BRAND.text,
            fontSize: 72,
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.3,
            textShadow: "0 4px 60px rgba(33,150,176,0.35)",
            opacity: hookOpacity,
            transform: `translateY(${hookY}px) scale(${hookScale})`,
          }}
        >
          {hookText.includes("בפחות מדקה") ? (
            <>
              {hookText.replace("בפחות מדקה", "")}
              <span style={{ color: BRAND.pink }}>בפחות מדקה</span>
            </>
          ) : hookText}
        </div>
        <div
          style={{
            color: BRAND.muted,
            fontSize: 40,
            fontWeight: 400,
            textAlign: "center",
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
          }}
        >
          {subText}
        </div>
      </AbsoluteFill>

      {/* ════ PHONE ════ */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${slideOutX}px)`,
        }}
      >
        <div style={{ transform: `scale(${zoomScale})`, transformOrigin: "center center" }}>
          <PhoneEntrance variant="perspectiveLeft" delay={PHONE_IN}>
            <Img
              src={staticFile(screenImage)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <CircleClick
              frame={frame}
              imageY={470}
              imageX={425}
              startAt={GLOW_START}
              duration={20}
            />
          </PhoneEntrance>
        </div>
      </AbsoluteFill>

      {/* ════ FLASH on phone arrival ════ */}
      <AbsoluteFill
        style={{ background: "#ffffff", opacity: flashOpacity, pointerEvents: "none" }}
      />

      {/* ════ SCREEN 2 ════ */}
      <Sequence
        from={logicalToRaw(T.screen2.start)}
        durationInFrames={logicalToRaw(T.screen2.end) - logicalToRaw(T.screen2.start)}
      >
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: BRAND.bg,
          }}
        >
          <div style={{ transform: "scale(1.28)", transformOrigin: "center center" }}>
            <Screen2 startAt={T.screen2.start} logicalFrame={frame} />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* ════ SCANNER TRANSITION ════ */}
      <Sequence from={logicalToRaw(T.scannerTransition.start)} durationInFrames={T.scannerTransition.duration}>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: BRAND.bg,
          }}
        >
          <div style={{ transform: "scale(1.28)", transformOrigin: "center center" }}>
            <ScannerTransition />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* ════ SCREEN 3 ════ */}
      <Sequence
        from={logicalToRaw(T.screen3.start)}
        durationInFrames={logicalToRaw(T.screen3.end) - logicalToRaw(T.screen3.start)}
      >
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: BRAND.bg,
          }}
        >
          <div style={{ transform: "scale(1.28)", transformOrigin: "center center" }}>
            <Screen3 startAt={T.screen3.start} logicalFrame={frame} />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* ════ SCREEN 4 — Email notification ════ */}
      <Sequence
        from={logicalToRaw(T.screen4.start)}
        durationInFrames={logicalToRaw(T.screen4.end) - logicalToRaw(T.screen4.start)}
      >
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: BRAND.bg,
          }}
        >
          <div style={{ transform: "scale(1.28)", transformOrigin: "center center" }}>
            <Screen4 startAt={T.screen4.start} logicalFrame={frame} />
          </div>
        </AbsoluteFill>
      </Sequence>
      {/* ════ SCREEN 5 — CTA ════ */}
      <Sequence
        from={logicalToRaw(T.screen5.start)}
        durationInFrames={logicalToRaw(T.screen5.end) - logicalToRaw(T.screen5.start)}
      >
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: BRAND.bg,
          }}
        >
          <Screen5 startAt={T.screen5.start} logicalFrame={frame} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
