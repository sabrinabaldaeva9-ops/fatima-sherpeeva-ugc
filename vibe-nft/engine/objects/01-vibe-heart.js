// 01 · VIBE HEART — designer crystal pendant.
// Pink-lavender glass heart in a rose-gold bezel, a glowing crystal floating inside with its
// own hairline orbit, a bail + jump ring + bolt clasp on top. 3-second loop, two heartbeats.
export const LOOP = 3;
export const BEATS = 2;

export function build(k) {
  const { THREE, M, TAU } = k;
  // pivot = the clasp: the pendant swings and turns around it like real jewellery
  const pendant = new THREE.Group();
  pendant.position.y = 1.5;
  const body = new THREE.Group();
  body.position.y = -1.62;
  pendant.add(body);

  const W = 2.05;
  const glass = new THREE.Mesh(k.puffyHeart({ width: W - 0.08, depth: 0.16, bevel: 0.36, size: 0.2 }), M.pinkGlass({ atten: 1.3, thickness: 0.8, irid: 0.5 }));
  const bezel = new THREE.Mesh(k.heartTube({ width: W, radius: 0.075 }), M.roseGold());
  body.add(glass, bezel);

  // floating crystal + its own tiny orbit
  const gemMat = M.glowGem(0xffd0e6, { emissive: 0xff8cc8, intensity: 0.9 });
  const gem = new THREE.Mesh(k.brilliant({ r: 0.2, segs: 10 }), gemMat);
  const mini = new THREE.Group();
  mini.add(new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.011, 12, 200), M.roseGold({ scratch: false })));
  const bead = new THREE.Mesh(new THREE.SphereGeometry(0.035, 24, 24), M.pearl());
  mini.add(bead);
  mini.rotation.set(1.15, 0.2, -0.4);
  const core = new THREE.Group();
  core.position.set(0, 0.02, 0.0);
  core.add(gem, mini);
  body.add(core);

  const dustMesh = k.stardust({ count: 260, width: W, seed: 3 });
  body.add(dustMesh);

  // clasp hardware: bail at the cleft, jump ring, bolt (spring) ring
  const rg = M.roseGold();
  const bail = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.04, 24, 64), rg);
  bail.scale.set(1, 1.35, 1);
  bail.rotation.y = Math.PI / 2;
  bail.position.set(0, 0.79, 0);
  const jump = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.032, 24, 64), rg);
  jump.position.set(0, 1.12, 0);
  body.add(bail, jump);
  const clasp = new THREE.Group();
  const gap = 0.55;
  const boltRing = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.05, 24, 96, TAU - gap), rg);
  boltRing.rotation.z = gap / 2 + 0.35; // opening sits at the right shoulder
  const lever = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 16), rg);
  lever.position.set(0.2, 0.12, 0.05);
  lever.rotation.z = -0.5;
  const tab = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.025, 16, 48), rg);
  tab.position.set(0, 0.29, 0);
  tab.rotation.y = Math.PI / 2;
  clasp.add(boltRing, lever, tab);
  clasp.position.set(0, 1.47, 0);
  body.add(clasp);

  const anchor = (x, y, z) => { const a = new THREE.Object3D(); a.position.set(x, y, z); body.add(a); return a; };
  const sparks = [
    [anchor(-0.72, 0.62, 0.3), 0.5, 0.0],
    [anchor(0.66, 0.66, 0.3), 0.38, 0.45],
    [anchor(0.05, -0.85, 0.3), 0.34, 0.22],
    [anchor(0.0, 0.0, 0.25), 0.4, 0.68],
    [anchor(0.12, 1.45, 0.15), 0.3, 0.84],
    [anchor(-0.9, 0.05, 0.25), 0.26, 0.6],
  ];

  function update(p, beat, w) {
    const float = 0.08 * Math.sin(w + 0.4);
    pendant.position.y = 1.5 + float;
    pendant.rotation.set(0.04 * Math.sin(w + 1.3), 0.5 * Math.sin(w), 0.055 * Math.sin(w + 0.9)); // turn on the ring + pendulum
    body.scale.setScalar(1 + 0.02 * beat);
    gem.rotation.y = w;
    gemMat.emissiveIntensity = 0.7 + 1.4 * beat;
    mini.rotation.z = -0.4 + w; // tiny orbit spins once per loop
    bead.position.set(Math.cos(-2 * w) * 0.36, Math.sin(-2 * w) * 0.36, 0);
    core.position.y = 0.02 + 0.04 * Math.sin(2 * w);
    dustMesh.userData.update(w, beat);
    return float;
  }

  return { layers: { object: pendant }, update, sparks, glow: { size: 5.0, y: -0.15 }, shadow: { y: -1.75, w: 2.3 } };
}
