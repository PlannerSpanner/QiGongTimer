# Movement Reference — canonical form source

Rebuilt 2026-08-02. The original research notes behind the pose data were lost with the
sandbox that built the apps; this document reconstructs them as the **single text source of
truth** for placement, position, sequence, direction, and anatomical form for every movement
in the four apps. When a pose or cue is edited, check it against this file first, then run
the QA gauntlet. When this file and the app data disagree, resolve the disagreement
deliberately and update both.

Format per movement: **Setup** (placement/starting position) · **Execution** (sequence) ·
**Anchors** (the numeric/anatomical targets the animation and cues must honor) ·
**Faults** (what wrong looks like) · **Figure** (what the stick figure must visibly show —
the visual-QA hook).

---

## User-specific constraints (morning apps)

These shaped movement selection and form limits; do not edit them away:

- **Right peroneal tendon** — no impact, no loaded eversion surprises. Bouncing has a
  heel-rock fallback; knee circles shrink if the ankle complains; lateral shifts use
  *active controlled* eversion deliberately.
- **Right AC joint** — elbows tucked in cobra, forearm (not straight-arm) plank, chest
  openers stay short of end range.
- **Chronic mid-back (T4–T8)** — shoulder-slap rotations, folded cat-cows, bent rotation
  sweeps, and thread the needle all target this segment on purpose.
- **Right-side lateral-line asymmetry** — lateral reaches and side work bias awareness there.

## Prenatal constraints (both prenatal apps)

- **Position rules**: no lying flat on the back (aortocaval compression), no inversions,
  no balance challenges, no breath-holding or bearing down (Valsalva). Every position is
  seated, hands-and-knees, side-lying, or standing with support.
- **Relaxin**: ligaments are softened; gravity-only stretching, never pushed end range —
  especially adductors (butterfly) and anything asymmetric across the pelvis.
- **Placenta status**: cleared of placenta previa / low-lying placenta (2026-08-02), so the
  apps carry a general listen-to-your-body banner rather than an urgent call-your-provider
  warning, and supported squat depth is limited by comfort and stability, not placenta
  position. If status ever changes, restore the aggressive banner and shallow-squat cap.

## Sides & direction protocol

The timer mirrors the figure and chimes twice at the halfway point of every `bil` movement.
Three kinds of movement use, or deliberately don't use, that mechanism:

| Type | Halfway event | Voice | Movements |
|---|---|---|---|
| Unilateral (one side at a time) | mirror + chime | "Switch sides" | Punching rotations*, Dynamic lateral reaches, Cross-body knee drives*, Lateral weight shifts, Reverse lunges, 90/90 with a fold, Thread the needle, Seated side reach, Seated figure-4, Kneeling hip flexor stretch, Standing calf stretch, Doorway chest opener, Side-lying clamshells, Kneeling lunge with support |
| Direction change (orbital) | mirror reverses the circle | "Change direction" | Hip circles, Knee circles, Birth ball hip circles |
| Alternating within each rep | none needed | — | Rotations with shoulder slaps, Chest opener swings, Bent rotation sweeps, Pedaling down dog, Arm sweeps, Bouncing, Hands-and-knees rocking, Supported butterfly with rock |
| Deliberately one-sided | none — do not "fix" | — | Left side-lying rest (left side only: vena cava decompression) |

\* Punching rotations and knee drives alternate within the rep as performed by a human, but
the figure animates the leading side; the halfway mirror swaps the lead. This is correct.

2024 audit result: every movement requiring a side switch has `bil:true`; the three orbital
movements needed direction-change *wording* (fixed 2026-08-02); nothing else is missing.

---

# Morning Flow — 10 movements, all standing, continuous and rhythmic

Nothing is held. Every movement doubles as warmup plus targeted rehab.

## 1. Bouncing in place — 50s, ~1s cycle
- **Setup:** feet hip-width, knees soft, arms hanging loose.
- **Execution:** light quick bounces driven from the ankles on the balls of the feet;
  everything above stays relaxed and jiggles.
- **Anchors:** heels kiss or barely leave the floor; knees never lock; shoulders stay down.
- **Faults:** turning it into jumping (impact — peroneal risk); gripping the jaw/shoulders.
  Fallback: heel-to-toe rocks, feet never leaving the floor.
- **Figure:** small vertical oscillation, feet under hips, no horizontal foot travel.

## 2. Rotations with shoulder slaps — 50s, 1.8s cycle, alternating
- **Setup:** feet shoulder-width, knees soft.
- **Execution:** rotate the trunk side to side from the waist; arms completely limp so they
  wrap and slap the shoulders/back at each end.
- **Anchors:** rotation biased to the thoracic spine (T4–T8); pelvis rotates a fraction of
  the shoulders; heels stay down.
- **Faults:** swinging the arms actively; whole-body spin with no spinal rotation.
- **Figure:** visible trunk twist with loose trailing arms; feet planted.

## 3. Arm sweeps with knee dip — 50s, 2s cycle, symmetric
- **Setup:** feet hip-width.
- **Execution:** both arms sweep forward/up as the knees straighten, then swing down and
  behind as the knees dip — one pendulum, arms and knees phase-locked.
- **Anchors:** slight hip hinge on the downswing; arms reach roughly head height in front;
  continuous, no pause at either end.
- **Faults:** arms and knees out of phase; squatting instead of dipping.
- **Figure:** synchronized arm arc and knee bend; heels planted.

## 4. Punching rotations — 50s, 1.6s cycle, unilateral (switch)
- **Setup:** wide horse stance — feet well outside shoulders, toes slightly out, knees bent
  and pressing outward, pelvis neutral, constant depth.
- **Execution:** rotate from the waist and punch slowly across the body; at the end of each
  punch push the shoulder blade forward (scapular protraction — serratus).
- **Anchors:** punch at shoulder height; stance depth does not bob; protraction is the point
  of the movement, not the fist.
- **Faults:** rising out of the stance; fast ballistic punches; shoulder shrug instead of
  protraction.
- **Figure:** wide low stance held constant; one arm extending with trunk rotation.

## 5. Dynamic lateral reaches — 50s, 2.2s cycle, unilateral (switch)
- **Setup:** feet wide, both planted.
- **Execution:** reach one arm overhead and lean to the opposite side — long line from hip
  to fingertips; return and repeat, same side until the switch.
- **Anchors:** pure frontal plane — no forward slump; both feet stay full-contact; stretch
  runs the lateral fascial line (IT band–obliques–lats).
- **Faults:** hip swaying out instead of trunk bending; trailing heel lifting.
- **Figure:** clear side-bend with overhead arm, pelvis relatively level, feet planted.

## 6. Cross-body knee drives — 50s, 1.4s cycle, unilateral (switch)
- **Setup:** standing tall.
- **Execution:** drive one knee up and across as the opposite elbow comes down and across to
  meet it; arms pump; stay tall through the standing side.
- **Anchors:** knee reaches at least hip-crease height; trunk rotates to meet it without
  slumping; standing leg extends fully.
- **Faults:** rounding forward to bring elbow to knee; standing-knee collapse inward.
- **Figure:** one knee lifted high with opposite-side trunk rotation; standing foot planted
  (foot travel on the driving leg is expected and allowed in QA).

## 7. Chest opener swings — 50s, 1.8s cycle, alternating
- **Setup:** feet shoulder-width, arms at shoulder height.
- **Execution:** swing both arms wide open (horizontal abduction), then cross in front,
  alternating which arm crosses on top each rep.
- **Anchors:** arms stay near shoulder height; open phase squeezes rhomboids/lower trap,
  cross phase protracts (serratus); short of end range for the right AC joint.
- **Faults:** ballistic fling at end range; arms drifting down to waist height.
- **Figure:** horizontal arm swings, torso upright, feet planted.

## 8. Hip circles — 50s, 2.6s cycle, orbital (direction change)
- **Setup:** hands on hips, feet planted hip-to-shoulder width, knees soft.
- **Execution:** push the hips forward → side → back → around in the biggest smooth circle
  available; half the time each direction, reversing at the halfway chime.
- **Anchors:** feet never move; head stays roughly centered (the pelvis orbits under a
  quiet upper body); even circle — no flat spots.
- **Faults:** knees doing the circling; weight coming off a foot; tiny timid circles.
- **Figure:** pelvis translating around a circle while feet stay pinned; mirrored (reversed)
  after halfway.

## 9. Bent rotation sweeps — 50s, 2s cycle, alternating
- **Setup:** hinge forward about 45°, spine long, arms hanging.
- **Execution:** rotate the trunk side to side under gravity; the loose arms wrap around the
  body at each end.
- **Anchors:** hips keep facing forward — rotation is thoracic; hinge angle constant;
  neutral (not rounded) spine under the load.
- **Faults:** standing up mid-set; lumbar rotation/hip swivel; actively swinging arms.
- **Figure:** hinged torso with rotation, arms trailing; feet planted.

## 10. Lateral weight shifts — 50s, 2.2s cycle, unilateral (switch)
- **Setup:** wide stance, toes forward.
- **Execution:** shift fully into one hip and sink; press deliberately through the **outside
  edge** of the loaded foot (active eversion — dynamic peroneal training, zero impact);
  arms sweep across in the direction of travel.
- **Anchors:** loaded knee tracks over the foot; pelvis stays fairly level; the outside-edge
  press is the entire point — cue it every rep.
- **Faults:** knee collapsing inward; torso pitching forward; passive foot.
- **Figure:** clear weight shift toward one leg with the body sinking over it (foot travel
  allowed in QA).

---

# Morning Movement — 12 movements: standing mobility → floor → core, no impact

## 1. Deep squats — 30s, 2.8s cycle, symmetric, feet pinned
- **Setup:** feet shoulder-width, toes slightly out, heels down.
- **Execution:** hips go **back first**, then straight down until nearly sitting on the
  heels; drive up through the whole foot.
- **Anchors (research-anchored, do not drift):** torso and shins stay **parallel to each
  other** throughout; ankle folds from ~90° to ~**65°** at the bottom; heels never lift;
  knees track over the second toe.
- **Faults:** heels rising; chest dropping faster than the shins incline; bottoming out into
  a rounded back.
- **Figure:** tibia–torso parallelism visible at every depth; feet planted (pin LR); deep
  bottom position near the heels.

## 2. Parallel squats — 30s, 2.4s cycle, symmetric, feet pinned
- Same pattern as deep squats, but **stop at thighs parallel**; chest carries prouder
  (more vertical) than the deep squat; same knee tracking and planted heels.
- **Figure:** obviously shallower bottom than movement 1, prouder chest angle.

## 3. Knee circles — 30s, 3.2s cycle, orbital (direction change), feet pinned
- **Setup:** feet together-ish and planted, knees bent, hands resting on the knees.
- **Execution:** circle the knees one direction; reverse at the halfway chime.
- **Anchors:** weight even across both feet the whole orbit; circle size tuned for
  **projected on-screen knee motion** (the swivel cones are asymmetric left/right — never
  mirror a swivel by sign-flip; re-fit numerically); shrink the circle if the right ankle
  complains.
- **Faults:** heels peeling; hips doing the circle instead of knees.
- **Figure:** knees orbiting about the hip→ankle axis, feet and pelvis quiet.

## 4. Reverse lunges — 30s, 3.2s cycle, unilateral (switch), front foot pinned
- **Setup:** standing tall.
- **Execution:** step back about two feet, landing on the ball of the back foot; lower;
  drive back up through the front heel to standing.
- **Anchors (research-anchored):** **front shin stays vertical** — knee stacked over ankle;
  both knees near 90° at the bottom; **back knee hovers 1–2 inches** off the floor, never
  touches; torso upright.
- **Faults:** front knee traveling over the toes; back knee slamming down; short choppy step.
- **Figure:** rear foot stepping back and returning (travel expected in QA); front shin
  vertical at depth; back-knee hover visible.

## 5. Hip hinges — 30s, 2.8s cycle, symmetric, feet pinned
- **Setup:** feet hip-width, soft knees.
- **Execution:** push the hips straight **back** (not down); chest travels forward; return
  by driving the hips through.
- **Anchors:** spine long neutral; shins near vertical throughout; hands trace the thigh
  (bar path); this grooves the narrow-sumo deadlift pattern.
- **Faults:** squatting (knees forward, hips dropping); rounding; hyperextending at the top.
- **Figure:** hips translating backward with a flat inclined torso, shins vertical.

## 6. Folded cat-cows — 30s, 3.4s cycle, symmetric, feet pinned
- **Setup:** knees bent, hands resting on the knees, weight through the arms.
- **Execution:** exhale — round the whole spine toward the ceiling; inhale — arch and open
  the chest.
- **Anchors:** emphasis on **T4–T8 extension** on the arch; move segmentally, slow.
- **Faults:** hinging only at the low back; elbows locking the movement out.
- **Figure:** alternating spinal round/arch while hands stay on knees, feet planted.

## 7. Cobra press-ups — 60s, 3.2s cycle, symmetric (McKenzie extension)
- **Setup:** face down, hands under the shoulders, legs relaxed.
- **Execution:** press the chest up and forward, hips staying on the floor; lower with
  control.
- **Anchors:** **elbows tucked close to the ribs** (flaring loads the right AC joint);
  pelvis never leaves the floor; range grows over the set, never forced.
- **Faults:** hips lifting (turning it into up-dog); shoulders shrugging to the ears.
- **Figure:** chest arcing up while pelvis and legs stay grounded.

## 8. Pedaling down dog — 60s, 2.2s cycle, alternating
- **Setup:** inverted V — hands and feet down, hips high.
- **Execution:** alternately press one heel toward the floor while the other knee bends;
  slow and rhythmic.
- **Anchors:** feet track straight ahead — **no outward roll** (peroneal); arms push the
  floor away; gentle calf/Achilles load only.
- **Faults:** bouncing the heel; rolling the pedaling foot outward; sagging shoulders.
- **Figure:** high-hip V with alternating heel drop (small foot travel expected in QA).

## 9. Tuck + untuck — 60s, 3.6s cycle, symmetric, feet pinned
- **Setup:** supine, knees bent, feet flat, arms relaxed.
- **Execution:** flatten the low back into the floor (posterior tilt), then let it arch
  gently away (anterior tilt). Only the pelvis moves.
- **Anchors:** ribs and everything above them stay quiet on the floor; small, controlled,
  breath-paced.
- **Faults:** glute squeeze doing the work; lifting the hips; moving the ribcage.
- **Figure:** subtle pelvic roll with the back on the floor, feet planted.

## 10. 90/90 with a fold — 60s, 3.4s cycle, unilateral (switch)
- **Setup (research-anchored — this is a Z-sit):** front leg at 90° with its **outer** thigh
  and shin flat on the floor; back leg at 90° with its **inner** thigh down and the shin
  pointing straight behind; sit tall on both sit bones as much as the hips allow.
- **Execution:** hinge the chest forward over the front shin, spine long; return.
- **Anchors:** the fold comes from the hips, not spinal rounding; back-leg shin stays at
  90° behind, not tucked; front hip in external rotation, back hip internal.
- **Faults:** collapsing onto one hip and rounding to fake depth; the back leg drifting
  into a side-sit.
- **Figure:** unmistakable Z-sit geometry (not a cross-legged sit), then a flat-back hinge
  over the front shin.

## 11. Thread the needle — 60s, 3.6s cycle, unilateral (switch), knees pinned
- **Setup:** quadruped — wrists under shoulders, knees under hips.
- **Execution:** reach one arm to the ceiling opening the chest, then slide it palm-up under
  the opposite armpit until the shoulder and ear rest toward the floor; re-thread; switch at
  the chime.
- **Anchors:** hips stay stacked over the knees (no sitting back); rotation is thoracic plus
  scapular; targets the right-shoulder IR limitation gently.
- **Faults:** hips swinging sideways; collapsing onto the head instead of the shoulder.
- **Figure:** quadruped base fixed while one arm sweeps from ceiling-reach to threaded-under.

## 12. Plank hold — 60s, 4s cycle (micro-adjust breathing rhythm), symmetric
- **Setup:** forearm plank — elbows under shoulders (kinder to the right AC joint than
  straight-arm).
- **Execution:** hold one straight line, breathing steadily.
- **Anchors:** ear–shoulder–hip–ankle in line; glutes squeezed, ribs down, and **push the
  floor away** to fire serratus (same cue as the landmine press).
- **Faults:** hips sagging or piking; head dropping; breath holding.
- **Figure:** rigid straight line from head to heels on forearms; no visible drift.

---

# Prenatal Stretch — 10 movements, gentle stretch & release

All prenatal constraints above apply. Everything seated, hands-and-knees, or supported
standing. Breathe continuously.

## 1. Seated breathing — 60s, 4s cycle, symmetric
- **Setup:** tall sit on a chair or birth ball, feet flat, hands on thighs.
- **Execution:** inhale through the nose, feeling the ribs widen **sideways**; long slow
  exhale.
- **Anchors:** lateral rib expansion, not chest lifting — the growing uterus crowds the
  diaphragm and sideways expansion keeps breathing efficient; spine tall not rigid.
- **Faults:** shoulder-and-collarbone breathing; slumping.
- **Figure:** upright seated posture with subtle trunk rhythm; chair prop visible.

## 2. Seated cat-cow — 45s, 3.6s cycle, symmetric
- **Setup:** seated, hands on knees.
- **Execution:** exhale — round the spine and tuck the pelvis; inhale — gentle arch and
  chest open. Small and slow.
- **Anchors:** both directions matter: the belly pulls the pelvis anterior and compresses
  the low back, so the posterior tilt is the relief half; range modest.
- **Faults:** big end-range arching; neck whipping.
- **Figure:** seated spinal round/arch cycle on the chair.

## 3. Seated side reach — 60s, 3.4s cycle, unilateral (switch)
- **Setup:** tall sit, feet flat.
- **Execution:** one arm overhead, lean to the opposite side, breathing into the stretched
  side; switch at the chime.
- **Anchors:** **both sit bones stay down** — the stretch is rib-to-hip space, one of the
  most compressed regions later in pregnancy; no forward collapse.
- **Faults:** lifting a hip to fake range; elbow bending to fake reach.
- **Figure:** seated side-bend with overhead arm, pelvis square on the chair.

## 4. Seated figure-4 — 60s, 3.4s cycle, unilateral (switch)
- **Setup:** seated, one ankle across the opposite knee, crossed foot gently dorsiflexed.
- **Execution:** sit tall, then hinge forward **from the hips** until the outer hip opens;
  switch at the chime.
- **Anchors:** mild intensity only — relaxin has loosened the pelvic ligaments and the
  piriformis often tightens to compensate (sciatic irritation); spine stays long.
- **Faults:** rounding down toward the shin; pressing the crossed knee down.
- **Figure:** the ankle-over-knee triangle clearly visible, then a small hip hinge.

## 5. Supported butterfly — 60s, 4.2s cycle, symmetric
- **Setup:** seated **elevated on a cushion so the hips sit above the knees**; soles
  together, knees open.
- **Execution:** let gravity settle the knees — nothing active.
- **Anchors:** **never push the knees down**; adductor length affects how wide the pelvic
  outlet can open, and gentle beats aggressive on softened ligaments.
- **Faults:** hands or elbows pressing the thighs; slumped low back.
- **Figure:** diamond leg shape, tall spine, knees hanging without motion force.

## 6. Wide-knee child's pose — 60s, 4.4s cycle, symmetric
- **Setup:** knees wide, big toes together, chest/forearms supported (cushion allowed).
- **Execution:** sit back toward the heels, belly resting in the space between the knees;
  slow breathing.
- **Anchors:** passive **pelvic floor lengthening** — this is a release position, not a
  stretch to push; genuine rest for the low back.
- **Faults:** knees too narrow (compressing the belly); breath holding.
- **Figure:** folded kneeling shape, hips toward heels, chest low, knees clearly wide.

## 7. Hands-and-knees rocking — 60s, 2.8s cycle, alternating (fore–aft)
- **Setup:** quadruped, wrists under shoulders, knees under hips.
- **Execution:** rock the hips slowly back toward the heels and forward again; gentle
  circles are allowed.
- **Anchors:** spine near neutral — **no deep arching**; takes the baby's weight off the
  spine and encourages optimal anterior fetal position.
- **Faults:** sagging into extension at the front of the rock.
- **Figure:** quadruped base with smooth fore–aft pelvis travel.

## 8. Kneeling hip flexor stretch — 60s, 3.6s cycle, unilateral (switch)
- **Setup:** half-kneeling, cushion under the down knee, hand on a chair for balance.
- **Execution:** **tuck the pelvis first**, then shift gently forward until the front of the
  down-side hip lengthens; switch at the chime.
- **Anchors:** the posterior tilt IS the stretch — the forward shift is small; tight hip
  flexors drag the pelvis anterior and worsen back pain.
- **Faults:** lumbar arching forward instead of hip extension; lunging deep.
- **Figure:** half-kneel with support prop; small forward translation, upright torso.

## 9. Standing calf stretch — 60s, 3.6s cycle, unilateral (switch)
- **Setup:** hands on the wall, one foot stepped back, back leg straight, back foot pointing
  straight ahead.
- **Execution:** press the back heel down and lean gently in; switch at the chime.
- **Anchors:** heel stays down; straight-ahead foot alignment; addresses the calf cramps
  and swelling common in the 2nd–3rd trimester.
- **Faults:** back foot turned out; bouncing.
- **Figure:** staggered stance against the wall prop, back leg visibly straight.

## 10. Doorway chest opener — 45s, 3.8s cycle, unilateral (switch)
- **Setup:** one forearm vertical on the doorframe, elbow at shoulder height.
- **Execution:** step gently through until the chest opens — **a mild stretch is plenty**;
  switch arms at the chime.
- **Anchors:** counteracts the shoulder rounding from breast growth and the forward weight
  shift; opens rib space for the lungs; elbow stays at shoulder height.
- **Faults:** elbow above shoulder height (impingement position); leaning body weight in.
- **Figure:** doorframe prop, forearm vertical, small forward step-through.

---

# Birth Prep — 11 movements: pelvic mobility and floor release

The organizing idea: for perineal protection, the ability to **relax and lengthen** the
pelvic floor matters more than strength. Release and coordination first, plus the hip and
adductor mobility that lets the pelvic outlet open. All prenatal constraints apply; never
bear down.

## 1. Breath and pelvic floor release — 90s, 5s cycle, symmetric
- **Setup:** tall sit on a chair; one hand on the belly, one on the chest.
- **Execution:** inhale into the belly hand and feel the pelvic floor **soften and widen
  downward**; exhale and simply let it be — no lift, no effort.
- **Anchors:** the inhale is the working half (diaphragm descends → pelvic floor lengthens);
  the chest hand stays quieter than the belly hand.
- **Faults:** reversing it (gripping on the inhale); turning the exhale into a kegel.
- **Figure:** still, tall seated posture with slow breathing rhythm; chair visible.

## 2. Hands-and-knees pelvic rocking — 60s, 2.8s cycle, alternating (fore–aft)
- Same base and anchors as Prenatal Stretch #7. Additionally: this is one of the most-used
  **labour positions** — the pattern is worth knowing in the body; mobilizes the
  sacroiliac joints.
- **Figure:** quadruped fore–aft rock, neutral spine.

## 3. Birth ball hip circles — 60s, 3.2s cycle, orbital (direction change)
- **Setup:** sit tall on the ball, feet flat and **wide so feet and ball form a tripod**,
  hips level with or above the knees.
- **Execution:** circle from the pelvis like a slow hula hoop; shoulders stay quiet;
  reverse direction at the halfway chime.
- **Anchors:** movement isolated to the pelvis on the ball; feet never lift; smooth even
  orbit.
- **Faults:** whole-torso stirring; feet narrow (unstable tripod); bouncing.
- **Figure:** seated-on-ball pose with pelvis orbiting, ball prop visible, reversed after
  halfway.

## 4. Supported deep squat — 60s, 3.4s cycle, symmetric
- **Setup:** holding a counter or chair back.
- **Execution:** lower only as far as comfortable, heels down if possible, knees tracking
  out; **rise slowly on the exhale**.
- **Anchors:** squatting can widen the pelvic outlet substantially; depth is limited by
  comfort and stability — build it gradually rather than chasing range; no breath holding
  at any depth.
- **Faults:** bouncing at the bottom; heels lifting; forcing depth on an unstable day.
- **Figure:** supported squat with prop, modest depth, heels down.

## 5. Side-lying clamshells — 60s, 2.6s cycle, unilateral (switch)
- **Setup:** side-lying, hips stacked vertically, knees bent, **heels glued together**.
- **Execution:** only the top knee opens; small lift, slow lower; switch sides at the chime.
- **Anchors (research-anchored):** heels welded throughout; **the pelvis must not roll
  backward** — the lift is small and the control is the exercise (glute medius).
- **Faults:** big showy range with pelvic roll; heels separating; hip flexing to cheat.
- **Figure:** stacked side-lying position, top knee hinging open like a shell, heels
  touching at all times.

## 6. Supported butterfly with rock — 60s, 3s cycle, alternating (side-to-side)
- **Setup:** elevated on a cushion, soles together, knees open (as Prenatal Stretch #5).
- **Execution:** rock gently side to side.
- **Anchors:** never push the knees down; the rock stays small — forcing range can
  destabilize an already-softened pelvis.
- **Faults:** turning the rock into a stretch contest; hands loading the thighs.
- **Figure:** butterfly diamond with a small lateral sway.

## 7. Kneeling lunge with support — 60s, 3.6s cycle, unilateral (switch)
- **Setup:** half-kneeling, cushion under the back knee, hand on a chair.
- **Execution:** shift weight gently forward; back; repeat; switch at the halfway chime.
- **Anchors:** **asymmetric hip positions help the baby navigate the pelvis** and are
  commonly used to resolve a stalled labour — this is rehearsal, not stretching; keep the
  shift comfortable.
- **Faults:** deep aggressive lunge; losing the support hand.
- **Figure:** half-kneel with chair prop and small forward-back translation.

## 8. Standing wall pelvic tilts — 60s, 3.4s cycle, symmetric
- **Setup:** back against a wall, feet a step forward.
- **Execution:** exhale — flatten the low back into the wall; inhale — release. Small and
  controlled.
- **Anchors:** conscious pelvic control reduces back pain now and is an active tool for
  **back labour** later; only the pelvis moves.
- **Faults:** knee-bend doing the flattening; shoulders peeling off the wall.
- **Figure:** upright stance at the wall with subtle pelvic tilt cycle.

## 9. Pelvic floor coordination — 90s, 5.4s cycle, symmetric
- **Setup:** tall sit, both hands resting low on the belly.
- **Execution:** exhale — a **gentle** pelvic floor lift; inhale — a complete, deliberate
  release.
- **Anchors:** **the release is the important half for birth** — the lift exists only to
  make the release trainable; never bear down; effort stays around 30%, not maximal.
- **Faults:** max-effort kegels; holding the lift; breath reversal.
- **Figure:** still tall sit with slow breath rhythm (visually similar to #1 — correct).

## 10. Wide-knee child's pose — 60s, 4.4s cycle, symmetric
- Identical anchors to Prenatal Stretch #6: passive pelvic floor lengthening, knees wide,
  belly between, genuine rest.
- **Figure:** wide-knee fold, chest low.

## 11. Left side-lying rest — 60s, 5s cycle, deliberately left side only — never add a switch
- **Setup:** lying on the **left** side, pillow between the knees, one under the belly.
- **Execution:** nothing — return to the soft downward-widening breath from movement 1.
- **Anchors:** left side-lying keeps pressure off the **vena cava** and maximizes placental
  blood flow; links the release breath to the position used in labour and sleep.
- **Faults:** "balancing" it with a right side (defeats the purpose); pillowless knees
  letting the pelvis twist.
- **Figure:** left-side-lying with visible knee pillow prop, fully settled.
