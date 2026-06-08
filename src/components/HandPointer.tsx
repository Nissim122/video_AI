import React, { useId } from "react";

export type SkinTone = "light" | "medium" | "dark";

const TONES: Record<SkinTone, { base: string; mid: string; shadow: string; nail: string }> = {
  light:  { base: "#FDDBB4", mid: "#ECA87A", shadow: "#C8804E", nail: "#FFE8D5" },
  medium: { base: "#C8855A", mid: "#A86840", shadow: "#7A4828", nail: "#D89A72" },
  dark:   { base: "#7B4222", mid: "#562C10", shadow: "#381608", nail: "#8E5232" },
};

export interface HandPointerProps {
  /** 0 = relaxed, 1 = fully pressed — animates fingertip down 6px */
  pressProgress?: number;
  opacity?: number;
  /** Width in px. Height is calculated proportionally (≈ width × 1.94). */
  size?: number;
  skinTone?: SkinTone;
}

/**
 * Realistic SVG hand with index finger pointing downward.
 * Fingertip is positioned at the bottom-center of the rendered element.
 */
export const HandPointer: React.FC<HandPointerProps> = ({
  pressProgress = 0,
  opacity = 1,
  size = 80,
  skinTone = "light",
}) => {
  const uid = useId().replace(/:/g, "");
  const t = TONES[skinTone];
  const ts = pressProgress * 6; // tip-shift when pressed

  return (
    <svg
      width={size}
      height={size * 1.94}
      viewBox="0 0 80 155"
      style={{ opacity, display: "block", overflow: "visible" }}
    >
      <defs>
        {/* Palm / back of hand */}
        <radialGradient id={`${uid}pg`} cx="44%" cy="32%" r="62%">
          <stop offset="0%" stopColor={t.base} />
          <stop offset="58%" stopColor={t.mid} />
          <stop offset="100%" stopColor={t.shadow} />
        </radialGradient>
        {/* Index finger (side-lit) */}
        <linearGradient id={`${uid}fg`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={t.shadow} />
          <stop offset="28%"  stopColor={t.base}   />
          <stop offset="72%"  stopColor={t.base}   />
          <stop offset="100%" stopColor={t.shadow} />
        </linearGradient>
        {/* Thumb */}
        <linearGradient id={`${uid}tg`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={t.shadow} />
          <stop offset="50%"  stopColor={t.mid}    />
          <stop offset="100%" stopColor={t.shadow} />
        </linearGradient>
      </defs>

      {/* ── PALM ── */}
      <path
        d={`
          M 22 68
          C 17 62 14 50 14 36
          C 14 22 18 13 26 10
          C 33 7  48 7  56 10
          C 64 13 67 22 67 36
          C 67 52 63 63 60 68
          C 58 74 55 79 55 86
          C 54 96 50 105 44 108
          C 40 110 34 110 30 108
          C 24 105 21 96  20 86
          C 20 79  17 74  15 68
          Z
        `}
        fill={`url(#${uid}pg)`}
      />

      {/* ── KNUCKLE BUMPS (middle / ring / pinky — folded) ── */}
      <path
        d="M 47 11 C 49 2 55 0 58 0 C 62 0 64 4 62 12 Z"
        fill={`url(#${uid}pg)`}
      />
      <path
        d="M 60 15 C 62 7 66 5 68 7 C 71 9 70 15 69 18 Z"
        fill={`url(#${uid}pg)`}
      />
      <path
        d="M 67 19 C 68 14 71 12 73 14 C 75 16 74 21 73 23 Z"
        fill={`url(#${uid}pg)`}
      />

      {/* ── THUMB ── */}
      <path
        d={`
          M 21 75
          C 17 69 13 59 11 49
          C 9  39 10 31 14 27
          C 18 23 24 26 25 34
          C 26 43 24 57 22 74
          Z
        `}
        fill={`url(#${uid}tg)`}
      />
      {/* Thumb knuckle crease */}
      <path
        d="M 11 42 C 14 39 18 37 24 41"
        stroke={t.shadow}
        strokeWidth={1.0}
        fill="none"
        strokeLinecap="round"
        opacity={0.45}
      />

      {/* ── INDEX FINGER (extended, pointing down) ── */}
      <path
        d={`
          M 30 67
          C 28 82 27 98  28 114
          C 29 128 31 137 33 ${142 + ts}
          C 35 ${149 + ts} 37 ${154 + ts} 39 ${155 + ts}
          C 41 ${154 + ts} 43 ${149 + ts} 45 ${142 + ts}
          C 47 137 47 128 48 114
          C 49 98  48 82  46 67
          Z
        `}
        fill={`url(#${uid}fg)`}
      />

      {/* Knuckle crease 1 */}
      <path
        d="M 29 99 C 32 96 38 95 47 99"
        stroke={t.shadow}
        strokeWidth={1.1}
        fill="none"
        strokeLinecap="round"
        opacity={0.45}
      />
      {/* Knuckle crease 2 */}
      <path
        d="M 30 118 C 33 115 38 114 46 118"
        stroke={t.shadow}
        strokeWidth={0.9}
        fill="none"
        strokeLinecap="round"
        opacity={0.38}
      />

      {/* Fingernail */}
      <path
        d={`
          M 34 ${135 + ts}
          C 34 ${128 + ts} 36 ${124 + ts} 39 ${124 + ts}
          C 42 ${124 + ts} 44 ${128 + ts} 44 ${135 + ts}
          C 44 ${143 + ts} 42 ${150 + ts} 39 ${151 + ts}
          C 36 ${150 + ts} 34 ${143 + ts} 34 ${135 + ts}
          Z
        `}
        fill={t.nail}
        opacity={0.8}
      />
    </svg>
  );
};
