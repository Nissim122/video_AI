import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { StripTransition } from "../../components/StripTransition";
import { IrisTransition } from "../../components/IrisTransition";
import { VIDEO_CONFIG, STRIP_TRANSITIONS, IRIS_TRANSITIONS } from "./config";

export const ThirtyPerMonth: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <OffthreadVideo
        src={staticFile(VIDEO_CONFIG.src)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {STRIP_TRANSITIONS.length > 0 && <StripTransition events={STRIP_TRANSITIONS} />}
      {IRIS_TRANSITIONS.length > 0 && <IrisTransition events={IRIS_TRANSITIONS} />}
    </AbsoluteFill>
  );
};
