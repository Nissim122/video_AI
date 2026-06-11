import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

type HighlightStyle = "box" | "underline" | "pill";

interface HighlightBoxProps {
  /** top-left corner of the area to highlight */
  x: number;
  y: number;
  width: number;
  height: number;
  enterFrame: number;
  holdFrames?: number;
  style?: HighlightStyle;
  color?: string;
  label?: string;
}

export const HighlightBox: React.FC<HighlightBoxProps> = ({
  x,
  y,
  width,
  height,
  enterFrame,
  holdFrames = 0,
  style = "box",
  color = BRAND.blueL,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 18, stiffness: 220, mass: 0.7 },
  });

  const exit =
    holdFrames > 0
      ? spring({
          frame: Math.max(0, frame - (enterFrame + holdFrames)),
          fps,
          config: { damping: 18, stiffness: 220, mass: 0.7 },
        })
      : 0;

  const opacity = Math.max(0, Math.min(enter * 2, 1) - exit * 2);

  // Animated draw-in: width grows from 0
  const drawWidth = style === "underline"
    ? interpolate(enter, [0, 1], [0, width], { extrapolateRight: "clamp" })
    : width;

  const scale = style === "box" || style === "pill"
    ? interpolate(enter, [0, 1], [0.85, 1])
    : 1;

  const padding = style === "pill" ? 16 : 0;
  const borderRadius =
    style === "pill" ? (height / 2 + padding) :
    style === "box" ? 12 : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x - padding,
        top: style === "underline" ? y + height - 6 : y - padding,
        width: style === "underline" ? drawWidth : width + padding * 2,
        height: style === "underline" ? 5 : height + padding * 2,
        borderRadius,
        border: style !== "underline" ? `2.5px solid ${color}` : undefined,
        background:
          style === "underline" ? color :
          style === "pill" ? `${color}22` : `${color}14`,
        boxShadow: style !== "underline" ? `0 0 20px ${color}55, inset 0 0 20px ${color}11` : `0 0 12px ${color}88`,
        opacity,
        transform: style !== "underline" ? `scale(${scale})` : undefined,
        transformOrigin: "left center",
        pointerEvents: "none",
      }}
    >
      {label && (
        <div
          style={{
            position: "absolute",
            top: -52,
            left: 0,
            fontFamily: "'Heebo', sans-serif",
            fontWeight: 700,
            fontSize: 34,
            color,
            whiteSpace: "nowrap",
            textShadow: "0 2px 12px rgba(0,0,0,0.7)",
            direction: "rtl",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
