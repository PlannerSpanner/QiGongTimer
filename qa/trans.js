// Transition-segment QA: derived 8s gaps appear where pos changes, show a GET SET UP
// header with a preview of the next movement, never mirror, and resolve into the
// movement. Manual prev/next skip gaps. morning-flow (all standing) has zero gaps.
const path=require('path');
const {chromium}=require('playwright');
const {serve}=require('./serve');
(async()=>{
  const srv=await serve();
  const browser=await chromium.launch();
  const page=await browser.newPage();
  await page.clock.install();
  await page.goto(`http://127.0.0.1:${srv.port}/morning-movement.html`);
  let fail=false;
  const check=(name,ok)=>{console.log(`${name.padEnd(52)} ${ok?'ok':'FAIL'}`);if(!ok)fail=true;};
  const segs=await page.evaluate(()=>SEGS.map(s=>({dur:s.dur,trans:!!s.trans,mi:s.mi,n:s.m.n})));
  check('morning-movement has 5 gaps', segs.filter(s=>s.trans).length===5);
  check('gaps are 8s', segs.filter(s=>s.trans).every(s=>s.dur===8));
  // run into the first gap (after the six 30s standing movements)
  const gapAt=segs.slice(0,segs.findIndex(s=>s.trans)).reduce((a,s)=>a+s.dur,0);
  await page.click('#bMain');
  await page.clock.runFor(gapAt*1000+1500);
  const num=await page.textContent('#mNum');
  const name=await page.textContent('#mName');
  const target=await page.textContent('#mTarget');
  const tm=await page.textContent('#tm');
  check(`gap header (${num})`, num==='GET SET UP');
  check(`gap previews next movement (${name})`, name==='Cobra press-ups');
  check(`gap instruction (${target})`, target==='Lie face down.');
  check(`gap clock counts down 8s (${tm})`, /^0:0[0-7]$/.test(tm));
  check('badge hidden in gap', !((await page.getAttribute('#badge','class'))||'').includes('visible'));
  check('no mirror in gap', !(await page.getAttribute('#layer','transform')));
  const svg=await page.innerHTML('#layer');
  check('figure drawn in gap', svg.includes('<line')&&svg.includes('<circle'));
  await page.screenshot({path:path.join(__dirname,'screenshots','morning-movement-3-transition.png'),fullPage:true});
  await page.clock.runFor(8000);
  check('gap resolves into MOVEMENT 7', /MOVEMENT 7/.test(await page.textContent('#mNum')));
  // manual navigation never lands in a gap
  await page.click('#bNext');
  check('next skips gaps', /MOVEMENT 8/.test(await page.textContent('#mNum')));
  await page.click('#bPrev');
  check('prev skips gaps', /MOVEMENT 7/.test(await page.textContent('#mNum')));
  await page.click('#bPrev');
  check('prev crosses the gap to MOVEMENT 6', /MOVEMENT 6/.test(await page.textContent('#mNum')));
  await page.click('#bNext');
  check('next crosses the gap to MOVEMENT 7', /MOVEMENT 7/.test(await page.textContent('#mNum')));
  const p2=await browser.newPage();
  await p2.goto(`http://127.0.0.1:${srv.port}/morning-flow.html`);
  check('morning-flow has zero gaps', await p2.evaluate(()=>SEGS.filter(s=>s.trans).length)===0);
  const gapCount=async app=>{const p=await browser.newPage();
    await p.goto(`http://127.0.0.1:${srv.port}/${app}.html`);
    const n=await p.evaluate(()=>SEGS.filter(s=>s.trans).length);await p.close();return n;};
  check('prenatal-stretch has 6 gaps', await gapCount('prenatal-stretch')===6);
  check('prenatal-movement has 10 gaps', await gapCount('prenatal-movement')===10);
  // daily-10 (TR_ALL): authored gaps before EVERY movement, per-movement lengths,
  // "Next:" voice script shown as the instruction, distinct state-trans styling
  const p3=await browser.newPage();
  await p3.clock.install();
  await p3.goto(`http://127.0.0.1:${srv.port}/daily-10.html`);
  const dsegs=await p3.evaluate(()=>SEGS.map(s=>({dur:s.dur,trans:!!s.trans,mi:s.mi})));
  check('daily-10 has a gap before every movement (10)', dsegs.filter(s=>s.trans).length===10);
  const dur=dsegs.filter(s=>s.trans).map(s=>s.dur).join(',');
  check(`daily-10 gap lengths authored (${dur})`, dur==='10,10,15,15,15,15,15,10,15,15');
  check('daily-10 session is 600s', dsegs.reduce((a,s)=>a+s.dur,0)===600);
  await p3.click('#bMain');
  await p3.clock.runFor(45*1000+1500);          // into the first gap (after dead bug)
  check('daily-10 gap header', await p3.textContent('#mNum')==='GET SET UP');
  check('daily-10 gap previews next movement', await p3.textContent('#mName')==='Glute bridge');
  const dtgt=await p3.textContent('#mTarget');
  check('daily-10 gap shows the authored setup script', dtgt===await p3.evaluate(()=>MOVES[1].setup));
  check('daily-10 gap styling (state-trans on wrap)',
    ((await p3.getAttribute('.wrap','class'))||'').includes('state-trans'));
  await p3.clock.runFor(10000);
  check('daily-10 gap resolves into MOVEMENT 2', /MOVEMENT 2/.test(await p3.textContent('#mNum')));
  check('daily-10 styling clears in work segment',
    !((await p3.getAttribute('.wrap','class'))||'').includes('state-trans'));
  await browser.close(); srv.close();
  console.log(fail?'TRANS FAIL':'TRANS PASS');
  process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
