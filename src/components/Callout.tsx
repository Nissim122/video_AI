import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

type CalloutSide = "left" | "right";

interface CalloutProps {
  text: string;
  /** tip of the arrow — where it points to */
  arrowX: number;
  arrowY: number;
  /** which side the text box appears */
  side?: CalloutSide;
  enterFrame: number;
  holdFrames?: number;
  accentColor?: string;
}

export const Callout: React.FC<CalloutProps> = ({
  text,
  arrowX,
  arrowY,
  side = "right",
  enterFrame,
  holdFrames = 0,
  accentColor = BRAND.blueL,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 18, stiffness: 180, mass: 0.8 },
  });

  const exit =
    holdFrames > 0
      ? spring({
          frame: Math.max(0, frame - (enterFrame + holdFrames)),
          fps,
          config: { damping: 18, stiffness: 180, mass: 0.8 },
        })
      : 0;

  const opacity = Math.max(0, Math.min(enter * 2, 1) - exit * 2);
  const scale = interpolate(enter, [0, 1], [0.7, 1]) * interpolate(exit, [0, 1], [1, 0.85]);

  // Box position: offset from arrow tip
  const boxOffset = 80;
  const boxX = side === "right" ? arrowX + boxOffset : arrowX - boxOffset - 480;
  const boxY = arrowY - 60;

  // Line endpoint (center-left or center-right of box)
  const lineEndX = side === "right" ? boxX : boxX + 480;
  const lineEndY = boxY + 50;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity,
      }}
    >
      {/* Arrow line */}
      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={accentColor} />
          </marker>
          <filter id="callout-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <line
          x1={lineEndX}
          y1={lineEndY}
          x2={arrowX}
          y2={arrowY}
          stroke={accentColor}
          strokeWidth={3}
          strokeDasharray="8 5"
          markerEnd="url(#arrowhead)"
          filter="url(#callout-glow)"
          opacity={0.9}
        />
        {/* Dot at arrow tip */}
        <circle cx={arrowX} cy={arrowY} r={8} fill={accentColor} opacity={0.9} filter="url(#callout-glow)" />
        <circle cx={arrowX} cy={arrowY} r={16} fill={accentColor} opacity={0.2} />
      </svg>

      {/* Text box */}
      <div
        style={{
          position: "absolute",
          left: boxX,
          top: boxY,
          width: 480,
          background: "rgba(14,22,40,0.88)",
          backdropFilter: "blur(14px)",
          border: `1.5px solid ${accentColor}44`,
          borderRadius: 16,
          padding: "16px 22px",
          transform: `scale(${scale})`,
          transformOrigin: side === "right" ? "left center" : "right center",
          boxShadow: `0 0 30px ${accentColor}22, 0 8px 30px rgba(0,0,0,0.5)`,
          direction: "rtl",
        }}
      >
        <span
          style={{
            fontFamily: "'Heebo', sans-serif",
            fontWeight: 600,
            fontSize: 36,
            color: BRAND.text,
            lineHeight: 1.35,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
