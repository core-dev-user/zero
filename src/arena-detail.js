import * as THREE from "three";
import { surfaceMaterial } from "./surface-materials.js";
export function detailArena(scene) {
  const yellow = new THREE.MeshStandardMaterial({
      color: "#a89448",
      roughness: 0.8,
    }),
    metal = surfaceMaterial("metal", "#575f5d");
  function box(w, h, d, x, y, z, m = metal) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }
  // Details stay within existing cover volumes or above traversal space.
  for (const side of [-1, 1]) {
    for (let i = 0; i < 5; i++)
      box(0.09, 0.008, 0.45, side * 2 + i * 0.28, 0.028, 17, yellow);
    for (const z of [-20, 20]) {
      box(7, 0.06, 0.04, side * 12, 3.25, z);
      box(0.06, 0.04, 2, side * 12, 3.3, z);
      for (let i = 0; i < 5; i++)
        box(0.16, 0.035, 0.08, side * 12 + i * 0.25, 3.25, z, yellow);
    }
  }
  const label = document.createElement("canvas");
  label.width = 512;
  label.height = 128;
  const ctx = label.getContext("2d");
  ctx.fillStyle = "#424a45";
  ctx.fillRect(0, 0, 512, 128);
  ctx.fillStyle = "#d3ceb2";
  ctx.font = "bold 48px Arial";
  ctx.fillText("PÁTIO 07", 50, 65);
  ctx.font = "16px Arial";
  ctx.fillText("ACESSO INDUSTRIAL / SETOR DE INTERVENÇÃO", 45, 105);
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 1.25),
    new THREE.MeshStandardMaterial({
      map: new THREE.CanvasTexture(label),
      roughness: 0.9,
    }),
  );
  sign.position.set(0, 2.6, -21.98);
  scene.add(sign);
  // Steel frames and warning strips decorate existing concrete barriers.
  for (const z of [-12, 12]) {
    box(10, 0.08, 0.06, 0, 2.65, z + 1.025);
    for (let i = -4; i <= 4; i++)
      box(0.25, 0.1, 0.03, i, 1.3, z + 1.027, yellow);
  }
}
