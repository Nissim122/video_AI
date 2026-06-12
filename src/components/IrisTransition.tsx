import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { Easing } from "remotion";

type Feel = "snappy" | "smooth";

export interface IrisEvent {
  triggerFrame: number;
  /** total animation duration in frames — default 24 */
  durationFrames?: number;
  /** center X in pixels — default: width / 2 */
  cx?: number;
  /** center Y in pixels — default: height / 2 */
  cy?: number;
  /** color of the overlay — default "#000000" */
  color?: string;
  /**
   * "open"  — circle grows to reveal (overlay disappears)
   * "close" — circle shrinks to hide (overlay appears)
   * default: "close"
   */
  mode?: "open" | "close";
  feel?: Feel;
}

interface IrisTransitionProps {
  events: IrisEvent[];
}

const EASING: Record<Feel, (t: number) => number> = {
  snappy: Easing.bezier(0.22, 1, 0.36, 1),
  smooth: Easing.bezier(0.4, 0, 0.2, 1),
};

let _uid = 0;
const nextId = () => `iris-${_uid++}`;

const IrisSet: React.FC<IrisEvent & { frame: number; width: number; height: number }> = ({
  frame,
  width,
  height,
  triggerFrame,
  durationFrames = 24,
  cx: cxProp,
  cy: cyProp,
  color = "#000000",
  mode = "close",
  feel = "snappy",
}) => {
  const cx = cxProp ?? width / 2;
  const cy = cyProp ?? height / 2;

  // Max radius: farthest corner from center
  const maxRadius =
    Math.sqrt(Math.max(cx, width - cx) ** 2 + Math.max(cy, height - cy) ** 2) + 2;

  const ease = EASING[feel];

  const progress = interpolate(
    frame,
    [triggerFrame, triggerFrame + durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }
  );

  // open: radius grows 0 → maxRadius (overlay disappears)
  // close: radius shrinks maxRadius → 0 (overlay appears)
  const radius =
    mode === "open"
      ? maxRadius * progress
      : maxRadius * (1 - progress);

  // Stable ID per component instance — must be before any early returns (Rules of Hooks)
  const id = React.useRef(nextId()).current;

  // "open" fully revealed — no overlay needed
  if (mode === "open" && radius >= maxRadius) return null;
  // "close" fully covered — render solid rect (SVG with r=0 achieves the same but this is cheaper)
  if (mode === "close" && radius <= 0)
    return <div style={{ position: "absolute", inset: 0, background: color }} />;

  return (
    <svg
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <defs>
        <mask id={id}>
          {/* white = show the overlay */}
          <rect width={width} height={height} fill="white" />
          {/* black circle = punch-hole (transparent) */}
          <circle cx={cx} cy={cy} r={radius} fill="black" />
        </mask>
      </defs>
      <rect
        width={width}
        height={height}
        fill={color}
        mask={`url(#${id})`}
      />
    </svg>
  );
};

export const IrisTransition: React.FC<IrisTransitionProps> = ({ events }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {events.map((ev, i) => (
        <IrisSet key={i} {...ev} frame={frame} width={width} height={height} />
      ))}
    </AbsoluteFill>
  );
};
