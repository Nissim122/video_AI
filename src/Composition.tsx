import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile, Img } from "remotion";
import { loadFont } from "@remotion/google-fonts/Heebo";
import { BRAND } from "./brand";
import { IPhone14 } from "./components/IPhone14";
import { useFadeIn } from "./hooks/useFadeIn";
import { useSpringEntrance } from "./hooks/useSpringEntrance";

const { fontFamily } = loadFont();

// ── Timings (frames @ 30fps) ──
const HOOK_START = 0;
const HOOK_PEAK = 18;
const HOOK_HOLD = 32;
const HOOK_OUT = 45;
const IPHONE_START = 45;
const ZOOM_START = 78;
const ZOOM_END = 120;
const GLOW_START = 122;

export const MyComposition: React.FC = () => {
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

  // ── Hand tap animation ──
  const TAP_FRAME = GLOW_START + 14;
  const { fps } = useVideoConfig();

  const handOpacity = useFadeIn({ start: GLOW_START, duration: 10 });
  const handSpring = spring({
    frame: frame - GLOW_START,
    fps,
    config: { damping: 18, mass: 0.75, stiffness: 160 },
  });
  const handSlideIn = interpolate(handSpring, [0, 1], [-32, 0]);
  const tapY = interpolate(
    frame,
    [TAP_FRAME, TAP_FRAME + 5, TAP_FRAME + 13],
    [0, 9, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tapScale = interpolate(
    frame,
    [TAP_FRAME, TAP_FRAME + 5, TAP_FRAME + 13],
    [1, 0.84, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const rippleProgress = interpolate(frame, [TAP_FRAME + 4, TAP_FRAME + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rippleScale = interpolate(rippleProgress, [0, 1], [0.1, 2.6]);
  const rippleOpacity = interpolate(rippleProgress, [0, 0.12, 1], [0, 0.7, 0]);

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
          כמה שעות בשבוע אתה מבזבז על עבודה שחוזרת על עצמה?
        </div>
        <div
          style={{ color: BRAND.muted, fontSize: 40, fontWeight: 400, textAlign: "center" }}
        >
          פולואפים, תיאומים, דוחות, שיווק...
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
            src={staticFile("screen-1-pain.jpeg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Card highlight */}
          <div
            style={{
              position: "absolute",
              top: "35%",
              left: "2%",
              width: "30%",
              height: "16%",
              borderRadius: 16,
              background: `rgba(33,150,176,${0.18 * glowOpacity})`,
              border: `3px solid rgba(33,150,176,${glowOpacity})`,
              boxShadow: `
                0 0 0 6px rgba(33,150,176,${0.18 * glowOpacity * glowPulse}),
                0 0 32px rgba(33,150,176,${0.55 * glowOpacity * glowPulse})
              `,
              opacity: glowOpacity,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: BRAND.blue,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14">
                <path
                  d="M 2 7 L 5.5 10.5 L 12 3.5"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>
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
            בחר מה מפריע לך
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
