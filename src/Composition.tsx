import { AbsoluteFill, useCurrentFrame, interpolate, staticFile, Img } from "remotion";
import { loadFont } from "@remotion/google-fonts/Heebo";
import { z } from "zod";
import { BRAND } from "./brand";
import { IPhone14 } from "./components/IPhone14";
import { TapEffect } from "./components/TapEffect";
import { useFadeIn } from "./hooks/useFadeIn";
import { useSpringEntrance } from "./hooks/useSpringEntrance";
import { SCREEN_1_PAIN } from "./screens/screen-1-pain.coords";

const { fontFamily } = loadFont();

export const CompositionSchema = z.object({
  hookText: z.string(),
  subText: z.string(),
  ctaText: z.string(),
  screenImage: z.string(),
});

export type CompositionProps = z.infer<typeof CompositionSchema>;

// ── Timings (frames @ 30fps) ──
const HOOK_START = 0;
const HOOK_PEAK = 18;
const HOOK_HOLD = 32;
const HOOK_OUT = 45;
const IPHONE_START = 45;
const ZOOM_START = 78;
const ZOOM_END = 120;
const GLOW_START = 122;

export const MyComposition: React.FC<CompositionProps> = ({
  hookText,
  subText,
  ctaText,
  screenImage,
}) => {
  const frame = useCurrentFrame();

  // ── Hook text ──
  const hookOpacity = useFadeIn({
    start: HOOK_START,
    duration: HOOK_PEAK - HOOK_START,
    fadeOutStart: HOOK_HOLD,
    fadeOutDuration: HOOK_OUT - HOOK_HOLD,
  });
  const hookY = interpolate(frame, [HOOK_START, HOOK_PEAK], [36, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── iPhone spring entrance ──
  const { translateY: iphoneY, opacity: iphoneOpacity } = useSpringEntrance({
    start: IPHONE_START,
    distance: 900,
  });

  // ── Zoom into iPhone ──
  const zoomScale = interpolate(frame, [ZOOM_START, ZOOM_END], [1, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  });

  // ── Label annotation ──
  const arrowOpacity = useFadeIn({ start: GLOW_START + 10, duration: 12 });
  const arrowY = interpolate(frame, [GLOW_START + 10, GLOW_START + 22], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ background: BRAND.bg, fontFamily, direction: "rtl", overflow: "hidden" }}
    >
      {/* Ambient glow */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(33,150,176,0.08) 0%, transparent 65%)",
        }}
      />

      {/* ════ HOOK TEXT ════ */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          opacity: hookOpacity,
          transform: `translateY(${hookY}px)`,
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
            textShadow: "0 4px 60px rgba(33,150,176,0.3)",
          }}
        >
          {hookText}
        </div>
        <div
          style={{ color: BRAND.muted, fontSize: 40, fontWeight: 400, textAlign: "center" }}
        >
          {subText}
        </div>
      </AbsoluteFill>

      {/* ════ IPHONE + CONTENT ════ */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          opacity: iphoneOpacity,
          transform: `translateY(${iphoneY}px) scale(${zoomScale})`,
        }}
      >
        <IPhone14>
          <Img
            src={staticFile(screenImage)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          <TapEffect
            pos={SCREEN_1_PAIN.card_tiaum_pgishut}
            startAt={GLOW_START}
          />
        </IPhone14>

        {/* Arrow + label */}
        <div
          style={{
            opacity: arrowOpacity,
            transform: `translateY(${arrowY}px)`,
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
          <div
            style={{ color: BRAND.blueL, fontSize: 34, fontWeight: 700, whiteSpace: "nowrap" }}
          >
            {ctaText}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
