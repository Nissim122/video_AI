import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export type KenBurnsPreset =
  | "zoom-in"
  | "zoom-out"
  | "pan-right"
  | "pan-left"
  | "tilt-up"
  | "tilt-down";

interface KenBurnsProps {
  src: string;
  startFrame?: number;
  /** duration of the movement in frames */
  durationFrames?: number;
  preset?: KenBurnsPreset;
  scaleFrom?: number;
  scaleTo?: number;
  /** pan/tilt amount in % */
  panAmount?: number;
}

export const KenBurns: React.FC<KenBurnsProps> = ({
  src,
  startFrame = 0,
  durationFrames = 300,
  preset = "zoom-in",
  scaleFrom,
  scaleTo,
  panAmount = 5,
}) => {
  const frame = useCurrentFrame();

  const elapsed = Math.max(0, frame - startFrame);
  const p = Math.min(1, elapsed / durationFrames);
  // Ease in-out
  const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

  let scale = 1;
  let tx = 0;
  let ty = 0;

  switch (preset) {
    case "zoom-in":
      scale = interpolate(ease, [0, 1], [scaleFrom ?? 1.0, scaleTo ?? 1.18]);
      break;
    case "zoom-out":
      scale = interpolate(ease, [0, 1], [scaleFrom ?? 1.18, scaleTo ?? 1.0]);
      break;
    case "pan-right":
      scale = scaleFrom ?? 1.08;
      tx    = interpolate(ease, [0, 1], [-panAmount, panAmount]);
      break;
    case "pan-left":
      scale = scaleFrom ?? 1.08;
      tx    = interpolate(ease, [0, 1], [panAmount, -panAmount]);
      break;
    case "tilt-up":
      scale = scaleFrom ?? 1.08;
      ty    = interpolate(ease, [0, 1], [panAmount, -panAmount]);
      break;
    case "tilt-down":
      scale = scaleFrom ?? 1.08;
      ty    = interpolate(ease, [0, 1], [-panAmount, panAmount]);
      break;
  }

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${tx}%, ${ty}%)`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      />
    </div>
  );
};
