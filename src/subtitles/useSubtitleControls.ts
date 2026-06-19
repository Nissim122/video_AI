// ─────────────────────────────────────────────────────────────────────────────
// useSubtitleControls — Leva controls hook for SubtitleStyle
// מחזיר SubtitleStyle חי שמשתנה עם כל slider/color picker ב-Studio
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { useControls, folder } from "leva";
import {
  SUBTITLE_PRESETS,
  DEFAULT_SUBTITLE_STYLE,
  type SubtitleStyle,
  type SubtitleAnimationType,
  type SubtitleHighlightStyle,
} from "./subtitle-config";

type PresetName = keyof typeof SUBTITLE_PRESETS;

// Maps SubtitleStyle → flat object matching leva control keys
function styleToControls(s: SubtitleStyle) {
  return {
    fontSize:          s.fontSize,
    fontWeight:        s.fontWeight,
    letterSpacing:     s.letterSpacing,
    lineHeight:        s.lineHeight,
    textColor:         s.textColor,
    strokeEnabled:     s.stroke,
    strokeColor:       s.strokeColor,
    strokeWidth:       s.strokeWidth,
    shadowEnabled:     s.shadow,
    shadowBlur:        s.shadowBlur,
    shadowY:           s.shadowY,
    bgEnabled:         s.textBg,
    bgRadius:          s.textBgRadius,
    bgPaddingX:        s.textBgPaddingX,
    bgPaddingY:        s.textBgPaddingY,
    highlightMode:     s.highlightStyle,
    highlightColor:    s.activeColor,
    activeBgColor:     s.activeBgColor,
    activeBgRadius:    s.activeBgRadius,
    positionY:         s.positionY,
    entranceAnimation: s.enterAnimation,
    enterBounce:       s.enterBounce,
  };
}

const D = styleToControls(DEFAULT_SUBTITLE_STYLE);

export function useSubtitleControls(): SubtitleStyle {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const returned = useControls("Subtitle Editor", () => ({
    preset: {
      value: "hebrew_bold",
      options: Object.keys(SUBTITLE_PRESETS) as PresetName[],
    },

    Typography: folder({
      fontSize:      { value: D.fontSize,      min: 30,    max: 150,  step: 1 },
      fontWeight:    { value: D.fontWeight,    min: 300,   max: 900,  step: 100 },
      letterSpacing: { value: D.letterSpacing, min: -0.1,  max: 0.15, step: 0.005 },
      lineHeight:    { value: D.lineHeight,    min: 0.8,   max: 2.2,  step: 0.05 },
    }, { collapsed: true }),

    "Color & Stroke": folder({
      textColor:     D.textColor,
      strokeEnabled: { value: D.strokeEnabled },
      strokeColor:   D.strokeColor,
      strokeWidth:   { value: D.strokeWidth, min: 0, max: 14, step: 0.5 },
      shadowEnabled: { value: D.shadowEnabled },
      shadowBlur:    { value: D.shadowBlur, min: 0, max: 60, step: 1 },
      shadowY:       { value: D.shadowY, min: -20, max: 20, step: 1 },
    }, { collapsed: true }),

    "Background Box": folder({
      bgEnabled:  { value: D.bgEnabled },
      bgRadius:   { value: D.bgRadius,   min: 0, max: 40, step: 1 },
      bgPaddingX: { value: D.bgPaddingX, min: 0, max: 60, step: 2 },
      bgPaddingY: { value: D.bgPaddingY, min: 0, max: 40, step: 2 },
    }, { collapsed: true }),

    "Word Highlight": folder({
      highlightMode: {
        value:   D.highlightMode,
        options: ["color", "background", "underline", "glow", "none"],
      },
      highlightColor: D.highlightColor,
      activeBgColor:  D.activeBgColor,
      activeBgRadius: { value: D.activeBgRadius, min: 0, max: 40, step: 1 },
    }, { collapsed: true }),

    "Position & Motion": folder({
      positionY:         { value: D.positionY, min: 0.05, max: 0.97, step: 0.01 },
      entranceAnimation: {
        value:   D.entranceAnimation,
        options: ["fade", "slide-up", "pop", "none"],
      },
      enterBounce: { value: D.enterBounce, min: 0, max: 2.5, step: 0.1 },
    }),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  })) as any;
  const values: typeof D & { preset: string } = returned[0] ?? returned;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const set: (v: Partial<typeof D>) => void = returned[1] ?? (() => {});

  // When preset changes → sync all sliders to that preset's values
  useEffect(() => {
    const key = values.preset as PresetName;
    const preset = SUBTITLE_PRESETS[key];
    if (!preset) return;
    set(styleToControls(preset as SubtitleStyle));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.preset]);

  return {
    ...DEFAULT_SUBTITLE_STYLE,
    fontSize:       values.fontSize,
    fontWeight:     values.fontWeight,
    letterSpacing:  values.letterSpacing,
    lineHeight:     values.lineHeight,
    textColor:      values.textColor,
    stroke:         values.strokeEnabled,
    strokeColor:    values.strokeColor,
    strokeWidth:    values.strokeWidth,
    shadow:         values.shadowEnabled,
    shadowBlur:     values.shadowBlur,
    shadowY:        values.shadowY,
    textBg:         values.bgEnabled,
    textBgRadius:   values.bgRadius,
    textBgPaddingX: values.bgPaddingX,
    textBgPaddingY: values.bgPaddingY,
    highlightStyle: values.highlightMode as SubtitleHighlightStyle,
    activeColor:    values.highlightColor,
    activeBgColor:  values.activeBgColor,
    activeBgRadius: values.activeBgRadius,
    positionY:      values.positionY,
    enterAnimation: values.entranceAnimation as SubtitleAnimationType,
    enterBounce:    values.enterBounce,
  };
}
