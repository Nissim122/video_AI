# /video-diff — השוואה ויזואלית בין שתי גרסאות סרטון

השווה שני קבצי וידאו (גרסא A vs B) וזהה הבדלים ויזואליים — שינויי אנימציה, טקסט, תזמון.

## מה לעשות

1. **קבל מהמשתמש** שני נתיבים: `version_a.mp4` ו-`version_b.mp4`

2. **יצור סרטון side-by-side** לצפייה:
```bash
ffmpeg -i "version_a.mp4" -i "version_b.mp4" \
  -filter_complex "\
    [0:v]scale=540:960,drawtext=text='גרסא A':fontcolor=white:fontsize=36:x=20:y=20:box=1:boxcolor=black@0.5[a];\
    [1:v]scale=540:960,drawtext=text='גרסא B':fontcolor=white:fontsize=36:x=20:y=20:box=1:boxcolor=black@0.5[b];\
    [a][b]hstack=inputs=2[out]" \
  -map "[out]" -map 0:a -shortest \
  "diff_preview.mp4"
```

3. **ניתוח הבדלים פריים-לפריים** עם Python:
```python
# scripts/video-diff.py
import sys, cv2, numpy as np

path_a = sys.argv[1]
path_b = sys.argv[2]
threshold = float(sys.argv[3]) if len(sys.argv) > 3 else 10.0

cap_a = cv2.VideoCapture(path_a)
cap_b = cv2.VideoCapture(path_b)
fps = cap_a.get(cv2.CAP_PROP_FPS)

changes = []
frame_idx = 0

while True:
    ret_a, frame_a = cap_a.read()
    ret_b, frame_b = cap_b.read()
    if not ret_a or not ret_b:
        break

    # השווה גודל
    if frame_a.shape != frame_b.shape:
        frame_b = cv2.resize(frame_b, (frame_a.shape[1], frame_a.shape[0]))

    diff = cv2.absdiff(frame_a, frame_b)
    score = np.mean(diff)

    if score > threshold:
        changes.append({
            "frame": frame_idx,
            "time": round(frame_idx / fps, 2),
            "score": round(score, 1)
        })

    frame_idx += 1

cap_a.release()
cap_b.release()

# קבץ לטווחים רצופים
if not changes:
    print("✅ הסרטונים זהים לחלוטין!")
else:
    print(f"🔍 נמצאו {len(changes)} פריימים שונים:\n")
    # קבץ לאזורים
    regions = []
    start = changes[0]
    prev_frame = changes[0]["frame"]
    for c in changes[1:]:
        if c["frame"] - prev_frame > 5:
            regions.append((start, {"frame": prev_frame, "time": round(prev_frame/fps, 2)}))
            start = c
        prev_frame = c["frame"]
    regions.append((start, {"frame": prev_frame, "time": round(prev_frame/fps, 2)}))

    for i, (s, e) in enumerate(regions):
        print(f"  שינוי {i+1}: {s['time']}s – {e['time']}s (frame {s['frame']}–{e['frame']})")
```

הרץ: `pip install opencv-python numpy` ואז `python scripts/video-diff.py "v1.mp4" "v2.mp4"`

4. **הצג תוצאות:**
```
🔍 Video Diff — v1.mp4 vs v2.mp4
────────────────────────────────────
סה"כ פריימים: 855
פריימים שונים: 124 (14.5%)

📍 אזורי שינוי:
  שינוי 1: 0.0s – 1.8s    ← אנימציית כניסה שונה
  שינוי 2: 8.3s – 9.1s    ← טקסט שונה
  שינוי 3: 22.4s – 28.5s  ← outro שונה

👁️ Side-by-side: diff_preview.mp4 (פתח לצפייה)
```

5. **פתח את ה-preview:**
```bash
# Windows
start diff_preview.mp4
```

## שימושים
- לפני/אחרי עריכה — ודא שהשינוי נראה כמו שתוכנן
- השוואת גרסאות render — זהה bugs ויזואליים
- בדיקת QA לפני פרסום

## כלים נדרשים
- `ffmpeg` — ל-side-by-side preview
- `opencv-python` + `numpy` — לניתוח: `pip install opencv-python numpy`
