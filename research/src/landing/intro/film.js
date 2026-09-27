// VetMock Research opening film. One renderer for the front-door intro (cut 'web') and the social
// video (cut 'social', rendered frame by frame in Chrome). OWNER: landing role.
// Every frame is a pure function of time: renderAt(t) draws the plate shader, then the words.
// Idea: many things a vet researcher looks at (farm, lab, data) share one horizon arc; hard cuts
// every half second keep the arc in place while the material changes, and the words rest on it.

export const PL = { DAWN: 0, HILL: 1, EGG: 2, HIDE: 3, EYE: 4, HOOF: 5, MILK: 6, FISH: 7, AGAR: 8, HE: 9, SMEAR: 10, GRAM: 11, ELISA: 12, XRAY: 13, STEM: 14, BELL: 15, BLUE: 16, DOTS: 17, STEPS: 18, ENGR: 19 };
const DARK_TEXT = new Set([PL.HILL, PL.HOOF, PL.MILK, PL.HE, PL.SMEAR, PL.GRAM, PL.ELISA, PL.STEM, PL.BELL, PL.STEPS, PL.ENGR]);

export const COPY = {
  th: { words: ['จากฟาร์ม', 'ถึงแล็บ', 'ถึงคำตอบ'], title: 'VetMock Research', brand: 'VetMock', url: 'research.vetmock.com' },
  en: { words: ['From the farm', 'to the lab', 'to the answer'], title: 'VetMock Research', brand: 'VetMock', url: 'research.vetmock.com' },
};

export function timeline(cut) {
  const s = [];
  const add = (p, d, extra = {}) => s.push({ p, d, ...extra });
  if (cut === 'web') {
    add(PL.DAWN, 0.8, { kind: 'open' });
    [PL.HILL, PL.HE, PL.BLUE].forEach((p) => add(p, 0.35));
    [PL.EYE, PL.HOOF, PL.MILK].forEach((p) => add(p, 0.4, { w: 0 }));
    [PL.AGAR, PL.ELISA, PL.XRAY].forEach((p) => add(p, 0.4, { w: 1 }));
    [PL.BELL, PL.STEPS, PL.DOTS].forEach((p) => add(p, 0.5, { w: 2 }));
    add(PL.DAWN, 0.85, { kind: 'title' });
    add(PL.DAWN, 0.85, { kind: 'logo' });
    add(PL.DAWN, 1.25, { kind: 'rise' });
    add(PL.DAWN, 1.1, { kind: 'fly' });
  } else {
    add(PL.DAWN, 1.3, { kind: 'open' });
    [PL.HILL, PL.EGG, PL.HIDE, PL.HE, PL.SMEAR, PL.GRAM, PL.BLUE, PL.ENGR].forEach((p) => add(p, 0.5));
    [PL.EYE, PL.HOOF, PL.MILK, PL.FISH].forEach((p) => add(p, 0.5, { w: 0 }));
    [PL.AGAR, PL.ELISA, PL.XRAY, PL.STEM].forEach((p) => add(p, 0.5, { w: 1 }));
    [PL.BELL, PL.STEPS, PL.DOTS].forEach((p) => add(p, 0.75, { w: 2 }));
    add(PL.DAWN, 1.4, { kind: 'title' });
    add(PL.DAWN, 1.4, { kind: 'logo' });
    add(PL.DAWN, 1.8, { kind: 'rise' });
    add(PL.DAWN, 2.2, { kind: 'end' });
  }
  let t = 0;
  s.forEach((x, i) => { x.t0 = t; x.i = i; t += x.d; });
  return { shots: s, duration: t };
}

// ---------- deterministic helpers shared by JS and GLSL ----------
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rnd = mulberry32(27953);
const STEPS = Float32Array.from({ length: 64 }, () => (rnd() - 0.5) * 0.014);
const JIT = Array.from({ length: 64 }, () => [(rnd() - 0.5) * 0.024, 1 + (rnd() - 0.5) * 0.1]);

export function geometry(w, h) {
  const a = w / h;
  const hw = a / 2;
  const drop = Math.min(Math.max((a >= 1 ? 0.19 : 0.29) * hw, 0.07), 0.32);
  // Upright screens lift the horizon above the middle: Shorts, Reels and TikTok cover the lower right
  // with buttons and the bottom fifth with the caption, so the words and the title sit higher.
  const up = a < 1;
  return { a, R: (hw * hw + drop * drop) / (2 * drop), AY: up ? 0.05 : -0.02, titleY: up ? 0.07 : 0.02 };
}

const circY = (x, ay, r) => ay - r + Math.sqrt(Math.max(r * r - x * x, 0));
function edgeY(pl, x, ay, r) {
  if (pl === PL.BELL) { const s = 0.8; return ay - 0.42 * (1 - Math.exp(-(x * x) / (2 * s * s))); }
  if (pl === PL.STEPS) { const bw = 0.045; const i = Math.floor(x / bw + 0.5); return circY(i * bw, ay, r) + STEPS[Math.min(Math.max(i + 32, 0), 63)]; }
  let y = circY(x, ay, r);
  if (pl === PL.FISH) y += 0.011 * Math.sqrt(Math.abs(Math.sin(x * 16))) - 0.011;
  if (pl === PL.STEM) y += 0.003 * Math.sin(x * 23 + 1.7);
  return y;
}

const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
function camera(g, shot, local) {
  const k = Math.min(Math.max(local / shot.d, 0), 1);
  const special = !!shot.kind;
  let [jy, jr] = special ? [0, 1] : JIT[shot.i % 64];
  if (shot.w !== undefined) jy = 0;
  let ay = g.AY + jy;
  let zoom = 1 + 0.035 * k;
  if (shot.kind === 'open') { ay = g.AY - 0.03 * (1 - ease(k)); zoom = 1 + 0.02 * k; }
  if (shot.kind === 'title' || shot.kind === 'logo') { ay = -0.95; zoom = 1 + 0.015 * k; }
  if (shot.kind === 'rise') { ay = -0.95 + (g.AY + 0.95) * ease(k); zoom = 1; }
  if (shot.kind === 'end') { ay = g.AY; zoom = 1 + 0.02 * k; }
  if (shot.kind === 'fly') { ay = g.AY; zoom = Math.pow(14, ease(k)); }
  return { ay, r: g.R * jr, zoom, pan: [0, ay * (1 - 1 / zoom)], k };
}

// ---------- the plate shader ----------
const VS = `#version 300 es
void main(){ vec2 p = vec2(float((gl_VertexID<<1)&2), float(gl_VertexID&2)); gl_Position = vec4(p*2.-1., 0., 1.); }`;

const COMMON = `#version 300 es
#ifndef PID
#define PID uPlate
#endif
precision highp float;
uniform vec2 uRes; uniform float uT; uniform float uLocal; uniform int uPlate;
uniform float uAY; uniform float uR; uniform float uZoom; uniform vec2 uPan; uniform float uFade;
uniform float uSteps[64];
out vec4 o;
#define PI 3.14159265
float h11(float p){ p=fract(p*.1031); p*=p+33.33; p*=p+p; return fract(p); }
float h12(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
vec2 h22(vec2 p){ vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973)); p3+=dot(p3,p3.yzx+33.33); return fract((p3.xx+p3.yz)*p3.zy); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(h12(i),h12(i+vec2(1,0)),u.x),mix(h12(i+vec2(0,1)),h12(i+vec2(1,1)),u.x),u.y); }
float fbm(vec2 p){ float s=0., a=.5; for(int i=0;i<5;i++){ s+=a*vn(p); p=mat2(1.6,1.2,-1.2,1.6)*p+7.3; a*=.5; } return s; }
vec3 vor(vec2 p){ vec2 n=floor(p), f=fract(p); float F1=8., F2=8., id=0.;
  for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){ vec2 g=vec2(i,j); vec2 r=g+h22(n+g)-f; float d=dot(r,r);
    if(d<F1){F2=F1;F1=d;id=h12(n+g);} else if(d<F2){F2=d;} }
  return vec3(sqrt(F1), sqrt(F2)-sqrt(F1), id); }
float circY(float x){ return uAY - uR + sqrt(max(uR*uR - x*x, 0.)); }
float edgeY(float x){
  if (PID==15){ float s=0.8; return uAY - 0.42*(1.-exp(-(x*x)/(2.*s*s))); }
  if (PID==18){ float bw=0.045; float i=floor(x/bw+0.5); return circY(i*bw) + uSteps[int(clamp(i+32.,0.,63.))]; }
  float y = circY(x);
  if (PID==1){ float s=x*700.; float i=floor(s); float u=fract(s); y += (pow(h11(i),1.6)*0.03+0.003)*pow(1.-abs(u*2.-1.),2.5); }
  else if (PID==7){ y += 0.011*sqrt(abs(sin(x*16.))) - 0.011; }
  else if (PID==14){ y += 0.003*sin(x*23.+1.7); }
  else if (PID==9){ y += 0.006*(vn(vec2(x*18.,3.))-0.5); }
  else if (PID==3){ y += 0.0035*(vn(vec2(x*260.,1.))-0.5); }
  return y;
}
vec2 arcUV(vec2 q){ vec2 d=q-vec2(0., uAY-uR); return vec2(atan(d.x, d.y)*uR, uR-length(d)); }
`;

// Pass 1: the plate itself, in linear-ish colour, no grain yet.
const FS = COMMON + `

const float SKY_H[12] = float[12](0., .015, .05, .09, .126, .17, .22, .28, .35, .46, .7, 1.2);
const vec3 SKY_C[12] = vec3[12](vec3(.95,.52,.2), vec3(.86,.44,.16), vec3(.8,.57,.35), vec3(.67,.55,.49), vec3(.565,.537,.545), vec3(.47,.53,.58),
  vec3(.4,.51,.56), vec3(.3,.43,.52), vec3(.2,.34,.43), vec3(.075,.133,.18), vec3(.03,.055,.08), vec3(.012,.02,.034));
const float GND_H[5] = float[5](0., .022, .06, .12, .3);
const vec3 GND_C[5] = vec3[5](vec3(.72,.3,.13), vec3(.5,.17,.11), vec3(.19,.11,.12), vec3(.09,.09,.09), vec3(.065,.066,.07));
vec3 ramp12(float x){ vec3 c=SKY_C[11]; for(int i=10;i>=0;i--){ if(x<SKY_H[i+1]) c=mix(SKY_C[i],SKY_C[i+1],clamp((x-SKY_H[i])/(SKY_H[i+1]-SKY_H[i]),0.,1.)); } return c; }
vec3 ramp5(float x){ vec3 c=GND_C[4]; for(int i=3;i>=0;i--){ if(x<GND_H[i+1]) c=mix(GND_C[i],GND_C[i+1],clamp((x-GND_H[i])/(GND_H[i+1]-GND_H[i]),0.,1.)); } return c; }
uniform float uSun;
vec3 pDawn(vec2 q, float h, float aa){
  float hp=max(h,0.), dn=-min(h,0.);
  vec3 col = ramp12(hp);
  col += vec3(1.0,0.78,0.5)*exp(-hp*500.)*0.35;
  vec2 sq=q*110.; float st=step(.9978,h12(floor(sq)))*smoothstep(.3,.0,length(fract(sq)-.5));
  col += st*0.45*smoothstep(0.45,0.9,hp);
  vec3 ground = ramp5(dn)*(0.92+0.16*fbm(q*vec2(2.5,7.0)+1.3));
  vec3 c = mix(col, ground, smoothstep(aa,-aa,h));
  // Sunrise swell for the ending: the warm band thickens and a soft sun rises at the apex.
  float sun = exp(-length((q-vec2(0.,uAY))*vec2(0.9,2.6))*5.5);
  c += (vec3(1.0,0.62,0.28)*exp(-abs(h)*22.)*0.35 + vec3(1.0,0.82,0.58)*sun*0.55)*uSun;
  return c;
}
vec3 pHill(vec2 q, float h, float aa){
  float hp=max(h,0.);
  vec3 sky = mix(vec3(1.0,0.80,0.56), vec3(0.56,0.68,0.84), smoothstep(0.0,0.6,hp));
  sky += vec3(1.0,0.86,0.58)*exp(-length((q-vec2(0.42,circY(0.42)+0.03))*vec2(1.,1.6))*5.)*0.6;
  float dn=-min(h,0.);
  vec3 land = vec3(0.07,0.09,0.035)*(0.7+0.6*fbm(q*vec2(6.,14.)));
  land += vec3(0.88,0.78,0.32)*exp(-dn*70.)*0.6;
  return mix(sky, land, smoothstep(aa,-aa,h));
}
vec3 pEgg(vec2 q, float h, float aa){
  vec3 bg = vec3(0.07,0.045,0.03)*(0.8+0.3*vn(q*3.));
  float dn=arcUV(q).y;
  vec3 shell = mix(vec3(0.62,0.43,0.28), vec3(0.84,0.65,0.47), fbm(q*6.+2.));
  shell = mix(shell, vec3(0.42,0.26,0.16), smoothstep(0.64,0.72,fbm(q*38.+9.))*0.7);
  vec3 v = vor(q*140.); shell *= 1.-0.25*smoothstep(0.07,0.0,v.x);
  shell *= mix(1.05,0.55,smoothstep(0.,0.55,dn));
  shell += vec3(1.,0.95,0.9)*exp(-pow((dn-0.035)*35.,2.))*0.22;
  return mix(bg, shell, smoothstep(aa,-aa,h));
}
vec3 pHide(vec2 q, float h, float aa){
  vec3 v = vor(q*3.+11.);
  vec3 bg = mix(vec3(0.20,0.30,0.14), vec3(0.47,0.60,0.31), smoothstep(0.6,0.0,v.x)*0.6+0.3*vn(q*2.));
  vec2 a = arcUV(q);
  float pat = smoothstep(0.47,0.53,fbm(q*1.8+4.2));
  float hair = vn(vec2(a.x*240., a.y*16.));
  vec3 hide = mix(vec3(0.035,0.03,0.03)+hair*0.07, vec3(0.90,0.88,0.84)-hair*0.18, pat);
  hide *= mix(1.0,0.6,smoothstep(0.,0.5,a.y));
  return mix(bg, hide, smoothstep(aa,-aa,h));
}
vec3 pEye(vec2 q, float h, float aa){
  vec2 a = arcUV(q);
  vec3 hair = vec3(0.22,0.10,0.05)*(0.55+0.45*vn(vec2(q.x*26., q.y*120.)))*(0.8+0.2*vn(q*5.));
  float lash=0.; float sp=0.028; float x0=floor(q.x/sp);
  for(int k=-2;k<=2;k++){
    float id=x0+float(k);
    float xi=id*sp+(h11(id)-0.5)*sp*0.8;
    float len=0.05+h11(id+3.)*0.05;
    float bend=(h11(id+5.)-0.3)*6.;
    float v=q.y-circY(xi);
    if(v>0. && v<len){ float w=mix(0.0035,0.0006,v/len); lash=max(lash, smoothstep(w,0.,abs(q.x-(xi+bend*v*v)))); }
  }
  vec3 outside = mix(hair, vec3(0.015,0.01,0.01), lash);
  vec3 eye = vec3(0.015,0.018,0.025);
  eye += vec3(0.20,0.10,0.04)*fbm(vec2(a.x*8., a.y*30.))*smoothstep(0.5,0.1,length(q-vec2(0.,uAY-0.45)));
  vec2 rp=q-vec2(0.10,uAY-0.07); rp.y += rp.x*rp.x*0.9;
  vec2 bx=abs(rp)-vec2(0.10,0.026);
  float rr=length(max(bx,0.))+min(max(bx.x,bx.y),0.)-0.02;
  float refl=smoothstep(0.03,-0.025,rr)*(1.-0.65*clamp(smoothstep(0.004,0.,abs(rp.x))+smoothstep(0.003,0.,abs(rp.y)),0.,1.));
  eye += vec3(0.72,0.80,0.92)*refl*0.42;
  eye += vec3(0.6,0.7,0.8)*exp(-a.y*90.)*0.35;
  eye += vec3(0.9)*exp(-length((q-vec2(-0.18,uAY-0.05))*vec2(1.,1.5))*60.)*0.4;
  return mix(outside, eye, smoothstep(aa,-aa,h));
}
vec3 pHoof(vec2 q, float h, float aa){
  vec3 bg = mix(vec3(0.86,0.90,0.94), vec3(0.50,0.66,0.86), smoothstep(-0.1,0.5,q.y));
  vec2 a = arcUV(q);
  vec2 r1 = mat2(0.94,0.34,-0.34,0.94)*q, r2 = mat2(0.9,-0.44,0.44,0.9)*q;
  float s1 = vn(vec2(r1.x*190., r1.y*9.)), s2 = vn(vec2(r2.x*160., r2.y*7.));
  float straw = max(s1, s2*0.9);
  vec3 horn = mix(vec3(0.46,0.33,0.12), vec3(0.95,0.80,0.45), straw);
  horn = mix(horn, vec3(0.30,0.20,0.07), smoothstep(0.35,0.1,min(s1,s2))*0.5);
  horn *= mix(1.08,0.55,smoothstep(0.,0.45,a.y));
  return mix(bg, horn, smoothstep(aa,-aa,h));
}
vec3 pMilk(vec2 q, float h, float aa){
  vec3 steel = vec3(0.52,0.57,0.62)*(0.85+0.2*vn(vec2(q.x*160., q.y*2.)));
  steel = mix(steel, vec3(0.32,0.36,0.42), smoothstep(0.0,0.5,q.y));
  steel *= 1.-0.3*exp(-max(h,0.)*60.);
  vec2 a = arcUV(q);
  vec3 milk = mix(vec3(0.975,0.97,0.95), vec3(0.80,0.84,0.90), smoothstep(0.,0.7,a.y)*0.7);
  milk += 0.006*sin(a.y*90.-uLocal*1.5)*exp(-a.y*6.);
  milk += vec3(1.)*exp(-a.y*160.)*0.25;
  return mix(steel, milk, smoothstep(aa,-aa,h));
}
vec3 pFish(vec2 q, float h, float aa){
  float c = pow(abs(sin(fbm(q*3.5+uLocal*0.25)*10.)),10.);
  vec3 water = vec3(0.02,0.11,0.13)+vec3(0.1,0.35,0.35)*c*0.25+vec3(0.0,0.05,0.07)*smoothstep(0.5,0.,max(h,0.));
  vec2 a = arcUV(q);
  float row = floor(a.y*14.);
  vec2 cell = vec2(fract(a.x*10.+mod(row,2.)*0.5), fract(a.y*14.));
  float dsc = length((cell-vec2(0.5,-0.15))*vec2(1.,0.8));
  float edgeL = smoothstep(0.03,0.0,abs(dsc-0.72));
  vec3 iri = 0.55+0.45*cos(6.2831*(vec3(0.,0.33,0.67)+fbm(q*2.)*0.5+0.35));
  vec3 sc = mix(vec3(0.66,0.72,0.78), iri, 0.10)*(0.55+0.55*cell.y);
  sc = mix(sc, sc*0.45, edgeL);
  sc *= mix(1.05,0.5,smoothstep(0.,0.5,a.y));
  return mix(water, sc, smoothstep(aa,-aa,h));
}
vec3 pAgar(vec2 q, float h, float aa){
  vec3 bg = vec3(0.012)*(0.9+0.2*vn(q*3.));
  vec2 a = arcUV(q);
  vec3 ag = vec3(0.42,0.025,0.035)*(0.85+0.3*fbm(q*5.));
  ag += vec3(0.25,0.03,0.03)*exp(-a.y*9.);
  vec3 v = vor(q*13.+3.);
  float has = step(0.35,v.z); float r = 0.10+v.z*0.14;
  ag = mix(ag, vec3(0.78,0.22,0.12), smoothstep(r*2.3,r*1.2,v.x)*step(0.6,v.z)*0.55*has);
  ag = mix(ag, vec3(0.92,0.88,0.78)*(0.85+0.2*smoothstep(r,0.,v.x)), smoothstep(r,r-0.03,v.x)*has);
  ag *= mix(1.0,0.55,smoothstep(0.,0.6,a.y));
  vec3 c = mix(bg, ag, smoothstep(aa,-aa,h));
  c += vec3(0.9,0.9,1.0)*exp(-abs(h)*420.)*0.55;
  c += vec3(0.5,0.5,0.55)*exp(-abs(h-0.012)*500.)*0.25;
  return c;
}
vec3 pHE(vec2 q, float h, float aa){
  vec3 bg = vec3(0.965,0.955,0.975)-0.02*vn(q*20.);
  vec3 tis = mix(vec3(0.90,0.50,0.70), vec3(0.97,0.72,0.84), fbm(q*7.+1.));
  float lum = smoothstep(0.60,0.66,fbm(q*4.+8.));
  tis = mix(tis, vec3(0.97,0.94,0.97), lum);
  vec3 v = vor(vec2(q.x*55., q.y*72.)+5.);
  float nuc = smoothstep(0.20,0.13,v.x)*step(0.25,v.z)*(1.-lum);
  tis = mix(tis, vec3(0.30,0.12,0.42)*(0.75+0.5*vn(q*300.)), nuc*0.9);
  return mix(bg, tis, smoothstep(aa,-aa,h));
}
vec3 pSmear(vec2 q, float h, float aa){
  vec3 v = vor(q*42.+1.);
  vec3 rbc = vec3(0.84,0.40,0.44);
  rbc = mix(rbc, vec3(0.93,0.70,0.72), smoothstep(0.22,0.,v.x)*0.7);
  rbc = mix(rbc, vec3(0.62,0.22,0.28), smoothstep(0.30,0.40,v.x)*0.5);
  vec3 sm = mix(vec3(0.97,0.91,0.91), rbc, smoothstep(0.40,0.36,v.x));
  sm = mix(sm, vec3(0.38,0.20,0.55), step(0.975,v.z)*smoothstep(0.30,0.2,v.x));
  return mix(vec3(0.93,0.93,0.95), sm, smoothstep(aa,-aa,h));
}
vec3 pGram(vec2 q, float h, float aa){
  vec3 field = mix(vec3(0.92,0.66,0.76), vec3(0.97,0.82,0.87), fbm(q*6.));
  vec2 g=q*36.; vec2 ci=floor(g); vec2 f=fract(g)-0.5;
  float r0=h12(ci); float ang=h12(ci+3.)*PI; vec2 dir=vec2(cos(ang),sin(ang));
  float len=0.18+0.15*h12(ci+5.); float t=clamp(dot(f,dir),-len,len);
  float rod = smoothstep(0.03,-0.02,length(f-dir*t)-0.075)*step(0.55,r0);
  float coc = smoothstep(0.03,-0.02,length(f-(h22(ci)-0.5)*0.4)-0.09)*step(r0,0.18);
  field = mix(field, vec3(0.30,0.10,0.42), max(rod,coc));
  return mix(vec3(0.96,0.96,0.97), field, smoothstep(aa,-aa,h));
}
vec3 pElisa(vec2 q, float h, float aa){
  vec3 lab = mix(vec3(0.82,0.88,0.93), vec3(0.70,0.78,0.86), vn(q*2.));
  vec2 a = arcUV(q);
  vec3 pl = vec3(0.95,0.95,0.94)*(0.92+0.08*vn(q*40.));
  float cs=0.05; vec2 g=vec2(a.x/cs,(a.y-0.02)/cs); vec2 ci=floor(g); vec2 f=fract(g)-0.5;
  float rows = step(0.,a.y-0.02)*step(ci.y,4.);
  float d=length(f);
  float rim=smoothstep(0.42,0.38,d)-smoothstep(0.36,0.32,d);
  float fill=smoothstep(0.34,0.31,d);
  float level=clamp(0.95-fract(ci.x*0.123+0.3)*0.9+(h12(ci)-0.5)*0.15,0.,1.);
  vec3 liq = mix(vec3(0.98,0.97,0.90), vec3(0.95,0.76,0.12), level)*(0.85+0.15*smoothstep(0.3,0.,d));
  vec3 w = mix(pl, liq, fill*rows);
  w = mix(w, vec3(0.70,0.72,0.74), rim*0.6*rows);
  w *= mix(1.0,0.8,smoothstep(0.,0.5,a.y));
  vec3 c = mix(lab, w, smoothstep(aa,-aa,h));
  c += vec3(1.)*exp(-abs(h)*380.)*0.3;
  return c;
}
vec3 pXray(vec2 q, float h, float aa){
  vec2 a = arcUV(q);
  float soft = 0.16+0.12*smoothstep(0.5,0.,a.y)+0.06*fbm(q*3.);
  float spine = smoothstep(0.075,0.045,a.y)*smoothstep(0.,0.012,a.y)*(0.55+0.45*smoothstep(0.32,0.46,abs(fract(a.x/0.055)-0.5)));
  float u = a.x-0.55*a.y+0.9*a.y*a.y;
  float rib = smoothstep(0.30,0.,abs(fract(u/0.085)-0.5)-0.2)*smoothstep(0.07,0.11,a.y)*smoothstep(0.75,0.3,a.y);
  float v = (soft+spine*0.5+rib*0.22)*(0.92+0.16*vn(q*70.));
  vec3 c = mix(vec3(0.004,0.006,0.012), vec3(v)*vec3(0.88,0.96,1.06), smoothstep(aa,-aa,h));
  c += vec3(0.4,0.45,0.5)*exp(-max(h,0.)*80.)*0.15*step(0.,h);
  return c;
}
vec3 pStem(vec2 q, float h, float aa){
  vec3 bg = vec3(0.94,0.93,0.87)-0.03*vn(q*10.);
  vec2 a = arcUV(q);
  vec3 v = vor(q*48.+2.);
  vec3 tis = mix(mix(vec3(0.93,0.97,0.95), vec3(0.85,0.93,0.92), v.z), vec3(0.45,0.66,0.68), smoothstep(0.08,0.,v.y)*0.8);
  float bs=0.11; float bi=floor(a.x/bs);
  vec2 bc=vec2((bi+0.5)*bs, 0.075+(h11(bi)-0.5)*0.02);
  float db=length(a-bc); float br=0.032+h11(bi+2.)*0.01;
  tis = mix(tis, vec3(0.18,0.38,0.40), smoothstep(0.006,0.,abs(db-br))*0.85);
  vec3 vi = vor(q*140.+9.);
  tis = mix(tis, vec3(0.20,0.62,0.60), smoothstep(br*0.9,br*0.6,db)*smoothstep(0.10,0.,vi.y)*0.8);
  tis = mix(tis, vec3(0.10,0.28,0.30), smoothstep(0.012,0.,a.y)*0.9);
  return mix(bg, tis, smoothstep(aa,-aa,h));
}
vec3 pBell(vec2 q, float h, float aa){
  vec3 paper = vec3(0.955,0.94,0.89)-0.025*fbm(q*6.);
  vec2 dm = min(fract(q/0.02), 1.-fract(q/0.02));
  vec2 dM = min(fract(q/0.1), 1.-fract(q/0.1));
  paper = mix(paper, vec3(0.55,0.72,0.88), smoothstep(0.07,0.,min(dm.x,dm.y))*0.25+smoothstep(0.02,0.,min(dM.x,dM.y))*0.45);
  float ins = smoothstep(aa,-aa,h);
  vec3 ink = vec3(0.10,0.14,0.30);
  float hat = smoothstep(0.18,0.,abs(fract((q.x+q.y)/0.014)-0.5)-0.32);
  vec3 c = mix(paper, ink, ins*hat*0.22);
  float sdl=0.; for(int k=-2;k<=2;k++){ sdl=max(sdl, smoothstep(0.0025,0.,abs(q.x-float(k)*0.4))*ins); }
  c = mix(c, vec3(0.80,0.22,0.20), sdl*0.55);
  c = mix(c, ink, smoothstep(0.004,0.0015,abs(h)));
  return c;
}
vec3 pBlue(vec2 q, float h, float aa){
  vec3 bp = vec3(0.16,0.34,0.58)*(0.9+0.15*fbm(q*8.));
  vec2 d=q-vec2(0.,uAY-uR); float rr=length(d); float ang=atan(d.x,d.y);
  float ch = smoothstep(0.004,0.,abs(rr-uR));
  ch = max(ch, smoothstep(0.003,0.,abs(rr-(uR-0.16))));
  float sp=0.06; float da=abs(fract(ang/sp)-0.5)*sp*rr;
  ch = max(ch, smoothstep(0.0025,0.,da)*step(uR-0.5,rr)*step(rr,uR));
  ch = max(ch, smoothstep(0.003,0.,abs(q.y-uAY-(q.x-0.1)*0.9))*step(q.y,uAY+0.35));
  ch = max(ch, smoothstep(0.003,0.,abs(q.y-uAY+(q.x+0.25)*1.4))*step(q.y,uAY+0.4));
  ch *= 0.65+0.5*vn(q*420.);
  return mix(bp, vec3(0.95,0.96,0.98), clamp(ch,0.,1.)*0.9);
}
vec3 pDots(vec2 q, float h, float aa){
  vec3 bg = vec3(0.025,0.032,0.05);
  vec2 a = arcUV(q);
  vec2 g=q*48.; vec2 ci=floor(g); vec2 f=fract(g); vec2 ps=0.2+0.6*h22(ci);
  vec2 dw=(ci+ps)/48.;
  float inD = step(dw.y, edgeY(dw.x));
  vec3 dc = mix(vec3(0.80,0.88,0.82), vec3(0.96,0.62,0.30), step(0.8,h12(ci+11.)));
  float dep = smoothstep(0.,0.6,a.y);
  float d=length(f-ps);
  return bg + dc*(smoothstep(0.22,0.15,d)*(1.-dep*0.75) + smoothstep(0.5,0.,d)*0.12)*inD;
}
vec3 pSteps(vec2 q, float h, float aa){
  vec3 paper = vec3(0.965,0.955,0.93)-0.02*fbm(q*7.);
  float fx=fract(q.x/0.045+0.5);
  vec3 bar = mix(vec3(0.30,0.45,0.34)*(0.9+0.15*vn(q*30.)), vec3(0.16,0.26,0.19), smoothstep(0.03,0.,min(fx,1.-fx))*0.8);
  vec3 c = mix(paper, bar, smoothstep(aa,-aa,h));
  return mix(c, vec3(0.13,0.2,0.15), smoothstep(0.0035,0.001,abs(h)));
}
vec3 pEngr(vec2 q, float h, float aa){
  vec3 paper = vec3(0.93,0.885,0.79)*(0.95+0.08*fbm(q*5.));
  paper = mix(paper, vec3(0.80,0.66,0.48), smoothstep(0.62,0.72,fbm(q*9.+4.))*0.35);
  vec2 a = arcUV(q);
  float sh = clamp(smoothstep(0.,0.45,a.y)*0.75+(fbm(q*3.)-0.5)*0.5+0.1, 0., 1.);
  float l1 = abs(fract((q.x*0.866+q.y*0.5)/0.016)-0.5);
  float l2 = abs(fract((q.x*0.707-q.y*0.707)/0.02)-0.5);
  float w1 = 0.05+sh*0.28; float w2 = max(sh-0.4,0.)*0.5;
  float ink = max(smoothstep(0.5-w1, 0.5-w1+0.06, l1), smoothstep(0.5-w2, 0.5-w2+0.06, l2)*step(0.001,w2));
  vec3 c = mix(paper, vec3(0.14,0.10,0.07), ink*0.95*smoothstep(aa,-aa,h));
  return mix(c, vec3(0.16,0.11,0.08), smoothstep(0.003,0.001,abs(h))*0.9);
}
void main(){
  vec2 p = (gl_FragCoord.xy-0.5*uRes)/uRes.y;
  vec2 q = p/uZoom + uPan;
  float aa = 1.2/(uRes.y*uZoom);
  float h = q.y - edgeY(q.x);
  vec3 c = PLATE_FN(q,h,aa);
  if (PID>=2 && PID<=8 && h<0.) c *= 0.82+0.3*smoothstep(0.9,-0.9,q.x/uR);
  o = vec4(max(c,0.),1.);
}`;

// Passes 2 and 3: a macro lens. The rim is the focal plane; the background and the near body of the
// object soften with distance from it (separable, radius per pixel). The last pass adds grain,
// vignette and the fade.
const BLUR = COMMON + `
uniform sampler2D uTex; uniform vec2 uDir; uniform float uDof; uniform int uFinal;
uniform float uGrain; uniform float uFlood; uniform vec3 uFloodCol; uniform vec2 uApex;
void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 p = (fc-0.5*uRes)/uRes.y;
  vec2 q = p/uZoom + uPan;
  float h = q.y - edgeY(q.x);
  float r = uDof * max(smoothstep(0.004,0.42,h), 0.85*smoothstep(0.004,0.62,-h)) * 0.013 * uRes.y;
  vec3 acc = vec3(0.); float ws = 0.;
  for(int i=-6;i<=6;i++){ float t=float(i)/6.; float w=exp(-t*t*2.2); acc += texture(uTex,(fc+uDir*t*r)/uRes).rgb*w; ws += w; }
  vec3 c = acc/ws;
  if (uFinal==1){
    c += (h12(fc+fract(uT*7.13)*1000.)-0.5)*uGrain;
    c *= 1.-0.32*pow(length(p*vec2(0.72,1.0)),2.2);
    c = mix(c, vec3(0.), uFade);
    c = pow(max(c,0.),vec3(0.97));
    float fr = uFlood*1.9;
    c = mix(c, uFloodCol, smoothstep(fr, fr-0.45, length(p-uApex))*smoothstep(0.,0.15,uFlood));
  }
  o = vec4(c,1.);
}`;

const PLATE_FN = ['pDawn', 'pHill', 'pEgg', 'pHide', 'pEye', 'pHoof', 'pMilk', 'pFish', 'pAgar', 'pHE', 'pSmear', 'pGram', 'pElisa', 'pXray', 'pStem', 'pBell', 'pBlue', 'pDots', 'pSteps', 'pEngr'];
const plateSource = (n) => FS.replace('#version 300 es\n', `#version 300 es\n#define PID ${n}\n#define PLATE_FN ${PLATE_FN[n]}\n`);

// How much each plate is photographed like a macro subject (0 = flat paper or film, sharp all over).
const DOF = [0, 0.6, 1, 0.9, 0.8, 1, 0.8, 1, 0.9, 0.35, 0.35, 0.35, 1, 0, 0.35, 0, 0.15, 0.7, 0, 0.2];

// ---------- renderer ----------
export function createFilm({ glCanvas, txCanvas, cut = 'social', lang = 'th', dpr = 1, face = null, grain = 0.05, flood = [0.965, 0.937, 0.894] }) {
  const gl = glCanvas.getContext('webgl2', { antialias: false, preserveDrawingBuffer: true, alpha: false });
  if (!gl) throw new Error('webgl2 unavailable');
  const NAMES = ['uRes', 'uT', 'uLocal', 'uPlate', 'uAY', 'uR', 'uZoom', 'uPan', 'uFade', 'uSteps', 'uTex', 'uDir', 'uDof', 'uFinal', 'uSun', 'uGrain', 'uFlood', 'uFloodCol', 'uApex'];
  // Programs are started without waiting. With KHR_parallel_shader_compile the driver compiles them
  // off the main thread and ready() can ask without blocking; without it, first use waits.
  const par = gl.getExtension('KHR_parallel_shader_compile');
  function start(fs) {
    const prog = gl.createProgram();
    for (const [type, src] of [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, fs]]) {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); gl.attachShader(prog, s);
    }
    gl.linkProgram(prog);
    return { prog, U: null };
  }
  function finish(p) {
    if (p.U) return p;
    if (!gl.getProgramParameter(p.prog, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(p.prog) || gl.getAttachedShaders(p.prog).map((x) => gl.getShaderInfoLog(x)).join(' ');
      throw new Error(log);
    }
    const U = {}; for (const n of NAMES) U[n] = gl.getUniformLocation(p.prog, n);
    gl.useProgram(p.prog); gl.uniform1fv(U.uSteps, STEPS); gl.uniform1i(U.uTex, 0);
    p.U = U;
    return p;
  }
  const isDone = (p) => !!p.U || !par || gl.getProgramParameter(p.prog, par.COMPLETION_STATUS_KHR);
  const blur = start(BLUR);
  const plates = [];
  const plateProg = (n) => (plates[n] ||= start(plateSource(n)));
  gl.bindVertexArray(gl.createVertexArray());
  // Half-float targets keep the bright rims from clipping before the blur; 8-bit is the fallback.
  const float = !!gl.getExtension('EXT_color_buffer_float');
  const targets = [0, 1].map(() => ({ tex: gl.createTexture(), fb: gl.createFramebuffer() }));
  const ctx = txCanvas.getContext('2d');
  const { shots, duration } = timeline(cut);
  const copy = COPY[lang] || COPY.en;
  const FACE = face || (lang === 'th' ? 'Trirong, Newsreader, serif' : 'Newsreader, Trirong, serif');
  const WT = lang === 'th' ? 600 : 440;
  const seg = new Intl.Segmenter(lang === 'en' ? 'en' : 'th', { granularity: 'grapheme' });
  let W = 0, H = 0;

  function resize(cssW, cssH) {
    W = Math.round(cssW * dpr); H = Math.round(cssH * dpr);
    for (const c of [glCanvas, txCanvas]) { c.width = W; c.height = H; }
    gl.viewport(0, 0, W, H);
    for (const t of targets) {
      gl.bindTexture(gl.TEXTURE_2D, t.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, float ? gl.RGBA16F : gl.RGBA8, W, H, 0, gl.RGBA, float ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, t.fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t.tex, 0);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  function shotAt(t) {
    for (let i = shots.length - 1; i >= 0; i--) if (t >= shots[i].t0) return shots[i];
    return shots[0];
  }

  function renderAt(t) {
    const shot = shotAt(Math.min(Math.max(t, 0), duration - 1e-4));
    const local = t - shot.t0;
    const g = geometry(W, H);
    const cam = camera(g, shot, local);
    // Social cut fades out to black; the web cut fades in from black (the flight hands over in colour).
    const fade = cut === 'social' ? Math.min(Math.max((t - (duration - 0.5)) / 0.5, 0), 1) : 1 - Math.min(t / 0.45, 1);
    const pass = ({ prog, U }, target, extra) => {
      gl.useProgram(prog);
      gl.uniform2f(U.uRes, W, H); gl.uniform1f(U.uT, t); gl.uniform1f(U.uLocal, local); gl.uniform1i(U.uPlate, shot.p);
      gl.uniform1f(U.uAY, cam.ay); gl.uniform1f(U.uR, cam.r); gl.uniform1f(U.uZoom, cam.zoom); gl.uniform2f(U.uPan, cam.pan[0], cam.pan[1]); gl.uniform1f(U.uFade, fade);
      gl.uniform1f(U.uSun, shot.kind === 'end' ? ease(Math.min(local / shot.d, 1)) : shot.kind === 'fly' ? 1 + 2.5 * cam.k : 0);
      gl.uniform1f(U.uGrain, grain);
      gl.uniform1f(U.uFlood, shot.kind === 'fly' ? Math.min(Math.max((cam.k - 0.35) / 0.55, 0), 1) : 0);
      gl.uniform3f(U.uFloodCol, flood[0], flood[1], flood[2]);
      gl.uniform2f(U.uApex, 0, (cam.ay - cam.pan[1]) * cam.zoom);
      if (extra) extra(U);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fb : null);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const dof = shot.kind ? 0 : DOF[shot.p];
    pass(finish(plateProg(shot.p)), targets[0]);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, targets[0].tex);
    pass(finish(blur), targets[1], (U) => { gl.uniform2f(U.uDir, 1, 0); gl.uniform1f(U.uDof, dof); gl.uniform1i(U.uFinal, 0); });
    gl.bindTexture(gl.TEXTURE_2D, targets[1].tex);
    pass(blur, null, (U) => { gl.uniform2f(U.uDir, 0, 1); gl.uniform1f(U.uDof, dof); gl.uniform1i(U.uFinal, 1); });
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1 - fade;
    const S = sizes();
    if (shot.w !== undefined) drawWords(copy.words[shot.w], S.words[shot.w], shot, cam, g, local);
    if (shot.kind === 'title') drawBrand(copy.title, S.title, g.titleY, Math.min(local / 0.35, 1), false);
    if (shot.kind === 'logo') drawBrand(copy.brand, S.title * 1.1, g.titleY, 1, true);
    if (shot.kind === 'rise') drawBrand(copy.brand, S.title * 1.1, g.titleY + 0.6 * (cam.ay + 0.95), 1, true);
    if (shot.kind === 'end') drawCentered(copy.url, S.url, 0.17, Math.min(Math.max((local - 0.3) / 0.5, 0), 1), true);
    ctx.globalAlpha = 1;
  }

  function surfaceY(shot, cam, g, xpx) {
    const xw = ((xpx - W / 2) / H) / cam.zoom + cam.pan[0];
    const yw = edgeY(shot.p, xw, cam.ay, cam.r);
    return H / 2 - (yw - cam.pan[1]) * cam.zoom * H;
  }

  function textStyle(dark, px) {
    ctx.fillStyle = dark ? 'rgba(22,19,16,0.93)' : 'rgba(250,247,240,0.97)';
    ctx.shadowColor = dark ? 'rgba(0,0,0,0)' : 'rgba(255,236,210,0.35)';
    ctx.shadowBlur = dark ? 0 : px * 0.12;
    ctx.filter = 'blur(' + (0.35 * dpr).toFixed(2) + 'px)';
  }

  const measure = (text) => { ctx.save(); ctx.font = `${WT} 100px ${FACE}`; const w = ctx.measureText(text).width; ctx.restore(); return w; };
  // Two quiet phrases, then the last one at almost twice the size. Every phrase must fit the width:
  // 84% on a wide screen, 74% upright, which keeps the words clear of the like and share buttons that
  // Shorts, Reels and TikTok lay over the right edge.
  function sizes() {
    const up = W < H, frac = up ? 0.74 : 0.84, scale = [0.55, 0.55, 1];
    const base = Math.min(0.13 * H, ...copy.words.map((w, i) => (frac * W * 100) / (scale[i] * measure(w))));
    const title = Math.min(0.072 * H, ((up ? 0.72 : 0.6) * W * 100) / measure(copy.title));
    return { words: scale.map((k) => k * base), title, url: Math.min(0.04 * H, 0.052 * W) };
  }

  function drawWords(text, px, shot, cam, g, local) {
    ctx.save();
    ctx.font = `${WT} ${px}px ${FACE}`;
    ctx.textBaseline = 'alphabetic';
    textStyle(DARK_TEXT.has(shot.p), px);
    const first = shots.find((s) => s.w === shot.w) === shot;
    ctx.globalAlpha *= first ? Math.min(local / 0.12, 1) : 1;
    const parts = [...seg.segment(text)].map((s) => s.segment);
    const widths = parts.map((c) => ctx.measureText(c).width);
    let x = W / 2 - widths.reduce((a, b) => a + b, 0) / 2;
    const gap = 0.008 * H;
    parts.forEach((c, i) => {
      const cw = widths[i];
      const cx = x + cw / 2;
      const yl = surfaceY(shot, cam, g, cx - cw / 2), ym = surfaceY(shot, cam, g, cx), yr = surfaceY(shot, cam, g, cx + cw / 2);
      const top = Math.min(yl, ym, yr);
      const ang = shot.p === PL.STEPS ? 0 : Math.atan2(yr - yl, cw);
      ctx.save(); ctx.translate(cx, top - gap); ctx.rotate(ang); ctx.fillText(c, -cw / 2, 0); ctx.restore();
      x += cw;
    });
    ctx.restore();
  }

  function drawCentered(text, px, yN, alpha, spaced) {
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.font = `${WT} ${px}px ${FACE}`;
    if (spaced) ctx.letterSpacing = (px * 0.06).toFixed(1) + 'px';
    textStyle(false, px);
    ctx.textAlign = 'center';
    ctx.fillText(text, W / 2, H / 2 - yN * H + px * 0.35);
    ctx.restore();
  }

  function drawBrand(text, px, yN, alpha, withPaw) {
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.font = `${WT} ${px}px ${FACE}`;
    textStyle(false, px);
    const tw = ctx.measureText(text).width;
    const paw = withPaw ? px * 0.8 : 0, gapPx = withPaw ? px * 0.28 : 0;
    const x0 = W / 2 - (paw + gapPx + tw) / 2;
    const base = H / 2 - yN * H + px * 0.35;
    // VetMock paw, geometry from public/vetmock-logo.svg (viewBox 512), drawn in one colour.
    const s = paw / 300, cx = x0 + paw / 2, cy = base - px * 0.36;
    const E = [[256, 338, 92, 74, 0], [148, 232, 36, 48, -18], [212, 158, 34, 46, -6], [300, 158, 34, 46, 6], [364, 232, 36, 48, 18]];
    if (withPaw) {
      ctx.beginPath();
      for (const [ex, ey, rx, ry, rot] of E) { ctx.moveTo(cx + (ex - 256 + rx) * s, cy + (ey - 261) * s); ctx.ellipse(cx + (ex - 256) * s, cy + (ey - 261) * s, rx * s, ry * s, rot * Math.PI / 180, 0, Math.PI * 2); }
      ctx.fill();
    }
    ctx.fillText(text, x0 + paw + gapPx, base);
    ctx.restore();
  }

  function setDpr(x) { dpr = x; }
  function prepare() { for (const s of shots) plateProg(s.p); }
  function ready(t) {
    const s = shotAt(Math.min(Math.max(t, 0), duration - 1e-4));
    return isDone(blur) && isDone(plateProg(s.p));
  }
  return { resize, renderAt, setDpr, prepare, ready, duration, shots };
}
