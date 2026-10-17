import { chromium, webkit } from '@playwright/test';
import fs from 'node:fs';
const BASE='https://vca.vetmock.com';
const OUT='scripts/_sweep/shots';
const profiles={
  'cr-phone':{eng:chromium,ctx:{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}},
  'wk-phone':{eng:webkit,ctx:{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}},
  'cr-desk':{eng:chromium,ctx:{viewport:{width:1440,height:900}}},
};
const only=process.argv[2];
const results=[];
let domains=null;
for (const [pname,p] of Object.entries(profiles)) {
  if (only && only!==pname) continue;
  const browser=await p.eng.launch();
  for (const theme of ['light','dark']) {
    const ctx=await browser.newContext({...p.ctx,colorScheme:theme});
    await ctx.addInitScript((t)=>{try{const s=JSON.parse(localStorage.getItem('vca:prefs')||'{}');s.theme=t;localStorage.setItem('vca:prefs',JSON.stringify(s));}catch{}},theme);
    const page=await ctx.newPage();
    const log=[];
    page.on('console',m=>{if((m.type()==='error'||m.type()==='warning')&&!/preload/.test(m.text()))log.push(`console.${m.type()}: ${m.text().slice(0,300)}`)});
    page.on('pageerror',e=>log.push('pageerror: '+e.message.slice(0,300)));
    page.on('response',r=>{if(r.status()>=400)log.push(`HTTP ${r.status()} ${r.url().slice(0,200)}`)});
    page.on('requestfailed',r=>{const f=r.failure()?.errorText||'';if(!/ERR_ABORTED|cancelled/i.test(f))log.push(`reqfail ${f} ${r.url().slice(0,200)}`)});
    if(!domains){await page.goto(BASE+'/',{waitUntil:'networkidle'});domains=await page.$$eval('a[href^="/d/"]',as=>[...new Set(as.map(a=>a.getAttribute('href')))]);console.log('domains',domains.length);}
    const routes=['/','/practice','/practice?mode=mock','/exam','/progress','/bank','/library','/about','/community','/chat','/me','/community/new','/zzz-404',...domains.slice(0, pname==='cr-phone'&&theme==='light'?999:3)];
    for (const r of routes) {
      log.length=0;
      try{await page.goto(BASE+r,{waitUntil:'networkidle',timeout:30000});}catch(e){log.push('goto: '+e.message.slice(0,100))}
      await page.waitForTimeout(600);
      const info=await page.evaluate(()=>{
        const se=document.scrollingElement; const ov=se.scrollWidth-innerWidth;
        const wide=[];
        if(ov>0){for(const el of document.querySelectorAll('body *')){const b=el.getBoundingClientRect();if(b.right>innerWidth+1&&b.width>0){wide.push((el.tagName+'.'+(el.className?.baseVal??el.className)).slice(0,80)+' r='+Math.round(b.right));if(wide.length>5)break;}}}
        // truncated text: elements with overflow hidden and scrollWidth>clientWidth
        const cut=[];
        for(const el of document.querySelectorAll('body *')){const cs=getComputedStyle(el);if(el.children.length===0&&el.textContent.trim()&&el.scrollWidth>el.clientWidth+1&&(cs.overflow==='hidden'||cs.overflowX==='hidden'||cs.textOverflow==='ellipsis')&&el.clientWidth>0&&!el.classList.contains('sr')&&el.tagName!=='LEGEND'){cut.push(el.tagName+'.'+el.className+': '+el.textContent.trim().slice(0,50));if(cut.length>6)break;}}
        return {ov,wide,cut,theme:document.documentElement.dataset.theme,bg:getComputedStyle(document.body).backgroundColor,title:document.title};
      });
      const rec={p:pname,theme,r,...info,log:[...log]};
      results.push(rec);
      const bad=info.ov>0||log.length||info.theme!==theme;
      const fn=`${OUT}/${pname}-${theme}-${r.replace(/[^a-z0-9]+/gi,'_')||'home'}.png`;
      try{await page.screenshot({path:fn,fullPage:pname!=='cr-desk'});}catch{await page.screenshot({path:fn});}
      console.log(`${pname} ${theme} ${r} ov=${info.ov} th=${info.theme} bg=${info.bg} log=${log.length} cut=${info.cut.length}${bad?' !!':''}`);
      if(log.length) console.log('   '+log.join('\n   '));
      if(info.wide.length) console.log('   wide: '+info.wide.join(' | '));
      if(info.cut.length) console.log('   cut: '+info.cut.join(' | '));
    }
    await ctx.close();
  }
  await browser.close();
}
fs.writeFileSync('scripts/_sweep/routes.json',JSON.stringify(results,null,1));
