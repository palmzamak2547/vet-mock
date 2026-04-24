// Sample SVG illustrations. Replace with real photo URLs when you have them.
const encodeSvg = (s) => `data:image/svg+xml;utf8,${encodeURIComponent(s)}`;

export const IMG_FEMUR = encodeSvg(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'>
<rect width='400' height='240' fill='#fdf8ef'/>
<text x='20' y='30' font-family='serif' font-size='14' fill='#2b2419'>Approach to Femur</text>
<line x1='80' y1='60' x2='80' y2='210' stroke='#c26d6d' stroke-width='3' stroke-dasharray='6,4'/>
<circle cx='80' cy='60' r='18' fill='#e8d4a8' stroke='#b88940' stroke-width='2'/>
<text x='105' y='65' font-family='sans-serif' font-size='12' fill='#5c4f3d'>Greater trochanter</text>
<circle cx='80' cy='210' r='16' fill='#e8d4a8' stroke='#b88940' stroke-width='2'/>
<text x='105' y='215' font-family='sans-serif' font-size='12' fill='#5c4f3d'>Lateral condyle</text>
<text x='105' y='140' font-family='italic serif' font-size='12' fill='#c26d6d'>incision line</text>
<text x='265' y='125' font-family='sans-serif' font-size='11' fill='#4a6b4a'>vastus lateralis (cranial)</text>
<text x='265' y='180' font-family='sans-serif' font-size='11' fill='#4a6b4a'>biceps femoris (caudal)</text>
</svg>`);

export const IMG_NERVE = encodeSvg(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'>
<rect width='400' height='240' fill='#fdf8ef'/>
<text x='20' y='30' font-family='serif' font-size='14' fill='#2b2419'>Radial nerve position</text>
<rect x='170' y='50' width='60' height='150' fill='#e8d4a8' stroke='#b88940' stroke-width='2' rx='6'/>
<text x='175' y='125' font-family='sans-serif' font-size='10' fill='#5c4f3d'>Humerus</text>
<ellipse cx='130' cy='120' rx='28' ry='70' fill='#a8c0a8' opacity='0.6'/>
<text x='90' y='90' font-family='sans-serif' font-size='10' fill='#2b2419'>Lat. head</text>
<text x='90' y='102' font-family='sans-serif' font-size='10' fill='#2b2419'>of triceps</text>
<ellipse cx='270' cy='120' rx='28' ry='70' fill='#e8b8b8' opacity='0.6'/>
<text x='252' y='125' font-family='sans-serif' font-size='10' fill='#2b2419'>Brachialis</text>
<path d='M 160 80 Q 200 150 240 200' stroke='#c26d6d' stroke-width='4' fill='none'/>
<circle cx='200' cy='140' r='6' fill='#c26d6d'/>
<text x='210' y='145' font-family='italic serif' font-size='13' fill='#c26d6d'>Radial n.</text>
</svg>`);

export const IMG_CYTO = encodeSvg(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'>
<rect width='400' height='240' fill='#fdf8ef'/>
<text x='20' y='30' font-family='serif' font-size='14' fill='#2b2419'>Vaginal cytology - Estrus</text>
<polygon points='60,80 90,70 110,90 100,120 70,120 55,100' fill='#e8b8b8' stroke='#c26d6d' stroke-width='1.5'/>
<polygon points='150,70 185,75 195,105 170,130 135,115 130,90' fill='#e8b8b8' stroke='#c26d6d' stroke-width='1.5'/>
<polygon points='230,90 265,80 280,110 265,140 230,135 215,110' fill='#e8b8b8' stroke='#c26d6d' stroke-width='1.5'/>
<polygon points='310,75 345,85 355,115 335,145 305,135 295,105' fill='#e8b8b8' stroke='#c26d6d' stroke-width='1.5'/>
<polygon points='90,160 130,155 145,185 125,210 85,205 70,180' fill='#e8b8b8' stroke='#c26d6d' stroke-width='1.5'/>
<polygon points='200,170 235,165 245,195 225,220 195,215 185,190' fill='#e8b8b8' stroke='#c26d6d' stroke-width='1.5'/>
<text x='20' y='230' font-family='italic serif' font-size='11' fill='#5c4f3d'>angular cornified cells, clean background</text>
</svg>`);
