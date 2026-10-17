import { chromium } from '@playwright/test';
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const page=await ctx.newPage();
for(const r of process.argv.slice(2)){
await page.goto('https://vca.vetmock.com'+r,{waitUntil:'networkidle'});
const items=await page.$$eval('button,a,[role=button],[role=tab],input,select,summary',els=>els.filter(e=>e.offsetParent||e.getClientRects().length).map(e=>`${e.tagName}${e.getAttribute('href')?'['+e.getAttribute('href')+']':''}${e.type&&e.tagName==='INPUT'?'('+e.type+')':''} "${(e.getAttribute('aria-label')||e.textContent||e.placeholder||'').trim().replace(/\s+/g,' ').slice(0,60)}"`));
console.log('== '+r+' ('+items.length+')');console.log(items.join('\n'));}
await b.close();
