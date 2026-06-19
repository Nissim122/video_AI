import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import type { TikTokPage } from "@remotion/captions";
import type { SubtitleStyle } from "./subtitle-config";

type Props = {
  page: TikTokPage;
  style: SubtitleStyle;
  totalFrames: number;
};

export const CaptionPage: React.FC<Props> = ({ page, style, totalFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Absolute time for word-sync ────────────────────────────────────────────
  const currentMs = (frame / fps) * 1000;
  const absoluteMs = page.startMs + currentMs;

  // ── Entrance animation ─────────────────────────────────────────────────────
  const springConfig = {
    damping: style.enterBounce <= 0 ? 1000 : style.enterBounce <= 1 ? 200 : style.enterBounce <= 1.5 ? 120 : 80,
    mass: 1,
    stiffness: 100,
  };

  const enterProgress = spring({
    fps,
    frame,
    config: springConfig,
    durationInFrames: style.enterDuration,
  });

  // ── Exit animation ─────────────────────────────────────────────────────────
  const exitStart = Math.max(0, totalFrames - style.exitDuration);
  const exitOpacity =
    style.exitAnimation === "fade" && frame > exitStart
      ? interpolate(frame, [exitStart, totalFrames], [1, 0], { extrapolateRight: "clamp" })
      : 1;

  // ── Compute wrapper transform per animation type ───────────────────────────
  let opacity = exitOpacity;
  let translateY = 0;
  let scale = 1;

  if (style.enterAnimation === "fade") {
    opacity = enterProgress * exitOpacity;
  } else if (style.enterAnimation === "slide-up") {
    opacity = enterProgress * exitOpacity;
    translateY = interpolate(enterProgress, [0, 1], [40, 0]);
  } else if (style.enterAnimation === "pop") {
    opacity = Math.min(1, enterProgress * 3) * exitOpacity;
    scale = interpolate(enterProgress, [0, 1], [0.82, 1]);
  }
  // "none" → keep defaults (opacity=exitOpacity, translateY=0, scale=1)

  // ── Text shadow: combines stroke + drop shadow ─────────────────────────────
  const strokeShadows = style.stroke
    ? [
        `-${style.strokeWidth}px -${style.strokeWidth}px 0 ${style.strokeColor}`,
        ` ${style.strokeWidth}px -${style.strokeWidth}px 0 ${style.strokeColor}`,
        `-${style.strokeWidth}px  ${style.strokeWidth}px 0 ${style.strokeColor}`,
        ` ${style.strokeWidth}px  ${style.strokeWidth}px 0 ${style.strokeColor}`,
        ` 0px              -${style.strokeWidth}px 0 ${style.strokeColor}`,
        ` 0px               ${style.strokeWidth}px 0 ${style.strokeColor}`,
        `-${style.strokeWidth}px  0px             0 ${style.strokeColor}`,
        ` ${style.strokeWidth}px  0px             0 ${style.strokeColor}`,
      ]
    : [];

  const dropShadow = style.shadow
    ? `${style.shadowX}px ${style.shadowY}px ${style.shadowBlur}px ${style.shadowColor}`
    : null;

  const textShadow = [...strokeShadows, ...(dropShadow ? [dropShadow] : [])].join(", ") || undefined;

  // ── Vertical position ──────────────────────────────────────────────────────
  const topPx = style.positionY * 1920;

  return (
    <div
      style={{
        position: "absolute",
        top: topPx,
        left: style.paddingX,
        right: style.paddingX,
        display: "flex",
        justifyContent:
          style.textAlign === "center"
            ? "center"
            : style.textAlign === "right"
            ? "flex-end"
            : "flex-start",
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        direction: style.direction,
      }}
    >
      <div
        style={{
          maxWidth: style.maxWidth,
          width: "100%",
          textAlign: style.textAlign,
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight,
          letterSpacing: `${style.letterSpacing}em`,
          color: style.textColor,
          textShadow,
          whiteSpace: "pre-wrap",
          wordBreak: "keep-all",
          // Fix 1: מונע קפיצות של פיסוק ומספרים בתוך עברית (bidi algorithm)
          unicodeBidi: "isolate",
          ...(style.textBg
            ? {
                backgroundColor: style.textBgColor,
                borderRadius: style.textBgRadius,
                padding: `${style.textBgPaddingY}px ${style.textBgPaddingX}px`,
              }
            : {}),
        }}
      >
        {page.tokens.map((token, i) => {
          const isActive =
            absoluteMs >= token.fromMs && absoluteMs < token.toMs;

          return (
            <Token
              key={`${token.fromMs}-${i}`}
              text={token.text}
              isActive={isActive}
              style={style}
            />
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Token — renders one word/token with its active highlight state
// ─────────────────────────────────────────────────────────────────────────────

const Token: React.FC<{
  text: string;
  isActive: boolean;
  style: SubtitleStyle;
}> = ({ text, isActive, style }) => {
  const { highlightStyle } = style;

  if (!isActive || highlightStyle === "none") {
    return <span>{text}</span>;
  }

  if (highlightStyle === "color") {
    return <span style={{ color: style.activeColor }}>{text}</span>;
  }

  if (highlightStyle === "underline") {
    return (
      <span
        style={{
          textDecoration: `underline 3px ${style.activeColor}`,
          textUnderlineOffset: "4px",
        }}
      >
        {text}
      </span>
    );
  }

  if (highlightStyle === "glow") {
    return (
      <span
        style={{
          color: style.activeColor,
          filter: `drop-shadow(0 0 10px ${style.activeColor}) drop-shadow(0 0 20px ${style.activeColor})`,
        }}
      >
        {text}
      </span>
    );
  }

  // "background" — highlight box behind the active word
  if (highlightStyle === "background") {
    return (
      <span
        style={{
          position: "relative",
          display: "inline-block",
          // Fix 3: inline-block חייב להיצמד ל-baseline כדי שלא יזיז שורות
          verticalAlign: "baseline",
          unicodeBidi: "isolate",
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: `-${style.activeBgPaddingY}px -${style.activeBgPaddingX}px`,
            backgroundColor: style.activeBgColor,
            borderRadius: style.activeBgRadius,
            zIndex: 0,
          }}
        />
        <span style={{ position: "relative", zIndex: 1, color: style.activeColor }}>
          {text}
        </span>
      </span>
    );
  }

  return <span>{text}</span>;
};
