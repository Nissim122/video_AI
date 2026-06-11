# /beat-sync — סנכרון beat מוזיקה לאנימציה ב-Remotion

קבל רשימת beat frames ועדכן את `edit-config.ts` כך שאנימציות יתחילו בדיוק על ה-beats.

## מה לעשות

1. **קבל מהמשתמש** רשימת beat frames (מ-`/audio-beats`) + סוג האנימציה לסנכרון

2. **שאל** אילו רכיבים לסנכרן:
   - TextPop — כל ביט = טקסט חדש
   - KineticText — מילים על ביטים
   - ZoomClip — pulse על כל ביט
   - VignetteGrade — בהירות על ביט

3. **בחר pattern** לפי מספר ה-beats וסוג הרכיב:

### Pattern A — TextPop לכל ביט
```ts
// edit-config.ts
export const TEXT_POPS = BEAT_FRAMES.slice(0, TEXTS.length).map((frame, i) => ({
  text: TEXTS[i],
  enterFrame: frame,
  holdFrames: BEAT_INTERVAL - 4,
  style: i % 2 === 0 ? "blue" as const : "pink" as const,
}));

const TEXTS = ["מהיר", "חכם", "אוטומטי"];
const BEAT_FRAMES = [14, 28, 42]; // מ-/audio-beats
const BEAT_INTERVAL = 14;
```

### Pattern B — KineticText מסונכרן
```ts
export const KINETIC_TEXTS = [{
  style: "pop" as const,
  positionY: 0.5,
  fontSize: 72,
  words: BEAT_FRAMES.slice(0, WORDS.length).map((frame, i) => ({
    text: WORDS[i],
    frame,
    accent: i % 3 === 0,
  })),
}];
const WORDS = ["חוסך", "10", "שעות", "בלי", "מאמץ"];
```

### Pattern C — Zoom pulse על ביט
```tsx
// ב-Composition.tsx
const beatScale = useCallback((f: number) => {
  const nearBeat = BEAT_FRAMES.find(b => Math.abs(b - f) < 3);
  if (!nearBeat) return 1;
  return interpolate(Math.abs(f - nearBeat), [0, 3], [1.04, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}, [frame]);
```

4. **עדכן את edit-config.ts** בהתאם ל-pattern שנבחר

5. **הצג סיכום:**
```
✅ Beat sync הוגדר:
  Pattern: TextPop
  Beats מסונכרנים: 3
  FPS: 30 | BPM: 128
  
הרץ npx remotion studio לצפייה
```

## כלים נדרשים
- תוצאה מ-`/audio-beats` (רשימת beat frames)
- גישה ל-`src/edit-config.ts`
