import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export type RevealDirection = "left" | "right" | "bottom" | "top" | "none";
export type RevealAnimation = "slide" | "scale" | "rotate" | "slide-rotate" | "slide-fade";
export type RevealFeel = "snappy" | "smooth" | "bouncy";

interface BehindRevealProps {
  enterFrame: number;
  exitFrame?: number;

  enterFrom?: RevealDirection;
  exitTo?: RevealDirection;

  animation?: RevealAnimation;
  feel?: RevealFeel;

  /** override distance in px */
  distance?: number;
  children: React.ReactNode;
}

// ─── Spring presets ───────────────────────────────────────────────────────────
const SPRINGS: Record<RevealFeel, { damping: number; stiffness: number; mass: number }> = {
  snappy:  { damping: 22, stiffness: 260, mass: 0.7 },
  smooth:  { damping: 30, stiffness: 110, mass: 1.1 },
  bouncy:  { damping:  9, stiffness: 200, mass: 0.8 },
};

// ─── Direction → translate offset ────────────────────────────────────────────
const DEFAULT_DISTANCE: Record<RevealDirection, number> = {
  left: 1200, right: 1200, bottom: 2000, top: 2000, none: 0,
};

function dirOffset(dir: RevealDirection, dist: number): { x: number; y: number } {
  if (dir === "left")   return { x: -dist, y: 0 };
  if (dir === "right")  return { x:  dist, y: 0 };
  if (dir === "bottom") return { x: 0, y:  dist };
  if (dir === "top")    return { x: 0, y: -dist };
  return { x: 0, y: 0 };
}

// ─── Animation → extra transforms ────────────────────────────────────────────
function extraEnter(anim: RevealAnimation, p: number) {
  switch (anim) {
    case "scale":
      return { scale: interpolate(p, [0, 1], [0, 1]), rotate: 0, opacity: interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }) };
    case "rotate":
      return { scale: 1, rotate: interpolate(p, [0, 1], [-25, 0]), opacity: interpolate(p, [0, 0.2], [0, 1], { extrapolateRight: "clamp" }) };
    case "slide-rotate":
      return { scale: interpolate(p, [0, 0.6, 1], [0.9, 1.03, 1], { extrapolateRight: "clamp" }), rotate: interpolate(p, [0, 1], [-12, 0]), opacity: 1 };
    case "slide-fade":
      return { scale: interpolate(p, [0, 0.6, 1], [0.92, 1.02, 1], { extrapolateRight: "clamp" }), rotate: 0, opacity: interpolate(p, [0, 0.35], [0, 1], { extrapolateRight: "clamp" }) };
    case "slide":
    default:
      return { scale: interpolate(p, [0, 0.6, 1], [0.9, 1.03, 1], { extrapolateRight: "clamp" }), rotate: 0, opacity: 1 };
  }
}

function extraExit(anim: RevealAnimation, p: number) {
  switch (anim) {
    case "scale":
      return { scale: interpolate(p, [0, 1], [1, 0]), rotate: 0, opacity: interpolate(p, [0.7, 1], [1, 0], { extrapolateRight: "clamp" }) };
    case "rotate":
      return { scale: 1, rotate: interpolate(p, [0, 1], [0, 25]), opacity: interpolate(p, [0.8, 1], [1, 0], { extrapolateRight: "clamp" }) };
    case "slide-rotate":
      return { scale: interpolate(p, [0, 1], [1, 0.9]), rotate: interpolate(p, [0, 1], [0, 12]), opacity: 1 };
    case "slide-fade":
      return { scale: interpolate(p, [0, 1], [1, 0.92]), rotate: 0, opacity: interpolate(p, [0.65, 1], [1, 0], { extrapolateRight: "clamp" }) };
    case "slide":
    default:
      return { scale: interpolate(p, [0, 1], [1, 0.9]), rotate: 0, opacity: 1 };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export const BehindReveal: React.FC<BehindRevealProps> = ({
  enterFrame,
  exitFrame,
  enterFrom = "left",
  exitTo,
  animation = "slide",
  feel = "snappy",
  distance,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cfg = SPRINGS[feel];

  const enterP = spring({ frame: Math.max(0, frame - enterFrame), fps, config: cfg });
  const exitP  = exitFrame != null
    ? spring({ frame: Math.max(0, frame - exitFrame), fps, config: cfg })
    : 0;

  // Slide translation — enter
  const enterDist = distance ?? DEFAULT_DISTANCE[enterFrom];
  const { x: ex, y: ey } = dirOffset(enterFrom, enterDist);
  const enterTx = interpolate(enterP, [0, 1], [ex, 0]);
  const enterTy = interpolate(enterP, [0, 1], [ey, 0]);

  // Slide translation — exit (independent direction)
  const resolvedExitDir = exitTo ?? enterFrom;
  const exitDist = distance ?? DEFAULT_DISTANCE[resolvedExitDir];
  const { x: ox, y: oy } = dirOffset(resolvedExitDir, exitDist);
  const exitTx = interpolate(exitP, [0, 1], [0, ox]);
  const exitTy = interpolate(exitP, [0, 1], [0, oy]);

  const tx = enterTx + exitTx;
  const ty = enterTy + exitTy;

  // Extra animation layers
  const eIn  = extraEnter(animation, enterP);
  const eOut = extraExit(animation,  exitP);

  const scale   = eIn.scale   * eOut.scale;
  const rotate  = eIn.rotate  + eOut.rotate;
  const opacity = eIn.opacity * eOut.opacity;

  return (
    <div
      style={{
        transform: `translate(${tx}px, ${ty}px) scale(${scale}) rotate(${rotate}deg)`,
        opacity,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
};
