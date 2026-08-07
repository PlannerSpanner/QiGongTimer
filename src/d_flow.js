const MOVES=[
{n:"Bouncing in place",pos:'standing',cue:"Light bounces, everything loose",dur:50,bil:false,cyc:1.0,
 A:{p:[0,57,0],yaw:22,tw:0,s:[4,4],hf:0,aL:[8,-11,14,-9],aR:[8,11,14,9],ikFL:[-5,93,1],ikFR:[5,93,1]},
 B:{p:[0,61,0],yaw:22,tw:0,s:[5,5],hf:0,aL:[16,-12,26,-10],aR:[16,12,26,10],ikFL:[-5,93,1],ikFR:[5,93,1]}},

{n:"Rotations with shoulder slaps",pos:'standing',cue:"Twist from the waist — slap the shoulder, tap the low back",dur:50,bil:false,cyc:1.8,
 A:{p:[0,58,0],yaw:-6,tw:-44,s:[4,4],hf:-12,ikR:{w:[-7.7,32,-1.3]},ikL:{w:[6,65,-7]},ikFL:[-6,93,1],ikFR:[6,93,1]},
 M:{p:[0,58,0],yaw:-6,tw:0,s:[4,4],hf:0,ikL:{w:[-29,29,8]},ikR:{w:[29,29,8]},ikFL:[-6,93,1],ikFR:[6,93,1]},
 B:{p:[0,58,0],yaw:-6,tw:44,s:[4,4],hf:12,ikL:{w:[7.8,32,0.3]},ikR:{w:[-6,65,-7]},ikFL:[-6,93,1],ikFR:[6,93,1]}},

{n:"Arm sweeps with knee dip",pos:'standing',cue:"Arms sweep, knees dip in rhythm",dur:50,bil:false,cyc:2.0,
 A:{p:[0,58,0],yaw:24,tw:0,s:[4,4],hf:-6,aL:[62,-10,72,-8],aR:[58,10,68,8],ikFL:[-5,93,1],ikFR:[5,93,1]},
 B:{p:[0,70,-3],yaw:24,tw:0,s:[16,12],hf:8,aL:[-46,-10,-54,-8],aR:[-50,10,-58,8],ikFL:[-5,93,1],ikFR:[5,93,1]}},

{n:"Punching rotations",pos:'standing',cue:"Stand tall, knees soft — punch out, push the shoulder blade forward",dur:50,bil:false,cyc:1.6,
 A:{p:[0,61,0],yaw:-16,tw:26,s:[4,4],hf:22,aL:[80,-64,86,-70],aR:[86,20,90,6],ikFL:[-12,93,1],ikFR:[12,93,1],swL:-10,swR:28},
 B:{p:[0,61,0],yaw:-16,tw:-26,s:[4,4],hf:-22,aL:[86,-20,90,-6],aR:[80,64,86,70],ikFL:[-12,93,1],ikFR:[12,93,1],swL:-10,swR:28}},

{n:"Dynamic lateral reaches",pos:'standing',cue:"Reach long overhead, lean to the far side",dur:50,bil:false,cyc:2.2,pin:'LR',
 A:{p:[0,60,0],yaw:-18,tw:0,sl:-16,s:[4,6],hf:-4,ikR:{w:[-8,12,2]},ikL:{w:[-11,64,3]},ikFL:[-12,93,1],ikFR:[12,93,1]},
 B:{p:[0,60,0],yaw:-18,tw:0,sl:16,s:[4,6],hf:-4,ikL:{w:[8,12,2]},ikR:{w:[11,64,3]},ikFL:[-12,93,1],ikFR:[12,93,1]}},

{n:"Cross-body knee drives",pos:'standing',cue:"Knee up, opposite elbow to meet it",dur:50,bil:false,cyc:1.4,
 A:{p:[0,58,0],yaw:0,tw:14,s:[6,8],hf:12,aL:[-26,-12,-42,-8],aR:[26,-22,58,-30],
    lL:[100,20,-38,6],swL:25,ikFR:[6,93,1]},
 M:{p:[0,55.8,0],yaw:0,tw:0,s:[4,5],hf:0,aL:[8,-9,10,-7],aR:[8,9,10,7],
    ikFL:[-6,93,1],ikFR:[6,93,1]},
 B:{p:[0,58,0],yaw:0,tw:-14,s:[6,8],hf:-12,aL:[26,22,58,30],aR:[-26,12,-42,8],
    ikFL:[-6,93,1],lR:[100,-20,-38,-6],swR:-25}},

{n:"Chest opener swings",pos:'standing',cue:"Swing wide open, then cross in front",dur:50,bil:false,cyc:1.8,
 A:{p:[0,58,0],yaw:-14,tw:0,s:[3,3],hf:-6,aL:[80,-78,84,-84],aR:[80,78,84,84],ikFL:[-7,93,1],ikFR:[7,93,1]},
 B:{p:[0,58,0],yaw:-14,tw:0,s:[6,6],hf:6,aL:[86,26,88,44],aR:[86,-26,88,-44],ikFL:[-7,93,1],ikFR:[7,93,1]}},

{n:"Hip circles",pos:'standing',cue:"Hands on hips, big slow circles",dur:60,bil:true,cyc:2.6,
 orb:{hips:true,rx:9,rz:8,ry:2},
 A:{p:[0,60,0],yaw:20,tw:0,s:[4,4],hf:0,ikL:{k:"hpL"},ikR:{k:"hpR"},
    aL:[0,0,0,0],aR:[0,0,0,0],ikFL:[-8,93,1],ikFR:[8,93,1]},
 B:{p:[0,60,0],yaw:20,tw:0,s:[4,4],hf:0,ikL:{k:"hpL"},ikR:{k:"hpR"},
    aL:[0,0,0,0],aR:[0,0,0,0],ikFL:[-8,93,1],ikFR:[8,93,1]}},

{n:"Bent rotation sweeps",pos:'standing',cue:"Hinged forward, sweep the arms floor to sky",dur:50,bil:false,cyc:2.0,
 A:{p:[0,62,-4],yaw:6,tw:40,s:[54,58],hf:26,aL:[2,-4,2,-3],aR:[176,8,174,6],ikFL:[-7,93,1],ikFR:[7,93,1]},
 B:{p:[0,62,-4],yaw:6,tw:-40,s:[54,58],hf:-26,aL:[176,16,174,14],aR:[2,-17,2,-15],ikFL:[-7,93,1],ikFR:[7,93,1]}},

{n:"Lateral weight shifts",pos:'standing',cue:"Sink into one hip, press the outside edge of that foot",dur:50,bil:false,cyc:2.2,
 A:{p:[-7,66,0],yaw:-18,tw:0,s:[4,-10],hf:-12,aL:[74,-52,80,-64],aR:[64,30,70,20],
    ikFL:[-14,93,1],ikFR:[14,93,1]},
 B:{p:[7,66,0],yaw:-18,tw:0,s:[4,10],hf:12,aL:[64,-30,70,-20],aR:[74,52,80,64],
    ikFL:[-14,93,1],ikFR:[14,93,1]}}
];
