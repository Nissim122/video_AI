import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

interface CTAButtonProps {
  text: string;
  enterFrame: number;
  holdFrames?: number;
  /** "bottom" = bottom center, or exact px from top */
  positionY?: number | "bottom";
  pulse?: boolean;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  text,
  enterFrame,
  holdFrames = 0,
  positionY = "bottom",
  pulse = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.9 },
  });

  const exit =
    holdFrames > 0
      ? spring({
          frame: Math.max(0, frame - (enterFrame + holdFrames)),
          fps,
          config: { damping: 14, stiffness: 160, mass: 0.9 },
        })
      : 0;

  const translateY = interpolate(enter, [0, 1], [120, 0]) + interpolate(exit, [0, 1], [0, 120]);
  const opacity = Math.max(0, Math.min(enter * 2, 1) - exit * 2);

  // Subtle pulse after entrance
  const settled = frame > enterFrame + 20;
  const pulsate = pulse && settled
    ? 1 + Math.sin(((frame - enterFrame) / fps) * Math.PI * 1.6) * 0.025
    : 1;

  const top = positionY === "bottom" ? undefined : positionY;
  const bottom = positionY === "bottom" ? 180 : undefined;

  return (
    <div
      style={{
        position: "absolute",
        top,
        bottom,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        transform: `translateY(${translateY}px)`,
        opacity,
      }}
    >
      <div
        style={{
          background: `linear-gradient(135deg, ${BRAND.pink}, #c0105a)`,
          borderRadius: 60,
          padding: "28px 80px",
          transform: `scale(${pulsate})`,
          boxShadow: `0 0 40px ${BRAND.pink}66, 0 8px 30px rgba(0,0,0,0.45)`,
          display: "flex",
          alignItems: "center",
          gap: 16,
          direction: "rtl",
        }}
      >
        <span
          style={{
            fontFamily: "'Heebo', sans-serif",
            fontWeight: 800,
            fontSize: 52,
            color: "#ffffff",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </span>
        <span style={{ fontSize: 44 }}>←</span>
      </div>
    </div>
  );
};
