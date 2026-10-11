import * as THREE from "three";
const glove = new THREE.MeshStandardMaterial({
  color: "#594c38",
  roughness: 0.9,
});
const sleeve = new THREE.MeshStandardMaterial({
  color: "#6b7359",
  roughness: 1,
});
const handGeometry = new THREE.SphereGeometry(1, 12, 8);
const skin = new THREE.MeshStandardMaterial({
  color: "#b28a67",
  roughness: 0.85,
});
function ellipsoid(parent, x, y, z, w, h, d, mat) {
  const mesh = new THREE.Mesh(handGeometry, mat);
  mesh.position.set(x, y, z);
  mesh.scale.set(w / 2, h / 2, d / 2);
  parent.add(mesh);
  return mesh;
}
function hand() {
  const root = new THREE.Group();
  ellipsoid(root, 0, 0, 0, 0.11, 0.15, 0.06, glove);
  ellipsoid(root, 0, 0.12, 0.08, 0.13, 0.22, 0.13, sleeve);
  for (let i = 0; i < 4; i++) {
    const finger = new THREE.Group();
    finger.position.set(-0.038 + i * 0.026, -0.035, -0.012);
    finger.rotation.x = 0.9;
    root.add(finger);
    ellipsoid(finger, 0, -0.035, 0, 0.022, 0.07, 0.024, glove);
    ellipsoid(finger, 0, -0.07, 0.018, 0.021, 0.036, 0.025, skin);
  }
  ellipsoid(
    root,
    -0.055,
    0.015,
    -0.008,
    0.033,
    0.085,
    0.035,
    glove,
  ).rotation.z = -0.6;
  return root;
}
export function createViewHands(parent) {
  const right = hand(),
    left = hand();
  parent.add(right, left);
  return {
    update(id, pose) {
      const revolver = id === "revolver";
      right.position.set(
        0.21,
        revolver ? -0.35 : -0.33,
        revolver ? -0.28 : -0.25,
      );
      right.rotation.set(0.55, 0, -0.2);
      left.visible = !revolver || pose.aperture > 0;
      left.position.set(
        revolver ? 0.04 : 0.12,
        -0.26 - pose.reach * 0.12,
        revolver ? -0.47 : -0.68 + pose.reach * 0.23,
      );
      left.rotation.set(0.9, 0, 0.55 + pose.reach * 0.35);
    },
  };
}
