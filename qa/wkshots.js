// Playwright QA for strength.html: full-page shot per tab, one card shot per
// movement (mid-rep), tab persistence, and set-check + reset behavior.
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
  const check=(name,ok)=>{console.log(`${name.padEnd(52)} ${ok?'ok':'FAIL'}`);if(!ok)fail=true;};
  await page.goto(`http://127.0.0.1:${srv.port}/strength.html`);
  await page.waitForTimeout(900);
  for(const tab of ['A','B']){
    await page.click('#tab'+tab);
    await page.waitForTimeout(700);
    await page.screenshot({path:path.join(OUT,`strength-${tab}-page.png`),fullPage:true});
    const n=await page.evaluate(t=>document.querySelectorAll(`#list${t} .mcard`).length,tab);
    for(let i=0;i<n;i++){
      const card=page.locator(`#card-${tab}-${i}`);
      await card.scrollIntoViewIfNeeded();
      await page.waitForTimeout(650);            // let the loop draw a mid-rep frame
      await card.screenshot({path:path.join(OUT,`strength-${tab}${i+1}.png`)});
      const svg=await page.innerHTML(`#ly-${tab}-${i}`);
      check(`${tab}${i+1} figure drawn`,svg.includes('<line')&&svg.includes('<circle'));
    }
  }
  // set-check + reset + tab persistence
  await page.click('#tabA');
  await page.click('#ck-A-0-0'); await page.click('#ck-A-0-2');
  let on=await page.evaluate(()=>document.querySelectorAll('#sets-A-0 .setbox.on').length);
  check('set checks toggle',on===2);
  await page.reload(); await page.waitForTimeout(600);
  on=await page.evaluate(()=>document.querySelectorAll('#sets-A-0 .setbox.on').length);
  check('set checks survive reload',on===2);
  await page.evaluate(()=>document.getElementById('reset-A').click());
  on=await page.evaluate(()=>document.querySelectorAll('#sets-A-0 .setbox.on').length);
  check('reset clears checks',on===0);
  await page.click('#tabB'); await page.reload(); await page.waitForTimeout(600);
  const bShown=await page.evaluate(()=>document.getElementById('listB').style.display!=='none'
    &&document.getElementById('listA').style.display==='none');
  check('last tab remembered across reload',bShown);
  await browser.close(); srv.close();
  console.log(fail?'WKSHOTS FAIL':'WKSHOTS PASS — screenshots in qa/screenshots/');
  process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
