import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { Easing } from "remotion";

type Feel = "snappy" | "smooth" | "bouncy";

interface ZoomTransitionProps {
  /**
   * Frame at which the transition peaks (mid-point).
   * Outgoing zooms/fades OUT during [triggerFrame - halfDur, triggerFrame].
   * Incoming zooms/fades IN  during [triggerFrame, triggerFrame + halfDur].
   */
  triggerFrame: number;
  /** Total transition duration — half before + half after triggerFrame. Default 20 */
  durationFrames?: number;
  /**
   * Starting scale of the INCOMING scene (zooms down to 1.0). Default 1.5
   * Also the ending scale of the OUTGOING scene (zooms up from 1.0).
   */
  scaleAmount?: number;
  feel?: Feel;
  /**
   * The OUTGOING scene (current/previous content).
   * Place it here so ZoomTransition can scale + fade it out.
   */
  outgoing: React.ReactNode;
  /**
   * The INCOMING scene (new content).
   * Gets scaled from scaleAmount → 1 and faded in.
   */
  incoming: React.ReactNode;
  /** Optional flash overlay color at the cut point — null to disable. Default "#ffffff" */
  flashColor?: string | null;
  /** Flash opacity at peak. Default 0.35 */
  flashOpacity?: number;
}

const EASING: Record<Feel, (t: number) => number> = {
  snappy: Easing.bezier(0.22, 1, 0.36, 1),
  smooth: Easing.bezier(0.4, 0, 0.2, 1),
  bouncy: Easing.bezier(0.34, 1.56, 0.64, 1),
};

export const ZoomTransition: React.FC<ZoomTransitionProps> = ({
  triggerFrame,
  durationFrames = 20,
  scaleAmount = 1.5,
  feel = "snappy",
  outgoing,
  incoming,
  flashColor = "#ffffff",
  flashOpacity = 0.35,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const half = durationFrames / 2;
  const ease = EASING[feel];

  // ── Outgoing ─────────────────────────────────────────────────────────────────
  const outStart = triggerFrame - half;
  const outEnd   = triggerFrame;

  const outProgress = interpolate(frame, [outStart, outEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const outScale   = interpolate(outProgress, [0, 1], [1, scaleAmount]);
  const outOpacity = interpolate(outProgress, [0, 0.6, 1], [1, 1, 0]);

  // ── Incoming ─────────────────────────────────────────────────────────────────
  const inStart = triggerFrame;
  const inEnd   = triggerFrame + half;

  const inProgress = interpolate(frame, [inStart, inEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const inScale   = interpolate(inProgress, [0, 1], [scaleAmount, 1]);
  const inOpacity = interpolate(inProgress, [0, 0.4, 1], [0, 1, 1]);

  // ── Flash at cut point ────────────────────────────────────────────────────────
  const flashOp = flashColor
    ? interpolate(
        frame,
        [triggerFrame - 3, triggerFrame, triggerFrame + 3],
        [0, flashOpacity, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  return (
    <AbsoluteFill>
      {/* Outgoing — visible until triggerFrame */}
      {frame < triggerFrame && (
        <AbsoluteFill
          style={{
            transform: `scale(${outScale})`,
            opacity: outOpacity,
            transformOrigin: `${width / 2}px ${height / 2}px`,
          }}
        >
          {outgoing}
        </AbsoluteFill>
      )}

      {/* Incoming — visible from triggerFrame */}
      {frame >= triggerFrame && (
        <AbsoluteFill
          style={{
            transform: `scale(${inScale})`,
            opacity: inOpacity,
            transformOrigin: `${width / 2}px ${height / 2}px`,
          }}
        >
          {incoming}
        </AbsoluteFill>
      )}

      {/* Flash overlay */}
      {flashOp > 0 && flashColor && (
        <AbsoluteFill
          style={{ background: flashColor, opacity: flashOp, pointerEvents: "none" }}
        />
      )}
    </AbsoluteFill>
  );
};
