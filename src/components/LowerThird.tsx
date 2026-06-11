import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

interface LowerThirdProps {
  name: string;
  title?: string;
  enterFrame: number;
  /** frames to stay visible before sliding out (0 = stay forever) */
  holdFrames?: number;
  /** override default distance from canvas bottom (default 260) — use with SmartStack */
  positionBottom?: number;
}

export const LowerThird: React.FC<LowerThirdProps> = ({
  name,
  title,
  enterFrame,
  holdFrames = 0,
  positionBottom,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 20, stiffness: 160, mass: 0.9 },
  });

  const exit =
    holdFrames > 0
      ? spring({
          frame: Math.max(0, frame - (enterFrame + holdFrames)),
          fps,
          config: { damping: 20, stiffness: 160, mass: 0.9 },
        })
      : 0;

  const translateX = interpolate(enter, [0, 1], [-620, 0]) + interpolate(exit, [0, 1], [0, -620]);
  const opacity = Math.max(0, Math.min(enter * 1.5, 1) - exit);

  return (
    <div
      style={{
        position: "absolute",
        bottom: positionBottom ?? 260,
        left: 60,
        transform: `translateX(${translateX}px)`,
        opacity,
        pointerEvents: "none",
        display: "flex",
        alignItems: "stretch",
        gap: 0,
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          width: 7,
          borderRadius: 4,
          background: `linear-gradient(180deg, ${BRAND.blue}, ${BRAND.pink})`,
          boxShadow: `0 0 18px ${BRAND.blue}99`,
          marginRight: 18,
          flexShrink: 0,
        }}
      />

      {/* Text block */}
      <div
        style={{
          background: "rgba(14,22,40,0.82)",
          backdropFilter: "blur(12px)",
          border: `1px solid rgba(33,150,176,0.25)`,
          borderRadius: 14,
          padding: title ? "18px 28px" : "14px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          direction: "rtl",
        }}
      >
        <span
          style={{
            fontFamily: "'Heebo', sans-serif",
            fontWeight: 700,
            fontSize: 46,
            color: BRAND.text,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
          }}
        >
          {name}
        </span>
        {title && (
          <span
            style={{
              fontFamily: "'Heebo', sans-serif",
              fontWeight: 400,
              fontSize: 34,
              color: BRAND.blueL,
              lineHeight: 1.1,
            }}
          >
            {title}
          </span>
        )}
      </div>
    </div>
  );
};
