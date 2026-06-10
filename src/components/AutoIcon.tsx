import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { BRAND } from "../brand";

const ORBIT_R = 130;
const CENTER_R = 42;
const SAT_R = 16;
const NUM_SAT = 6;

// Lightning bolt path centered at 0,0, fits inside r=26
const BOLT = "M 5,-24 L -9,4 L 1,4 L -5,24 L 9,-4 L -1,-4 Z";

interface AutoIconProps {
  f: number;
}

export const AutoIcon: React.FC<AutoIconProps> = ({ f }) => {
  const { fps } = useVideoConfig();

  const appear = spring({ frame: f, fps, config: { damping: 18, stiffness: 200, mass: 0.8 } });
  const opacity = interpolate(f, [0, 4, 20, 34], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rotation = f * 0.55;
  const corePulse = 0.65 + Math.sin(f * 0.18) * 0.35;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        transform: `scale(${0.3 + appear * 0.7})`,
        pointerEvents: "none",
      }}
    >
      <svg width="380" height="380" viewBox="-190 -190 380 380">
        {/* Outer glow rings */}
        <circle r={CENTER_R + 60} fill={BRAND.blue} opacity={0.06 * corePulse} />
        <circle r={CENTER_R + 36} fill={BRAND.blue} opacity={0.11 * corePulse} />

        {/* Orbit ring */}
        <circle r={ORBIT_R} fill="none" stroke={BRAND.blue} strokeWidth={1.2} strokeDasharray="6 8" opacity={0.35} />

        {/* Satellite nodes — rotate around center */}
        <g transform={`rotate(${rotation})`}>
          {Array.from({ length: NUM_SAT }, (_, i) => {
            const angle = ((i / NUM_SAT) * 360 * Math.PI) / 180;
            const nx = Math.cos(angle) * ORBIT_R;
            const ny = Math.sin(angle) * ORBIT_R;
            const satAppear = spring({ frame: f - i * 2, fps, config: { damping: 20, stiffness: 260, mass: 0.6 } });
            const isAccent = i % 2 === 0;
            const nodeColor = isAccent ? BRAND.pink : BRAND.blueL;
            return (
              <g key={i}>
                {/* Connector line */}
                <line
                  x1={0} y1={0} x2={nx} y2={ny}
                  stroke={nodeColor}
                  strokeWidth={1.4}
                  opacity={0.38 * satAppear}
                />
                {/* Node glow */}
                <circle cx={nx} cy={ny} r={(SAT_R + 10) * satAppear} fill={nodeColor} opacity={0.16} />
                {/* Node core */}
                <circle cx={nx} cy={ny} r={SAT_R * satAppear} fill={BRAND.bgE} stroke={nodeColor} strokeWidth={2} />
              </g>
            );
          })}
        </g>

        {/* Center glow */}
        <circle r={CENTER_R + 14} fill={BRAND.pink} opacity={0.14 * corePulse} />
        <circle r={CENTER_R + 6} fill={BRAND.pink} opacity={0.22 * corePulse} />

        {/* Center circle */}
        <circle r={CENTER_R} fill={BRAND.bgF} stroke={BRAND.pink} strokeWidth={2.5} />

        {/* Lightning bolt */}
        <path d={BOLT} fill={BRAND.pink} opacity={0.95} />
      </svg>
    </div>
  );
};
