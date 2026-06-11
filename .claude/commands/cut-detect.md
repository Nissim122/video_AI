# /cut-detect — מציאת נקודות חיתוך טבעיות בוידאו

זהה אוטומטית את כל נקודות החיתוך בוידאו והמר אותן לנתונים שמוכנים לשימוש ב-Remotion.

## מה לעשות

1. **קבל מהמשתמש** נתיב לקובץ וידאו ורף רגישות (ברירת מחדל: 0.3)

2. **הרץ scene detection:**
```bash
ffmpeg -i "PATH" -vf "select='gt(scene,THRESHOLD)',metadata=print:file=cuts.txt" -vsync vfr -f null - 2>&1
```

3. **אם ffmpeg לא זמין ישירות**, השתמש בסקריפט Python:
```python
import subprocess, json, re, sys

video = sys.argv[1]
threshold = float(sys.argv[2]) if len(sys.argv) > 2 else 0.3

result = subprocess.run([
    'ffprobe', '-v', 'quiet', '-of', 'json',
    '-show_streams', video
], capture_output=True, text=True)
data = json.loads(result.stdout)
fps = eval(data['streams'][0]['r_frame_rate'])

result2 = subprocess.run([
    'ffmpeg', '-i', video,
    '-vf', f"select='gt(scene,{threshold})',showinfo",
    '-vsync', 'vfr', '-f', 'null', '-'
], capture_output=True, text=True)

times = re.findall(r'pts_time:([\d.]+)', result2.stderr)
for t in times:
    frame = int(float(t) * fps)
    print(f"  {float(t):.2f}s → frame {frame}")
```
שמור ב-`scripts/cut-detect.py` והרץ עם `python scripts/cut-detect.py "video.mp4"`

4. **הצג תוצאות:**
```
✂️ נקודות חיתוך — [שם קובץ]
FPS: 30

 #   זמן      פריים    ציון
─────────────────────────────
 1   00:03.2   96       0.85  ← חזק
 2   00:07.8   234      0.61
 3   00:14.1   423      0.44
 ...
```

5. **המר לקוד Remotion מוכן:**
```tsx
// נקודות חיתוך שזוהו — השתמש כ-startFrom/endAt
const CUTS = [
  { start: 0,   end: 96  },  // סצנה 1
  { start: 96,  end: 234 },  // סצנה 2
  { start: 234, end: 423 },  // סצנה 3
];
```

## אפשרויות
- `threshold` גבוה (0.5+) = רק חיתוכים חדים מאוד
- `threshold` נמוך (0.2) = גם מעברים עדינים

## פלט אחרון
שאל: "רוצה שאפיק את הסצנות לקבצים נפרדים? הרץ `/video-export`"
