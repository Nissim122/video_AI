import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PhoneEntrance } from "../components/PhoneEntrance";
import { ScrollingPhoneScreen, STRIP_PAGE_H } from "../components/ScrollingPhoneScreen";
import { GlowHighlight } from "../components/GlowHighlight";
import { SCREEN_2_FORM } from "../screens/screen-2-form.coords";

// ── Timing (frames relative to scene start) ────────────────────────────────
// phone settled=28 | scroll1=76 | scroll2=130 | scroll3=180
const PAUSE_1_END  = 58;   // p1 highlights: +32, +40, +48 from scene start
const PAUSE_2_END  = 112;  // p2 highlights: +80, +88, +96
const PAUSE_3_END  = 162;  // p3 highlights: +134, +142, +150
const SCROLL_3_END = 180;
const GLOW_4_START = 188;
export const SCREEN2_DURATION = 235;

// iOS-like spring: slight overshoot then settle
const SCROLL_SPRING = { damping: 14, stiffness: 200, mass: 0.85 };

interface Screen2Props {
  /** Global frame at which this scene starts (T.screen2.start) */
  startAt: number;
  /** Filenames in public/ — 4 sequential screenshots */
  images: [string, string, string, string];
}

export const Screen2: React.FC<Screen2Props> = ({ startAt, images }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - startAt);

  // ── Fade in wrapper ────────────────────────────────────────────────────────
  const phoneOpacity = interpolate(f, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Scroll: 3 independent springs summed → natural iOS overshoot ──────────
  // Each spring activates when its PAUSE_*_END frame is reached.
  // They're additive: s1 takes page 1→2, s2 takes 2→3, s3 takes 3→4.
  const s1 = spring({ frame: f - PAUSE_1_END, fps, config: SCROLL_SPRING });
  const s2 = spring({ frame: f - PAUSE_2_END, fps, config: SCROLL_SPRING });
  const s3 = spring({ frame: f - PAUSE_3_END, fps, config: SCROLL_SPRING });
  const scrollY = -(s1 + s2 + s3) * STRIP_PAGE_H;

  const onPage4 = f >= SCROLL_3_END;

  return (
    <div style={{ opacity: phoneOpacity }}>
      <PhoneEntrance variant="slideUp" delay={startAt}>
        <ScrollingPhoneScreen images={images} scrollY={scrollY}>

          {/* ━━ PAGE 1 — staggered highlights (fade out before scroll at +58) ━ */}
          <GlowHighlight pos={SCREEN_2_FORM.item_a_p1} startAt={startAt + 32} shape="circle" duration={24} />
          <GlowHighlight pos={SCREEN_2_FORM.item_b_p1} startAt={startAt + 40} shape="circle" duration={24} />
          <GlowHighlight pos={SCREEN_2_FORM.item_c_p1} startAt={startAt + 48} shape="circle" duration={24} />

          {/* ━━ PAGE 2 — staggered highlights (fade out before scroll at +112) */}
          <GlowHighlight pos={SCREEN_2_FORM.item_a_p2} startAt={startAt + 80}  shape="circle" duration={24} />
          <GlowHighlight pos={SCREEN_2_FORM.item_b_p2} startAt={startAt + 88}  shape="circle" duration={24} />
          <GlowHighlight pos={SCREEN_2_FORM.item_c_p2} startAt={startAt + 96}  shape="circle" duration={24} />

          {/* ━━ PAGE 3 — staggered highlights (fade out before scroll at +162) */}
          <GlowHighlight pos={SCREEN_2_FORM.item_a_p3} startAt={startAt + 134} shape="circle" duration={24} />
          <GlowHighlight pos={SCREEN_2_FORM.item_b_p3} startAt={startAt + 142} shape="circle" duration={24} />
          <GlowHighlight pos={SCREEN_2_FORM.item_c_p3} startAt={startAt + 150} shape="circle" duration={24} />

          {/* ━━ PAGE 4 — continue button glow ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {onPage4 && (
            <GlowHighlight
              pos={SCREEN_2_FORM.continue_btn}
              startAt={startAt + GLOW_4_START}
              shape="rect"
              color="#e0176b"
              badge={false}
            />
          )}
        </ScrollingPhoneScreen>
      </PhoneEntrance>
    </div>
  );
};
