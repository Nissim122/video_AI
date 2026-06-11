import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from "remotion";
import { VideoBase } from "./VideoBase";

type PipContent =
  | { type: "video"; src: string; startFrom?: number }
  | { type: "image"; src: string };

interface PipPosition {
  x: number;   // px from left
  y: number;   // px from top
  width: number;
  height: number;
  borderRadius?: number;
}

interface PictureInPictureProps {
  content: PipContent;
  position: PipPosition;
  /** frame when PiP slides in */
  enterFrame: number;
  /** frame when PiP slides out (omit = stays visible) */
  exitFrame?: number;
  /** enter direction: "bottom" | "right" | "left" */
  enterFrom?: "bottom" | "right" | "left";
}

export const PictureInPicture: React.FC<PictureInPictureProps> = ({
  content,
  position,
  enterFrame,
  exitFrame,
  enterFrom = "bottom",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterProgress = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 18, stiffness: 140, mass: 0.9 },
  });

  const exitProgress =
    exitFrame != null
      ? spring({
          frame: Math.max(0, frame - exitFrame),
          fps,
          config: { damping: 18, stiffness: 140, mass: 0.9 },
        })
      : 0;

  const slideAmount = enterFrom === "bottom" ? position.height + 40 : position.width + 40;
  const axis = enterFrom === "bottom" ? "Y" : "X";
  const sign = enterFrom === "left" ? -1 : 1;

  const slideIn = interpolate(enterProgress, [0, 1], [sign * slideAmount, 0]);
  const slideOut = interpolate(exitProgress, [0, 1], [0, sign * slideAmount]);
  const translate = slideIn + slideOut;

  const opacity = interpolate(enterProgress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" })
    * interpolate(exitProgress, [0, 0.3], [1, 0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: position.width,
        height: position.height,
        borderRadius: position.borderRadius ?? 20,
        overflow: "hidden",
        transform: `translate${axis}(${translate}px)`,
        opacity,
        boxShadow: "0 8px 40px rgba(0,0,0,0.55)",
        border: "2px solid rgba(255,255,255,0.15)",
      }}
    >
      {content.type === "video" ? (
        <VideoBase src={content.src} startFrom={content.startFrom} />
      ) : (
        <Img
          src={staticFile(content.src)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
    </div>
  );
};
