const MOVES=[
{n:"Deep squats",cue:"Sink until you're almost sitting on your heels",dur:30,bil:false,cyc:2.8,pin:"LR",
 A:{p:[0,55.2,0],yaw:22,tw:0,s:[3,3],aL:[4,-10,4,-8],aR:[-2,10,-2,8],lL:[-3,-5,3,-4],lR:[3,5,-3,4]},
 B:{p:[0,78,-12],yaw:22,tw:0,s:[26,20],hf:-6,ikL:{w:[-9,68,12]},ikR:{w:[9,68,12]},
    aL:[0,0,0,0],aR:[0,0,0,0],lL:[0,0,0,0],lR:[0,0,0,0]}},

{n:"Parallel squats",cue:"Stop at thighs parallel, chest up",dur:30,bil:false,cyc:2.4,pin:"LR",
 A:{p:[0,55.2,0],yaw:22,tw:0,s:[3,3],aL:[4,-10,4,-8],aR:[-2,10,-2,8],lL:[-3,-5,3,-4],lR:[3,5,-3,4]},
 B:{p:[0,71,-11],yaw:22,tw:0,s:[20,16],hf:-4,ikL:{w:[-9,62,12]},ikR:{w:[9,62,12]},
    aL:[0,0,0,0],aR:[0,0,0,0],lL:[0,0,0,0],lR:[0,0,0,0]}},

{n:"Knee circles",cue:"Hands on bent knees, feet planted, circle the knees",dur:30,bil:true,cyc:3.2,
 pin:"LR",orb:{swivel:true,amp:26},
 A:{p:[0,62.2,0],yaw:-22,tw:0,s:[74,80],hf:22,ikL:{k:"knL"},ikR:{k:"knR"},
    aL:[0,0,0,0],aR:[0,0,0,0],lL:[48,-13,-18,13],lR:[48,13,-18,-13]},
 B:{p:[0,62.2,0],yaw:-22,tw:0,s:[74,80],hf:22,ikL:{k:"knL"},ikR:{k:"knR"},
    aL:[0,0,0,0],aR:[0,0,0,0],lL:[48,-13,-18,13],lR:[48,13,-18,-13]}},

{n:"Reverse lunges",cue:"Step back, front shin stays vertical",dur:30,bil:true,cyc:3.2,pin:"R",
 A:{p:[0,55.2,0],yaw:24,tw:0,s:[2,2],aL:[-6,-10,-6,-8],aR:[6,10,6,8],lL:[-4,-6,4,-5],lR:[4,6,-4,5]},
 M:{p:[0,63,-8],yaw:24,tw:0,s:[5,3],aL:[-2,-10,-2,-8],aR:[2,10,2,8],lL:[8,-6,-70,-5],lR:[4,6,-4,5]},
 B:{p:[0,72,-18],yaw:24,tw:0,s:[8,6],aL:[2,-10,4,-8],aR:[-2,10,-4,8],lL:[-12,-6,-94,-5],lR:[4,6,-4,5]}},

{n:"Hip hinges",cue:"Deadlift pattern — push the hips straight back",dur:30,bil:false,cyc:2.8,pin:"LR",
 A:{p:[0,55.2,0],yaw:24,tw:0,s:[2,2],aL:[0,-9,0,-7],aR:[0,9,0,7],lL:[-4,-6,4,-5],lR:[4,6,-4,5]},
 B:{p:[0,57.5,-9],yaw:24,tw:0,s:[52,56],hf:-14,aL:[0,-8,0,-6],aR:[0,8,0,6],
    lL:[0,0,0,0],lR:[0,0,0,0]}},

{n:"Folded cat-cows",cue:"Hands on bent knees, round then arch the spine",dur:30,bil:false,cyc:3.4,pin:"LR",
 A:{p:[0,64,0],yaw:22,tw:0,s:[74,86],hf:28,ikL:{k:"knL"},ikR:{k:"knR"},
    aL:[0,0,0,0],aR:[0,0,0,0],lL:[40,-6,-40,-5],lR:[40,6,-40,5]},
 B:{p:[0,64,0],yaw:22,tw:0,s:[72,70],hf:-26,ikL:{k:"knL"},ikR:{k:"knR"},
    aL:[0,0,0,0],aR:[0,0,0,0],lL:[40,-6,-40,-5],lR:[40,6,-40,5]}},

{n:"Cobra press-ups",cue:"Press the chest up, hips stay down",dur:60,bil:false,cyc:3.2,
 A:{p:[0,90.5,4],yaw:18,tw:0,s:[74,66],hf:10,ikL:{w:[-9,93,20]},ikR:{w:[9,93,20]},
    aL:[0,0,0,0],aR:[0,0,0,0],lL:[-92,-6,-88,-5],lR:[-96,6,-92,5]},
 B:{p:[0,90.5,4],yaw:18,tw:0,s:[46,24],hf:-22,ikL:{w:[-9,93,20]},ikR:{w:[9,93,20]},
    aL:[0,0,0,0],aR:[0,0,0,0],lL:[-92,-6,-88,-5],lR:[-96,6,-92,5]}},

{n:"Pedaling down dog",cue:"Alternate pressing each heel down",dur:60,bil:false,cyc:2.2,
 A:{p:[0,56,-2],yaw:20,tw:0,s:[136,136],hf:20,ikL:{w:[-9,93,34]},ikR:{w:[9,93,34]},
    aL:[0,0,0,0],aR:[0,0,0,0],lL:[-24,-6,-24,-5],lR:[-20,6,-40,5]},
 B:{p:[0,56,-2],yaw:20,tw:0,s:[136,136],hf:20,ikL:{w:[-9,93,34]},ikR:{w:[9,93,34]},
    aL:[0,0,0,0],aR:[0,0,0,0],lL:[-20,-6,-40,-5],lR:[-24,6,-24,5]}},

{n:"Tuck + untuck",cue:"Back stays on the floor — only the pelvis rolls",dur:60,bil:false,cyc:3.6,pin:"LR",
 A:{p:[0,89.5,3],yaw:14,tw:0,s:[-84,-90],hf:-4,ikL:{w:[-12,91.5,-4]},ikR:{w:[12,91.5,-4]},
    aL:[0,0,0,0],aR:[0,0,0,0],ikFL:[-5,93,12],ikFR:[5,93,12]},
 B:{p:[0,89.5,3],yaw:14,tw:0,s:[-92,-86],hf:2,ikL:{w:[-12,91.5,-4]},ikR:{w:[12,91.5,-4]},
    aL:[0,0,0,0],aR:[0,0,0,0],ikFL:[-5,93,12],ikFR:[5,93,12]}},

{n:"90/90 with a fold",cue:"Z-sit: front shin across, back shin behind — fold forward",dur:60,bil:true,cyc:3.4,cam:58,
 A:{p:[0,90,0],yaw:-8,tw:0,s:[6,4],hf:0,ikL:{w:[-14,92,-6]},ikR:{w:[10,92,6]},
    aL:[0,0,0,0],aR:[0,0,0,0],lR:[88,12,6,-86],lL:[57,-76,-90,-6]},
 B:{p:[0,90,0],yaw:-8,tw:0,s:[42,48],hf:-8,ikL:{w:[-4,92,16]},ikR:{w:[12,92,18]},
    aL:[0,0,0,0],aR:[0,0,0,0],lR:[88,12,6,-86],lL:[57,-76,-90,-6]}},

{n:"Thread the needle",cue:"Reach up, then slide the arm under",dur:60,bil:true,cyc:3.6,pin:"LR",
 A:{p:[0,74,-2],yaw:16,tw:52,s:[-74,-74],hf:-18,ikL:{w:[-9,93,-14]},
    aL:[0,0,0,0],aR:[-58,58,-68,54],lL:[0,-6,90,-5],lR:[4,6,94,5]},
 B:{p:[0,76,-2],yaw:16,tw:-58,s:[-78,-86],hf:26,ikL:{w:[-9,93,-14]},
    aL:[0,0,0,0],aR:[72,-74,62,-70],lL:[0,-6,90,-5],lR:[4,6,94,5]}},

{n:"Plank hold",pin:"LR",cue:"One straight line, push the floor away",dur:60,bil:false,cyc:4.0,
 A:{p:[0,84,0],yaw:24,tw:0,s:[80,80],hf:18,ikL:{w:[-7,93,32]},ikR:{w:[7,93,32]},
    aL:[0,0,0,0],aR:[0,0,0,0],lL:[-80,-6,-88,-5],lR:[-80,6,-88,5]},
 B:{p:[0,82,0],yaw:24,tw:0,s:[80,80],hf:18,ikL:{w:[-7,93,32]},ikR:{w:[7,93,32]},
    aL:[0,0,0,0],aR:[0,0,0,0],lL:[-80,-6,-88,-5],lR:[-80,6,-88,5]}}
];
