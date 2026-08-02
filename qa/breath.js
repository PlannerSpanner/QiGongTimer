// Breath-tempo audio test: br-flagged movements must schedule breath tones while
// running; non-flagged movements must not. Counts createOscillator calls under a
// virtual clock (audibility doesn't matter; scheduling does).
const {chromium}=require('playwright');
const {serve}=require('./serve');
(async()=>{
  const srv=await serve();
  const browser=await chromium.launch();
  let fail=false;
  // app, movement-1 flagged?, virtual ms to run, min extra oscillators expected
  const CASES=[['prenatal-movement',true,11000,3],['morning-flow',false,11000,0]];
  for(const [app,flagged,runMs,minExtra] of CASES){
    const page=await browser.newPage();
    await page.addInitScript(()=>{
      const orig=AudioContext.prototype.createOscillator;
      AudioContext.prototype.createOscillator=function(){window.__osc=(window.__osc||0)+1;return orig.apply(this,arguments);};
    });
    await page.clock.install();
    await page.goto(`http://127.0.0.1:${srv.port}/${app}.html`);
    await page.click('#bMain');
    await page.clock.runFor(900);                    // start chime settles
    const c1=await page.evaluate(()=>window.__osc||0);
    await page.clock.runFor(runMs);                  // ~2 breath cycles at cyc 5s
    const c2=await page.evaluate(()=>window.__osc||0);
    const extra=c2-c1;
    const ok=flagged?extra>=minExtra:extra<=1;
    console.log(`${app.padEnd(20)} movement 1 ${flagged?'br':'no-br'}: +${extra} oscillators in ${runMs/1000}s ${ok?'ok':'FAIL'}`);
    if(!ok)fail=true;
    await page.close();
  }
  await browser.close(); srv.close();
  console.log(fail?'BREATH FAIL':'BREATH PASS');
  process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
