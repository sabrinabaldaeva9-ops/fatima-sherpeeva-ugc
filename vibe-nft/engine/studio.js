// VIBE NFT · Studio
// One studio for the whole collection: renderer, light rig, material library, geometry kit,
// glow / shadow / caustic layer, star sparkles, matte render modes.
// Every NFT is a small module in ./objects/ that exports { LOOP, build(kit) }.
import * as THREE from 'three';
import { mergeVertices } from './vendor/BufferGeometryUtils.js';

const TAU = Math.PI * 2;

// ───────────────────────────── palette ─────────────────────────────
export const PALETTE = {
  pearl: 0xf8f4f1,
  lavender: 0xcdbcf5,
  dustyPink: 0xe8a9c1,
  icyBlue: 0xc7e3f5,
  lilac: 0xb391e3,
  champagne: 0xe8d0a5,
  roseGold: 0xf0bba8,
  mint: 0xc4eedd,
  plum: 0x3a1830,
  nearBlack: 0x0a0609,
};

// ───────────────────────────── geometry kit ─────────────────────────────
export function heartPoints(n = 240, width = 2.3, facets = 0) {
  let p = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * TAU;
    const x = 16 * Math.sin(t) ** 3;
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    p.push(new THREE.Vector2(x, y));
  }
  // Laplacian smoothing gives the tip and cleft a real radius, so bevels never self-intersect
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

// Puffy heart: extruded outline with a deep quarter-ellipse bevel → pillow / jelly volume
export function puffyHeart({ width = 2.3, depth = 0.25, bevel = 0.45, size = 0.2, segs = 20 } = {}) {
  const shape = new THREE.Shape(heartPoints(240, width));
  let g = new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: size, bevelOffset: -size, bevelSegments: segs, curveSegments: 1,
  });
  g.deleteAttribute('uv');
  g.deleteAttribute('normal');
  g = mergeVertices(g, 1e-4);
  g.computeVertexNormals();
  g.center();
  return g;
}

// Tube that follows the heart outline: bezels, frames, wire hearts
export function heartTube({ width = 2.3, radius = 0.08, z = 0 } = {}) {
  const pts = heartPoints(240, width).map((p) => new THREE.Vector3(p.x, p.y, z));
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 480, radius, 32, true);
}

// Round-brilliant style crystal: lathe profile with few segments + flat shading = real facets
export function brilliant({ r = 0.3, segs = 10 } = {}) {
  // profile bottom → top (x = radius): culet, girdle, crown, table
  const pts = [[0, -0.62], [1.0, 0.0], [1.0, 0.06], [0.62, 0.36], [0.0001, 0.36]].map(([x, y]) => new THREE.Vector2(x * r, y * r));
  let g = new THREE.LatheGeometry(pts, segs);
  g = g.toNonIndexed();
  g.computeVertexNormals();
  return g;
}

// Flat satin-ribbon strip along a polyline (bows, threads, tags)
export function ribbon(points, widthDir, widthAt, { closed = false, segs = 160 } = {}) {
  const curve = new THREE.CatmullRomCurve3(points, closed, 'centripetal');
  const pos = [], nor = [], uv = [], idx = [];
  for (let i = 0; i <= segs; i++) {
    const u = i / segs;
    const p = curve.getPointAt(u), t = curve.getTangentAt(u);
    const b = widthDir.clone().sub(t.clone().multiplyScalar(widthDir.dot(t))).normalize();
    const nn = new THREE.Vector3().crossVectors(t, b).normalize();
    const w = widthAt(u) / 2;
    for (const s of [-1, 1]) {
      const q = p.clone().addScaledVector(b, s * w);
      pos.push(q.x, q.y, q.z);
      nor.push(nn.x + b.x * s * 0.18, nn.y + b.y * s * 0.18, nn.z + b.z * s * 0.18);
      uv.push(u * 6, s < 0 ? 0 : 1);
    }
    if (i < segs) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.normalizeNormals();
  return g;
}

export function seeded(seed = 7) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export function inPoly(p, poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a.y > p.y) !== (b.y > p.y) && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) c = !c;
  }
  return c;
}


// Stardust: twinkling metallic flakes suspended inside a heart-shaped glass volume
export function stardust(THREE, { count = 220, width = 2, depth = 0.24, seed = 3, emissive = 0xffb8dc } = {}) {
  const rnd = seeded(seed);
  const outline = heartPoints(240, width * 0.82);
  const pts = [];
  while (pts.length < count) {
    const q = new THREE.Vector2((rnd() - 0.5) * width, (rnd() - 0.5) * width);
    if (inPoly(q, outline)) pts.push({ x: q.x, y: q.y, z: (rnd() - 0.5) * depth, s: 0.006 + rnd() ** 3 * 0.016, ph: rnd(), f: 1 + Math.floor(rnd() * 3) });
  }
  const mesh = new THREE.InstancedMesh(new THREE.OctahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.1, emissive, emissiveIntensity: 0.2 }), count);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), sc = new THREE.Vector3(), col = new THREE.Color();
  mesh.userData.update = (w, beat) => {
    pts.forEach((d, i) => {
      const tw = Math.max(0, Math.sin(w * d.f + d.ph * TAU)) ** 14;
      e.set(d.ph * 9 + w * d.f, d.ph * 5 + w, 0);
      q.setFromEuler(e);
      m4.compose(v.set(d.x, d.y, d.z), q, sc.setScalar(d.s * (1 + 0.8 * tw)));
      mesh.setMatrixAt(i, m4);
      mesh.setColorAt(i, col.setScalar(1 + 5 * tw + 0.5 * beat));
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate = true;
  };
  mesh.userData.update(0, 0);
  return mesh;
}

// ───────────────────────────── timing ─────────────────────────────
export const clamp01 = (x) => Math.min(1, Math.max(0, x));
export const ramp = (x, a, b) => clamp01((x - a) / (b - a));
export const smooth = (x) => x * x * (3 - 2 * x);
// lub-dub heartbeat, `n` beats per loop, p in 0..1
export function heartbeat(p, n = 2) {
  const bp = (p * n) % 1;
  return Math.exp(-((bp - 0.08) ** 2) / 0.0018) + 0.55 * Math.exp(-((bp - 0.3) ** 2) / 0.003);
}

// ───────────────────────────── textures ─────────────────────────────
function canvasTex(size, draw, srgb = true) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function radialTexture(stops, size = 512) {
  return canvasTex(size, (g, s) => {
    const gr = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    stops.forEach(([o, c]) => gr.addColorStop(o, c));
    g.fillStyle = gr;
    g.fillRect(0, 0, s, s);
  });
}

// Micro-scratches: a roughness map (G channel) with hairline polish marks.
// Base ≈ 0.6 of the material roughness, scratches go up to 1.0 → visible only in highlights.
function scratchTexture() {
  const rnd = seeded(5);
  const t = canvasTex(1024, (g, s) => {
    g.fillStyle = 'rgb(150,150,150)';
    g.fillRect(0, 0, s, s);
    for (let i = 0; i < 900; i++) {
      const x = rnd() * s, y = rnd() * s, len = 10 + rnd() * 120, a = rnd() * TAU;
      g.strokeStyle = `rgba(255,255,255,${0.08 + rnd() * 0.3})`;
      g.lineWidth = 0.5 + rnd() * 0.9;
      g.beginPath();
      g.moveTo(x, y);
      g.quadraticCurveTo(x + Math.cos(a + 0.3) * len * 0.5, y + Math.sin(a + 0.3) * len * 0.5, x + Math.cos(a) * len, y + Math.sin(a) * len);
      g.stroke();
    }
    // fine polishing haze
    const img = g.getImageData(0, 0, s, s);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (rnd() - 0.5) * 18;
      img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
    }
    g.putImageData(img, 0, 0);
  }, false);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 1);
  return t;
}

function starTexture(size = 256) {
  return canvasTex(size, (g, s) => {
    const h = s / 2;
    const glow = g.createRadialGradient(h, h, 0, h, h, h * 0.55);
    glow.addColorStop(0, 'rgba(255,255,255,1)');
    glow.addColorStop(0.12, 'rgba(255,232,244,0.9)');
    glow.addColorStop(0.4, 'rgba(255,175,215,0.22)');
    glow.addColorStop(1, 'rgba(255,175,215,0)');
    g.fillStyle = glow;
    g.fillRect(0, 0, s, s);
    const ray = (ang, len, wid, a) => {
      g.save();
      g.translate(h, h);
      g.rotate(ang);
      const gr = g.createLinearGradient(-len, 0, len, 0);
      gr.addColorStop(0, 'rgba(255,220,240,0)');
      gr.addColorStop(0.5, `rgba(255,255,255,${a})`);
      gr.addColorStop(1, 'rgba(255,220,240,0)');
      g.fillStyle = gr;
      g.beginPath();
      g.moveTo(-len, 0);
      g.quadraticCurveTo(0, -wid, len, 0);
      g.quadraticCurveTo(0, wid, -len, 0);
      g.fill();
      g.restore();
    };
    ray(0, h, s * 0.03, 1);
    ray(Math.PI / 2, h, s * 0.03, 1);
    ray(Math.PI / 4, h * 0.42, s * 0.018, 0.55);
    ray(-Math.PI / 4, h * 0.42, s * 0.018, 0.55);
  });
}

// Brand backdrop "Velvet Night": near-black with a plum-rose halo (also what glass refracts)
function backdropTexture() {
  return canvasTex(1024, (g, s) => {
    const gr = g.createRadialGradient(s / 2, s * 0.47, 0, s / 2, s * 0.47, s * 0.74);
    gr.addColorStop(0, '#d79bb8');
    gr.addColorStop(0.1, '#a0668a');
    gr.addColorStop(0.24, '#4f2747');
    gr.addColorStop(0.5, '#1a0c17');
    gr.addColorStop(1, '#070407');
    g.fillStyle = gr;
    g.fillRect(0, 0, s, s);
  });
}

// ───────────────────────────── light rig ─────────────────────────────
// "Studio Vibe": soft-boxes baked into a PMREM environment, identical for every NFT.
function studioEnv(renderer) {
  const s = new THREE.Scene();
  s.background = new THREE.Color(0x120a10);
  const box = (w, h, color, k, pos) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    s.add(m);
  };
  box(14, 8, 0xffffff, 5.2, [0, 9, 3]); // key, overhead
  box(3, 12, 0xffc4dc, 5.5, [-9, 1, 3]); // left strip — dusty pink
  box(3, 12, 0xd8c8ff, 4.8, [9, 1, 2]); // right strip — lavender
  box(10, 2.2, 0xffd9c8, 3.2, [0, -3, 8]); // low front fill — peach
  box(12, 3, 0xffe4cf, 3.8, [0, 2, -9]); // back rim — champagne
  box(18, 8, 0xfff0ec, 4.6, [0, -8, 3]); // floor bounce
  box(12, 7, 0xffc8e0, 1.4, [0, 0.5, 12]); // wall behind camera: polished faces never mirror black
  box(1.3, 9, 0xffffff, 9.0, [5.0, 3, 6]); // hard streaks → wet-look highlights
  box(1.3, 9, 0xffffff, 7.0, [-5.0, 2, 6]);
  box(6, 0.8, 0xffffff, 8.0, [0, 5, 7]);
  const pm = new THREE.PMREMGenerator(renderer);
  const tex = pm.fromScene(s, 0.015).texture;
  pm.dispose();
  return tex;
}

// ───────────────────────────── material library ─────────────────────────────
function materialLibrary() {
  const scratches = scratchTexture();
  const P = PALETTE;
  const metal = (color, { rough = 0.12, scratch = true, transparent = false, env = 1.7 } = {}) =>
    new THREE.MeshPhysicalMaterial({
      color, metalness: 1, roughness: scratch ? rough / 0.59 : rough, roughnessMap: scratch ? scratches : null,
      clearcoat: 0.8, clearcoatRoughness: 0.04, envMapIntensity: env, transparent,
    });
  const glass = (tint, { atten = 1.6, rough = 0.02, irid = 0.6, thickness = 1.0, ior = 1.48, dispersion = 0.4 } = {}) =>
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 0, roughness: rough, transmission: 1, thickness, ior, dispersion,
      attenuationColor: new THREE.Color(tint), attenuationDistance: atten,
      iridescence: irid, iridescenceIOR: 1.35, iridescenceThicknessRange: [240, 820],
      clearcoat: 1, clearcoatRoughness: 0.01, specularIntensity: 1, envMapIntensity: 1.6,
    });
  return {
    roseGold: (o) => metal(P.roseGold, o),
    champagne: (o) => metal(P.champagne, o),
    chrome: (o) => metal(0xe9e7ee, { rough: 0.06, ...o }),
    pinkGlass: (o) => glass(0xf0a3c6, o),
    lavenderGlass: (o) => glass(0xc3a8f2, o),
    iridescentGlass: (o) => glass(0xe6cdfa, { irid: 1, atten: 2.6, ...o }),
    // emissive faceted gem — used *inside* glass (nested transmission doesn't render)
    glowGem: (color = 0xffb6d9, { emissive = 0xff7fbf, intensity = 1.0 } = {}) =>
      new THREE.MeshPhysicalMaterial({
        color, metalness: 0.2, roughness: 0.05, emissive, emissiveIntensity: intensity, clearcoat: 1,
        iridescence: 1, iridescenceIOR: 1.8, flatShading: true, envMapIntensity: 2.2,
      }),
    pearl: (o = {}) =>
      new THREE.MeshPhysicalMaterial({
        color: P.pearl, roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.05, iridescence: 1, iridescenceIOR: 1.6,
        iridescenceThicknessRange: [200, 600], sheen: 1, sheenColor: new THREE.Color(0xffd3e6), envMapIntensity: 1.3, ...o,
      }),
    satin: (color = 0x9a6ee0) =>
      new THREE.MeshPhysicalMaterial({
        color, roughness: 0.4, sheen: 0.35, sheenColor: new THREE.Color(0xb98cf0), sheenRoughness: 0.5, anisotropy: 0.75,
        clearcoat: 0.25, clearcoatRoughness: 0.3, side: THREE.DoubleSide, transparent: true, envMapIntensity: 0.28, specularIntensity: 0.6,
      }),
    enamel: (color) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.1 }),
  };
}

// ───────────────────────────── the studio ─────────────────────────────
export async function createGift(canvas, def, { size = 1024 } = {}) {
  if (def.fonts) for (const [family, url] of def.fonts) document.fonts.add(await new FontFace(family, `url(${url})`).load());

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(size, size, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.environment = studioEnv(renderer);
  const backdrop = backdropTexture();
  scene.background = backdrop;

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
  camera.position.set(0, 0.55, 10.5);
  camera.lookAt(0, 0.05, 0);

  const kit = {
    THREE, PALETTE, M: materialLibrary(), TAU,
    heartPoints, puffyHeart, heartTube, brilliant, ribbon, seeded, inPoly, ramp, smooth, heartbeat,
    stardust: (o) => stardust(THREE, o),
    // soft luminous bed placed behind a glass insert: makes jelly glow from within like the benchmark
    glowBed: (color = 0xcf6a98, emissive = 0xb04a7c, intensity = 0.3) => new THREE.MeshStandardMaterial({ color, metalness: 0.5, roughness: 0.4, emissive, emissiveIntensity: intensity }),
  };
  const obj = def.build(kit); // → { layers: {name: Object3D}, update(p, beat), sparks: [[anchor, size, phase]], glow, shadow }
  const layers = obj.layers;
  Object.values(layers).forEach((o) => scene.add(o));

  // every mesh gets a white silhouette twin for the alpha pass
  const meshes = [];
  Object.values(layers).forEach((root) =>
    root.traverse((o) => {
      if (!o.isMesh) return;
      o.userData.beauty = o.material;
      o.userData.mask = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, transparent: true });
      meshes.push(o);
    })
  );

  // fx under the object: glow + contact shadow + coloured caustic (light through glass)
  const g = obj.glow || {};
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(g.size || 5.4, g.size || 5.4),
    new THREE.MeshBasicMaterial({ map: radialTexture([[0, `rgba(${g.rgb || '255,145,200'},0.75)`], [0.3, `rgba(${g.rgb || '255,145,200'},0.26)`], [0.7, `rgba(${g.rgb || '255,145,200'},0.03)`], [1, `rgba(${g.rgb || '255,145,200'},0)`]]), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })
  );
  glow.position.set(0, g.y || 0, -1.8);
  const sh = obj.shadow || {};
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(sh.w || 2.8, (sh.w || 2.8) * 0.24),
    new THREE.MeshBasicMaterial({ map: radialTexture([[0, 'rgba(0,0,0,0.55)'], [0.6, 'rgba(0,0,0,0.12)'], [1, 'rgba(0,0,0,0)']]), transparent: true, depthWrite: false, toneMapped: false })
  );
  const caustic = new THREE.Mesh(
    new THREE.PlaneGeometry((sh.w || 2.8) * 0.5, (sh.w || 2.8) * 0.12),
    new THREE.MeshBasicMaterial({ map: radialTexture([[0, 'rgba(255,170,215,0.55)'], [0.5, 'rgba(255,170,215,0.12)'], [1, 'rgba(255,170,215,0)']]), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })
  );
  const shadowY = sh.y ?? -2.05;
  const fx = new THREE.Group();
  fx.add(glow, shadow, caustic);
  scene.add(fx);

  // star sparkles above everything (own pass)
  const starMap = starTexture();
  const sparks = (obj.sparks || []).map(([anchor, s, ph]) => {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: starMap, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, toneMapped: false, transparent: true }));
    sp.userData = { anchor, s, ph };
    scene.add(sp);
    return sp;
  });

  const LOOP = def.LOOP;
  const beatsPerLoop = def.BEATS || Math.round(LOOP / 1.5);
  const v = new THREE.Vector3();
  function setTime(t) {
    const p = (((t % LOOP) + LOOP) % LOOP) / LOOP;
    const w = p * TAU;
    const beat = heartbeat(p, beatsPerLoop);
    const float = obj.update(p, beat, w) ?? 0; // object returns its vertical float for the shadow
    scene.updateMatrixWorld(true);
    sparks.forEach((sp) => {
      const { anchor, s, ph } = sp.userData;
      const q = (p + ph) % 1;
      const life = Math.sin(Math.PI * ramp(q, 0, 0.32)) ** 2;
      anchor.getWorldPosition(v);
      sp.position.copy(v);
      sp.scale.setScalar(Math.max(0.0001, s * life * (1 + 0.25 * beat)));
      sp.material.rotation = q * 0.8;
      sp.material.opacity = life;
    });
    glow.material.opacity = 0.72 + 0.28 * beat;
    glow.scale.setScalar(1 + 0.04 * beat);
    shadow.position.set(0, shadowY - 0.6 * float, -0.3);
    shadow.scale.setScalar(1 - 0.5 * float);
    caustic.position.set(0.05, shadowY - 0.6 * float + 0.02, -0.25);
    caustic.material.opacity = 0.7 + 0.3 * beat;
  }

  // modes: beauty | body (no fx) | plate (backdrop) | mask (alpha) | fx (under) | spark (over)
  function setMode(mode, layer = 'all') {
    const isMask = mode === 'mask';
    scene.background = isMask ? new THREE.Color(0) : mode === 'fx' || mode === 'spark' ? null : backdrop;
    meshes.forEach((m) => (m.material = isMask ? m.userData.mask : m.userData.beauty));
    const body = !['plate', 'fx', 'spark'].includes(mode);
    Object.entries(layers).forEach(([name, o]) => (o.visible = body && (layer === 'all' || layer === name)));
    fx.visible = mode === 'fx' || (mode === 'beauty' && layer === 'all');
    sparks.forEach((s) => (s.visible = mode === 'spark' || (mode === 'beauty' && layer === 'all')));
  }

  setMode('beauty');
  setTime(0);
  return {
    renderer, scene, camera, LOOP, layers: Object.keys(layers),
    setTime, setMode, render: () => renderer.render(scene, camera), resize: (s) => renderer.setSize(s, s, false),
  };
}
