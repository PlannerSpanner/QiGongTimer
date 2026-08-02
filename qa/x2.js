// 2x duration toggle test (Birth Prep only): doubling before start doubles the clock
// and the wall-clock catch-up math; the toggle is inert once the session has started.
const {chromium}=require('playwright');
const {serve}=require('./serve');
(async()=>{
  const srv=await serve();
  const browser=await chromium.launch();
  const page=await browser.newPage();
  await page.clock.install();
  await page.goto(`http://127.0.0.1:${srv.port}/prenatal-movement.html`);
  let fail=false;
  const check=(name,ok)=>{console.log(`${name.padEnd(44)} ${ok?'ok':'FAIL'}`);if(!ok)fail=true;};
  const durs=await page.evaluate(()=>MOVES.map(m=>m.dur));
  check('toggle rendered', await page.locator('#x2b').count()===1);
  const t0=await page.textContent('#tm');
  await page.click('#x2b');
  const t1=await page.textContent('#tm');
  const mmss=s=>{const [m,x]=s.split(':').map(Number);return m*60+x;};
  check(`2x doubles first clock (${t0} -> ${t1})`, mmss(t1)===durs[0]*2);
  await page.click('#bMain');
  await page.clock.runFor(2000);
  await page.click('#x1b');                              // must be inert now
  await page.clock.runFor(400);
  const t2=await page.textContent('#tm');
  check(`toggle locked after start (@ ${t2})`, mmss(t2)>durs[0]);
  // background catch-up respects doubled durations: jump past movement 1 (2x)
  await page.clock.fastForward(durs[0]*2*1000);
  await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{value:'visible',configurable:true});
    document.dispatchEvent(new Event('visibilitychange'));});
  await page.clock.runFor(400);
  const num=await page.textContent('#mNum');
  check(`catch-up lands in movement 2 (${num})`, /MOVEMENT 2/.test(num));
  // control: no toggle on apps without the flag
  const p2=await browser.newPage();
  await p2.goto(`http://127.0.0.1:${srv.port}/morning-movement.html`);
  check('no toggle on other apps', await p2.locator('#x2b').count()===0);
  await browser.close(); srv.close();
  console.log(fail?'X2 FAIL':'X2 PASS');
  process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
