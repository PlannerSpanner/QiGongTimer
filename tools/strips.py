import json, re
from PIL import Image, ImageDraw, ImageFont

data=json.load(open('frames.json'))
CELL=120; SS=3; S=CELL*SS
try: font=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
except: font=ImageFont.load_default()

BG={'morning-flow':(238,246,248),'morning-movement':(253,247,233),
    'prenatal-stretch':(253,244,241),'prenatal-movement':(253,247,233)}

def hexc(s): s=s.lstrip('#'); return tuple(int(s[i:i+2],16) for i in (0,2,4))

def draw_frame(markup, shadow, bg):
    img=Image.new('RGB',(S,S),bg); d=ImageDraw.Draw(img); k=SS
    # ground ellipse
    cx,cy,rx,ry=(float(shadow[a]) for a in ('cx','cy','rx','ry'))
    d.ellipse([(cx-rx)*k,(cy-ry)*k,(cx+rx)*k,(cy+ry)*k],fill=(230,220,200))
    # parts in document order (already depth sorted)
    for tag in re.finditer(r'<(line|polygon|circle)\s([^/]*)/>', markup):
        kind,attrs=tag.group(1),tag.group(2)
        a=dict(re.findall(r'([\w-]+)="([^"]*)"',attrs))
        if kind=='line':
            d.line([float(a['x1'])*k,float(a['y1'])*k,float(a['x2'])*k,float(a['y2'])*k],
                   fill=hexc(a['stroke']),width=max(1,round(float(a['stroke-width'])*k)))
        elif kind=='polygon':
            pts=[tuple(float(v)*k for v in p.split(',')) for p in a['points'].split()]
            d.polygon(pts,fill=hexc(a['fill']),outline=hexc(a['fill']))
        else:
            cx2,cy2,r=float(a['cx'])*k,float(a['cy'])*k,float(a['r'])*k
            if a.get('fill')=='none':
                d.ellipse([cx2-r,cy2-r,cx2+r,cy2+r],outline=hexc(a.get('stroke','#b9a98b')),
                          width=max(1,round(float(a.get('stroke-width','1'))*k)))
            else:
                d.ellipse([cx2-r,cy2-r,cx2+r,cy2+r],fill=hexc(a['fill']))
    return img.resize((CELL,CELL),Image.LANCZOS)

for app,moves in data.items():
    rows=len(moves)
    sheet=Image.new('RGB',(CELL*6, rows*(CELL+18)),(255,255,255))
    sd=ImageDraw.Draw(sheet)
    for r,mv in enumerate(moves):
        y=r*(CELL+18)
        for c,fr in enumerate(mv['frames']):
            sheet.paste(draw_frame(fr,mv['shadow'],BG[app]),(c*CELL,y))
        sd.text((4,y+CELL+2), f"{r+1}. {mv['n']}", fill=(60,60,60), font=font)
    sheet.save(f'strip_{app}.png')
    print(app, sheet.size)
