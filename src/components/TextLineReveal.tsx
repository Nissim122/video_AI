import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { BRAND } from "../brand";

export interface TextLineRevealItem {
  text: string;
  /** frame this line starts revealing */
  enterFrame: number;
  /** frame this line starts exiting (optional) */
  exitFrame?: number;
  /** "white" | "pink" | "blue" | custom hex, default "white" */
  color?: string;
  /** accent word indices that get a different color */
  accentWords?: number[];
  accentColor?: string;
}

interface TextLineRevealProps {
  lines: TextLineRevealItem[];
  /** font size in px, default 80 */
  fontSize?: number;
  /** line height multiplier, default 1.25 */
  lineHeight?: number;
  /** 0 (top) – 1 (bottom), default 0.5 */
  positionY?: number;
  /** text-align: "right" | "center" | "left", default "center" */
  align?: "right" | "center" | "left";
  /** feel: "snappy" | "smooth" | "bouncy", default "snappy" */
  feel?: "snappy" | "smooth" | "bouncy";
  /** show the reveal line accent, default true */
  showLine?: boolean;
}

const FEEL_CONFIGS = {
  snappy: { damping: 14, stiffness: 280, mass: 0.55 },
  smooth: { damping: 22, stiffness: 160, mass: 0.8  },
  bouncy: { damping: 8,  stiffness: 320, mass: 0.6  },
};

const COLOR_MAP: Record<string, string> = {
  white: BRAND.text,
  pink:  BRAND.pink,
  blue:  BRAND.blueL,
};

export const TextLineReveal: React.FC<TextLineRevealProps> = ({
  lines,
  fontSize = 80,
  lineHeight = 1.25,
  positionY = 0.5,
  align = "center",
  feel = "snappy",
  showLine = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const config = FEEL_CONFIGS[feel];

  const lineHeightPx = fontSize * lineHeight;
  const totalH = lines.length * lineHeightPx;
  const topY = positionY * height - totalH / 2;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      {lines.map((line, idx) => {
        const elapsed = Math.max(0, frame - line.enterFrame);

        const progress = spring({
          frame: elapsed,
          fps,
          config,
        });

        // Translate from 100% below the clip line → 0
        const translateY = (1 - progress) * (lineHeightPx + 8);

        // Exit
        const exitOpacity =
          line.exitFrame !== undefined
            ? interpolate(frame, [line.exitFrame, line.exitFrame + 14], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1;

        const color = COLOR_MAP[line.color ?? "white"] ?? line.color ?? BRAND.text;
        const accentColor = line.accentColor ?? BRAND.pink;

        // Split into words for accent coloring
        const words = line.text.split(" ");

        const lineY = topY + idx * lineHeightPx;

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: lineY,
              height: lineHeightPx,
              overflow: "hidden",
              opacity: exitOpacity,
              display: "flex",
              justifyContent:
                align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
              alignItems: "flex-end",
              padding: "0 80px",
            }}
          >
            {/* The line accent bar — appears at bottom of clip area */}
            {showLine && elapsed > 0 && elapsed < 4 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 80,
                  right: 80,
                  height: 2,
                  background: `linear-gradient(90deg, transparent, ${BRAND.blue}, ${BRAND.pink}, transparent)`,
                  opacity: interpolate(elapsed, [0, 2, 4], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                }}
              />
            )}

            {/* Text that slides up */}
            <div
              style={{
                transform: `translateY(${translateY}px)`,
                fontFamily: "'Heebo', sans-serif",
                fontSize,
                fontWeight: 800,
                lineHeight: 1,
                direction: "rtl",
                whiteSpace: "nowrap",
                display: "flex",
                gap: "0.25em",
                flexDirection: "row-reverse",
              }}
            >
              {words.map((word, wi) => (
                <span
                  key={wi}
                  style={{
                    color: line.accentWords?.includes(wi) ? accentColor : color,
                    textShadow:
                      line.accentWords?.includes(wi)
                        ? `0 0 40px ${accentColor}88`
                        : `0 4px 40px rgba(0,0,0,0.6)`,
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
