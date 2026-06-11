import React from "react";
import { useCurrentFrame } from "remotion";
import { BRAND } from "../brand";

interface DrawPathProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  enterFrame: number;
  durationFrames?: number;
  color?: string;
  strokeWidth?: number;
  /** Optional Bezier control point for a curved path */
  cpx?: number;
  cpy?: number;
  label?: string;
  arrowHead?: boolean;
}

function bezierLength(
  x1: number, y1: number,
  cpx: number, cpy: number,
  x2: number, y2: number,
  steps = 40
): number {
  let len = 0;
  let px = x1;
  let py = y1;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const nx = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * cpx + t ** 2 * x2;
    const ny = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cpy + t ** 2 * y2;
    len += Math.sqrt((nx - px) ** 2 + (ny - py) ** 2);
    px = nx;
    py = ny;
  }
  return len;
}

export const DrawPath: React.FC<DrawPathProps> = ({
  x1, y1, x2, y2,
  enterFrame,
  durationFrames = 22,
  color = BRAND.pink,
  strokeWidth = 4,
  cpx,
  cpy,
  label,
  arrowHead = true,
}) => {
  const frame = useCurrentFrame();

  const elapsed = Math.max(0, frame - enterFrame);
  const progress = Math.min(1, elapsed / durationFrames);

  const hasCurve = cpx !== undefined && cpy !== undefined;
  const pathLength = hasCurve
    ? bezierLength(x1, y1, cpx!, cpy!, x2, y2)
    : Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const d = hasCurve
    ? `M ${x1} ${y1} Q ${cpx} ${cpy} ${x2} ${y2}`
    : `M ${x1} ${y1} L ${x2} ${y2}`;

  const dashOffset = pathLength * (1 - progress);
  const arrowId = `arrow-${enterFrame}-${Math.round(x1)}-${Math.round(y1)}`;
  const glowId = `draw-glow-${enterFrame}`;

  const labelOpacity = progress > 0.75 ? (progress - 0.75) * 4 : 0;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          {arrowHead && (
            <marker
              id={arrowId}
              markerWidth="10"
              markerHeight="10"
              refX="10"
              refY="5"
              orient="auto"
            >
              <path d="M0,0 L0,10 L10,5 z" fill={color} opacity={0.9} />
            </marker>
          )}
          <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={dashOffset}
          markerEnd={arrowHead ? `url(#${arrowId})` : undefined}
          filter={`url(#${glowId})`}
        />

        {label && (
          <text
            x={(x1 + x2) / 2 + (hasCurve ? (cpx! - (x1 + x2) / 2) * 0.5 : 0)}
            y={(y1 + y2) / 2 + (hasCurve ? (cpy! - (y1 + y2) / 2) * 0.5 : 0) - 18}
            textAnchor="middle"
            fill={color}
            fontSize={28}
            fontFamily="'Heebo', sans-serif"
            fontWeight="700"
            opacity={labelOpacity}
            filter={`url(#${glowId})`}
          >
            {label}
          </text>
        )}
      </svg>
    </div>
  );
};
