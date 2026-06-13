// ─────────────────────────────────────────────────────────────────────────────
// Videos registry — רשימת כל הסרטונים במערכת
// להוסיף כאן כל פרויקט חדש; Root.tsx מרנדר מכאן אוטומטית.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import type { ZodTypeAny } from "zod";

import { ChofshiVideo }  from "./chofshi";
import { VideoOverlay }  from "./chofshi/VideoOverlay";
import { MyComposition, CompositionSchema, SPEED_SAVINGS } from "./scanner";
import { T }             from "./scanner/scenes/timeline";
import { ThirtyPerMonth } from "./30bachodesh";

export type VideoStatus = "active" | "draft" | "archived";

export interface VideoEntry {
  id:               string;
  component:        React.ComponentType<any>;
  durationInFrames: number;
  fps?:             number;    // ברירת מחדל: 30
  width?:           number;    // ברירת מחדל: 1080
  height?:          number;    // ברירת מחדל: 1920
  status:           VideoStatus;
  schema?:          ZodTypeAny;
  defaultProps?:    Record<string, unknown>;
}

export const ALL_VIDEOS: VideoEntry[] = [
  // ── פרויקט: chofshi ──────────────────────────────────────────────────────
  {
    id:               "ChofshiVideo",
    component:        ChofshiVideo,
    durationInFrames: 1363,
    status:           "archived",
  },
  {
    id:               "VideoOverlay",
    component:        VideoOverlay,
    durationInFrames: 900,
    status:           "archived",
  },

  // ── פרויקט: scanner ──────────────────────────────────────────────────────
  {
    id:               "MyComp",
    component:        MyComposition,
    durationInFrames: T.total - SPEED_SAVINGS,
    status:           "archived",
    schema:           CompositionSchema,
    defaultProps: {
      hookText:    "בניתי סוכן שמוצא אוטומציות לעסק שלך בפחות מדקה",
      subText:     "לידים, פולואפים, הצעות מחיר, תזכורות...",
      ctaText:     "",
      screenImage: "scanner/screen-1-pain.jpeg",
    },
  },

  // ── פרויקט: 30bachodesh ──────────────────────────────────────────────────
  {
    id:               "ThirtyPerMonth",
    component:        ThirtyPerMonth,
    durationInFrames: 1239,
    fps:              30,
    width:            576,
    height:           1024,
    status:           "active",
  },

  // ── פרויקטים חדשים — מוסיפים כאן ────────────────────────────────────────
];
