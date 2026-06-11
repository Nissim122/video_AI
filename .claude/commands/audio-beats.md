# /audio-beats — ניתוח waveform וזיהוי beats

חלץ ביטים מקובץ אודיו/וידאו ומייצר רשימת frames מוכנה לסנכרון אנימציה ב-Remotion.

## מה לעשות

1. **קבל מהמשתמש** נתיב לקובץ אודיו או וידאו + FPS (ברירת מחדל: 30)

2. **חלץ אודיו** אם הקלט הוא וידאו:
```bash
ffmpeg -i "video.mp4" -vn -acodec pcm_s16le -ar 44100 -ac 1 "audio_temp.wav"
```

3. **הרץ ניתוח beats** עם Python:
```python
# scripts/beat-detect.py
import sys, subprocess, json

audio_file = sys.argv[1]
fps = int(sys.argv[2]) if len(sys.argv) > 2 else 30

# שיטה 1: librosa (אם מותקן)
try:
    import librosa
    import numpy as np
    y, sr = librosa.load(audio_file, sr=None)
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
    beat_times = librosa.frames_to_time(beats, sr=sr)
    beat_frames = [int(t * fps) for t in beat_times]
    print(f"Tempo: {tempo:.1f} BPM")
    print(f"Beat frames: {beat_frames}")
except ImportError:
    # שיטה 2: ffmpeg בלבד — volume peaks
    result = subprocess.run([
        'ffmpeg', '-i', audio_file,
        '-af', 'astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-',
        '-f', 'null', '-'
    ], capture_output=True, text=True)
    print("librosa לא מותקן. הרץ: pip install librosa")
    print("או: pip install librosa soundfile")
```

4. **אם librosa לא מותקן**, הנחה את המשתמש:
```
pip install librosa soundfile
python scripts/beat-detect.py "music.mp3" 30
```

5. **הצג תוצאות + קוד Remotion:**
```
🎵 ניתוח beats — [שם קובץ]
Tempo: 128 BPM
פריימים לביט: 14 (ב-30fps)

Beat frames (לסנכרון):
[14, 28, 42, 56, 70, 84, ...]

// קוד Remotion מוכן:
const BEAT_FRAMES = [14, 28, 42, 56, 70, 84];
const isOnBeat = BEAT_FRAMES.includes(frame);
const beatProgress = BEAT_FRAMES.findIndex(f => f === frame);
```

## כלים נדרשים
- `ffmpeg` — לחליצת אודיו
- `librosa` + `soundfile` — לניתוח beats: `pip install librosa soundfile`

## פלט אחרון
שאל: "רוצה לסנכרן אנימציה אוטומטית עם ה-beats? הרץ `/beat-sync`"
