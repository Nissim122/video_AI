import React from "react";
import { AbsoluteFill } from "remotion";

type ColorTone = "neutral" | "cool" | "warm" | "cinematic";

interface VignetteGradeProps {
  /** vignette strength 0–1, default 0.6 */
  vignetteStrength?: number;
  tone?: ColorTone;
  /** overall brightness 0–2, default 1 */
  brightness?: number;
  /** overall contrast 0–2, default 1.05 */
  contrast?: number;
}

const toneOverlay: Record<ColorTone, string> = {
  neutral:    "transparent",
  cool:       "rgba(20, 60, 120, 0.08)",
  warm:       "rgba(180, 80, 20, 0.07)",
  cinematic:  "rgba(10, 20, 50, 0.10)",
};

const toneFilter: Record<ColorTone, string> = {
  neutral:   "",
  cool:      "hue-rotate(-8deg) saturate(1.1)",
  warm:      "hue-rotate(10deg) saturate(1.15) sepia(0.08)",
  cinematic: "saturate(0.88) contrast(1.08)",
};

export const VignetteGrade: React.FC<VignetteGradeProps> = ({
  vignetteStrength = 0.6,
  tone = "cinematic",
  brightness = 1,
  contrast = 1.05,
}) => {
  const vignetteOpacity = vignetteStrength;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Radial vignette — dark edges */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,${vignetteOpacity}) 100%)`,
        }}
      />

      {/* Top shadow */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,${vignetteOpacity * 0.5}) 0%, transparent 30%)`,
        }}
      />

      {/* Color tone overlay */}
      {tone !== "neutral" && (
        <AbsoluteFill style={{ background: toneOverlay[tone] }} />
      )}

      {/* CSS filter layer — brightness / contrast / tone */}
      <AbsoluteFill
        style={{
          filter: [
            `brightness(${brightness})`,
            `contrast(${contrast})`,
            toneFilter[tone],
          ]
            .filter(Boolean)
            .join(" "),
          mixBlendMode: "normal",
          opacity: 1,
          background: "transparent",
        }}
      />
    </AbsoluteFill>
  );
};
