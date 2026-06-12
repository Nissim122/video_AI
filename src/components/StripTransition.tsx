import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { Easing } from "remotion";

type Direction = "left" | "right" | "up" | "down";
type Feel = "snappy" | "smooth" | "bouncy";

export interface StripEvent {
  triggerFrame: number;
  /** total duration covering stagger + each strip's slide — default 22 */
  durationFrames?: number;
  /** number of strips — default 8 */
  strips?: number;
  /** side the strips come FROM — default "right" */
  direction?: Direction;
  /** color of the strips — default "#000000" */
  color?: string;
  /** "in" = strips cover the screen, "out" = strips uncover — default "in" */
  mode?: "in" | "out";
  feel?: Feel;
}

const EASING: Record<Feel, (t: number) => number> = {
  snappy: Easing.bezier(0.22, 1, 0.36, 1),
  smooth: Easing.bezier(0.4, 0, 0.2, 1),
  bouncy: Easing.bezier(0.34, 1.56, 0.64, 1),
};

interface StripTransitionProps {
  events: StripEvent[];
}

const StripSet: React.FC<StripEvent & { frame: number; width: number; height: number }> = ({
  frame,
  width,
  height,
  triggerFrame,
  durationFrames = 22,
  strips = 8,
  direction = "right",
  color = "#000000",
  mode = "in",
  feel = "snappy",
}) => {
  const isHorizontal = direction === "left" || direction === "right";

  // Each strip gets (stagger fraction) of the total duration, rest is its slide duration
  const staggerTotal = durationFrames * 0.45;
  const staggerPer = strips > 1 ? staggerTotal / (strips - 1) : 0;
  const activeDuration = durationFrames - staggerTotal;
  const ease = EASING[feel];

  return (
    <>
      {Array.from({ length: strips }, (_, i) => {
        const start = triggerFrame + i * staggerPer;
        const progress = interpolate(frame, [start, start + activeDuration], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease,
        });

        // t=1 → in place (covers), t=0 → off-screen
        const t = mode === "in" ? 1 - progress : progress;

        // Must be computed before transform switch (used to guarantee full off-screen offset)
        const stripW = isHorizontal ? Math.ceil(width / strips) + 1 : width;
        const stripH = isHorizontal ? height : Math.ceil(height / strips) + 1;
        const left   = isHorizontal ? i * Math.floor(width / strips) : 0;
        const top    = isHorizontal ? 0 : i * Math.floor(height / strips);

        // For "left" and "up", the last strip needs stripW/stripH extra offset to clear the screen
        let transform = "";
        switch (direction) {
          case "right": transform = `translateX(${width * t}px)`;            break;
          case "left":  transform = `translateX(${-(width + stripW) * t}px)`; break;
          case "down":  transform = `translateY(${height * t}px)`;            break;
          case "up":    transform = `translateY(${-(height + stripH) * t}px)`; break;
        }

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left,
              top,
              width: stripW,
              height: stripH,
              background: color,
              transform,
            }}
          />
        );
      })}
    </>
  );
};

export const StripTransition: React.FC<StripTransitionProps> = ({ events }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {events.map((ev, i) => (
        <StripSet key={i} {...ev} frame={frame} width={width} height={height} />
      ))}
    </AbsoluteFill>
  );
};
