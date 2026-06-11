import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

export interface SplitPanel {
  content: React.ReactNode;
  label?: string;
  labelColor?: string;
}

interface SplitScreenProps {
  left: SplitPanel;
  right: SplitPanel;
  enterFrame: number;
  exitFrame?: number;
  dividerColor?: string;
  /** "50-50" | "40-60" | "60-40" */
  layout?: "50-50" | "40-60" | "60-40";
}

export const SplitScreen: React.FC<SplitScreenProps> = ({
  left,
  right,
  enterFrame,
  exitFrame,
  dividerColor = BRAND.blueL,
  layout = "50-50",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftEnter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 18, stiffness: 190, mass: 0.85 },
  });
  const rightEnter = spring({
    frame: Math.max(0, frame - enterFrame - 6),
    fps,
    config: { damping: 18, stiffness: 190, mass: 0.85 },
  });
  const dividerEnter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 22, stiffness: 220, mass: 0.7 },
  });

  const leftExit = exitFrame
    ? spring({ frame: Math.max(0, frame - exitFrame), fps, config: { damping: 18, stiffness: 200, mass: 0.8 } })
    : 0;
  const rightExit = exitFrame
    ? spring({ frame: Math.max(0, frame - exitFrame - 4), fps, config: { damping: 18, stiffness: 200, mass: 0.8 } })
    : 0;

  const splits =
    layout === "50-50" ? [50, 50] : layout === "40-60" ? [40, 60] : [60, 40];

  const leftTx =
    interpolate(leftEnter, [0, 1], [-(splits[0] * 10.8), 0]) +
    interpolate(leftExit, [0, 1], [0, -(splits[0] * 10.8)]);
  const rightTx =
    interpolate(rightEnter, [0, 1], [splits[1] * 10.8, 0]) +
    interpolate(rightExit, [0, 1], [0, splits[1] * 10.8]);
  const dividerH = interpolate(dividerEnter, [0, 1], [0, 1920], {
    extrapolateRight: "clamp",
  });

  const labelStyle = (color?: string): React.CSSProperties => ({
    position: "absolute" as const,
    top: 60,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
  });

  const labelInner = (color?: string): React.CSSProperties => ({
    background: "rgba(14,22,40,0.86)",
    backdropFilter: "blur(14px)",
    borderRadius: 12,
    padding: "10px 28px",
    fontFamily: "'Heebo', sans-serif",
    fontWeight: 700,
    fontSize: 36,
    color: color ?? BRAND.text,
    border: `1px solid ${BRAND.border}`,
    direction: "rtl" as const,
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* Left panel */}
      <div
        style={{
          width: `${splits[0]}%`,
          height: "100%",
          transform: `translateX(${leftTx}px)`,
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
        }}
      >
        {left.content}
        {left.label && (
          <div style={labelStyle()}>
            <div style={labelInner(left.labelColor)}>{left.label}</div>
          </div>
        )}
      </div>

      {/* Animated divider */}
      <div
        style={{
          width: 3,
          height: dividerH,
          background: `linear-gradient(to bottom, transparent, ${dividerColor} 15%, ${dividerColor} 85%, transparent)`,
          flexShrink: 0,
          boxShadow: `0 0 18px ${dividerColor}88`,
          alignSelf: "flex-start",
        }}
      />

      {/* Right panel */}
      <div
        style={{
          flex: 1,
          height: "100%",
          transform: `translateX(${rightTx}px)`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {right.content}
        {right.label && (
          <div style={labelStyle()}>
            <div style={labelInner(right.labelColor)}>{right.label}</div>
          </div>
        )}
      </div>
    </div>
  );
};
