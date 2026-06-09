import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { IPhone14 } from "../components/IPhone14";
import { EMAIL_HTML } from "./emailHtml";

export const SCREEN4_DURATION = 20; // 6 seconds to scroll through email

// Scale email (designed at 600px) to fit phone inner width (548px)
const EMAIL_SCALE = 548 / 600;

interface Screen4Props {
  startAt?: number;
  logicalFrame?: number;
}

export const Screen4: React.FC<Screen4Props> = ({
  startAt = 0,
  logicalFrame,
}) => {
  const rawFrame = useCurrentFrame();
  const frame = logicalFrame ?? rawFrame;
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - startAt);

  // iOS app-open animation
  const appOpenSpring = spring({
    frame: f,
    fps,
    config: { damping: 22, stiffness: 200, mass: 0.6 },
  });
  const contentScale = interpolate(appOpenSpring, [0, 1], [0.88, 1]);
  const contentOpacity = interpolate(f, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scrollY = 160;

  return (
    <IPhone14>
      {/* Dark email background */}
      <div style={{ position: "absolute", inset: 0, background: "#080e1c" }} />

      {/* iOS app-open animation wrapper */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          transform: `scale(${contentScale})`,
          transformOrigin: "center center",
          opacity: contentOpacity,
        }}
      >
        {/* Scrolling email content */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: `translateY(${scrollY}px) scale(${EMAIL_SCALE})`,
            transformOrigin: "top left",
            width: "600px",
            fontFamily: "Arial, Helvetica, sans-serif",
            direction: "rtl",
          }}
          dangerouslySetInnerHTML={{ __html: EMAIL_HTML }}
        />
      </div>
    </IPhone14>
  );
};
