// ─────────────────────────────────────────────────────────────────────────────
// SubtitleDemoComp — Remotion Studio sandbox for live subtitle styling
// פותחים ב-Studio, משנים Leva sliders → רואים בלייב, מעתיקים preset/values
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { AbsoluteFill } from "remotion";
import { Leva } from "leva";
import type { Caption } from "@remotion/captions";
import { SubtitleEngine } from "./SubtitleEngine";
import { useSubtitleControls } from "./useSubtitleControls";

// 8 שניות של כתוביות לדוגמה — 3 משפטים עם הפסקות
const SAMPLE_CAPTIONS: Caption[] = [
  // משפט 1
  { text: "כל ",     startMs: 200,  endMs: 500,  timestampMs: null, confidence: null },
  { text: "עסק ",    startMs: 500,  endMs: 900,  timestampMs: null, confidence: null },
  { text: "מאבד ",   startMs: 900,  endMs: 1350, timestampMs: null, confidence: null },
  { text: "שעות ",   startMs: 1350, endMs: 1750, timestampMs: null, confidence: null },
  { text: "יקרות ",  startMs: 1750, endMs: 2250, timestampMs: null, confidence: null },
  { text: "על ",     startMs: 2250, endMs: 2500, timestampMs: null, confidence: null },
  { text: "עבודה ",  startMs: 2500, endMs: 2900, timestampMs: null, confidence: null },
  { text: "ידנית.",  startMs: 2900, endMs: 3600, timestampMs: null, confidence: null },

  // משפט 2
  { text: "אנחנו ",    startMs: 3900, endMs: 4250, timestampMs: null, confidence: null },
  { text: "מחסלים ",   startMs: 4250, endMs: 4750, timestampMs: null, confidence: null },
  { text: "אותה ",     startMs: 4750, endMs: 5100, timestampMs: null, confidence: null },
  { text: "לגמרי.",    startMs: 5100, endMs: 5800, timestampMs: null, confidence: null },

  // משפט 3
  { text: "100% ",      startMs: 6200, endMs: 6700, timestampMs: null, confidence: null },
  { text: "אוטומטי.",   startMs: 6700, endMs: 7600, timestampMs: null, confidence: null },
];

export const SubtitleDemoComp: React.FC = () => {
  const style = useSubtitleControls();

  return (
    <AbsoluteFill>
      {/* Background */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(160deg, #0a1020 0%, #0e1628 35%, #141d35 70%, #0e1628 100%)",
        }}
      />

      {/* Subtle grid overlay */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(33,150,176,0.05) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(33,150,176,0.05) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          pointerEvents: "none",
        }}
      />

      {/* Center label */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.07)",
            textTransform: "uppercase",
          }}
        >
          Subtitle Editor Preview
        </div>
      </AbsoluteFill>

      {/* The live subtitle engine */}
      <SubtitleEngine captions={SAMPLE_CAPTIONS} style={style} />

      {/* Leva panel — renders as portal outside video frame in Studio */}
      <Leva
        titleBar={{ title: "✦ Subtitle Editor" }}
        collapsed={false}
        hidden={process.env.NODE_ENV === "production"}
      />
    </AbsoluteFill>
  );
};
