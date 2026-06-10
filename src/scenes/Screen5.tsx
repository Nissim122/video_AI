import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

export const SCREEN5_DURATION = 100;

const CAROUSEL_WORDS = ["כבר היום", "לבד", "עכשיו", "ב-5 דקות", "ללא קוד", "בלי כישורים"];
const CAROUSEL_START = 10;
const WORD_DURATION = 17;
const TRANS = 4;

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

const CYCLE = CAROUSEL_WORDS.length * WORD_DURATION;

const WordCarousel: React.FC<{ f: number }> = ({ f }) => {
  const localF = f - CAROUSEL_START;
  const loopF = localF < 0 ? localF : ((localF % CYCLE) + CYCLE) % CYCLE;

  return (
    <div
      style={{
        position: "relative",
        height: 100,
        overflow: "hidden",
        width: 420,
        flexShrink: 0,
      }}
    >
      {CAROUSEL_WORDS.map((word, i) => {
        const wf = loopF - i * WORD_DURATION;
        const opacity = interpolate(
          wf,
          [0, TRANS, WORD_DURATION - TRANS, WORD_DURATION],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const y = interpolate(
          wf,
          [0, TRANS, WORD_DURATION - TRANS, WORD_DURATION],
          [30, 0, 0, -30],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            key={word}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "nowrap",
              opacity,
              transform: `translateY(${y}px)`,
            }}
          >
            {word}
          </div>
        );
      })}
    </div>
  );
};

interface Screen5Props {
  startAt?: number;
  logicalFrame?: number;
}

export const Screen5: React.FC<Screen5Props> = ({ startAt = 0, logicalFrame }) => {
  const rawFrame = useCurrentFrame();
  const frame = logicalFrame ?? rawFrame;
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - startAt);

  // Pink glow burst
  const glowScale = spring({ frame: f, fps, config: { damping: 28, stiffness: 70, mass: 1.1 } });
  const glowOpacity = interpolate(f, [0, 6, 50, SCREEN5_DURATION], [0, 0.55, 0.42, 0.28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Main text block — springs up from below
  const textSpring = spring({ frame: f - 2, fps, config: { damping: 20, stiffness: 190, mass: 0.75 } });
  const textY = interpolate(textSpring, [0, 1], [70, 0]);
  const textOpacity = interpolate(f, [2, 13], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "ללא עלות" — springs in slightly after the main title
  const priceSpring = spring({ frame: f - 14, fps, config: { damping: 20, stiffness: 190, mass: 0.75 } });
  const priceY = interpolate(priceSpring, [0, 1], [50, 0]);
  const priceOpacity = interpolate(f, [14, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Arrow — springs in then bounces
  const arrowSpring = spring({ frame: f - 22, fps, config: { damping: 16, stiffness: 230, mass: 0.6 } });
  const arrowEntryY = interpolate(arrowSpring, [0, 1], [36, 0]);
  const arrowOpacity = interpolate(f, [22, 31], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bounceCycle = f > 30 ? Math.sin((f - 30) * 0.2) * 11 : 0;
  const glowPulse = f > 30 ? 0.55 + Math.sin((f - 30) * 0.2) * 0.3 : 0.55;

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
        gap: 40,
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

      {/* Logo */}
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
          opacity: textOpacity,
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

      {/* Text block */}
      <div
        style={{
          color: BRAND.text,
          fontSize: 78,
          fontWeight: 900,
          textAlign: "center",
          lineHeight: 1.25,
          padding: "0 72px",
          width: "100%",
          textShadow: "0 4px 48px rgba(224,23,107,0.50)",
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        <div>לבניית אוטומציות</div>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <span>לעסק שלך</span>
          <WordCarousel f={f} />
        </div>
      </div>

      {/* "ללא עלות" — delayed entrance */}
      <div
        style={{
          color: BRAND.blueL,
          fontSize: 72,
          fontWeight: 900,
          textAlign: "center",
          fontFamily: "Heebo, sans-serif",
          textShadow: "0 4px 48px rgba(33,150,176,0.50)",
          opacity: priceOpacity,
          transform: `translateY(${priceY}px)`,
        }}
      >
        ללא עלות
      </div>

      {/* Bouncing chevron arrow */}
      <div
        style={{
          opacity: arrowOpacity,
          transform: `translateY(${arrowEntryY + bounceCycle}px)`,
          filter: `drop-shadow(0 0 ${20 + glowPulse * 18}px rgba(224,23,107,${glowPulse}))`,
        }}
      >
        <ChevronDown />
      </div>
    </div>
  );
};
