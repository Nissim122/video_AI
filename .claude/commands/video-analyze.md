# /video-analyze — ניתוח תוכן וידאו

קבל נתיב לקובץ וידאו וספק ניתוח מלא: אורך, רזולוציה, קצב פריימים, וזיהוי חתכים טבעיים.

## מה לעשות

1. **קבל מהמשתמש** את נתיב הקובץ (או השתמש בקובץ שצוין)

2. **הרץ ffprobe** לנתוני בסיס:
```bash
ffprobe -v quiet -print_format json -show_format -show_streams "PATH_TO_VIDEO"
```
חלץ: duration, width, height, fps (r_frame_rate), codec, bitrate

3. **הרץ ניתוח scene detection** עם ffmpeg:
```bash
ffmpeg -i "PATH_TO_VIDEO" -vf "select='gt(scene,0.3)',showinfo" -vsync vfr -f null - 2>&1
```
חפש שורות עם `pts_time` — אלו נקודות החיתוך הטבעיות.

4. **הצג דוח מסודר:**
```
📹 ניתוח וידאו: [שם קובץ]
─────────────────────────────
אורך:        X שניות
רזולוציה:    WxH (aspect: 9:16 / 16:9 / 1:1)
FPS:         X
קודק:        h264 / hevc / ...
גודל:        X MB

✂️ נקודות חיתוך טבעיות (scene changes):
  00:00:03.2 — שינוי חד (score: 0.85)
  00:00:07.8 — שינוי חד (score: 0.61)
  ...

💡 המלצה לעריכה:
  - X סצנות טבעיות זוהו
  - השתמש בנקודות אלו ב-startFrom / endAt ב-Remotion
```

5. אם המשתמש רוצה — המר את נקודות החיתוך לפריימים לפי ה-FPS:
   `frame = time_seconds × fps`

## כלים נדרשים
- `ffmpeg` + `ffprobe` (חייבים להיות מותקנים)
- אם לא מותקנים: `winget install ffmpeg` או `choco install ffmpeg`

## פלט אחרון
סיים תמיד עם: "כדי לבצע חיתוך אוטומטי — הרץ `/cut-detect`"
