// Playwright screenshot QA: each app idle mid-animation, then running after Start.
// Primary visual check (replaces PIL contact sheets; tools/strips.py stays as fallback).
const fs=require('fs'),path=require('path');
const {chromium}=require('playwright');
const {serve}=require('./serve');
const APPS=['morning-flow','morning-movement','prenatal-stretch','prenatal-movement'];
const OUT=path.join(__dirname,'screenshots');
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});
  const srv=await serve();
  const browser=await chromium.launch();
  const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2}); // iPhone-ish
  const page=await ctx.newPage();
  let fail=false;
  for(const app of APPS){
    await page.goto(`http://127.0.0.1:${srv.port}/${app}.html`);
    await page.waitForTimeout(1600);                       // figure animates continuously while idle
    await page.screenshot({path:path.join(OUT,`${app}-1-idle.png`),fullPage:true});
    await page.click('#bMain');
    await page.waitForTimeout(1500);                       // 1.5s into movement 1
    await page.screenshot({path:path.join(OUT,`${app}-2-running.png`),fullPage:true});
    const btn=await page.textContent('#bMain');
    const num=await page.textContent('#mNum');
    const svg=await page.innerHTML('#layer');
    const ok=btn==='Pause'&&num.startsWith('MOVEMENT 1')&&svg.includes('<line')&&svg.includes('<circle');
    console.log(`${app.padEnd(20)} start: ${btn==='Pause'?'ok':'FAIL('+btn+')'} | ${num} | figure drawn: ${svg.includes('<line')}`);
    if(!ok)fail=true;
  }
  await page.goto(`http://127.0.0.1:${srv.port}/index.html`);          // launcher
  await page.waitForTimeout(300);
  await page.screenshot({path:path.join(OUT,'index.png'),fullPage:true});
  await browser.close(); srv.close();
  console.log(fail?'SHOTS FAIL':`SHOTS PASS — ${APPS.length*2+1} screenshots in qa/screenshots/`);
  process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
