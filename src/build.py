import hashlib, json, os, re

MM = open(os.path.join(OUT, 'morning-movement.html'), encoding='utf-8').read()
HEAD = MM.split('<script>')[0]
TPL  = open('app_tpl.js', encoding='utf-8').read()
ENG  = open('eng2.js', encoding='utf-8').read()

def build(out, data_file, extra, title, sub, icon, theme, colors, intro, done_msg, banner=None, x2=False, trall=False):
    head = HEAD
    # one home-screen app: every page shares the same icon and web-app title, so the
    # identity is identical no matter which page gets saved. Regex (not literal) targets
    # so the current template values can never break the next rebuild.
    head = re.sub(r'<meta name="apple-mobile-web-app-title" content="[^"]*">',
                  '<meta name="apple-mobile-web-app-title" content="Movement">', head)
    head = head.replace('<title>Morning Movement</title>', f'<title>{title}</title>')
    head = re.sub(r'<link rel="apple-touch-icon" href="[^"]*">',
                  f'<link rel="apple-touch-icon" href="{icon}">', head)
    head = head.replace('<meta name="theme-color" content="#fdf7e9">',
                        f'<meta name="theme-color" content="{theme}">')
    head = head.replace('<h1>Morning Movement</h1>', f'<h1>{title}</h1>')
    head = head.replace('<div class="sub">Mobility · Control · Stability</div>',
                        f'<div class="sub">{sub}</div>')
    head = re.sub(r'<div class="cue" id="cue">.*?</div>\n', f'<div class="cue" id="cue">{intro}</div>\n', head, flags=re.S)
    # regex (not a literal-value replace): HEAD is read from the already-built
    # morning-movement.html on disk (see top of file), so whatever count is currently
    # baked into it must be matched dynamically, not against a hardcoded old value —
    # otherwise every app's badge silently keeps a stale count once the template's own
    # baked value drifts from the hardcoded literal.
    head = re.sub(r'<div class="count" id="count">–/\d+</div>',
                  '<div class="count" id="count">–/%d</div>' % colors['n'], head)
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
    if x2:
        body = body.replace('const X2OPT=false;', 'const X2OPT=true;')
    # authored-transition mode (Daily 10): gaps before every movement + prop-aware
    # camera fit. Two consts flip together — the app that wants one wants both.
    if trall:
        body = body.replace('const TR_ALL=false;', 'const TR_ALL=true;')
        body = body.replace('const PROPFIT=false;', 'const PROPFIT=true;')
    # app_tpl.js contains the LITERAL 6-character JS escape text \u2013 (not a real
    # en-dash character), so match that literal text directly rather than a Python
    # string with a decoded unicode escape (which would never match the source bytes).
    body = re.sub(r"'\\u2013/\d+'", "'\\\\u2013/%d'" % colors['n'], body)
    body = re.sub(r"\$\('cue'\)\.innerHTML='<strong>Done\.</strong>[^;]*;",
                  "$('cue').innerHTML=%s;" % json.dumps(done_msg, ensure_ascii=False), body)
    body = re.sub(r"(\$\('bReset'\)\.onclick[\s\S]*?)\$\('cue'\)\.innerHTML='<strong>Morning Movement</strong>[^;]*;",
                  lambda m: m.group(1) + "$('cue').innerHTML=%s;" % json.dumps(intro, ensure_ascii=False), body)
    html = head + '<script>\n' + open(data_file, encoding='utf-8').read() + '\n' + ENG + '\n' + extra + '\n' + body + '</script>\n</body>\n</html>\n'
    # build stamp for the launch-time freshness check (deterministic: hash of the
    # unstamped content, so unchanged sources still rebuild byte-identical)
    ver = hashlib.sha1(html.encode('utf-8')).hexdigest()[:10]
    html = html.replace('<script>\n', "<script>\nconst BUILDV='%s';\n" % ver, 1)
    open(out, 'w', encoding='utf-8', newline='\n').write(html)
    return html
