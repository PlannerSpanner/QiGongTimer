# Movement App — stick-figure exercise timers

Four single-file HTML exercise timer apps with animated 3D stick-figure demonstrations,
deployed to GitHub Pages at https://plannerspanner.github.io/MovementApp/
(repo `PlannerSpanner/MovementApp` — username lowercase in URL, repo capitalized).
Built for iPhone Safari (wake lock + Add to Home Screen require Safari, not Chrome).

Apps: `morning-flow` (qi gong warmup), `morning-movement` (mobility/strength),
`prenatal-stretch` (Prenatal Stretch, 10 moves), `prenatal-movement` (Birth Prep, 11 moves).
Also `hip-activation.html` — older layout, no figures, timer already timestamp-patched. Leave unless asked.

## Build

    python3 src/rebuild.py     # stamps all four apps from src/ into the output dir

Everything is inlined: engine + template + data + cues → one self-contained HTML per app.
Edit sources, never the built HTML. `rebuild.py` holds per-app themes (hex swap tables),
intros, and movement counts. Adjust its output path for this repo (was /mnt/user-data/outputs).

## Source map (src/)

- `eng2.js` — 3D skeleton solver. Pose schema: `{p:[x,y,z], yaw, tw, sl, s:[s0,s1], hf,
  aL/aR:[flex,abd,flex,abd] (absolute angles), lL/lR (legs, same), ikL/ikR (arm IK: {k:'jointName'}
  or {w:[x,y,z]}), ikFL/ikFR (foot IK world targets), swL/swR (knee swivel deg about hip→ankle axis)}`.
  Coordinates: y DOWN, floor at y=93, canvas 0–100. Limb segments 19 (leg) / 13 (arm/spine),
  foot 6.4. `sl` = lateral spine bend. Feet: sagittal-plane perpendicular + floor clamp
  (flat when planted, trails shin when kneeling).
- `app_tpl.js` — shared app body: renderer, timers, audio. Key facts:
  - Timer is wall-clock anchored (`segEnd`); survives backgrounding, catches up on return.
  - The timer walks `SEGS`, derived from MOVES at load: an 8s `{trans:true}` "GET SET UP"
    segment is inserted wherever consecutive movements' `pos` tags differ (a gap's `m` is
    the UPCOMING movement, so the figure previews it). Voice speaks the position phrase
    (`POS_CUE` map; per-movement `posCue` overrides). Gaps are never bilateral, never 2×-
    multiplied (`sdur`), and invisible to dots/counts/prev-next (`segOfMove`). qa/trans.js
    guards all of this.
  - Movements: `{n, pos, posCue?, cue, dur, bil, cyc, pin, belly, cam, prop, orb, A, B, M?}`.
    `M` = optional mid-keyframe (path A→M→B→M→A). `pin:'LR'` nails feet at their frame-A spots.
    `orb` = orbital pose (hip circles). `cam` = per-movement camera yaw (default 40).
    `prop` = array of `{l:[[xyz],[xyz]]}` lines / `{c:[[xyz],r]}` circles, drawn behind the figure.
  - Colors are STATIC identity roles: INK (right limbs, head, neck), LIMB_L (left limbs, lighter),
    TORSO (quad + belly). Hues are themed per app by build.py's swap tables (blue flow, rose
    prenatal-stretch, amber elsewhere) but roles never change within an app. No depth-based
    color changes — that was removed deliberately.
  - Belly: polygon that morphs full-circle (facing viewer) → half-disc flat on the trunk (profile),
    driven by the projected foreshortening of the trunk-front vector. Never re-add a hard mode switch;
    it pops mid-animation.
  - Bilateral moves mirror the figure at the halfway "switch sides" chime (layer transform).
  - Depth sorting = painter's algorithm on projected d (larger d = nearer = drawn later).
- `data2.js` / `d_flow.js` / `d_stretch.js` / `d_birth.js` — pose data per app.
- `mm_extra.js` / `x_*.js` — expandable cue text per movement (keys = movement names).

## Non-negotiable QA gauntlet (run before every commit)

    npm run gauntlet   # smoke + lint + geo + Playwright: shots (incl. index), catchup,
                       # breath tones, 2x toggle, auto-update freshness
    node tools/dump.js && python3 tools/strips.py   # fallback PIL contact sheets (needs Pillow)
    python3 tools/ascii.py <app> "<movement>" 0,3    # text-mode pose render

Hard-won lessons encoded in these tools:
- Parse-only checks miss runtime ReferenceErrors → smoke.js is mandatory.
- Numeric invariants miss gestalt errors (feet never drawn, "alien" legs, belly-as-hips)
  → always LOOK at renders. In Claude Code, replace/augment strips with real Playwright
  screenshots of the served pages.
- Screen-space matters more than world-space for readability (clamshell swivel was tuned
  against projected knee motion, not world lift).
- Left/right swivel cones are asymmetric — never mirror a swivel by sign-flip; re-fit numerically.
- Movement fidelity is research-anchored: squats hit ankle 90°→65° with tibia∥torso,
  lunge front shin vertical + back knee hover, clamshell heels welded, 90/90 is a Z-sit, etc.
  The canonical form source for ALL movements (setup, sequence, direction, side protocol,
  anchors, faults, what the figure must show) is docs/movement-reference.md — check pose or
  cue edits against it first, keep it updated, then re-run the gauntlet.
- The global 13° camera pitch flattens any floor-plane spread to ~22% of its true angle on
  screen (learned fitting Prone Y raises: a wide Y reads as a shallow fork; the camera that
  shows the full Y loses the prone read). Pick per-movement `cam` for what must READ, not
  for anatomical truth — Y raises use cam:72 side-on; don't relitigate.
- build.py reads its page template from the ALREADY-BUILT morning-movement.html, so any
  literal-string replace of a stamped value goes silently stale the moment the baked value
  changes (the count badges + reset counts were wrong for months this way). New stamped
  values must use regex replaces (`–/\d+` style). Bonus trap: app_tpl.js contains the
  6-char escape text `–`, not an en-dash — Python string literals decode, JS source
  doesn't. Messages embed via json.dumps(..., ensure_ascii=False) so typographic chars
  (’ —) land as literal UTF-8 — keep it that way.
- tools/geo.js evals the built script sliced at `const layer=document.getElementById`;
  tools/lint.js slices at `const $=id=>...`. Timer/segment code must stay after the
  `const $=` line in app_tpl.js or those tools break.

## Deployment

Built HTML at repo root for GitHub Pages. One commit per change set (stacked commits cancel
Pages deploys). Pages auto-update themselves on launch/foreground via BUILDV content-hash
stamps (written by build.py; rebuild.py also stamps index.html — so run rebuild after ANY
index.html edit). No manual refresh needed on the phone after the first relaunch.

One home-screen app: every page shares icon-app.png and web-app title "Movement";
index.html is the launcher. Never add per-app icons (Will's explicit choice).

## Voice ceiling (researched 2026-08-02, Apple-confirmed)

iOS never exposes downloaded Enhanced/Premium voices to web pages — only pre-installed
ones (Apple engineer, developer.apple.com/forums/thread/723503). Don't retry settings
tricks; the say() picker already re-picks per utterance and grabs the best available
(and would auto-benefit if Apple ever relents). Real upgrade paths: pre-generated TTS
audio cues baked into the builds, or a native WKWebView shell (AVSpeechSynthesizer can
use downloaded voices) — shell needs a Mac/CI + $99/yr, deferred.

## Copy voice (Will's explicit preferences)

Ending messages: short, positive, puns on the session's own movements ("Prone to
greatness", "Stretch goals: met", "You’re on the ball"). NO safety warnings in ending
messages, written or spoken — the persistent prenatal banner carries that. The finish
voice says only "Movement complete."

## Working style (agreed with Will, 2026-08-03)

For plan-sized changes in this repo, execute inline rather than fanning out one subagent
per task — the sources are small, the plan usually contains exact code, and per-task
subagent dispatch + review roughly tripled wall-clock on the transitions work. Reserve
multi-agent for genuinely parallel or risky work, and never put bottom-tier models on
character-precision edits (a one-character apostrophe fix took 3 review rounds that way).
One independent review at the end still pays for itself: it caught the stale count-badge
stamping bugs. Design docs/plans from past features live in docs/superpowers/.

## Backlog (agreed with Will, rough priority)

1. Session logging to localStorage (date/completions) + streaks.
2. PWA: manifest + service worker for full offline.
3. Polish: figure-4 knee flare, cobra asymmetric tempo, knee-circles readability.

Done: Playwright QA (qa/, `npm run gauntlet`), breath-tempo audio (br flag, qa/breath.js),
setup transitions (pos tags → derived 8s GET SET UP gaps, qa/trans.js), prone Y raises
(Morning Movement 8/13), punny ending messages, launcher times incl. setup gaps.
