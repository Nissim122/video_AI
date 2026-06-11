import React from "react";
import { useCurrentFrame } from "remotion";
import { BRAND } from "../brand";

const W    = 1080;
const H    = 1920;
const COLS = 20;
const ROWS = 28;
const CHARS = "01アイウエオカキクケコサシスセソタチツ";

// Deterministic column configs
const COLUMNS = Array.from({ length: COLS }, (_, i) => ({
  speed:  0.8 + ((i * 7919) % 100) / 100 * 1.2,
  offset: ((i * 6271) % 100) / 100 * -ROWS * 0.6,
  length: 8 + ((i * 3571) % 10),
}));

interface DataStreamProps {
  opacity?: number;
  color?: string;
  fadeInFrames?: number;
}

export const DataStream: React.FC<DataStreamProps> = ({
  opacity = 0.18,
  color = BRAND.blueL,
  fadeInFrames = 20,
}) => {
  const frame = useCurrentFrame();
  const fadeOpacity = Math.min(1, frame / fadeInFrames) * opacity;
  const colW  = W / COLS;
  const rowH  = H / ROWS;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        opacity: fadeOpacity,
        fontFamily: "'Inter', monospace",
        fontSize: 28,
      }}
    >
      {COLUMNS.map((col, ci) => {
        const headY = (frame * col.speed + col.offset) % (ROWS + col.length);
        return Array.from({ length: col.length }, (_, ri) => {
          const row = Math.floor(headY) - ri;
          if (row < 0 || row >= ROWS) return null;
          const isHead   = ri === 0;
          const charIdx  = ((frame + ci * 7 + ri * 13) * 3) % CHARS.length;
          const fadeAlpha = 1 - ri / col.length;

          return (
            <div
              key={`${ci}-${ri}`}
              style={{
                position: "absolute",
                left: ci * colW,
                top: row * rowH,
                width: colW,
                height: rowH,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isHead ? "#fff" : color,
                opacity: isHead ? 0.9 : fadeAlpha * 0.7,
                textShadow: isHead ? `0 0 12px ${color}` : "none",
              }}
            >
              {CHARS[charIdx]}
            </div>
          );
        });
      })}
    </div>
  );
};
