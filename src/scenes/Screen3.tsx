import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
  Easing,
} from "remotion";
import { PhoneEntrance } from "../components/PhoneEntrance";
import { ScrollGesture } from "../components/ScrollGesture";
import { CircleClick } from "../components/CircleClick";

// Image: 1170×7878 → rendered at 548px wide → height ≈ 3690px
// IPhone14 crops 70px from top (status bar). Visible window: 1220px.
// Max scroll to reach bottom: 3690 - 1220 - 70 = 2400px
const MAX_SCROLL = 2400;
const ENTRANCE_FRAMES = 20;
const SCROLL_FRAMES = 210; // 7 seconds at 30fps
const HOLD_END = 20;
const NOTIF_FRAMES = 10; // dedicated frames for notification + click
const IMAGE_START_OFFSET = 38;
export const SCREEN3_DURATION = ENTRANCE_FRAMES + SCROLL_FRAMES + HOLD_END + NOTIF_FRAMES; // 260

const NOTIF_START = 240; // notification slides in at f=240, click at f=245

// Notification position — IPhone14 children coordinate system:
// visible area starts at y=70, Dynamic Island bottom at y=134 → notification at y=148
const NOTIF_TOP_REST   = 148;
const NOTIF_TOP_HIDDEN = -70;

const CLICKS: Array<{
  imageY: number;
  imageX: number;
  size?: number;
  startAt: number;
  duration: number;
}> = [
  { imageY: 800,  imageX: 493, startAt: 27,  duration: 40 },
  { imageY: 2188, imageX: 493, startAt: 119, duration: 40 },
  { imageY: 3169, imageX: 493, startAt: 169, duration: 40 },
];

interface Screen3Props {
  startAt?: number;
  logicalFrame?: number;
}

export const Screen3: React.FC<Screen3Props> = ({ startAt = 0, logicalFrame }) => {
  const rawFrame = useCurrentFrame();
  const frame = logicalFrame ?? rawFrame;
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - startAt);

  const phoneOpacity = interpolate(f, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scrollY = interpolate(
    f,
    [ENTRANCE_FRAMES, ENTRANCE_FRAMES + SCROLL_FRAMES],
    [-IMAGE_START_OFFSET, -MAX_SCROLL],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.42, 0, 0.58, 1),
    }
  );

  // ── Email notification (last 10 frames) ──────────────────────────────────────
  // Stiff spring so it settles fast within the short window
  const notifSpring = spring({
    frame: f - NOTIF_START,
    fps,
    config: { damping: 24, stiffness: 400, mass: 0.55 },
  });
  const notifTop = interpolate(notifSpring, [0, 1], [NOTIF_TOP_HIDDEN, NOTIF_TOP_REST]);

  // CircleClick center: notification center-y = notifTop + 42, x ≈ 390 (right side)
  const clickY = notifTop + 42 - 30; // top-left of 60px circle
  const clickX = 390 - 30;

  return (
    <div style={{ opacity: phoneOpacity }}>
      <PhoneEntrance variant="slideFromRight" delay={startAt} frame={logicalFrame}>
        {/* ── Scrolling content ── */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              transform: `translateY(${scrollY}px)`,
            }}
          >
            <Img
              src={staticFile("screenshot-2-screen4-mobile.png")}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
            {CLICKS.map((c, i) => (
              <ScrollGesture
                key={i}
                frame={f}
                imageY={c.imageY}
                imageX={c.imageX}
                size={c.size}
                startAt={c.startAt}
                duration={c.duration}
              />
            ))}
            <CircleClick
              frame={f}
              imageY={3558}
              imageX={242}
              startAt={229}
              duration={14}
            />
          </div>
        </div>

        {/* ── Email notification overlay (last 10 frames) ── */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {/* Banner */}
          <div
            style={{
              position: "absolute",
              top: notifTop,
              left: 14,
              right: 14,
              background: "rgba(232, 232, 237, 0.97)",
              borderRadius: 20,
              padding: "14px 16px",
              boxShadow: "0 8px 36px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* Gmail-style icon */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                flexShrink: 0,
                background: "linear-gradient(145deg, #ea4335 0%, #c5221f 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(234,67,53,0.4)",
              }}
            >
              <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
                <rect width="26" height="20" rx="2" fill="white" fillOpacity="0.95" />
                <path
                  d="M1 3L13 12L25 3"
                  stroke="#ea4335"
                  strokeWidth="2.2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Text */}
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 3,
                }}
              >
                <span style={{ color: "#1c1c1e", fontSize: 14, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                  Gmail
                </span>
                <span style={{ color: "rgba(60,60,67,0.55)", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
                  עכשיו
                </span>
              </div>
              <div
                style={{
                  color: "#1c1c1e",
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "Inter, sans-serif",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginBottom: 2,
                }}
              >
                clix-automations
              </div>
              <div
                style={{
                  color: "rgba(60,60,67,0.65)",
                  fontSize: 13,
                  fontWeight: 400,
                  fontFamily: "Heebo, sans-serif",
                  direction: "rtl",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                ניסים, מפת האוטומציות שלך מוכנה
              </div>
            </div>
          </div>

          {/* Click circle on notification */}
          <CircleClick
            frame={f}
            imageY={clickY}
            imageX={clickX}
            size={60}
            startAt={245}
            duration={7}
          />
        </div>
      </PhoneEntrance>
    </div>
  );
};
