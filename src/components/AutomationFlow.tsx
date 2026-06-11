import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

export interface FlowNode {
  id: string;
  label: string;
  icon?: string;
  color?: string;
}

export interface FlowEdge {
  from: string;
  to: string;
}

interface AutomationFlowProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  enterFrame: number;
  staggerFrames?: number;
  positionY?: number;
  layout?: "horizontal" | "vertical";
}

const NODE_W = 175;
const NODE_H = 76;
const GAP = 80;

export const AutomationFlow: React.FC<AutomationFlowProps> = ({
  nodes,
  edges,
  enterFrame,
  staggerFrames = 14,
  positionY = 0.5,
  layout = "horizontal",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isH = layout === "horizontal";

  // Compute SVG canvas size
  const svgW = isH
    ? nodes.length * NODE_W + (nodes.length - 1) * GAP + 40
    : NODE_W + 40;
  const svgH = isH
    ? NODE_H + 40
    : nodes.length * NODE_H + (nodes.length - 1) * GAP + 40;

  // Node positions
  const nodePos = nodes.map((n, i) => ({
    ...n,
    x: isH ? 20 + i * (NODE_W + GAP) : 20,
    y: isH ? 20 : 20 + i * (NODE_H + GAP),
  }));
  const nodeMap = Object.fromEntries(nodePos.map((n) => [n.id, n]));

  const top = positionY * 1920 - svgH / 2;
  const left = 540 - svgW / 2;

  const arrowMarkerId = `flow-arrow-${enterFrame}`;
  const glowId = `flow-glow-${enterFrame}`;

  return (
    <div style={{ position: "absolute", top, left, pointerEvents: "none" }}>
      <svg width={svgW} height={svgH} overflow="visible">
        <defs>
          <marker
            id={arrowMarkerId}
            markerWidth="9"
            markerHeight="9"
            refX="9"
            refY="4.5"
            orient="auto"
          >
            <path d="M0,0 L0,9 L9,4.5 z" fill={BRAND.blueL} opacity={0.9} />
          </marker>
          <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges — appear after all nodes */}
        {edges.map((edge, i) => {
          const fromNode = nodeMap[edge.from];
          const toNode = nodeMap[edge.to];
          if (!fromNode || !toNode) return null;

          const edgeDelay =
            enterFrame + nodes.length * staggerFrames + i * staggerFrames;
          const edgeP = spring({
            frame: Math.max(0, frame - edgeDelay),
            fps,
            config: { damping: 22, stiffness: 200, mass: 0.6 },
          });

          const x1 = isH
            ? fromNode.x + NODE_W
            : fromNode.x + NODE_W / 2;
          const y1 = isH
            ? fromNode.y + NODE_H / 2
            : fromNode.y + NODE_H;
          const x2 = isH ? toNode.x : toNode.x + NODE_W / 2;
          const y2 = isH ? toNode.y + NODE_H / 2 : toNode.y;

          const totalLen = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
          const dashLen = totalLen * Math.min(1, edgeP);

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={BRAND.blueL}
              strokeWidth={2.5}
              strokeOpacity={0.85}
              strokeDasharray={totalLen}
              strokeDashoffset={totalLen - dashLen}
              markerEnd={`url(#${arrowMarkerId})`}
              strokeLinecap="round"
            />
          );
        })}

        {/* Nodes */}
        {nodePos.map((node, i) => {
          const nodeDelay = enterFrame + i * staggerFrames;
          const nodeP = spring({
            frame: Math.max(0, frame - nodeDelay),
            fps,
            config: { damping: 14, stiffness: 230, mass: 0.7 },
          });

          const scale = interpolate(
            nodeP,
            [0, 0.4, 0.75, 1],
            [0, 1.22, 0.94, 1],
            { extrapolateRight: "clamp" }
          );
          const opacity = interpolate(nodeP, [0, 0.3], [0, 1], {
            extrapolateRight: "clamp",
          });
          const nodeColor = node.color ?? BRAND.blue;
          const cx = node.x + NODE_W / 2;
          const cy = node.y + NODE_H / 2;

          return (
            <g
              key={node.id}
              transform={`translate(${cx}, ${cy}) scale(${scale})`}
              opacity={opacity}
            >
              {/* Shadow */}
              <rect
                x={-NODE_W / 2 + 2}
                y={-NODE_H / 2 + 4}
                width={NODE_W}
                height={NODE_H}
                rx={14}
                fill="rgba(0,0,0,0.4)"
              />
              {/* Background */}
              <rect
                x={-NODE_W / 2}
                y={-NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                rx={14}
                fill={BRAND.bgF}
                stroke={nodeColor}
                strokeWidth={1.8}
              />
              {/* Color tint */}
              <rect
                x={-NODE_W / 2}
                y={-NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                rx={14}
                fill={`${nodeColor}18`}
              />

              {/* Icon */}
              {node.icon && (
                <text
                  x={-NODE_W / 2 + 22}
                  y={2}
                  fontSize={26}
                  dominantBaseline="middle"
                  textAnchor="middle"
                  filter={`url(#${glowId})`}
                >
                  {node.icon}
                </text>
              )}

              {/* Label */}
              <text
                x={node.icon ? -NODE_W / 2 + 48 : 0}
                y={1}
                textAnchor={node.icon ? "start" : "middle"}
                dominantBaseline="middle"
                fill={BRAND.text}
                fontSize={20}
                fontFamily="'Heebo', sans-serif"
                fontWeight="600"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
