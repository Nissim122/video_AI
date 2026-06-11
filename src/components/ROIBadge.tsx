import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

type BadgeSize = "sm" | "md" | "lg";

interface ROIBadgeProps {
  value: number;
  /** unit label, e.g. "שעות" or "₪" */
  unit: string;
  /** description below the number */
  label: string;
  prefix?: string;
  enterFrame?: number;
  positionX?: number;
  positionY?: number;
  color?: string;
  size?: BadgeSize;
}

const SIZE_MAP: Record<BadgeSize, { pad: string; numSize: number; labelSize: number; unitSize: number; r: number }> = {
  sm: { pad: "16px 28px", numSize: 56,  labelSize: 24, unitSize: 30, r: 40 },
  md: { pad: "24px 44px", numSize: 80,  labelSize: 30, unitSize: 38, r: 50 },
  lg: { pad: "32px 60px", numSize: 110, labelSize: 36, unitSize: 50, r: 60 },
};

export const ROIBadge: React.FC<ROIBadgeProps> = ({
  value,
  unit,
  label,
  prefix = "",
  enterFrame = 0,
  positionX = 540,
  positionY = 960,
  color = BRAND.green,
  size = "md",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.7 },
  });

  const count = spring({
    frame: Math.max(0, frame - (enterFrame + 5)),
    fps,
    config: { damping: 28, stiffness: 70, mass: 1.3 },
  });

  const displayValue = Math.round(interpolate(count, [0, 1], [0, value]));
  const scale  = interpolate(enter, [0, 0.6, 0.8, 1], [0, 1.15, 0.92, 1], { extrapolateRight: "clamp" });
  const opacity = interpolate(enter, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const s = SIZE_MAP[size];

  return (
    <div
      style={{
        position: "absolute",
        top: positionY,
        left: positionX,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        pointerEvents: "none",
        background: `${color}18`,
        border: `2px solid ${color}55`,
        borderRadius: s.r,
        padding: s.pad,
        boxShadow: `0 0 40px ${color}33, inset 0 1px 0 ${color}22`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, direction: "ltr" }}>
        {prefix && (
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: s.unitSize, color: BRAND.muted }}>
            {prefix}
          </span>
        )}
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
            fontSize: s.numSize,
            color,
            letterSpacing: "-0.04em",
            textShadow: `0 0 30px ${color}88`,
          }}
        >
          {displayValue.toLocaleString()}
        </span>
        <span
          style={{
            fontFamily: "'Heebo', sans-serif",
            fontSize: s.unitSize,
            color: BRAND.muted,
            fontWeight: 600,
          }}
        >
          {unit}
        </span>
      </div>
      <div
        style={{
          fontFamily: "'Heebo', sans-serif",
          fontSize: s.labelSize,
          color: BRAND.muted,
          direction: "rtl",
          textAlign: "center",
        }}
      >
        {label}
      </div>
    </div>
  );
};
