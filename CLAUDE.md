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
  - Movements: `{n, cue, dur, bil, cyc, pin, belly, cam, prop, orb, A, B, M?}`.
    `M` = optional mid-keyframe (path A→M→B→M→A). `pin:'LR'` nails feet at their frame-A spots.
    `orb` = orbital pose (hip circles). `cam` = per-movement camera yaw (default 40).
    `prop` = array of `{l:[[xyz],[xyz]]}` lines / `{c:[[xyz],r]}` circles, drawn behind the figure.
  - Colors are STATIC identity roles: INK (right limbs, head, neck), LIMB_L (left limbs, lighter),
    TORSO (quad + belly). No depth-based color changes — that was removed deliberately.
  - Belly: polygon that morphs full-circle (facing viewer) → half-disc flat on the trunk (profile),
    driven by the projected foreshortening of the trunk-front vector. Never re-add a hard mode switch;
    it pops mid-animation.
  - Bilateral moves mirror the figure at the halfway "switch sides" chime (layer transform).
  - Depth sorting = painter's algorithm on projected d (larger d = nearer = drawn later).
- `data2.js` / `d_flow.js` / `d_stretch.js` / `d_birth.js` — pose data per app.
- `mm_extra.js` / `x_*.js` — expandable cue text per movement (keys = movement names).

## Non-negotiable QA gauntlet (run before every commit)

    node tools/smoke.js      # executes each app in a stub DOM, presses Start, renders frames
    node tools/lint.js       # emitted-SVG checks: belly orientation/placement, static colors, no ghost lines
    # geometry invariants (limb lengths ±0.2, toe len 6.4, thru-floor y>95.5, standing feet planted,
    # foot drift ≤1.8 outside the allowed set) — see the geo block in tools/ or rewrite from lint's pattern
    node tools/dump.js && python3 tools/strips.py   # per-frame SVG → PNG contact sheets (needs Pillow)
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

## Deployment

Built HTML at repo root for GitHub Pages. One commit per change set (stacked commits cancel
Pages deploys). After push: hard-refresh on iPhone Safari.

## Backlog (agreed with Will, rough priority)

1. Playwright screenshot QA of the real pages (mid-animation, timer states, background/return).
2. Breath-tempo audio for Birth Prep breathing movements (Web Audio, inhale/exhale tones at cyc).
3. Session logging to localStorage (date/completions) + streaks.
4. PWA: manifest + service worker for full offline.
5. Polish: figure-4 knee flare, cobra asymmetric tempo, knee-circles readability.
