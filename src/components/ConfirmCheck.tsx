import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

interface ConfirmCheckProps {
  enterFrame: number;
  size?: number;
  color?: string;
  positionY?: number;
  /** 0–1 horizontal position, default 0.5 (center) */
  positionX?: number;
  label?: string;
}

export const ConfirmCheck: React.FC<ConfirmCheckProps> = ({
  enterFrame,
  size = 180,
  color = BRAND.green,
  positionY = 0.5,
  positionX = 0.5,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerEnter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 13, stiffness: 220, mass: 0.75 },
  });

  const circleEnter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 20, stiffness: 260, mass: 0.55 },
  });

  const checkEnter = spring({
    frame: Math.max(0, frame - enterFrame - 8),
    fps,
    config: { damping: 10, stiffness: 300, mass: 0.5 },
  });

  const scale = interpolate(
    containerEnter,
    [0, 0.4, 0.7, 1],
    [0, 1.3, 0.92, 1],
    { extrapolateRight: "clamp" }
  );
  const opacity = interpolate(containerEnter, [0, 0.25], [0, 1], {
    extrapolateRight: "clamp",
  });

  const r = size / 2 - 9;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - Math.min(1, circleEnter));

  // Checkmark path points (scaled to size)
  const s = size / 180;
  const lx = cx - 48 * s;
  const ly = cy + 4 * s;
  const mx = cx - 14 * s;
  const my = cy + 36 * s;
  const rx = cx + 54 * s;
  const ry = cy - 30 * s;

  // Approximate path length for dash animation
  const checkLen =
    Math.sqrt((mx - lx) ** 2 + (my - ly) ** 2) +
    Math.sqrt((rx - mx) ** 2 + (ry - my) ** 2);

  const checkProgress = Math.min(1, checkEnter * 1.4);
  const checkDash = checkLen * checkProgress;

  const filterId = `check-glow-${enterFrame}`;

  return (
    <div
      style={{
        position: "absolute",
        top: positionY * 1920,
        left: positionX * 1080,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Filled background circle */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={`${color}18`}
          opacity={circleEnter}
        />

        {/* Animated stroke circle */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={5.5}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${cx}, ${cy})`}
          filter={`url(#${filterId})`}
        />

        {/* Animated checkmark */}
        <polyline
          points={`${lx},${ly} ${mx},${my} ${rx},${ry}`}
          fill="none"
          stroke={color}
          strokeWidth={6 * s}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={checkLen}
          strokeDashoffset={checkLen - checkDash}
          filter={`url(#${filterId})`}
        />
      </svg>

      {label && (
        <div
          style={{
            fontFamily: "'Heebo', sans-serif",
            fontWeight: 700,
            fontSize: 40,
            color,
            textShadow: `0 0 30px ${color}66`,
            direction: "rtl",
            opacity: checkProgress,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
