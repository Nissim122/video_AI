import React from "react";
import { useCurrentFrame } from "remotion";
import { BRAND } from "../brand";

interface GridBackgroundProps {
  cellSize?: number;
  color?: string;
  opacity?: number;
  /** px per frame the grid scrolls diagonally */
  scrollSpeed?: number;
  fadeInFrames?: number;
  /** show dots at intersections */
  dots?: boolean;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({
  cellSize = 80,
  color = BRAND.blue,
  opacity = 0.15,
  scrollSpeed = 0.3,
  fadeInFrames = 30,
  dots = true,
}) => {
  const frame = useCurrentFrame();
  const fadeOpacity = Math.min(1, frame / fadeInFrames) * opacity;
  const offset = (frame * scrollSpeed) % cellSize;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        opacity: fadeOpacity,
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: `-${cellSize}px`, width: `calc(100% + ${cellSize * 2}px)`, height: `calc(100% + ${cellSize * 2}px)` }}
      >
        <defs>
          <pattern
            id="clix-grid"
            width={cellSize}
            height={cellSize}
            patternUnits="userSpaceOnUse"
            x={offset}
            y={offset}
          >
            <path
              d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
              fill="none"
              stroke={color}
              strokeWidth={0.8}
            />
            {dots && <circle cx={0} cy={0} r={2.5} fill={color} opacity={0.8} />}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#clix-grid)" />
      </svg>
    </div>
  );
};
