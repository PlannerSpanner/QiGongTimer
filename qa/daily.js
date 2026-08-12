// Daily 10 form invariants, checked against the BUILT page (research-anchored; see
// docs/movement-reference.md): dips never below parallel, dead bug lumbar flat,
// glute bridge extends at the hip not the lumbar spine, half-kneel tucks BEFORE it
// shifts, row torso never heaves, session lands on exactly 600s including gaps.
const fs=require('fs'),path=require('path');const ROOT=path.join(__dirname,'..');
const h=fs.readFileSync(path.join(ROOT,'daily-10.html'),'utf8');
const js=h.split('<script>')[1].split('</script>')[0];
const core=js.slice(0,js.indexOf('const layer=document.getElementById'));
const {MOVES,solve,poseAt}=new Function(core+'\nreturn {MOVES,solve,poseAt};')();
let fail=false;
const check=(name,ok)=>{console.log(`${name.padEnd(58)} ${ok?'ok':'FAIL'}`);if(!ok)fail=true;};
const get=n=>MOVES.find(m=>m.n===n);
const PH=[...Array(25)].map((_,i)=>i/24);
const ang=(a,b,c)=>{const u=a.map((v,i)=>v-b[i]),w=c.map((v,i)=>v-b[i]);
  const d=(u[0]*w[0]+u[1]*w[1]+u[2]*w[2])/((Math.hypot(...u)*Math.hypot(...w))||1);
  return Math.acos(Math.max(-1,Math.min(1,d)))*180/Math.PI;};

// dips: at EVERY animation phase the shoulder stays at or above the elbow (y-down:
// shoulder y <= elbow y). Parallel is the hard floor of the rep — AC joint rule.
{const m=get('Bench dips');let worst=1e9;
 for(const ph of PH){const j=solve(poseAt(m,ph));
   worst=Math.min(worst,j.elL[1]-j.shL[1],j.elR[1]-j.shR[1]);}
 check(`dips never below parallel (margin ${worst.toFixed(1)})`,worst>=-0.3);}

// dead bug: lumbar stays flat — spine values identical in every keyframe, pelvis still
{const m=get('Dead bug');let ok=true;
 for(const ph of PH){const p=poseAt(m,ph);
   if(Math.abs(p.s[0]-m.A.s[0])>0.01||Math.abs(p.s[1]-m.A.s[1])>0.01
     ||Math.abs(p.p[1]-m.A.p[1])>0.01)ok=false;}
 check('dead bug lumbar flat (spine + pelvis constant)',ok);}

// glute bridge: top is a straight knee-hip-shoulder line per side, torso one slab
{const m=get('Glute bridge');const j=solve(poseAt(m,0.5));
 const L=ang(j.knL,j.hpL,j.shL),R=ang(j.knR,j.hpR,j.shR);
 check(`bridge top line L ${L.toFixed(0)} R ${R.toFixed(0)} (hip ext, no arch)`,L>165&&R>165);
 // the lying A pose has natural curvature (s0!=s1); the top must be a flat slab and
 // the curve must never exceed the starting curve on the way up (no arch to get height)
 const base=Math.abs(m.A.s[0]-m.A.s[1]);let arch=0;
 for(const ph of PH){const p=poseAt(m,ph);arch=Math.max(arch,Math.abs(p.s[0]-p.s[1]));}
 const top=poseAt(m,0.5);
 check('bridge top torso is one slab, arch never grows',Math.abs(top.s[0]-top.s[1])<0.01&&arch<=base+0.01);
 const a=solve(poseAt(m,0));
 check('bridge shoulders stay down',Math.abs(a.neck[1]-j.neck[1])<2.5);}

// half-kneel: tuck (M) happens with NO forward travel; the shift is only M->B, and
// the planted rear knee never slides
{const m=get('Half-kneeling hip flexor stretch');
 const pA=poseAt(m,0),pM=poseAt(m,0.25),pB=poseAt(m,0.5);
 check('half-kneel tuck first (M has no forward travel)',Math.abs(pM.p[2]-pA.p[2])<0.6);
 check('half-kneel tuck reads (spine change at M)',pA.s[0]-pM.s[0]>8);
 check('half-kneel then shifts (B forward of A)',pB.p[2]-pA.p[2]>2.5);
 const kA=solve(pA).knL,kB=solve(pB).knL;
 check('half-kneel rear knee stays put',Math.hypot(kA[0]-kB[0],kA[1]-kB[1],kA[2]-kB[2])<2.5);}

// row: hinge angle held — chest height constant through the pull
{const m=get('Dumbbell bent-over row');let hv=0;const c0=solve(poseAt(m,0)).chest[1];
 for(const ph of PH)hv=Math.max(hv,Math.abs(solve(poseAt(m,ph)).chest[1]-c0));
 check(`row torso never heaves (chest sway ${hv.toFixed(1)})`,hv<1.5);}

// timing: work + authored gaps == 600s exactly; every movement past the first has
// an authored setup script
{const work=MOVES.reduce((a,m)=>a+m.dur,0);
 const gaps=MOVES.slice(1).reduce((a,m)=>a+(m.tdur||10),0);
 check(`session is 10:00 exactly (${work}s work + ${gaps}s gaps)`,work+gaps===600);
 check('every movement has an authored setup script',MOVES.every(m=>typeof m.setup==='string'&&m.setup.length>10));}

console.log(fail?'DAILY FAIL':'DAILY PASS');
process.exit(fail?1:0);
