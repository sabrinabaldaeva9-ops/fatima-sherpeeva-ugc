// 02 · KEY TO YOU — rose-gold key with a crystal heart for a bow and a heart cut into the bit.
// The key slowly turns on its own axis (as if in a lock); the heart inside lights up when it
// faces you. 3-second loop.
export const LOOP = 3;
export const BEATS = 2;

export function build(k) {
  const { THREE, M } = k;
  const key = new THREE.Group(); // local +y = along the key, bow on top
  const tilt = new THREE.Group();
  tilt.scale.setScalar(1.22);
  tilt.rotation.z = -0.62; // diagonal: reads as "key" in a split second and fills the square
  tilt.add(key);

  const rg = M.roseGold();
  // bow: crystal heart in a rose-gold frame, with a small glowing heart inside
  const bow = new THREE.Group();
  bow.position.y = 0.9;
  const bw = 1.3;
  bow.add(new THREE.Mesh(k.heartTube({ width: bw, radius: 0.07 }), rg));
  bow.add(new THREE.Mesh(k.puffyHeart({ width: bw - 0.06, depth: 0.1, bevel: 0.24, size: 0.14 }), M.pinkGlass({ atten: 0.8, thickness: 0.6 })));
  const bed = new THREE.Mesh(k.puffyHeart({ width: bw - 0.16, depth: 0.02, bevel: 0.03, size: 0.02 }), k.glowBed());
  bed.position.z = -0.24;
  bow.add(bed, k.stardust({ count: 90, width: bw - 0.1, depth: 0.2, seed: 21 }));
  const innerMat = new THREE.MeshPhysicalMaterial({ color: 0xffc6e0, emissive: 0xff70b4, emissiveIntensity: 0.4, roughness: 0.25, clearcoat: 1, envMapIntensity: 1.4 });
  const inner = new THREE.Mesh(k.puffyHeart({ width: 0.42, depth: 0.04, bevel: 0.1, size: 0.07 }), innerMat);
  bow.add(inner);
  key.add(bow);

  // collar + crystal barrel + shaft
  const cyl = (r, h, y, mat) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 48), mat); m.position.y = y; key.add(m); return m; };
  const torus = (R, t, y) => { const m = new THREE.Mesh(new THREE.TorusGeometry(R, t, 20, 64), rg); m.rotation.x = Math.PI / 2; m.position.y = y; key.add(m); };
  torus(0.11, 0.035, 0.27);
  cyl(0.085, 0.36, 0.08, M.lavenderGlass({ atten: 0.9, thickness: 0.3, irid: 0.8 }));
  torus(0.11, 0.035, -0.11);
  cyl(0.075, 1.55, -0.88, rg);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.065, 32, 16), rg);
  tip.position.y = -1.66;
  key.add(tip);

  // bit: a plate with notches and a heart cut through it
  const s = new THREE.Shape();
  s.moveTo(0, 0); s.lineTo(0.5, 0); s.lineTo(0.5, -0.1); s.lineTo(0.38, -0.1); s.lineTo(0.38, -0.2); s.lineTo(0.5, -0.2);
  s.lineTo(0.5, -0.46); s.lineTo(0.3, -0.46); s.lineTo(0.3, -0.36); s.lineTo(0.18, -0.36); s.lineTo(0.18, -0.46); s.lineTo(0, -0.46); s.lineTo(0, 0);
  const hole = new THREE.Path(k.heartPoints(120, 0.17).map((p) => new THREE.Vector2(p.x + 0.26, p.y - 0.25)).reverse());
  s.holes.push(hole);
  const bitGeo = new THREE.ExtrudeGeometry(s, { depth: 0.07, bevelEnabled: true, bevelThickness: 0.018, bevelSize: 0.018, bevelSegments: 4, curveSegments: 24 });
  bitGeo.translate(0.04, 0, -0.035);
  const bit = new THREE.Mesh(bitGeo, rg);
  bit.position.y = -1.18;
  key.add(bit);

  const anchor = (parent, x, y, z) => { const a = new THREE.Object3D(); a.position.set(x, y, z); parent.add(a); return a; };
  const sparks = [
    [anchor(bow, -0.42, 0.42, 0.25), 0.5, 0.0],
    [anchor(bow, 0.4, 0.45, 0.2), 0.36, 0.5],
    [anchor(bow, 0.0, 0.0, 0.2), 0.42, 0.25],
    [anchor(key, 0.3, -1.2, 0.08), 0.32, 0.72],
    [anchor(key, 0.0, 0.27, 0.12), 0.26, 0.88],
    [anchor(key, 0.0, -1.66, 0.07), 0.24, 0.38],
  ];

  function update(p, beat, w) {
    const float = 0.1 * Math.sin(w + 0.4);
    tilt.position.set(-0.12, float + 0.02, 0);
    key.rotation.y = 0.85 * Math.sin(w); // slow turn, ±49°
    tilt.rotation.x = 0.05 * Math.sin(w + 1.2);
    const facing = Math.cos(key.rotation.y) ** 6; // lights when the heart faces you
    innerMat.emissiveIntensity = 0.3 + 1.6 * facing * (0.6 + 0.4 * beat);
    inner.scale.setScalar(1 + 0.08 * beat);
    return float;
  }

  return { layers: { object: tilt }, update, sparks, glow: { size: 5.2, y: 0.1 }, shadow: { y: -2.05, w: 2.4 } };
}
