// The 56 PKG products. Simple real-world shapes, printed with a placeholder "YOUR LOGO".
export function register(P, H) {
  const { THREE, rnd, paperCanvas, paperMat, tex, drawLogo, rbox, frustum, lathe, camU, wrapPrint, makeCup, contactShadow, frame, shadowAll, add, KRAFT, WHITE, INK } = H;
  const GREEN = '#2E6B3A', GOLD = '#C8A96A', BLACK = '#1C1C1C', PINK = '#F1D3D3', CREAM = '#F3EBDD', GREY = '#8A8A86';
  const FLAT = [0.2, 1.55, 0.8], LOW = [0.85, 0.62, 1.35], HIGH = [0.75, 1.0, 1.3];
  const V = (x, y, z) => new THREE.Vector3(x, y, z);

  // ---------- materials ----------
  const baseCache = {};
  const base = (color, kind) => (baseCache[color + kind] ||= paperCanvas(color, kind));
  const BUMP = paperMat(WHITE, 'white').bumpMap;
  const plainCache = {};
  function mat(color, kind = 'white', { rough = null, metal = 0, side = THREE.FrontSide, bump = true } = {}) {
    const k = color + kind + rough + metal + side;
    return (plainCache[k] ||= new THREE.MeshStandardMaterial({ map: tex(base(color, kind)), bumpMap: bump ? BUMP : null, bumpScale: kind === 'kraft' ? 0.5 : 0.25, roughness: rough ?? (kind === 'kraft' ? 0.92 : kind === 'card' ? 0.7 : 0.82), metalness: metal, side }));
  }
  // printed face: canvas has the face's aspect ratio, draw(x, cw, ch) in pixels
  function printed(color, kind, w, h, draw, { rough = null, metal = 0, side = THREE.FrontSide } = {}) {
    const k = 1024 / Math.max(w, h), cw = Math.max(32, Math.round(w * k)), ch = Math.max(32, Math.round(h * k));
    const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch; const x = cv.getContext('2d');
    x.drawImage(base(color, kind), 0, 0, cw, ch); if (draw) { x.save(); draw(x, cw, ch); x.restore(); }
    const t = tex(cv); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    return new THREE.MeshStandardMaterial({ map: t, bumpMap: BUMP, bumpScale: kind === 'kraft' ? 0.5 : 0.25, roughness: rough ?? (kind === 'kraft' ? 0.92 : kind === 'card' ? 0.7 : 0.82), metalness: metal, side });
  }
  // 6 materials for rbox: +x, -x, +y(top), -y, +z(front), -z
  function boxMats(w, h, d, color, kind, p = {}, o = {}) {
    const m = mat(color, kind, o), f = (fn, a, b) => (fn ? printed(color, kind, a, b, fn, o) : m);
    return [f(p.right, d, h), f(p.left, d, h), f(p.top, w, d), f(p.bottom, w, d), f(p.front, w, h), f(p.back, w, h)];
  }
  const pbox = (w, h, d, color, kind, p, o, r = 0.02) => rbox(w, h, d, boxMats(w, h, d, color, kind, p, o), r);
  const solid = (color, rough = 0.6, metal = 0) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });

  // ---------- print helpers (pixels) ----------
  const L = (size, ink = INK, opts) => (x, cw, ch) => drawLogo(x, cw / 2, ch / 2, Math.min(cw, ch) * size, ink, opts);
  const Lat = (u, v, size, ink = INK, opts) => (x, cw, ch) => drawLogo(x, cw * u, ch * v, Math.min(cw, ch) * size, ink, opts);
  const all = (...fns) => (x, cw, ch) => fns.forEach((f) => { x.save(); f(x, cw, ch); x.restore(); });
  const lines = (u, v, w, n, gap, lh, col = 'rgba(40,40,40,.28)') => (x, cw, ch) => { x.fillStyle = col; for (let i = 0; i < n; i++) x.fillRect(cw * u, ch * v + i * ch * gap, cw * w * (i % 4 === 3 ? 0.55 : 1), ch * lh); };
  const block = (u, v, w, h, col) => (x, cw, ch) => { x.fillStyle = col; x.fillRect(cw * u, ch * v, cw * w, ch * h); };
  const text = (u, v, s, str, col = INK, font = 'Georgia, DejaVu Serif, serif', weight = 700, align = 'center') => (x, cw, ch) => { x.fillStyle = col; x.textAlign = align; x.textBaseline = 'middle'; x.font = `${weight} ${Math.min(cw, ch) * s}px ${font}`; x.fillText(str, cw * u, ch * v); };
  const pattern = (step, size, ink = INK, alpha = 0.8) => (x, cw, ch) => { x.globalAlpha = alpha; const st = Math.min(cw, ch) * step; let r = 0; for (let y = st / 2; y < ch + st; y += st, r++) for (let xx = (r % 2) * st / 2; xx < cw + st; xx += st) drawLogo(x, xx, y, st * size, ink); };
  const border = (inset, col, wdt = 0.006) => (x, cw, ch) => { const i = Math.min(cw, ch) * inset; x.strokeStyle = col; x.lineWidth = Math.min(cw, ch) * wdt; x.strokeRect(i, i, cw - 2 * i, ch - 2 * i); x.lineWidth /= 3; x.strokeRect(i * 1.4, i * 1.4, cw - 2.8 * i, ch - 2.8 * i); };
  const barcode = (u, v, w, h) => (x, cw, ch) => { let px = cw * u; const end = cw * (u + w); x.fillStyle = '#111'; while (px < end) { const b = 1 + Math.floor(rnd() * 3) * 1.5; x.fillRect(px, ch * v, b, ch * h); px += b + 1.5 + rnd() * 3; } };
  const photo = (u, v, w, h, c1, c2) => (x, cw, ch) => { const g = x.createLinearGradient(cw * u, ch * v, cw * (u + w), ch * (v + h)); g.addColorStop(0, c1); g.addColorStop(1, c2); x.fillStyle = g; x.fillRect(cw * u, ch * v, cw * w, ch * h); x.fillStyle = 'rgba(255,255,255,.18)'; x.beginPath(); x.arc(cw * (u + w * 0.7), ch * (v + h * 0.35), Math.min(cw * w, ch * h) * 0.18, 0, 7); x.fill(); };

  // ---------- shape helpers ----------
  function show(g, { dir = LOW, fill = 0.6, shadow = 0.62, lookY = null } = {}) {
    shadowAll(g); add(g);
    g.updateMatrixWorld(true);
    if (shadow) g.children.forEach((ch) => { const b = new THREE.Box3().setFromObject(ch); if (b.isEmpty() || b.min.y > 0.08) return; const s = b.getSize(V()), c = b.getCenter(V()); const thin = s.y < 0.15; contactShadow(s.x * (thin ? 0.8 : 1), s.z * (thin ? 0.8 : 1), c.x, c.z, thin ? Math.min(shadow, 0.3) : shadow); });
    frame(g, { dir, fill, lookY });
  }
  const at = (o, x, y, z, ry = 0, rx = 0, rz = 0) => { o.position.set(x, y, z); o.rotation.set(rx, ry, rz); return o; };
  // flat sheet lying on the floor, printed on top
  const sheet = (w, d, color, kind, draw, t = 0.006, o) => pbox(w, t, d, color, kind, { top: draw }, o, 0.002);
  function openTray(bw, bd, tw, td, h, m, inner = m) {
    const g = new THREE.Group();
    const c = new THREE.Mesh(new THREE.CylinderGeometry(Math.SQRT1_2, Math.SQRT1_2, h, 4, 1, true, Math.PI / 4), [m]);
    // taper: scale top ring vs bottom ring
    const p = c.geometry.attributes.position; for (let i = 0; i < p.count; i++) { const top = p.getY(i) > 0; p.setX(i, p.getX(i) * (top ? tw : bw)); p.setZ(i, p.getZ(i) * (top ? td : bd)); }
    c.geometry.computeVertexNormals(); c.material = m.clone(); c.material.side = THREE.DoubleSide; c.position.y = h / 2;
    const b = new THREE.Mesh(new THREE.PlaneGeometry(bw, bd), inner); b.rotation.x = -Math.PI / 2; b.position.y = 0.004;
    g.add(c, b); return g;
  }
  function shapeMesh(shape, depth, front, sideM) {
    const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 24 });
    g.computeBoundingBox(); const bb = g.boundingBox, w = bb.max.x - bb.min.x, h = bb.max.y - bb.min.y, uv = g.attributes.uv, p = g.attributes.position;
    const gr = g.groups[0]; for (let i = gr.start; i < gr.start + gr.count; i++) uv.setXY(i, (p.getX(i) - bb.min.x) / w, (p.getY(i) - bb.min.y) / h);
    return new THREE.Mesh(g, [front, sideM]);
  }
  function tagShape(w, h, cut, holeR) {
    const s = new THREE.Shape(); s.moveTo(-w / 2, -h / 2); s.lineTo(w / 2, -h / 2); s.lineTo(w / 2, h / 2 - cut); s.lineTo(w / 2 - cut, h / 2); s.lineTo(-w / 2 + cut, h / 2); s.lineTo(-w / 2, h / 2 - cut); s.closePath();
    const hole = new THREE.Path(); hole.absarc(0, h / 2 - cut * 1.2, holeR, 0, Math.PI * 2, true); s.holes.push(hole); return s;
  }
  function tag(w, h, color, kind, draw, o) { const m = shapeMesh(tagShape(w, h, w * 0.22, w * 0.06), 0.012, printed(color, kind, w, h, draw, o), mat(color, kind)); return m; }
  const string = (pts, r = 0.008, color = '#D9CBB0') => new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => V(...p))), 64, r, 8), solid(color, 0.9));
  function twistTex(c1, c2, rep = 26) {
    const cv = document.createElement('canvas'); cv.width = 64; cv.height = 256; const x = cv.getContext('2d'); x.fillStyle = c1; x.fillRect(0, 0, 64, 256);
    for (let i = -8; i < 24; i++) { x.strokeStyle = c2; x.lineWidth = 4; x.beginPath(); x.moveTo(0, i * 16); x.lineTo(64, i * 16 + 22); x.stroke(); x.strokeStyle = 'rgba(255,240,215,.25)'; x.beginPath(); x.moveTo(0, i * 16 + 6); x.lineTo(64, i * 16 + 28); x.stroke(); }
    const t = tex(cv); t.repeat.set(1, rep); return t;
  }
  function crumple(w, h, color, seg = 10, amp = 0.05) {
    const g = new THREE.PlaneGeometry(w, h, seg, seg), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) p.setZ(i, (rnd() - 0.5) * amp * 2);
    g.computeVertexNormals(); return new THREE.Mesh(g, mat(color, 'white', { side: THREE.DoubleSide, rough: 0.9 }));
  }

  // ---------- bags ----------
  function bag({ w = 1.5, d = 0.75, h = 1.95, color = KRAFT, kind = 'kraft', inner = '#A27A4E', handle = 'twist', hcol = '#C29C6E', hcol2 = 'rgba(80,50,20,.75)', front = L(0.42), side = null, rough = null, hw = 0.38, hh = 0.6 } = {}) {
    const g = new THREE.Group(), t = 0.012, o = { rough }, m = mat(color, kind, o), im = mat(inner, kind, { side: THREE.DoubleSide });
    const fm = front ? printed(color, kind, w, h, front, o) : m;
    const wf = new THREE.Mesh(new THREE.BoxGeometry(w, h, t), [m, m, m, m, fm, im]); wf.position.set(0, h / 2, d / 2);
    const wb = new THREE.Mesh(new THREE.BoxGeometry(w, h, t), [m, m, m, m, im, m]); wb.position.set(0, h / 2, -d / 2);
    const sm = side ? printed(color, kind, d / 2, h, side, o) : m;
    const sideG = (sx) => { const s = new THREE.Group(); [-1, 1].forEach((k) => { const p = new THREE.Mesh(new THREE.BoxGeometry(d / 2 + 0.01, h, t), [m, m, m, m, sm, im]); p.position.set(0, h / 2, k * d / 4); p.rotation.y = sx * Math.PI / 2 + sx * k * 0.12; s.add(p); }); s.position.x = sx * (w / 2 - 0.015); return s; };
    const bottom = new THREE.Mesh(new THREE.BoxGeometry(w, t, d), m); bottom.position.y = t / 2;
    const crease = new THREE.Mesh(new THREE.BoxGeometry(w, 0.006, 0.004), new THREE.MeshStandardMaterial({ color: '#000', roughness: 1, transparent: true, opacity: 0.12 })); crease.position.set(0, d / 2 * 0.95, d / 2 + t / 2 + 0.001);
    g.add(wf, wb, sideG(1), sideG(-1), bottom, crease);
    const curve = (z, sq) => new THREE.CatmullRomCurve3(sq
      ? [V(-hw, h - 0.15, 0), V(-hw + 0.03, h + hh * 0.75, 0), V(-hw * 0.6, h + hh, 0), V(hw * 0.6, h + hh, 0), V(hw - 0.03, h + hh * 0.75, 0), V(hw, h - 0.15, 0)]
      : [V(-hw, h - 0.12, 0), V(-hw + 0.02, h + hh * 0.58, 0), V(0, h + hh, 0), V(hw - 0.02, h + hh * 0.58, 0), V(hw, h - 0.12, 0)]);
    const hz = [d / 2 - 0.03, -d / 2 + 0.03];
    hz.forEach((z) => {
      let mesh;
      if (handle === 'twist' || handle === 'rope') {
        const hm = new THREE.MeshStandardMaterial({ map: twistTex(hcol, hcol2, handle === 'rope' ? 20 : 26), roughness: 0.85 });
        mesh = new THREE.Mesh(new THREE.TubeGeometry(curve(z), 120, handle === 'rope' ? 0.032 : 0.022, 12), hm);
      } else if (handle === 'flat' || handle === 'ribbon') {
        const geo = new THREE.TubeGeometry(curve(z, true), 120, handle === 'ribbon' ? 0.02 : 0.05, 12); geo.scale(1, 1, handle === 'ribbon' ? 0.2 : 0.15);
        mesh = new THREE.Mesh(geo, handle === 'ribbon' ? solid(hcol, 0.35) : mat(hcol, 'kraft'));
        if (handle === 'flat') { const patch = new THREE.Mesh(new THREE.BoxGeometry(w * 0.86, 0.16, 0.004), mat(hcol, 'kraft')); patch.position.set(0, h - 0.1, z > 0 ? -0.012 : 0.012); patch.position.z += z; g.add(patch); }
      } else return;
      mesh.position.z = z; g.add(mesh);
    });
    return g;
  }
  function tissueTuft(g, y, colors = [WHITE, '#EFEDE8'], spread = 0.5) {
    colors.forEach((c, i) => { const t = crumple(0.9, 0.7, c, 8, 0.06); t.position.set((i - 0.5) * spread * 0.6, y + 0.18, (i - 0.5) * 0.08); t.rotation.set(0.05, (i - 0.5) * 0.6, (i - 0.5) * 0.35); g.add(t); });
  }

  // ---------- generic boxes ----------
  function lidBox(w, h, d, lidH, color, kind, top, o = {}, lidColor = color, front = null) {
    const g = new THREE.Group();
    const b = pbox(w, h - lidH * 0.6, d, color, kind, {}, o, 0.01); b.position.y = (h - lidH * 0.6) / 2;
    const l = pbox(w * 1.02, lidH, d * 1.02, lidColor, kind, { top, front }, o, 0.012); l.position.y = h - lidH / 2 + 0.002;
    g.add(b, l); return g;
  }
  const choc = (c) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 16), solid(c, 0.38)); m.scale.y = 0.6; return m; };
  function cookie() {
    const cv = document.createElement('canvas'); cv.width = cv.height = 256; const x = cv.getContext('2d'); x.fillStyle = '#C8955A'; x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 14; i++) { x.fillStyle = '#3B2414'; x.beginPath(); x.ellipse(rnd() * 256, rnd() * 256, 8 + rnd() * 8, 6 + rnd() * 6, rnd() * 3, 0, 7); x.fill(); }
    for (let i = 0; i < 300; i++) { x.fillStyle = `rgba(${rnd() < 0.5 ? '255,220,170' : '120,70,30'},.25)`; x.fillRect(rnd() * 256, rnd() * 256, 3, 3); }
    const t = tex(cv); return new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 40), [new THREE.MeshStandardMaterial({ color: '#B98048', roughness: 0.9 }), new THREE.MeshStandardMaterial({ map: t, roughness: 0.85 }), new THREE.MeshStandardMaterial({ color: '#A8733F', roughness: 0.9 })]);
  }
  function cupcake(frost = '#F4C9CF', liner = WHITE) {
    const g = new THREE.Group(), pts = [];
    for (let i = 0; i <= 24; i++) { const y = 0.3 * i / 24; pts.push([0.15 + 0.06 * (y / 0.3) + (i % 2 ? 0.006 : 0), y]); }
    g.add(lathe([[0.001, 0], ...pts], mat(liner, 'white', { side: THREE.DoubleSide }), 48));
    const cake = new THREE.Mesh(new THREE.SphereGeometry(0.21, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), solid('#C8955A', 0.9)); cake.position.y = 0.28; cake.scale.y = 0.4; g.add(cake);
    [0.18, 0.14, 0.09, 0.04].forEach((r, i) => { const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.055 - i * 0.008, 16, 40), solid(frost, 0.55)); t.rotation.x = Math.PI / 2; t.position.y = 0.36 + i * 0.07; g.add(t); });
    return g;
  }
  function booklet(w, d, t, coverColor, coverDraw, { hard = false, pages = WHITE, kind = 'card', rough = null } = {}) {
    const g = new THREE.Group(), c = hard ? 0.02 : 0.006, ow = hard ? 0.03 : 0;
    const block = new THREE.Mesh(new THREE.BoxGeometry(w - ow, t - 2 * c, d - ow * 2), mat(pages, 'white')); block.position.set(-ow / 2 + ow / 2, t / 2, 0);
    // page edge lines
    const pe = printed(pages, 'white', d, t, (x, cw, ch) => { for (let y = 0; y < ch; y += 3) { x.fillStyle = `rgba(0,0,0,${0.05 + rnd() * 0.06})`; x.fillRect(0, y, cw, 1); } });
    block.material = [pe, pe, mat(pages, 'white'), mat(pages, 'white'), printed(pages, 'white', w, t, (x, cw, ch) => { for (let y = 0; y < ch; y += 3) { x.fillStyle = `rgba(0,0,0,${0.05 + rnd() * 0.06})`; x.fillRect(0, y, cw, 1); } }), mat(pages, 'white')];
    const top = pbox(w, c, d, coverColor, kind, { top: coverDraw }, { rough }, 0.004); top.position.y = t - c / 2;
    const bot = pbox(w, c, d, coverColor, kind, {}, { rough }, 0.004); bot.position.y = c / 2;
    const spine = pbox(c, t, d, coverColor, kind, {}, { rough }, 0.004); spine.position.set(-w / 2 + c / 2, t / 2, 0);
    g.add(block, top, bot, spine); return g;
  }
  function envelope(w, d, color, frontDraw, back = false, kind = 'white') {
    const draw = back ? all((x, cw, ch) => { x.strokeStyle = 'rgba(0,0,0,.12)'; x.lineWidth = 3; x.beginPath(); x.moveTo(0, 0); x.lineTo(cw / 2, ch * 0.55); x.lineTo(cw, 0); x.stroke(); x.beginPath(); x.moveTo(0, ch); x.lineTo(cw * 0.42, ch * 0.5); x.moveTo(cw, ch); x.lineTo(cw * 0.58, ch * 0.5); x.stroke(); }, frontDraw || (() => {})) : frontDraw;
    return sheet(w, d, color, kind, draw, 0.012);
  }
  const seal = (color = '#7A1F2B', r = 0.11) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.05, 0.03, 28), [solid(color, 0.35), printed(color, 'card', 1, 1, (x, cw, ch) => { x.strokeStyle = 'rgba(0,0,0,.3)'; x.lineWidth = cw * 0.04; x.beginPath(); x.arc(cw / 2, ch / 2, cw * 0.32, 0, 7); x.stroke(); x.fillStyle = 'rgba(0,0,0,.3)'; x.font = `700 ${cw * 0.3}px Georgia, serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('L', cw / 2, ch / 2); }, { rough: 0.35 }), solid(color, 0.35)]); return m; };
  const doc = (ink = INK) => all(Lat(0.18, 0.1, 0.13, ink), lines(0.1, 0.25, 0.8, 14, 0.035, 0.009), block(0.1, 0.93, 0.8, 0.003, ink));

  // ========== FOOD & TAKEAWAY ==========
  P['Pizza Box'] = () => {
    const g = new THREE.Group(); const sides = (x, cw, ch) => { x.fillStyle = 'rgba(80,55,30,.25)'; x.fillRect(0, ch * 0.48, cw, 2); };
    const a = pbox(2.0, 0.2, 2.0, KRAFT, 'kraft', { top: L(0.42), front: sides, right: sides }); a.position.y = 0.1;
    const b = pbox(2.0, 0.2, 2.0, KRAFT, 'kraft', { front: sides, right: sides }); b.position.y = 0.302; b.rotation.y = 0.18;
    const c = pbox(2.0, 0.2, 2.0, KRAFT, 'kraft', { top: L(0.42), front: sides, right: sides }); c.position.y = 0.504; c.rotation.y = 0.05;
    g.add(a, b, c); show(g, { dir: HIGH, fill: 0.62 });
  };
  P['Meal Box'] = () => {
    const g = new THREE.Group(), sx = 1.45;
    const top = paperMat(KRAFT, 'kraft', { print: (x, n) => { x.save(); x.translate(n / 2, n / 2); x.scale(1 / sx, 1); drawLogo(x, 0, 0, n * 0.48, INK); x.restore(); } }), p = paperMat(KRAFT, 'kraft');
    const base = frustum(0.95, 1.1, 0.42, [p, p, p]); base.scale.x = sx; base.position.y = 0.21;
    const lid = frustum(1.12, 1.02, 0.28, [p, top, p]); lid.scale.x = sx; lid.position.y = 0.42 + 0.14 + 0.003;
    const lip = frustum(1.135, 1.135, 0.025, solid('#9c7a52', 1)); lip.scale.x = sx; lip.position.y = 0.43;
    g.add(base, lid, lip); show(g, { dir: [0.8, 0.85, 1.35], fill: 0.6 });
  };
  P['Sandwich & Wrap Box'] = () => {
    const g = new THREE.Group(), s = new THREE.Shape(); s.moveTo(-0.65, 0); s.lineTo(0.65, 0); s.lineTo(-0.65, 1.05); s.closePath();
    const face = printed(WHITE, 'white', 1.3, 1.05, Lat(0.3, 0.72, 0.36, INK));
    const k = printed(KRAFT, 'kraft', 1.3, 1.05, Lat(0.3, 0.72, 0.36, INK));
    [[face, WHITE, 'white', 0.25, 0, 0], [k, KRAFT, 'kraft', -0.35, -1.0, -0.55]].forEach(([f, c, kd, ry, x, z]) => { const m = shapeMesh(s, 0.6, f, mat(c, kd)); m.position.set(x, 0, z); m.rotation.y = ry; g.add(m); });
    show(g, { dir: [0.55, 0.55, 1.4], fill: 0.62 });
  };
P['Shawarma & Sandwich Wrap Paper'] = () => {
    const g = new THREE.Group(), pat = pattern(0.2, 0.55, '#2E6B3A', 0.75);
    const sh = sheet(2.0, 1.6, '#F2EEE6', 'white', pat); sh.rotation.y = 0.25; sh.position.y = 0.003;
    const wrapM = printed('#F2EEE6', 'white', 2.4, 1.2, pattern(0.25, 0.55, '#2E6B3A', 0.75));
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.3, 40, 1, true), wrapM); roll.rotation.z = Math.PI / 2; roll.rotation.y = -0.3; roll.position.set(0, 0.21, 0.25);
    const end = new THREE.Mesh(new THREE.CircleGeometry(0.2, 40), solid('#C99A5B', 0.95)); end.position.set(0.62, 0.21 + 0, 0.25 + 0.19); end.rotation.y = Math.PI / 2 - 0.3; end.position.set(Math.cos(-0.3) * 0.65, 0.21, 0.25 - Math.sin(-0.3) * 0.65); end.rotation.set(0, Math.PI / 2 - 0.3, 0);
    const fill = new THREE.Mesh(new THREE.CircleGeometry(0.16, 30), solid('#8A5A33', 0.95)); fill.position.copy(end.position).add(V(0.003, 0, 0.001)); fill.rotation.copy(end.rotation);
    const twist = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.25, 30, 1, true), mat('#F2EEE6', 'white', { side: THREE.DoubleSide })); twist.rotation.z = Math.PI / 2; twist.rotation.y = -0.3; twist.position.set(-Math.cos(-0.3) * 0.77, 0.21, 0.25 + Math.sin(-0.3) * 0.77);
    g.add(sh, roll, end, fill, twist); show(g, { dir: [0.55, 0.9, 1.3], fill: 0.62 });
  };
  P['Greaseproof Paper Sheets'] = () => {
    const g = new THREE.Group();
    for (let i = 0; i < 6; i++) { const s = sheet(1.5, 1.5, '#F1ECE1', 'white', i === 5 ? pattern(0.22, 0.5, '#2E6B3A', 0.7) : null, 0.006); s.position.y = 0.004 + i * 0.008; s.rotation.y = (rnd() - 0.5) * 0.35; g.add(s); }
    const f = crumple(1.2, 0.9, '#F1ECE1', 10, 0.04); f.material = printed('#F1ECE1', 'white', 1.2, 0.9, pattern(0.25, 0.5, '#2E6B3A', 0.7), { side: THREE.DoubleSide }); f.rotation.x = -1.2; f.position.set(0.9, 0.35, -0.5); f.rotation.z = 0.3; g.add(f);
    show(g, { dir: [0.55, 1.0, 1.3], fill: 0.62 });
  };
  P['Fries Holder'] = () => {
    const g = new THREE.Group(), red = '#B6302C';
    const fm = printed(WHITE, 'white', 2, 1, all(block(0, 0, 1, 0.22, red), Lat(0.15, 0.6, 0.38, INK), Lat(0.65, 0.6, 0.38, INK)));
    const h = frustum(0.5, 0.8, 0.95, [fm, mat(WHITE, 'white'), mat(WHITE, 'white')]); h.material[0].side = THREE.DoubleSide; h.scale.z = 0.55; h.position.y = 0.475; h.rotation.y = 0;
    const cap = h.geometry.groups; // remove top cap: hide with no material
    h.material[1] = new THREE.MeshBasicMaterial({ visible: false });
    g.add(h);
    for (let i = 0; i < 26; i++) { const f = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.6 + rnd() * 0.3, 0.06), solid(['#E9B54E', '#E2A940', '#F0C062'][i % 3], 0.65)); f.position.set((rnd() - 0.5) * 0.42, 0.85 + rnd() * 0.15, (rnd() - 0.5) * 0.16); f.rotation.set((rnd() - 0.5) * 0.25, rnd(), (rnd() - 0.5) * 0.3); g.add(f); }
    show(g, { dir: [0.7, 0.7, 1.35], fill: 0.55 });
  };
  P['Food Tray'] = () => {
    const g = new THREE.Group(), m = mat(KRAFT, 'kraft'), inner = printed(KRAFT, 'kraft', 1.6, 1.0, L(0.5));
    const t = openTray(1.45, 0.9, 1.65, 1.05, 0.28, m, inner); g.add(t);
    const t2 = openTray(1.45, 0.9, 1.65, 1.05, 0.28, mat(WHITE, 'white'), printed(WHITE, 'white', 1.6, 1.0, L(0.5))); t2.position.set(-0.4, 0, -1.25); t2.rotation.y = 0.3; g.add(t2);
    show(g, { dir: [0.6, 1.05, 1.3], fill: 0.62 });
  };
  P['Paper Bowl'] = () => {
    const g = new THREE.Group(), pts = [[0.001, 0], [0.42, 0], [0.44, 0.02]]; for (let i = 1; i <= 16; i++) { const y = 0.02 + 0.62 * i / 16; pts.push([0.44 + 0.22 * Math.pow(y / 0.64, 1.1), y]); }
    pts.push([0.675, 0.655], [0.68, 0.67], [0.66, 0.665]);
    const out = lathe(pts, wrapPrint(KRAFT, 'kraft', 0.5, 0.42, INK, undefined, 3.3)); g.add(out);
    const inn = lathe(pts.map(([r, y]) => [r - 0.008, y + 0.004]).reverse(), mat('#EFE9DF', 'white', { side: THREE.DoubleSide })); g.add(inn);
    const b2 = out.clone(); b2.position.set(-1.2, 0, -0.6); g.add(b2); const i2 = inn.clone(); i2.position.copy(b2.position); g.add(i2);
    show(g, { dir: [0.8, 0.95, 1.35], fill: 0.62 });
  };
  P['Delivery Paper Bag'] = () => { const g = bag({ w: 1.7, d: 1.0, h: 1.75, handle: 'flat', hcol: KRAFT, hw: 0.45, hh: 0.45, front: L(0.45) }); g.rotation.y = -0.3; show(g, { dir: [0.5, 0.45, 1.4], fill: 0.66 }); };

  // ========== BAKERY ==========
  P['Cake Box'] = () => {
    const g = lidBox(1.5, 1.2, 1.5, 0.3, WHITE, 'white', L(0.55, INK), {}, WHITE, null);
    g.rotation.y = 0.15; show(g, { dir: [0.8, 0.8, 1.35], fill: 0.58 });
  };
  P['Pastry Box'] = () => {
    const g = lidBox(1.8, 0.5, 1.2, 0.2, WHITE, 'white', Lat(0.38, 0.4, 0.5, INK));
    const tw = (pts) => g.add(string(pts, 0.009, '#C9A27A'));
    tw([[-0.92, 0.0, 0.38], [-0.92, 0.51, 0.38], [0.92, 0.51, 0.38], [0.92, 0, 0.38]]); tw([[0.62, 0, -0.62], [0.62, 0.51, -0.62], [0.62, 0.51, 0.62], [0.62, 0, 0.62]]);
    const bowA = string([[0.62, 0.52, 0.38], [0.74, 0.6, 0.48], [0.82, 0.53, 0.4], [0.62, 0.52, 0.38]], 0.009, '#C9A27A'); const bowB = string([[0.62, 0.52, 0.38], [0.5, 0.6, 0.5], [0.42, 0.53, 0.4], [0.62, 0.52, 0.38]], 0.009, '#C9A27A'); g.add(bowA, bowB);
    g.rotation.y = 0.2; show(g, { dir: [0.8, 0.9, 1.35], fill: 0.6 });
  };
  P['Cupcake Box'] = () => {
    const g = new THREE.Group(), w = 1.2, d = 1.2, h = 0.5;
    const t = openTray(w, d, w, d, h, printed(WHITE, 'white', 4, 1, Lat(0.125, 0.5, 0.6, INK)), mat(WHITE, 'white')); g.add(t);
    [[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].forEach(([x, z], i) => { const c = cupcake(['#F4C9CF', '#F6EBDD', '#D9EAD3', '#F4C9CF'][i]); c.position.set(x, 0.01, z); g.add(c); });
    const lid = pbox(w * 1.02, 0.2, d * 1.02, WHITE, 'white', { top: L(0.5) }); lid.position.set(1.1, 0.6, -0.2); lid.rotation.set(0, -0.2, 1.25); g.add(lid);
    show(g, { dir: [0.7, 1.0, 1.35], fill: 0.6 });
  };
  P['Chocolate & Sweets Box'] = () => {
    const g = new THREE.Group(), w = 1.4, d = 1.4, gold = printed(BLACK, 'card', 1, 1, L(0.55, GOLD), { rough: 0.45 });
    const t = openTray(w, d, w, d, 0.22, mat(BLACK, 'card', { rough: 0.45 }), mat('#2A211C', 'card')); g.add(t);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const c = choc(['#3B2418', '#5A3522', '#2A1A12', '#7A4A2A'][(i + j) % 4]); c.position.set(-0.48 + i * 0.32, 0.08, -0.48 + j * 0.32); g.add(c); const cupM = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.12, 0.06, 24, 1, true), solid('#1a1410', 0.5)); cupM.material.side = THREE.DoubleSide; cupM.position.set(c.position.x, 0.03, c.position.z); g.add(cupM); }
    const lid = rbox(w * 1.03, 0.16, d * 1.03, [mat(BLACK, 'card', { rough: 0.45 }), mat(BLACK, 'card', { rough: 0.45 }), gold, mat(BLACK, 'card'), mat(BLACK, 'card', { rough: 0.45 }), mat(BLACK, 'card')], 0.01);
    lid.position.set(-0.2, 0.75, -1.0); lid.rotation.set(1.15, 0.1, 0); g.add(lid);
    show(g, { dir: [0.6, 1.1, 1.3], fill: 0.62 });
  };
  P['Bûche de Noël Box'] = () => {
    const g = new THREE.Group();
    const fr = pbox(2.2, 0.62, 0.85, WHITE, 'white', { front: Lat(0.5, 0.5, 0.75, INK) }, {}, 0.01); fr.position.y = 0.31;
    const lid = pbox(2.24, 0.2, 0.87, WHITE, 'white', { top: all(Lat(0.22, 0.5, 0.7, INK), text(0.6, 0.5, 0.15, 'Joyeux Noël', '#8E2B2B', 'Georgia, serif', 400)) }, {}, 0.012); lid.position.y = 0.7;
    g.add(fr, lid);
    const r = solid('#8E2B2B', 0.4), s = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.03, 0.89), r); s.position.set(0.95, 0.805, 0); g.add(s); const s2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.82, 0.03), r); s2.position.set(0.95, 0.4, 0.44); g.add(s2);
    g.rotation.y = -0.15; show(g, { dir: [0.75, 0.75, 1.35], fill: 0.62 });
  };
  P['Cookie Box'] = () => {
    const g = new THREE.Group(), w = 1.3;
    g.add(openTray(w, w, w, w, 0.35, mat(KRAFT, 'kraft'), mat('#E9E2D6', 'white')));
    for (let i = 0; i < 7; i++) { const c = cookie(); const a = i * 0.9; c.position.set(Math.cos(a) * (i ? 0.35 : 0), 0.2 + (i % 2) * 0.03, Math.sin(a) * (i ? 0.35 : 0)); c.rotation.set((rnd() - 0.5) * 0.5, rnd() * 3, (rnd() - 0.5) * 0.5); g.add(c); }
    const lid = pbox(w * 1.03, 0.15, w * 1.03, KRAFT, 'kraft', { top: L(0.55) }); lid.position.set(-0.35, 0.08, 1.15); lid.rotation.y = 0.25; g.add(lid);
    const ck = cookie(); ck.position.set(0.9, 0.03, 0.8); g.add(ck);
    show(g, { dir: [0.55, 1.1, 1.3], fill: 0.62 });
  };
  P['Bakery Paper Bag'] = () => {
    const g = new THREE.Group();
    const a = bag({ w: 0.95, d: 0.55, h: 1.5, color: WHITE, kind: 'white', inner: '#E4DED3', handle: 'none', front: all(Lat(0.5, 0.5, 0.6, INK), block(0.1, 0.8, 0.8, 0.012, GREEN)) });
    const b = bag({ w: 0.95, d: 0.55, h: 1.3, color: KRAFT, kind: 'kraft', handle: 'none', front: Lat(0.5, 0.5, 0.6, INK) }); b.position.set(-1.0, 0, -0.5); b.rotation.y = 0.35;
    g.add(a, b); g.rotation.y = -0.2; show(g, { dir: [0.6, 0.55, 1.4], fill: 0.64 });
  };
P['Cake Board'] = () => {
    const g = new THREE.Group(), goldM = new THREE.MeshStandardMaterial({ color: '#E6CC86', roughness: 0.38, metalness: 0.7 }), silver = new THREE.MeshStandardMaterial({ color: '#DADADA', roughness: 0.45, metalness: 0.7 });
    for (let i = 0; i < 3; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.05, 96), [goldM, printed('#E6CC86', 'card', 1, 1, i === 2 ? (x, cw, ch) => { x.globalAlpha = 0.35; drawLogo(x, cw / 2, ch / 2, cw * 0.4, '#6b5320'); } : null, { rough: 0.38, metal: 0.7 }), goldM]); c.position.set(0.3 + i * 0.05, 0.075 + i * 0.052, 0.3 - i * 0.03); g.add(c); }
    const sq = rbox(1.6, 0.05, 1.6, silver, 0.01); sq.position.set(-0.7, 0.025, -0.8); sq.rotation.set(0, 0.35, 0); g.add(sq);
    show(g, { dir: [0.6, 1.0, 1.3], fill: 0.62 });
  };

  // ========== COFFEE ==========
  P['Cup Carrier'] = () => {
    const g = new THREE.Group(), pulp = '#BDB2A0';
    const pm = printed(pulp, 'kraft', 1.5, 1.5, (x, cw, ch) => { [[0.27, 0.27], [0.73, 0.27], [0.27, 0.73], [0.73, 0.73]].forEach(([u, v]) => { const gr = x.createRadialGradient(cw * u, ch * v, 0, cw * u, ch * v, cw * 0.2); gr.addColorStop(0, 'rgba(60,50,40,.55)'); gr.addColorStop(0.75, 'rgba(60,50,40,.35)'); gr.addColorStop(1, 'rgba(255,255,255,.15)'); x.fillStyle = gr; x.beginPath(); x.arc(cw * u, ch * v, cw * 0.2, 0, 7); x.fill(); }); });
    const base = rbox(1.5, 0.22, 1.5, [mat(pulp, 'kraft'), mat(pulp, 'kraft'), pm, mat(pulp, 'kraft'), mat(pulp, 'kraft'), mat(pulp, 'kraft')], 0.08); base.position.y = 0.11; g.add(base);
    const ridge = rbox(0.12, 0.35, 1.3, mat(pulp, 'kraft'), 0.05); ridge.position.y = 0.3; g.add(ridge);
    [[-0.345, -0.345], [0.345, 0.345]].forEach(([x, z]) => { const c = makeCup(); c.scale.setScalar(0.5); c.position.set(x, 0.14, z); g.add(c); });
    show(g, { dir: [0.75, 0.95, 1.35], fill: 0.6 });
  };
  P['Printed Napkins'] = () => {
    const g = new THREE.Group();
    for (let i = 0; i < 14; i++) { const s = pbox(1.1, 0.022, 1.1, WHITE, 'white', i === 13 ? { top: Lat(0.78, 0.78, 0.28, GREEN) } : {}, { rough: 0.95 }, 0.008); s.position.set((rnd() - 0.5) * 0.02, 0.011 + i * 0.023, (rnd() - 0.5) * 0.02); g.add(s); }
    const n2 = new THREE.Group(); for (let i = 0; i < 6; i++) { const s = pbox(1.1, 0.022, 1.1, GREEN, 'white', i === 5 ? { top: Lat(0.78, 0.78, 0.28, WHITE) } : {}, { rough: 0.95 }, 0.008); s.position.y = 0.011 + i * 0.023; n2.add(s); } n2.position.set(-1.05, 0, -0.6); n2.rotation.y = 0.35; g.add(n2);
    show(g, { dir: [0.7, 1.0, 1.35], fill: 0.6 });
  };

  // ========== BAGS ==========
  P['Kraft Bag with Twisted Handle'] = () => { const g = bag(); g.rotation.y = -0.35; show(g, { dir: [0.5, 0.45, 1.4], fill: 0.66 }); };
  P['White Paper Bag'] = () => { const g = bag({ color: WHITE, kind: 'white', inner: '#E4DED3', hcol: '#F1EEE8', hcol2: 'rgba(150,140,125,.5)', front: L(0.42, INK) }); g.rotation.y = -0.35; show(g, { dir: [0.5, 0.45, 1.4], fill: 0.66 }); };
  P['Luxury Rope Bag'] = () => { const g = bag({ w: 1.4, d: 0.55, h: 1.75, color: BLACK, kind: 'card', inner: '#222', rough: 0.42, handle: 'rope', hcol: '#161616', hcol2: 'rgba(70,70,70,.8)', front: L(0.4, GOLD), hh: 0.55 }); g.rotation.y = -0.35; show(g, { dir: [0.5, 0.45, 1.4], fill: 0.66 }); };
  P['Flat Handle Bag'] = () => { const g = bag({ w: 1.55, d: 0.85, h: 1.7, handle: 'flat', hcol: KRAFT, hw: 0.4, hh: 0.45, front: L(0.42) }); g.rotation.y = -0.35; show(g, { dir: [0.5, 0.45, 1.4], fill: 0.66 }); };
  P['Gift Bag'] = () => { const g = bag({ w: 1.2, d: 0.55, h: 1.4, color: PINK, kind: 'card', inner: '#E8C4C4', rough: 0.5, handle: 'ribbon', hcol: '#2E6B3A', hw: 0.3, hh: 0.4, front: L(0.45, INK) }); tissueTuft(g, 1.25, [WHITE, '#F7F3EC'], 0.5); g.rotation.y = -0.3; show(g, { dir: [0.5, 0.5, 1.4], fill: 0.64 }); };

  // ========== LABELS & STICKERS ==========
  P['Logo Stickers'] = () => {
    const g = new THREE.Group(), styles = [[WHITE, INK], [GREEN, WHITE], [KRAFT, INK], [BLACK, GOLD]];
    for (let i = 0; i < 11; i++) {
      const [bg, ink] = styles[i % 4], r = 0.28 + rnd() * 0.08, round = i % 3 !== 2;
      const top = printed(bg, i % 4 === 2 ? 'kraft' : 'card', 1, 1, (x, cw, ch) => drawLogo(x, cw / 2, ch / 2, cw * 0.78, ink), { rough: 0.35 });
      const m = round ? new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.008, 64), [solid(bg, 0.4), top, solid(bg, 0.4)]) : rbox(r * 1.9, 0.008, r * 1.9, [solid(bg), solid(bg), top, solid(bg), solid(bg), solid(bg)], 0.003);
      const a = i * 2.4, rad = i ? 0.55 + (i % 3) * 0.33 : 0; m.position.set(Math.cos(a) * rad, 0.005 + i * 0.0005, Math.sin(a) * rad * 0.8); m.rotation.y = rnd() * 6; g.add(m);
    }
    show(g, { dir: FLAT, fill: 0.62, shadow: 0.25 });
  };
  P['Product Labels'] = () => {
    const g = new THREE.Group();
    const jar = (x, z, s, honey, labelBg, ink) => {
      const j = new THREE.Group(), glass = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.06, transmission: 1, thickness: 0.05, ior: 1.45, transparent: true });
      j.add(lathe([[0.001, 0], [0.42, 0], [0.45, 0.04], [0.45, 1.05], [0.36, 1.15], [0.34, 1.25]], glass));
      const fill = lathe([[0.001, 0.03], [0.42, 0.03], [0.425, 0.95], [0.001, 0.95]], new THREE.MeshPhysicalMaterial({ color: honey, roughness: 0.15, transmission: 0.3, thickness: 1 })); j.add(fill);
      const lbl = lathe(Array.from({ length: 9 }, (_, i) => [0.456, 0.3 + 0.5 * i / 8]), wrapPrint(labelBg, 'card', 0.8, 0.5, ink, { word: 'YOUR LOGO', sub: 'NATURAL' }, 5.7)); j.add(lbl);
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.37, 0.37, 0.18, 48), solid('#C8A96A', 0.3, 0.8)); lid.position.y = 1.32; j.add(lid);
      j.position.set(x, 0, z); j.scale.setScalar(s); return j;
    };
    g.add(jar(0, 0, 1, '#C27A12', WHITE, INK), jar(-1.0, -0.7, 0.85, '#7A2A1C', KRAFT, INK), jar(0.95, -0.5, 0.75, '#D9A441', GREEN, WHITE));
    show(g, { dir: [0.6, 0.55, 1.4], fill: 0.62 });
  };
  P['Box Seal Stickers'] = () => {
    const g = new THREE.Group(), w = 1.6, d = 1.2, h = 0.45;
    const b = pbox(w, h, d, WHITE, 'white', {}, {}, 0.015); b.position.y = h / 2; g.add(b);
    const s = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.006, 64), [solid(GREEN, 0.4), printed(GREEN, 'card', 1, 1, (x, cw, ch) => drawLogo(x, cw / 2, ch / 2, cw * 0.78, WHITE), { rough: 0.35 }), solid(GREEN)]);
    // sticker folds over the front edge: half on top, half on front
    s.position.set(0, h + 0.004, d / 2 - 0.12); g.add(s);
    const s2 = s.clone(); s2.rotation.x = Math.PI / 2; s2.position.set(0, h - 0.12, d / 2 + 0.004); s2.scale.set(1, 1, 1); g.add(s2);
    for (let i = 0; i < 5; i++) { const t = s.clone(); t.position.set(1.3 + (i % 2) * 0.48, 0.003, -0.4 + i * 0.32); t.rotation.y = rnd() * 6; g.add(t); }
    show(g, { dir: [0.7, 0.85, 1.35], fill: 0.6 });
  };
  P['Price & Barcode Labels'] = () => {
    const g = new THREE.Group(), R = 0.55, W = 0.8;
    const labels = (x, cw, ch) => { for (let i = 0; i < 4; i++) { const y0 = i * ch / 4 + ch * 0.02; x.fillStyle = '#FFFFFF'; x.fillRect(cw * 0.04, y0, cw * 0.92, ch / 4 - ch * 0.04); barcode(0.1, (y0 + ch * 0.02) / ch, 0.5, 0.12)(x, cw, ch); text(0.78, (y0 + ch * 0.1) / ch, 0.13, '$9.99', '#111', 'Arial, sans-serif', 800)(x, cw, ch); text(0.35, (y0 + ch * 0.19) / ch, 0.06, '0 123456 789012', '#333', 'Arial', 400)(x, cw, ch); } };
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(R, R, W, 72), [mat('#EDE9E2', 'white'), printed('#EDE9E2', 'white', 1, 1, (x, cw, ch) => { for (let r = 0.12; r < 0.5; r += 0.012) { x.strokeStyle = `rgba(0,0,0,${0.04 + rnd() * 0.05})`; x.beginPath(); x.arc(cw / 2, ch / 2, cw * r, 0, 7); x.stroke(); } x.fillStyle = '#B79B76'; x.beginPath(); x.arc(cw / 2, ch / 2, cw * 0.2, 0, 7); x.fill(); x.fillStyle = '#3a3128'; x.beginPath(); x.arc(cw / 2, ch / 2, cw * 0.16, 0, 7); x.fill(); }), mat('#EDE9E2', 'white')]);
    roll.rotation.z = Math.PI / 2; roll.position.y = R; g.add(roll);
    const strip = sheet(W * 0.96, 2.2, '#F4F1EA', 'white', labels, 0.004); strip.position.set(0, 0.002, R + 0.9); g.add(strip);
    show(g, { dir: [0.75, 1.0, 1.3], fill: 0.62 });
  };

  // ========== RETAIL ==========
  function mailer(color = WHITE, kind = 'white', top = L(0.5)) {
    const g = new THREE.Group(), w = 1.7, d = 1.3, h = 0.45, sides = (x, cw, ch) => { x.fillStyle = 'rgba(0,0,0,.08)'; x.fillRect(0, ch * 0.45, cw, 2); };
    const b = pbox(w, h, d, color, kind, { top, front: sides, right: sides }, {}, 0.015); b.position.y = h / 2; g.add(b);
    return g;
  }
  P['Mailer Box'] = () => {
    const g = new THREE.Group(), a = mailer(WHITE, 'white', L(0.5)), b = mailer(KRAFT, 'kraft', L(0.5));
    b.position.set(-0.3, 0.452, -0.1); b.rotation.y = 0.22; g.add(a, b);
    const op = new THREE.Group(); op.add(openTray(1.7, 1.3, 1.7, 1.3, 0.45, mat(GREEN, 'card'), mat(WHITE, 'white')));
    const lid = pbox(1.7, 0.02, 1.3, GREEN, 'card', { bottom: L(0.45, WHITE) }, {}, 0.005); lid.geometry.translate(0, 0, -0.65); lid.position.set(0, 0.45, -0.65); lid.rotation.x = -1.9; op.add(lid);
    op.position.set(1.4, 0, -1.4); op.rotation.y = -0.2; g.add(op);
    show(g, { dir: [0.65, 0.9, 1.35], fill: 0.62 });
  };
  P['Product Box'] = () => {
    const g = new THREE.Group(), w = 0.7, h = 1.6, d = 0.7;
    const front = all(block(0, 0, 1, 0.08, GREEN), Lat(0.5, 0.38, 0.62, INK), text(0.5, 0.66, 0.08, 'NATURAL CARE', '#333', 'Arial, sans-serif', 700), lines(0.2, 0.74, 0.6, 3, 0.03, 0.01), block(0, 0.92, 1, 0.08, GREEN));
    const side = all(block(0, 0, 1, 0.08, GREEN), lines(0.12, 0.2, 0.76, 10, 0.035, 0.01), barcode(0.15, 0.72, 0.5, 0.1), block(0, 0.92, 1, 0.08, GREEN));
    const a = pbox(w, h, d, WHITE, 'card', { front, right: side, top: (x, cw, ch) => { x.fillStyle = 'rgba(0,0,0,.12)'; x.fillRect(0, ch * 0.85, cw, 2); } }, { rough: 0.5 }, 0.008); a.position.y = h / 2;
    const b = pbox(w, h, d, '#1F3D26', 'card', { front: all(Lat(0.5, 0.38, 0.62, '#F3EBDD'), text(0.5, 0.66, 0.08, 'NATURAL CARE', '#F3EBDD', 'Arial', 700)), right: lines(0.12, 0.2, 0.76, 10, 0.035, 0.01, 'rgba(255,255,255,.4)') }, { rough: 0.5 }, 0.008); b.position.set(-0.85, h / 2, -0.35); b.rotation.y = 0.25;
    g.add(a, b); show(g, { dir: [0.75, 0.55, 1.35], fill: 0.62 });
  };
  P['Rigid Gift Box'] = () => {
    const g = lidBox(1.4, 0.7, 1.4, 0.3, '#1F3D26', 'card', L(0.5, GOLD), { rough: 0.55 });
    const r = solid('#C8A96A', 0.35, 0.3); [[1.45, 0.025, 0.1], [0.1, 0.025, 1.45]].forEach(([a, b, c]) => { const s = new THREE.Mesh(new THREE.BoxGeometry(a, b, c), r); s.position.set(0, 0.705, 0); if (a < 1) s.position.x = 0.45; else s.position.z = 0.45; g.add(s); });
    const s3 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.02), r); s3.position.set(0.45, 0.56, 0.725); g.add(s3);
    const s4 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.3, 0.1), r); s4.position.set(0.725, 0.56, 0.45); g.add(s4);
    const lb = lidBox(1.0, 0.5, 1.0, 0.22, CREAM, 'card', L(0.5, '#1F3D26'), { rough: 0.6 }); lb.position.set(-1.1, 0, -0.5); lb.rotation.y = 0.3; g.add(lb);
    g.rotation.y = 0.1; show(g, { dir: [0.75, 0.8, 1.35], fill: 0.62 });
  };
  P['Packaging Sleeve'] = () => {
    const g = new THREE.Group(), w = 1.6, h = 0.45, d = 1.1;
    const b = pbox(w, h, d, '#1F3D26', 'card', {}, { rough: 0.55 }, 0.012); b.position.y = h / 2; g.add(b);
    const s = pbox(0.7, h + 0.02, d + 0.02, KRAFT, 'kraft', { top: L(0.7), front: Lat(0.5, 0.5, 0.75, INK) }, {}, 0.006); s.position.set(0.15, (h + 0.02) / 2, 0); g.add(s);
    const b2 = b.clone(); b2.position.set(-0.4, h * 1.5 + 0.03, -0.15); b2.rotation.y = 0.2; const s2 = s.clone(); s2.position.set(-0.4 + 0.15 * Math.cos(0.2), h * 1.5 + 0.03, -0.15 - 0.15 * Math.sin(0.2)); s2.rotation.y = 0.2; g.add(b2, s2);
    show(g, { dir: [0.75, 0.85, 1.35], fill: 0.6 });
  };
  P['Hang Tags'] = () => {
    const g = new THREE.Group(), specs = [[KRAFT, 'kraft', INK], [BLACK, 'card', GOLD], [WHITE, 'card', GREEN], [KRAFT, 'kraft', INK], [GREEN, 'card', WHITE]];
    specs.forEach(([c, k, ink], i) => { const t = tag(0.55, 1.0, c, k, all(Lat(0.5, 0.55, 0.75, ink), text(0.5, 0.85, 0.1, '$ 49', ink, 'Arial', 700)), { rough: 0.6 }); t.rotation.set(-Math.PI / 2, 0, (i - 2) * 0.35 + (rnd() - 0.5) * 0.2); t.position.set((i - 2) * 0.45, 0.002 + i * 0.013, (i % 2) * 0.25); g.add(t);
      const hx = t.position.x - Math.sin(t.rotation.z) * 0.35, hz = t.position.z - Math.cos(t.rotation.z) * 0.35; g.add(string([[hx, 0.02 + i * 0.013, hz], [hx - 0.1, 0.012, hz - 0.35], [hx + 0.1, 0.01, hz - 0.7]], 0.007, '#D8CBB4')); });
    show(g, { dir: FLAT, fill: 0.62, shadow: 0.25 });
  };
  P['Printed Tissue Paper'] = () => {
    const g = new THREE.Group(), pt = pattern(0.18, 0.55, GREEN, 0.75);
    for (let i = 0; i < 5; i++) { const s = sheet(1.6, 1.1, WHITE, 'white', i === 4 ? pt : null, 0.006, { rough: 0.95 }); s.position.y = 0.004 + i * 0.007; s.rotation.y = (rnd() - 0.5) * 0.1; g.add(s); }
    const cr = crumple(2.0, 1.4, WHITE, 14, 0.07); cr.material = printed(WHITE, 'white', 2.0, 1.4, pattern(0.15, 0.55, GREEN, 0.75), { side: THREE.DoubleSide, rough: 0.95 }); cr.rotation.set(-1.25, 0, 0.2); cr.position.set(0.4, 0.5, -0.9); g.add(cr);
    show(g, { dir: [0.5, 1.05, 1.3], fill: 0.62 });
  };
  P['Counter Display Stand'] = () => {
    const g = new THREE.Group(), w = 1.6, d = 1.0;
    const tray = pbox(w, 0.35, d, WHITE, 'card', { front: all(block(0, 0, 1, 1, GREEN), Lat(0.5, 0.5, 0.8, WHITE)) }, {}, 0.01); tray.position.y = 0.175; g.add(tray);
    const header = pbox(w, 1.3, 0.04, GREEN, 'card', { front: all(Lat(0.5, 0.4, 0.6, WHITE)) }, {}, 0.01); header.position.set(0, 0.35 + 0.65, -d / 2 + 0.02); g.add(header);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { const p = pbox(0.32, 0.5, 0.3, i % 2 ? WHITE : CREAM, 'card', { front: all(block(0, 0, 1, 0.12, GREEN), Lat(0.5, 0.5, 0.7, INK)) }, {}, 0.006); p.position.set(-0.57 + i * 0.38, 0.35 + 0.25 - 0.1, -0.15 + j * 0.36); g.add(p); }
    show(g, { dir: [0.75, 0.7, 1.35], fill: 0.62 });
  };
  P['Thank-You Cards'] = () => {
    const g = new THREE.Group(), front = all(text(0.5, 0.42, 0.2, 'Thank you', INK, 'Georgia, serif', 400), text(0.5, 0.6, 0.06, 'FOR SHOPPING WITH US', '#555', 'Arial', 600), Lat(0.5, 0.82, 0.18, INK));
    for (let i = 0; i < 6; i++) { const c = sheet(1.0, 1.4, CREAM, 'card', i === 5 ? front : null, 0.012); c.position.y = 0.006 + i * 0.013; c.rotation.y = 0.15 + (rnd() - 0.5) * 0.08; g.add(c); }
    const c2 = sheet(1.0, 1.4, GREEN, 'card', all(Lat(0.5, 0.5, 0.5, CREAM)), 0.012); c2.position.set(-0.95, 0.006, -0.45); c2.rotation.y = 0.45; g.add(c2);
    const e = envelope(1.5, 1.1, KRAFT, null, true, 'kraft'); e.position.set(0.9, 0.006, -0.7); e.rotation.y = -0.3; g.add(e);
    show(g, { dir: FLAT, fill: 0.62, shadow: 0.3 });
  };

  // ========== CORPORATE ==========
  P['Business Cards'] = () => {
    const g = new THREE.Group(), cw = 0.85, ch = 0.5;
    const front = all(Lat(0.22, 0.5, 0.65, INK), text(0.45, 0.4, 0.13, 'Your Name', INK, 'Georgia, serif', 700, 'left'), text(0.45, 0.58, 0.08, 'Sales Manager', '#555', 'Arial', 400, 'left'), lines(0.45, 0.72, 0.45, 2, 0.08, 0.025));
    const back = all(block(0, 0, 1, 1, GREEN), Lat(0.5, 0.5, 0.65, WHITE));
    for (let i = 0; i < 12; i++) { const c = sheet(cw, ch, WHITE, 'card', i === 11 ? front : null, 0.01, { rough: 0.6 }); c.position.y = 0.005 + i * 0.011; c.rotation.y = 0.1; g.add(c); }
    const b2 = sheet(cw, ch, GREEN, 'card', back, 0.01); b2.position.set(-0.7, 0.006, -0.55); b2.rotation.y = 0.5; g.add(b2);
    const f2 = sheet(cw, ch, WHITE, 'card', front, 0.01); f2.position.set(0.55, 0.006, -0.65); f2.rotation.y = -0.25; g.add(f2);
    show(g, { dir: FLAT, fill: 0.6, shadow: 0.3 });
  };
  P['Letterheads'] = () => {
    const g = new THREE.Group();
    const a4 = sheet(1.4, 1.98, WHITE, 'white', doc(), 0.006); a4.rotation.y = 0.12; g.add(a4);
    const a2 = sheet(1.4, 1.98, WHITE, 'white', doc(), 0.006); a2.position.set(-0.5, -0.001, -0.3); a2.rotation.y = 0.35; g.add(a2);
    const e = envelope(1.5, 0.75, WHITE, all(Lat(0.12, 0.2, 0.28, INK), lines(0.5, 0.55, 0.38, 3, 0.1, 0.03))); e.position.set(0.9, 0.012, 0.6); e.rotation.y = -0.4; g.add(e);
    show(g, { dir: FLAT, fill: 0.62, shadow: 0.25 });
  };
  P['Envelopes'] = () => {
    const g = new THREE.Group(), f = all(Lat(0.1, 0.22, 0.3, INK), lines(0.5, 0.55, 0.38, 3, 0.1, 0.03));
    [[WHITE, 0, 0, 0.1, false], [KRAFT, -0.3, -0.45, 0.3, false], [GREEN, 0.4, 0.5, -0.15, true]].forEach(([c, x, z, r, back], i) => { const e = envelope(1.6, 0.8, c, back ? null : f, back, c === KRAFT ? 'kraft' : 'white'); e.position.set(x, 0.006 + i * 0.013, z); e.rotation.y = r; g.add(e); });
    show(g, { dir: FLAT, fill: 0.62, shadow: 0.25 });
  };
  P['Presentation Folders'] = () => {
    const g = new THREE.Group(), cover = all(Lat(0.5, 0.4, 0.55, WHITE), text(0.5, 0.7, 0.05, 'COMPANY PROFILE', WHITE, 'Arial', 700));
    const paper = sheet(1.3, 1.8, WHITE, 'white', doc(), 0.006); paper.position.set(0.25, 0.002, -0.2); paper.rotation.y = 0.3; g.add(paper);
    const f1 = booklet(1.4, 1.9, 0.05, GREEN, cover, { rough: 0.6 }); f1.position.y = 0.01; f1.rotation.y = 0.12; g.add(f1);
    const f2 = booklet(1.4, 1.9, 0.05, WHITE, all(Lat(0.5, 0.4, 0.55, INK), text(0.5, 0.7, 0.05, 'COMPANY PROFILE', INK, 'Arial', 700)), { rough: 0.6 }); f2.position.set(-1.3, 0, -0.5); f2.rotation.y = 0.35; g.add(f2);
    show(g, { dir: [0.35, 1.4, 1.0], fill: 0.62, shadow: 0.3 });
  };
P['Flyers & Brochures'] = () => {
    const g = new THREE.Group(), pw = 0.7, ph = 1.45;
    const panels = [all(photo(0, 0, 1, 0.5, '#7FA88A', '#2E6B3A'), Lat(0.5, 0.65, 0.5, INK), lines(0.12, 0.8, 0.76, 3, 0.04, 0.012)), all(text(0.5, 0.12, 0.12, 'About us', INK, 'Georgia', 700), lines(0.12, 0.22, 0.76, 10, 0.04, 0.012), photo(0.1, 0.68, 0.8, 0.26, '#E3C9A8', '#B98E5F')), all(block(0, 0, 1, 1, GREEN), Lat(0.5, 0.35, 0.6, WHITE), lines(0.15, 0.62, 0.7, 5, 0.05, 0.014, 'rgba(255,255,255,.55)'))];
    panels.forEach((p, i) => { const m = pbox(pw, ph, 0.01, WHITE, 'white', { front: p }, { rough: 0.6 }, 0.002); const ang = [0.5, -0.5, 0.5][i]; m.rotation.y = ang; m.position.set((i - 1) * pw * 0.88, ph / 2, i === 1 ? 0.18 : 0); g.add(m); });
    for (let i = 0; i < 5; i++) { const f = sheet(1.0, 1.42, WHITE, 'white', i === 4 ? all(photo(0, 0, 1, 0.55, '#C9A27A', '#7A5A3A'), Lat(0.5, 0.7, 0.35, INK), text(0.5, 0.88, 0.08, 'GRAND OPENING', INK, 'Arial', 800)) : null, 0.006); f.position.set(0.9, 0.004 + i * 0.007, 0.9); f.rotation.y = -0.3; g.add(f); }
    show(g, { dir: [0.6, 0.75, 1.35], fill: 0.62 });
  };
  P['Catalogues'] = () => {
    const g = new THREE.Group(), cov = (c1, c2) => all(photo(0, 0, 1, 0.68, c1, c2), text(0.5, 0.78, 0.09, 'CATALOGUE 2027', INK, 'Arial', 800), Lat(0.5, 0.9, 0.12, INK));
    const a = booklet(1.3, 1.8, 0.1, WHITE, cov('#D9C3A5', '#8F6E4B'), { rough: 0.45 }); a.rotation.y = 0.12; a.position.y = 0.102; g.add(a);
    const b = booklet(1.3, 1.8, 0.1, WHITE, cov('#9DBB9F', '#2E6B3A'), { rough: 0.45 }); b.position.set(-0.75, 0, -0.65); b.rotation.y = 0.4; g.add(b);
    show(g, { dir: [0.4, 1.3, 1.1], fill: 0.62, shadow: 0.3 });
  };
  P['Branded Notebooks'] = () => {
    const g = new THREE.Group(), deb = (ink) => (x, cw, ch) => { x.globalAlpha = 0.55; drawLogo(x, cw / 2, ch * 0.45, cw * 0.38, ink); };
    const a = booklet(1.05, 1.5, 0.16, GREEN, deb('#173320'), { hard: true, rough: 0.75 }); a.rotation.y = 0.15; g.add(a);
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.175, 1.52), solid('#173320', 0.6)); band.position.set(0.38, 0.08, 0); a.add(band);
    const b = booklet(1.05, 1.5, 0.16, KRAFT, deb(INK), { hard: true, kind: 'kraft' }); b.position.set(-0.65, 0.161, -0.25); b.rotation.y = 0.45; g.add(b);
    const c = booklet(1.05, 1.5, 0.16, BLACK, deb(GOLD), { hard: true, rough: 0.6 }); c.position.set(0.95, 0, -0.8); c.rotation.y = -0.2; g.add(c);
    show(g, { dir: [0.6, 1.05, 1.3], fill: 0.62 });
  };
  P['Calendars'] = () => {
    const g = new THREE.Group(), w = 1.6, h = 1.15;
    const month = all(photo(0.05, 0.05, 0.9, 0.38, '#9DBB9F', '#2E6B3A'), text(0.1, 0.5, 0.07, 'JANUARY 2027', INK, 'Arial', 800, 'left'), Lat(0.86, 0.5, 0.1, INK), (x, cw, ch) => { x.fillStyle = '#555'; x.font = `500 ${ch * 0.045}px Arial`; x.textAlign = 'center'; let d = 1; for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) { if (r === 0 && c < 4) continue; if (d > 31) break; x.fillStyle = c === 6 ? '#2E6B3A' : '#555'; x.fillText(String(d++), cw * (0.13 + c * 0.124), ch * (0.62 + r * 0.075)); } });
    const front = pbox(w, h, 0.012, WHITE, 'card', { front: month }, {}, 0.004); front.rotation.x = -0.32; front.position.set(0, h / 2 * Math.cos(0.32), 0.18);
    const back = pbox(w, h, 0.012, GREEN, 'card', {}, {}, 0.004); back.rotation.x = 0.32; back.position.set(0, h / 2 * Math.cos(0.32), -0.18);
    const rings = new THREE.Group(); for (let i = 0; i < 14; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.006, 8, 16), solid('#C0C0C0', 0.3, 0.9)); r.rotation.y = Math.PI / 2; r.position.set(-w / 2 + 0.12 + i * (w - 0.24) / 13, h * Math.cos(0.32), 0); rings.add(r); }
    g.add(front, back, rings); show(g, { dir: [0.55, 0.45, 1.4], fill: 0.62 });
  };

  // ========== SCHOOL ==========
  P['Exercise Books & Notebooks'] = () => {
    const g = new THREE.Group(), cov = (c) => all(block(0, 0, 1, 1, c), (x, cw, ch) => { x.fillStyle = '#FFFFFF'; x.fillRect(cw * 0.18, ch * 0.3, cw * 0.64, ch * 0.22); x.strokeStyle = '#999'; for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(cw * 0.24, ch * (0.37 + i * 0.05)); x.lineTo(cw * 0.76, ch * (0.37 + i * 0.05)); x.stroke(); } }, Lat(0.5, 0.75, 0.2, WHITE));
    [['#2E6B3A', 0, 0.12], ['#C9473B', -0.55, 0.4], ['#2F5C9A', 0.5, -0.2], ['#E3B341', -0.15, 0.25]].forEach(([c, x, r], i) => { const b = booklet(1.0, 1.4, 0.05, c, cov(c), { rough: 0.55 }); b.position.set(x * 0.6, i * 0.052, -i * 0.05); b.rotation.y = r; g.add(b); });
    show(g, { dir: [0.45, 1.25, 1.15], fill: 0.62, shadow: 0.3 });
  };
  P['Certificates & Diplomas'] = () => {
    const g = new THREE.Group(), cert = all(border(0.05, GOLD, 0.008), Lat(0.5, 0.18, 0.16, INK), text(0.5, 0.36, 0.08, 'CERTIFICATE', INK, 'Georgia', 700), text(0.5, 0.44, 0.035, 'OF ACHIEVEMENT', '#555', 'Arial', 600), text(0.5, 0.56, 0.06, 'Student Name', '#333', 'Georgia', 400), lines(0.25, 0.65, 0.5, 2, 0.04, 0.006), block(0.15, 0.85, 0.22, 0.003, '#555'), block(0.63, 0.85, 0.22, 0.003, '#555'));
    const c = sheet(1.98, 1.4, CREAM, 'card', cert, 0.008); c.rotation.y = 0.08; c.position.y = 0.035; g.add(c);
    const s = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.008, 40), new THREE.MeshStandardMaterial({ color: '#C8A96A', roughness: 0.3, metalness: 0.85 })); s.position.set(0.12, 0.045, 0.42); g.add(s);
    const folder = booklet(2.2, 1.6, 0.03, '#1F3D26', null, { rough: 0.55 }); folder.position.set(-0.3, 0, -0.5); folder.rotation.y = 0.25; g.add(folder);
    show(g, { dir: FLAT, fill: 0.62, shadow: 0.3 });
  };
  P['Report Folders'] = () => {
    const g = new THREE.Group(), cov = (ink) => all(Lat(0.5, 0.25, 0.4, ink), (x, cw, ch) => { x.strokeStyle = ink; x.lineWidth = 3; x.strokeRect(cw * 0.15, ch * 0.5, cw * 0.7, ch * 0.18); }, text(0.5, 0.59, 0.05, 'REPORT', ink, 'Arial', 700));
    [[GREEN, WHITE], ['#2F5C9A', WHITE], [KRAFT, INK]].forEach(([c, ink], i) => { const f = booklet(1.35, 1.85, 0.04, c, cov(ink), { kind: c === KRAFT ? 'kraft' : 'card', rough: 0.6 }); f.position.set((i - 1) * 0.5, i * 0.042, (i - 1) * 0.15); f.rotation.y = 0.35 - i * 0.2; g.add(f); });
    show(g, { dir: [0.4, 1.3, 1.1], fill: 0.62, shadow: 0.3 });
  };
  P['Agendas & Planners'] = () => {
    const g = new THREE.Group(), cov = (ink) => all((x, cw, ch) => { x.globalAlpha = 0.85; drawLogo(x, cw / 2, ch * 0.35, cw * 0.36, ink); }, text(0.5, 0.65, 0.12, '2027', ink, 'Georgia', 700), text(0.5, 0.74, 0.04, 'PLANNER', ink, 'Arial', 700));
    const a = booklet(1.1, 1.55, 0.2, '#1F3D26', cov(GOLD), { hard: true, rough: 0.65 }); a.rotation.y = 0.15; g.add(a);
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.004, 0.5), solid('#8E2B2B', 0.4)); rib.position.set(0.2, 0.004, 0.95); a.add(rib);
    const b = booklet(1.1, 1.55, 0.2, PINK, cov(INK), { hard: true, rough: 0.65 }); b.position.set(-0.55, 0.205, -0.35); b.rotation.y = 0.45; g.add(b);
    show(g, { dir: [0.55, 1.1, 1.3], fill: 0.62 });
  };

  // ========== EVENTS & WEDDINGS ==========
  const invite = all(border(0.06, '#B89A5E', 0.005), text(0.5, 0.2, 0.045, 'TOGETHER WITH THEIR FAMILIES', '#555', 'Arial', 600), text(0.5, 0.36, 0.12, 'Lara & Karim', '#2B2B2B', 'Georgia, serif', 400), text(0.5, 0.48, 0.04, 'REQUEST THE PLEASURE OF YOUR COMPANY', '#555', 'Arial', 600), text(0.5, 0.6, 0.06, 'Saturday, 12 June 2027', '#2B2B2B', 'Georgia', 400), text(0.5, 0.7, 0.045, 'Beirut, Lebanon', '#555', 'Georgia', 400), Lat(0.5, 0.85, 0.12, '#B89A5E', { word: 'L K', sub: '2027' }));
  P['Invitations'] = () => {
    const g = new THREE.Group();
    const c = sheet(1.1, 1.55, CREAM, 'card', invite, 0.014); c.rotation.y = 0.1; c.position.y = 0.02; g.add(c);
    const e = envelope(1.3, 0.95, '#E8E0D2', null, true, 'card'); e.position.set(-0.75, 0.006, -0.55); e.rotation.y = 0.45; g.add(e);
    const s = seal('#2E6B3A'); s.position.set(-0.75 + 0.0, 0.03, -0.55 + 0.05); g.add(s);
    const r = sheet(0.7, 0.5, CREAM, 'card', all(text(0.5, 0.3, 0.12, 'R.S.V.P', '#2B2B2B', 'Georgia', 400), lines(0.2, 0.55, 0.6, 2, 0.15, 0.02)), 0.012); r.position.set(0.85, 0.006, -0.45); r.rotation.y = -0.3; g.add(r);
    show(g, { dir: FLAT, fill: 0.6, shadow: 0.3 });
  };
  P['Invitation Envelopes'] = () => {
    const g = new THREE.Group();
    [['#E8E0D2', 0, 0, 0.1], ['#1F3D26', -0.4, -0.5, 0.35], [PINK, 0.45, 0.55, -0.2]].forEach(([c, x, z, r], i) => { const e = envelope(1.5, 1.05, c, null, true, 'card'); e.position.set(x, 0.006 + i * 0.014, z); e.rotation.y = r; g.add(e); const s = seal(['#7A1F2B', '#C8A96A', '#2E6B3A'][i]); s.position.set(x, 0.035 + i * 0.014, z + 0.04); g.add(s); });
    show(g, { dir: FLAT, fill: 0.62, shadow: 0.3 });
  };
  P['Event Programs & Menus'] = () => {
    const g = new THREE.Group(), menu = all(border(0.05, '#B89A5E', 0.004), text(0.5, 0.12, 0.1, 'Menu', '#2B2B2B', 'Georgia', 400), Lat(0.5, 0.22, 0.08, '#B89A5E', { word: 'L K', sub: '' }), ...[0.32, 0.47, 0.62, 0.77].map((v, i) => all(text(0.5, v, 0.04, ['STARTERS', 'MAIN', 'DESSERT', 'DRINKS'][i], '#2B2B2B', 'Arial', 700), lines(0.25, v + 0.035, 0.5, 2, 0.025, 0.006))));
    const m = pbox(0.8, 1.8, 0.012, CREAM, 'card', { front: menu }, {}, 0.004); m.position.set(0, 0.9 * Math.cos(0.18), 0); m.rotation.x = -0.18; g.add(m);
    
    const p2 = sheet(0.75, 1.4, CREAM, 'card', all(text(0.5, 0.2, 0.08, 'Order of', '#2B2B2B', 'Georgia', 400), text(0.5, 0.3, 0.12, 'Ceremony', '#2B2B2B', 'Georgia', 400), lines(0.2, 0.45, 0.6, 9, 0.045, 0.008)), 0.01); p2.position.set(-0.85, 0.006, 0.5); p2.rotation.y = 0.35; g.add(p2);
    show(g, { dir: [0.55, 0.75, 1.35], fill: 0.62 });
  };
  P['Favour Boxes'] = () => {
    const g = new THREE.Group(), specs = [[WHITE, '#B89A5E'], [PINK, WHITE], [CREAM, '#2E6B3A'], [WHITE, '#E8B4B8'], [PINK, '#B89A5E']];
    specs.forEach(([c, rib], i) => {
      const b = new THREE.Group(), s = 0.55; const bx = pbox(s, s, s, c, 'card', { front: Lat(0.5, 0.62, 0.45, '#5a4a3a', { word: 'L K', sub: '' }) }, {}, 0.01); bx.position.y = s / 2; b.add(bx);
      const r = solid(rib, 0.35); [[s + 0.01, 0.06, 0.06, 'x'], [0.06, 0.06, s + 0.01, 'z']].forEach(([a, bb, cc]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(a, 0.01, cc), r); m.position.y = s + 0.004; b.add(m); });
      const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.06, s, 0.01), r); sideR.position.set(0, s / 2, s / 2 + 0.005); b.add(sideR);
      [-1, 1].forEach((k) => { const l = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.018, 8, 24), r); l.scale.set(1, 0.6, 1); l.rotation.x = Math.PI / 2; l.position.set(k * 0.08, s + 0.02, 0); b.add(l); });
      const a = i * 1.25; b.position.set(Math.cos(a) * (i ? 0.8 : 0), 0, Math.sin(a) * (i ? 0.6 : 0)); b.rotation.y = rnd() * 1.2; g.add(b);
    });
    show(g, { dir: [0.7, 0.9, 1.35], fill: 0.62 });
  };
  P['Event Gift Bags & Tags'] = () => {
    const g = bag({ w: 1.1, d: 0.5, h: 1.3, color: CREAM, kind: 'card', inner: '#E2D8C6', rough: 0.55, handle: 'ribbon', hcol: '#B89A5E', hw: 0.28, hh: 0.38, front: Lat(0.5, 0.45, 0.45, '#2B2B2B', { word: 'L K', sub: '12.06.27' }) });
    tissueTuft(g, 1.15, [WHITE, '#F2E6E2'], 0.45);
    const t = tag(0.35, 0.6, KRAFT, 'kraft', all(text(0.5, 0.5, 0.18, 'Thank', INK, 'Georgia', 400), text(0.5, 0.68, 0.18, 'you', INK, 'Georgia', 400))); t.position.set(0.38, 0.95, 0.27); t.rotation.set(0, 0, 0.15); g.add(t);
    g.add(string([[0.28, 1.27, 0.255], [0.33, 1.12, 0.27], [0.37, 1.13, 0.27]], 0.006, '#B89A5E'));
    const g2 = bag({ w: 0.8, d: 0.4, h: 1.0, color: '#1F3D26', kind: 'card', inner: '#173320', rough: 0.5, handle: 'ribbon', hcol: '#C8A96A', hw: 0.2, hh: 0.3, front: Lat(0.5, 0.45, 0.45, GOLD, { word: 'L K', sub: '12.06.27' }) }); g2.position.set(-1.0, 0, -0.5); g2.rotation.y = 0.35;
    const all2 = new THREE.Group(); all2.add(g, g2); all2.rotation.y = -0.25; show(all2, { dir: [0.5, 0.5, 1.4], fill: 0.64 });
  };
}
