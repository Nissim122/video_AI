import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

interface CountdownTimerProps {
  from: number;
  to?: number;
  enterFrame: number;
  /** frames per number, default 30 (1 sec at 30fps) */
  framesPerNumber?: number;
  positionY?: number;
  fontSize?: number;
  color?: string;
  /** highlight final number in pink */
  accentLast?: boolean;
  label?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  from,
  to = 0,
  enterFrame,
  framesPerNumber = 30,
  positionY = 0.4,
  fontSize = 240,
  color = BRAND.text,
  accentLast = true,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = Math.max(0, frame - enterFrame);
  const step = Math.floor(elapsed / framesPerNumber);
  const current = Math.max(to, from - step);
  const stepFrame = elapsed % framesPerNumber;

  const pop = spring({
    frame: stepFrame,
    fps,
    config: { damping: 9, stiffness: 340, mass: 0.45 },
  });

  const scale = interpolate(pop, [0, 0.4, 0.72, 1], [1.55, 0.88, 1.04, 1], {
    extrapolateRight: "clamp",
  });

  const numberOpacity = interpolate(
    stepFrame,
    [0, 6, framesPerNumber - 8, framesPerNumber],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const containerOpacity = interpolate(elapsed, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isLast = current === to && accentLast;
  const displayColor = isLast ? BRAND.pink : color;

  return (
    <div
      style={{
        position: "absolute",
        top: `${positionY * 100}%`,
        left: 0,
        right: 0,
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        pointerEvents: "none",
        opacity: containerOpacity,
      }}
    >
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 900,
          fontSize,
          color: displayColor,
          lineHeight: 1,
          opacity: numberOpacity,
          transform: `scale(${scale})`,
          letterSpacing: "-0.04em",
          textShadow: isLast
            ? `0 0 90px ${BRAND.pink}99`
            : `0 0 60px rgba(255,255,255,0.25)`,
        }}
      >
        {current}
      </div>

      {label && (
        <div
          style={{
            fontFamily: "'Heebo', sans-serif",
            fontWeight: 700,
            fontSize: 44,
            color: BRAND.muted,
            direction: "rtl",
            opacity: interpolate(elapsed, [0, 18], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
