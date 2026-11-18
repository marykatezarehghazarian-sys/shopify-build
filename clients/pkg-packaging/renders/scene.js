// PKG product renders: simple real-world geometry, paper textures made on canvas, studio light.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const S = 1200;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(S, S); renderer.setPixelRatio(1);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.VSMShadowMap;
document.body.appendChild(renderer.domElement);
const pmrem = new THREE.PMREMGenerator(renderer);
const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

// ---------- random + noise ----------
let seed = 1; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
function valueNoise(w, h, cell) {
  const gw = Math.ceil(w / cell) + 2, gh = Math.ceil(h / cell) + 2, g = new Float32Array(gw * gh).map(() => rnd());
  const out = new Float32Array(w * h), sm = (t) => t * t * (3 - 2 * t);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const fx = x / cell, fy = y / cell, ix = fx | 0, iy = fy | 0, tx = sm(fx - ix), ty = sm(fy - iy);
    const a = g[iy * gw + ix], b = g[iy * gw + ix + 1], c = g[(iy + 1) * gw + ix], d = g[(iy + 1) * gw + ix + 1];
    out[y * w + x] = (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
  }
  return out;
}
function fbm(w, h) { const o = new Float32Array(w * h); [[64, .45], [24, .3], [8, .15], [3, .1]].forEach(([c, a]) => { const n = valueNoise(w, h, c); for (let i = 0; i < o.length; i++) o[i] += n[i] * a; }); return o; }
const N = 1024; let FB; const fb = () => (FB ||= fbm(N, N));
const hex = (c) => { const v = new THREE.Color(c); return [v.r * 255, v.g * 255, v.b * 255]; };

// paper texture: base colour with mottling, fibres, specks. kind: 'kraft' | 'white' | 'card' | 'tissue'
const texCache = {};
function paperCanvas(color, kind = 'kraft') {
  const cv = document.createElement('canvas'); cv.width = cv.height = N; const x = cv.getContext('2d');
  const img = x.createImageData(N, N), n = fb(), [r, g, b] = hex(color);
  const amp = kind === 'kraft' ? 13 : kind === 'card' ? 6 : 4;
  for (let i = 0; i < N * N; i++) { const v = (n[i] - 0.5) * amp; img.data[i * 4] = r + v; img.data[i * 4 + 1] = g + v * 0.95; img.data[i * 4 + 2] = b + v * 0.85; img.data[i * 4 + 3] = 255; }
  x.putImageData(img, 0, 0);
  const fibres = kind === 'kraft' ? 9000 : 1500;
  for (let i = 0; i < fibres; i++) {
    const px = rnd() * N, py = rnd() * N, a = rnd() * Math.PI, l = 2 + rnd() * (kind === 'kraft' ? 9 : 6);
    x.strokeStyle = rnd() < 0.5 ? `rgba(60,35,10,${kind === 'kraft' ? 0.10 : 0.025})` : `rgba(255,245,225,${kind === 'kraft' ? 0.14 : 0.05})`;
    x.lineWidth = 0.5 + rnd() * 0.6; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke();
  }
  if (kind === 'kraft') for (let i = 0; i < 260; i++) { x.fillStyle = `rgba(50,28,8,${0.15 + rnd() * 0.3})`; x.beginPath(); x.arc(rnd() * N, rnd() * N, 0.5 + rnd() * 1.4, 0, 7); x.fill(); }
  return cv;
}
function bumpCanvas() {
  const cv = document.createElement('canvas'); cv.width = cv.height = N; const x = cv.getContext('2d');
  const img = x.createImageData(N, N), n = fb(), m = valueNoise(N, N, 2);
  for (let i = 0; i < N * N; i++) { const v = 128 + (n[i] - 0.5) * 60 + (m[i] - 0.5) * 50; img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v; img.data[i * 4 + 3] = 255; }
  x.putImageData(img, 0, 0); return cv;
}
let BUMP; const bumpTex = () => { if (!BUMP) { BUMP = new THREE.CanvasTexture(bumpCanvas()); BUMP.wrapS = BUMP.wrapT = THREE.RepeatWrapping; } return BUMP; };
function tex(cv, rep = 1) { const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep); t.anisotropy = 8; return t; }
function paperMat(color, kind = 'kraft', { rep = 1, print = null, rough = null, side = THREE.FrontSide } = {}) {
  let cv = paperCanvas(color, kind);
  if (print) { const c2 = document.createElement('canvas'); c2.width = c2.height = N; const x = c2.getContext('2d'); x.drawImage(cv, 0, 0); print(x, N); cv = c2; }
  const bt = bumpTex();
  return new THREE.MeshStandardMaterial({ map: tex(cv, print ? 1 : rep), bumpMap: bt, bumpScale: kind === 'kraft' ? 0.5 : 0.25, roughness: rough ?? (kind === 'kraft' ? 0.92 : kind === 'card' ? 0.7 : 0.82), metalness: 0, side });
}

// ---------- printed placeholder logo (ink with slight press texture) ----------
function drawLogo(x, cx, cy, size, ink = '#1f3d26', { word = 'YOUR LOGO', sub = 'EST. 2026' } = {}) {
  x.save(); x.translate(cx, cy); x.fillStyle = ink; x.strokeStyle = ink; x.globalAlpha = 0.9;
  x.lineWidth = size * 0.025; x.beginPath(); x.arc(0, 0, size * 0.5, 0, 7); x.stroke();
  x.lineWidth = size * 0.01; x.beginPath(); x.arc(0, 0, size * 0.44, 0, 7); x.stroke();
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = `800 ${size * 0.17}px Georgia, 'DejaVu Serif', serif`; x.fillText(word.split(' ')[0], 0, -size * 0.06);
  x.font = `800 ${size * 0.17}px Georgia, 'DejaVu Serif', serif`; x.fillText(word.split(' ')[1] || '', 0, size * 0.12);
  x.font = `600 ${size * 0.06}px Arial, sans-serif`; x.fillText(sub.split('').join(' '), 0, size * 0.3);
  x.beginPath(); x.moveTo(-size * 0.22, -size * 0.25); x.lineTo(size * 0.22, -size * 0.25); x.lineWidth = size * 0.012; x.stroke();
  // ink voids
  x.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 400; i++) { x.globalAlpha = 0.25 * rnd(); x.beginPath(); x.arc((rnd() - .5) * size * 1.05, (rnd() - .5) * size * 1.05, rnd() * 1.6, 0, 7); x.fill(); }
  x.restore();
}
// print on a sub-rectangle of a canvas, rotated (for box faces we print into its own texture)
const printLogo = (u, v, s, ink, opts) => (x, n) => drawLogo(x, u * n, v * n, s * n, ink, opts);

// ---------- scene per product ----------
let scene, camera;
function newScene(bg = '#ECE7DF') {
  seed = 7;
  scene = new THREE.Scene(); scene.environment = envTex; scene.environmentIntensity = 0.55;
  scene.background = new THREE.Color(bg);
  // studio sweep: floor + curve + back wall in one piece
  const prof = []; for (let i = 0; i <= 24; i++) { const a = (i / 24) * Math.PI / 2; prof.push([-4 + 0, 0]); }
  const shape = [];
  for (let z = 14; z > -4; z -= 0.5) shape.push([z, 0]);
  for (let i = 0; i <= 20; i++) { const a = (i / 20) * Math.PI / 2; shape.push([-4 - Math.sin(a) * 3, 3 - Math.cos(a) * 3]); }
  shape.push([-7, 12]);
  const pos = [], idx = [], W = 30;
  shape.forEach(([z, y]) => { pos.push(-W, y, z, W, y, z); });
  for (let i = 0; i < shape.length - 1; i++) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  const sweep = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: bg, roughness: 1 })); sweep.receiveShadow = true; scene.add(sweep);
  const key = new THREE.DirectionalLight('#fff6ec', 2.4); key.position.set(-5, 9, 6); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 9; key.shadow.blurSamples = 24; key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02;
  Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 1, far: 30 }); scene.add(key);
  const rim = new THREE.DirectionalLight('#eef3ff', 0.6); rim.position.set(6, 5, -4); scene.add(rim);
  scene.add(new THREE.HemisphereLight('#ffffff', '#cbbfae', 0.25));
  camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
}
function contactShadow(w, d, x = 0, z = 0, strength = 0.62) {
  const cv = document.createElement('canvas'); cv.width = cv.height = 256; const c = cv.getContext('2d');
  const gr = c.createRadialGradient(128, 128, 10, 128, 128, 128); gr.addColorStop(0, `rgba(0,0,0,${strength})`); gr.addColorStop(0.6, `rgba(0,0,0,${strength * 0.35})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = gr; c.fillRect(0, 0, 256, 256);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w * 1.45, d * 1.45), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.set(x, 0.002, z); scene.add(m);
}
function frame(obj, { dir = [0.85, 0.62, 1.35], fill = 0.62, lookY = null } = {}) {
  const box = new THREE.Box3().setFromObject(obj), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
  const r = size.length() / 2, dist = r / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * (0.62 / fill);
  const d = new THREE.Vector3(...dir).normalize();
  camera.position.copy(c).addScaledVector(d, dist); camera.lookAt(c.x, lookY ?? c.y, c.z);
}
function shadowAll(o) { o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); }
function finish() {
  renderer.render(scene, camera);
  const out = document.createElement('canvas'); out.width = out.height = S; const x = out.getContext('2d');
  x.drawImage(renderer.domElement, 0, 0);
  // lens vignette + film grain
  const v = x.createRadialGradient(S / 2, S / 2, S * 0.35, S / 2, S / 2, S * 0.8); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(40,30,20,0.16)');
  x.fillStyle = v; x.fillRect(0, 0, S, S);
  const img = x.getImageData(0, 0, S, S); for (let i = 0; i < img.data.length; i += 4) { const gN = (rnd() - 0.5) * 9; img.data[i] += gN; img.data[i + 1] += gN; img.data[i + 2] += gN; }
  x.putImageData(img, 0, 0);
  return out.toDataURL('image/jpeg', 0.9);
}

// ---------- building blocks ----------
const KRAFT = '#CDAB80', WHITE = '#F4F1EA', INK = '#1F3D26';
function faceMat(color, kind, printFn) { return paperMat(color, kind, { print: printFn }); }
// box with 6 materials (+x,-x,+y,-y,+z,-z), rounded edges
function rbox(w, h, d, mats, r = 0.02) {
  const g = new RoundedBoxGeometry(w, h, d, 3, r);
  if (!g.index) g.setIndex([...Array(g.attributes.position.count).keys()]);
  // RoundedBoxGeometry has one group; split faces by normal into groups for 6 materials
  if (Array.isArray(mats)) {
    const n = g.attributes.normal, idx = g.index.array, groups = [[], [], [], [], [], []];
    for (let i = 0; i < idx.length; i += 3) {
      const a = idx[i]; let nx = 0, ny = 0, nz = 0; for (let k = 0; k < 3; k++) { nx += n.getX(idx[i + k]); ny += n.getY(idx[i + k]); nz += n.getZ(idx[i + k]); }
      const ax = Math.abs(nx), ay = Math.abs(ny), az = Math.abs(nz);
      const f = ax >= ay && ax >= az ? (nx > 0 ? 0 : 1) : ay >= az ? (ny > 0 ? 2 : 3) : (nz > 0 ? 4 : 5); groups[f].push(idx[i], idx[i + 1], idx[i + 2]);
    }
    const all = []; g.clearGroups(); let st = 0; groups.forEach((gr, i) => { all.push(...gr); g.addGroup(st, gr.length, i); st += gr.length; });
    g.setIndex(all);
    // planar UVs per face so prints are not stretched
    const p = g.attributes.position, uv = g.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      const nx = n.getX(i), ny = n.getY(i), nz = n.getZ(i), ax = Math.abs(nx), ay = Math.abs(ny), az = Math.abs(nz), X = p.getX(i), Y = p.getY(i), Z = p.getZ(i);
      if (ax >= ay && ax >= az) uv.setXY(i, (nx > 0 ? -Z : Z) / d + 0.5, Y / h + 0.5);
      else if (ay >= az) uv.setXY(i, X / w + 0.5, (ny > 0 ? -Z : Z) / d + 0.5);
      else uv.setXY(i, (nz > 0 ? X : -X) / w + 0.5, Y / h + 0.5);
    }
  }
  return new THREE.Mesh(g, mats);
}
// lathe helper for cups/bowls
const lathe = (pts, mat, seg = 96) => new THREE.Mesh(new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg), mat);
const camU = (cam = [0.85, 1.35]) => { let a = Math.atan2(cam[0], cam[1]); return ((a / (Math.PI * 2)) + 1) % 1; };
// wrap print for lathe objects: logo centred facing camera
// asp = (circumference / profile length) so the logo stays round on the curved surface
function wrapPrint(color, kind, size, v = 0.5, ink = INK, opts, asp = 1) {
  const u = camU(), one = (x, n, uu) => { x.save(); x.translate(uu * n, (1 - v) * n); x.scale(1 / asp, 1); drawLogo(x, 0, 0, size * n, ink, opts); x.restore(); };
  return paperMat(color, kind, { print: (x, n) => { one(x, n, u); one(x, n, u + 1); } });
}

// ---------- products ----------
const P = {};
// square frustum (wider at top), flat faces; cap UVs map the top as a square
function frustum(bw, tw, h, mats) {
  const g = new THREE.CylinderGeometry(tw / Math.SQRT2, bw / Math.SQRT2, h, 4, 1, false, Math.PI / 4).toNonIndexed(); g.computeVertexNormals();
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) { const y = p.getY(i); if (Math.abs(Math.abs(y) - h / 2) < 1e-4 && Math.abs(g.attributes.normal.getY(i)) > 0.99) uv.setXY(i, p.getX(i) / tw + 0.5, -p.getZ(i) / tw + 0.5); }
  return new THREE.Mesh(g, mats);
}
P['Burger Box'] = () => {
  const g = new THREE.Group();
  const top = paperMat(KRAFT, 'kraft', { print: printLogo(0.5, 0.5, 0.52, INK) }), plain = paperMat(KRAFT, 'kraft');
  const base = frustum(1.05, 1.3, 0.48, [plain, plain, plain]); base.position.y = 0.24;
  const lid = frustum(1.32, 1.22, 0.36, [plain, top, plain]); lid.position.y = 0.48 + 0.18 + 0.003;
  const lip = frustum(1.335, 1.335, 0.03, new THREE.MeshStandardMaterial({ color: '#9c7a52', roughness: 1 })); lip.position.y = 0.49;
  const tab = rbox(0.26, 0.15, 0.01, plain, 0.004); tab.position.set(0, 0.47, 0.672); tab.rotation.x = 0.12;
  const slot = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.012, 0.004), new THREE.MeshStandardMaterial({ color: '#5a4026' })); slot.position.set(0, 0.56, 0.645); slot.rotation.x = -0.05;
  g.add(base, lid, lip, tab, slot); shadowAll(g); g.rotation.y = 0.1; scene.add(g); contactShadow(1.25, 1.25);
  frame(g, { fill: 0.58, dir: [0.8, 0.85, 1.35] });
};
P['Kraft Bag with Twisted Handle'] = () => {
  const g = new THREE.Group(), w = 1.5, d = 0.75, h = 1.95, t = 0.012;
  const front = paperMat(KRAFT, 'kraft', { print: printLogo(0.5, 0.42, 0.42, INK) }), m = paperMat(KRAFT, 'kraft'), inner = paperMat('#A27A4E', 'kraft', { side: THREE.DoubleSide });
  const wall = (W, H, mat) => new THREE.Mesh(new THREE.BoxGeometry(W, H, t), mat);
  const f = wall(w, h, [m, m, m, m, front, inner]); f.position.set(0, h / 2, d / 2);
  const bk = wall(w, h, [m, m, m, m, inner, m]); bk.position.set(0, h / 2, -d / 2); bk.rotation.y = Math.PI; bk.material = [m, m, m, m, inner, m];
  // gusset sides folded slightly inward (two panels each)
  const side = (sx) => { const s = new THREE.Group(); [-1, 1].forEach((k) => { const p = new THREE.Mesh(new THREE.BoxGeometry(d / 2 + 0.01, h, t), [m, m, m, m, m, inner]); p.position.set(0, h / 2, k * d / 4); p.rotation.y = Math.PI / 2 + sx * k * 0.12; s.add(p); }); s.position.x = sx * w / 2 - sx * 0.015; return s; };
  const bottom = new THREE.Mesh(new THREE.BoxGeometry(w, t, d), m); bottom.position.y = t / 2;
  const cuff = new THREE.Mesh(new THREE.BoxGeometry(w - 0.03, 0.14, 0.006), inner); cuff.position.set(0, h - 0.08, d / 2 - 0.01);
  const cuff2 = cuff.clone(); cuff2.position.z = -d / 2 + 0.01;
  // fold creases on front (subtle horizontal bottom crease)
  const crease = new THREE.Mesh(new THREE.BoxGeometry(w, 0.006, 0.004), new THREE.MeshStandardMaterial({ color: '#7a5a38', roughness: 1, transparent: true, opacity: 0.35 })); crease.position.set(0, d / 2 * 0.95, d / 2 + t / 2 + 0.001);
  // twisted paper handles
  const twistCv = document.createElement('canvas'); twistCv.width = 64; twistCv.height = 256; const tx = twistCv.getContext('2d'); tx.fillStyle = '#C29C6E'; tx.fillRect(0, 0, 64, 256);
  for (let i = -8; i < 24; i++) { tx.strokeStyle = 'rgba(80,50,20,.75)'; tx.lineWidth = 4; tx.beginPath(); tx.moveTo(0, i * 16); tx.lineTo(64, i * 16 + 22); tx.stroke(); tx.strokeStyle = 'rgba(255,235,200,.25)'; tx.beginPath(); tx.moveTo(0, i * 16 + 6); tx.lineTo(64, i * 16 + 28); tx.stroke(); }
  const tt = tex(twistCv); tt.repeat.set(1, 26);
  const hm = new THREE.MeshStandardMaterial({ map: tt, roughness: 0.85 });
  const handle = (z) => { const c = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.38, h - 0.12, z), new THREE.Vector3(-0.36, h + 0.35, z), new THREE.Vector3(0, h + 0.6, z), new THREE.Vector3(0.36, h + 0.35, z), new THREE.Vector3(0.38, h - 0.12, z)]); return new THREE.Mesh(new THREE.TubeGeometry(c, 120, 0.022, 12), hm); };
  g.add(f, bk, side(1), side(-1), bottom, cuff, cuff2, crease, handle(d / 2 - 0.03), handle(-d / 2 + 0.03));
  shadowAll(g); g.rotation.y = -0.35; scene.add(g); contactShadow(w, d);
  frame(g, { fill: 0.66, dir: [0.5, 0.45, 1.4] });
};
function makeCup({ sleeve = false, color = WHITE, logo = 0.26, logoV = 0.45, lidColor = '#F3F2EF' } = {}) {
  const g = new THREE.Group(), H = 1.6, rb = 0.44, rt = 0.6;
  const body = [[0.001, 0.02], [rb - 0.02, 0.0], [rb, 0.03]]; for (let i = 0; i <= 20; i++) { const y = 0.03 + (H - 0.03) * i / 20; body.push([rb + (rt - rb) * (y / H), y]); }
  const cup = lathe([...body, [rt + 0.015, H + 0.01], [rt + 0.02, H + 0.03], [rt - 0.005, H + 0.04], [rt - 0.02, H]], sleeve ? paperMat(color, 'white') : wrapPrint(color, 'white', logo, logoV, INK, undefined, 1.55));
  g.add(cup);
  if (sleeve) {
    const s0 = 0.45, s1 = 1.1, sl = []; for (let i = 0; i <= 8; i++) { const y = s0 + (s1 - s0) * i / 8; sl.push([rb + (rt - rb) * (y / H) + 0.012, y]); }
    g.add(lathe([[sl[0][0] - 0.01, s0 - 0.001], ...sl, [sl[8][0] - 0.01, s1 + 0.001]], wrapPrint(KRAFT, 'kraft', 0.62, 0.5, INK, undefined, 5.2)));
  }
  const lm = new THREE.MeshStandardMaterial({ color: lidColor, roughness: 0.32 });
  g.add(lathe([[rt + 0.035, H - 0.03], [rt + 0.05, H + 0.02], [rt + 0.05, H + 0.07], [rt + 0.02, H + 0.09], [rt - 0.02, H + 0.09], [rt - 0.05, H + 0.1], [rt - 0.09, H + 0.17], [rt - 0.12, H + 0.18], [0.001, H + 0.18]], lm, 128));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(rt - 0.02, 0.01, 8, 128), new THREE.MeshStandardMaterial({ color: '#d8d6d1', roughness: 0.5 })); ring.rotation.x = Math.PI / 2; ring.position.y = H + 0.095; g.add(ring);
  const a = camU() * Math.PI * 2, sip = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.08, 6, 12), new THREE.MeshStandardMaterial({ color: '#2a2622', roughness: 0.6 }));
  sip.rotation.set(0, a + Math.PI / 2, Math.PI / 2); sip.scale.set(1, 1, 0.35); sip.position.set(Math.sin(a) * (rt - 0.1), H + 0.165, Math.cos(a) * (rt - 0.1)); g.add(sip);
  return g;
}
P['Paper Cup'] = () => { const g = makeCup(); shadowAll(g); scene.add(g); contactShadow(1.3, 1.3); frame(g, { fill: 0.6, dir: [0.85, 0.75, 1.35] }); };
P['Cup Sleeve'] = () => { const g = makeCup({ sleeve: true }); shadowAll(g); scene.add(g); contactShadow(1.3, 1.3); frame(g, { fill: 0.6, dir: [0.85, 0.75, 1.35] }); };

const { register } = await import('./products.js');
register(P, { THREE, rnd, paperCanvas, paperMat, tex, drawLogo, rbox, frustum, lathe, camU, wrapPrint, makeCup, contactShadow, frame, shadowAll, add: (o) => scene.add(o), cam: () => camera, KRAFT, WHITE, INK, N });
window.PRODUCTS = P;
window.renderProduct = (name) => { newScene(); P[name](); return finish(); };
window.ready = true;
