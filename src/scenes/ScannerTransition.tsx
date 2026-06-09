import React from "react";
import { useCurrentFrame, interpolate, Img, staticFile } from "remotion";
import { PhoneEntrance } from "../components/PhoneEntrance";

const FRAMES_COUNT = 8;
const FRAMES_PER_IMAGE = 6; // each still shown for 6 Remotion frames → 0.2s at 30fps

export const SCANNER_DURATION = 60; // 2 seconds total

export const ScannerTransition: React.FC = () => {
  const frame = useCurrentFrame();

  const enterOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitOpacity = interpolate(
    frame,
    [SCANNER_DURATION - 14, SCANNER_DURATION - 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = enterOpacity * exitOpacity;
  const imageIndex = Math.min(
    Math.floor(frame / FRAMES_PER_IMAGE),
    FRAMES_COUNT - 1
  );

  // Crops the "Clix Automations" nav bar (IPhone14 already hides the status bar via top:-70)
  const NAV_CROP = 100;

  return (
    <div style={{ opacity }}>
      <PhoneEntrance variant="slideUp" delay={0}>
        {/* outer clips anything above the IPhone14 screen area */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* inner shifts content up by NAV_CROP to hide the nav bar */}
          <div style={{ position: "absolute", top: -NAV_CROP, left: 0, right: 0, bottom: 0 }}>
            {Array.from({ length: FRAMES_COUNT }, (_, i) => (
              <Img
                key={i}
                src={staticFile(
                  `scanner-frames/anim-frame-${String(i + 1).padStart(2, "0")}.png`
                )}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: `calc(100% + ${NAV_CROP}px)`,
                  objectFit: "cover",
                  objectPosition: "top center",
                  opacity: i === imageIndex ? 1 : 0,
                }}
              />
            ))}
          </div>
        </div>
      </PhoneEntrance>
    </div>
  );
};
