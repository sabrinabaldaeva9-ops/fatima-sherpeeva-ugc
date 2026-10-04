// VIBE GIFTS · 01 ORBIT HEART
// Procedural 3D collectible. One seamless 3-second loop (LOOP).
// Used by preview.html (live) and render.mjs (master PNG + frames).
import * as THREE from 'three';
import { mergeVertices } from '../vendor/BufferGeometryUtils.js';

export const LOOP = 3; // seconds, seamless
const TAU = Math.PI * 2;

// Vibe palette
const C = {
  lavender: 0xc9b8ff,
  violet: 0x7b5cff,
  ice: 0xbfe4ff,
  mint: 0xbff3e0,
  pearl: 0xf7f3ff,
  pink: 0xffc2dd,
  champagne: 0xe6cc98,
  black: 0x0b0a12,
};

// ---------- geometry ----------
function heartPoints(n = 240, width = 2.3, facets = 0) {
  let p = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * TAU;
    const x = 16 * Math.sin(t) ** 3;
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    p.push(new THREE.Vector2(x, y));
  }
  // heavy Laplacian smoothing: gives the tip and the cleft a real radius, so the pillow bevel never self-intersects
  for (let it = 0; it < 70; it++) {
    p = p.map((_, i) => {
      const a = p[(i - 2 + n) % n], b = p[(i - 1 + n) % n], c = p[i], d = p[(i + 1) % n], e = p[(i + 2) % n];
      return new THREE.Vector2((a.x + 2 * b.x + 3 * c.x + 2 * d.x + e.x) / 9, (a.y + 2 * b.y + 3 * c.y + 2 * d.y + e.y) / 9);
    });
  }
  const box = new THREE.Box2().setFromPoints(p);
  const k = width / (box.max.x - box.min.x);
  const cy = (box.max.y + box.min.y) / 2;
  p = p.map((v) => new THREE.Vector2(v.x * k, (v.y - cy) * k)).reverse();
  if (facets) p = Array.from({ length: facets }, (_, i) => p[Math.round((i / facets) * n) % n]);
  return p;
}

function heartGeometry({ depth = 0.3, bevel = 0.42, size = 0.16, scale = 1, facets = 0, segs = 18 } = {}) {
  const shape = new THREE.Shape(heartPoints(240, 2.3, facets));
  let g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: size,
    bevelOffset: -size,
    bevelSegments: segs,
    curveSegments: 1,
  });
  g.deleteAttribute('uv');
  g.deleteAttribute('normal');
  if (facets) {
    g = g.toNonIndexed(); // flat shading → every facet catches its own reflection
  } else {
    g = mergeVertices(g, 1e-4);
  }
  g.computeVertexNormals();
  g.center();
  g.scale(scale, scale, scale);
  return g;
}


// Brilliant-cut heart: girdle + crown rings that step toward an apex, every ring half a step
// out of phase with the last, so the facets zig-zag like a real cut stone. Flat-shaded.
function gemHeart({ N = 32, scale = 1, rings = [[1, 0.1], [0.74, 0.4], [0.46, 0.6], [0.2, 0.7]], apex = 0.74, width = 2.3 } = {}) {
  const outline = heartPoints(240, width, N);
  const cen = new THREE.Vector2(0, 0.06);
  const ringPts = (s, phase) =>
    outline.map((a, i) => {
      const b = outline[(i + 1) % N];
      const q = phase ? a.clone().add(b).multiplyScalar(0.5) : a.clone();
      return q.sub(cen).multiplyScalar(s).add(cen);
    });
  // sequence from back apex → back rings → girdle (both z of the belt) → front rings → front apex
  const seq = [];
  [...rings].reverse().forEach(([s, z], k) => seq.push({ pts: ringPts(s, (rings.length - 1 - k) % 2), z: -z }));
  // girdle belt (front side already is rings[0]; mirror gives back) – rings[0] pair forms the belt
  rings.forEach(([s, z], k) => seq.push({ pts: ringPts(s, k % 2), z }));
  const tris = [];
  const V = (v, z) => new THREE.Vector3(v.x, v.y, z);
  for (let r = 0; r < seq.length - 1; r++) {
    const A = seq[r], B = seq[r + 1];
    const phA = r < rings.length ? (rings.length - 1 - r) % 2 : (r - rings.length) % 2;
    const phB = r + 1 < rings.length ? (rings.length - 1 - (r + 1)) % 2 : (r + 1 - rings.length) % 2;
    for (let i = 0; i < N; i++) {
      const i1 = (i + 1) % N;
      if (phA === phB) {
        tris.push([V(A.pts[i], A.z), V(A.pts[i1], A.z), V(B.pts[i1], B.z)], [V(A.pts[i], A.z), V(B.pts[i1], B.z), V(B.pts[i], B.z)]);
      } else if (phA === 0) {
        // B vertex i sits between A i and A i+1
        tris.push([V(A.pts[i], A.z), V(A.pts[i1], A.z), V(B.pts[i], B.z)], [V(A.pts[i1], A.z), V(B.pts[i1], B.z), V(B.pts[i], B.z)]);
        // keep it watertight with the previous wedge
        tris.push([V(A.pts[i], A.z), V(B.pts[i], B.z), V(B.pts[(i - 1 + N) % N], B.z)]);
      } else {
        tris.push([V(B.pts[i], B.z), V(B.pts[i1], B.z), V(A.pts[i1], A.z)], [V(B.pts[i], B.z), V(A.pts[i1], A.z), V(A.pts[i], A.z)]);
        tris.push([V(A.pts[i], A.z), V(A.pts[i1], A.z), V(B.pts[i], B.z)]);
      }
    }
  }
  // caps: fan the first (back) and last (front) ring to an apex point
  const cap = (ring, z, zApex) => ring.pts.forEach((a, i) => tris.push([V(a, z), V(ring.pts[(i + 1) % N], z), V(cen, zApex)]));
  cap(seq[0], seq[0].z, -apex);
  cap(seq[seq.length - 1], seq[seq.length - 1].z, apex);
  const pos = [];
  tris.forEach((t) => {
    const n = new THREE.Vector3().subVectors(t[1], t[0]).cross(new THREE.Vector3().subVectors(t[2], t[0]));
    const c = new THREE.Vector3().add(t[0]).add(t[1]).add(t[2]).multiplyScalar(1 / 3);
    const tri = n.dot(c) < 0 ? [t[0], t[2], t[1]] : t;
    tri.forEach((v) => pos.push(v.x * scale, v.y * scale, v.z * scale));
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

// ---------- studio environment (soft-boxes) ----------
function studioEnv(renderer) {
  const s = new THREE.Scene();
  s.background = new THREE.Color(0x120f1e);
  const box = (w, h, color, intensity, pos, look = [0, 0, 0]) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide })
    );
    m.position.set(...pos);
    m.lookAt(...look);
    s.add(m);
  };
  box(14, 8, 0xffffff, 5.0, [0, 9, 3]); // overhead key
  box(3, 12, C.lavender, 6.0, [-9, 1, 3]); // left strip, lavender
  box(3, 12, C.ice, 5.0, [9, 1, 2]); // right strip, icy blue
  box(10, 2.2, C.pink, 3.2, [0, -3, 8]); // low front fill, pink
  box(12, 3, C.champagne, 3.4, [0, 2, -9]); // back rim, champagne
  box(18, 8, 0xfff1dc, 5.5, [0, -8, 3]); // warm floor bounce (lifts gold underside)
  box(2, 8, 0xffffff, 7.0, [5.5, 3, 6]); // hard accent streak
  box(2, 8, 0xffffff, 5.0, [-5.5, 2, 6]);
  const pm = new THREE.PMREMGenerator(renderer);
  const rt = pm.fromScene(s, 0.02);
  pm.dispose();
  return rt.texture;
}

function radialTexture(stops, size = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([o, col]) => gr.addColorStop(o, col));
  g.fillStyle = gr;
  g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function backdropTexture() {
  const size = 1024;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(size / 2, size * 0.46, 0, size / 2, size * 0.46, size * 0.75);
  gr.addColorStop(0, '#aea4dc');
  gr.addColorStop(0.28, '#7c70b8');
  gr.addColorStop(0.62, '#241d3a');
  gr.addColorStop(1, '#0b0a12');
  g.fillStyle = gr;
  g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ---------- build ----------
export function createOrbitHeart(canvas, { size = 1024 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(size, size, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.environment = studioEnv(renderer);
  scene.environmentIntensity = 1.0;
  const backdrop = backdropTexture();
  scene.background = backdrop;

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
  camera.position.set(0, 0.55, 10.5);
  camera.lookAt(0, 0.05, 0);

  const whiteMask = () => new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, transparent: true });
  const mats = (beauty) => ({ beauty, mask: whiteMask() });
  const bodyObjs = []; // objects that belong to the "body" layer

  // --- hero heart: iridescent crystal ---
  const heartMat = new THREE.MeshPhysicalMaterial({
    color: 0xf3eeff,
    metalness: 0,
    roughness: 0.09,
    transmission: 1,
    thickness: 0.8,
    ior: 1.4,
    dispersion: 0.6,
    attenuationColor: new THREE.Color(0xcdbcff),
    attenuationDistance: 2.2,
    iridescence: 1,
    iridescenceIOR: 1.45,
    iridescenceThicknessRange: [220, 780],
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    specularIntensity: 1,
    envMapIntensity: 1.35,
    side: THREE.FrontSide,
  });
  const heart = new THREE.Mesh(gemHeart({ scale: 1.1, N: 32 }), heartMat);
  heart.userData.mats = mats(heartMat);

  // --- inner core: soft-pulsing light inside the crystal ---
  const coreMat = new THREE.MeshStandardMaterial({ color: 0xff9ad0, emissive: 0xff5fb4, emissiveIntensity: 1.0, roughness: 0.35, metalness: 0 });
  const core = new THREE.Mesh(heartGeometry({ depth: 0.1, bevel: 0.22, size: 0.1, scale: 0.26 }), coreMat);
  core.userData.mats = mats(coreMat);
  core.position.z = 0;
  const coreHalo = new THREE.Mesh(
    heartGeometry({ depth: 0.05, bevel: 0.15, size: 0.06, scale: 0.7 }),
    new THREE.MeshBasicMaterial({ color: 0x9b7bff, transparent: true, opacity: 0.22, toneMapped: false, depthWrite: false })
  );
  coreHalo.userData.mats = { beauty: coreHalo.material, mask: whiteMask() };

  const heartGroup = new THREE.Group();
  heartGroup.add(heart, core, coreHalo);
  scene.add(heartGroup);
  bodyObjs.push(heartGroup);

  // --- ring: champagne gold, tilted, slightly oval in perspective ---
  const goldMat = new THREE.MeshPhysicalMaterial({
    color: C.champagne,
    metalness: 1,
    roughness: 0.11,
    clearcoat: 0.6,
    clearcoatRoughness: 0.08,
    envMapIntensity: 2.1,
    transparent: true,
  });
  const ringGroup = new THREE.Group();
  // Ring + pearl are flagged transparent so three.js keeps them OUT of the transmission buffer:
  // otherwise the crystal refracts the metal band in front of it into scan-line noise.
  [[1.75, 0.058], [1.98, 0.011]].forEach(([R, t]) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(R, t, 48, 360), goldMat);
    m.userData.mats = mats(goldMat);
    ringGroup.add(m);
  });

  // pearl satellite travelling the orbit exactly once per loop
  const pearlMat = new THREE.MeshPhysicalMaterial({
    color: C.pearl, roughness: 0.12, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05,
    iridescence: 1, iridescenceIOR: 1.6, iridescenceThicknessRange: [200, 600], sheen: 1, sheenColor: new THREE.Color(C.pink), transparent: true,
  });
  const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.1, 48, 48), pearlMat);
  pearl.userData.mats = mats(pearlMat);
  ringGroup.add(pearl);

  ringGroup.rotation.set(1.2, 0, -0.34);
  scene.add(ringGroup);
  bodyObjs.push(ringGroup);

  // --- tiny hearts that bloom around the orbit ---
  const miniGeo = gemHeart({ N: 16, scale: 0.17, rings: [[1, 0.1], [0.6, 0.38]], apex: 0.46 });
  const minis = [];
  const seeds = [
    [-1.75, 0.55, 0.55, 0.0, 1.0], [1.9, 0.95, 0.4, 0.17, 0.8], [-1.2, 1.55, 0.2, 0.34, 1.15],
    [1.35, -0.55, 0.8, 0.5, 0.9], [-2.05, -0.5, 0.3, 0.67, 0.75], [0.7, 1.75, 0.1, 0.84, 1.0],
  ];
  const miniColors = [C.pink, C.lavender, C.ice, C.pink, C.mint, C.lavender];
  seeds.forEach(([x, y, z, ph, sc], i) => {
    const m = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, roughness: 0.05, metalness: 0, transmission: 0.92, thickness: 0.4, ior: 1.5, transparent: true,
      attenuationColor: new THREE.Color(miniColors[i]), attenuationDistance: 0.25, clearcoat: 1,
      iridescence: 1, iridescenceIOR: 1.4, emissive: miniColors[i], emissiveIntensity: 0.18, envMapIntensity: 1.1,
    });
    const mesh = new THREE.Mesh(miniGeo, m);
    mesh.userData.mats = mats(m);
    mesh.userData.seed = { x, y, z, ph, sc };
    scene.add(mesh);
    minis.push(mesh);
    bodyObjs.push(mesh);
  });

  // --- fx layer (glow + contact shadow); separate so it can ship as its own layer ---
  const glowTex = radialTexture([[0, 'rgba(170,145,255,0.5)'], [0.3, 'rgba(170,145,255,0.16)'], [0.7, 'rgba(170,145,255,0.03)'], [1, 'rgba(170,145,255,0)']]);
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(5.4, 5.4),
    new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })
  );
  glow.position.z = -1.6;
  const shadowTex = radialTexture([[0, 'rgba(0,0,0,0.5)'], [0.6, 'rgba(0,0,0,0.12)'], [1, 'rgba(0,0,0,0)']]);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.0, 0.7),
    new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, toneMapped: false })
  );
  shadow.position.set(0, -2.05, -0.2);
  const fx = new THREE.Group();
  fx.add(glow, shadow);
  scene.add(fx);

  // ---------- timeline (all periodic in LOOP) ----------
  const env = (x, a, b) => Math.min(1, Math.max(0, (x - a) / (b - a)));
  const smooth = (x) => x * x * (3 - 2 * x);
  function setTime(t) {
    const p = (((t % LOOP) + LOOP) % LOOP) / LOOP; // 0..1
    const w = p * TAU;

    // heartbeat: two beats per loop, lub-dub (period = LOOP/2)
    const bp = (p * 2) % 1;
    const beat = Math.exp(-((bp - 0.08) ** 2) / 0.0018) + 0.55 * Math.exp(-((bp - 0.3) ** 2) / 0.003);
    const pulse = 1 + 0.038 * beat;

    heartGroup.scale.setScalar(pulse * (1 + 0.012 * Math.sin(w)));
    heartGroup.rotation.y = 0.5 * Math.sin(w); // slow showroom turn, ±29°
    heartGroup.rotation.x = 0.06 * Math.sin(w + 1.1);
    heartGroup.rotation.z = 0.045 * Math.sin(w * 2);
    heartGroup.position.y = 0.12 * Math.sin(w + 0.4);

    coreMat.emissiveIntensity = 0.8 + 0.9 * beat;
    core.scale.setScalar(1 + 0.1 * beat);
    coreHalo.material.opacity = 0.28 + 0.2 * beat;
    coreHalo.scale.setScalar(1 + 0.1 * beat);

    // ring breathes with the same float, pearl orbits once
    ringGroup.position.y = 0.12 * Math.sin(w + 0.4) * 0.6;
    ringGroup.rotation.x = 1.2 + 0.045 * Math.sin(w + 2.0);
    ringGroup.rotation.z = -0.34 + 0.05 * Math.sin(w + 0.8);
    pearl.position.set(Math.cos(w) * 1.75, Math.sin(w) * 1.75, 0);

    // tiny hearts: rise, scale up, fade; each loops once per LOOP with its own phase
    minis.forEach((m) => {
      const { x, y, z, ph, sc } = m.userData.seed;
      const q = (p + ph) % 1;
      const grow = smooth(env(q, 0, 0.22)) * (1 - smooth(env(q, 0.7, 1)));
      m.position.set(x + 0.08 * Math.sin(q * TAU + ph * 9), y + q * 0.9 - 0.35, z);
      m.scale.setScalar(Math.max(0.0001, grow * sc));
      m.rotation.set(0.2 * Math.sin(q * TAU), 0.7 * Math.sin(q * TAU + ph * 5), 0.25 * Math.sin(q * TAU + ph * 3));
      m.userData.mats.beauty.opacity = 1;
    });

    // fx
    glow.material.opacity = 0.75 + 0.25 * beat;
    glow.scale.setScalar(1 + 0.04 * beat);
    shadow.position.y = -2.05 - 0.08 * Math.sin(w + 0.4);
    shadow.scale.setScalar(1 - 0.06 * Math.sin(w + 0.4));
    shadow.material.opacity = 0.9;
  }

  // ---------- render modes ----------
  // beauty : full picture on studio backdrop (hero / landing)
  // plate  : backdrop only (for un-mixing edges)
  // mask   : white silhouette of the body (alpha)
  // body   : body on backdrop, no glow/shadow (matte source)
  // fx     : glow + shadow on transparent
  // body-only layers: heart | ring | minis
  const all = [];
  scene.traverse((o) => o.userData.mats && all.push(o));
  function setMode(mode, layer = 'all') {
    const isMask = mode === 'mask';
    scene.background = mode === 'mask' ? new THREE.Color(0x000000) : mode === 'fx' ? null : backdrop;
    all.forEach((o) => {
      o.material = isMask ? o.userData.mats.mask : o.userData.mats.beauty;
      if (isMask) o.userData.mats.mask.opacity = 1;
    });
    const showBody = mode !== 'plate' && mode !== 'fx';
    heartGroup.visible = showBody && (layer === 'all' || layer === 'heart');
    ringGroup.visible = showBody && (layer === 'all' || layer === 'ring');
    minis.forEach((m) => (m.visible = showBody && (layer === 'all' || layer === 'minis')));
    fx.visible = mode === 'fx' || (mode === 'beauty' && layer === 'all');
    // transmission needs the heart's neighbours in beauty only; ok.
  }

  function render() {
    renderer.render(scene, camera);
  }

  setTime(0);
  return { renderer, scene, camera, setTime, setMode, render, LOOP, resize: (s) => renderer.setSize(s, s, false) };
}
