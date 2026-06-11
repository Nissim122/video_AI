import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

type Corner = "top-right" | "top-left" | "bottom-right" | "bottom-left";

interface LogoWatermarkProps {
  corner?: Corner;
  size?: number;  // fontSize base
  fadeInFrame?: number;
}

const PADDING = 55;

const cornerStyle = (corner: Corner): React.CSSProperties => {
  const base: React.CSSProperties = { position: "absolute" };
  if (corner === "top-right")    return { ...base, top: PADDING, right: PADDING };
  if (corner === "top-left")     return { ...base, top: PADDING, left: PADDING };
  if (corner === "bottom-right") return { ...base, bottom: PADDING, right: PADDING };
  return { ...base, bottom: PADDING, left: PADDING };
};

export const LogoWatermark: React.FC<LogoWatermarkProps> = ({
  corner = "top-right",
  size = 38,
  fadeInFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = spring({
    frame: Math.max(0, frame - fadeInFrame),
    fps,
    config: { damping: 22, stiffness: 80, mass: 1 },
  });

  const opacity = interpolate(fadeIn, [0, 1], [0, 0.85]);

  return (
    <div
      style={{
        ...cornerStyle(corner),
        display: "flex",
        alignItems: "baseline",
        gap: 4,
        direction: "ltr",
        opacity,
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
          fontSize: size,
          letterSpacing: "-0.04em",
          color: BRAND.text,
          textShadow: "0 2px 12px rgba(0,0,0,0.5)",
        }}
      >
        Clix
      </span>
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
          fontSize: size * 0.85,
          letterSpacing: "-0.02em",
          color: BRAND.pink,
          textShadow: "0 2px 12px rgba(0,0,0,0.5)",
        }}
      >
        Automations
      </span>
    </div>
  );
};
