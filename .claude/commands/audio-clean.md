# /audio-clean — ניקוי רעש רקע מאודיו/וידאו

הסר רעש רקע מקובץ אודיו או מהאודיו של וידאו, ושמור קובץ נקי.

## מה לעשות

1. **קבל מהמשתמש** נתיב לקובץ

2. **שאל** איזה סוג ניקוי:
   - **A** — רעש חדר (AC, מאוורר, המולה כללית)
   - **B** — רעש חד (קליקים, pops)
   - **C** — שניהם

3. **הרץ ניקוי עם ffmpeg** (מהיר, ללא תוספות):

### ניקוי רעש רקע (A):
```bash
ffmpeg -i "input.mp4" -af "anlmdn=s=7:p=0.002:r=0.002:m=15" "output_clean.mp4"
```

### ניקוי קליקים ו-pops (B):
```bash
ffmpeg -i "input.mp4" -af "adeclick=w=55:o=25:a=2" "output_clean.mp4"
```

### שניהם (C):
```bash
ffmpeg -i "input.mp4" -af "anlmdn=s=7:p=0.002:r=0.002:m=15,adeclick=w=55:o=25:a=2" "output_clean.mp4"
```

### אם וידאו — שמור וידאו + אודיו נקי:
```bash
ffmpeg -i "input.mp4" -af "anlmdn=s=7" -c:v copy "output_clean.mp4"
```

4. **ניקוי מתקדם** עם Python (אם `noisereduce` מותקן):
```python
# scripts/noise-reduce.py
import sys
import noisereduce as nr
import soundfile as sf
import librosa

input_file = sys.argv[1]
output_file = sys.argv[2] if len(sys.argv) > 2 else "clean_audio.wav"

y, sr = librosa.load(input_file, sr=None, mono=False)
# השתמש בשניות הראשונות כדגימת רעש
noise_sample = y[:, :sr] if y.ndim == 2 else y[:sr]
reduced = nr.reduce_noise(y=y, sr=sr, y_noise=noise_sample, prop_decrease=0.75)
sf.write(output_file, reduced.T if y.ndim == 2 else reduced, sr)
print(f"נשמר: {output_file}")
```
```bash
pip install noisereduce soundfile librosa
python scripts/noise-reduce.py "input.mp3" "clean.wav"
```

5. **השווה** לפני/אחרי עם ffmpeg loudness:
```bash
ffmpeg -i "output_clean.mp4" -af "loudnorm=print_format=json" -f null - 2>&1
```

6. **הצג סיכום:**
```
✅ ניקוי אודיו הושלם
  קלט:  input.mp4
  פלט:  output_clean.mp4
  שיטה: anlmdn (רעש רקע)
  
💡 לבדיקה: פתח את output_clean.mp4 בנגן
```

## כלים נדרשים
- `ffmpeg` — לניקוי בסיסי (ללא pip)
- `noisereduce librosa soundfile` — לניקוי מתקדם: `pip install noisereduce librosa soundfile`
