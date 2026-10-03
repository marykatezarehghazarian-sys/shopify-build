/*
 * Mallo Gallery: ambient starfield background.
 * Vanilla port of the React "GravityStars" component (21st.dev), adapted for the theme:
 * dark stars on a light background, drifting and twinkling, with no pointer/touch interaction.
 *
 * Usage: <canvas data-mallo-stars data-color="#1A1714" data-count="160" data-connect="true"
 *          data-connect-distance="120" data-speed="1" data-twinkle="0.55" data-glow="4" data-star-size="1.5" data-tint="0.5">
 */
(() => {
  const TAU = Math.PI * 2;
  const MAX_DPR = 2;
  const MAX_COUNT = 600;
  const SPRITE_PX = 64;
  const SPRITE_LEVELS = 5;
  const DEPTH_BIAS = 1.7;
  const DRIFT_SPEED = 12;
  const LINE_LEVELS = 6;
  const LINE_BASE_ALPHA = 0.22;

  const hexToRgb = (hex) => {
    const h = String(hex || '').replace('#', '');
    const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.padEnd(6, '0');
    return [parseInt(n.slice(0, 2), 16) || 0, parseInt(n.slice(2, 4), 16) || 0, parseInt(n.slice(4, 6), 16) || 0];
  };
  const mix = (a, b, t) => a + (b - a) * t;

  // Deterministic PRNG so the layout is the same on every load.
  const createRandom = (seed) => {
    let s = seed % 2147483647 || 1;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
  };

  const paintSprite = (sprite, [r, g, b]) => {
    const ctx = sprite.getContext('2d');
    const c = SPRITE_PX / 2;
    const grad = ctx.createRadialGradient(c, c, 0, c, c, c);
    grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
    grad.addColorStop(0.08, `rgba(${r},${g},${b},0.95)`);
    grad.addColorStop(0.18, `rgba(${r},${g},${b},0.45)`);
    grad.addColorStop(0.35, `rgba(${r},${g},${b},0.12)`);
    grad.addColorStop(0.6, `rgba(${r},${g},${b},0.03)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.clearRect(0, 0, SPRITE_PX, SPRITE_PX);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SPRITE_PX, SPRITE_PX);
  };

  function init(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const d = canvas.dataset;
    const opt = {
      base: hexToRgb(d.color || '#1A1714'),
      count: Math.min(MAX_COUNT, Math.max(8, parseInt(d.count || '160', 10))),
      connect: d.connect !== 'false',
      connectDistance: parseFloat(d.connectDistance || '120'),
      speed: parseFloat(d.speed || '1'),
      twinkle: parseFloat(d.twinkle || '0.55'),
      glow: Math.max(1, parseFloat(d.glow || '4')),
      starSize: Math.max(0.2, parseFloat(d.starSize || '1.5')),
      tint: parseFloat(d.tint || '0.5'),
    };
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Tint ramp for a light background: cool slate to warm bronze around the base colour.
    const cool = [38, 48, 66];
    const warm = [122, 92, 46];
    const sprites = [];
    for (let l = 0; l < SPRITE_LEVELS; l++) {
      const t = l / (SPRITE_LEVELS - 1);
      const col = [0, 1, 2].map((k) => Math.round(mix(opt.base[k], mix(cool[k], warm[k], t), opt.tint)));
      const s = document.createElement('canvas');
      s.width = s.height = SPRITE_PX;
      paintSprite(s, col);
      sprites.push(s);
    }

    const rnd = createRandom(987654321);
    const stars = [];
    for (let i = 0; i < MAX_COUNT; i++) {
      const z = rnd() ** DEPTH_BIAS;
      const a = rnd() * TAU;
      const mag = DRIFT_SPEED * (0.15 + z);
      stars.push({
        sx: rnd(), sy: rnd(), x: 0, y: 0, z,
        phase: rnd() * TAU,
        rate: 1.15 * (1 + (rnd() - 0.5) * 0.8),
        jitter: 1 + (rnd() - 0.5) * 0.5,
        tint: Math.min(SPRITE_LEVELS - 1, Math.floor(((rnd() + rnd()) / 2) * SPRITE_LEVELS)),
        dx: Math.cos(a) * mag, dy: Math.sin(a) * mag,
      });
    }

    let w = 1, h = 1, active = 0, running = false, frame = 0, last = performance.now();
    const start = last;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const pw = w, ph = h;
      w = Math.max(1, r.width); h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const next = w < 640 ? Math.max(8, Math.round(opt.count * 0.6)) : opt.count;
      if (next !== active) {
        for (let i = 0; i < next; i++) { stars[i].x = stars[i].sx * w; stars[i].y = stars[i].sy * h; }
        active = next;
      } else {
        for (let i = 0; i < active; i++) { stars[i].x *= w / pw; stars[i].y *= h / ph; }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      if (opt.connect) {
        const lim = opt.connectDistance, lim2 = lim * lim;
        const buckets = Array.from({ length: LINE_LEVELS }, () => []);
        for (let i = 0; i < active; i++) {
          const a = stars[i];
          for (let j = i + 1; j < active; j++) {
            const b = stars[j];
            const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
            if (d2 > lim2 || d2 === 0) continue;
            const close = (1 - Math.sqrt(d2) / lim) ** 1.5;
            const depthW = 0.25 + ((a.z + b.z) / 2) * 0.75;
            buckets[Math.min(LINE_LEVELS - 1, Math.floor(close * depthW * LINE_LEVELS))].push(a.x, a.y, b.x, b.y);
          }
        }
        const [r, g, b] = opt.base;
        buckets.forEach((seg, level) => {
          if (!seg.length) return;
          ctx.strokeStyle = `rgba(${r},${g},${b},${(LINE_BASE_ALPHA * (level + 1)) / LINE_LEVELS})`;
          ctx.lineWidth = 0.3 + level * 0.12;
          ctx.beginPath();
          for (let k = 0; k < seg.length; k += 4) { ctx.moveTo(seg[k], seg[k + 1]); ctx.lineTo(seg[k + 2], seg[k + 3]); }
          ctx.stroke();
        });
      }
      const t = (performance.now() - start) / 1000;
      for (let i = 0; i < active; i++) {
        const s = stars[i];
        const wave = still ? Math.sin(s.phase) : Math.sin(t * s.rate + s.phase);
        const alpha = Math.min(1, Math.max(0, (0.22 + s.z * 0.78) * (1 - opt.twinkle * 0.5 * (1 - wave))));
        if (alpha <= 0.01) continue;
        const core = opt.starSize * (0.42 + s.z * 1.9) * s.jitter;
        const halo = core * opt.glow * (0.6 + s.z * 0.7);
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprites[s.tint], s.x - halo, s.y - halo, halo * 2, halo * 2);
      }
      ctx.globalAlpha = 1;
    };

    const tick = () => {
      if (!running) return;
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      for (let i = 0; i < active; i++) {
        const s = stars[i];
        s.x += s.dx * opt.speed * dt; s.y += s.dy * opt.speed * dt;
        if (s.x < 0) s.x += w; else if (s.x > w) s.x -= w;
        if (s.y < 0) s.y += h; else if (s.y > h) s.y -= h;
      }
      draw();
      frame = requestAnimationFrame(tick);
    };

    const setRunning = (on) => {
      if (still) on = false;
      if (on === running) return;
      running = on;
      if (on) { last = performance.now(); frame = requestAnimationFrame(tick); } else cancelAnimationFrame(frame);
    };

    resize();
    draw();
    new ResizeObserver(() => { resize(); if (!running) draw(); }).observe(canvas);

    // Only animate while visible on screen and the tab is in front (saves battery on phones).
    let onScreen = true;
    const sync = () => setRunning(onScreen && document.visibilityState === 'visible');
    new IntersectionObserver((e) => { onScreen = e.some((x) => x.isIntersecting); sync(); }).observe(canvas);
    document.addEventListener('visibilitychange', sync);
    sync();
  }

  const boot = () => document.querySelectorAll('canvas[data-mallo-stars]:not([data-ready])').forEach((c) => { c.dataset.ready = '1'; init(c); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  document.addEventListener('shopify:section:load', boot);
})();
