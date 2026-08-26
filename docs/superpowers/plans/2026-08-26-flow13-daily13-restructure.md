# Flow 13 / Daily 13 Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> (This session: executed inline per the working-style agreement in CLAUDE.md.)

**Goal:** Retire the Morning Movement app (archiving all data), rebuild Morning Flow as a 13-movement TR_ALL app ending on the ground, and rename Daily 10 to Daily 13 with 13 movements — timing option (b): every kept movement keeps its duration, transitions are additive.

**Architecture:** All movement data moves between the per-app data files (`d_flow.js`, `d_daily.js`) verbatim — no pose re-authoring. Retired movements land in a new `src/d_retired.js` archive (excluded from build) plus a "Retired" section in docs/movement-reference.md. `build.py` stops bootstrapping its template from the built morning-movement.html and reads a frozen snapshot `src/app_head.html` instead. `daily-10.html` becomes a BUILDV-stamped redirect stub to `daily-13.html`.

**Tech Stack:** vanilla JS single-file HTML apps, Python build (`src/rebuild.py` + `build.py`), Node/Playwright QA gauntlet.

**Spec:** Will's two messages of 2026-08-26 (this conversation). Timing decision pre-made: option (b).

## Global Constraints

- CRITICAL: no movement data deleted anywhere — pose data, cues, props of retired movements all preserved in-repo (`src/d_retired.js`, `src/data2.js` + `src/mm_extra.js` kept intact, docs "Retired — available for future versions").
- Moved movements keep the exact durations they had; staying movements keep theirs. Transitions additive: 10s default, 15s position/equipment change, explicit 5s before Folded cat-cows in Flow. Existing authored `tdur` values in d_daily.js are kept.
- TR_ALL inserts a gap before every movement EXCEPT the first (`if(i>0)` in app_tpl.js:214), sized `m.tdur||10`.
- Displayed durations and launcher labels updated to the real totals (accuracy over round numbers).
- Full gauntlet + screenshots before pushing; do NOT push until Will approves the screenshots.
- One home-screen app: shared icon-app.png + web-app title "Movement" — unchanged.

## Timing (final numbers, option b)

**Morning Flow — 13 movements, TR_ALL enabled**

| # | Movement | Work | Gap before | Source |
|---|---|---|---|---|
| 1 | Bouncing in place | 50 | — (first) | flow |
| 2 | Arm sweeps with knee dip | 50 | 10 | flow |
| 3 | Punching rotations | 50 | 10 | flow |
| 4 | Dynamic lateral reaches | 50 | 10 | flow |
| 5 | Cross-body knee drives | 50 | 10 | flow |
| 6 | Chest opener swings | 50 | 10 | flow |
| 7 | Hip circles | 60 | 10 | flow |
| 8 | Bent rotation sweeps | 50 | 10 | flow |
| 9 | Folded cat-cows | 30 | **5** (explicit "get on the ground") | data2 |
| 10 | Cobra press-ups | 60 | 15 (→ prone) | data2 |
| 11 | Pedaling down dog | 60 | 15 (→ down dog) | data2 |
| 12 | Thread the needle | 60 | 15 (→ quadruped) | data2 |
| 13 | 90/90 with a fold | 60 | 15 (→ seated Z-sit) | data2 |

Work 680s + gaps 135s = **815s (13:35)** → launcher "14 min" (Math.round). Retired from Flow: Rotations with shoulder slaps, Lateral weight shifts.

**Daily 13 — 13 movements** (renames per Will's list: Farmer hold → "Dumbbell farmer hold", Posture reset → "Standing posture reset")

| # | Movement | Work | Gap before | tdur status |
|---|---|---|---|---|
| 1 | Deep squats | 30 | — (first) | new, no tdur |
| 2 | Reverse lunges | 30 | 10 | new tdur:10 |
| 3 | Dead bug | 45 | 15 (standing → floor block) | new tdur:15 |
| 4 | Glute bridge | 45 | 10 | existing |
| 5 | Side-lying clamshell | 60 | 10 | existing |
| 6 | Bird dog | 50 | 15 | existing |
| 7 | Prone Y-T-W raise | 45 | 15 | existing |
| 8 | Side plank | 40 | 10 | existing (prone→side roll, clamshell precedent) |
| 9 | Plank hold | 60 | 15 (sidelying → plank; bird-dog precedent) | new tdur:15 |
| 10 | Dumbbell bent-over row | 45 | 15 (floor → standing + dumbbells) | existing |
| 11 | Bench dips | 40 | 15 | existing |
| 12 | Dumbbell farmer hold | 35 | 15 | existing |
| 13 | Standing posture reset | 30 | 15 | existing |

Work 555s + gaps 160s = **715s (11:55)** → launcher "12 min". Retired: Wall slide.

Retired from Morning Movement entirely (never redistributed): Parallel squats, Knee circles, Hip hinges, Prone Y raises, Tuck + untuck.

---

### Task 1: Freeze the build template head

**Files:** Create `src/app_head.html` (generated), Modify `src/build.py:3-4` + comment at 24-28.

- [ ] Generate: `python -c "open('src/app_head.html','w',...).write(open('morning-movement.html',...).read().split('<script>')[0])"` (from repo root, utf-8, newline='\n').
- [ ] `build.py`: `HEAD = open('app_head.html', encoding='utf-8').read()` with a comment explaining it is the frozen head of the retired Morning Movement build (amber baseline; build() re-targets every value by regex/replace).
- [ ] Verify `python3 src/rebuild.py` still builds byte-identical output BEFORE any other change (it reads HEAD before building, so output must not change).

### Task 2: Archive — d_retired.js + data2/mm_extra headers

**Files:** Create `src/d_retired.js`; Modify `src/data2.js:1` and `src/mm_extra.js:1` (header comments only, data untouched).

- [ ] `d_retired.js`: `const RETIRED=[...]` with the 8 retired movement objects copied verbatim (Rotations with shoulder slaps + Lateral weight shifts from d_flow.js; Parallel squats, Knee circles, Hip hinges, Prone Y raises, Tuck + untuck from data2.js; Wall slide with prop/tdur/setup from d_daily.js) and `const RETIRED_EXTRA={...}` with their cue-text entries copied verbatim from x_flow.js / mm_extra.js / x_daily.js. Header comment: not built, provenance, retirement date, "may come back".
- [ ] data2.js + mm_extra.js: prepend comment — app retired 2026-08-26, file kept intact as archive, where each movement went.

### Task 3: Morning Flow data (d_flow.js + x_flow.js)

- [ ] d_flow.js: remove the two retired movements; append the five data2 movements verbatim (pose/dur/cyc/pin/cam untouched); add `setup:` to all 13 and `tdur:5` (Folded cat-cows) / `tdur:15` (Cobra, Down dog, Thread the needle, 90/90). Setup lines are short spoken scripts ("Next: <name>. <setup>"); the cat-cows one is the authored "get on the ground" line.
- [ ] x_flow.js: move the 2 retired EXTRA entries out (→ d_retired.js), add the 5 entries verbatim from mm_extra.js.

### Task 4: Daily 13 data (d_daily.js + x_daily.js)

- [ ] d_daily.js: reorder to the table above; insert Deep squats / Reverse lunges / Plank hold verbatim from data2.js with new setup lines (+ tdur per table); Dead bug gains `tdur:15` (now follows a standing block; its setup line already reads correctly from standing); Side plank setup reworded to "Roll onto your side…" (predecessor is now prone Y-T-W); Standing posture reset setup reworded to "Set the dumbbells down…"; rename the two movements; remove Wall slide; update header comment (555+160=715).
- [ ] x_daily.js: add the 3 entries verbatim from mm_extra.js; remove Wall slide entry; rename the two keys.

### Task 5: Build config (rebuild.py) + launcher + redirect

- [ ] rebuild.py: BLUE n:10→13; VIOLET n:11→13; delete A12 + the morning-movement build call (comment noting retirement + archive location); Flow call gains `trall=True` and new intro (≈13½ min, set-up countdowns, ground finish); Daily call → `daily-13.html`, title 'Daily 13', intro "runs about 12 minutes… Start standing, feet shoulder width."; add daily-10.html redirect-stub writer (meta refresh + `location.replace('daily-13.html')` + deterministic `BUILDV` sha1 stamp so old cached pages' freshCheck regex matches and reloads).
- [ ] index.html: remove Morning Movement card; Flow "8 min"→"14 min" + desc mentions the ground finish; Daily card href/name/time → daily-13.html / Daily 13 / 12 min (keep the thumb SVG).
- [ ] `git rm morning-movement.html` (after Task 1's snapshot). Delete stale built daily-10.html content via the redirect writer.

### Task 6: QA + tools retarget

- [ ] App lists (drop morning-movement, daily-10→daily-13): tools/smoke.js:57, tools/lint.js:3, tools/geo.js:4, tools/dump.js:4, tools/strips.py BG, tools/drift.js:2 APPS, qa/catchup.js:9, qa/shots.js:6.
- [ ] qa/daily.js: read daily-13.html; dumbbell-in-front list → 'Dumbbell farmer hold'; timing check `work+gaps===715` ("11:55"); header comment.
- [ ] qa/dailyshots.js: daily-13.html + screenshot prefix daily-13; mi===3 transition comment now Glute bridge.
- [ ] qa/trans.js: legacy-gap block retargets prenatal-stretch (6×8s gaps; first gap at 225s previews "Supported butterfly", instruction "Sit on the floor.", resolves into MOVEMENT 5; nav tests around that gap). New TR_ALL block for morning-flow: 12 gaps, `10,10,10,10,10,10,10,5,15,15,15,15`, total 815. Daily-13 block: 12 gaps, `10,15,10,10,15,15,10,15,15,15,15,15`, total 715, first gap (after 30s) previews "Reverse lunges".
- [ ] qa/x2.js:45 control app → morning-flow.
- [ ] Verify d_stretch.js movement 5 name/pos before hardcoding trans.js expectations.

### Task 7: Docs + CLAUDE.md

- [ ] docs/movement-reference.md: Flow section → 13 movements with transitions paragraph (680+135=815s), entries 9-13 moved verbatim from the Morning Movement section; Morning Movement section removed; Daily section → "Daily 13 … ~12 min" (555+160=715s), reordered, 3 entries moved in, 2 renamed; new final section "# Retired — available for future versions" with the 8 full entries + archive pointers.
- [ ] CLAUDE.md: app list, Daily 13 rename + redirect, Flow TR_ALL, template-head change (build.py no longer reads the built morning-movement.html), gauntlet description (715s), archive locations.

### Task 8: Build, gauntlet, screenshots, present

- [ ] `python3 src/rebuild.py` → daily-13.html, morning-flow.html rebuilt; daily-10.html redirect; index restamped.
- [ ] `npm run gauntlet` — all PASS (fix and re-run until green).
- [ ] Present timing summary + screenshots to Will (artifact gallery of qa/screenshots). Commit locally ("Flow 13 + Daily 13 restructure; Morning Movement retired to archive"). **No push until approval.**
