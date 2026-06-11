import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export interface ShakeEvent {
  frame: number;
  /** shake strength multiplier, default 1 */
  intensity?: number;
  /** duration in frames, default 18 */
  duration?: number;
}

interface CameraShakeProps {
  children: React.ReactNode;
  shakes: ShakeEvent[];
}

function noise(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export const CameraShake: React.FC<CameraShakeProps> = ({
  children,
  shakes,
}) => {
  const frame = useCurrentFrame();

  let tx = 0;
  let ty = 0;
  let rotate = 0;

  shakes.forEach((shake) => {
    const elapsed = frame - shake.frame;
    const duration = shake.duration ?? 18;
    const intensity = shake.intensity ?? 1;

    if (elapsed < 0 || elapsed > duration) return;

    const decay = interpolate(elapsed, [0, duration], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const strength = intensity * decay;
    tx += (noise(frame * 3.71 + shake.frame) - 0.5) * 28 * strength;
    ty += (noise(frame * 2.33 + shake.frame + 100) - 0.5) * 18 * strength;
    rotate += (noise(frame * 1.91 + shake.frame + 200) - 0.5) * 2 * strength;
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: -40,
        padding: 40,
        transform: `translate(${tx}px, ${ty}px) rotate(${rotate}deg)`,
        transformOrigin: "center center",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};
