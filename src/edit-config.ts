// ─────────────────────────────────────────────────────────────────────────────
// Edit Config — כל הגדרות העריכה במקום אחד
// ─────────────────────────────────────────────────────────────────────────────

export const VIDEO_CONFIG = {
  src: "test-video.mp4",    // שם הקובץ ב-public/
  fps: 30,
  durationInFrames: 900,    // עדכן לאורך האמיתי של הסרטון × fps
  width: 1080,
  height: 1920,
};

// ── Zoom moments ──────────────────────────────────────────────────────────────
export const ZOOMS = [
  // { startFrame: 60, scale: 1.2, holdFrames: 90 },
];

// ── Picture-in-Picture ────────────────────────────────────────────────────────
export const PIPS = [
  // {
  //   content: { type: "image" as const, src: "screen-demo.jpeg" },
  //   position: { x: 60, y: 1400, width: 960, height: 440, borderRadius: 24 },
  //   enterFrame: 90,
  //   exitFrame: 210,
  //   enterFrom: "bottom" as const,
  // },
];

// ── Chapter markers ───────────────────────────────────────────────────────────
export const CHAPTERS = [
  // { frame: 0,   label: "הקדמה" },
  // { frame: 150, label: "הבעיה" },
  // { frame: 300, label: "הפתרון" },
];

// ── Logo ──────────────────────────────────────────────────────────────────────
export const LOGO = {
  show: true,
  corner: "top-right" as const,
  fadeInFrame: 15,
};

// ── Lower thirds ──────────────────────────────────────────────────────────────
export const LOWER_THIRDS = [
  // { name: "ניסים בנגייב", title: "מייסד Clix Automations", enterFrame: 30, holdFrames: 90 },
];

// ── Text pops ─────────────────────────────────────────────────────────────────
export const TEXT_POPS = [
  // { text: "חוסך 10 שעות בשבוע", enterFrame: 120, holdFrames: 50, style: "pink" as const },
  // { text: "100% אוטומטי", enterFrame: 240, holdFrames: 50, style: "blue" as const },
];

// ── Callouts ──────────────────────────────────────────────────────────────────
export const CALLOUTS = [
  // { text: "כאן קורה הקסם", arrowX: 540, arrowY: 900, side: "right" as const, enterFrame: 180, holdFrames: 60 },
];

// ── Outro ─────────────────────────────────────────────────────────────────────
export const OUTRO = {
  show: false,
  enterFrame: 820,
  ctaText: "רוצה אוטומציה לעסק שלך?",
  subText: "השאר פרטים ואחזור אליך תוך 24 שעות",
  linkText: "clixautomations.com",
};

// ── Vignette & color grade ────────────────────────────────────────────────────
export const GRADE = {
  show: true,
  vignetteStrength: 0.55,
  tone: "cinematic" as const,
  brightness: 1,
  contrast: 1.05,
};

// ── Fade transitions ──────────────────────────────────────────────────────────
export const FADES = [
  // { fadeOutFrame: 0, fadeInFrame: 18 },           // פתיחה מחשיכה
  // { fadeOutFrame: 870, durationFrames: 20 },       // סיום
];

// ── Bullet lists ──────────────────────────────────────────────────────────────
export const BULLET_LISTS = [
  // {
  //   positionY: 1000,
  //   items: [
  //     { text: "חוסך 10 שעות בשבוע",  frame: 90,  icon: "⏱" },
  //     { text: "ללא קוד, ללא תכנות",  frame: 120, icon: "✓" },
  //     { text: "מוכן תוך 48 שעות",    frame: 150, icon: "🚀" },
  //   ],
  // },
];

// ── Stat cards ────────────────────────────────────────────────────────────────
export const STAT_CARDS = [
  // { value: 10000, suffix: "+", label: "שעות עבודה נחסכו", enterFrame: 180 },
  // { value: 98, suffix: "%", label: "שביעות רצון לקוחות", enterFrame: 240, accentColor: "#28c76f" },
];

// ── Highlight boxes ───────────────────────────────────────────────────────────
export const HIGHLIGHTS = [
  // { x: 200, y: 800, width: 680, height: 120, enterFrame: 150, holdFrames: 60, style: "box" as const, label: "שים לב לזה" },
];

// ── CTA buttons ───────────────────────────────────────────────────────────────
export const CTA_BUTTONS = [
  // { text: "לפרטים נוספים", enterFrame: 600, holdFrames: 180 },
];

// ── Social handles ────────────────────────────────────────────────────────────
export const SOCIAL_HANDLES = [
  // { handle: "@clixautomations", platform: "instagram" as const, enterFrame: 30, corner: "bottom-left" as const },
];

// ── Kinetic text ─────────────────────────────────────────────────────────────
// מילים נפרדות שמתזמנות מול הדיבור
// style: "pop" | "highlight" | "clean"
// positionY: 0 (top) → 1 (bottom), accentColor לצביעת מילים עם accent: true
export const KINETIC_TEXTS = [
  // {
  //   style: "pop" as const,
  //   positionY: 0.5,
  //   words: [
  //     { text: "חוסך",   frame: 30 },
  //     { text: "10",     frame: 38, accent: true },
  //     { text: "שעות",   frame: 46 },
  //     { text: "בשבוע!", frame: 54, accent: true },
  //   ],
  // },
];

// ── B-Roll overlays ───────────────────────────────────────────────────────────
// מחליף את הסרטון הראשי בתמונה/וידאו לזמן מוגדר
// transition: "fade" | "slide-up" | "slide-down" | "zoom"
// splitY: גובה בפיקסלים לפיצול מסך (ללא = השתלטות מלאה)
export const BROLLS = [
  // {
  //   content: { type: "image" as const, src: "screen-demo.jpeg" },
  //   enterFrame: 120,
  //   exitFrame: 240,
  //   transition: "fade" as const,
  //   label: "כך זה נראה בפועל",
  // },
  // {
  //   content: { type: "video" as const, src: "demo-clip.mp4" },
  //   enterFrame: 360,
  //   exitFrame: 540,
  //   transition: "zoom" as const,
  // },
];

// ── Reaction bubbles ──────────────────────────────────────────────────────────
// בועות תגובה שנכנסות מהצד — בסגנון סושיאל
// side: "left" | "right" | (ברירת מחדל מתחלף אוטומטית)
// holdFrames: כמה פריימים נשארת (ברירת מחדל 80)
export const REACTIONS = [
  // { text: "אחי זה שינה לי את החיים 🙌", frame: 90,  side: "right" as const },
  // { text: "איך זה בחינם??",              frame: 150, side: "left"  as const },
  // { text: "🔥🔥🔥",                      frame: 210, side: "right" as const, holdFrames: 50 },
];

// ── Punch transitions ─────────────────────────────────────────────────────────
// אפקטים ויזואליים בין חתכים
// type: "zoom-punch" | "flash" | "glitch" | "swipe-right" | "swipe-left"
// duration: אורך האפקט בפריימים (אופציונלי — יש ברירות מחדל לכל סוג)
export const PUNCHES = [
  // { frame: 90,  type: "flash"       as const },
  // { frame: 210, type: "zoom-punch"  as const },
  // { frame: 360, type: "glitch"      as const },
  // { frame: 510, type: "swipe-right" as const },
];

// ── Behind Reveal ─────────────────────────────────────────────────────────────
// עוטף כל קומפוננטה ומאניים אותה מחוץ לפריים פנימה (ויוצאת חזרה)
//
// enterFrom / exitTo : "left" | "right" | "bottom" | "top" | "none"
// animation          : "slide" | "scale" | "rotate" | "slide-rotate" | "slide-fade"
// feel               : "snappy" | "smooth" | "bouncy"
//
// ── דוגמאות ──────────────────────────────────────────────────────────────────
//
// נכנס משמאל, יוצא ימינה — slide
// <BehindReveal enterFrame={60} exitFrame={180} enterFrom="left" exitTo="right" animation="slide" feel="snappy">
//   <LowerThird name="ניסים בנגייב" title="מייסד Clix" enterFrame={0} />
// </BehindReveal>
//
// נכנס מלמטה, יוצא לאותו כיוון — bouncy
// <BehindReveal enterFrame={90} exitFrame={240} enterFrom="bottom" animation="slide-rotate" feel="bouncy">
//   <StatCard value={10000} suffix="+" label="שעות נחסכו" enterFrame={0} />
// </BehindReveal>
//
// זום פנימה ממרכז, נעלם בזום
// <BehindReveal enterFrame={120} exitFrame={210} enterFrom="none" animation="scale" feel="smooth">
//   <TextPop text="100% אוטומטי" enterFrame={0} />
// </BehindReveal>
//
// נכנס מימין עם סיבוב, יוצא למעלה
// <BehindReveal enterFrame={150} exitFrame={270} enterFrom="right" exitTo="top" animation="slide-rotate" feel="snappy">
//   <CTAButton text="לפרטים" enterFrame={0} />
// </BehindReveal>
//
// fade + slide מהשמאל, יוצא עם fade לימין
// <BehindReveal enterFrame={30} exitFrame={300} enterFrom="left" exitTo="right" animation="slide-fade" feel="smooth">
//   <SocialHandle handle="@clixautomations" platform="instagram" enterFrame={0} corner="bottom-left" />
// </BehindReveal>
