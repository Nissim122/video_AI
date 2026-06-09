import React from "react";
import {
  useCurrentFrame,
  interpolate,
  staticFile,
  Img,
} from "remotion";
import { PhoneEntrance } from "../components/PhoneEntrance";
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
  const f = Math.max(0, frame - startAt);

  const phoneOpacity = interpolate(f, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ opacity: phoneOpacity }}>
      <PhoneEntrance variant="slideFromRight" delay={startAt} frame={logicalFrame}>
        <div style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", inset: 0, background: BRAND.bg }} />

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
      </PhoneEntrance>
    </div>
  );
};
