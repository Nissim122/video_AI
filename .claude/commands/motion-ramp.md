# /motion-ramp — ניתוח תנועה ויצירת speed ramps

זהה אזורי תנועה מהירה/איטית בוידאו ויצור speed ramp אוטומטי — אפקט שינוי קצב דרמטי.

## מה לעשות

1. **קבל מהמשתמש** נתיב לקובץ וידאו

2. **ניתוח תנועה** עם ffmpeg optical flow:
```bash
ffmpeg -i "input.mp4" -vf "mestimate=method=epzs,minterpolate=fps=60:mi_mode=blend,scale=iw:ih" -f null - 2>&1
```

3. **ניתוח motion blur** לזיהוי אזורים מהירים:
```python
# scripts/motion-detect.py
import sys, cv2, numpy as np, json

video_path = sys.argv[1]
cap = cv2.VideoCapture(video_path)
fps = cap.get(cv2.CAP_PROP_FPS)

prev_frame = None
motion_scores = []
frame_idx = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    if prev_frame is not None:
        diff = cv2.absdiff(gray, prev_frame)
        score = float(np.mean(diff))
        motion_scores.append({"frame": frame_idx, "score": round(score, 2)})
    prev_frame = gray
    frame_idx += 1

cap.release()

# מיין לפי תנועה
high_motion = [s for s in motion_scores if s["score"] > 15]
low_motion  = [s for s in motion_scores if s["score"] < 3]

print(f"FPS: {fps}")
print(f"סה\"כ פריימים: {frame_idx}")
print(f"\nאזורי תנועה גבוהה ({len(high_motion)} פריימים):")
# קבץ לטווחים
for s in high_motion[:5]:
    print(f"  frame {s['frame']} — score {s['score']}")
print(f"\nאזורי תנועה נמוכה (slow-mo אפשרי):")
for s in low_motion[:5]:
    print(f"  frame {s['frame']} — score {s['score']}")
```
הרץ: `pip install opencv-python` ואז `python scripts/motion-detect.py "video.mp4"`

4. **יצור speed ramp עם ffmpeg:**

### Slow motion באזור ספציפי:
```bash
# האט פריימים 90-150 ל-50% מהירות
ffmpeg -i "input.mp4" -filter_complex \
  "[0:v]trim=start_frame=0:end_frame=90[a];
   [0:v]trim=start_frame=90:end_frame=150,setpts=2.0*PTS[b];
   [0:v]trim=start_frame=150,setpts=PTS-STARTPTS[c];
   [a][b][c]concat=n=3:v=1:a=0[out]" \
  -map "[out]" "output_ramped.mp4"
```

### Speed up (time-lapse אזור):
```bash
ffmpeg -i "input.mp4" -vf "setpts=0.5*PTS" -af "atempo=2.0" "output_fast.mp4"
```

5. **הצג תוצאות + המלצות:**
```
🎬 ניתוח תנועה — [שם קובץ]
───────────────────────────────
FPS מקורי: 30 | משך: 10.5s

📊 מפת תנועה:
  0s–2s:   נמוכה  ← טוב ל-slow-mo (x0.5)
  2s–4s:   גבוהה  ← שמור במהירות רגילה
  4s–7s:   גבוהה  ← טוב ל-speed up (x2)
  7s–10s:  נמוכה  ← slow-mo לסיום דרמטי

💡 Speed ramp מומלץ:
  0–60f:   0.5x (slow intro)
  60–120f: 1.0x (נורמל)
  120–210f: 2.0x (fast)
  210–315f: 0.3x (slow outro)
```

## כלים נדרשים
- `ffmpeg` — לעיבוד
- `opencv-python` + `numpy` — לניתוח: `pip install opencv-python numpy`
