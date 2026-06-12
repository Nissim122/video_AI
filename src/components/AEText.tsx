import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

export type AETextMode = "chars" | "words";

export interface AETextProps {
  text: string;
  enterFrame: number;
  /** frames between each unit (char or word) */
  stagger?: number;
  /** animate per character or per word */
  mode?: AETextMode;
  fontSize?: number;
  fontWeight?: number | string;
  fontFamily?: string;
  color?: string;
  accentColor?: string;
  /** zero-based unit indices to colorize with accentColor */
  accentIndices?: number[];
  /** 0–1 fraction of composition height */
  positionY?: number;
  textAlign?: "left" | "center" | "right";
  /** animate letter-spacing from wide → normal (AE "tracking" animator) */
  tracking?: boolean;
  /**
   * Spring bounciness 0–2.
   * 0 = overdamped (no overshoot), 1 = AE default (slight overshoot), 2 = very bouncy
   */
  bounce?: number;
  shadow?: boolean;
}

// In a flex RTL container, items are placed right-to-left by index.
// LTR characters (digits, Latin) within RTL text must be reversed so their
// visual left-to-right order is preserved (e.g. "10" → not rendered as "01").
function prepareBidiUnits(text: string, mode: AETextMode): string[] {
  if (mode === "words") return text.split(" ");

  const chars = text.split("");
  const result: string[] = [];
  let i = 0;
  while (i < chars.length) {
    if (/[0-9a-zA-Z%+\-.,]/.test(chars[i])) {
      const run: string[] = [];
      while (i < chars.length && /[0-9a-zA-Z%+\-.,]/.test(chars[i])) {
        run.push(chars[i]);
        i++;
      }
      // Reverse so flex-rtl renders them in correct LTR visual order
      result.push(...run.reverse());
    } else {
      result.push(chars[i]);
      i++;
    }
  }
  return result;
}

export const AEText: React.FC<AETextProps> = ({
  text,
  enterFrame,
  stagger = 3,
  mode = "chars",
  fontSize = 96,
  fontWeight = 900,
  fontFamily = "'Heebo', sans-serif",
  color = BRAND.text,
  accentColor = BRAND.pink,
  accentIndices = [],
  positionY = 0.42,
  textAlign = "center",
  tracking = false,
  bounce = 1,
  shadow = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const units = prepareBidiUnits(text, mode);
  const lineHeight = 1.2;
  const clipHeight = fontSize * lineHeight;

  // Extra headroom above the clip box so spring overshoot isn't cut off.
  // 28% of fontSize handles even bounce=2 (~20% overshoot) with margin to spare.
  // The char settles at translateY(topPad) inside the clip box, and a negative
  // marginTop on the outer span cancels the extra visual offset.
  const topPad = Math.round(fontSize * 0.28);
  const totalClipHeight = clipHeight + topPad;

  // lower damping = more overshoot (AE feel)
  const damping = interpolate(bounce, [0, 1, 2], [22, 11, 6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const justifyContent =
    textAlign === "center"
      ? "center"
      : textAlign === "right"
      ? "flex-end"
      : "flex-start";

  return (
    <div
      style={{
        position: "absolute",
        top: `${positionY * 100}%`,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent,
        flexWrap: "wrap",
        alignItems: "flex-end",
        // Compensate for topPad so the visual baseline sits at positionY
        transform: `translateY(calc(-50% - ${topPad}px))`,
        direction: "rtl",
        padding: "0 60px",
        pointerEvents: "none",
      }}
    >
      {units.map((unit, i) => {
        // Space placeholder: same clip-box height keeps flex row aligned
        if (unit === "" || unit === " ") {
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                // px-based so it scales with fontSize, not the inherited parent font-size
                width: `${Math.round(fontSize * 0.28)}px`,
                height: totalClipHeight,
                verticalAlign: "bottom",
              }}
            />
          );
        }

        const p = spring({
          frame: Math.max(0, frame - (enterFrame + i * stagger)),
          fps,
          config: { damping, stiffness: 170, mass: 0.75 },
        });

        // Char starts fully below the clip box and settles at topPad,
        // leaving topPad px above for spring overshoot without clipping.
        const y = interpolate(p, [0, 1], [totalClipHeight, topPad]);

        // slight vertical squish at peak velocity — simulates motion blur
        const scaleY = interpolate(p, [0, 0.18, 0.55, 1], [0.6, 1.08, 0.97, 1], {
          extrapolateRight: "clamp",
        });

        // fast fade clears before char fully settles
        const opacity = interpolate(p, [0, 0.28], [0, 1], {
          extrapolateRight: "clamp",
        });

        // directional blur: high while moving fast, gone once settled
        const blur = interpolate(p, [0, 0.14, 0.45], [9, 3, 0], {
          extrapolateRight: "clamp",
        });

        // tracking: letter-spacing collapses as char arrives (AE tracking animator)
        const ls = tracking
          ? interpolate(p, [0, 0.7, 1], [0.35, 0.04, 0], {
              extrapolateRight: "clamp",
            }) + "em"
          : undefined;

        const isAccent = accentIndices.includes(i);
        const charColor = isAccent ? accentColor : color;
        const textShadow = shadow
          ? isAccent
            ? `0 0 40px ${accentColor}55, 0 4px 24px rgba(0,0,0,0.85)`
            : `0 4px 20px rgba(0,0,0,0.8)`
          : undefined;

        return (
          <span
            key={i}
            style={{
              // Clip box: char slides up through this window.
              // totalClipHeight = clipHeight + topPad (overshoot headroom).
              overflow: "hidden",
              display: "inline-block",
              height: totalClipHeight,
              verticalAlign: "bottom",
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${y}px) scaleY(${scaleY})`,
                transformOrigin: "center bottom",
                opacity,
                filter: blur > 0.4 ? `blur(${blur}px)` : undefined,
                fontFamily,
                fontWeight,
                fontSize,
                lineHeight,
                color: charColor,
                letterSpacing: ls,
                textShadow,
                whiteSpace: "pre",
              }}
            >
              {unit}
              {mode === "words" && i < units.length - 1 ? " " : ""}
            </span>
          </span>
        );
      })}
    </div>
  );
};
