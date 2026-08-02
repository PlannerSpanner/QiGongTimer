import json, os, re

MM = open(os.path.join(OUT, 'morning-movement.html'), encoding='utf-8').read()
HEAD = MM.split('<script>')[0]
TPL  = open('app_tpl.js', encoding='utf-8').read()
ENG  = open('eng2.js', encoding='utf-8').read()

def build(out, data_file, extra, title, sub, icon, theme, colors, intro, done_msg, banner=None):
    head = HEAD
    head = head.replace('<meta name="apple-mobile-web-app-title" content="Morning Movement">',
                        f'<meta name="apple-mobile-web-app-title" content="{title}">')
    head = head.replace('<title>Morning Movement</title>', f'<title>{title}</title>')
    head = head.replace('<link rel="apple-touch-icon" href="icon-morning-movement.png">',
                        f'<link rel="apple-touch-icon" href="{icon}">')
    head = head.replace('<meta name="theme-color" content="#fdf7e9">',
                        f'<meta name="theme-color" content="{theme}">')
    head = head.replace('<h1>Morning Movement</h1>', f'<h1>{title}</h1>')
    head = head.replace('<div class="sub">Mobility · Control · Stability</div>',
                        f'<div class="sub">{sub}</div>')
    head = re.sub(r'<div class="cue" id="cue">.*?</div>\n', f'<div class="cue" id="cue">{intro}</div>\n', head, flags=re.S)
    head = head.replace('<div class="count" id="count">–/12</div>',
                        '<div class="count" id="count">–/%d</div>' % colors['n'])
    # banner CSS must be injected BEFORE the color swaps: the swap tables rewrite
    # #c8862e, so replacing the .state-done selector after them silently misses (ROSE bug)
    if banner:
        head = head.replace('<div class="num" id="mNum">',
            f'<div class="safety">{banner}</div>\n  <div class="num" id="mNum">')
        head = head.replace('.state-done .nm{color:#c8862e}',
            '.state-done .nm{color:%s}\n.safety{font-size:0.62rem;line-height:1.5;color:%s;background:%s;'
            'border:1px solid %s;border-radius:10px;padding:7px 11px;margin-bottom:9px;text-align:left}'
            '.safety strong{color:%s}' % (colors['accent'], colors['warnText'], colors['warnBg'],
                                          colors['warnBorder'], colors['warnStrong']))
    for a, b in colors['css']:
        head = head.replace(a, b)
    body = TPL
    # theme the figure: explicit INK/LIMB_L/TORSO map per theme \u2014 the head css table
    # has duplicate source hexes, so it must not be reused here (identity roles stay
    # static per app \u2014 see CLAUDE.md)
    for a, b in colors.get('fig', []):
        body = body.replace(a, b)
    body = body.replace("'\u2013/12'", "'\u2013/%d'" % colors['n'])
    body = re.sub(r"\$\('cue'\)\.innerHTML='<strong>Done\.</strong>[^;]*;",
                  "$('cue').innerHTML=%s;" % json.dumps(done_msg), body)
    body = re.sub(r"(\$\('bReset'\)\.onclick[\s\S]*?)\$\('cue'\)\.innerHTML='<strong>Morning Movement</strong>[^;]*;",
                  lambda m: m.group(1) + "$('cue').innerHTML=%s;" % json.dumps(intro), body)
    html = head + '<script>\n' + open(data_file, encoding='utf-8').read() + '\n' + ENG + '\n' + extra + '\n' + body + '</script>\n</body>\n</html>\n'
    open(out, 'w', encoding='utf-8', newline='\n').write(html)
    return html
