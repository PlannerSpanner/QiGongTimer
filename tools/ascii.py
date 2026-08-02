import json, re, sys
from PIL import Image, ImageDraw
data=json.load(open('frames.json'))
K=6; S=100*K
def hexc(s): s=s.lstrip('#'); return tuple(int(s[i:i+2],16) for i in (0,2,4))
# color role ids painted into an index image
ROLE={'bg':0,'ground':1,'prop':2,'left':3,'torso':4,'belly':5,'ink':6}
GLYPH=' .|o#@B'
def role_of(c):
    c=c.lower()
    if c in ('#c2a473','#93b8c4','#cfa8b3'): return ROLE['left']
    if c in ('#7d5a1e','#2e7d94','#a8546b'): return ROLE['torso']
    if c in ('#caac79','#9dc2cd','#dcbcc4'): return ROLE['belly']
    if c=='#b9a98b': return ROLE['prop']
    return ROLE['ink']
def draw_frame(markup, shadow):
    img=Image.new('P',(S,S),ROLE['bg']); d=ImageDraw.Draw(img)
    cx,cy,rx,ry=(float(shadow[a]) for a in ('cx','cy','rx','ry'))
    d.ellipse([(cx-rx)*K,(cy-ry)*K,(cx+rx)*K,(cy+ry)*K],fill=ROLE['ground'])
    for tag in re.finditer(r'<(line|polygon|circle)\s([^/]*)/>', markup):
        kind,attrs=tag.group(1),tag.group(2)
        a=dict(re.findall(r'([\w-]+)="([^"]*)"',attrs))
        if kind=='line':
            col=role_of(a['stroke'])
            d.line([float(a['x1'])*K,float(a['y1'])*K,float(a['x2'])*K,float(a['y2'])*K],
                   fill=col,width=max(2,round(float(a['stroke-width'])*K)))
        elif kind=='polygon':
            raw=a['points'].split()
            pts=[tuple(float(v)*K for v in p.split(',')) for p in raw]
            d.polygon(pts,fill=(ROLE['belly'] if len(raw)>6 else role_of(a['fill'])))
        else:
            cx2,cy2,r=float(a['cx'])*K,float(a['cy'])*K,float(a['r'])*K
            if a.get('fill')=='none':
                d.ellipse([cx2-r,cy2-r,cx2+r,cy2+r],outline=ROLE['prop'],width=2*K)
            else:
                d.ellipse([cx2-r,cy2-r,cx2+r,cy2+r],fill=role_of(a['fill']))
    return img
def ascii_of(img,W=58,H=27):
    px=img.load(); out=[]
    cw,ch=S/W,S/H
    for r in range(H):
        row=''
        for c in range(W):
            counts={}
            for yy in range(int(r*ch),int((r+1)*ch),3):
                for xx in range(int(c*cw),int((c+1)*cw),3):
                    v=px[min(xx,S-1),min(yy,S-1)]
                    if v: counts[v]=counts.get(v,0)+1
            if not counts: row+=' '
            else:
                # prefer figure roles over ground when mixed
                best=max(counts,key=lambda k:(k!=1,counts[k]))
                row+=GLYPH[best]
        out.append(row)
    return '\n'.join(out)
app=sys.argv[1]; which=sys.argv[2] if len(sys.argv)>2 else None
for mv in data[app]:
    if which and which.lower() not in mv['n'].lower(): continue
    fr=[0,2,3] if len(sys.argv)<4 else [int(x) for x in sys.argv[3].split(',')]
    for i in fr:
        print(f"--- {mv['n']}  frame {i} ---")
        print(ascii_of(draw_frame(mv['frames'][i],mv['shadow'])))
