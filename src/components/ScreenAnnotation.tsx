import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";
import { ScreenRegion } from "../screens/screen-1-pain.coords";

type Side = "top" | "bottom" | "left" | "right";

interface ScreenAnnotationProps {
  pos: ScreenRegion;
  startAt: number;
  label: string;
  side?: Side;
  color?: string;
}

export const ScreenAnnotation: React.FC<ScreenAnnotationProps> = ({
  pos,
  startAt,
  label,
  side = "bottom",
  color = BRAND.blueL,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startAt,
    fps,
    config: { damping: 16, mass: 0.8, stiffness: 140 },
  });

  const opacity = interpolate(frame, [startAt, startAt + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // center of target region
  const cx = `calc(${pos.left} + ${pos.width} / 2)`;
  const cy = `calc(${pos.top} + ${pos.height} / 2)`;

  // offset for label position based on side
  const OFFSET = 70;
  const offsetMap: Record<Side, { dx: number; dy: number }> = {
    bottom: { dx: 0,       dy: OFFSET  },
    top:    { dx: 0,       dy: -OFFSET },
    right:  { dx: OFFSET,  dy: 0       },
    left:   { dx: -OFFSET, dy: 0       },
  };
  const { dx, dy } = offsetMap[side];

  // entrance: slide from arrow anchor toward final position
  const slideX = interpolate(progress, [0, 1], [-dx * 0.4, 0]);
  const slideY = interpolate(progress, [0, 1], [-dy * 0.4, 0]);

  // arrow path: from region edge to label
  const arrowLength = 52;
  const arrowMap: Record<Side, string> = {
    bottom: `M 0 0 L 0 ${-arrowLength}`,
    top:    `M 0 0 L 0 ${arrowLength}`,
    right:  `M 0 0 L ${-arrowLength} 0`,
    left:   `M 0 0 L ${arrowLength} 0`,
  };
  const arrowPath = arrowMap[side];

  const arrowHeadMap: Record<Side, string> = {
    bottom: `M -7 ${-arrowLength + 10} L 0 ${-arrowLength} L 7 ${-arrowLength + 10}`,
    top:    `M -7 ${arrowLength - 10} L 0 ${arrowLength} L 7 ${arrowLength - 10}`,
    right:  `M ${-arrowLength + 10} -7 L ${-arrowLength} 0 L ${-arrowLength + 10} 7`,
    left:   `M ${arrowLength - 10} -7 L ${arrowLength} 0 L ${arrowLength - 10} 7`,
  };
  const arrowHead = arrowHeadMap[side];

  const strokeDash = arrowLength;
  const strokeOffset = interpolate(progress, [0, 1], [strokeDash, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: cy,
        left: cx,
        opacity,
        transform: `translate(-50%, -50%) translateX(${dx + slideX}px) translateY(${dy + slideY}px)`,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Arrow SVG — drawn from the label back toward the region */}
      <svg
        width={120}
        height={120}
        viewBox="-60 -60 120 120"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginTop: -60,
          marginLeft: -60,
          overflow: "visible",
        }}
      >
        <path
          d={arrowPath}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={strokeDash}
          strokeDashoffset={strokeOffset}
        />
        <path
          d={arrowHead}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={progress}
        />
      </svg>

      {/* Label box */}
      <div
        style={{
          background: `rgba(33,150,176,0.15)`,
          border: `2px solid ${color}`,
          borderRadius: 12,
          padding: "10px 20px",
          color: BRAND.text,
          fontSize: 30,
          fontWeight: 700,
          whiteSpace: "nowrap",
          direction: "rtl",
          boxShadow: `0 0 24px rgba(33,150,176,0.35)`,
          transform: `scale(${progress})`,
          transformOrigin: "center",
        }}
      >
        {label}
      </div>
    </div>
  );
};
