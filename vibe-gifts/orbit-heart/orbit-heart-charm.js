// VIBE GIFTS · 01 ORBIT HEART — "Charm" style
// Rose-gold jewellery charm: metal bezel + jelly heart with glitter, engraved script,
// lilac satin bow, rose-gold orbit, star sparkles. Same API as orbit-heart.js, but async
// (fonts must load before the engraving is drawn).
import * as THREE from 'three';
import { heartPoints, heartGeometry, radialTexture } from './orbit-heart.js';

export const LOOP = 3;
const TAU = Math.PI * 2;

const C = {
  roseGold: 0xf2bfae,
  roseGoldDeep: 0xd99a8c,
  jelly: 0xffd6ea,
  satin: 0xc3a0ec,
  pink: 0xffb3d6,
  lilac: 0xd7c2ff,
};

const FONT_URL = new URL('../vendor/fonts/great-vibes-latin-400-normal.woff2', import.meta.url);

// ---------- helpers ----------
function seeded(seed = 7) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

function inPoly(p, poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a.y > p.y) !== (b.y > p.y) && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) c = !c;
  }
  return c;
}

// Flat strip along a polyline: the satin ribbon primitive.
// widthDir: preferred direction of the ribbon's width; widthAt(u) → width.
function ribbon(points, widthDir, widthAt, { closed = false, segs = 160 } = {}) {
  const curve = new THREE.CatmullRomCurve3(points, closed, 'centripetal');
  const pos = [], nor = [], uv = [], idx = [];
  const n = segs;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const p = curve.getPointAt(u);
    const t = curve.getTangentAt(u);
    const b = widthDir.clone().sub(t.clone().multiplyScalar(widthDir.dot(t))).normalize();
    const nn = new THREE.Vector3().crossVectors(t, b).normalize();
    const w = widthAt(u) / 2;
    // gentle satin "cup" across the width
    for (const s of [-1, 1]) {
      const q = p.clone().addScaledVector(b, s * w);
      pos.push(q.x, q.y, q.z);
      nor.push(nn.x + b.x * s * 0.18, nn.y + b.y * s * 0.18, nn.z + b.z * s * 0.18);
      uv.push(u * 6, s < 0 ? 0 : 1);
    }
    if (i < n) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.normalizeNormals();
  return g;
}

function bow(mat) {
  const g = new THREE.Group();
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const Y = V(0, 1, 0), X = V(1, 0, 0);
  // loops: flattened tubes running front → tip → back → knot (width along y)
  const loop = (s) => [V(0, 0, 0.05), V(s * 0.3, 0.1, 0.11), V(s * 0.58, 0.15, 0.08), V(s * 0.7, 0.08, 0), V(s * 0.6, 0.02, -0.08), V(s * 0.3, 0.0, -0.08), V(0, -0.01, -0.05)];
  const loopW = (u) => 0.14 + 0.13 * Math.sin(Math.PI * u);
  g.add(new THREE.Mesh(ribbon(loop(-1), Y, loopW), mat), new THREE.Mesh(ribbon(loop(1), Y, loopW), mat));
  // tails: hang down and outwards, width along x, slight twist via z wiggle
  const tail = (s) => [V(0, -0.02, 0.06), V(s * 0.12, -0.25, 0.1), V(s * 0.2, -0.55, 0.04), V(s * 0.34, -0.85, 0.1), V(s * 0.42, -1.05, 0.06)];
  const tailW = (u) => 0.17 + 0.03 * u;
  g.add(new THREE.Mesh(ribbon(tail(-1), X, tailW, { segs: 120 }), mat), new THREE.Mesh(ribbon(tail(1), X, tailW, { segs: 120 }), mat));
  // knot: a short band wrapped around the centre
  const knot = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU;
    knot.push(V(Math.cos(a) * 0.075, 0, Math.sin(a) * 0.075 + 0.02));
  }
  g.add(new THREE.Mesh(ribbon(knot, Y, () => 0.17, { closed: true, segs: 60 }), mat));
  g.children.forEach((m) => (m.userData.mats = { beauty: mat }));
  return g;
}

function starTexture(size = 256) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const h = size / 2;
  const glow = g.createRadialGradient(h, h, 0, h, h, h * 0.55);
  glow.addColorStop(0, 'rgba(255,255,255,1)');
  glow.addColorStop(0.12, 'rgba(255,230,245,0.9)');
  glow.addColorStop(0.4, 'rgba(255,170,215,0.25)');
  glow.addColorStop(1, 'rgba(255,170,215,0)');
  g.fillStyle = glow;
  g.fillRect(0, 0, size, size);
  // 4-point flare
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
  ray(0, h, size * 0.035, 1);
  ray(Math.PI / 2, h, size * 0.035, 1);
  ray(Math.PI / 4, h * 0.45, size * 0.02, 0.6);
  ray(-Math.PI / 4, h * 0.45, size * 0.02, 0.6);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function engravingTexture() {
  const size = 1024;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  g.fillStyle = '#000';
  g.fillRect(0, 0, size, size);
  g.fillStyle = '#fff';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.font = '330px "Great Vibes"';
  g.save();
  g.translate(size / 2, size * 0.47);
  g.rotate(-0.12);
  g.fillText('Vibe', 0, 0);
  g.restore();
  // hand-drawn mini heart under the word
  g.strokeStyle = '#fff';
  g.lineWidth = 9;
  g.lineCap = 'round';
  const x = size * 0.5, y = size * 0.72, s = 34;
  g.beginPath();
  g.moveTo(x, y + s * 0.9);
  g.bezierCurveTo(x - s * 1.6, y - s * 0.1, x - s * 0.7, y - s * 1.3, x, y - s * 0.35);
  g.bezierCurveTo(x + s * 0.7, y - s * 1.3, x + s * 1.6, y - s * 0.1, x, y + s * 0.9);
  g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 8;
  return t;
}

function charmEnv(renderer) {
  const s = new THREE.Scene();
  s.background = new THREE.Color(0x140a12);
  const box = (w, h, color, k, pos) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    s.add(m);
  };
  box(14, 8, 0xffffff, 5.5, [0, 9, 3]); // key
  box(3, 12, 0xffc6e2, 6.0, [-9, 1, 3]); // left, pink
  box(3, 12, 0xe2d2ff, 5.0, [9, 1, 2]); // right, lilac
  box(10, 2.2, 0xffd7c8, 3.5, [0, -3, 8]); // front fill, peach
  box(12, 3, 0xffe2cc, 4.0, [0, 2, -9]); // back rim
  box(18, 8, 0xfff0ec, 5.0, [0, -8, 3]); // floor bounce
  box(1.4, 9, 0xffffff, 9.0, [5.0, 3, 6]); // hard streaks → "wet" chrome highlights
  box(1.4, 9, 0xffffff, 7.0, [-5.0, 2, 6]);
  box(6, 0.8, 0xffffff, 8.0, [0, 5, 7]);
  box(12, 7, 0xffc0dc, 1.6, [0, 0.5, 12]); // soft pink wall behind camera: polished faces never mirror black
  const pm = new THREE.PMREMGenerator(renderer);
  const tex = pm.fromScene(s, 0.015).texture;
  pm.dispose();
  return tex;
}

function backdropTexture() {
  const size = 1024;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(size / 2, size * 0.48, 0, size / 2, size * 0.48, size * 0.72);
  gr.addColorStop(0, '#3a1d33');
  gr.addColorStop(0.45, '#170b16');
  gr.addColorStop(1, '#050306');
  g.fillStyle = gr;
  g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ---------- build ----------
export async function createOrbitHeart(canvas, { size = 1024 } = {}) {
  const font = new FontFace('Great Vibes', `url(${FONT_URL})`);
  document.fonts.add(await font.load());

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(size, size, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.environment = charmEnv(renderer);
  const backdrop = backdropTexture();
  scene.background = backdrop;

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
  camera.position.set(0, 0.55, 10.5);
  camera.lookAt(0, 0.05, 0);

  const whiteMask = () => new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, transparent: true });
  const tag = (o, beauty) => (o.userData.mats = { beauty, mask: whiteMask() });

  // ---- materials ----
  const roseGold = new THREE.MeshPhysicalMaterial({ color: C.roseGold, metalness: 1, roughness: 0.09, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.7 });
  // ring/bow/text are flagged transparent so the jelly doesn't refract them (see orbit-heart.js)
  const roseGoldT = roseGold.clone();
  roseGoldT.transparent = true;
  const jelly = new THREE.MeshPhysicalMaterial({
    color: C.jelly, metalness: 0, roughness: 0.015, transmission: 1, thickness: 0.9, ior: 1.45,
    attenuationColor: new THREE.Color(0xe58ab6), attenuationDistance: 0.95,
    clearcoat: 1, clearcoatRoughness: 0.01, iridescence: 0.35, iridescenceIOR: 1.3, specularIntensity: 1, envMapIntensity: 1.6,
  });
  const satin = new THREE.MeshPhysicalMaterial({
    color: 0x9a6ee0, roughness: 0.4, metalness: 0.0, sheen: 0.35, sheenColor: new THREE.Color(0xb98cf0), sheenRoughness: 0.5,
    anisotropy: 0.75, clearcoat: 0.25, clearcoatRoughness: 0.3, side: THREE.DoubleSide, transparent: true, envMapIntensity: 0.28, specularIntensity: 0.6,
  });

  // ---- heart charm: back plate + jelly + bezel + glitter + engraving ----
  const heartGroup = new THREE.Group();
  const plateMat = new THREE.MeshStandardMaterial({ color: 0xcf6a98, metalness: 0.5, roughness: 0.4, emissive: 0xb04a7c, emissiveIntensity: 0.3 });
  const plate = new THREE.Mesh(heartGeometry({ depth: 0.04, bevel: 0.05, size: 0.04, scale: 0.9 }), plateMat);
  plate.position.z = -0.42;
  tag(plate, plateMat);

  const jellyMesh = new THREE.Mesh(heartGeometry({ depth: 0.12, bevel: 0.3, size: 0.2, scale: 0.955 }), jelly);
  jellyMesh.position.z = 0.02;
  tag(jellyMesh, jelly);

  const outline = heartPoints(240, 2.3);
  const bezelCurve = new THREE.CatmullRomCurve3(outline.map((p) => new THREE.Vector3(p.x, p.y, -0.06)), true);
  const bezel = new THREE.Mesh(new THREE.TubeGeometry(bezelCurve, 480, 0.1, 32, true), roseGold);
  tag(bezel, roseGold);

  // glitter: tiny metallic flakes suspended in the jelly, each twinkles on its own phase
  const rnd = seeded(11);
  const inner = outline.map((p) => p.clone().multiplyScalar(0.86));
  const flakes = [];
  while (flakes.length < 1400) {
    const p = new THREE.Vector2((rnd() - 0.5) * 2.3, (rnd() - 0.5) * 2.1);
    if (inPoly(p, inner)) flakes.push({ x: p.x, y: p.y, z: -0.22 + rnd() * 0.3, s: 0.005 + rnd() ** 3 * 0.024, ph: rnd(), k: 1 + Math.floor(rnd() * 3), rx: rnd() * TAU, ry: rnd() * TAU });
  }
  const flakeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.08, emissive: 0xffb0d8, emissiveIntensity: 0.15 });
  const glitter = new THREE.InstancedMesh(new THREE.OctahedronGeometry(1, 0), flakeMat, flakes.length);
  const flakeCols = [new THREE.Color(0xffb8d8), new THREE.Color(0xf6c9b9), new THREE.Color(0xdcc6ff), new THREE.Color(0xffe8f2)];
  flakes.forEach((f, i) => glitter.setColorAt(i, flakeCols[i % 4]));
  tag(glitter, flakeMat);

  const engr = new THREE.Mesh(
    new THREE.PlaneGeometry(1.75, 1.75),
    new THREE.MeshPhysicalMaterial({ color: 0xffd9cc, metalness: 1, roughness: 0.12, emissive: 0xffc8b8, emissiveIntensity: 0.12, alphaMap: engravingTexture(), transparent: true, envMapIntensity: 2.2, depthWrite: false })
  );
  engr.position.set(0, 0.0, 0.395);
  tag(engr, engr.material);

  // satin bow tied to the upper-left lobe
  const bowGroup = bow(satin);
  bowGroup.children.forEach((m) => tag(m, satin));
  bowGroup.position.set(1.02, 0.84, 0.5);
  bowGroup.rotation.set(0.12, -0.3, -0.42);
  bowGroup.scale.setScalar(1.02);

  heartGroup.add(plate, jellyMesh, bezel, glitter, engr, bowGroup);
  scene.add(heartGroup);

  // ---- rose-gold orbit + crystal "pavé" satellite ----
  const ringGroup = new THREE.Group();
  [[1.75, 0.06], [1.98, 0.012]].forEach(([R, t]) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(R, t, 48, 360), roseGoldT);
    tag(m, roseGoldT);
    ringGroup.add(m);
  });
  const pave = new THREE.MeshPhysicalMaterial({ color: 0xf6dcff, metalness: 0, roughness: 0, transmission: 0, clearcoat: 1, iridescence: 1, iridescenceIOR: 1.8, envMapIntensity: 2.4, flatShading: true, transparent: true });
  const sat = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 1), pave);
  tag(sat, pave);
  ringGroup.add(sat);
  ringGroup.rotation.set(1.2, 0, -0.34);
  scene.add(ringGroup);

  // ---- mini puffy rose-gold hearts ----
  const miniGeo = heartGeometry({ depth: 0.05, bevel: 0.32, size: 0.2, scale: 0.16 });
  const minis = [];
  const seeds = [
    [-1.75, 0.55, 0.55, 0.0, 1.0], [1.9, 0.95, 0.4, 0.17, 0.8], [-1.2, 1.55, 0.2, 0.34, 1.1],
    [1.35, -0.55, 0.8, 0.5, 0.9], [-2.05, -0.5, 0.3, 0.67, 0.75], [0.7, 1.75, 0.1, 0.84, 1.0],
  ];
  seeds.forEach(([x, y, z, ph, sc], i) => {
    let mat = roseGoldT;
    if (!(i % 2)) {
      mat = jelly.clone();
      Object.assign(mat, { transmission: 0.85, transparent: true, thickness: 0.3, attenuationDistance: 0.4 });
    }
    const m = new THREE.Mesh(miniGeo, mat);
    tag(m, mat);
    m.userData.seed = { x, y, z, ph, sc };
    scene.add(m);
    minis.push(m);
  });

  // ---- fx: glow + shadow (under) and star sparkles (over) ----
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(5.6, 5.6),
    new THREE.MeshBasicMaterial({ map: radialTexture([[0, 'rgba(255,140,200,0.85)'], [0.3, 'rgba(255,140,200,0.3)'], [0.7, 'rgba(255,150,205,0.03)'], [1, 'rgba(255,150,205,0)']]), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })
  );
  glow.position.z = -1.6;
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.0, 0.7),
    new THREE.MeshBasicMaterial({ map: radialTexture([[0, 'rgba(0,0,0,0.5)'], [0.6, 'rgba(0,0,0,0.12)'], [1, 'rgba(0,0,0,0)']]), transparent: true, depthWrite: false, toneMapped: false })
  );
  shadow.position.set(0, -2.05, -0.2);
  const fx = new THREE.Group();
  fx.add(glow, shadow);
  scene.add(fx);

  const starMat = new THREE.SpriteMaterial({ map: starTexture(), blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, toneMapped: false, transparent: true });
  // sparkles sit on the bezel highlights, the orbit and the satellite
  const sparkSpots = [
    [-0.95, 0.72, 0.4, 0.0, 0.55], [0.86, 0.78, 0.3, 0.3, 0.45], [1.08, 0.12, 0.3, 0.62, 0.38], [-0.35, -0.6, 0.45, 0.45, 0.32],
    [0.25, -1.0, 0.3, 0.85, 0.42], [-1.1, 0.0, 0.3, 0.18, 0.3], [0.35, 0.35, 0.5, 0.72, 0.28], [-1.55, 0.38, 0.6, 0.9, 0.35],
    [-0.62, 0.95, 0.3, 0.52, 0.5], [0.0, -1.12, 0.3, 0.1, 0.36], [0.62, -0.42, 0.4, 0.38, 0.34], [-0.2, 0.55, 0.5, 0.25, 0.26],
  ];
  const sparks = sparkSpots.map(([x, y, z, ph, s]) => {
    const sp = new THREE.Sprite(starMat.clone());
    sp.userData.seed = { x, y, z, ph, s };
    scene.add(sp);
    return sp;
  });
  const satSpark = new THREE.Sprite(starMat.clone());
  scene.add(satSpark);

  // ---------- timeline ----------
  const env = (x, a, b) => Math.min(1, Math.max(0, (x - a) / (b - a)));
  const smooth = (x) => x * x * (3 - 2 * x);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), sc = new THREE.Vector3();
  const col = new THREE.Color();
  function setTime(t) {
    const p = (((t % LOOP) + LOOP) % LOOP) / LOOP;
    const w = p * TAU;
    const bp = (p * 2) % 1;
    const beat = Math.exp(-((bp - 0.08) ** 2) / 0.0018) + 0.55 * Math.exp(-((bp - 0.3) ** 2) / 0.003);

    heartGroup.scale.setScalar((1 + 0.03 * beat) * (1 + 0.01 * Math.sin(w)));
    heartGroup.rotation.set(0.06 * Math.sin(w + 1.1), 0.45 * Math.sin(w), 0.04 * Math.sin(w * 2));
    heartGroup.position.y = 0.12 * Math.sin(w + 0.4);
    // bow sways a touch behind the heart's motion
    bowGroup.rotation.z = -0.42 + 0.05 * Math.sin(w - 0.6);

    flakes.forEach((f, i) => {
      const tw = Math.max(0, Math.sin(w * f.k + f.ph * TAU)) ** 12;
      e.set(f.rx + w * (f.k % 2 ? 1 : -1), f.ry + w, 0);
      q.setFromEuler(e);
      v.set(f.x, f.y, f.z);
      sc.setScalar(f.s * (1 + 0.6 * tw));
      m4.compose(v, q, sc);
      glitter.setMatrixAt(i, m4);
      col.copy(flakeCols[i % 4]).multiplyScalar(1 + 5 * tw + 0.6 * beat);
      glitter.setColorAt(i, col);
    });
    glitter.instanceMatrix.needsUpdate = true;
    glitter.instanceColor.needsUpdate = true;

    ringGroup.position.y = 0.07 * Math.sin(w + 0.4);
    ringGroup.rotation.x = 1.2 + 0.045 * Math.sin(w + 2.0);
    ringGroup.rotation.z = -0.34 + 0.05 * Math.sin(w + 0.8);
    sat.position.set(Math.cos(w) * 1.75, Math.sin(w) * 1.75, 0);
    sat.rotation.set(w, w * 2, 0);

    minis.forEach((m) => {
      const { x, y, z, ph, sc: s } = m.userData.seed;
      const qq = (p + ph) % 1;
      const grow = smooth(env(qq, 0, 0.22)) * (1 - smooth(env(qq, 0.7, 1)));
      m.position.set(x + 0.08 * Math.sin(qq * TAU + ph * 9), y + qq * 0.9 - 0.35, z);
      m.scale.setScalar(Math.max(0.0001, grow * s));
      m.rotation.set(0.2 * Math.sin(qq * TAU), 0.7 * Math.sin(qq * TAU + ph * 5), 0.25 * Math.sin(qq * TAU + ph * 3));
    });

    // sparkles: each flashes once per loop, rotating slightly while it lives
    sparks.forEach((sp) => {
      const { x, y, z, ph, s } = sp.userData.seed;
      const qq = (p + ph) % 1;
      const life = Math.sin(Math.PI * env(qq, 0, 0.35)) ** 2;
      v.set(x, y, z).applyMatrix4(heartGroup.matrixWorld);
      sp.position.copy(v);
      sp.scale.setScalar(Math.max(0.0001, 2.4 * s * life * (1 + 0.3 * beat)));
      sp.material.rotation = qq * 0.8;
      sp.material.opacity = life;
    });
    ringGroup.updateMatrixWorld();
    sat.getWorldPosition(satSpark.position);
    satSpark.position.z += 0.15;
    const sl = 0.5 + 0.5 * Math.sin(w * 2);
    satSpark.scale.setScalar(0.22 + 0.18 * sl);
    satSpark.material.opacity = 0.5 + 0.5 * sl;

    glow.material.opacity = 0.75 + 0.25 * beat;
    glow.scale.setScalar(1 + 0.04 * beat);
    shadow.position.y = -2.05 - 0.08 * Math.sin(w + 0.4);
    shadow.scale.setScalar(1 - 0.06 * Math.sin(w + 0.4));
  }

  // ---------- render modes (as orbit-heart.js) + 'spark' (star flares, composited on top) ----------
  const all = [];
  scene.traverse((o) => o.userData.mats && all.push(o));
  function setMode(mode, layer = 'all') {
    const isMask = mode === 'mask';
    scene.background = isMask ? new THREE.Color(0) : mode === 'fx' || mode === 'spark' ? null : backdrop;
    all.forEach((o) => (o.material = isMask ? o.userData.mats.mask : o.userData.mats.beauty));
    const body = !['plate', 'fx', 'spark'].includes(mode);
    heartGroup.visible = body && (layer === 'all' || layer === 'heart');
    ringGroup.visible = body && (layer === 'all' || layer === 'ring');
    minis.forEach((m) => (m.visible = body && (layer === 'all' || layer === 'minis')));
    fx.visible = mode === 'fx' || (mode === 'beauty' && layer === 'all');
    const sv = mode === 'spark' || (mode === 'beauty' && layer === 'all');
    sparks.forEach((s) => (s.visible = sv));
    satSpark.visible = sv;
  }

  function render() {
    // sparkles follow the heart's world matrix; refresh it before the timeline reads it
    scene.updateMatrixWorld();
    renderer.render(scene, camera);
  }

  setTime(0);
  return { renderer, scene, camera, setTime: (t) => { scene.updateMatrixWorld(); setTime(t); }, setMode, render, LOOP, resize: (s) => renderer.setSize(s, s, false) };
}
