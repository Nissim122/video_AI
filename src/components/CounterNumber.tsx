import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { BRAND } from "../brand";

interface CounterNumberProps {
  from?: number;
  to: number;
  enterFrame: number;
  /** frames to count up over */
  durationFrames?: number;
  prefix?: string;
  suffix?: string;
  fontSize?: number;
  color?: string;
  decimals?: number;
}

export const CounterNumber: React.FC<CounterNumberProps> = ({
  from = 0,
  to,
  enterFrame,
  durationFrames = 60,
  prefix = "",
  suffix = "",
  fontSize = 120,
  color = BRAND.blueL,
  decimals = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = interpolate(
    frame,
    [enterFrame, enterFrame + durationFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic
    }
  );

  const value = from + (to - from) * progress;
  const display = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString("he-IL");

  const fadeIn = interpolate(frame, [enterFrame, enterFrame + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <span
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 800,
        fontSize,
        color,
        letterSpacing: "-0.03em",
        opacity: fadeIn,
        textShadow: `0 0 40px ${color}66`,
        direction: "ltr",
        display: "inline-block",
      }}
    >
      {prefix}{display}{suffix}
    </span>
  );
};
