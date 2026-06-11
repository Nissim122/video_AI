import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { BRAND } from "../brand";

interface MorphTextProps {
  from: string;
  to: string;
  /** frame when the morph starts */
  morphFrame: number;
  durationFrames?: number;
  positionY?: number;
  fontSize?: number;
  fromColor?: string;
  toColor?: string;
}

export const MorphText: React.FC<MorphTextProps> = ({
  from,
  to,
  morphFrame,
  durationFrames = 20,
  positionY = 0.5,
  fontSize = 88,
  fromColor = BRAND.text,
  toColor = BRAND.pink,
}) => {
  const frame = useCurrentFrame();

  const t = interpolate(frame, [morphFrame, morphFrame + durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fromOpacity = interpolate(t, [0, 0.55], [1, 0], { extrapolateRight: "clamp" });
  const fromScale = interpolate(t, [0, 0.55], [1, 0.65], { extrapolateRight: "clamp" });

  const toOpacity = interpolate(t, [0.4, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const toScale = interpolate(t, [0.4, 1], [1.25, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sharedStyle: React.CSSProperties = {
    fontFamily: "'Heebo', sans-serif",
    fontWeight: 900,
    fontSize,
    textAlign: "center",
    lineHeight: 1.2,
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    transform: "translateY(-50%)",
    padding: "0 80px",
    direction: "rtl",
  };

  return (
    <div
      style={{
        position: "absolute",
        top: `${positionY * 100}%`,
        left: 0,
        right: 0,
        height: fontSize * 1.5,
        transform: "translateY(-50%)",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          ...sharedStyle,
          color: fromColor,
          opacity: fromOpacity,
          transform: `translateY(-50%) scale(${fromScale})`,
          textShadow: "0 4px 40px rgba(0,0,0,0.7)",
        }}
      >
        {from}
      </span>
      <span
        style={{
          ...sharedStyle,
          color: toColor,
          opacity: toOpacity,
          transform: `translateY(-50%) scale(${toScale})`,
          textShadow: `0 0 50px ${toColor}66, 0 4px 30px rgba(0,0,0,0.7)`,
        }}
      >
        {to}
      </span>
    </div>
  );
};
