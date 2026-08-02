// Launch auto-update test: when the server has a newer build stamp than the loaded
// page, the page must reload itself once (and not loop); identical stamps must not
// trigger any reload.
const {chromium}=require('playwright');
const {serve}=require('./serve');
(async()=>{
  const srv=await serve();
  const browser=await chromium.launch();
  let fail=false;
  const check=(name,ok)=>{console.log(`${name.padEnd(46)} ${ok?'ok':'FAIL'}`);if(!ok)fail=true;};
  for(const app of ['morning-flow','index']){
    const page=await browser.newPage();
    let navs=0; page.on('framenavigated',f=>{if(f===page.mainFrame())navs++;});
    let hits=0;
    await page.route(`**/${app}.html`,async route=>{
      hits++;
      const r=await route.fetch();
      let body=await r.text();
      if(hits>1) body=body.replace(/BUILDV='[0-9a-f]+'/,"BUILDV='ffffffffff'");
      await route.fulfill({response:r,body});
    });
    await page.goto(`http://127.0.0.1:${srv.port}/${app}.html`);
    await page.waitForTimeout(1800);           // pageshow -> freshCheck -> reload
    check(`${app}: reloads onto newer build (navs ${navs})`, navs>=2);
    check(`${app}: no reload loop (navs ${navs})`, navs<=3);
    await page.close();
    // control: unmodified stamps -> no reload
    const p2=await browser.newPage();
    let navs2=0; p2.on('framenavigated',f=>{if(f===p2.mainFrame())navs2++;});
    await p2.goto(`http://127.0.0.1:${srv.port}/${app}.html`);
    await p2.waitForTimeout(1200);
    check(`${app}: same build stays put (navs ${navs2})`, navs2===1);
    await p2.close();
  }
  await browser.close(); srv.close();
  console.log(fail?'FRESH FAIL':'FRESH PASS');
  process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
