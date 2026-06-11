import React from "react";
import { useCurrentFrame } from "remotion";
import { BRAND } from "../brand";

interface GradientBackgroundProps {
  opacity?: number;
  /** degrees per frame the angle drifts */
  driftSpeed?: number;
  /** base gradient angle in degrees */
  angle?: number;
  /** amplitude of the accent stop opacity pulse (0–1) */
  pulse?: number;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  opacity = 1,
  driftSpeed = 0.06,
  angle = 135,
  pulse = 0.06,
}) => {
  const frame = useCurrentFrame();

  const currentAngle   = angle + frame * driftSpeed;
  const accentOpacity  = 0.08 + Math.sin(frame / 60) * pulse;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(${currentAngle}deg, ${BRAND.bg} 0%, ${BRAND.bgE} 40%, rgba(33,150,176,${accentOpacity.toFixed(3)}) 70%, ${BRAND.bg} 100%)`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};
