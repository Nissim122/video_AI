import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";

interface VideoBaseProps {
  src: string;
  startFrom?: number;
  endAt?: number;
  playbackRate?: number;
  objectFit?: "cover" | "contain" | "fill";
  brightness?: number; // 0–2, default 1
}

export const VideoBase: React.FC<VideoBaseProps> = ({
  src,
  startFrom = 0,
  endAt,
  playbackRate = 1,
  objectFit = "cover",
  brightness = 1,
}) => {
  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={startFrom}
        endAt={endAt}
        playbackRate={playbackRate}
        style={{
          width: "100%",
          height: "100%",
          objectFit,
          filter: brightness !== 1 ? `brightness(${brightness})` : undefined,
        }}
      />
    </AbsoluteFill>
  );
};
