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
import { GlowHighlight } from "./components/GlowHighlight";
import { SCREEN_1_PAIN } from "./screens/screen-1-pain.coords";
import { T } from "./scenes/timeline";
import { Screen2 } from "./scenes/Screen2";

const { fontFamily } = loadFont();

export const CompositionSchema = z.object({
  hookText: z.string(),
  subText: z.string(),
  ctaText: z.string(),
  screenImage: z.string(),
});

export type CompositionProps = z.infer<typeof CompositionSchema>;

// ── Speed remap: raw frames [30, 60] play at 2× → saves 15 output frames ─────
const SPEED = { start: 30, end: 60, factor: 2 } as const;
export const SPEED_SAVINGS = (SPEED.end - SPEED.start) * (1 - 1 / SPEED.factor); // 15

function remapFrame(raw: number): number {
  const compressedLen = (SPEED.end - SPEED.start) / SPEED.factor; // 15
  if (raw <= SPEED.start) return raw;
  if (raw <= SPEED.start + compressedLen) return SPEED.start + (raw - SPEED.start) * SPEED.factor;
  return SPEED.end + (raw - (SPEED.start + compressedLen));
}

// ── Timings ───────────────────────────────────────────────────────────────────
const HOOK_PEAK  = 10;                          // fast punch (was 18)
const HOOK_HOLD  = 20;                          // short hold (was 32)

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
          {hookText}
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
            <GlowHighlight
              pos={SCREEN_1_PAIN.card_tiaum_pgishut}
              startAt={GLOW_START}
            />
          </PhoneEntrance>
        </div>
      </AbsoluteFill>

      {/* ════ FLASH on phone arrival ════ */}
      <AbsoluteFill
        style={{ background: "#ffffff", opacity: flashOpacity, pointerEvents: "none" }}
      />

      {/* ════ SCREEN 2 ════ */}
      <Sequence from={T.screen2.start - SPEED_SAVINGS} durationInFrames={T.screen2.duration}>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: BRAND.bg,
          }}
        >
          <div style={{ transform: "scale(1.28)", transformOrigin: "center center" }}>
          <Screen2 startAt={0} />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
