// Background/return timer catch-up test.
// The timer is wall-clock anchored (segEnd): when the tab is backgrounded, intervals
// and rAF suspend; on return, visibilitychange -> sync() must jump the clock forward,
// advancing through any movements that elapsed. Playwright's clock.fastForward fires
// suspended timers at most once — exactly the backgrounded-tab behavior.
const {chromium}=require('playwright');
const {serve}=require('./serve');
const APPS=process.argv.slice(2).length?process.argv.slice(2)
  :['morning-flow','morning-movement','pregnancy-stretch','pregnancy-movement'];
const RUN_MS=5000, GAP_MS=65000, TICK_MS=400;   // run 5s, "background" 65s, one tick after return
(async()=>{
  const srv=await serve();
  const browser=await chromium.launch();
  let fail=false;
  for(const app of APPS){
    const page=await browser.newPage();
    await page.clock.install();
    await page.goto(`http://127.0.0.1:${srv.port}/${app}.html`);
    const durs=await page.evaluate(()=>MOVES.map(m=>m.dur));
    await page.click('#bMain');
    await page.clock.runFor(RUN_MS);
    const before=await page.evaluate(()=>document.getElementById('mNum').textContent);
    await page.clock.fastForward(GAP_MS);               // tab in background: time passes, timers frozen
    await page.evaluate(()=>{                            // return to foreground
      Object.defineProperty(document,'visibilityState',{value:'visible',configurable:true});
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.clock.runFor(TICK_MS);                    // let one interval tick land
    const after=await page.evaluate(()=>({
      num:document.getElementById('mNum').textContent,
      tm:document.getElementById('tm').textContent}));
    // expected position at elapsed wall-clock time
    const elapsed=(RUN_MS+GAP_MS+TICK_MS)/1000;
    let acc=0,exp=durs.length-1,done=true;
    for(let i=0;i<durs.length;i++){if(elapsed<acc+durs[i]){exp=i;done=false;break;}acc+=durs[i];}
    let ok;
    if(done){ok=after.num==='COMPLETE';}
    else{
      const expRem=acc+durs[exp]-elapsed;
      const got=after.num.match(/MOVEMENT (\d+)/);
      const [mm,ss]=after.tm.split(':').map(Number);
      ok=got&&Number(got[1])===exp+1&&Math.abs(mm*60+ss-expRem)<=2;
    }
    console.log(`${app.padEnd(20)} ${before} --${GAP_MS/1000}s background--> ${after.num} @ ${after.tm}`
      +`  (expected ${done?'COMPLETE':`MOVEMENT ${exp+1}, ~${Math.round(acc+durs[exp]-elapsed)}s left`}) ${ok?'ok':'FAIL'}`);
    if(!ok)fail=true;
    await page.close();
  }
  await browser.close(); srv.close();
  console.log(fail?'CATCHUP FAIL':'CATCHUP PASS');
  process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
