import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Heebo";
import { z } from "zod";
import { BRAND } from "./brand";
import { PhoneEntrance } from "./components/PhoneEntrance";
import { GlowHighlight } from "./components/GlowHighlight";
import { useFadeIn } from "./hooks/useFadeIn";
import { SCREEN_1_PAIN } from "./screens/screen-1-pain.coords";
import { T } from "./scenes/timeline";

const { fontFamily } = loadFont();

export const CompositionSchema = z.object({
  hookText: z.string(),
  subText: z.string(),
  ctaText: z.string(),
  screenImage: z.string(),
});

export type CompositionProps = z.infer<typeof CompositionSchema>;

// ── Timings ───────────────────────────────────────────────────────────────────
const HOOK_PEAK  = 10;                          // fast punch (was 18)
const HOOK_HOLD  = 20;                          // short hold (was 32)

const PHONE_IN   = T.screen1.start;             // 36 — enters immediately
const ZOOM_START = T.screen1.start + 26;        // 62
const ZOOM_END   = T.screen1.start + 54;        // 90 — aggressive ramp (was +75)
const GLOW_START = T.screen1.start + 54;        // 90
const CTA_START  = T.screen1.start + 68;        // 104

export const MyComposition: React.FC<CompositionProps> = ({
  hookText,
  subText,
  ctaText,
  screenImage,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Hook text — scale punch + fast fade ──────────────────────────────────
  const hookOpacity = useFadeIn({
    start: T.hook.start,
    duration: HOOK_PEAK,
    fadeOutStart: HOOK_HOLD,
    fadeOutDuration: T.hook.duration - HOOK_HOLD,
  });
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
  const subOpacity = useFadeIn({
    start: T.hook.start + 5,
    duration: 9,
    fadeOutStart: HOOK_HOLD,
    fadeOutDuration: T.hook.duration - HOOK_HOLD,
  });
  const subY = interpolate(frame, [T.hook.start + 5, HOOK_PEAK + 5], [26, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

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

  // ── CTA — spring bounce ───────────────────────────────────────────────────
  const ctaProgress = spring({
    frame: frame - CTA_START,
    fps,
    config: { damping: 9, stiffness: 210, mass: 0.75 },
  });
  const ctaScale   = interpolate(ctaProgress, [0, 1], [0.6, 1]);
  const ctaOpacity = interpolate(frame, [CTA_START, CTA_START + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(ctaProgress, [0, 1], [28, 0]);

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

      {/* ════ PHONE + CTA ════ */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}
      >
        {/* Zoom wrapper */}
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

        {/* CTA — spring bounce */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `scale(${ctaScale}) translateY(${ctaY}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            direction: "rtl",
          }}
        >
          <svg width="48" height="40" viewBox="0 0 48 40">
            <path
              d="M 24 36 L 24 6 M 24 6 L 12 18 M 24 6 L 36 18"
              stroke={BRAND.blueL}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <div style={{ color: BRAND.blueL, fontSize: 34, fontWeight: 700, whiteSpace: "nowrap" }}>
            {ctaText}
          </div>
        </div>
      </AbsoluteFill>

      {/* ════ FLASH on phone arrival ════ */}
      <AbsoluteFill
        style={{ background: "#ffffff", opacity: flashOpacity, pointerEvents: "none" }}
      />
    </AbsoluteFill>
  );
};
