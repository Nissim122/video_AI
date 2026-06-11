import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

type RevealDir = "right" | "left" | "up" | "down";

interface RevealMaskProps {
  children: React.ReactNode;
  enterFrame: number;
  direction?: RevealDir;
  maskColor?: string;
  feel?: "snappy" | "smooth";
}

export const RevealMask: React.FC<RevealMaskProps> = ({
  children,
  enterFrame,
  direction = "right",
  maskColor = BRAND.blue,
  feel = "snappy",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cfg =
    feel === "snappy"
      ? { damping: 18, stiffness: 220, mass: 0.8 }
      : { damping: 30, stiffness: 120, mass: 1.0 };

  // Phase 1 — mask slides in
  const p1 = spring({ frame: Math.max(0, frame - enterFrame), fps, config: cfg });
  // Phase 2 — mask slides out revealing content (12-frame delay)
  const p2 = spring({ frame: Math.max(0, frame - (enterFrame + 12)), fps, config: cfg });

  const revealProg = Math.max(0, Math.min(1, p2));

  let clipPath = "";
  if (direction === "right")  clipPath = `inset(0 ${(1 - revealProg) * 100}% 0 0)`;
  if (direction === "left")   clipPath = `inset(0 0 0 ${(1 - revealProg) * 100}%)`;
  if (direction === "up")     clipPath = `inset(0 0 ${(1 - revealProg) * 100}% 0)`;
  if (direction === "down")   clipPath = `inset(${(1 - revealProg) * 100}% 0 0 0)`;

  // Mask bar slide in then out
  const maskIn  = interpolate(p1, [0, 1], [-110, 0], { extrapolateRight: "clamp" });
  const maskOut = interpolate(p2, [0, 1], [0, 110],  { extrapolateRight: "clamp" });

  let maskTransform = "";
  if (direction === "right")  maskTransform = `translateX(${maskIn + maskOut}%)`;
  if (direction === "left")   maskTransform = `translateX(${-(maskIn + maskOut)}%)`;
  if (direction === "up")     maskTransform = `translateY(${-(maskIn + maskOut)}%)`;
  if (direction === "down")   maskTransform = `translateY(${maskIn + maskOut}%)`;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div style={{ clipPath }}>{children}</div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: maskColor,
          transform: maskTransform,
          borderRadius: 4,
          boxShadow: `0 0 40px ${maskColor}66`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
