import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

interface Chapter {
  frame: number;
  label: string;
}

interface ChapterMarkerProps {
  /** total duration of the video in frames */
  totalFrames: number;
  chapters?: Chapter[];
  /** show a thin progress bar at the bottom */
  showProgressBar?: boolean;
}

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 6,
      background: "rgba(255,255,255,0.12)",
    }}
  >
    <div
      style={{
        height: "100%",
        width: `${progress * 100}%`,
        background: `linear-gradient(90deg, ${BRAND.blue}, ${BRAND.blueL})`,
        borderRadius: "0 3px 3px 0",
        boxShadow: `0 0 12px ${BRAND.blueL}88`,
        transition: "width 0.05s linear",
      }}
    />
  </div>
);

const ChapterLabel: React.FC<{ label: string; startFrame: number }> = ({
  label,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const HOLD = fps * 2; // show for 2s

  const enter = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 18, stiffness: 160, mass: 0.8 },
  });

  const exit = spring({
    frame: Math.max(0, frame - (startFrame + HOLD)),
    fps,
    config: { damping: 18, stiffness: 160, mass: 0.8 },
  });

  const translateX = interpolate(enter, [0, 1], [-320, 0]) + interpolate(exit, [0, 1], [0, -320]);
  const opacity = Math.max(0, enter - exit);

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        left: 60,
        display: "flex",
        alignItems: "center",
        gap: 16,
        transform: `translateX(${translateX}px)`,
        opacity,
      }}
    >
      <div
        style={{
          width: 6,
          height: 46,
          borderRadius: 3,
          background: `linear-gradient(180deg, ${BRAND.blue}, ${BRAND.pink})`,
          boxShadow: `0 0 14px ${BRAND.blue}88`,
        }}
      />
      <span
        style={{
          fontFamily: "'Heebo', sans-serif",
          fontSize: 40,
          fontWeight: 700,
          color: BRAND.text,
          textShadow: "0 2px 20px rgba(0,0,0,0.6)",
          direction: "rtl",
        }}
      >
        {label}
      </span>
    </div>
  );
};

export const ChapterMarker: React.FC<ChapterMarkerProps> = ({
  totalFrames,
  chapters = [],
  showProgressBar = true,
}) => {
  const frame = useCurrentFrame();

  const progress = Math.min(frame / totalFrames, 1);

  const activeChapters = chapters.filter((c) => frame >= c.frame);
  const current = activeChapters[activeChapters.length - 1];

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {current && <ChapterLabel key={current.frame} label={current.label} startFrame={current.frame} />}
      {showProgressBar && <ProgressBar progress={progress} />}
    </AbsoluteFill>
  );
};
