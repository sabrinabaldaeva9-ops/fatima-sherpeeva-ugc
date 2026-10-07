// 10 · ORBIT HEART — Legendary hero.
// A large iridescent glass heart pierced by a rose-gold orbit, a faceted crystal floating
// inside, satellites travelling the orbit. 5-second loop, three heartbeats.
export const LOOP = 5;
export const BEATS = 3;

export function build(k) {
  const { THREE, M, TAU } = k;
  const object = new THREE.Group();

  // glass body
  const glass = new THREE.Mesh(k.puffyHeart({ width: 2.5, depth: 0.5, bevel: 0.62, size: 0.18 }), M.iridescentGlass({ atten: 0.95, thickness: 1.6, irid: 1, ior: 1.42 }));
  // floating crystal (emissive facets — nested transmission is not rendered, so it glows instead)
  const gemMat = M.glowGem(0xffc2e0, { emissive: 0xff86c4, intensity: 0.5 });
  const gem = new THREE.Mesh(k.brilliant({ r: 0.42, segs: 12 }), gemMat);
  gem.rotation.x = 0.62;

  // the orbit pierces the heart: opaque, so the glass refracts the arc that runs inside it
  const orbit = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.055, 48, 400), M.roseGold());
  const hair = new THREE.Mesh(new THREE.TorusGeometry(2.17, 0.011, 16, 400), M.champagne({ scratch: false }));
  orbit.add(ring, hair);
  orbit.rotation.set(1.22, 0, -0.32);

  // satellites: pearls + tiny crystals, integer laps per loop → seamless
  const sats = [];
  const satDefs = [[0.0, 2.06, 0.075, 'pearl', 1], [0.33, 2.3, 0.05, 'gem', 1], [0.55, 2.0, 0.045, 'gem', 2], [0.71, 2.38, 0.06, 'pearl', 1], [0.86, 2.18, 0.035, 'gem', 2]];
  satDefs.forEach(([ph, r, s, kind, laps]) => {
    const m = kind === 'pearl' ? new THREE.Mesh(new THREE.SphereGeometry(s, 32, 32), M.pearl()) : new THREE.Mesh(k.brilliant({ r: s * 1.4, segs: 8 }), M.glowGem(0xf3e6ff, { emissive: 0xc9a2ff, intensity: 0.6 }));
    m.userData = { ph, r, laps };
    orbit.add(m);
    sats.push(m);
  });

  const dust = k.stardust({ count: 240, width: 2.5, depth: 0.9, seed: 9 });
  object.add(glass, gem, orbit, dust);

  // sparkle anchors: on the glass shoulders, the tip, the orbit
  const anchor = (parent, x, y, z) => { const a = new THREE.Object3D(); a.position.set(x, y, z); parent.add(a); return a; };
  const sparks = [
    [anchor(object, -0.78, 0.86, 0.5), 0.55, 0.0],
    [anchor(object, 0.72, 0.9, 0.45), 0.42, 0.42],
    [anchor(object, 0.1, -0.98, 0.45), 0.4, 0.2],
    [anchor(object, 1.05, 0.1, 0.4), 0.34, 0.7],
    [anchor(object, -1.0, -0.05, 0.4), 0.3, 0.86],
    [anchor(orbit, -1.95, 0, 0), 0.38, 0.55],
    [anchor(orbit, 1.4, -1.36, 0), 0.3, 0.12],
    [anchor(object, 0.0, 0.05, 0.2), 0.45, 0.31],
  ];

  function update(p, beat, w) {
    const float = 0.1 * Math.sin(w + 0.4);
    object.position.y = float;
    object.rotation.set(0.05 * Math.sin(w + 1.1), 0.42 * Math.sin(w), 0.035 * Math.sin(2 * w));
    object.scale.setScalar(1 + 0.025 * beat);
    gem.rotation.y = w; // one full turn per loop
    dust.userData.update(w, beat);
    gem.position.y = 0.06 * Math.sin(2 * w);
    gemMat.emissiveIntensity = 0.4 + 0.9 * beat;
    sats.forEach((m) => {
      const { ph, r, laps } = m.userData;
      const a = (ph + p * laps) * TAU;
      m.position.set(Math.cos(a) * r, Math.sin(a) * r, 0.04 * Math.sin(3 * a));
      m.rotation.set(a, 2 * a, 0);
    });
    return float;
  }

  return { layers: { object }, update, sparks, glow: { size: 6.2 }, shadow: { y: -2.05, w: 3.0 } };
}
