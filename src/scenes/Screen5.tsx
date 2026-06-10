import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

export const SCREEN5_DURATION = 60;

const ChevronDown: React.FC = () => (
  <svg width="90" height="68" viewBox="0 0 90 68" fill="none">
    <polyline
      points="8,8 45,60 82,8"
      stroke={BRAND.pink}
      strokeWidth="9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface Screen5Props {
  startAt?: number;
  logicalFrame?: number;
}

export const Screen5: React.FC<Screen5Props> = ({ startAt = 0, logicalFrame }) => {
  const rawFrame = useCurrentFrame();
  const frame = logicalFrame ?? rawFrame;
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - startAt);

  // Pink glow burst — expands from center
  const glowScale = spring({ frame: f, fps, config: { damping: 28, stiffness: 70, mass: 1.1 } });
  const glowOpacity = interpolate(f, [0, 6, 45, SCREEN5_DURATION], [0, 0.55, 0.42, 0.28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Main text — springs up from below
  const textSpring = spring({ frame: f - 2, fps, config: { damping: 20, stiffness: 190, mass: 0.75 } });
  const textY = interpolate(textSpring, [0, 1], [70, 0]);
  const textOpacity = interpolate(f, [2, 13], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Arrow — springs in after text, then bounces
  const arrowSpring = spring({ frame: f - 20, fps, config: { damping: 16, stiffness: 230, mass: 0.6 } });
  const arrowEntryY = interpolate(arrowSpring, [0, 1], [36, 0]);
  const arrowOpacity = interpolate(f, [20, 29], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bounceCycle = f > 28 ? Math.sin((f - 28) * 0.2) * 11 : 0;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: BRAND.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 52,
        direction: "rtl",
        fontFamily: "Heebo, sans-serif",
      }}
    >
      {/* Pink glow burst */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 72% 52% at 50% 52%, rgba(224,23,107,0.30) 0%, transparent 68%)",
          transform: `scale(${glowScale})`,
          opacity: glowOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Main CTA text */}
      <div
        style={{
          color: BRAND.text,
          fontSize: 78,
          fontWeight: 900,
          textAlign: "center",
          lineHeight: 1.25,
          padding: "0 72px",
          textShadow: "0 4px 48px rgba(224,23,107,0.50)",
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        תאם שיחה קצרה
        <br />
        ונבנה לך תוכנית עבודה
      </div>

      {/* Bouncing chevron arrow */}
      <div
        style={{
          opacity: arrowOpacity,
          transform: `translateY(${arrowEntryY + bounceCycle}px)`,
          filter: "drop-shadow(0 0 20px rgba(224,23,107,0.75))",
        }}
      >
        <ChevronDown />
      </div>
    </div>
  );
};
