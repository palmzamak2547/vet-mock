import { chromium, webkit } from '@playwright/test';
const BASE='https://vca.vetmock.com';
const [eng='cr', dev='phone', theme='light', ...routes]=process.argv.slice(2);
const E=eng==='wk'?webkit:chromium;
const ctxo=dev==='phone'?{viewport:{width:390,height:844},isMobile:true,hasTouch:true}:{viewport:{width:1440,height:900}};
const b=await E.launch();const ctx=await b.newContext({...ctxo,colorScheme:theme});
await ctx.addInitScript((t)=>{try{const s=JSON.parse(localStorage.getItem('vca:prefs')||'{}');if(!s.theme){s.theme=t;localStorage.setItem('vca:prefs',JSON.stringify(s));}}catch{}},theme);
const page=await ctx.newPage();
const log=[];
page.on('console',m=>{if((m.type()==='error'||m.type()==='warning')&&!/preload/.test(m.text()))log.push(`console.${m.type()}: ${m.text().slice(0,250)}`)});
page.on('pageerror',e=>log.push('pageerror: '+e.message.slice(0,250)));
page.on('response',r=>{if(r.status()>=400)log.push(`HTTP ${r.status()} ${r.url().slice(0,160)}`)});
page.on('dialog',d=>{log.push('dialog: '+d.message().slice(0,100));d.dismiss()});
const SKIP=/ส่งความเห็น|โพสต์|ตั้งกระทู้|ส่งคำตอบ|ลบ|delete|submit|ข้ามไปเนื้อหา/i;
const snap=()=>page.evaluate(()=>{const d=document.querySelector('dialog[open],[role=dialog],[aria-modal=true]');return {url:location.pathname+location.search,html:document.body.innerHTML.length+':'+document.body.innerText.length+':'+[...document.querySelectorAll('[aria-expanded],[aria-pressed],[aria-selected],[aria-checked],input')].map(e=>(e.getAttribute('aria-expanded')||'')+(e.getAttribute('aria-pressed')||'')+(e.getAttribute('aria-selected')||'')+(e.checked?'1':'0')+(e.value||'')).join(''),dlg:!!d,theme:document.documentElement.dataset.theme,txt:document.body.innerText.slice(0,20000)}});
for(const r of routes){
  await page.goto(BASE+r,{waitUntil:'networkidle'});
  const n=await page.$$eval('main button, header button, footer button, nav button, [role=tab]',els=>els.length);
  const labels=await page.$$eval('main button, header button, footer button, nav button, [role=tab]',els=>els.map(e=>(e.getAttribute('aria-label')||e.textContent||'').trim().replace(/\s+/g,' ').slice(0,50)));
  console.log(`== ${r} buttons=${n}`);
  for(let i=0;i<n;i++){
    if(SKIP.test(labels[i])) {console.log(`  skip "${labels[i]}"`);continue;}
    await page.goto(BASE+r,{waitUntil:'networkidle'}).catch(()=>{});
    await page.waitForTimeout(300);
    const btns=page.locator('main button, header button, footer button, nav button, [role=tab]');
    const el=btns.nth(i);
    if(!(await el.isVisible().catch(()=>false))){continue;}
    log.length=0;
    const before=await snap();
    try{await el.scrollIntoViewIfNeeded({timeout:2000});await el.click({timeout:3000});}catch(e){console.log(`  [${i}] "${labels[i]}" CLICKFAIL ${e.message.split('\n')[0].slice(0,120)}`);continue;}
    await page.waitForTimeout(700);
    const after=await snap();
    const changed=before.url!==after.url||before.html!==after.html||before.dlg!==after.dlg||before.theme!==after.theme||before.txt!==after.txt;
    let focusInfo='';
    if(after.dlg){
      await page.keyboard.press('Escape');await page.waitForTimeout(500);
      const st=await page.evaluate(()=>({open:!!document.querySelector('dialog[open],[role=dialog],[aria-modal=true]'),ae:document.activeElement?(document.activeElement.tagName+':'+(document.activeElement.getAttribute('aria-label')||document.activeElement.textContent||'').trim().slice(0,30)):'none'}));
      focusInfo=` dlg->esc open=${st.open} focus=${st.ae}`;
    }
    const ov=await page.evaluate(()=>document.scrollingElement.scrollWidth-innerWidth);
    console.log(`  [${i}] "${labels[i]}" ${changed?'ok':'NOCHANGE'} url=${after.url}${focusInfo}${ov>0?' OVERFLOW '+ov:''}${log.length?'\n     '+log.join('\n     '):''}`);
  }
}
await b.close();
