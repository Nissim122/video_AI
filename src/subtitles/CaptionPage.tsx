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
    damping:
      style.enterBounce <= 0
        ? 1000
        : style.enterBounce <= 1
        ? 200
        : style.enterBounce <= 1.5
        ? 120
        : 80,
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
      ? interpolate(frame, [exitStart, totalFrames], [1, 0], {
          extrapolateRight: "clamp",
        })
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

  const textShadow =
    [...strokeShadows, ...(dropShadow ? [dropShadow] : [])].join(", ") ||
    undefined;

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
              fromMs={token.fromMs}
              pageStartMs={page.startMs}
              style={style}
            />
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Token — renders one word with per-word activation spring
// ─────────────────────────────────────────────────────────────────────────────

const Token: React.FC<{
  text: string;
  isActive: boolean;
  fromMs: number;
  pageStartMs: number;
  style: SubtitleStyle;
}> = ({ text, isActive, fromMs, pageStartMs, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { highlightStyle } = style;

  // How many frames since this word became active within the page?
  const wordActivationFrame = Math.round(((fromMs - pageStartMs) / 1000) * fps);
  const framesActive = frame - wordActivationFrame;

  // Spring that fires the moment this word becomes active
  const activationSpring = spring({
    fps,
    frame: Math.max(0, framesActive),
    config: { damping: 80, mass: 0.8, stiffness: 220 },
    durationInFrames: 10,
  });

  // Scale: inactive words rest at 1. Active word springs to 1.06 → settles at 1.02
  const wordScale = isActive
    ? interpolate(activationSpring, [0, 1], [0.88, 1.06], {
        extrapolateRight: "clamp",
      })
    : 1;

  if (!isActive || highlightStyle === "none") {
    return (
      <span
        style={{
          display: "inline-block",
          transform: `scale(${wordScale})`,
          transformOrigin: "center bottom",
          verticalAlign: "baseline",
        }}
      >
        {text}
      </span>
    );
  }

  if (highlightStyle === "color") {
    return (
      <span
        style={{
          display: "inline-block",
          color: style.activeColor,
          transform: `scale(${wordScale})`,
          transformOrigin: "center bottom",
          verticalAlign: "baseline",
        }}
      >
        {text}
      </span>
    );
  }

  if (highlightStyle === "underline") {
    return (
      <span
        style={{
          display: "inline-block",
          textDecoration: `underline 3px ${style.activeColor}`,
          textUnderlineOffset: "4px",
          transform: `scale(${wordScale})`,
          transformOrigin: "center bottom",
          verticalAlign: "baseline",
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
          display: "inline-block",
          color: style.activeColor,
          filter: `drop-shadow(0 0 10px ${style.activeColor}) drop-shadow(0 0 20px ${style.activeColor})`,
          transform: `scale(${wordScale})`,
          transformOrigin: "center bottom",
          verticalAlign: "baseline",
        }}
      >
        {text}
      </span>
    );
  }

  // "background" — pill springs in with the word
  if (highlightStyle === "background") {
    const pillScale = interpolate(activationSpring, [0, 1], [0.6, 1], {
      extrapolateRight: "clamp",
    });
    const pillOpacity = interpolate(activationSpring, [0, 0.3], [0, 1], {
      extrapolateRight: "clamp",
    });

    return (
      <span
        style={{
          position: "relative",
          display: "inline-block",
          verticalAlign: "baseline",
          unicodeBidi: "isolate",
          transform: `scale(${wordScale})`,
          transformOrigin: "center bottom",
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: `-${style.activeBgPaddingY}px -${style.activeBgPaddingX}px`,
            backgroundColor: style.activeBgColor,
            borderRadius: style.activeBgRadius,
            zIndex: 0,
            transform: `scale(${pillScale})`,
            opacity: pillOpacity,
            transformOrigin: "center center",
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
