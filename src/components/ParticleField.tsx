import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { BRAND } from "../brand";

interface ParticleFieldProps {
  count?: number;
  color?: string;
  dotSize?: number;
  speed?: number;
  connected?: boolean;
  opacity?: number;
  enterFrame?: number;
}

function seeded(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 38,
  color = BRAND.blueL,
  dotSize = 3.5,
  speed = 0.28,
  connected = true,
  opacity = 0.55,
  enterFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - enterFrame);
  const t = elapsed * speed;

  const fadeIn = interpolate(elapsed, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const particles = Array.from({ length: count }, (_, i) => {
    const baseX = seeded(i * 7.31) * 1080;
    const baseY = seeded(i * 13.17) * 1920;
    const vx = (seeded(i * 5.73) - 0.5) * 0.9;
    const vy = (seeded(i * 9.21) - 0.5) * 0.9;
    return {
      x: ((baseX + vx * t * 30) % 1080 + 1080) % 1080,
      y: ((baseY + vy * t * 30) % 1920 + 1920) % 1920,
    };
  });

  const CONNECTION_DIST = 210;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: opacity * fadeIn,
      }}
    >
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        {connected &&
          particles.map((p1, i) =>
            particles.slice(i + 1).map((p2, j) => {
              const dist = Math.sqrt(
                (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2
              );
              if (dist > CONNECTION_DIST) return null;
              const lineOpacity = (1 - dist / CONNECTION_DIST) * 0.3;
              return (
                <line
                  key={`l-${i}-${j}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={color}
                  strokeWidth={1}
                  strokeOpacity={lineOpacity}
                />
              );
            })
          )}
        {particles.map((p, i) => (
          <circle
            key={`d-${i}`}
            cx={p.x}
            cy={p.y}
            r={dotSize}
            fill={color}
            opacity={0.65}
          />
        ))}
      </svg>
    </div>
  );
};
