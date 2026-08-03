# Setup Transitions + Prone Y Raises + Ending Messages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Insert 8-second "GET SET UP" countdown segments wherever consecutive movements need a different physical setup, add a Prone Y raises movement to Morning Movement, and give three apps short punny ending messages.

**Architecture:** Movements gain a declarative `pos` tag; the shared engine (`src/app_tpl.js`) derives a `SEGS` array at load — one segment per movement, plus an inserted transition segment wherever `pos` changes. The timer walks SEGS; all movement-facing UI (dots, counts, prev/next) keeps indexing MOVES. Everything is rebuilt into the four root HTML files by `python3 src/rebuild.py`.

**Tech Stack:** Vanilla JS single-file apps, Python build script, Playwright QA (`npm run gauntlet`).

**Spec:** `docs/superpowers/specs/2026-08-02-transitions-yraises-endings-design.md`

## Global Constraints

- Edit files in `src/` only — NEVER the built HTML at repo root. Rebuild with `python3 src/rebuild.py` (from repo root; it chdirs itself).
- `npm run gauntlet` must pass before every commit. Do not push — commits stay local until Will deploys.
- Transition segments are 8 s, never multiplied by the 2× toggle, never bilateral, never counted as movements.
- `tools/geo.js` evals the built script sliced at the string `const layer=document.getElementById`; `tools/lint.js` slices at `const $=id=>document.getElementById(id);`. All new segment/timer code MUST come after the `const $=` line in `app_tpl.js` or those tools will try to eval it without a DOM.
- Windows shell; `python3` and `node` are on PATH. Run npm/node/python from repo root `C:\Users\will\movement-app`.
- Copy strings (ending messages, intro, position phrases) must be used verbatim from this plan.

---

### Task 1: Transition engine + Morning Movement tags + QA

**Files:**
- Create: `qa/trans.js`
- Modify: `src/app_tpl.js` (timer section), `src/data2.js` (add `pos` to all 12 movements), `qa/catchup.js` (SEGS-aware expectations), `package.json` (gauntlet chain)

**Interfaces:**
- Produces (later tasks + tests rely on these exact names): global `SEGS` array of `{m, mi, dur, trans?}` where `m` is the movement object (for a transition segment, the UPCOMING movement), `mi` its index in `MOVES`, `dur` seconds; global `POS_CUE` map; helpers `sdur(seg)`, `segOfMove(mi)`, `posCue(m)`. Movement data fields: `pos:'<tag>'`, optional `posCue:'...'` override.
- Transition display contract: `#mNum` text is exactly `GET SET UP`; `#mName` = upcoming movement name; `#mTarget` = position phrase; `#cue` = upcoming movement's long text.

- [ ] **Step 1: Write the failing test `qa/trans.js`**

```js
// Transition-segment QA: derived 8s gaps appear where pos changes, show a GET SET UP
// header with a preview of the next movement, never mirror, and resolve into the
// movement. Manual prev/next skip gaps. morning-flow (all standing) has zero gaps.
const path=require('path');
const {chromium}=require('playwright');
const {serve}=require('./serve');
(async()=>{
  const srv=await serve();
  const browser=await chromium.launch();
  const page=await browser.newPage();
  await page.clock.install();
  await page.goto(`http://127.0.0.1:${srv.port}/morning-movement.html`);
  let fail=false;
  const check=(name,ok)=>{console.log(`${name.padEnd(52)} ${ok?'ok':'FAIL'}`);if(!ok)fail=true;};
  const segs=await page.evaluate(()=>SEGS.map(s=>({dur:s.dur,trans:!!s.trans,mi:s.mi,n:s.m.n})));
  check('morning-movement has 5 gaps', segs.filter(s=>s.trans).length===5);
  check('gaps are 8s', segs.filter(s=>s.trans).every(s=>s.dur===8));
  // run into the first gap (after the six 30s standing movements)
  const gapAt=segs.slice(0,segs.findIndex(s=>s.trans)).reduce((a,s)=>a+s.dur,0);
  await page.click('#bMain');
  await page.clock.runFor(gapAt*1000+1500);
  const num=await page.textContent('#mNum');
  const name=await page.textContent('#mName');
  const target=await page.textContent('#mTarget');
  const tm=await page.textContent('#tm');
  check(`gap header (${num})`, num==='GET SET UP');
  check(`gap previews next movement (${name})`, name==='Cobra press-ups');
  check(`gap instruction (${target})`, target==='Lie face down.');
  check(`gap clock counts down 8s (${tm})`, /^0:0[0-7]$/.test(tm));
  check('badge hidden in gap', !((await page.getAttribute('#badge','class'))||'').includes('visible'));
  check('no mirror in gap', !(await page.getAttribute('#layer','transform')));
  const svg=await page.innerHTML('#layer');
  check('figure drawn in gap', svg.includes('<line')&&svg.includes('<circle'));
  await page.screenshot({path:path.join(__dirname,'screenshots','morning-movement-3-transition.png'),fullPage:true});
  await page.clock.runFor(8000);
  check('gap resolves into MOVEMENT 7', /MOVEMENT 7/.test(await page.textContent('#mNum')));
  // manual navigation never lands in a gap
  await page.click('#bNext');
  check('next skips gaps', /MOVEMENT 8/.test(await page.textContent('#mNum')));
  await page.click('#bPrev');
  check('prev skips gaps', /MOVEMENT 7/.test(await page.textContent('#mNum')));
  const p2=await browser.newPage();
  await p2.goto(`http://127.0.0.1:${srv.port}/morning-flow.html`);
  check('morning-flow has zero gaps', await p2.evaluate(()=>SEGS.filter(s=>s.trans).length)===0);
  await browser.close(); srv.close();
  console.log(fail?'TRANS FAIL':'TRANS PASS');
  process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node qa/trans.js`
Expected: FAIL / error — `SEGS is not defined` in the page evaluate.

- [ ] **Step 3: Tag `src/data2.js`**

Add a `pos` field to each of the 12 movement objects, immediately after the `n:"…"` field (e.g. `{n:"Deep squats",pos:'standing',cue:…`):

| movement | pos |
|---|---|
| Deep squats, Parallel squats, Knee circles, Reverse lunges, Hip hinges, Folded cat-cows | `standing` |
| Cobra press-ups | `prone` |
| Pedaling down dog | `downdog` |
| Tuck + untuck | `supine` |
| 90/90 with a fold | `seated` |
| Thread the needle, Plank hold | `quadruped` |

(Plank stays `quadruped`: dropping to forearms from all-fours needs no setup pause.)

- [ ] **Step 4: Implement segments in `src/app_tpl.js`**

4a. Immediately AFTER the line `let idx=0,timeLeft=0,running=false,started=false,tick=null,voiceOn=true,actx=null,wl=null,swAt=false;` insert:

```js
// ---------- segments: movements plus derived setup gaps ----------
// A gap is inserted wherever consecutive movements' pos tags differ. For a gap
// segment, m is the UPCOMING movement (so the figure previews it). Gaps are never
// bilateral, never multiplied by the 2x toggle, and invisible to dots/counts/nav.
const POS_CUE={standing:'Stand up.',prone:'Lie face down.',supine:'Lie on your back.',
  seated:'Sit on the floor.',quadruped:'Come to hands and knees.',downdog:'Push back into down dog.',
  sidelying:'Lie on your side.',kneeling:'Come to kneeling.',chair:'Sit on your chair.',
  ball:'Sit on your ball.',wall:'Stand at the wall.',doorway:'Stand in the doorway.'};
const TRANS_DUR=8;
const SEGS=[];
MOVES.forEach((m,i)=>{
  if(i>0&&m.pos&&MOVES[i-1].pos&&m.pos!==MOVES[i-1].pos)SEGS.push({trans:true,m,mi:i,dur:TRANS_DUR});
  SEGS.push({m,mi:i,dur:m.dur});
});
const sdur=s=>s.trans?s.dur:s.dur*dm;
const segOfMove=mi=>SEGS.findIndex(s=>!s.trans&&s.mi===mi);
const posCue=m=>m.posCue||POS_CUE[m.pos]||'Get into position.';
```

(`dm` is declared with `let` a few lines below; `sdur` is only called after start, so there is no TDZ issue.)

4b. In the `X2OPT` block, replace

```js
  const tot=Math.round(MOVES.reduce((a,m)=>a+m.dur,0)/60);
```
with
```js
  const mvT=MOVES.reduce((a,m)=>a+m.dur,0), trT=SEGS.reduce((a,s)=>a+(s.trans?s.dur:0),0);
```
and replace
```js
  $('x1b').textContent=tot+' min'; $('x2b').textContent=(tot*2)+' min';
```
with
```js
  $('x1b').textContent=Math.round((mvT+trT)/60)+' min'; $('x2b').textContent=Math.round((mvT*2+trT)/60)+' min';
```

4c. Replace the whole `paint()` function with:

```js
function paint(){
  const g=SEGS[idx], m=g.m;
  $('mNum').textContent=g.trans?'GET SET UP':'MOVEMENT '+(g.mi+1)+' OF '+MOVES.length;
  $('mName').textContent=m.n; $('mTarget').textContent=g.trans?posCue(m):m.cue;
  $('cue').innerHTML=m.long;
  $('count').textContent=(g.mi+1)+'/'+MOVES.length;
  $('badge').classList.toggle('visible',!g.trans&&!!m.bil);
  $('badge').textContent=m.orb?'REVERSES · CHANGE DIRECTION AT HALFWAY':'BOTH SIDES · SWITCH AT HALFWAY';
  $('vid').href='https://www.youtube.com/results?search_query='+m.q;
  $('bPrev').disabled=!g.trans&&g.mi<=0; $('bNext').disabled=!g.trans&&g.mi>=MOVES.length-1;
  MOVES.forEach((_,i)=>{$('d'+i).className='dot'+(i<g.mi?' done':i===g.mi?' active':'');});
  clock();
}
```

4d. In `clock()`, replace

```js
  const m=MOVES[idx];
  $('tm').textContent=Math.floor(timeLeft/60)+':'+String(timeLeft%60).padStart(2,'0');
  $('fill').style.width=(100*(1-timeLeft/(m.dur*dm))).toFixed(1)+'%';
```
with
```js
  $('tm').textContent=Math.floor(timeLeft/60)+':'+String(timeLeft%60).padStart(2,'0');
  $('fill').style.width=(100*(1-timeLeft/sdur(SEGS[idx]))).toFixed(1)+'%';
```

4e. Replace `go()` with, and add `announce()`:

```js
function go(i){
  idx=i; const g=SEGS[idx]; timeLeft=sdur(g); swAt=false;
  segEnd=Date.now()+timeLeft*1000; pausedRem=timeLeft*1000;
  paint(); announce(g);
}
// gap start: soft double chime + the position instruction; movement start keeps the
// full transition chime + name, so nothing is announced twice
function announce(g){
  if(g.trans){cSwitch();setTimeout(()=>say(posCue(g.m)),300);}
  else{cTrans();setTimeout(()=>say(g.m.n+(g.m.bil&&!g.m.orb?'. Start with your right side.':'')),420);}
}
```

4f. In `sync()`:
- replace `if(idx>=MOVES.length-1){finish();return;}` with `if(idx>=SEGS.length-1){finish();return;}`
- replace `idx++; const m=MOVES[idx]; segEnd+=m.dur*dm*1000; swAt=false; jumped=true;` with `idx++; segEnd+=sdur(SEGS[idx])*1000; swAt=false; jumped=true;`
- replace the `if(jumped){...}` block with:
```js
  if(jumped){paint(); announce(SEGS[idx]);}
```
- replace
```js
    const m=MOVES[idx];
    if(m.bil&&!swAt&&timeLeft<=Math.floor(m.dur*dm/2)){swAt=true;applyMirror(true);cSwitch();setTimeout(()=>say(m.orb?'Change direction':'Switch sides'),300);}
```
with
```js
    const g=SEGS[idx], m=g.m;
    if(!g.trans&&m.bil&&!swAt&&timeLeft<=Math.floor(m.dur*dm/2)){swAt=true;applyMirror(true);cSwitch();setTimeout(()=>say(m.orb?'Change direction':'Switch sides'),300);}
```

4g. Replace the prev/next handlers with:

```js
$('bPrev').onclick=()=>{const t=SEGS[idx].mi-1;if(t>=0){started=true;go(segOfMove(t));}};
$('bNext').onclick=()=>{const g=SEGS[idx],t=g.trans?g.mi:g.mi+1;if(t<=MOVES.length-1){started=true;go(segOfMove(t));}};
```

4h. In the animation loop, replace `const m=MOVES[idx];` with `const m=SEGS[idx].m;` and guard breath tones against gaps: replace `if(running&&m.br&&actx){` with `if(running&&m.br&&!SEGS[idx].trans&&actx){`.

(`bMain`'s `go(0)`, `finish()`, `bReset`, and the trailing `timeLeft=MOVES[0].dur;` are all still correct: segment 0 is always movement 0 — a gap can never precede the first movement.)

- [ ] **Step 5: Make `qa/catchup.js` SEGS-aware**

Replace `const durs=await page.evaluate(()=>MOVES.map(m=>m.dur));` with:

```js
    const segs=await page.evaluate(()=>SEGS.map(s=>({dur:s.dur,trans:!!s.trans,mi:s.mi})));
```

Replace the whole expected-position block (from `// expected position at elapsed wall-clock time` through the `ok=...` assignments) with:

```js
    // expected position at elapsed wall-clock time, walking the segment timeline
    const elapsed=(RUN_MS+GAP_MS+TICK_MS)/1000;
    let acc=0,seg=null;
    for(const s of segs){if(elapsed<acc+s.dur){seg=s;break;}acc+=s.dur;}
    let ok,expl;
    if(!seg){ok=after.num==='COMPLETE';expl='COMPLETE';}
    else{
      const expRem=acc+seg.dur-elapsed;
      const [mm,ss]=after.tm.split(':').map(Number);
      const tOk=Math.abs(mm*60+ss-expRem)<=2;
      if(seg.trans){ok=after.num==='GET SET UP'&&tOk;expl=`GET SET UP, ~${Math.round(expRem)}s left`;}
      else{const got=after.num.match(/MOVEMENT (\d+)/);
        ok=got&&Number(got[1])===seg.mi+1&&tOk;expl=`MOVEMENT ${seg.mi+1}, ~${Math.round(expRem)}s left`;}
    }
    console.log(`${app.padEnd(20)} ${before} --${GAP_MS/1000}s background--> ${after.num} @ ${after.tm}`
      +`  (expected ${expl}) ${ok?'ok':'FAIL'}`);
```

(The old `console.log` that referenced `durs`/`exp`/`done` is replaced by the one above; delete the old one.)

- [ ] **Step 6: Add trans.js to the gauntlet**

In `package.json`, change the `gauntlet` script to run trans after catchup:

```
node tools/smoke.js && node tools/lint.js && node tools/geo.js && node qa/shots.js && node qa/catchup.js && node qa/trans.js && node qa/breath.js && node qa/x2.js && node qa/fresh.js
```

- [ ] **Step 7: Rebuild and verify**

Run: `python3 src/rebuild.py` then `node qa/trans.js` — expected: TRANS PASS.
Then `node qa/catchup.js` — expected: CATCHUP PASS (all four apps; morning-flow has no gaps and must still pass).
Note: `qa/x2.js` will FAIL at this point only if Birth Prep data were tagged — it is not yet, so it must still pass. Run `npm run gauntlet` — expected: all PASS. Eyeball `qa/screenshots/morning-movement-3-transition.png`: GET SET UP header, cobra figure preview, "Lie face down." line.

- [ ] **Step 8: Commit**

```bash
git add src/app_tpl.js src/data2.js qa/trans.js qa/catchup.js package.json morning-flow.html morning-movement.html prenatal-stretch.html prenatal-movement.html
git commit -m "Setup transitions: derived 8s GET SET UP gaps on position changes

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Position tags for the other three apps + x2 rework

**Files:**
- Modify: `src/d_flow.js`, `src/d_stretch.js`, `src/d_birth.js` (add `pos`/`posCue`), `qa/x2.js` (SEGS-aware), `qa/trans.js` (gap-count checks)

**Interfaces:**
- Consumes: `SEGS`, `pos`, `posCue` from Task 1.
- Produces: tagged data giving morning-flow 0 gaps, prenatal-stretch 6 gaps, prenatal-movement (Birth Prep) 10 gaps.

- [ ] **Step 1: Extend `qa/trans.js` with failing gap-count checks**

After the `morning-flow has zero gaps` check, add:

```js
  const gapCount=async app=>{const p=await browser.newPage();
    await p.goto(`http://127.0.0.1:${srv.port}/${app}.html`);
    const n=await p.evaluate(()=>SEGS.filter(s=>s.trans).length);await p.close();return n;};
  check('prenatal-stretch has 6 gaps', await gapCount('prenatal-stretch')===6);
  check('prenatal-movement has 10 gaps', await gapCount('prenatal-movement')===10);
```

(These go BEFORE `await browser.close()`.)

- [ ] **Step 2: Run to verify the new checks fail**

Run: `node qa/trans.js`
Expected: the two new checks FAIL (0 gaps each — untagged data), everything else ok.

- [ ] **Step 3: Tag the three data files**

`src/d_flow.js` — all 10 movements get `pos:'standing'`.

`src/d_stretch.js` (6 gaps — before 5, 6, 7, 8, 9, 10):

| movement | pos |
|---|---|
| Seated breathing, Seated cat-cow, Seated side reach, Seated figure-4 | `chair` |
| Supported butterfly | `seated` |
| Wide-knee child's pose | `kneeling` |
| Hands-and-knees rocking | `quadruped` |
| Kneeling hip flexor stretch | `kneeling` |
| Standing calf stretch | `wall` |
| Doorway chest opener | `doorway` |

`src/d_birth.js` (10 gaps — everywhere except 6→7):

| movement | pos | posCue |
|---|---|---|
| Breath and pelvic floor release | `chair` | |
| Hands-and-knees pelvic rocking | `quadruped` | |
| Birth ball hip circles | `ball` | |
| Supported deep squat | `standing` | `'Stand up and hold your chair.'` |
| Side-lying clamshells | `sidelying` | |
| Windshield wipers | `seated` | |
| Supported butterfly with rock | `seated` | |
| Kneeling lunge with support | `kneeling` | |
| Standing wall pelvic tilts | `wall` | |
| Pelvic floor coordination | `chair` | |
| Wide-knee child's pose | `kneeling` | |
| Left side-lying rest | `sidelying` | `'Lie on your left side.'` |

Add `pos` right after `n:"…"`; add `posCue` right after `pos` where listed.

- [ ] **Step 4: Rework `qa/x2.js` for segments**

Replace `const durs=await page.evaluate(()=>MOVES.map(m=>m.dur));` with:

```js
  const segs=await page.evaluate(()=>SEGS.map(s=>({dur:s.dur,trans:!!s.trans,mi:s.mi})));
  const durs=segs.filter(s=>!s.trans).map(s=>s.dur);
```

After the `toggle rendered` check, add label checks (labels are computed from SEGS now):

```js
  const mv=durs.reduce((a,b)=>a+b,0), tr=segs.filter(s=>s.trans).reduce((a,s)=>a+s.dur,0);
  check('x1 label includes gap time', await page.textContent('#x1b')===Math.round((mv+tr)/60)+' min');
  check('x2 label doubles movements only', await page.textContent('#x2b')===Math.round((mv*2+tr)/60)+' min');
```

Replace the catch-up section (from `// background catch-up respects doubled durations` through the `catch-up lands in movement 2` check) with:

```js
  // background catch-up respects doubled durations AND undoubled gaps: jump to a
  // wall-clock time that lands inside movement 2 only if the gap stayed 8s
  await page.clock.fastForward((durs[0]*2+9)*1000);
  await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{value:'visible',configurable:true});
    document.dispatchEvent(new Event('visibilitychange'));});
  await page.clock.runFor(400);
  const elapsed=2.4+durs[0]*2+9+0.4;               // start+2.4s, then the jump
  let acc=0,cur=null;
  for(const s of segs){const d=s.trans?s.dur:s.dur*2;if(elapsed<acc+d){cur={...s,end:acc+d};break;}acc+=d;}
  const num=await page.textContent('#mNum');
  const tmc=await page.textContent('#tm');
  check(`catch-up lands in movement 2 (${num})`, !cur.trans&&cur.mi===1&&/MOVEMENT 2/.test(num));
  check(`gap not doubled (@ ${tmc})`, Math.abs(mmss(tmc)-(cur.end-elapsed))<=2);
```

- [ ] **Step 5: Rebuild and verify**

Run: `python3 src/rebuild.py` then `node qa/trans.js` (all ok, incl. 6/10 gap counts) and `node qa/x2.js` (X2 PASS — labels `14 min`/`27 min`). Then `npm run gauntlet` — all PASS. Eyeball `qa/screenshots/` shots for the two prenatal apps (unchanged idle/running looks).

- [ ] **Step 6: Commit**

```bash
git add src/d_flow.js src/d_stretch.js src/d_birth.js qa/x2.js qa/trans.js morning-flow.html morning-movement.html prenatal-stretch.html prenatal-movement.html
git commit -m "Tag flow/stretch/birth movements with positions; x2 test covers undoubled gaps

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Prone Y raises (Morning Movement, movement 8 of 13)

**Files:**
- Modify: `src/data2.js` (insert movement), `src/mm_extra.js` (cue entry), `src/rebuild.py` (A12 `n:12→13`, intro copy), `docs/movement-reference.md` (new section + renumber + header)

**Interfaces:**
- Consumes: `pos:'prone'` tagging (same tag as cobra ⇒ no gap between them — trans.js's "5 gaps" and "next skips gaps → MOVEMENT 8" checks keep passing, with movement 8 now Y raises).
- Produces: movement named exactly `Prone Y raises` (mm_extra key must match).

- [ ] **Step 1: Insert the movement in `src/data2.js`**

Between `Cobra press-ups` and `Pedaling down dog`, insert (starting keyframes — Step 4 iterates them visually):

```js
{n:"Prone Y raises",pos:'prone',cue:"Thumbs up, float the arms — shoulder blades down and back",dur:30,bil:false,cyc:3.0,cam:24,
 A:{p:[0,90.5,4],yaw:18,tw:0,s:[70,62],hf:8,ikL:{w:[-13,92.6,30]},ikR:{w:[13,92.6,30]},
    aL:[0,0,0,0],aR:[0,0,0,0],lL:[-92,-6,-88,-5],lR:[-96,6,-92,5]},
 B:{p:[0,90.5,4],yaw:18,tw:0,s:[62,50],hf:2,ikL:{w:[-13,87.5,31]},ikR:{w:[13,87.5,31]},
    aL:[0,0,0,0],aR:[0,0,0,0],lL:[-92,-6,-88,-5],lR:[-96,6,-92,5]}},
```

- [ ] **Step 2: Add the cue entry in `src/mm_extra.js`**

After the `"Cobra press-ups"` entry:

```js
"Prone Y raises":["<strong>Form:</strong> Face down, arms overhead at about 30–45° out from the midline — the Y — thumbs up. Draw the shoulder blades down and back and float the arms an inch or two; neck neutral, gaze down. Lower with control. <strong>Shoulder note:</strong> pure lower-trap work — the balancing side of the right AC joint, with zero load on it.","prone+y+raise+lower+trap+exercise"],
```

- [ ] **Step 3: Update `src/rebuild.py`**

- `A12=dict(n=12,...)` → `A12=dict(n=13,...)`
- Morning Movement intro (the 4th positional arg of the second `build(...)` call) becomes:

```
'<strong>Morning Movement</strong> runs about 10 minutes: standing mobility, then floor work, then core. Short setup pauses appear before position changes. Two-sided movements chime at the halfway point. No impact — safe for the right peroneal tendon.',
```

(Leave the done message for Task 4.)

- [ ] **Step 4: Rebuild and iterate the pose until it reads as a Y raise**

Run: `python3 src/rebuild.py && node tools/smoke.js && node tools/geo.js && node tools/lint.js`
Then LOOK at it (per CLAUDE.md, numeric checks miss gestalt errors):

```
python3 tools/ascii.py morning-movement "Prone Y raises" 0,3
node qa/shots.js
```

Also grab a running frame of the movement itself: temporarily `node tools/dump.js && python3 tools/strips.py` if needed. Iterate the keyframes until: figure clearly face-down (same read as cobra), arms straightish overhead in a visible Y (hands wider than shoulders, beyond the head), frame B shows the hands/chest floating slightly with pelvis and legs unmoved. Anchors from `docs/movement-reference.md` (Step 5) are the acceptance criteria. Adjust `cam` if the lift reads better from a different yaw. Keep geo clean: hands must stay above the floor plane (y < 93 with margin ⇒ no through-floor issues) and feet must not drift (legs identical in A/B — Y raises must NOT be added to the MOVING sets in `tools/geo.js`/`tools/drift.js`).

- [ ] **Step 5: Update `docs/movement-reference.md`**

- Header: `# Morning Movement — 12 movements: standing mobility → floor → core, no impact` → `# Morning Movement — 13 movements: standing mobility → floor → core, no impact. 8s setup gaps are auto-inserted between position changes (pos tags).`
- Insert after the Cobra section, and renumber old 8–12 to 9–13:

```markdown
## 8. Prone Y raises — 30s, 3.0s cycle, symmetric
- **Setup:** face down (straight after cobra — no position change), arms overhead at
  ~30–45° out from the midline, thumbs up.
- **Execution:** draw the shoulder blades down and back and float the arms an inch or
  two off the floor; lower with control. Chest may barely graze up; neck neutral,
  gaze down.
- **Anchors (research-anchored):** lift comes from the **lower traps**, not low-back
  extension; **no shrugging** — shoulders stay away from the ears; thumbs-up
  rotation throughout. Friendly to the right AC joint — trains the lower-trap side
  of that balance.
- **Faults:** shrugging into the ears; cranking the neck up; ballistic swinging;
  arching the low back to fake height.
- **Figure:** prone with Y-angled arms visibly floating and lowering; pelvis and legs
  quiet throughout.
```

- [ ] **Step 6: Full gauntlet**

Run: `npm run gauntlet` — all PASS. catchup/trans/x2 need no edits (they compute from SEGS; movement numbering shifts are absorbed by `mi`). Eyeball `qa/screenshots/morning-movement-*.png` once more.

- [ ] **Step 7: Commit**

```bash
git add src/data2.js src/mm_extra.js src/rebuild.py docs/movement-reference.md morning-flow.html morning-movement.html prenatal-stretch.html prenatal-movement.html
git commit -m "Add prone Y raises as Morning Movement 8 of 13

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Ending messages + launcher times

**Files:**
- Modify: `src/rebuild.py` (three `done_msg` args), `index.html` (time labels)

**Interfaces:**
- Consumes: session lengths incl. gaps — morning-movement 610 s, prenatal-stretch 618 s, Birth Prep 860 s / 1640 s doubled.

- [ ] **Step 1: Replace the three `done_msg` arguments in `src/rebuild.py`** (Morning Flow's stays):

Morning Movement:
```
'<strong>Done.</strong> Needle threaded, cobra charmed, plank held. Prone to greatness.'
```
Prenatal Stretch:
```
'<strong>Done.</strong> Stretch goals: met. Butterflies earned. Sip some water.'
```
Birth Prep:
```
'<strong>Done.</strong> Clamshells opened, hips rocked and rolled. You\u2019re on the ball.'
```
(Use a real apostrophe `'You're...'` inside double-quoted Python strings, or keep single quotes and escape — match the file's existing quoting style.)

- [ ] **Step 2: Update `index.html` launcher time labels**

- Morning Movement: `9 min` → `10 min`
- Birth Prep: `13–26 min` → `14–27 min`
- Morning Flow (`8 min`) and Prenatal Stretch (`10 min`, now 10:18) stay.

- [ ] **Step 3: Rebuild (also restamps index.html) and verify**

Run: `python3 src/rebuild.py` then `npm run gauntlet` — all PASS. Confirm the new messages landed: `grep -c "Prone to greatness" morning-movement.html` → 2 (finish() + nothing else? one in finish; count ≥1), and visually check `qa/screenshots/index.png` for the new times.

- [ ] **Step 4: Commit**

```bash
git add src/rebuild.py index.html morning-flow.html morning-movement.html prenatal-stretch.html prenatal-movement.html
git commit -m "Punny ending messages; launcher times include setup gaps

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Verification (after all tasks)

- `npm run gauntlet` fully green.
- Screenshots reviewed: transition frame, Y-raise frames, index times.
- Spec cross-check: 8s gaps on every position change in all four apps (0/5/6/10), gaps excluded from 2× and from movement UI, voice says position phrase in gaps, Y raises = movement 8 of 13 @30s, three new ending messages verbatim, movement-reference.md updated.
