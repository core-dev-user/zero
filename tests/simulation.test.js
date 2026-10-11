import test from "node:test";
import assert from "node:assert/strict";
import {
  Match,
  WEAPON,
  createWeapon,
  fire,
  reload,
  tickWeapon,
  damageAt,
  move,
  visible,
  blocked,
} from "../src/simulation.js";
import { createEnemy, tickEnemy } from "../src/ai.js";
test("fire consumes ammo and enforces cadence and reload exclusion", () => {
  const w = createWeapon();
  assert.ok(fire(w));
  assert.equal(w.ammo, WEAPON.capacity - 1);
  assert.equal(fire(w), false);
  tickWeapon(w, WEAPON.interval + 0.01);
  assert.ok(reload(w));
  assert.equal(fire(w), false);
});
test("reload transfers finite reserve without creating ammunition", () => {
  const w = createWeapon();
  w.ammo = 2;
  w.reserve = 5;
  assert.ok(reload(w));
  tickWeapon(w, 1);
  assert.equal(w.ammo, 2);
  tickWeapon(w, 1);
  assert.equal(w.ammo, 6);
  assert.equal(w.reserve, 1);
  assert.equal(reload(w), false);
});
test("empty weapon cannot fire and full magazine cannot reload", () => {
  const w = createWeapon();
  assert.equal(reload(w), false);
  w.ammo = 0;
  assert.equal(fire(w), false);
});
test("damage falls with range and head hits differ", () => {
  assert.equal(damageAt(5), 34);
  assert.ok(damageAt(40) < damageAt(5));
  assert.ok(damageAt(5, true) > damageAt(5));
  assert.equal(damageAt(WEAPON.range + 1), 0);
});
test("swept movement cannot tunnel through cover or arena boundary", () => {
  const p = { x: -12, z: 0 };
  move(p, 12, 0);
  assert.ok(p.x < -9.8);
  assert.equal(blocked(p.x, p.z), false);
  const q = { x: 0, z: 18 };
  move(q, 0, 40);
  assert.ok(q.z <= 21.6);
});
test("walls occlude visibility", () => {
  assert.equal(visible({ x: -12, z: 0 }, { x: 0, z: 0 }), false);
  assert.equal(visible({ x: 0, z: 0 }, { x: 0, z: 5 }), true);
});
test("enemy does not shoot through walls, hears nearby fire, navigates around cover", () => {
  const e = createEnemy(-12, 0),
    p = { x: 0, z: 0 };
  let shots = 0;
  tickEnemy(e, p, 0.1, { x: 0, z: 0 }, () => shots++);
  assert.equal(e.state, "investigate");
  assert.equal(shots, 0);
  for (let i = 0; i < 150; i++) {
    tickEnemy(e, p, 0.05, null, () => shots++);
    assert.equal(blocked(e.x, e.z, 0.4), false);
  }
  assert.ok(e.path.length || e.state === "combat");
});
test("visible enemies engage and dead enemies stop firing", () => {
  const e = createEnemy(0, 0);
  let shots = 0;
  tickEnemy(e, { x: 0, z: 8 }, 2, null, () => shots++);
  assert.equal(e.state, "combat");
  assert.equal(shots, 1);
  e.hp = 0;
  tickEnemy(e, { x: 0, z: 8 }, 2, null, () => shots++);
  assert.equal(e.state, "dead");
  assert.equal(shots, 1);
});
test("victory, defeat and restart obey match lifecycle", () => {
  const m = new Match();
  for (let i = 0; i < 4; i++) m.kill();
  assert.equal(m.state, "won");
  m.hitPlayer(100);
  assert.equal(m.player.hp, 100);
  m.reset();
  m.hitPlayer(100);
  assert.equal(m.state, "lost");
  m.reset();
  m.tick(180);
  assert.equal(m.state, "lost");
  m.reset();
  assert.equal(m.kills, 0);
  assert.equal(m.player.hp, 100);
  assert.equal(m.weapon.ammo, WEAPON.capacity);
});

test("moving actors cannot pass through a live actor", () => {
  const p = { x: 0, z: 0 };
  move(p, 0, 10, 0.4, [{ x: 0, z: 2, radius: 0.45 }]);
  assert.ok(p.z <= 1.15);
});
