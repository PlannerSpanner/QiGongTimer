// Daily 10 — postural maintenance. tdur = length of the GET SET UP gap BEFORE the
// movement (TR_ALL builds); setup = authored transition script, spoken as
// "Next: <name>. <setup>". Work 465s + gaps 135s = 600s exactly.
const MOVES=[
// Contralateral reach: right arm sweeps overhead while the left leg lengthens; the
// mirror at halfway swaps the lead pair (punching-rotations precedent). Low back
// stays glued to the floor: spine values are identical in every keyframe.
{n:"Dead bug",pos:'supine',cue:"Ribs down, low back pressed into the floor",dur:45,bil:true,cyc:3.6,cam:62,
 setup:"Lie on your back. Knees up over your hips, shins level, arms to the ceiling.",
 A:{p:[0,89.5,3],yaw:14,tw:0,s:[-84,-90],hf:-4,aL:[180,-6,180,-5],aR:[180,6,180,5],
    lL:[176,-7,88,-5],lR:[176,7,88,5]},
 B:{p:[0,89.5,3],yaw:14,tw:0,s:[-84,-90],hf:-4,aL:[180,-6,180,-5],aR:[268,6,268,5],
    lL:[97,-7,94,-5],lR:[176,7,88,5]}},

// Hip extension, not lumbar extension: the torso is one straight slab (s0 == s1) and
// the top position is the straight knee-hip-shoulder diagonal — no extra arch.
{n:"Glute bridge",pos:'supine',cue:"Tuck first, drive through the heels, squeeze tall",dur:45,bil:false,cyc:3.2,cam:62,tdur:10,
 setup:"Stay on your back. Feet flat on the floor, hip width, heels close to your hands.",
 A:{p:[0,89.5,3],yaw:14,tw:0,s:[-84,-90],hf:-4,ikFL:[-5.5,93,22],ikFR:[5.5,93,22],
    aL:[88,-8,88,-6],aR:[88,8,88,6]},
 B:{p:[0,79.6,3],yaw:14,tw:0,s:[-110,-110],hf:8,ikFL:[-5.5,93,22],ikFR:[5.5,93,22],
    aL:[88,-8,88,-6],aR:[88,8,88,6]}},

// Ported from the Birth Prep clamshell (proven read): bottom leg static, top foot
// pinned at the heels, and the top knee opens by swiveling about the hip→ankle axis —
// so the heels stay welded by construction. Pelvis never rolls (p/yaw identical).
{n:"Side-lying clamshell",pos:'sidelying',cue:"Heels glued together — only the top knee opens",dur:60,bil:true,cyc:2.6,cam:40,tdur:10,
 setup:"Roll onto your side. Knees bent, heels together, head resting on your lower arm.",
 A:{p:[0,80,0],yaw:70,tw:0,s:[76,80],hf:12,aL:[70,-16,82,-12],aR:[64,16,78,12],
    lL:[58,-8,-84,-6],ikFR:[0.63,91.95,-10.02],swR:6},
 B:{p:[0,80,0],yaw:70,tw:0,s:[76,80],hf:12,aL:[70,-16,82,-12],aR:[64,16,78,12],
    lL:[58,-8,-84,-6],ikFR:[0.63,91.95,-10.02],swR:48}},

// Full side plank (strength B's fitted pose): A is the straight head-to-heels line,
// B drops ONLY the pelvis — spine s flattens so the supported shoulder stays fixed
// and the body pivots at the planted forearm. Hand target and feet identical in both.
{n:"Side plank",pos:'sidelying',cue:"One straight line — push the floor away, hips high",dur:40,bil:true,cyc:4.2,cam:40,tdur:10,
 setup:"Stay on your side. Prop up on your forearm, elbow under your shoulder, feet stacked.",
 A:{p:[0,83.6,0],yaw:70,tw:0,s:[86,88],hf:6,ikR:{w:[28.6,92,-12.7]},swAR:150,aL:[-90,0,-90,0],
    ikFL:[-34.5,91.3,-7.5],ikFR:[-33.5,91.9,-9.5]},
 B:{p:[0,85.5,0],yaw:70,tw:0,s:[80,81],hf:6,ikR:{w:[28.6,92,-12.7]},swAR:150,aL:[-90,0,-90,0],
    ikFL:[-34.5,91.3,-7.5],ikFR:[-33.5,91.9,-9.5]}},

// Contralateral reach on all fours (cat-cow's quadruped base): right arm and LEFT leg
// extend to horizontal while the planted hand and kneeling leg never move; the mirror
// at halfway swaps the pair (dead-bug precedent). Spine is one neutral slab in both
// frames — the exercise is the rib-pelvis lock against gravity, not reach height.
{n:"Bird dog",pos:'quadruped',cue:"Flat back — reach long, not high",dur:50,bil:true,cyc:4.0,cam:70,tdur:15,
 setup:"Come to hands and knees. Hands under shoulders, knees under hips, back flat.",
 A:{p:[0,74.5,0],yaw:20,tw:0,s:[88,88],hf:8,ikL:{w:[-7,93,25]},ikR:{w:[7,93,25]},
    lL:[7,-6,-90,-5],lR:[7,6,-90,5]},
 B:{p:[0,74.5,0],yaw:20,tw:0,s:[88,88],hf:8,ikL:{w:[-7,93,25]},ikR:{w:[24,73.5,46]},
    lL:[-88,-8,-88,-6],lR:[7,6,-90,5]}},

// Hinge held constant; elbows drive up and back toward the hips. Neutral grip:
// dumbbell handles run front-to-back. Arm world targets in both frames (blendable).
{n:"Dumbbell bent-over row",pos:'standing',cue:"Elbows to the hips — no torso heave",dur:45,bil:false,cyc:2.6,cam:64,tdur:15,
 prop:[{db:[{j:'haL',o:[0,0,-2.4]},{j:'haL',o:[0,0,2.4]},1.7]},
       {db:[{j:'haR',o:[0,0,-2.4]},{j:'haR',o:[0,0,2.4]},1.7]}],
 setup:"Stand up and grab your dumbbells. Soft knees, hinge your chest toward the floor, back flat.",
 A:{p:[-4,60,-9],yaw:24,tw:0,s:[60,64],hf:-16,ikL:{w:[-2,73,12.5]},ikR:{w:[10.8,73,7]},
    ikFL:[-5,93,-5],ikFR:[5,93,-8]},
 B:{p:[-4,60,-9],yaw:24,tw:0,s:[60,64],hf:-16,ikL:{w:[-8,60,0]},ikR:{w:[5.7,60,-5.9]},
    swAL:-100,swAR:80,ikFL:[-5,93,-5],ikFR:[5,93,-8]}},

// STRICT PARTIAL: shoulders never sink below the elbows (upper arm parallel is the
// hard floor of the rep). Hands are fixed world points on the bench edge.
{n:"Bench dips",pos:'bench',cue:"Stop at parallel — shoulders down and back",dur:40,bil:false,cyc:3.0,cam:66,tdur:15,
 prop:[{l:[[-12,74,0.5],[12,74,0.5]]},{l:[[-12,74,-6.5],[12,74,-6.5]]},
       {l:[[-12,74,0.5],[-12,74,-6.5]]},{l:[[12,74,0.5],[12,74,-6.5]]},
       {l:[[-11,74,0.5],[-11,93,0.5]]},{l:[[11,74,0.5],[11,93,0.5]]},
       {l:[[-11,74,-6.5],[-11,93,-6.5]]},{l:[[11,74,-6.5],[11,93,-6.5]]}],
 setup:"Dumbbells down — move to the bench. Hands on the edge beside your hips, feet out in front.",
 A:{p:[0,75.5,6],yaw:14,tw:0,s:[8,4],hf:2,ikL:{w:[-7.5,74,1]},ikR:{w:[7.5,74,1]},
    ikFL:[-5.5,93,27],ikFR:[5.5,93,27]},
 B:{p:[0,87.5,7],yaw:14,tw:0,s:[8,4],hf:2,ikL:{w:[-7.5,74,1]},ikR:{w:[7.5,74,1]},
    swAL:-150,swAR:150,ikFL:[-5.5,93,27],ikFR:[5.5,93,27]}},

// A=Y, M=T, B=W: the cycle sweeps Y->T->W->T->Y. Tiny floats — the work is the
// scapular squeeze, not elevation. cam 72: the only view where the letters open.
{n:"Prone Y-T-W raise",pos:'prone',cue:"Blades down and back — small floats, thumbs up",dur:45,bil:false,cyc:4.2,cam:72,tdur:15,
 setup:"Down to the floor, face down. Forehead down, arms overhead in a Y, thumbs up.",
 A:{p:[0,90.5,4],yaw:18,tw:0,s:[91,90],hf:19,ikL:{w:[-9.7,89.5,53.7]},ikR:{w:[37.1,89.5,38.5]},
    lL:[-90,-6,-90,-5],lR:[-92,6,-88,5]},
 M:{p:[0,90.5,4],yaw:18,tw:0,s:[91,90],hf:19,ikL:{w:[-21.9,89.5,38.5]},ikR:{w:[38,89.5,19]},
    swAL:100,swAR:-100,lL:[-90,-6,-90,-5],lR:[-92,6,-88,5]},
 B:{p:[0,90.5,4],yaw:18,tw:0,s:[91,90],hf:19,ikL:{w:[-8.5,89.5,35]},ikR:{w:[21,89.5,24]},
    swAL:60,swAR:-120,lL:[-90,-6,-90,-5],lR:[-92,6,-88,5]}},

// Facing the wall, forearms glued to it: slide up only as far as ribs stay down.
{n:"Wall slide",pos:'wall',cue:"Forearms glued to the wall, ribs stay down",dur:30,bil:false,cyc:3.4,cam:74,tdur:15,pin:"LR",
 prop:[{l:[[0,14,13],[0,93,13]]}],
 setup:"Stand facing the wall. Forearms on the wall at shoulder height, thumbs toward you.",
 A:{p:[0,55.4,1],yaw:6,tw:0,s:[3,1],hf:0,ikL:{w:[-7,16.5,12]},ikR:{w:[7,16.5,12]},
    swAL:-85,swAR:100,lL:[-2,-6,2,-5],lR:[2,6,-2,5]},
 B:{p:[0,55.4,1],yaw:6,tw:0,s:[3,1],hf:0,ikL:{w:[-6.5,6.5,12]},ikR:{w:[6.5,6.5,12]},
    swAL:-85,swAR:100,lL:[-2,-6,2,-5],lR:[2,6,-2,5]}},

// Static hold: the fight is grip + anti-shrug + anti-lean. Barely-visible sway.
{n:"Farmer hold",pos:'standing',cue:"Ribs stacked over pelvis — don't let the weights win",dur:35,bil:false,cyc:4.6,cam:40,tdur:15,pin:"LR",
 prop:[{db:[{j:'haL',o:[0,0,-2.4]},{j:'haL',o:[0,0,2.4]},1.9]},
       {db:[{j:'haR',o:[0,0,-2.4]},{j:'haR',o:[0,0,2.4]},1.9]}],
 setup:"Pick up your dumbbells. Stand tall, shoulders packed down and back.",
 A:{p:[0,55.2,0],yaw:24,tw:0,s:[3,1],hf:0,ikL:{w:[-8.5,54.5,0.5]},ikR:{w:[8.5,54.5,-2]},
    lL:[-2,-6,2,-5],lR:[2,6,-2,5]},
 B:{p:[0,55.4,0],yaw:24,tw:0,s:[1,0],hf:0,ikL:{w:[-8.5,54,0.5]},ikR:{w:[8.5,54,-2]},
    lL:[-2,-6,2,-5],lR:[2,6,-2,5]}},

// The exhale reset: ribs settle down and in, pelvis neutral, breath into the low
// back. br pairs the tone with the figure's breathing sway.
{n:"Posture reset",pos:'standing',cue:"Exhale the ribs down — breathe into your low back",dur:30,bil:false,cyc:5.0,cam:40,tdur:15,br:true,pin:"LR",
 setup:"Stand up one last time. Feet hip width, arms easy at your sides.",
 A:{p:[0,55.4,0],yaw:16,tw:0,s:[7,3],hf:4,aL:[6,-8,4,-6],aR:[6,8,4,6],
    lL:[-2,-6,2,-5],lR:[2,6,-2,5]},
 B:{p:[0,55.6,0],yaw:16,tw:0,s:[1,0],hf:0,aL:[6,-8,4,-6],aR:[6,8,4,6],
    lL:[-2,-6,2,-5],lR:[2,6,-2,5]}}
];
