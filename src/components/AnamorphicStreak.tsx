import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { BRAND } from "../brand";

export interface AnamorphicStreakEvent {
  /** frame when streak appears */
  enterFrame: number;
  /** frame when streak disappears (optional — stays) */
  exitFrame?: number;
  /** X position 0–1080, default 540 (center) */
  x?: number;
  /** Y position 0–1920 */
  y: number;
  /** streak length — half-width in px, default 520 */
  length?: number;
  /** thickness in px, default 2 */
  thickness?: number;
  /** color, default BRAND.blueL */
  color?: string;
  /** 0–1 max opacity, default 0.75 */
  opacity?: number;
  /** pulse: streak brightness pulses with a sine wave, default true */
  pulse?: boolean;
}

interface AnamorphicStreakProps {
  events?: AnamorphicStreakEvent[];
}

const W = 1080;

export const AnamorphicStreak: React.FC<AnamorphicStreakProps> = ({
  events = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <svg
      width={W}
      height={1920}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <defs>
        {events.map((ev, i) => {
          const cx = ev.x ?? W / 2;
          const len = ev.length ?? 520;
          return (
            <linearGradient key={i} id={`streak-${i}`} x1={cx - len} y1={ev.y} x2={cx + len} y2={ev.y} gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor={ev.color ?? BRAND.blueL} stopOpacity={0}   />
              <stop offset="30%"  stopColor={ev.color ?? BRAND.blueL} stopOpacity={0.6} />
              <stop offset="50%"  stopColor="#ffffff"                  stopOpacity={1}   />
              <stop offset="70%"  stopColor={ev.color ?? BRAND.blueL} stopOpacity={0.6} />
              <stop offset="100%" stopColor={ev.color ?? BRAND.blueL} stopOpacity={0}   />
            </linearGradient>
          );
        })}
      </defs>

      {events.map((ev, i) => {
        const {
          enterFrame,
          exitFrame,
          x: cx = W / 2,
          y,
          length = 520,
          thickness = 2,
          opacity: maxOpacity = 0.75,
          pulse = true,
        } = ev;

        const elapsed = Math.max(0, frame - enterFrame);

        const scaleX = spring({ frame: elapsed, fps, config: { damping: 18, stiffness: 240, mass: 0.5 } });

        const fadeOut =
          exitFrame !== undefined
            ? interpolate(frame, [exitFrame - 10, exitFrame], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1;

        const pulseOpacity = pulse
          ? 1 + Math.sin(frame * 0.18) * 0.18
          : 1;

        const totalOpacity = scaleX * fadeOut * maxOpacity * pulseOpacity;
        if (totalOpacity <= 0) return null;

        const halfLen = length * scaleX;

        // Second glow layer — wider, softer
        const glowThick = thickness * 6;

        return (
          <g key={i} opacity={totalOpacity} style={{ mixBlendMode: "screen" }}>
            {/* Core streak */}
            <line
              x1={cx - halfLen} y1={y}
              x2={cx + halfLen} y2={y}
              stroke={`url(#streak-${i})`}
              strokeWidth={thickness}
            />
            {/* Soft glow halo */}
            <line
              x1={cx - halfLen * 0.85} y1={y}
              x2={cx + halfLen * 0.85} y2={y}
              stroke={ev.color ?? BRAND.blueL}
              strokeWidth={glowThick}
              strokeOpacity={0.12}
            />
            {/* Bright center dot */}
            <circle
              cx={cx} cy={y}
              r={thickness * 2.5}
              fill="#ffffff"
              opacity={0.9}
            />
          </g>
        );
      })}
    </svg>
  );
};
