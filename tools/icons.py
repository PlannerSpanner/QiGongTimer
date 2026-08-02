# apple-touch-icons: signature pose per app on its theme gradient, 180x180 opaque PNG.
# Reads frames.json (run tools/dump.js first, AFTER a rebuild, so colors are themed).
import json, re, os
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
data = json.load(open(os.path.join(ROOT, 'frames.json')))

SS = 3; SIZE = 180; S = SIZE * SS; K = S / 100.0

# app -> (movement, frame idx, gradient top, gradient bottom, ground tint, out file)
ICONS = {
 'morning-flow':      ('Hip circles',            0, '#eef6f8', '#dcebf1', '#cfe2ea', 'icon-morning-flow.png'),
 'morning-movement':  ('Deep squats',            3, '#fdf7e9', '#f7ecd2', '#ecdfc0', 'icon-morning-movement.png'),
 'prenatal-stretch':  ('Supported butterfly',    0, '#fdf4f1', '#f9e7ee', '#f0d9e0', 'icon-prenatal-stretch.png'),
 'prenatal-movement': ('Birth ball hip circles', 0, '#fdf7e9', '#f7ecd2', '#ecdfc0', 'icon-birth-prep.png'),
}

def hexc(s): s = s.lstrip('#'); return tuple(int(s[i:i+2], 16) for i in (0, 2, 4))

def gradient(top, bot):
    img = Image.new('RGB', (S, S))
    t, b = hexc(top), hexc(bot)
    for y in range(S):
        f = y / (S - 1)
        img.paste(tuple(round(t[i] + (b[i] - t[i]) * f) for i in range(3)), (0, y, S, y + 1))
    return img

def draw(markup, shadow, img, ground):
    d = ImageDraw.Draw(img)
    cx, cy, rx, ry = (float(shadow[a]) for a in ('cx', 'cy', 'rx', 'ry'))
    d.ellipse([(cx-rx)*K, (cy-ry)*K, (cx+rx)*K, (cy+ry)*K], fill=hexc(ground))
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

for app, (mv_name, fi, top, bot, ground, out) in ICONS.items():
    mv = next(m for m in data[app] if m['n'] == mv_name)
    img = gradient(top, bot)
    draw(mv['frames'][fi], mv['shadow'], img, ground)
    img = img.resize((SIZE, SIZE), Image.LANCZOS)
    img.save(os.path.join(ROOT, out))
    print(out, 'from', app, '/', mv_name, 'frame', fi)
