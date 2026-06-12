import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { BRAND } from "../brand";

export interface LensFlareEvent {
  /** frame when flare starts appearing */
  enterFrame: number;
  /** frame when flare starts disappearing (optional — stays until end) */
  exitFrame?: number;
  /** center X in pixels, default 540 */
  x?: number;
  /** center Y in pixels, default 300 */
  y?: number;
  /** overall brightness 0–2, default 1 */
  intensity?: number;
  /** tint color, default warm white */
  color?: string;
  /** whether orbs move with a parallax drift, default true */
  animated?: boolean;
}

interface LensFlareProps {
  events?: LensFlareEvent[];
}

const W = 1080;
const H = 1920;

// Secondary orbs along the lens axis (from flare center through screen center)
const ORB_DEFS = [
  { offset: 0.18, radius: 320, opacity: 0.07 },
  { offset: 0.35, radius: 140, opacity: 0.12 },
  { offset: 0.52, radius:  80, opacity: 0.18 },
  { offset: 0.68, radius: 210, opacity: 0.08 },
  { offset: 0.85, radius:  55, opacity: 0.22 },
  { offset: 1.05, radius: 380, opacity: 0.05 },
  { offset: 1.22, radius:  40, opacity: 0.28 },
];

const SingleFlare: React.FC<{
  event: LensFlareEvent;
  frame: number;
  fps: number;
}> = ({ event, frame, fps }) => {
  const {
    enterFrame,
    exitFrame,
    x = W * 0.72,
    y = 320,
    intensity = 1,
    color = "#fff8e8",
    animated = true,
  } = event;

  const elapsed = frame - enterFrame;

  const fadeIn = spring({ frame: elapsed, fps, config: { damping: 28, stiffness: 200, mass: 0.6 } });
  const fadeOut =
    exitFrame !== undefined
      ? interpolate(frame, [exitFrame - 12, exitFrame], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const opacity = fadeIn * fadeOut * intensity;
  if (opacity <= 0) return null;

  // Subtle drift for the source point
  const driftX = animated ? Math.sin(frame * 0.04) * 6 : 0;
  const driftY = animated ? Math.cos(frame * 0.03) * 4 : 0;
  const fx = x + driftX;
  const fy = y + driftY;

  // Orbs travel along the axis from flare → screen center → past
  const cx = W / 2;
  const cy = H / 2;
  const axisX = cx - fx;
  const axisY = cy - fy;

  const flareId = `flare-${enterFrame}`;

  return (
    <svg
      width={W}
      height={H}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}
    >
      <defs>
        {/* Main halo gradient */}
        <radialGradient id={`${flareId}-halo`} cx={fx} cy={fy} r={280} gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={color} stopOpacity={0.92} />
          <stop offset="18%"  stopColor={color} stopOpacity={0.45} />
          <stop offset="50%"  stopColor={color} stopOpacity={0.12} />
          <stop offset="100%" stopColor={color} stopOpacity={0}    />
        </radialGradient>
        {/* Starburst gradient */}
        <radialGradient id={`${flareId}-star`} cx={fx} cy={fy} r={90} gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity={1}   />
          <stop offset="30%"  stopColor={color}   stopOpacity={0.7} />
          <stop offset="100%" stopColor={color}   stopOpacity={0}   />
        </radialGradient>
        {/* Orb gradient factory */}
        {ORB_DEFS.map((orb, i) => {
          const ox = fx + axisX * orb.offset;
          const oy = fy + axisY * orb.offset;
          return (
            <radialGradient key={i} id={`${flareId}-orb-${i}`} cx={ox} cy={oy} r={orb.radius} gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor={BRAND.blueL} stopOpacity={orb.opacity * 1.4} />
              <stop offset="45%"  stopColor={BRAND.blue}  stopOpacity={orb.opacity * 0.6} />
              <stop offset="100%" stopColor={BRAND.blue}  stopOpacity={0}                 />
            </radialGradient>
          );
        })}
        <filter id={`${flareId}-blur`}>
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <g opacity={opacity}>
        {/* Large soft halo */}
        <ellipse
          cx={fx} cy={fy} rx={280} ry={220}
          fill={`url(#${flareId}-halo)`}
          style={{ mixBlendMode: "screen" }}
        />

        {/* Starburst core */}
        <circle
          cx={fx} cy={fy} r={90}
          fill={`url(#${flareId}-star)`}
          style={{ mixBlendMode: "screen" }}
        />

        {/* 12-spoke starburst rays */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * Math.PI) / 6;
          const len   = i % 3 === 0 ? 420 : i % 2 === 0 ? 280 : 190;
          return (
            <line
              key={i}
              x1={fx} y1={fy}
              x2={fx + Math.cos(angle) * len}
              y2={fy + Math.sin(angle) * len}
              stroke={color}
              strokeWidth={i % 3 === 0 ? 2.5 : 1.2}
              strokeOpacity={i % 3 === 0 ? 0.28 : 0.14}
              style={{ mixBlendMode: "screen" }}
              filter={`url(#${flareId}-blur)`}
            />
          );
        })}

        {/* Horizontal anamorphic streak */}
        <line
          x1={fx - 600} y1={fy}
          x2={fx + 600} y2={fy}
          stroke={color}
          strokeWidth={3}
          strokeOpacity={0.18}
          style={{ mixBlendMode: "screen" }}
          filter={`url(#${flareId}-blur)`}
        />

        {/* Secondary orbs */}
        {ORB_DEFS.map((orb, i) => {
          const ox = fx + axisX * orb.offset;
          const oy = fy + axisY * orb.offset;
          return (
            <circle
              key={i}
              cx={ox} cy={oy} r={orb.radius}
              fill={`url(#${flareId}-orb-${i})`}
              style={{ mixBlendMode: "screen" }}
            />
          );
        })}

        {/* Chromatic ring */}
        <circle
          cx={fx} cy={fy} r={160}
          fill="none"
          stroke={BRAND.pink}
          strokeWidth={1.5}
          strokeOpacity={0.15}
          style={{ mixBlendMode: "screen" }}
        />
        <circle
          cx={fx} cy={fy} r={165}
          fill="none"
          stroke={BRAND.blueL}
          strokeWidth={1}
          strokeOpacity={0.1}
          style={{ mixBlendMode: "screen" }}
        />
      </g>
    </svg>
  );
};

export const LensFlare: React.FC<LensFlareProps> = ({ events = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {events.map((ev, i) => (
        <SingleFlare key={i} event={ev} frame={frame} fps={fps} />
      ))}
    </div>
  );
};
