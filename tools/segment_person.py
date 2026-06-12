"""
segment_person.py
-----------------
Processes chofshi.mp4 frame-by-frame using rembg (U2Net AI),
produces a WebM (VP9 + alpha) where the background is transparent.

Output: public/chofshi_masked.webm
Usage:  python tools/segment_person.py
"""

import cv2
import numpy as np
import subprocess
import os
import sys
from rembg import remove, new_session

INPUT  = os.path.join(os.path.dirname(__file__), "..", "public", "chofshi.mp4")
FRAMES = os.path.join(os.path.dirname(__file__), "..", "public", "_seg_frames")
OUTPUT = os.path.join(os.path.dirname(__file__), "..", "public", "chofshi_masked.webm")

def main():
    cap = cv2.VideoCapture(INPUT)
    if not cap.isOpened():
        print(f"ERROR: cannot open {INPUT}")
        sys.exit(1)

    fps   = cap.get(cv2.CAP_PROP_FPS)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Video: {total} frames @ {fps:.2f} fps")

    os.makedirs(FRAMES, exist_ok=True)

    print("Loading AI model (u2net_human_seg)...")
    session = new_session("u2net_human_seg")

    frame_idx = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # rembg expects RGB PNG bytes
        _, png_buf = cv2.imencode(".png", cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        result_bytes = remove(png_buf.tobytes(), session=session)

        # Decode result (RGBA PNG)
        result_arr = np.frombuffer(result_bytes, np.uint8)
        rgba = cv2.imdecode(result_arr, cv2.IMREAD_UNCHANGED)  # BGRA

        out_path = os.path.join(FRAMES, f"frame_{frame_idx:05d}.png")
        # cv2.imwrite fails silently on Hebrew/non-ASCII paths on Windows
        success, buf = cv2.imencode(".png", rgba)
        if success:
            with open(out_path, "wb") as fh:
                fh.write(buf.tobytes())

        frame_idx += 1
        pct = frame_idx / total * 100
        done = int(pct / 2)
        bar = "#" * done + "-" * (50 - done)
        print(f"\r[{bar}] {pct:5.1f}%  ({frame_idx}/{total})", end="", flush=True)

    cap.release()
    print(f"\nSegmentation done — {frame_idx} frames written")

    # ── Encode to WebM VP9 with alpha ──────────────────────────────────────────
    print("Encoding WebM with alpha channel...")
    cmd = [
        "ffmpeg", "-y",
        "-framerate", str(fps),
        "-i", os.path.join(FRAMES, "frame_%05d.png"),
        "-c:v", "libvpx-vp9",
        "-b:v", "0",
        "-crf", "28",
        "-pix_fmt", "yuva420p",
        "-auto-alt-ref", "0",
        OUTPUT,
    ]
    result = subprocess.run(cmd, capture_output=True)
    if result.returncode != 0:
        err = (result.stderr or b"").decode("utf-8", errors="replace")
        print("ffmpeg error:", err[-800:])
        sys.exit(1)

    print(f"Done!  →  {OUTPUT}")

    # Cleanup temp frames
    import shutil
    shutil.rmtree(FRAMES)
    print("Temp frames cleaned up.")

if __name__ == "__main__":
    main()
