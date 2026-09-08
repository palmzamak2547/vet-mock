import { STATES, poseAt } from "./motion.js";
const f = (x) => Number(x.toFixed(3));
const deg = (x) => f(x * 180 / Math.PI);
const paw = (x, y, s = 1, color = "#F8EDD8") => `<g transform="translate(${x} ${y}) scale(${s})" fill="${color}"><ellipse cy="5" rx="8" ry="6.5"/><ellipse cx="-9" cy="-4" rx="3.5" ry="4.3" transform="rotate(-24 -9 -4)"/><ellipse cx="-3" cy="-9" rx="3.3" ry="4.2"/><ellipse cx="5" cy="-8" rx="3.3" ry="4.2"/><ellipse cx="11" cy="-2" rx="3.2" ry="4" transform="rotate(25 11 -2)"/></g>`;
export function mascotSVG(state = "idle", time = 0, { label = "Mochi, VetMock study companion", shadow = true, pose } = {}) {
  const p = pose || poseAt(state, time), u = time / (STATES[state]?.duration || 4), safe = label.replace(/[<>&"']/g, "");
  const hand = (side) => {
    const x = side < 0 ? 194 : 318, angle = side < 0 ? p.armL : p.armR;
    return `<g data-rig="arm${side < 0 ? "L" : "R"}" transform="rotate(${-deg(angle)} ${x} 325)"><path d="M${x - 15} 322 Q${x - 25} 338 ${x - 21} 367 Q${x - 18} 389 ${x} 389 Q${x + 17} 388 ${x + 18} 369 L${x + 14} 326Z" fill="#F4DAB2"/><path d="M${x - 11} 333 Q${x - 16} 356 ${x - 13} 370" fill="none" stroke="#FFEACC" stroke-width="6" stroke-linecap="round"/>${side > 0 ? paw(x, 372, 0.64, "#C38B53") : ""}</g>`;
  };
  const eye = (x) => `<g data-rig="eye${x === 211 ? "L" : "R"}" transform="translate(${x + f(p.gaze * 65)} ${200 - f(p.gazeY * 120)}) scale(1 ${f(p.eye)})"><ellipse rx="15" ry="18" fill="#39261D"/><ellipse cx="-3" cy="4" rx="9" ry="10" fill="#4B3325"/><circle cx="5" cy="-8" r="5" fill="#FFFBF4"/></g>`;
  const stars = Array.from({ length: 5 }, (_, i) => {
    let t = u * Math.PI * 2 + i * 1.256;
    let x = 256 + Math.cos(t) * (135 + i % 2 * 16), y = 230 + Math.sin(t) * 110;
    return `<path d="M0 -9L3 -3L9 0L3 3L0 9L-3 3L-9 0L-3 -3Z" fill="${i % 2 ? "#688A58" : "#D3AA59"}" transform="translate(${f(x)} ${f(y)}) rotate(${f(t * 20)})"/>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="${safe}"><title>${safe}</title>
 ${shadow ? `<ellipse data-rig="shadow" cx="256" cy="454" rx="84" ry="12" fill="#4E463B" opacity=".09"/>` : ""}
 ${true ? `<circle data-rig="breath" cx="256" cy="276" r="${f(150 + p.breath * 16)}" fill="none" stroke="#7F9E78" stroke-width="2" opacity="${f(p.breath * 0.26)}"/>` : ""}
 <g data-rig="body" transform="translate(${f(p.x * 100)} ${f(-p.y * 70)}) translate(256 425) rotate(${-deg(p.rz)}) scale(${f(p.sx)} ${f(p.sy)}) translate(-256 -425)">
 <g data-rig="tail" transform="rotate(${deg(p.tail)} 193 373)"><path d="M202 396C163 402 141 380 151 348C155 340 164 346 166 356C168 371 182 371 198 366Z" fill="#EAC898"/></g>
 <g data-rig="legL" transform="translate(0 ${-f(p.legLiftL * 100)}) rotate(${deg(p.legL) * 0.7} 224 406)"><path d="M204 400L204 437Q204 453 226 453Q246 453 245 437L243 399Z" fill="#F1D6AF"/><path d="M216 438v9M231 438v10" stroke="#D2AD7D" stroke-width="2.5" stroke-linecap="round"/></g>
 <g data-rig="legR" transform="translate(0 ${-f(p.legLiftR * 100)}) rotate(${deg(p.legR) * 0.7} 288 406)"><path d="M270 400L270 437Q270 453 291 453Q312 453 310 437L308 399Z" fill="#F1D6AF"/><path d="M282 438v9M296 438v10" stroke="#D2AD7D" stroke-width="2.5" stroke-linecap="round"/></g>
 <path d="M204 307Q183 340 187 382Q190 426 254 428Q317 428 324 382Q328 341 307 306Z" fill="#F7DEB9"/>
 <ellipse cx="257" cy="367" rx="44" ry="45" fill="#FAE6C9"/>
 <path data-rig="scarf" d="M302 312Q335 295 340 308L325 320L342 329Q328 343 305 327Z" fill="#365B3A"/>
 <path d="M200 302Q256 323 314 302Q312 342 258 371Q220 350 200 302Z" fill="#4A704B"/>
 <path d="M202 307Q251 330 307 310" stroke="#65865B" fill="none" stroke-width="4"/>
 ${paw(260, 341, 0.8)}
 <path d="M207 315C201 345 202 377 237 388C272 399 305 374 306 326" fill="none" stroke="#304E36" stroke-width="6" stroke-linecap="round"/>
 <circle cx="240" cy="390" r="13" fill="#A98141"/><circle cx="240" cy="390" r="9" fill="#D9B873"/><circle cx="240" cy="390" r="6" fill="#CBA65B"/>
 <g data-rig="head" transform="translate(256 285) rotate(${-deg(p.headZ)}) translate(-256 -285)">
 <g data-rig="earL" transform="rotate(${-deg(p.earL)} 170 145)"><path d="M193 136Q162 107 142 133Q111 173 122 236Q126 258 147 254Q175 250 187 211Z" fill="#C88F55"/><path d="M151 146Q133 174 137 220" fill="none" stroke="#D7A16B" stroke-width="9" stroke-linecap="round"/></g>
 <path d="M335 145Q358 139 378 189Q398 239 362 257L335 226Z" fill="#C38A52"/>
 <path d="M158 192Q157 125 218 112Q264 93 319 119Q360 134 365 195L367 241Q368 291 311 306Q254 321 197 305Q142 289 146 243Z" fill="#F9E5C5"/>
 <path d="M178 164Q192 126 236 124Q254 125 260 113" fill="none" stroke="#FFF0D7" stroke-width="11" stroke-linecap="round"/>
 <g data-rig="earR" transform="rotate(${-deg(p.earR)} 322 135)"><path d="M295 125Q296 83 321 85Q345 88 357 117Q388 125 387 149Q386 174 364 177Q333 180 322 142Q319 131 316 130Z" fill="#CC955D"/><path d="M310 114Q317 93 330 108" fill="none" stroke="#DAA46F" stroke-width="7" stroke-linecap="round"/></g>
 <ellipse cx="183" cy="242" rx="16" ry="14" fill="#F2B68E" opacity=".85"/><ellipse cx="329" cy="242" rx="16" ry="14" fill="#F2B68E" opacity=".85"/>
 ${eye(211)}${eye(302)}
 <ellipse cx="243" cy="241" rx="29" ry="25" fill="#FFF2D9"/><ellipse cx="273" cy="241" rx="29" ry="25" fill="#FFF2D9"/>
 <path d="M247 218Q257 212 269 218Q273 222 260 231Q256 233 251 227Q241 221 247 218Z" fill="#493122"/>
 <path d="M258 229V239Q254 252 243 246M258 239Q264 252 275 243" fill="none" stroke="#513525" stroke-width="4" stroke-linecap="round"/>
 ${true ? `<g data-rig="mouth" opacity="${f(p.mouthOpen)}"><path d="M249 249Q259 254 270 247Q270 263 258 263Q250 262 249 249Z" fill="#69402B"/><ellipse cx="261" cy="258" rx="6" ry="3" fill="#E99F89"/></g>` : ""}
 </g>
 ${hand(-1)}${hand(1)}
 <g data-rig="book" opacity="${p.book}" transform="translate(0 ${f(Math.sin(u * 6.28) * 2)})"><path d="M202 371Q227 361 255 377Q283 361 311 371V421Q281 412 256 427Q227 412 202 421Z" fill="#3C6745"/><path d="M207 369Q233 364 254 379V420Q231 408 208 415Z" fill="#FFF6DF"/><path d="M258 379Q282 364 306 369V415Q281 408 258 420Z" fill="#EBDDBC"/><path d="M217 380l27 8m-27 3l27 8m-27 2l24 7m29-20l25-9m-25 20l25-9" stroke="#BBAF92" stroke-width="2" stroke-linecap="round"/></g>
 </g>
 <g data-rig="spark" opacity="${f(p.spark)}">${stars}</g>
 <g data-rig="question" opacity="${f(p.question)}"><text x="375" y="119" fill="#698550" font-family="sans-serif" font-size="43" font-weight="700" transform="rotate(9 375 119)">?</text><circle cx="369" cy="145" r="4" fill="#D7B569"/></g>
 <g data-rig="zzz" opacity="${f(p.zzz)}" fill="#81986D" font-family="sans-serif" font-weight="700"><text x="360" y="172" font-size="21">z</text><text x="385" y="139" font-size="27">z</text><text x="415" y="103" font-size="35">Z</text></g>
 <g data-rig="heart" opacity="${f(p.heart)}" transform="translate(370 198) scale(${f(0.7 + p.heart * 0.3)})"><path d="M0 12C-40-8-18-36 0-19C18-36 40-8 0 12Z" fill="#D28D7E"/></g>
 <g data-rig="check" opacity="${f(p.check)}"><circle cx="377" cy="166" r="24" fill="#668853"/><path d="M365 166l8 8 17-20" fill="none" stroke="#FFF8E6" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g>
 </svg>`;
}
