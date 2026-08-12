// Daily 10 visual QA: one screenshot per movement mid-animation, plus a transition
// segment (static preview + authored setup text + state-trans styling). Numeric
// invariants live in qa/daily.js — these images are the mandatory LOOK step.
const fs=require('fs'),path=require('path');
const {chromium}=require('playwright');
const {serve}=require('./serve');
const OUT=path.join(__dirname,'screenshots');
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});
  const srv=await serve();
  const browser=await chromium.launch();
  const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});
  const page=await ctx.newPage();
  let fail=false;
  const check=(name,ok)=>{console.log(`${name.padEnd(58)} ${ok?'ok':'FAIL'}`);if(!ok)fail=true;};
  await page.goto(`http://127.0.0.1:${srv.port}/daily-10.html`);
  const n=await page.evaluate(()=>MOVES.length);
  for(let i=0;i<n;i++){
    await page.evaluate(i=>{started=true;go(segOfMove(i));},i);
    await page.waitForTimeout(900);   // mid-animation
    const name=await page.evaluate(i=>MOVES[i].n,i);
    const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    await page.screenshot({path:path.join(OUT,`daily-10-m${String(i+1).padStart(2,'0')}-${slug}.png`),fullPage:true});
    const svg=await page.innerHTML('#layer');
    check(`m${i+1} ${name}: figure drawn`,svg.includes('<line')&&svg.includes('<circle'));
  }
  // transition segment: gap before the row (movement 4) — authored script + static hold
  await page.evaluate(()=>{started=true;go(SEGS.findIndex(s=>s.trans&&s.mi===3));});
  await page.waitForTimeout(400);
  const num=await page.textContent('#mNum');
  const tgt=await page.textContent('#mTarget');
  const setup=await page.evaluate(()=>MOVES[3].setup);
  check('gap header is GET SET UP',num==='GET SET UP');
  check('gap shows the authored setup script',tgt===setup);
  check('gap styling applied (state-trans)',
    ((await page.getAttribute('.wrap','class'))||'').includes('state-trans'));
  const f1=await page.innerHTML('#layer');
  await page.waitForTimeout(500);
  const f2=await page.innerHTML('#layer');
  check('gap figure holds the A keyframe (static preview)',f1===f2);
  await page.screenshot({path:path.join(OUT,'daily-10-transition.png'),fullPage:true});
  // and a work segment must animate
  await page.evaluate(()=>{started=true;go(segOfMove(3));});
  await page.waitForTimeout(300);
  const w1=await page.innerHTML('#layer');
  await page.waitForTimeout(500);
  const w2=await page.innerHTML('#layer');
  check('work figure animates',w1!==w2);
  await browser.close(); srv.close();
  console.log(fail?'DAILYSHOTS FAIL':`DAILYSHOTS PASS — ${n+1} screenshots in qa/screenshots/`);
  process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
