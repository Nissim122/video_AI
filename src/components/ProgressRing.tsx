import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { BRAND } from "../brand";

interface ProgressRingProps {
  enterFrame: number;
  durationFrames: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  /** fill to this percent (1–100), default 100 */
  targetPercent?: number;
  positionY?: number;
  positionX?: number;
  showPercent?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  enterFrame,
  durationFrames,
  size = 220,
  strokeWidth = 12,
  color = BRAND.blueL,
  trackColor,
  label,
  targetPercent = 100,
  positionY = 0.5,
  positionX = 0.5,
  showPercent = true,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - enterFrame);

  const progress = interpolate(
    elapsed,
    [0, durationFrames],
    [0, targetPercent / 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = interpolate(elapsed, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - progress);
  const displayPct = Math.round(progress * 100);
  const track = trackColor ?? "rgba(255,255,255,0.07)";

  const filterId = `ring-glow-${enterFrame}`;

  return (
    <div
      style={{
        position: "absolute",
        top: positionY * 1920,
        left: positionX * 1080,
        transform: "translate(-50%, -50%)",
        opacity,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={track}
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${cx}, ${cy})`}
          filter={`url(#${filterId})`}
        />

        {showPercent && (
          <text
            x={cx}
            y={cy + 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={color}
            fontSize={size * 0.2}
            fontFamily="'Inter', sans-serif"
            fontWeight="700"
          >
            {displayPct}%
          </text>
        )}
      </svg>

      {label && (
        <div
          style={{
            fontFamily: "'Heebo', sans-serif",
            fontWeight: 700,
            fontSize: 36,
            color: BRAND.text,
            direction: "rtl",
            textAlign: "center",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
