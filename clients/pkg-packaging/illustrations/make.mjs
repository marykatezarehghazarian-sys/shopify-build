// PKG product illustrations (not photos): branded flat/isometric drawings with a "YOUR LOGO" spot.
// node clients/pkg-packaging/illustrations/make.mjs  -> svg/*.svg and png/*.png (1200x1200)
import { writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
const dir = new URL('.', import.meta.url).pathname;
mkdirSync(dir + 'svg', { recursive: true }); mkdirSync(dir + 'png', { recursive: true });

const C = {
  bg: '#F3EEE6', ink: '#121212', green: '#52BE36', dgreen: '#21642F',
  kraft: '#C9A27A', kraftD: '#A9825A', kraftL: '#DCC09E', white: '#FFFFFF', whiteD: '#E6DFD3', whiteM: '#F2EDE5',
};
const c30 = Math.cos(Math.PI / 6), s30 = 0.5;
const P = (cx, cy) => (x, y, z) => [cx + (x - y) * c30, cy + (x + y) * s30 - z];
const pts = (a) => a.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ');
const poly = (a, fill, extra = '') => `<polygon points="${pts(a)}" fill="${fill}" ${extra}/>`;
// isometric box: returns svg for left, right, top faces
function box(o, w, d, h, top, left, right, stroke = 'rgba(0,0,0,.08)') {
  const T = [o(0, 0, h), o(w, 0, h), o(w, d, h), o(0, d, h)];
  const L = [o(0, d, 0), o(w, d, 0), o(w, d, h), o(0, d, h)];
  const R = [o(w, 0, 0), o(w, d, 0), o(w, d, h), o(w, 0, h)];
  return poly(L, left, `stroke="${stroke}"`) + poly(R, right, `stroke="${stroke}"`) + poly(T, top, `stroke="${stroke}"`);
}
// text/logo drawn flat on the top face (u along x, v along y), origin at o(x0,y0,z)
const onTop = (o, x0, y0, z, inner) => { const [tx, ty] = o(x0, y0, z); return `<g transform="matrix(${c30},${s30},${-c30},${s30},${tx},${ty})">${inner}</g>`; };
// front-left face = plane y=d (x runs down-right); front-right face = plane x=w (y runs down-left, read it the other way)
const faceL = (o, x0, d, z0, inner) => { const [tx, ty] = o(x0, d, z0); return `<g transform="matrix(${c30},${s30},0,1,${tx},${ty})">${inner}</g>`; };
const faceR = (o, w, y0, z0, inner) => { const [tx, ty] = o(w, y0, z0); return `<g transform="matrix(${c30},${-s30},0,1,${tx},${ty})">${inner}</g>`; };
const logo = (w, h, color = C.dgreen, bg = 'none', size) => {
  const fs = size || Math.min(h * 0.32, w * 0.16);
  return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h * 0.18}" fill="${bg}" stroke="${color}" stroke-width="${Math.max(2, h * 0.04)}" stroke-dasharray="${h * 0.12} ${h * 0.08}"/>` +
    `<text x="0" y="${fs * 0.36}" text-anchor="middle" font-family="Archivo, Arial Black, Arial, sans-serif" font-weight="800" font-size="${fs}" fill="${color}" letter-spacing="${fs * 0.06}">YOUR LOGO</text>`;
};
const shadow = (cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="rgba(18,18,18,.10)"/>`;
const frame = (inner, label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="1200" height="1200">
<rect width="1200" height="1200" fill="${C.bg}"/>
<circle cx="600" cy="560" r="430" fill="#EAE3D7"/>
${inner}
<g font-family="Inter, Arial, sans-serif">
<text x="60" y="1135" font-size="30" font-weight="700" fill="${C.ink}" letter-spacing="1">${label.toUpperCase()}</text>
<text x="1140" y="1135" text-anchor="end" font-size="26" fill="#6b655d">Made to order · your logo &amp; colours</text>
</g>
<g transform="translate(60,60)"><rect width="128" height="48" rx="8" fill="${C.green}"/><text x="64" y="33" text-anchor="middle" font-family="Archivo, Arial Black, Arial, sans-serif" font-weight="900" font-size="26" fill="#fff">PKG.</text></g>
</svg>`;

const S = {};

// 1 Pizza box
S['pizza-box'] = ['Pizza box', (() => {
  const o = P(600, 330); const w = 560, d = 560, h = 70;
  return shadow(600, 930, 520, 90) + box(o, w, d, h, C.kraftL, C.kraftD, C.kraft) +
    poly([o(0, d, h * 0.55), o(w, d, h * 0.55), o(w, d, h * 0.45), o(0, d, h * 0.45)], 'rgba(0,0,0,.12)') +
    onTop(o, w / 2, d / 2, h, logo(300, 140, C.dgreen)) +
    onTop(o, w / 2, d * 0.84, h, `<text x="0" y="0" text-anchor="middle" font-family="Inter,Arial" font-size="26" fill="${C.dgreen}" letter-spacing="3">HOT &amp; FRESH</text>`);
})()];

// 2 Burger box (clamshell)
S['burger-box'] = ['Burger box', (() => {
  const o = P(600, 420); const w = 380, d = 380, h = 160;
  const base = box(o, w, d, h * 0.55, C.whiteM, C.whiteD, C.white);
  const lidO = P(600, 420 - h * 0.55 + 6);
  const lid = poly([lidO(0, 0, 90), lidO(w, 0, 90), lidO(w, d, 90), lidO(0, d, 90)], C.white, 'stroke="rgba(0,0,0,.08)"') +
    poly([lidO(0, d, 0), lidO(w, d, 0), lidO(w, d, 90), lidO(0, d, 90)], C.whiteD, 'stroke="rgba(0,0,0,.08)"') +
    poly([lidO(w, 0, 0), lidO(w, d, 0), lidO(w, d, 90), lidO(w, 0, 90)], '#F7F3EC', 'stroke="rgba(0,0,0,.08)"');
  return shadow(600, 815, 360, 55) + base + lid + onTop(lidO, w / 2, d / 2, 90, logo(230, 110, C.dgreen)) +
    `<rect x="${o(w, d, 0)[0] - 330}" y="${o(w, d, 0)[1] - 150}" width="0" height="0"/>` +
    poly([o(0, d, 40), o(w, d, 40), o(w, d, 52), o(0, d, 52)], C.green);
})()];

// 3 Cake box with window
S['cake-box'] = ['Cake box with window', (() => {
  const o = P(600, 430); const w = 420, d = 420, h = 300;
  const win = onTop(o, w / 2, d / 2, h, `<rect x="-130" y="-130" width="260" height="260" rx="20" fill="#F7D9DC" stroke="rgba(0,0,0,.08)"/><circle cx="-40" cy="-30" r="34" fill="#E9A3AE"/><circle cx="50" cy="30" r="28" fill="#E9A3AE"/><circle cx="20" cy="-70" r="16" fill="#C9354A"/><rect x="-130" y="-130" width="260" height="260" rx="20" fill="rgba(255,255,255,.35)"/>`);
  return shadow(600, 870, 400, 60) + box(o, w, d, h, C.white, C.whiteD, '#F7F3EC') + win +
    faceR(o, w, d / 2, h * 0.55, logo(250, 110, C.dgreen)) +
    poly([o(w, 0, h * 0.18), o(w, d, h * 0.18), o(w, d, h * 0.26), o(w, 0, h * 0.26)], C.green);
})()];

// 4 Paper cup with sleeve
S['paper-cup'] = ['Paper cup & sleeve', (() => {
  const cx = 600, top = 250, bot = 900, rt = 210, rb = 150;
  const body = `<path d="M${cx - rt},${top} L${cx - rb},${bot} A${rb},34 0 0 0 ${cx + rb},${bot} L${cx + rt},${top} Z" fill="${C.white}" stroke="rgba(0,0,0,.08)"/>`;
  const sy1 = 470, sy2 = 700; const r1 = rt - (rt - rb) * (sy1 - top) / (bot - top), r2 = rt - (rt - rb) * (sy2 - top) / (bot - top);
  const sleeve = `<path d="M${cx - r1},${sy1} L${cx - r2},${sy2} A${r2},30 0 0 0 ${cx + r2},${sy2} L${cx + r1},${sy1} A${r1},32 0 0 1 ${cx - r1},${sy1} Z" fill="${C.kraft}"/>`;
  const lid = `<ellipse cx="${cx}" cy="${top}" rx="${rt + 18}" ry="44" fill="#2B2622"/><rect x="${cx - rt - 18}" y="${top - 50}" width="${(rt + 18) * 2}" height="50" fill="#2B2622"/><ellipse cx="${cx}" cy="${top - 50}" rx="${rt + 4}" ry="40" fill="#3A332E"/><ellipse cx="${cx + 70}" cy="${top - 56}" rx="34" ry="10" fill="#1d1916"/>`;
  return shadow(600, 930, 220, 40) + body + sleeve + `<g transform="translate(${cx},${(sy1 + sy2) / 2 + 8})">${logo(230, 100, C.white, 'none', 30)}</g>` + lid +
    `<path d="M${cx - rb + 10},${bot - 30} L${cx + rb - 10},${bot - 30}" stroke="${C.green}" stroke-width="14"/>`;
})()];

// 5 Kraft bag with twisted handle
S['kraft-bag'] = ['Kraft bag with twisted handle', (() => {
  const o = P(620, 520); const w = 400, d = 150, h = 420;
  const handle = (y) => { const a = o(w * 0.25, y, h), b = o(w * 0.75, y, h); const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - 170; return `<path d="M${a[0]},${a[1]} Q${mx},${my} ${b[0]},${b[1]}" fill="none" stroke="${C.kraftD}" stroke-width="16" stroke-linecap="round"/>`; };
  return shadow(640, 815, 300, 50) + handle(d * 0.2) + box(o, w, d, h, '#8E6B46', C.kraft, C.kraftD) +
    poly([o(0, 0, h), o(w, 0, h), o(w, d, h), o(0, d, h)], '#6F5236') + handle(d * 0.8) +
    faceL(o, w / 2, d, h * 0.58, logo(250, 110, C.ink)) +
    poly([o(w * 0.12, d, h * 0.22), o(w * 0.88, d, h * 0.22), o(w * 0.88, d, h * 0.27), o(w * 0.12, d, h * 0.27)], C.green);
})()];

// 6 Stickers sheet
S['logo-stickers'] = ['Logo stickers', (() => {
  let s = shadow(600, 930, 360, 60) + `<g transform="rotate(-8 600 560)"><rect x="300" y="200" width="600" height="700" rx="24" fill="${C.white}" stroke="rgba(0,0,0,.08)"/>`;
  const cols = [C.green, C.dgreen, C.kraft, C.ink];
  let i = 0;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) {
    const x = 450 + c * 300, y = 330 + r * 215, col = cols[i++ % 4];
    s += `<circle cx="${x}" cy="${y}" r="92" fill="${col}"/><circle cx="${x}" cy="${y}" r="74" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="3" stroke-dasharray="8 7"/>` +
      `<text x="${x}" y="${y - 4}" text-anchor="middle" font-family="Archivo, Arial Black, Arial" font-weight="800" font-size="24" fill="#fff">YOUR</text><text x="${x}" y="${y + 24}" text-anchor="middle" font-family="Archivo, Arial Black, Arial" font-weight="800" font-size="24" fill="#fff">LOGO</text>`;
  }
  return s + `</g><g transform="rotate(14 880 820)"><circle cx="880" cy="820" r="96" fill="${C.green}" stroke="#fff" stroke-width="10"/><text x="880" y="830" text-anchor="middle" font-family="Archivo, Arial Black" font-weight="800" font-size="26" fill="#fff">THANK YOU</text></g>`;
})()];

// 7 Mailer box (lid open)
S['mailer-box'] = ['Mailer box', (() => {
  const o = P(600, 520); const w = 460, d = 340, h = 150;
  const lidO = (x, y) => o(x, -y * 0.34, h + y * 0.94);
  const inside = poly([o(16, 16, h), o(w - 16, 16, h), o(w - 16, d - 16, h), o(16, d - 16, h)], '#E9F5E4');
  const tissue = poly([o(40, 40, h + 4), o(w - 60, 30, h + 4), o(w - 40, d - 50, h + 4), o(60, d - 40, h + 4)], '#FFFFFF', 'stroke="rgba(0,0,0,.06)"');
  const lid = poly([lidO(0, 0), lidO(w, 0), lidO(w, d), lidO(0, d)], C.green, 'stroke="rgba(0,0,0,.08)"');
  const lidIn = poly([lidO(14, 14), lidO(w - 14, 14), lidO(w - 14, d - 10), lidO(14, d - 10)], '#5FC844');
  const [lx, ly] = lidO(w / 2, d / 2);
  return shadow(600, 890, 430, 60) + box(o, w, d, h, '#D4EBCB', C.dgreen, C.green) + inside + tissue + lid + lidIn +
    `<g transform="translate(${lx},${ly}) skewY(30) scale(0.9,0.75)">${logo(260, 110, '#ffffff')}</g>` +
    faceL(o, w / 2, d, h * 0.5, `<text x="0" y="10" text-anchor="middle" font-family="Archivo, Arial Black" font-weight="800" font-size="34" fill="#fff" letter-spacing="3">YOUR BRAND</text>`);
})()];

// 8 Business cards
S['business-cards'] = ['Business cards', (() => {
  let s = shadow(600, 880, 400, 70);
  const card = (x, y, rot, fill, txt, txtc) => `<g transform="translate(${x},${y}) rotate(${rot})"><rect x="-260" y="-150" width="520" height="300" rx="16" fill="${fill}" stroke="rgba(0,0,0,.08)"/>${txt.replace(/COLOR/g, txtc)}</g>`;
  s += card(560, 640, -14, C.ink, `<g transform="translate(0,-20)">${logo(300, 120, C.green)}</g><text x="0" y="110" text-anchor="middle" font-family="Inter,Arial" font-size="24" fill="#bbb" letter-spacing="4">YOURBRAND.COM</text>`, '');
  s += card(650, 520, 6, C.white, `<rect x="-260" y="-150" width="16" height="300" fill="${C.green}"/><text x="-200" y="-40" font-family="Archivo, Arial Black" font-weight="800" font-size="44" fill="${C.ink}">Your Name</text><text x="-200" y="4" font-family="Inter,Arial" font-size="26" fill="#6b655d">Job title</text><text x="-200" y="80" font-family="Inter,Arial" font-size="24" fill="${C.ink}">+961 00 000 000</text><text x="-200" y="114" font-family="Inter,Arial" font-size="24" fill="${C.ink}">hello@yourbrand.com</text>`, '');
  return s;
})()];

// 9 Notebook
S['notebook'] = ['Branded notebook', (() => {
  return shadow(600, 930, 330, 60) + `<g transform="rotate(-6 600 560)">
<rect x="350" y="190" width="520" height="720" rx="22" fill="${C.whiteD}"/>
<rect x="330" y="180" width="520" height="720" rx="22" fill="${C.dgreen}"/>
<rect x="330" y="180" width="70" height="720" rx="22" fill="#1A5025"/>
<g transform="translate(615,470)">${logo(330, 140, '#ffffff')}</g>
<text x="615" y="700" text-anchor="middle" font-family="Inter,Arial" font-size="30" fill="#CFE5C6" letter-spacing="6">NOTES · 2026</text>
<rect x="820" y="180" width="18" height="720" fill="${C.green}"/></g>`;
})()];

// 10 Invitation + envelope
S['invitation'] = ['Invitation & envelope', (() => {
  return shadow(600, 920, 420, 70) +
    `<g transform="rotate(-7 520 610)"><rect x="220" y="400" width="600" height="420" rx="14" fill="${C.kraftL}"/><polygon points="220,400 520,640 820,400" fill="${C.kraft}"/><circle cx="520" cy="640" r="40" fill="#8E2B2B"/><text x="520" y="650" text-anchor="middle" font-family="Georgia,serif" font-size="30" fill="#f3d9c9">A&amp;J</text></g>` +
    `<g transform="rotate(5 720 470)"><rect x="500" y="180" width="440" height="600" rx="10" fill="${C.white}" stroke="rgba(0,0,0,.08)"/><rect x="525" y="205" width="390" height="550" rx="6" fill="none" stroke="#C8A96A" stroke-width="3"/>
<text x="720" y="330" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="34" fill="#6b655d">Together with their families</text>
<text x="720" y="430" text-anchor="middle" font-family="Georgia,serif" font-size="64" fill="${C.ink}">Your Names</text>
<text x="720" y="500" text-anchor="middle" font-family="Inter,Arial" font-size="24" fill="#6b655d" letter-spacing="4">INVITE YOU TO CELEBRATE</text>
<text x="720" y="620" text-anchor="middle" font-family="Inter,Arial" font-size="28" fill="${C.ink}">Saturday · 12 June</text>
<line x1="640" y1="670" x2="800" y2="670" stroke="#C8A96A" stroke-width="2"/></g>`;
})()];

const require = createRequire('/opt/node-tools/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const pg = await b.newPage({ viewport: { width: 1200, height: 1200 } });
for (const [k, [label, inner]] of Object.entries(S)) {
  const svg = frame(inner, label);
  writeFileSync(`${dir}svg/${k}.svg`, svg);
  await pg.setContent(`<html><body style="margin:0">${svg}</body></html>`);
  await pg.screenshot({ path: `${dir}png/${k}.png`, clip: { x: 0, y: 0, width: 1200, height: 1200 } });
  console.log('ok', k);
}
await b.close();
