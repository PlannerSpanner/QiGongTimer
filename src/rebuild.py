import os; os.chdir(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.dirname(os.getcwd())  # repo root — built HTML lives there for GitHub Pages
exec(open('build.py', encoding='utf-8').read())
BLUE=dict(n=10,accent='#2e7d94',
 fig=[('#6d4f1c','#245e70'),('#c2a473','#93b8c4'),('#7d5a1e','#2e7d94')],css=[
 ('#fdf7e9 0%,#fdf0dc 45%,#f4f3e3 100%','#eef6f8 0%,#e6f0f5 45%,#eaf2ee 100%'),
 ('#a5762a','#2e7d94'),('#a4947a','#8aa2ab'),('#bd8629','#3f96ae'),('#7d5a1e','#245e70'),
 ('#9c8b6d','#7d97a0'),('#f0e5cd','#d9e8ee'),('#dd9a3c','#3f96ae'),('#ecca8e','#a8cdd9'),
 ('#665c48','#4a626b'),('#4a4237','#33474e'),('#c8862e','#2e7d94'),
 ('rgba(144,127,97,0.16)','rgba(70,110,125,0.16)'),('rgba(165,118,42,0.22)','rgba(46,125,148,0.22)'),
 ('rgba(221,154,60,0.3)','rgba(63,150,174,0.3)'),('rgba(221,154,60,0.15)','rgba(63,150,174,0.15)'),
 ('rgba(221,154,60,0.45)','rgba(63,150,174,0.45)'),('rgba(221,154,60,0.5)','rgba(63,150,174,0.5)'),
 ('rgba(180,140,60,0.3)','rgba(63,150,174,0.3)'),('#e8dcc0','#d3e4ea'),
 ('#6d4f1c','#245e70'),('#c2a473','#93b8c4'),('#7d5a1e','#2e7d94'),('#caac79','#9dc2cd')])
ROSE=dict(n=10,accent='#a8546b',
 fig=[('#6d4f1c','#7d3f53'),('#c2a473','#cfa8b3'),('#7d5a1e','#a8546b')],
 warnText='#8f4550',warnBg='rgba(214,110,120,0.11)',
 warnBorder='rgba(214,110,120,0.3)',warnStrong='#7d353f',css=[
 ('#fdf7e9 0%,#fdf0dc 45%,#f4f3e3 100%','#fdf4f1 0%,#fbecf1 42%,#f1eefa 100%'),
 ('#a5762a','#a8546b'),('#a4947a','#a98b95'),('#bd8629','#c4657f'),('#7d5a1e','#7d3f53'),
 ('#9c8b6d','#a1808b'),('#f0e5cd','#f2dfe4'),('#dd9a3c','#d9788f'),('#ecca8e','#e8b6c4'),
 ('#665c48','#6b555d'),('#4a4237','#4c3d43'),('#c8862e','#c4657f'),
 ('rgba(144,127,97,0.16)','rgba(150,115,127,0.16)'),('rgba(165,118,42,0.22)','rgba(168,84,107,0.2)'),
 ('rgba(221,154,60,0.3)','rgba(217,120,143,0.28)'),('rgba(221,154,60,0.15)','rgba(217,120,143,0.14)'),
 ('rgba(221,154,60,0.45)','rgba(217,120,143,0.45)'),('rgba(221,154,60,0.5)','rgba(217,120,143,0.45)'),
 ('rgba(180,140,60,0.3)','rgba(190,120,140,0.3)'),('#e8dcc0','#f0dde3'),
 ('#6d4f1c','#7d3f53'),('#c2a473','#cfa8b3'),('#7d5a1e','#a8546b'),('#caac79','#dcbcc4')])
A11=dict(n=12,accent='#a5762a',warnText='#8d5326',warnBg='rgba(214,140,70,0.12)',
 warnBorder='rgba(214,140,70,0.32)',warnStrong='#7a441c',css=[])
A12=dict(n=12,accent='#a5762a',css=[])
BAN=("<strong>Listen to your body.</strong> Ease off anything that feels sharp or wrong, "
     "and mention it to your provider. Breathe continuously — never hold your breath "
     "or bear down.")
build(os.path.join(OUT,'morning-flow.html'),'d_flow.js',open('x_flow.js',encoding='utf-8').read(),
 'Morning Flow','Dynamic Qi Gong · Targeted Rehab','icon-app.png','#eef6f8',BLUE,
 '<strong>Morning Flow</strong> runs about 8 minutes. Every movement is continuous and rhythmic — nothing is held. Each one does double duty: it feels like a workout and targets a specific weak point.',
 '<strong>Done.</strong> Thoracic spine mobilised, serratus fired, hips open, posterior chain warm, calves primed. Go get it.')
build(os.path.join(OUT,'morning-movement.html'),'data2.js',open('mm_extra.js',encoding='utf-8').read(),
 'Morning Movement','Mobility · Control · Stability','icon-app.png','#fdf7e9',A12,
 '<strong>Morning Movement</strong> runs 9 minutes: standing mobility, then floor work, then core. Two-sided movements chime at the halfway point. No impact — safe for the right peroneal tendon.',
 '<strong>Done.</strong> Hips and ankles mobile, spine articulated, hip rotation opened, core switched on. Nothing loaded the peroneal tendon.')
build(os.path.join(OUT,'prenatal-stretch.html'),'d_stretch.js',open('x_stretch.js',encoding='utf-8').read(),
 'Prenatal Stretch','Gentle · Stretch & Release','icon-app.png','#fdf4f1',ROSE,
 '<strong>Prenatal Stretch</strong> runs about 10 minutes. Every position is seated, hands-and-knees, or standing with support — no lying flat on the back, no inversions, no balance challenges. Breathe continuously throughout.',
 '<strong>Done.</strong> Drink water. If anything felt sharp, pulling, or made you dizzy, mention it at your next appointment.',banner=BAN)
build(os.path.join(OUT,'prenatal-movement.html'),'d_birth.js',open('x_birth.js',encoding='utf-8').read(),
 'Birth Prep','Pelvic mobility · Floor release','icon-app.png','#fdf7e9',A11,
 '<strong>The idea:</strong> for perineal tearing, the ability to <em>relax and lengthen</em> the pelvic floor matters more than strength. This trains release and coordination, plus the hip and adductor mobility that lets the pelvic outlet open.',
 '<strong>Done.</strong> Drink water. If anything caused cramping, bleeding or sharp pain, stop this routine and call your provider before repeating it.',banner=BAN,x2=True)
# stamp index.html too (hand-edited, so the stamp is refreshed here; deterministic:
# hash of the content with an emptied stamp, idempotent across rebuilds)
import hashlib, re as _re
_ip = os.path.join(OUT, 'index.html')
_s = open(_ip, encoding='utf-8').read()
_z = _re.sub(r"BUILDV='[0-9a-f]*'", "BUILDV=''", _s, count=1)
_v = hashlib.sha1(_z.encode('utf-8')).hexdigest()[:10]
_ns = _re.sub(r"BUILDV='[0-9a-f]*'", "BUILDV='%s'" % _v, _s, count=1)
if _ns != _s:
    open(_ip, 'w', encoding='utf-8', newline='\n').write(_ns)
print("built")
