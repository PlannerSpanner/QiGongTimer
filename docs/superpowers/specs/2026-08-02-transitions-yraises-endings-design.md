# Setup transitions, prone Y raises, punny ending messages — design

Date: 2026-08-02. Approved approach: derived segments list (Approach A).

## 1. Setup transitions (all four apps)

**Problem:** movements run back-to-back. When consecutive movements need different
setups (standing → prone, fetching a ball, etc.), the timer starts before you're in
position.

**Data change:** every movement in `data2.js` / `d_flow.js` / `d_stretch.js` /
`d_birth.js` gets a position tag `pos:'<tag>'`. Tags are one word; a prop counts as
its own tag so fetching/leaving it earns a gap. Tag vocabulary (per-app as needed):
`standing`, `prone`, `supine`, `seated`, `quadruped`, `downdog`, `sidelying`,
`kneeling`, `chair`, `ball`, `wall`, `doorway`.

**Engine change (`app_tpl.js`):** at load, build a `SEGS` array from `MOVES`:
each movement becomes a segment; wherever `pos` differs from the previous
movement's, insert `{trans:true, next:<movement>, dur:8}` before it. The timer
(`go`, `sync`, pause/resume, wall-clock catch-up) walks `SEGS`. Movement-only UI —
dots, `MOVEMENT X OF N`, `count`, prev/next buttons — keeps indexing `MOVES`;
prev/next jump between movements (never into a gap).

**Transition segment behavior:**
- Header `mNum` reads `GET SET UP`; `mName` shows the upcoming movement's name;
  cue area shows the position instruction.
- Figure previews the upcoming movement's animation (its fit/props/ground placement).
- Voice at gap start: position instruction only (e.g. "Lie face down."), from a
  per-tag phrase map. The movement's own start keeps its normal chime + name
  announcement, so nothing is said twice.
- Progress bar counts down the 8 s; timer text shows the countdown.
- The 2× session toggle (`dm`) does NOT multiply transition durations — setup
  doesn't take twice as long. The X2 total-minutes labels include transition time
  unmultiplied.
- Wall-clock catch-up (`sync`) hops transition segments exactly like movements.
- Halfway/bilateral logic never fires inside a gap (`trans` segments are never `bil`).

**Position instruction phrases** (tag → spoken/displayed line), shared in the
template: standing "Stand up.", prone "Lie face down.", supine "Lie on your back.",
seated "Sit on the floor.", quadruped "Come to hands and knees.", downdog "Push back
into down dog.", sidelying "Lie on your side.", kneeling "Come to kneeling.",
chair "Sit on your chair.", ball "Sit on your ball.", wall "Stand at the wall.",
doorway "Stand in the doorway." A movement may set `posCue:'...'` to override the
tag phrase for its own gap (e.g. Left side-lying rest → "Lie on your left side.").

**Morning Movement tagging** (drives 5 gaps): 1–6 standing · 7–8 prone · 9 downdog ·
10 supine · 11 seated · 12–13 quadruped (plank drops to forearms from quadruped —
no gap). Morning Flow is all standing — zero gaps, page byte-behavior unchanged
apart from the shared engine code. Prenatal tags assigned per movement list during
implementation using the vocabulary above (e.g. Birth Prep: ball movements tagged
`ball`, side-lying `sidelying`, wall work `wall`).

**Intro copy:** Morning Movement intro updates to 13 movements / "about 10 minutes
with short setup pauses". Other intros adjusted only if their stated run time
shifts by ≥1 minute.

## 2. Prone Y raises (Morning Movement, new movement 8 of 13)

- **Slot:** right after Cobra press-ups — prone block stays together (7 cobra,
  8 Y raises), so no new gap between them.
- **Timing:** 30 s, symmetric (`bil:false`), ~3 s cycle.
- **Form (research-anchored, goes into `docs/movement-reference.md`):** face down,
  arms overhead at ~30–45° out from midline (the Y), thumbs up. Lift the arms an
  inch or two by drawing the shoulder blades down and back (lower traps); chest may
  barely graze up; neck neutral, gaze down. Lower with control.
  Anchors: no shrugging (shoulders away from ears); thumbs-up rotation; lift from
  lower traps, not low-back extension. Friendly to the right AC joint — trains the
  lower-trap side of that balance.
  Faults: shrugging into the ears; cranking the neck up; ballistic swinging.
  Figure: prone, Y-angled arms visibly lifting and lowering; pelvis and legs quiet.
- **Pose:** built numerically against the QA tools (ascii/strips/Playwright), same
  workflow as other movements. Cobra's keyframes are the prone starting reference.
- **Cue text:** new `EXTRA` entry in `mm_extra.js` with form summary + shoulder
  note + YouTube query (`prone+y+raise+lower+trap+exercise`).
- **Count updates:** `rebuild.py` A12 `n:12→13`; count strings and reset text
  follow from the build.

## 3. Ending messages (`done_msg` args in `rebuild.py`)

Short, positive, punning on the session's movements. Displayed only — the voice
still says just "Movement complete." No safety warnings in these messages (the
prenatal apps' always-visible safety banner keeps that guidance on screen).

- **Morning Flow:** unchanged.
- **Morning Movement:** `<strong>Done.</strong> Needle threaded, cobra charmed,
  plank held. Prone to greatness.`
- **Prenatal Stretch:** `<strong>Done.</strong> Stretch goals: met. Butterflies
  earned. Sip some water.`
- **Birth Prep:** `<strong>Done.</strong> Clamshells opened, hips rocked and
  rolled. You're on the ball.`

## Testing

- Full gauntlet (`npm run gauntlet`) must pass: smoke, lint, geo, Playwright shots
  (including the new Y-raise pose — eyeball it), catch-up test (must hop transition
  segments correctly), breath tones, 2× toggle (verify transitions unmultiplied),
  auto-update freshness.
- New/extended QA: a Playwright shot of a transition segment (GET SET UP header +
  next-movement preview figure); catch-up scenario that backgrounds across a
  gap boundary.
- `python3 tools/ascii.py morning-movement "Prone Y raises" 0,3` for the pose.
- `docs/movement-reference.md` updated: Y-raise entry + a short transitions note
  in the Morning Movement header (12→13 movements).

## Out of scope

`hip-activation.html` untouched. No per-app icons. No changes to voice picking,
belly rendering, or color roles.
