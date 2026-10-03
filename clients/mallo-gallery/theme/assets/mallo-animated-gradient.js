/*
 * Mallo Gallery: animated gradient background.
 * Vanilla WebGL2 port of the React "AnimatedGradient" component (21st.dev).
 * Soft white/beige waves for the hero. Pauses off-screen, static frame with reduced motion,
 * falls back to a CSS gradient where WebGL2 isn't available.
 *
 * Usage: <div data-mallo-gradient data-color1="#FFFFFF" data-color2="#F1E8DA" data-color3="#E3D3BA"
 *          data-speed="12" data-scale="0.45" data-rotation="-20" data-proportion="45" data-softness="100"
 *          data-distortion="4" data-swirl="55" data-swirl-iterations="6" data-shape="0" data-shape-size="30" data-offset="-235">
 */
(() => {
  const FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform float u_time;
uniform float u_pixelRatio;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_rotation;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform vec4 u_color3;
uniform float u_proportion;
uniform float u_softness;
uniform float u_shape;
uniform float u_shapeScale;
uniform float u_distortion;
uniform float u_swirl;
uniform float u_swirlIterations;
out vec4 fragColor;
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
vec2 rotate(vec2 uv, float th) { return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv; }
float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123); }
float noise(vec2 st) {
  vec2 i = floor(st); vec2 f = fract(st);
  float a = random(i); float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
vec4 blend_colors(vec4 c1, vec4 c2, vec4 c3, float mixer, float edgesWidth, float edge_blur) {
  vec3 color1 = c1.rgb * c1.a; vec3 color2 = c2.rgb * c2.a; vec3 color3 = c3.rgb * c3.a;
  float r1 = smoothstep(.0 + .35 * edgesWidth, .7 - .35 * edgesWidth + .5 * edge_blur, mixer);
  float r2 = smoothstep(.3 + .35 * edgesWidth, 1. - .35 * edgesWidth + edge_blur, mixer);
  vec3 b2 = mix(color1, color2, r1); float o2 = mix(c1.a, c2.a, r1);
  return vec4(mix(b2, color3, r2), mix(o2, c3.a, r2));
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = .5 * u_time;
  float noise_scale = .0005 + .006 * u_scale;
  uv -= .5; uv *= (noise_scale * u_resolution); uv = rotate(uv, u_rotation * .5 * PI); uv /= u_pixelRatio; uv += .5;
  float n1 = noise(uv * 1. + t); float n2 = noise(uv * 2. - t); float angle = n1 * TWO_PI;
  uv.x += 4. * u_distortion * n2 * cos(angle); uv.y += 4. * u_distortion * n2 * sin(angle);
  float iterations_number = ceil(clamp(u_swirlIterations, 1., 30.));
  for (float i = 1.; i <= iterations_number; i++) {
    uv.x += clamp(u_swirl, 0., 2.) / i * cos(t + i * 1.5 * uv.y);
    uv.y += clamp(u_swirl, 0., 2.) / i * cos(t + i * 1. * uv.x);
  }
  float proportion = clamp(u_proportion, 0., 1.);
  float shape = 0.; float mixer = 0.;
  if (u_shape < .5) {
    vec2 s = uv * (.5 + 3.5 * u_shapeScale);
    shape = .5 + .5 * sin(s.x) * cos(s.y);
    mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
  } else if (u_shape < 1.5) {
    vec2 s = uv * (.25 + 3. * u_shapeScale);
    float f = fract(s.y);
    shape = smoothstep(.0, .55, f) * smoothstep(1., .45, f);
    mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
  } else {
    float sh = 1. - uv.y; sh -= .5; sh /= (noise_scale * u_resolution.y); sh += .5;
    float shape_scaling = .2 * (1. - u_shapeScale);
    shape = smoothstep(.45 - shape_scaling, .55 + shape_scaling, sh + .3 * (proportion - .5));
    mixer = shape;
  }
  fragColor = blend_colors(u_color1, u_color2, u_color3, mixer, 1. - clamp(u_softness, 0., 1.), .01 + .01 * u_scale);
}`;
  const VERTEX_SHADER = `#version 300 es
  in vec4 a_position;
  void main() { gl_Position = a_position; }`;

  const hexToRgba = (hex) => {
    const c = String(hex || '#ffffff').replace('#', '');
    const n = c.length === 3 ? c.split('').map((x) => x + x).join('') : c;
    return [parseInt(n.slice(0, 2), 16) / 255, parseInt(n.slice(2, 4), 16) / 255, parseInt(n.slice(4, 6), 16) / 255, n.length === 8 ? parseInt(n.slice(6, 8), 16) / 255 : 1];
  };

  function init(host) {
    const d = host.dataset;
    const p = {
      color1: d.color1 || '#FFFFFF', color2: d.color2 || '#F1E8DA', color3: d.color3 || '#E3D3BA',
      speed: parseFloat(d.speed || '12'), scale: parseFloat(d.scale || '0.45'), rotation: parseFloat(d.rotation || '-20'),
      proportion: parseFloat(d.proportion || '45'), softness: parseFloat(d.softness || '100'), distortion: parseFloat(d.distortion || '4'),
      swirl: parseFloat(d.swirl || '55'), swirlIterations: parseFloat(d.swirlIterations || '6'), shape: parseFloat(d.shape || '0'),
      shapeSize: parseFloat(d.shapeSize || '30'), offset: parseFloat(d.offset || '-235'),
    };
    const fallback = () => {
      host.style.background = `radial-gradient(120% 90% at 20% 10%, ${p.color2} 0%, transparent 60%), radial-gradient(100% 80% at 85% 80%, ${p.color3} 0%, transparent 65%), ${p.color1}`;
    };

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:100%';
    host.appendChild(canvas);
    const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, alpha: true, antialias: true });
    if (!gl) { canvas.remove(); fallback(); return; }

    const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX_SHADER));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { canvas.remove(); fallback(); return; }
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = (n) => gl.getUniformLocation(program, n);
    const u = Object.fromEntries(['u_time', 'u_resolution', 'u_pixelRatio', 'u_scale', 'u_rotation', 'u_color1', 'u_color2', 'u_color3', 'u_proportion', 'u_softness', 'u_shape', 'u_shapeScale', 'u_distortion', 'u_swirl', 'u_swirlIterations'].map((n) => [n, U(n)]));
    const c1 = hexToRgba(p.color1), c2 = hexToRgba(p.color2), c3 = hexToRgba(p.color3);
    gl.uniform4f(u.u_color1, ...c1); gl.uniform4f(u.u_color2, ...c2); gl.uniform4f(u.u_color3, ...c3);
    gl.uniform1f(u.u_scale, p.scale);
    gl.uniform1f(u.u_rotation, (p.rotation * Math.PI) / 180);
    gl.uniform1f(u.u_proportion, p.proportion / 100);
    gl.uniform1f(u.u_softness, p.softness / 100);
    gl.uniform1f(u.u_shape, p.shape);
    gl.uniform1f(u.u_shapeScale, p.shapeSize / 100);
    gl.uniform1f(u.u_distortion, p.distortion / 50);
    gl.uniform1f(u.u_swirl, p.swirl / 100);
    gl.uniform1f(u.u_swirlIterations, p.swirl === 0 ? 0 : p.swirlIterations);

    // Cap resolution on big/hi-dpi screens: the waves are soft, so this is invisible and saves GPU.
    const dpr = () => Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const w = host.clientWidth, h = host.clientHeight, r = dpr();
      canvas.width = Math.max(1, Math.round(w * r)); canvas.height = Math.max(1, Math.round(h * r));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u.u_resolution, canvas.width, canvas.height);
      gl.uniform1f(u.u_pixelRatio, r);
    };

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let elapsed = 0, last = performance.now(), frame = 0, running = false;
    const render = () => {
      gl.uniform1f(u.u_time, elapsed * (p.speed / 100) * 5 + p.offset * 0.01);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    const tick = (now) => {
      if (!running) return;
      elapsed += Math.min((now - last) / 1000, 0.1);
      last = now;
      render();
      frame = requestAnimationFrame(tick);
    };
    const setRunning = (on) => {
      if (still) on = false;
      if (on === running) return;
      running = on;
      if (on) { last = performance.now(); frame = requestAnimationFrame(tick); } else cancelAnimationFrame(frame);
    };

    resize();
    render();
    new ResizeObserver(() => { resize(); render(); }).observe(host);
    let onScreen = true;
    const sync = () => setRunning(onScreen && document.visibilityState === 'visible');
    new IntersectionObserver((e) => { onScreen = e.some((x) => x.isIntersecting); sync(); }).observe(host);
    document.addEventListener('visibilitychange', sync);
    sync();
  }

  const boot = () => document.querySelectorAll('[data-mallo-gradient]:not([data-ready])').forEach((el) => { el.dataset.ready = '1'; init(el); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  document.addEventListener('shopify:section:load', boot);
})();
