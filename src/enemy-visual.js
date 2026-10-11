import * as THREE from "three";
import { batchStaticParts } from "./model-batching.js";
import { surfaceMaterial } from "./surface-materials.js";

// Presentation only: the original body/head hit volumes and leg animation
// anchors are retained. Uniform details follow the supplied soldier reference.
const mat = (color, roughness = 0.9, metalness = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });
const fabric = surfaceMaterial("cloth", "#77694b"),
  canvas = mat("#95805a"),
  seam = mat("#514631");
const skin = mat("#ba895d"),
  boot = mat("#493728"),
  steel = mat("#30332d", 0.5, 0.65);
const wood = mat("#674029"),
  eye = mat("#24221b"),
  helmet = mat("#656348");
const hitMaterial = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0,
  depthWrite: false,
});
const netMaterial = new THREE.LineBasicMaterial({ color: "#393c2b" });

function mesh(geometry, material, parent, x, y, z) {
  const m = new THREE.Mesh(geometry, material);
  m.position.set(x, y, z);
  m.castShadow = material !== hitMaterial;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}
function box(parent, w, h, d, x, y, z, material) {
  return mesh(new THREE.BoxGeometry(w, h, d), material, parent, x, y, z);
}
function rounded(parent, w, h, d, x, y, z, material) {
  const m = mesh(
    new THREE.SphereGeometry(1, 14, 10),
    material,
    parent,
    x,
    y,
    z,
  );
  m.scale.set(w / 2, h / 2, d / 2);
  return m;
}
function netLine(parent, points) {
  parent.add(
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      netMaterial,
    ),
  );
}

export function createSoldierVisual(group) {
  const body = box(group, 0.65, 0.85, 0.38, 0, 1.2, 0, hitMaterial);
  const vest = box(group, 0.68, 0.45, 0.43, 0, 1.2, 0, hitMaterial);
  rounded(group, 0.66, 0.87, 0.41, 0, 1.21, 0, fabric);
  rounded(group, 0.56, 0.28, 0.39, 0, 0.83, 0, fabric);
  // Open jacket collar, shirt, seams and diagonal equipment sling.
  box(group, 0.18, 0.35, 0.035, 0, 1.45, 0.185, seam);
  for (const side of [-1, 1]) {
    const collar = box(
      group,
      0.16,
      0.25,
      0.05,
      side * 0.115,
      1.53,
      0.205,
      canvas,
    );
    collar.rotation.z = side * 0.4;
    box(group, 0.015, 0.51, 0.02, side * 0.17, 1.12, 0.203, seam);
    box(group, 0.15, 0.15, 0.065, side * 0.19, 1.36, 0.195, fabric);
    box(group, 0.16, 0.035, 0.073, side * 0.19, 1.425, 0.205, canvas);
  }
  const sling = box(group, 0.075, 0.85, 0.035, 0.04, 1.21, 0.252, boot);
  sling.rotation.z = -0.45;
  box(group, 0.64, 0.075, 0.42, 0, 0.91, 0, boot);
  box(group, 0.1, 0.08, 0.028, 0, 0.91, 0.224, steel);
  for (const x of [-0.27, 0.2]) {
    rounded(group, 0.22, 0.28, 0.14, x, 1.04, 0.26, canvas);
    box(group, 0.22, 0.05, 0.13, x, 1.17, 0.27, canvas);
    box(group, 0.035, 0.16, 0.02, x, 1.06, 0.338, seam);
    rounded(group, 0.035, 0.035, 0.018, x, 1.15, 0.341, steel);
  }
  rounded(group, 0.4, 0.45, 0.18, 0, 1.18, -0.25, canvas);
  for (const x of [-0.24, 0.24])
    box(group, 0.055, 0.62, 0.026, x, 1.28, -0.2, boot);

  const head = mesh(
    new THREE.SphereGeometry(0.19, 12, 10),
    skin,
    group,
    0,
    1.86,
    0,
  );
  rounded(group, 0.17, 0.17, 0.15, 0, 1.69, 0, skin);
  rounded(group, 0.07, 0.09, 0.065, 0, 1.86, 0.178, skin);
  for (const x of [-0.07, 0.07]) {
    rounded(group, 0.048, 0.025, 0.023, x, 1.905, 0.173, eye);
    box(group, 0.07, 0.014, 0.018, x, 1.932, 0.166, boot);
    rounded(group, 0.065, 0.11, 0.08, Math.sign(x) * 0.18, 1.85, 0, skin);
  }
  box(group, 0.075, 0.012, 0.018, 0, 1.795, 0.169, boot);
  // Dome, rolled rim, chin straps and visible helmet netting.
  const dome = mesh(
    new THREE.SphereGeometry(0.235, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    helmet,
    group,
    0,
    1.965,
    0,
  );
  dome.scale.set(1, 0.85, 1.06);
  const rim = mesh(
    new THREE.TorusGeometry(0.232, 0.014, 6, 32),
    helmet,
    group,
    0,
    1.965,
    0,
  );
  rim.rotation.x = Math.PI / 2;
  rim.scale.y = 1.06;
  for (const x of [-0.176, 0.176])
    box(group, 0.018, 0.24, 0.018, x, 1.78, 0.035, boot);
  for (let j = 0; j < 12; j++) {
    const a = (j * Math.PI * 2) / 12,
      points = [];
    for (let i = 0; i <= 12; i++) {
      const t = (i * Math.PI) / 24;
      points.push(
        new THREE.Vector3(
          0.239 * Math.sin(t) * Math.cos(a),
          1.965 + 0.203 * Math.cos(t),
          0.253 * Math.sin(t) * Math.sin(a),
        ),
      );
    }
    netLine(group, points);
  }
  for (let j = 1; j <= 5; j++) {
    const t = (j * Math.PI) / 12,
      points = [];
    for (let i = 0; i <= 32; i++) {
      const a = (i * Math.PI * 2) / 32;
      points.push(
        new THREE.Vector3(
          0.239 * Math.sin(t) * Math.cos(a),
          1.965 + 0.203 * Math.cos(t),
          0.253 * Math.sin(t) * Math.sin(a),
        ),
      );
    }
    netLine(group, points);
  }

  const arms = [];
  const legs = [-0.18, 0.18].map((x) => {
    const anchor = new THREE.Bone();
    anchor.position.set(x, 0.82, 0);
    group.add(anchor);
    box(anchor, 0.2, 0.65, 0.23, 0, -0.39, 0, hitMaterial);
    rounded(anchor, 0.25, 0.59, 0.28, 0, -0.32, 0, fabric);
    rounded(anchor, 0.21, 0.26, 0.23, 0, -0.61, 0.025, canvas);
    rounded(anchor, 0.23, 0.21, 0.33, 0, -0.71, 0.065, boot);
    for (let i = 0; i < 4; i++)
      box(anchor, 0.12, 0.012, 0.014, 0, -0.64 - i * 0.026, 0.188, canvas);
    return anchor;
  });
  for (const side of [-1, 1]) {
    const arm = new THREE.Bone();
    arm.position.set(side * 0.37, 1.38, 0.05);
    arm.rotation.x = -0.45;
    group.add(arm);
    arms.push(arm);
    rounded(arm, 0.2, 0.55, 0.23, 0, -0.16, 0, fabric);
    rounded(arm, 0.14, 0.13, 0.14, 0, -0.43, 0.015, skin);
    box(arm, 0.18, 0.05, 0.21, 0, -0.36, 0, canvas);
    if (side === 1) {
      box(arm, 0.09, 0.13, 0.012, 0.1, 0.005, 0, canvas);
      const stripe = box(arm, 0.055, 0.014, 0.014, 0.107, 0.01, 0.005, seam);
      stripe.rotation.z = 0.5;
    }
  }
  // Distinct wood-and-steel service rifle, keeping the existing combat pose.
  box(group, 0.09, 0.1, 0.7, 0.25, 1.3, 0.38, wood);
  box(group, 0.065, 0.075, 0.38, 0.25, 1.35, 0.5, steel);
  box(group, 0.035, 0.035, 0.42, 0.25, 1.34, 0.91, steel);
  box(group, 0.06, 0.055, 0.075, 0.25, 1.36, 1.125, steel);
  const stock = box(group, 0.1, 0.16, 0.26, 0.25, 1.265, -0.04, wood);
  stock.rotation.x = -0.12;
  box(group, 0.065, 0.16, 0.09, 0.25, 1.2, 0.35, steel);
  const muzzle = new THREE.Object3D();
  muzzle.position.set(0.25, 1.34, 1.165);
  group.add(muzzle);
  const flash = new THREE.Mesh(
    new THREE.SphereGeometry(0.032, 6, 6),
    new THREE.MeshBasicMaterial({ color: "#fff2bd" }),
  );
  muzzle.add(flash);
  flash.visible = false;
  batchStaticParts(group, new Set([body, vest, head]));
  return { parts: [body, vest, head], head, legs, arms, muzzle, flash };
}
