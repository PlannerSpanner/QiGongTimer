// ---------- projection / drawing ----------
const lerp=(a,b,t)=>a+(b-a)*t;
const lerpA=(a,b,t)=>(a&&b)?a.map((v,i)=>lerp(v,b[i],t)):(a||b||null);
function lerpT(A,B,t){if(!A&&!B)return null; if(A&&A.k)return A;
  if(A&&B&&A.w&&B.w)return {w:lerpA(A.w,B.w,t)}; return A||B;}
// A leg may be described by joint angles (lL/lR) or by a world foot target (ikFL/ikFR).
// If the two keyframes disagree, convert the angle-based one to a foot target so the
// pair can be interpolated in the same space.
function normalise(m){
  if(m._norm) return; m._norm=true;
  const KF=[m.A,m.B,m.M].filter(Boolean);
  // a foot listed in m.pin is nailed to wherever it starts, in every keyframe
  if(m.pin){
    const j=solve(m.A);
    if(m.pin.indexOf('L')>=0){const t=j.ftL.slice(); KF.forEach(k=>k.ikFL=t.slice());}
    if(m.pin.indexOf('R')>=0){const t=j.ftR.slice(); KF.forEach(k=>k.ikFR=t.slice());}
  }
  // if keyframes mix leg representations, convert the odd ones out to foot targets
  [['ikFL','ftL'],['ikFR','ftR']].forEach(([ikf,joint])=>{
    const n=KF.filter(k=>k[ikf]).length;
    if(n>0&&n<KF.length) KF.forEach(k=>{ if(!k[ikf]) k[ikf]=solve(k)[joint].slice(); });
  });
  [['lL','ikFL','ftL'],['lR','ikFR','ftR']].forEach(([ang,ikf,joint])=>{
    const a=m.A[ikf], b=m.B[ikf];
    if(!!a===!!b) return;
    [m.A,m.B].forEach(p=>{ if(!p[ikf]) p[ikf]=solve(p)[joint].slice(); });
  });
}
function blend(A,B,t){const o={swL:lerp(A.swL||0,B.swL||0,t),swR:lerp(A.swR||0,B.swR||0,t),sl:lerp(A.sl||0,B.sl||0,t),
  p:lerpA(A.p,B.p,t),yaw:lerp(A.yaw,B.yaw,t),tw:lerp(A.tw,B.tw,t),
  s:lerpA(A.s,B.s,t),hf:lerp(A.hf||0,B.hf||0,t),aL:lerpA(A.aL,B.aL,t),aR:lerpA(A.aR,B.aR,t),
  ikL:lerpT(A.ikL,B.ikL,t),ikR:lerpT(A.ikR,B.ikR,t)};
  if(A.ikFL&&B.ikFL) o.ikFL=lerpA(A.ikFL,B.ikFL,t); else o.lL=lerpA(A.lL,B.lL,t);
  if(A.ikFR&&B.ikFR) o.ikFR=lerpA(A.ikFR,B.ikFR,t); else o.lR=lerpA(A.lR,B.lR,t);
  if(!o.lL) o.lL=A.lL||B.lL||[0,0,0,0];
  if(!o.lR) o.lR=A.lR||B.lR||[0,0,0,0];
  return o;}
const easeQ=t=>t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
function poseAt(m,ph){
  normalise(m);
  if(m.orb) return orbitPose(m.A,m.orb,ph*2*Math.PI);
  const tri=ph<0.5?ph*2:(1-ph)*2;
  if(m.M) return tri<0.5 ? blend(m.A,m.M,easeQ(tri*2)) : blend(m.M,m.B,easeQ((tri-0.5)*2));
  return blend(m.A,m.B,easeQ(tri));}
let CAM=40; const PITCH=13;
function project(v){const c=Math.cos(R(CAM)),s=Math.sin(R(CAM));
  const x=v[0]*c+v[2]*s, z=-v[0]*s+v[2]*c;
  return {x,y:v[1]*Math.cos(R(PITCH))+z*Math.sin(R(PITCH)),d:z};}
const LIMBS=[['shL','elL'],['elL','haL'],['shR','elR'],['elR','haR'],
             ['hpL','knL'],['knL','ftL'],['hpR','knR'],['knR','ftR']];
const INK='#6d4f1c',LIMB_L='#c2a473',TORSO='#7d5a1e',BELLY='#7d5a1e';
function fitOf(m){CAM=m.cam||40;let a=1e9,b=-1e9,c=1e9,d=-1e9;
  for(let i=0;i<=24;i++){const j=solve(poseAt(m,i/24));
    for(const k in j){const q=project(j[k]);
      a=Math.min(a,q.x);b=Math.max(b,q.x);c=Math.min(c,q.y);d=Math.max(d,q.y);}}
  a-=8;b+=8;c-=9;d+=8;
  const sc=Math.min(100/(b-a),100/(d-c));
  return {sc,ox:(100-(b-a)*sc)/2-a*sc,oy:(100-(d-c)*sc)/2-c*sc};}
const layer=document.getElementById('layer'), shadowEl=document.getElementById('shadow');
const PROP='#b9a98b';
let propMk='';
function buildProps(m,fit){
  CAM=m.cam||40;
  if(!m.prop){propMk='';return;}
  const S=v=>{const q=project(v);return {x:q.x*fit.sc+fit.ox,y:q.y*fit.sc+fit.oy};};
  const w=(1.6*fit.sc).toFixed(2);
  propMk=m.prop.map(p=>{
    if(p.l){const a=S(p.l[0]),b=S(p.l[1]);
      return `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${PROP}" stroke-width="${w}" stroke-linecap="round"/>`;}
    const c=S(p.c[0]);
    return `<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="${(p.c[1]*fit.sc).toFixed(1)}" fill="none" stroke="${PROP}" stroke-width="${w}"/>`;
  }).join('');
}
function drawFig(m,fit,ph){
  CAM=m.cam||40;
  const pose=poseAt(m,ph);
  const j=solve(pose), P={};
  for(const k in j){const q=project(j[k]);P[k]={x:q.x*fit.sc+fit.ox,y:q.y*fit.sc+fit.oy,d:q.d};}
  const side=n=>n.endsWith('L')?LIMB_L:INK;
  const parts=LIMBS.map(([x,y])=>({t:'l',a:P[x],b:P[y],d:(P[x].d+P[y].d)/2,col:side(y),w:1}));
  parts.push({t:'l',a:P.ftL,b:P.toeL,d:(P.ftL.d+P.toeL.d)/2,col:LIMB_L,w:0.8});
  parts.push({t:'l',a:P.ftR,b:P.toeR,d:(P.ftR.d+P.toeR.d)/2,col:INK,w:0.8});
  parts.push({t:'q',pts:[P.shL,P.shR,P.hpR,P.hpL],d:(P.shL.d+P.shR.d+P.hpL.d+P.hpR.d)/4});
  if(m.belly){
    const u=nrm(sub(j.chest,j.pelvis));
    const lat=rotY([1,0,0],pose.yaw);
    const f=nrm(cross(u,lat));                       // trunk's true front, follows pitch
    const mid=[(j.chest[0]*0.45+j.pelvis[0]*0.55),(j.chest[1]*0.45+j.pelvis[1]*0.55),(j.chest[2]*0.45+j.pelvis[2]*0.55)];
    const cq=project(mid), fq=project(add(mid,f,4));
    const cs={x:cq.x*fit.sc+fit.ox,y:cq.y*fit.sc+fit.oy};
    let fx=fq.x*fit.sc+fit.ox-cs.x, fy=fq.y*fit.sc+fit.oy-cs.y;
    const flen=Math.hypot(fx,fy), q=flen/(4*fit.sc);
    const bd=project(add(mid,f,4.8)).d;
    // facing the viewer -> full circle; in profile -> half-disc with its flat edge on the trunk;
    // in between, the back half flattens smoothly so the shape never pops
    const k=Math.max(0,Math.min(1,(0.82-q)/0.32));
    if(flen<0.5){fx=0;fy=1;}else{fx/=flen;fy/=flen;}
    const px=-fy, py=fx, r=7.9*fit.sc;
    const pts=[];
    for(let a=-90;a<=90;a+=15){const ca=Math.cos(a*Math.PI/180),sa=Math.sin(a*Math.PI/180);
      pts.push((cs.x+r*(sa*px+ca*fx)).toFixed(2)+','+(cs.y+r*(sa*py+ca*fy)).toFixed(2));}
    for(let a=105;a<255;a+=15){const ca=Math.cos(a*Math.PI/180)*k,sa=Math.sin(a*Math.PI/180);
      pts.push((cs.x+r*(sa*px+ca*fx)).toFixed(2)+','+(cs.y+r*(sa*py+ca*fy)).toFixed(2));}
    parts.push({t:'bp',pts,d:bd});
  }
  // neck line ends at the head circle's rim, so it can never lie across the face
  {
    const dx=P.head.x-P.neck.x, dy=P.head.y-P.neck.y, dl=Math.hypot(dx,dy)||1;
    const r=L.hr*fit.sc*0.8;
    parts.push({t:'l',a:P.neck,b:{x:P.head.x-dx/dl*r,y:P.head.y-dy/dl*r},d:(P.neck.d+P.head.d)/2,col:INK,w:0.82});
  }
  parts.push({t:'h',c:P.head,d:P.head.d+0.02});
  parts.sort((x,y)=>x.d-y.d);
  layer.innerHTML=propMk+parts.map(p=>{
    if(p.t==='l')return `<line x1="${p.a.x.toFixed(2)}" y1="${p.a.y.toFixed(2)}" x2="${p.b.x.toFixed(2)}" y2="${p.b.y.toFixed(2)}" stroke="${p.col}" stroke-width="${(3.0*(p.w||1)*fit.sc).toFixed(2)}" stroke-linecap="round"/>`;
    if(p.t==='q')return `<polygon points="${p.pts.map(q=>q.x.toFixed(2)+','+q.y.toFixed(2)).join(' ')}" fill="${TORSO}" stroke="${TORSO}" stroke-width="${(2.6*fit.sc).toFixed(2)}" stroke-linejoin="round"/>`;
    if(p.t==='bp')return `<polygon points="${p.pts.join(' ')}" fill="${BELLY}"/>`;
    if(p.t==='bc')return `<circle cx="${p.c.x.toFixed(2)}" cy="${p.c.y.toFixed(2)}" r="${p.r.toFixed(2)}" fill="${BELLY}"/>`;
    return `<circle cx="${p.c.x.toFixed(2)}" cy="${p.c.y.toFixed(2)}" r="${(L.hr*fit.sc).toFixed(2)}" fill="${INK}"/>`;}).join('');
}
// the floor is a fixed plane: its ellipse is placed once per movement and never moves
let mirrorOn=false;
function applyMirror(on){
  mirrorOn=on;
  if(on) layer.setAttribute('transform','translate(100 0) scale(-1 1)');
  else layer.removeAttribute('transform');
  shadowEl.setAttribute('cx',(on?100-groundCx:groundCx).toFixed(2));
}
let groundCx=50;
function placeGround(m,fit){
  CAM=m.cam||40;
  const j=solve(poseAt(m,0));
  const pts=['ftL','ftR','toeL','toeR','haL','haR','knL','knR'].map(k=>j[k]).filter(p=>p[1]>89.5);
  let gx=0,gz=0;
  if(pts.length){pts.forEach(p=>{gx+=p[0];gz+=p[2];});gx/=pts.length;gz/=pts.length;}
  const g=project([gx,93,gz]);
  groundCx=g.x*fit.sc+fit.ox;
  shadowEl.setAttribute('cx',groundCx.toFixed(2));
  shadowEl.setAttribute('cy',(g.y*fit.sc+fit.oy).toFixed(2));
  shadowEl.setAttribute('rx','40');
  shadowEl.setAttribute('ry',(40*Math.sin(R(PITCH))).toFixed(2));
}
MOVES.forEach(m=>m.fit=fitOf(m));

// ---------- timer ----------
const $=id=>document.getElementById(id);
let idx=0,timeLeft=0,running=false,started=false,tick=null,voiceOn=true,actx=null,wl=null,swAt=false;
// optional session-length toggle (enabled per app at build time): dm multiplies every
// movement duration. Locked once the session has started; Reset unlocks it.
const X2OPT=false;
let dm=1;
if(X2OPT){
  const tot=Math.round(MOVES.reduce((a,m)=>a+m.dur,0)/60);
  $('mNum').insertAdjacentHTML('beforebegin',
    '<style>.x2row{display:flex;gap:7px;justify-content:center;margin:0 0 11px}'
    +'.x2b{font-family:inherit;cursor:pointer;font-size:0.66rem;letter-spacing:0.5px;'
    +'padding:4px 13px;border-radius:20px;border:1px solid rgba(0,0,0,0.16);'
    +'background:transparent;color:inherit;opacity:0.5;transition:opacity 0.15s}'
    +'.x2b.on{opacity:1;font-weight:600;background:rgba(255,255,255,0.6)}</style>'
    +'<div class="x2row"><button class="x2b on" id="x1b"></button><button class="x2b" id="x2b"></button></div>');
  $('x1b').textContent=tot+' min'; $('x2b').textContent=(tot*2)+' min';
  const setM=k=>{if(started)return; dm=k;
    $('x1b').classList.toggle('on',k===1); $('x2b').classList.toggle('on',k===2);
    timeLeft=MOVES[0].dur*dm; clock();};
  $('x1b').onclick=()=>setM(1); $('x2b').onclick=()=>setM(2);
}
const dotsEl=$('dots');
MOVES.forEach((_,i)=>{const d=document.createElement('div');d.className='dot';d.id='d'+i;dotsEl.appendChild(d);});

async function lockScreen(){try{if('wakeLock'in navigator){wl=await navigator.wakeLock.request('screen');
  wl.addEventListener('release',()=>{wl=null;});}}catch(e){}}
function unlockScreen(){if(wl){wl.release();wl=null;}}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&running){lockScreen();sync();}});

function ac(){if(!actx)actx=new(window.AudioContext||window.webkitAudioContext)();return actx;}
function chime(f,v,d){try{const c=ac();if(c.state==='suspended')c.resume();
  const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(f,c.currentTime);
  g.gain.setValueAtTime(0,c.currentTime);g.gain.linearRampToValueAtTime(v,c.currentTime+0.05);
  g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+d);
  o.connect(g);g.connect(c.destination);o.start(c.currentTime);o.stop(c.currentTime+d);}catch(e){}}
// breath-tempo tone: gentle sine glide, quieter than the chimes. Rising = inhale,
// falling = exhale, fired from the animation loop so it stays locked to the figure.
function breathTone(f0,f1,d){try{const c=ac();if(c.state==='suspended')c.resume();
  const o=c.createOscillator(),g=c.createGain();o.type='sine';
  o.frequency.setValueAtTime(f0,c.currentTime);
  o.frequency.linearRampToValueAtTime(f1,c.currentTime+d);
  g.gain.setValueAtTime(0,c.currentTime);g.gain.linearRampToValueAtTime(0.055,c.currentTime+d*0.3);
  g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+d);
  o.connect(g);g.connect(c.destination);o.start(c.currentTime);o.stop(c.currentTime+d);}catch(e){}}
const cTrans=()=>{chime(440,.12,1);setTimeout(()=>chime(554.37,.1,.8),150);setTimeout(()=>chime(659.25,.08,.6),300);};
const cSwitch=()=>{chime(659.25,.1,.5);setTimeout(()=>chime(659.25,.1,.5),280);};
const cDone=()=>{chime(440,.12,1.2);setTimeout(()=>chime(554.37,.1,1),200);
  setTimeout(()=>chime(659.25,.1,1),400);setTimeout(()=>chime(880,.08,1.5),600);};
// pick the most natural installed voice: iOS/macOS "Enhanced"/"Premium" voices and
// Edge "Natural" voices beat the robotic default by a mile when present. The list is
// async on most browsers, so re-pick on voiceschanged.
let voicePick=null;
function pickVoice(){try{
  const vs=speechSynthesis.getVoices(); if(!vs||!vs.length)return;
  const NICE=['ava','zoe','samantha','allison','serena','karen','moira','tessa','nicky'];
  let best=null,bs=0;
  vs.forEach(v=>{
    if(!/^en/i.test(v.lang))return;
    const n=v.name.toLowerCase(); let s=0.1;
    if(n.includes('premium'))s+=8;
    if(n.includes('enhanced'))s+=6;
    if(n.includes('natural'))s+=6;
    if(n.startsWith('google'))s+=5;
    const i=NICE.findIndex(x=>n.includes(x)); if(i>=0)s+=4-i*0.1;
    if(/^en-us/i.test(v.lang))s+=1;
    if(v.localService)s+=0.5;
    if(s>bs){bs=s;best=v;}});
  if(best)voicePick=best;
}catch(e){}}
if(window.speechSynthesis&&speechSynthesis.getVoices){pickVoice();
  if(speechSynthesis.addEventListener)speechSynthesis.addEventListener('voiceschanged',pickVoice);}
function say(t){if(!voiceOn)return;try{const u=new SpeechSynthesisUtterance(t);
  if(voicePick)u.voice=voicePick;
  u.rate=.8;u.pitch=1;u.volume=.8;speechSynthesis.speak(u);}catch(e){}}

function paint(){
  const m=MOVES[idx];
  $('mNum').textContent='MOVEMENT '+(idx+1)+' OF '+MOVES.length;
  $('mName').textContent=m.n; $('mTarget').textContent=m.cue;
  $('cue').innerHTML=m.long;
  $('count').textContent=(idx+1)+'/'+MOVES.length;
  $('badge').classList.toggle('visible',!!m.bil);
  $('badge').textContent=m.orb?'REVERSES · CHANGE DIRECTION AT HALFWAY':'BOTH SIDES · SWITCH AT HALFWAY';
  $('vid').href='https://www.youtube.com/results?search_query='+m.q;
  $('bPrev').disabled=idx<=0; $('bNext').disabled=idx>=MOVES.length-1;
  MOVES.forEach((_,i)=>{$('d'+i).className='dot'+(i<idx?' done':i===idx?' active':'');});
  clock();
}
function clock(){
  const m=MOVES[idx];
  $('tm').textContent=Math.floor(timeLeft/60)+':'+String(timeLeft%60).padStart(2,'0');
  $('fill').style.width=(100*(1-timeLeft/(m.dur*dm))).toFixed(1)+'%';
}
let segEnd=0,pausedRem=0;
function go(i){
  idx=i; const m=MOVES[idx]; timeLeft=m.dur*dm; swAt=false;
  segEnd=Date.now()+m.dur*dm*1000; pausedRem=m.dur*dm*1000;
  paint(); cTrans();
  setTimeout(()=>say(m.n+(m.bil&&!m.orb?'. Start with your right side.':'')),420);
}
function sync(){
  if(!running)return;
  let rem=Math.ceil((segEnd-Date.now())/1000);
  let jumped=false;
  while(rem<=0){
    if(idx>=MOVES.length-1){finish();return;}
    idx++; const m=MOVES[idx]; segEnd+=m.dur*dm*1000; swAt=false; jumped=true;
    rem=Math.ceil((segEnd-Date.now())/1000);
  }
  if(jumped){
    const m=MOVES[idx]; paint(); cTrans();
    setTimeout(()=>say(m.n+(m.bil&&!m.orb?'. Start with your right side.':'')),420);
  }
  if(rem!==timeLeft){
    timeLeft=rem; clock();
    const m=MOVES[idx];
    if(m.bil&&!swAt&&timeLeft<=Math.floor(m.dur*dm/2)){swAt=true;applyMirror(true);cSwitch();setTimeout(()=>say(m.orb?'Change direction':'Switch sides'),300);}
    if(timeLeft===3)chime(380,.05,.3);
  }
}
function finish(){
  clearInterval(tick);tick=null;running=false;started=false;unlockScreen();
  MOVES.forEach((_,i)=>$('d'+i).className='dot done');
  $('mNum').textContent='COMPLETE';$('mName').textContent='Movement complete';$('mTarget').textContent='';
  $('badge').classList.remove('visible');
  document.querySelector('.wrap').classList.add('state-done');
  $('cue').innerHTML='<strong>Done.</strong> Hips and ankles mobile, spine articulated, hip rotation opened, core switched on. Nothing loaded the peroneal tendon.';
  $('bMain').style.display='none';$('tm').textContent='\u2713';$('fill').style.width='100%';
  cDone();setTimeout(()=>say('Movement complete.'),600);
}
$('bMain').onclick=()=>{
  if(!running){
    running=true;$('bMain').textContent='Pause';lockScreen();ac();if(actx.state==='suspended')actx.resume();
    if(!started){started=true;go(0);}
    else{segEnd=Date.now()+pausedRem;}
    tick=setInterval(sync,300);
  } else {
    running=false;pausedRem=Math.max(0,segEnd-Date.now());
    clearInterval(tick);tick=null;unlockScreen();$('bMain').textContent='Resume';
  }
};
$('bVoice').onclick=()=>{voiceOn=!voiceOn;$('bVoice').classList.toggle('on',voiceOn);};
$('bPrev').onclick=()=>{if(idx>0){started=true;go(idx-1);}};
$('bNext').onclick=()=>{if(idx<MOVES.length-1){started=true;go(idx+1);}};
$('bReset').onclick=()=>{
  clearInterval(tick);tick=null;running=false;started=false;unlockScreen();
  idx=0;timeLeft=MOVES[0].dur*dm;swAt=false;
  document.querySelector('.wrap').classList.remove('state-done');
  $('bMain').style.display='';$('bMain').textContent='Start';
  $('mNum').textContent='READY';$('mName').textContent='Tap Start to begin';$('mTarget').textContent='';
  $('badge').classList.remove('visible');$('fill').style.width='0%';$('tm').textContent='0:00';
  $('count').textContent='\u2013/12';
  $('cue').innerHTML='<strong>Morning Movement</strong> runs 9 minutes: standing mobility, then floor work, then core. Two-sided movements chime at the halfway point. No impact \u2014 safe for the right peroneal tendon.';
  MOVES.forEach((_,i)=>$('d'+i).className='dot');
};

// figure animates continuously, whatever the timer is doing
let t0=performance.now(),last=0,curFit=null,brPh=0;
(function loop(now){
  if(now-last>30){last=now;const m=MOVES[idx];
    if(curFit!==m.fit){curFit=m.fit;placeGround(m,m.fit);buildProps(m,m.fit);applyMirror(false);}
    const ph=((now-t0)/1000%m.cyc)/m.cyc;
    // breath-tempo audio on flagged movements: cycle wrap = inhale start (rising),
    // halfway = exhale start (falling). Only while the timer runs and audio exists.
    if(running&&m.br&&actx){
      if(ph<brPh)breathTone(196,294,m.cyc*0.42);
      else if(brPh<0.5&&ph>=0.5)breathTone(294,196,m.cyc*0.48);
    }
    brPh=ph;
    drawFig(m,m.fit,ph);}
  requestAnimationFrame(loop);
})(performance.now());
timeLeft=MOVES[0].dur;
