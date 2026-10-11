import { blocked, visible, move } from "./simulation.js";
// Grid navigation routes around arena geometry; perception never bypasses walls.
function route(start, end) {
  const cell = (p) => [Math.round(p.x), Math.round(p.z)],
    key = (p) => p.join(",");
  const s = cell(start),
    e = cell(end),
    queue = [s],
    parents = new Map([[key(s), null]]);
  let found = null;
  for (let i = 0; i < queue.length; i++) {
    const p = queue[i];
    if (Math.hypot(p[0] - e[0], p[1] - e[1]) < 1.5) {
      found = p;
      break;
    }
    for (const d of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const n = [p[0] + d[0], p[1] + d[1]],
        k = key(n);
      if (!parents.has(k) && !blocked(...n, 0.48)) {
        parents.set(k, p);
        queue.push(n);
      }
    }
  }
  if (!found) return [];
  const path = [];
  while (parents.get(key(found))) {
    path.unshift({ x: found[0], z: found[1] });
    found = parents.get(key(found));
  }
  return path;
}
export function createEnemy(x, z) {
  return {
    x,
    z,
    hp: 100,
    state: "patrol",
    home: { x, z },
    target: null,
    path: [],
    nav: 0,
    shot: 1.2,
    memory: 0,
    phase: Math.random() * 6,
  };
}
export function tickEnemy(e, player, dt, noise, onShot, others = []) {
  if (e.hp <= 0) {
    e.state = "dead";
    return;
  }
  e.shot -= dt;
  e.nav -= dt;
  const distance = Math.hypot(player.x - e.x, player.z - e.z),
    sees = distance < 29 && visible(e, player);
  if (sees) {
    e.state = "combat";
    e.target = { x: player.x, z: player.z };
    e.memory = 6;
  } else if (noise && Math.hypot(noise.x - e.x, noise.z - e.z) < 22) {
    e.state = "investigate";
    e.target = { x: noise.x, z: noise.z };
    e.memory = 6;
  } else if (e.memory > 0) {
    e.memory -= dt;
    e.state = "search";
  } else {
    e.state = "patrol";
    e.phase += dt * 0.3;
    const target = {
      x: e.home.x + Math.sin(e.phase) * 3,
      z: e.home.z + Math.cos(e.phase) * 3,
    };
    if (!blocked(target.x, target.z, 0.5)) e.target = target;
  }
  if (sees && distance < 24 && e.shot <= 0) {
    e.shot = 1.15 + Math.random() * 0.45;
    onShot(e, distance);
  }
  if (e.target && (!sees || distance > 11)) {
    if (e.nav <= 0) {
      e.path = route(e, e.target);
      e.nav = 0.8;
    }
    const p = e.path[0];
    if (p) {
      const dx = p.x - e.x,
        dz = p.z - e.z,
        d = Math.hypot(dx, dz);
      if (d < 0.15) e.path.shift();
      else {
        const speed = e.state === "patrol" ? 1.2 : 2.1;
        move(e, (dx / d) * speed * dt, (dz / d) * speed * dt, 0.45, others);
      }
    }
  }
}
