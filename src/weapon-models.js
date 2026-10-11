import * as THREE from "three";
import { createRevolver } from "./revolver.js";
const metal = new THREE.MeshStandardMaterial({
  color: "#465052",
  metalness: 0.5,
  roughness: 0.4,
});
const dark = new THREE.MeshStandardMaterial({
  color: "#22292b",
  roughness: 0.7,
});
const wood = new THREE.MeshStandardMaterial({
  color: "#70503a",
  roughness: 0.85,
});
const glass = new THREE.MeshStandardMaterial({
  color: "#497d88",
  metalness: 0.45,
  roughness: 0.15,
});
function box(g, w, h, d, x, y, z, m = metal) {
  const a = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  a.position.set(x, y, z);
  g.add(a);
  return a;
}
function tube(g, r, length, x, y, z, m = metal) {
  const a = new THREE.Mesh(new THREE.CylinderGeometry(r, r, length, 16), m);
  a.rotation.x = Math.PI / 2;
  a.position.set(x, y, z);
  g.add(a);
  return a;
}
export function createWeaponModel(id) {
  if (id === "revolver") return createRevolver();
  const g = new THREE.Group(),
    x = 0.18,
    y = -0.18;
  if (id === "rifle") {
    box(g, 0.12, 0.16, 0.42, x, y, -0.48);
    box(g, 0.08, 0.24, 0.13, x, y - 0.18, -0.43, dark).rotation.x = -0.16;
    box(g, 0.11, 0.12, 0.3, x, y, -0.77, dark);
    tube(g, 0.023, 0.32, x, y, -1.08);
    box(g, 0.1, 0.16, 0.24, x, y - 0.02, -0.16, dark);
    box(g, 0.06, 0.18, 0.08, x, y - 0.16, -0.24, dark);
    box(g, 0.06, 0.035, 0.4, x, y + 0.1, -0.48, dark);
    box(g, 0.05, 0.06, 0.06, x, y + 0.135, -0.65, dark);
    return { model: g, muzzle: new THREE.Vector3(x, y, -1.24) };
  }
  if (id === "smg") {
    box(g, 0.14, 0.15, 0.3, x, y, -0.4, dark);
    box(g, 0.1, 0.22, 0.11, x, y - 0.18, -0.37);
    box(g, 0.065, 0.13, 0.08, x, y - 0.13, -0.21, dark);
    tube(g, 0.03, 0.18, x, y, -0.63);
    box(g, 0.09, 0.08, 0.21, x, y, -0.14);
    box(g, 0.055, 0.04, 0.055, x, y + 0.1, -0.52);
    return { model: g, muzzle: new THREE.Vector3(x, y, -0.72) };
  }
  if (id === "shotgun") {
    box(g, 0.12, 0.14, 0.27, x, y, -0.39);
    tube(g, 0.038, 0.64, x, y + 0.015, -0.83);
    tube(g, 0.026, 0.55, x, y - 0.065, -0.81);
    box(g, 0.14, 0.13, 0.19, x, y - 0.045, -0.68, wood);
    box(g, 0.12, 0.18, 0.24, x, y - 0.055, -0.15, wood);
    box(g, 0.065, 0.15, 0.08, x, y - 0.12, -0.26, wood);
    box(g, 0.03, 0.025, 0.025, x, y + 0.062, -1.13);
    return { model: g, muzzle: new THREE.Vector3(x, y + 0.015, -1.15) };
  }
  if (id === "sniper") {
    box(g, 0.11, 0.15, 0.36, x, y, -0.4);
    box(g, 0.13, 0.16, 0.34, x, y - 0.055, -0.15, wood);
    box(g, 0.09, 0.2, 0.1, x, y - 0.15, -0.37, dark);
    box(g, 0.11, 0.09, 0.34, x, y - 0.055, -0.74, wood);
    tube(g, 0.023, 0.6, x, y, -1.08);
    tube(g, 0.037, 0.08, x, y, -1.42);
    box(g, 0.035, 0.065, 0.04, x, y + 0.1, -0.39);
    box(g, 0.035, 0.065, 0.04, x, y + 0.1, -0.59);
    tube(g, 0.047, 0.29, x, y + 0.16, -0.49, dark);
    tube(g, 0.055, 0.012, x, y + 0.16, -0.64, glass);
    return { model: g, muzzle: new THREE.Vector3(x, y, -1.46) };
  }
  throw new Error("Unknown weapon model: " + id);
}
