import React from "react";
import { useCurrentFrame } from "remotion";

interface FilmGrainProps {
  opacity?: number;
  /** change grain seed each frame for realistic noise */
  animated?: boolean;
  blendMode?: React.CSSProperties["mixBlendMode"];
}

export const FilmGrain: React.FC<FilmGrainProps> = ({
  opacity = 0.08,
  animated = true,
  blendMode = "overlay",
}) => {
  const frame = useCurrentFrame();
  const seed  = animated ? (frame * 7) % 100 : 0;
  const id    = `grain-${seed}`;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity,
        mixBlendMode: blendMode,
      }}
    >
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <filter id={id}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="4"
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </div>
  );
};
