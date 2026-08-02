# Single app icon (icon-app.png): the whole collection is ONE home-screen app whose
# home page is index.html, so every page shares this icon. Moss-toned standing figure
# on the launcher's sage gradient. Reads frames.json (node tools/dump.js first).
import json, re, os
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
data = json.load(open(os.path.join(ROOT, 'frames.json')))

SS = 3; SIZE = 180; S = SIZE * SS; K = S / 100.0

# launcher identity: index.html background family + moss figure
GRAD_TOP, GRAD_BOT, GROUND = '#f6f1e4', '#e4ecea', '#dde5d9'
# morning-flow's standing pose, recolored from its teal theme to the launcher moss
POSE_APP, POSE_MOVE, POSE_FRAME = 'morning-flow', 'Hip circles', 0
RECOLOR = {'#245e70': '#3d5f48', '#93b8c4': '#9dbfa8', '#2e7d94': '#4f7d5e'}

def hexc(s): s = s.lstrip('#'); return tuple(int(s[i:i+2], 16) for i in (0, 2, 4))

def gradient(top, bot):
    img = Image.new('RGB', (S, S))
    t, b = hexc(top), hexc(bot)
    for y in range(S):
        f = y / (S - 1)
        img.paste(tuple(round(t[i] + (b[i] - t[i]) * f) for i in range(3)), (0, y, S, y + 1))
    return img

def draw(markup, shadow, img):
    d = ImageDraw.Draw(img)
    cx, cy, rx, ry = (float(shadow[a]) for a in ('cx', 'cy', 'rx', 'ry'))
    d.ellipse([(cx-rx)*K, (cy-ry)*K, (cx+rx)*K, (cy+ry)*K], fill=hexc(GROUND))
    for tag in re.finditer(r'<(line|polygon|circle)\s([^/]*)/>', markup):
        kind, attrs = tag.group(1), tag.group(2)
        a = dict(re.findall(r'([\w-]+)="([^"]*)"', attrs))
        if kind == 'line':
            d.line([float(a['x1'])*K, float(a['y1'])*K, float(a['x2'])*K, float(a['y2'])*K],
                   fill=hexc(a['stroke']), width=max(1, round(float(a['stroke-width'])*K)))
        elif kind == 'polygon':
            pts = [tuple(float(v)*K for v in p.split(',')) for p in a['points'].split()]
            d.polygon(pts, fill=hexc(a['fill']), outline=hexc(a['fill']))
        else:
            cx2, cy2, r = float(a['cx'])*K, float(a['cy'])*K, float(a['r'])*K
            if a.get('fill') == 'none':
                d.ellipse([cx2-r, cy2-r, cx2+r, cy2+r], outline=hexc(a.get('stroke', '#b9a98b')),
                          width=max(1, round(float(a.get('stroke-width', '1'))*K)))
            else:
                d.ellipse([cx2-r, cy2-r, cx2+r, cy2+r], fill=hexc(a['fill']))

mv = next(m for m in data[POSE_APP] if m['n'] == POSE_MOVE)
markup = mv['frames'][POSE_FRAME]
for a, b in RECOLOR.items():
    markup = markup.replace(a, b)
img = gradient(GRAD_TOP, GRAD_BOT)
draw(markup, mv['shadow'], img)
img = img.resize((SIZE, SIZE), Image.LANCZOS)
img.save(os.path.join(ROOT, 'icon-app.png'))
print('icon-app.png from', POSE_APP, '/', POSE_MOVE, 'frame', POSE_FRAME)
