import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

type TextPopStyle = "default" | "pink" | "blue" | "outline";

interface TextPopProps {
  text: string;
  enterFrame: number;
  /** frames visible before fade out */
  holdFrames?: number;
  style?: TextPopStyle;
  fontSize?: number;
  /** vertical position 0–1 (0=top, 0.5=center, 1=bottom) */
  positionY?: number;
}

const styleMap: Record<TextPopStyle, React.CSSProperties> = {
  default: {
    color: BRAND.text,
    textShadow: "0 4px 30px rgba(0,0,0,0.8)",
  },
  pink: {
    color: BRAND.pink,
    textShadow: `0 0 40px ${BRAND.pink}88, 0 4px 20px rgba(0,0,0,0.7)`,
  },
  blue: {
    color: BRAND.blueL,
    textShadow: `0 0 40px ${BRAND.blueL}88, 0 4px 20px rgba(0,0,0,0.7)`,
  },
  outline: {
    color: BRAND.text,
    WebkitTextStroke: `3px ${BRAND.blue}`,
    textShadow: `0 0 30px ${BRAND.blue}66`,
  },
};

export const TextPop: React.FC<TextPopProps> = ({
  text,
  enterFrame,
  holdFrames = 45,
  style = "default",
  fontSize = 96,
  positionY = 0.42,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 12, stiffness: 280, mass: 0.6 },
  });

  const exit = spring({
    frame: Math.max(0, frame - (enterFrame + holdFrames)),
    fps,
    config: { damping: 18, stiffness: 200, mass: 0.7 },
  });

  const scale = interpolate(enter, [0, 1], [0.5, 1]) * interpolate(exit, [0, 1], [1, 0.85]);
  const opacity = Math.min(enter * 2, 1) * Math.max(0, 1 - exit * 2);

  return (
    <div
      style={{
        position: "absolute",
        top: `${positionY * 100}%`,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 80px",
        transform: `translateY(-50%) scale(${scale})`,
        opacity,
        pointerEvents: "none",
        direction: "rtl",
      }}
    >
      <span
        style={{
          fontFamily: "'Heebo', sans-serif",
          fontWeight: 900,
          fontSize,
          lineHeight: 1.2,
          textAlign: "center",
          ...styleMap[style],
        }}
      >
        {text}
      </span>
    </div>
  );
};
