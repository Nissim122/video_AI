# /video-export — render ואקספורט Remotion לקובץ mp4

הרץ render מלא של הסרטון מ-Remotion ואקספורט לקובץ mp4 מוכן לפרסום.

## מה לעשות

1. **בדוק שהקומפוזיציה מוכנה:**
```bash
npx remotion compositions
```
קרא את הרשימה — שים לב לשם הקומפוזיציה ולמספר הפריימים

2. **הרץ render בסיסי:**
```bash
npx remotion render [CompositionName] output.mp4
```

3. **render עם הגדרות מיטוב** (לפי פלטפורמה יעד):

### Instagram Reels / TikTok (9:16, קובץ קטן):
```bash
npx remotion render [CompositionName] output_reels.mp4 \
  --codec=h264 \
  --crf=23 \
  --scale=1
```

### YouTube (איכות גבוהה):
```bash
npx remotion render [CompositionName] output_youtube.mp4 \
  --codec=h264 \
  --crf=18 \
  --scale=1 \
  --jpeg-quality=95
```

### WhatsApp Status (קובץ קטן מאוד, מקסימום 16MB):
```bash
npx remotion render [CompositionName] output_wa.mp4 \
  --codec=h264 \
  --crf=28 \
  --scale=0.5
```

4. **אם הrender איטי** — הוסף concurrency:
```bash
npx remotion render [CompositionName] output.mp4 --concurrency=4
```

5. **בדוק גודל קובץ סופי:**
```bash
# Windows PowerShell
(Get-Item "output.mp4").length / 1MB
```

6. **אם הקובץ גדול מדי** — דחוס עם ffmpeg אחרי render:
```bash
ffmpeg -i "output.mp4" -vcodec libx264 -crf 26 -acodec aac -b:a 128k "output_compressed.mp4"
```

7. **הצג סיכום:**
```
✅ Render הושלם!
  קובץ:     output.mp4
  גודל:     12.4 MB
  משך:      28.5s
  FPS:      30
  רזולוציה: 1080×1920

📤 מוכן להעלאה — הרץ /video-upload להעלאה ישירה
```

## מהירות render טיפוסית
- 30s סרטון @ 30fps = ~900 פריימים
- concurrency=1: ~3-5 דקות
- concurrency=4: ~1-2 דקות

## כלים נדרשים
- `npx remotion` — כלול בפרויקט
- `ffmpeg` — לדחיסה נוספת (אופציונלי)
