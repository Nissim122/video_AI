import { ScreenRegion } from "../types";
export type { ScreenRegion };

export const SCREEN_1_PAIN: Record<string, ScreenRegion> = {
  // ── שורה 1 ──
  card_tiaum_pgishut:   { top: "29%", left: "1%",  width: "31.9%", height: "17.1%" },
  card_sherut_lekuchot: { top: "33%", left: "34%", width: "29%", height: "19%" },
  card_nihul_lidim:     { top: "33%", left: "66%", width: "32%", height: "19%" },

  // ── שורה 2 ──
  card_mechirot:        { top: "54%", left: "2%",  width: "29%", height: "19%" },
  card_dochot:          { top: "54%", left: "34%", width: "29%", height: "19%" },
  card_followups:       { top: "54%", left: "66%", width: "32%", height: "19%" },

  // ── שורה 3 ──
  card_shivuk:          { top: "75%", left: "2%",  width: "29%", height: "13%" },
  card_cheshboniot:     { top: "75%", left: "34%", width: "29%", height: "13%" },
  card_nihul_mishimot:  { top: "75%", left: "66%", width: "32%", height: "13%" },

  // ── כותרת ──
  step_indicator:       { top: "8%",  left: "20%", width: "60%", height: "6%"  },
  title:                { top: "17%", left: "5%",  width: "90%", height: "8%"  },

  // ── ניווט תחתון ──
  nav_bar:              { top: "91%", left: "0%",  width: "100%", height: "9%" },
};
