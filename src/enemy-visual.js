import * as THREE from "three";

// Presentation only: the original body/head hit volumes and leg animation
// anchors are retained. Uniform details follow the supplied soldier reference.
const mat = (color, roughness = .9, metalness = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });
const fabric = mat("#77694b"), canvas = mat("#95805a"), seam = mat("#514631");
const skin = mat("#ba895d"), boot = mat("#493728"), steel = mat("#30332d", .5, .65);
const wood = mat("#674029"), eye = mat("#24221b"), helmet = mat("#656348");
const hitMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
const netMaterial = new THREE.LineBasicMaterial({ color: "#393c2b" });

function mesh(geometry, material, parent, x, y, z) {
  const m = new THREE.Mesh(geometry, material);
  m.position.set(x, y, z); m.castShadow = material !== hitMaterial;
  m.receiveShadow = true; parent.add(m); return m;
}
function box(parent, w, h, d, x, y, z, material) {
  return mesh(new THREE.BoxGeometry(w, h, d), material, parent, x, y, z);
}
function rounded(parent, w, h, d, x, y, z, material) {
  const m = mesh(new THREE.SphereGeometry(1, 14, 10), material, parent, x, y, z);
  m.scale.set(w / 2, h / 2, d / 2); return m;
}
function netLine(parent, points) {
  parent.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), netMaterial));
}

export function createSoldierVisual(group) {
  const body = box(group, .65, .85, .38, 0, 1.2, 0, hitMaterial);
  const vest = box(group, .68, .45, .43, 0, 1.2, 0, hitMaterial);
  rounded(group, .66, .87, .41, 0, 1.21, 0, fabric);
  rounded(group, .56, .28, .39, 0, .83, 0, fabric);
  // Open jacket collar, shirt, seams and diagonal equipment sling.
  box(group, .18, .35, .035, 0, 1.45, .185, seam);
  for (const side of [-1, 1]) {
    const collar = box(group, .16, .25, .05, side * .115, 1.53, .205, canvas);
    collar.rotation.z = side * .4;
    box(group, .015, .51, .02, side * .17, 1.12, .203, seam);
    box(group, .15, .15, .065, side * .19, 1.36, .195, fabric);
    box(group, .16, .035, .073, side * .19, 1.425, .205, canvas);
  }
  const sling = box(group, .075, .85, .035, .04, 1.21, .252, boot);
  sling.rotation.z = -.45;
  box(group, .64, .075, .42, 0, .91, 0, boot);
  box(group, .1, .08, .028, 0, .91, .224, steel);
  for (const x of [-.27, .2]) {
    rounded(group, .22, .28, .14, x, 1.04, .26, canvas);
    box(group, .22, .05, .13, x, 1.17, .27, canvas);
    box(group, .035, .16, .02, x, 1.06, .338, seam);
    rounded(group, .035, .035, .018, x, 1.15, .341, steel);
  }
  rounded(group, .4, .45, .18, 0, 1.18, -.25, canvas);
  for (const x of [-.24, .24]) box(group, .055, .62, .026, x, 1.28, -.2, boot);

  const head = mesh(new THREE.SphereGeometry(.19, 12, 10), skin, group, 0, 1.86, 0);
  rounded(group, .17, .17, .15, 0, 1.69, 0, skin);
  rounded(group, .07, .09, .065, 0, 1.86, .178, skin);
  for (const x of [-.07, .07]) {
    rounded(group, .048, .025, .023, x, 1.905, .173, eye);
    box(group, .07, .014, .018, x, 1.932, .166, boot);
    rounded(group, .065, .11, .08, Math.sign(x) * .18, 1.85, 0, skin);
  }
  box(group, .075, .012, .018, 0, 1.795, .169, boot);
  // Dome, rolled rim, chin straps and visible helmet netting.
  const dome = mesh(new THREE.SphereGeometry(.235, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), helmet, group, 0, 1.965, 0);
  dome.scale.set(1, .85, 1.06);
  const rim = mesh(new THREE.TorusGeometry(.232, .014, 6, 32), helmet, group, 0, 1.965, 0);
  rim.rotation.x = Math.PI / 2; rim.scale.y = 1.06;
  for (const x of [-.176, .176]) box(group, .018, .24, .018, x, 1.78, .035, boot);
  for (let j = 0; j < 12; j++) {
    const a = j * Math.PI * 2 / 12, points = [];
    for (let i = 0; i <= 12; i++) {
      const t = i * Math.PI / 24;
      points.push(new THREE.Vector3(.239 * Math.sin(t) * Math.cos(a), 1.965 + .203 * Math.cos(t), .253 * Math.sin(t) * Math.sin(a)));
    }
    netLine(group, points);
  }
  for (let j = 1; j <= 5; j++) {
    const t = j * Math.PI / 12, points = [];
    for (let i = 0; i <= 32; i++) {
      const a = i * Math.PI * 2 / 32;
      points.push(new THREE.Vector3(.239 * Math.sin(t) * Math.cos(a), 1.965 + .203 * Math.cos(t), .253 * Math.sin(t) * Math.sin(a)));
    }
    netLine(group, points);
  }

  const legs = [-.18, .18].map(x => {
    const anchor = box(group, .2, .65, .23, x, .43, 0, hitMaterial);
    rounded(anchor, .25, .59, .28, 0, .07, 0, fabric);
    rounded(anchor, .21, .26, .23, 0, -.22, .025, canvas);
    rounded(anchor, .23, .21, .33, 0, -.32, .065, boot);
    for (let i = 0; i < 4; i++) box(anchor, .12, .012, .014, 0, -.25 - i * .026, .188, canvas);
    return anchor;
  });
  for (const side of [-1, 1]) {
    const arm = new THREE.Group(); arm.position.set(side * .37, 1.38, .05);
    arm.rotation.x = -.45; group.add(arm);
    rounded(arm, .2, .55, .23, 0, -.16, 0, fabric);
    rounded(arm, .14, .13, .14, 0, -.43, .015, skin);
    box(arm, .18, .05, .21, 0, -.36, 0, canvas);
    if (side === 1) {
      box(arm, .09, .13, .012, .1, .005, 0, canvas);
      const stripe = box(arm, .055, .014, .014, .107, .01, .005, seam);
      stripe.rotation.z = .5;
    }
  }
  // Distinct wood-and-steel service rifle, keeping the existing combat pose.
  box(group, .09, .1, .7, .25, 1.3, .38, wood);
  box(group, .065, .075, .38, .25, 1.35, .5, steel);
  box(group, .035, .035, .42, .25, 1.34, .91, steel);
  box(group, .06, .055, .075, .25, 1.36, 1.125, steel);
  const stock = box(group, .1, .16, .26, .25, 1.265, -.04, wood);
  stock.rotation.x = -.12;
  box(group, .065, .16, .09, .25, 1.2, .35, steel);
  return { parts: [body, vest, head], head, legs };
}
