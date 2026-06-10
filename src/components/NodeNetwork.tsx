import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { BRAND } from "../brand";

const W = 1080;
const H = 1920;

const NODES = [
  { x: 120,  y: 260,  r: 8,  color: BRAND.blueL },
  { x: 540,  y: 130,  r: 11, color: BRAND.blue  },
  { x: 960,  y: 320,  r: 13, color: BRAND.pink  },
  { x: 75,   y: 740,  r: 8,  color: BRAND.blue  },
  { x: 540,  y: 870,  r: 7,  color: BRAND.blueL },
  { x: 1005, y: 700,  r: 8,  color: BRAND.blueL },
  { x: 190,  y: 1320, r: 10, color: BRAND.blue  },
  { x: 540,  y: 1490, r: 8,  color: BRAND.blueL },
  { x: 895,  y: 1290, r: 13, color: BRAND.pink  },
];

const EDGES: [number, number][] = [
  [0, 1], [1, 2],
  [0, 3], [2, 5],
  [3, 4], [4, 5],
  [3, 6], [5, 8],
  [6, 7], [7, 8],
  [1, 4], [4, 7],
];

function dist(a: typeof NODES[0], b: typeof NODES[0]) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

interface NodeNetworkProps {
  f: number;
}

export const NodeNetwork: React.FC<NodeNetworkProps> = ({ f }) => {
  const { fps } = useVideoConfig();

  const overallOpacity = interpolate(
    f,
    [0, 5, 20, 34],
    [0, 1, 0.22, 0.07],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: "absolute", inset: 0, opacity: overallOpacity, pointerEvents: "none" }}
    >
      {/* Edges */}
      {EDGES.map(([ai, bi], ei) => {
        const a = NODES[ai];
        const b = NODES[bi];
        const len = dist(a, b);
        const edgeStart = Math.max(ai, bi) * 3 + 2;
        const prog = spring({ frame: f - edgeStart, fps, config: { damping: 32, stiffness: 110, mass: 0.9 } });
        const isPinkEdge = a.color === BRAND.pink || b.color === BRAND.pink;
        const strokeColor = isPinkEdge
          ? "rgba(224,23,107,0.55)"
          : "rgba(33,150,176,0.45)";
        return (
          <line
            key={ei}
            x1={a.x} y1={a.y}
            x2={b.x} y2={b.y}
            stroke={strokeColor}
            strokeWidth={1.8}
            strokeDasharray={len}
            strokeDashoffset={len * (1 - prog)}
          />
        );
      })}

      {/* Nodes */}
      {NODES.map((node, i) => {
        const sc = spring({ frame: f - i * 3, fps, config: { damping: 16, stiffness: 280, mass: 0.55 } });
        const isPink = node.color === BRAND.pink;
        return (
          <g key={i} transform={`translate(${node.x},${node.y})`}>
            {/* Glow ring */}
            <circle r={(isPink ? 30 : 22) * sc} fill={node.color} opacity={0.18} />
            {/* Core dot */}
            <circle r={node.r * sc} fill={node.color} opacity={0.9} />
          </g>
        );
      })}
    </svg>
  );
};
