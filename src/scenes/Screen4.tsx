import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
  Img,
} from "remotion";
import { IPhone14 } from "../components/IPhone14";
import { BRAND } from "../brand";

export const SCREEN4_DURATION = 90;

interface Screen4Props {
  startAt?: number;
  logicalFrame?: number;
  /** Filename in public/ to show after the notification click. Leave empty for placeholder. */
  screen4Image?: string;
}

export const Screen4: React.FC<Screen4Props> = ({
  startAt = 0,
  logicalFrame,
  screen4Image = "",
}) => {
  const rawFrame = useCurrentFrame();
  const frame = logicalFrame ?? rawFrame;
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - startAt);

  // iOS app-open animation — content scales up from center + fades in
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

  return (
    <IPhone14>
      <div style={{ position: "absolute", inset: 0, background: BRAND.bg }} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${contentScale})`,
          transformOrigin: "center center",
          opacity: contentOpacity,
        }}
      >
        {screen4Image ? (
          <Img
            src={staticFile(screen4Image)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: BRAND.bgE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                color: BRAND.muted,
                fontSize: 24,
                textAlign: "center",
                fontFamily: "Heebo, sans-serif",
                direction: "rtl",
              }}
            >
              צילום מסך ישנה כאן
            </div>
          </div>
        )}
      </div>
    </IPhone14>
  );
};
