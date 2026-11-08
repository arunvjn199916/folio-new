"""
Trace a portrait photo into the dot outline the hero globe morphs into.

  pip install mediapipe opencv-python-headless numpy
  curl -L -o selfie_multiclass.tflite \
    https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite
  python scripts/trace-portrait.py media/images/reachout.webp selfie_multiclass.tflite

Steps: MediaPipe multiclass selfie segmentation (hair / face / body skin / clothes / other) →
borders between those regions + the person silhouette + fine Canny detail inside the figure →
evenly spaced dots (Poisson-disk style) → src/content/portrait-points.ts (x,y in [-1,1]).
On Linux the segmenter needs libEGL (apt-get install libegl1).
"""
import sys, os, tempfile
import numpy as np, cv2, mediapipe as mp
from mediapipe.tasks import python as mpt
from mediapipe.tasks.python import vision

SRC = sys.argv[1]
MODEL = sys.argv[2]
SPACING = float(sys.argv[3]) if len(sys.argv) > 3 else 7.5
OUT = os.path.join(os.path.dirname(__file__), "..", "src", "content", "portrait-points.ts")

# 1) segmentation (at 2x for cleaner edges)
seg = vision.ImageSegmenter.create_from_options(
    vision.ImageSegmenterOptions(base_options=mpt.BaseOptions(model_asset_path=MODEL), output_category_mask=True)
)
rgb = cv2.cvtColor(cv2.imread(SRC), cv2.COLOR_BGR2RGB)
big = cv2.resize(rgb, (rgb.shape[1] * 2, rgb.shape[0] * 2), interpolation=cv2.INTER_CUBIC)
cat = np.squeeze(seg.segment(mp.Image(image_format=mp.ImageFormat.SRGB, data=np.ascontiguousarray(big))).category_mask.numpy_view().copy())
tmp = tempfile.mkdtemp()
np.save(os.path.join(tmp, "cat.npy"), cat)
import json
src, catf, outdir, D = SRC, os.path.join(tmp, "cat.npy"), tmp, SPACING
cat = np.load(catf).astype(np.uint8)
H, W = cat.shape
img = cv2.resize(cv2.imread(src), (W, H), interpolation=cv2.INTER_CUBIC)
# smooth each class region a little so boundaries are clean lines, not pixel noise
cls = np.zeros_like(cat)
for c in range(1, 6):
    m = (cat == c).astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    cls[m > 0] = c
person = (cls > 0).astype(np.uint8) * 255
n, lab, st, _ = cv2.connectedComponentsWithStats(person)
person = np.where(lab == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA]), 255, 0).astype(np.uint8)
cls[person == 0] = 0
def border(mask):
    b = cv2.morphologyEx(mask, cv2.MORPH_GRADIENT, np.ones((3, 3), np.uint8))
    b[:3, :] = 0; b[-3:, :] = 0; b[:, :3] = 0; b[:, -3:] = 0   # frame edges are not outline
    return b
sil = border(person)
inner = np.zeros_like(person)
for c in range(1, 6):
    inner |= border(np.where(cls == c, 255, 0).astype(np.uint8))
inner[sil > 0] = 0
inner = cv2.bitwise_and(inner, cv2.erode(person, np.ones((5, 5), np.uint8)))
# fine detail inside face/skin (ear, mouth) and clothes (collar, zipper, arm folds)
g = cv2.bilateralFilter(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), 9, 50, 50)
ed = cv2.Canny(g, 40, 110)
detail_zone = cv2.erode(person, np.ones((15, 15), np.uint8))
ed = cv2.bitwise_and(ed, detail_zone)
ed[cv2.dilate(inner | sil, np.ones((9, 9), np.uint8)) > 0] = 0
n, lab, st, _ = cv2.connectedComponentsWithStats(ed, connectivity=8)
det = np.zeros_like(ed)
for i in range(1, n):
    x, y, w, h, a = st[i]
    if a >= 40 and max(w, h) >= 22: det[lab == i] = 255
cv2.imwrite(f"{outdir}/lines.png", sil | inner | det)
def sample(binimg, d, grid):
    ys, xs = np.nonzero(binimg); order = np.random.default_rng(7).permutation(len(xs)); out = []
    for k in order:
        x, y = float(xs[k]), float(ys[k]); gx, gy = int(x // d), int(y // d); ok = True
        for i in (-1, 0, 1):
            for j in (-1, 0, 1):
                for (px, py) in grid.get((gx + i, gy + j), ()):
                    if (px - x) ** 2 + (py - y) ** 2 < d * d: ok = False; break
                if not ok: break
            if not ok: break
        if ok: out.append((x, y)); grid.setdefault((gx, gy), []).append((x, y))
    return out
grid = {}
p_sil = sample(sil, D, grid); p_in = sample(inner, D, grid); p_det = sample(det, D * 1.15, grid)
pts = p_sil + p_in + p_det
a = np.array(pts); mn, mx = a.min(0), a.max(0); c = (mn + mx) / 2; s = (mx - mn).max() / 2
norm = ((a - c) / s).round(3)
json.dump({"points": norm.tolist(), "aspect": float((mx - mn)[0] / (mx - mn)[1])}, open(f"{outdir}/points.json", "w"))
prev = np.zeros((H, W, 3), np.float32); prev[:] = (1, 0, 16)
glow = np.zeros_like(prev)
for x, y in pts: cv2.circle(glow, (int(x), int(y)), 6, (147, 239, 255), -1, cv2.LINE_AA)
out = np.clip(prev + cv2.GaussianBlur(glow, (0, 0), 6) * 0.7, 0, 255).astype(np.uint8)
for x, y in pts: cv2.circle(out, (int(x), int(y)), 2, (147, 239, 255), -1, cv2.LINE_AA)
cv2.imwrite(f"{outdir}/preview.png", out)
print("points", len(pts), "silhouette", len(p_sil), "regions", len(p_in), "detail", len(p_det))

flat = [v for p in norm.tolist() for v in p]
body = ",".join(("%.3f" % v).rstrip("0").rstrip(".") if v != 0 else "0" for v in flat)
with open(OUT, "w") as f:
    f.write("// Arun's portrait as a dot outline — generated from media/images/reachout.webp by\n"
            "// scripts/trace-portrait.py (MediaPipe selfie segmentation → region borders + detail edges →\n"
            "// evenly spaced dots). x,y pairs in [-1, 1], y down, centred on the figure. Regenerate, don't edit.\n"
            "export const PORTRAIT_POINTS = new Float32Array([%s]);\n" % body)
print("wrote", OUT, len(flat) // 2, "points; preview:", os.path.join(tmp, "preview.png"))
