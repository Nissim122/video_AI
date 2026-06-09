import { ScreenRegion } from "../types";
export type { ScreenRegion };

// ── מסך 2 — בחירת כלים ──────────────────────────────────────────────────────
// Children wrapper = 548×1290 (IPhone14 adds top:-70 offset).
// Formula: top% = (img_y × 0.782) / 1290 × 100
//          left% = (img_x × 0.782 − 7.5) / 548 × 100
// Circle size in image ≈ 100px → rendered ≈ 78px.
//   width% = 78/548 = 14.2%, height% = 78/1290 = 6.0%

export const SCREEN_2_FORM: Record<string, ScreenRegion> = {

  // ── עמוד 1 — Monday (CRM), Pipedrive (CRM), ריווחית (Finance) ─────────────
  item_a_p1: { top: "30%", left: "7%",  width: "14%", height: "6%" }, // Monday
  item_b_p1: { top: "30%", left: "55%", width: "14%", height: "6%" }, // Pipedrive
  item_c_p1: { top: "65%", left: "55%", width: "14%", height: "6%" }, // ריווחית

  // ── עמוד 2 — Slack (Chat), Calendly (Scheduling), Notion (Projects) ───────
  item_a_p2: { top: "15%", left: "7%",  width: "14%", height: "6%" }, // Slack
  item_b_p2: { top: "48%", left: "79%", width: "14%", height: "6%" }, // Calendly
  item_c_p2: { top: "64%", left: "55%", width: "14%", height: "6%" }, // Notion

  // ── עמוד 3 — Mailchimp (Marketing), Instagram (Social), Make (Infra) ──────
  item_a_p3: { top: "16%", left: "79%", width: "14%", height: "6%" }, // Mailchimp
  item_b_p3: { top: "47%", left: "79%", width: "14%", height: "6%" }, // Instagram
  item_c_p3: { top: "66%", left: "31%", width: "14%", height: "6%" }, // Make

  // ── עמוד 4 — כפתור המשך ──────────────────────────────────────────────────
  continue_btn: { top: "73%", left: "19%", width: "51%", height: "5%" },
};
