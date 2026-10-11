import test from "node:test";
import assert from "node:assert/strict";
import { reloadPose, smoothVelocity } from "../src/presentation.js";
import { canStand, blocked, move } from "../src/simulation.js";
import { createEnemy, tickEnemy, findCover } from "../src/ai.js";
import { visible } from "../src/simulation.js";
test("reload opens the drum, inserts rounds then closes without changing ammunition", () => {
  assert.equal(reloadPose(0, 1.65).aperture, 0);
  assert.equal(reloadPose(1.65, 1.65).aperture, 0);
  assert.equal(reloadPose(0.8, 1.65).insertion, true);
  assert.equal(reloadPose(0.8, 1.65).aperture, 1);
  assert.ok(reloadPose(0.03, 1.65).aperture < 0.2);
});
test("movement acceleration is independent of update frequency", () => {
  let a = 0,
    b = 0;
  for (let i = 0; i < 60; i++) a = smoothVelocity(a, 5, 1 / 60);
  for (let i = 0; i < 30; i++) b = smoothVelocity(b, 5, 1 / 30);
  assert.ok(Math.abs(a - b) < 1e-10);
  assert.ok(a <= 5);
  const stopped = smoothVelocity(a, 0, 0.2, 18);
  assert.ok(stopped < a * 0.1);
});
test("low ceiling blocks standing traversal but allows crouching and prevents standing up", () => {
  assert.equal(canStand(-18.5, 18), false);
  assert.equal(blocked(-18.5, 18, 0.4, 1.9), true);
  assert.equal(blocked(-18.5, 18, 0.4, 1.3), false);
  const standing = { x: -18.5, z: 21, height: 1.9 },
    crouching = { ...standing, height: 1.3 };
  move(standing, 0, -3);
  move(crouching, 0, -3);
  assert.ok(standing.z > 20);
  assert.ok(crouching.z < 19);
  assert.equal(canStand(0, 18), true);
});
test("enemy shot consumes ammo and reload uses finite reserve", () => {
  const e = createEnemy(0, 0);
  e.shot = 0;
  let shots = 0;
  tickEnemy(e, { x: 0, z: 8 }, 0.1, null, () => shots++);
  assert.equal(shots, 1);
  assert.equal(e.ammo, 11);
  e.ammo = 0;
  e.reserve = 2;
  e.reloading = 0.1;
  tickEnemy(e, { x: 0, z: 8 }, 0.2, null, () => shots++);
  assert.equal(e.ammo, 2);
  assert.equal(e.reserve, 0);
  assert.equal(shots, 1);
  e.ammo = 0;
  e.shot = 0;
  tickEnemy(e, { x: 0, z: 8 }, 1, null, () => shots++);
  assert.equal(shots, 1);
});
test("cover destinations hide from the last observed threat and remain navigable", () => {
  const threat = { x: 0, z: 8 },
    e = createEnemy(-5, 0),
    cover = findCover(e, threat);
  assert.ok(cover);
  assert.equal(blocked(cover.x, cover.z, 0.45), false);
  assert.equal(visible(cover, threat), false);
});

test("static batching preserves raycast targets and bone attachment and geometry disposal is explicit", async () => {
  const THREE = await import("three");
  const { batchStaticParts, disposeModelGeometry } = await import(
    "../src/model-batching.js"
  );
  const root = new THREE.Group(),
    bone = new THREE.Bone(),
    material = new THREE.MeshBasicMaterial();
  root.add(bone);
  const target = new THREE.Mesh(new THREE.BoxGeometry(), material);
  root.add(target);
  for (const x of [-1, 1]) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), material);
    mesh.position.x = x;
    bone.add(mesh);
  }
  batchStaticParts(root, new Set([target]));
  assert.equal(root.children.includes(target), true);
  assert.equal(bone.children.length, 1);
  assert.equal(bone.children[0].geometry.getAttribute("position").count, 72);
  let disposed = 0;
  root.traverse((o) =>
    o.geometry?.addEventListener("dispose", () => disposed++),
  );
  disposeModelGeometry(root);
  assert.equal(disposed, 2);
});

test("reload resumes investigation of last observed position without revealing hidden player", () => {
  const e = createEnemy(0, 0);
  tickEnemy(e, { x: 0, z: 8 }, 0.1, null, () => {});
  e.cover = { x: -10, z: 0 };
  e.target = e.cover;
  e.reloading = 0.1;
  e.ammo = 0;
  tickEnemy(e, { x: -12, z: 0 }, 0.2, null, () => {});
  assert.deepEqual(e.target, { x: 0, z: 8 });
  assert.equal(e.ammo, 12);
});
