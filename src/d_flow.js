const MOVES=[
{n:"Bouncing in place",pos:'standing',cue:"Light bounces, everything loose",dur:50,bil:false,cyc:1.0,
 A:{p:[0,57,0],yaw:22,tw:0,s:[4,4],hf:0,aL:[8,-11,14,-9],aR:[8,11,14,9],ikFL:[-5,93,1],ikFR:[5,93,1]},
 B:{p:[0,61,0],yaw:22,tw:0,s:[5,5],hf:0,aL:[16,-12,26,-10],aR:[16,12,26,10],ikFL:[-5,93,1],ikFR:[5,93,1]}},

{n:"Rotations with shoulder slaps",pos:'standing',cue:"Twist from the waist, arms swing free",dur:50,bil:false,cyc:1.8,
 A:{p:[0,58,0],yaw:-6,tw:44,s:[4,4],hf:34,aL:[62,-56,84,-30],aR:[70,34,96,58],ikFL:[-6,93,1],ikFR:[6,93,1]},
 B:{p:[0,58,0],yaw:-6,tw:-44,s:[4,4],hf:-34,aL:[70,-34,96,-58],aR:[62,56,84,30],ikFL:[-6,93,1],ikFR:[6,93,1]}},

{n:"Arm sweeps with knee dip",pos:'standing',cue:"Arms sweep, knees dip in rhythm",dur:50,bil:false,cyc:2.0,
 A:{p:[0,58,0],yaw:24,tw:0,s:[4,4],hf:-6,aL:[62,-10,72,-8],aR:[58,10,68,8],ikFL:[-5,93,1],ikFR:[5,93,1]},
 B:{p:[0,70,-3],yaw:24,tw:0,s:[16,12],hf:8,aL:[-46,-10,-54,-8],aR:[-50,10,-58,8],ikFL:[-5,93,1],ikFR:[5,93,1]}},

{n:"Punching rotations",pos:'standing',cue:"Horse stance — punch out, push the shoulder blade forward",dur:50,bil:true,cyc:1.6,
 A:{p:[0,69,0],yaw:-16,tw:26,s:[4,4],hf:22,aL:[80,-64,86,-70],aR:[86,20,90,6],ikFL:[-14,93,1],ikFR:[14,93,1],swL:-20,swR:55},
 B:{p:[0,69,0],yaw:-16,tw:-26,s:[4,4],hf:-22,aL:[86,-20,90,-6],aR:[80,64,86,70],ikFL:[-14,93,1],ikFR:[14,93,1],swL:-20,swR:55}},

{n:"Dynamic lateral reaches",pos:'standing',cue:"Reach long overhead, lean to the far side",dur:50,bil:true,cyc:2.2,
 A:{p:[0,60,0],yaw:-18,tw:0,s:[4,-16],hf:-14,aL:[6,-40,4,-30],aR:[-8,44,-4,26],ikFL:[-12,93,1],ikFR:[12,93,1]},
 B:{p:[0,60,0],yaw:-18,tw:0,s:[4,16],hf:14,aL:[-8,-44,-4,-26],aR:[6,40,4,30],ikFL:[-12,93,1],ikFR:[12,93,1]}},

{n:"Cross-body knee drives",pos:'standing',cue:"Knee up, opposite elbow to meet it",dur:50,bil:true,cyc:1.4,
 A:{p:[0,58,0],yaw:-20,tw:18,s:[6,8],hf:12,aL:[68,-30,102,10],aR:[-34,26,-46,18],
    lL:[86,-8,-38,-6],ikFR:[6,93,1]},
 B:{p:[0,58,0],yaw:-20,tw:-18,s:[6,8],hf:-12,aL:[-34,-26,-46,-18],aR:[68,30,102,-10],
    ikFL:[-6,93,1],lR:[86,8,-38,6]}},

{n:"Chest opener swings",pos:'standing',cue:"Swing wide open, then cross in front",dur:50,bil:false,cyc:1.8,
 A:{p:[0,58,0],yaw:-14,tw:0,s:[3,3],hf:-6,aL:[80,-78,84,-84],aR:[80,78,84,84],ikFL:[-7,93,1],ikFR:[7,93,1]},
 B:{p:[0,58,0],yaw:-14,tw:0,s:[6,6],hf:6,aL:[86,26,88,44],aR:[86,-26,88,-44],ikFL:[-7,93,1],ikFR:[7,93,1]}},

{n:"Hip circles",pos:'standing',cue:"Hands on hips, big slow circles",dur:50,bil:true,cyc:2.6,
 orb:{hips:true,rx:9,rz:8,ry:2},
 A:{p:[0,60,0],yaw:20,tw:0,s:[4,4],hf:0,ikL:{k:"hpL"},ikR:{k:"hpR"},
    aL:[0,0,0,0],aR:[0,0,0,0],ikFL:[-8,93,1],ikFR:[8,93,1]},
 B:{p:[0,60,0],yaw:20,tw:0,s:[4,4],hf:0,ikL:{k:"hpL"},ikR:{k:"hpR"},
    aL:[0,0,0,0],aR:[0,0,0,0],ikFL:[-8,93,1],ikFR:[8,93,1]}},

{n:"Bent rotation sweeps",pos:'standing',cue:"Hinged forward, let the arms wrap around",dur:50,bil:false,cyc:2.0,
 A:{p:[0,62,-4],yaw:6,tw:40,s:[54,58],hf:26,aL:[60,-58,72,-40],aR:[66,30,80,50],ikFL:[-7,93,1],ikFR:[7,93,1]},
 B:{p:[0,62,-4],yaw:6,tw:-40,s:[54,58],hf:-26,aL:[66,-30,80,-50],aR:[60,58,72,40],ikFL:[-7,93,1],ikFR:[7,93,1]}},

{n:"Lateral weight shifts",pos:'standing',cue:"Sink into one hip, press the outside edge of that foot",dur:50,bil:true,cyc:2.2,
 A:{p:[-7,66,0],yaw:-18,tw:0,s:[4,-10],hf:-12,aL:[74,-52,80,-64],aR:[64,30,70,20],
    ikFL:[-14,93,1],ikFR:[14,93,1]},
 B:{p:[7,66,0],yaw:-18,tw:0,s:[4,10],hf:12,aL:[64,-30,70,-20],aR:[74,52,80,64],
    ikFL:[-14,93,1],ikFR:[14,93,1]}}
];
