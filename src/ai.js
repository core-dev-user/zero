import { WALLS, blocked, visible, move } from "./simulation.js";
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
    lastSeen: null,
    path: [],
    nav: 0,
    shot: 1.2,
    memory: 0,
    phase: Math.random() * 6,
    ammo: 12,
    reserve: 48,
    reloading: 0,
    cover: null,
    tacticalCooldown: 0,
    kick: 0,
    stagger: 0,
    gait: 0,
  };
}
export function tickEnemy(e, player, dt, noise, onShot, others = []) {
  if (e.hp <= 0) {
    e.state = "dead";
    return;
  }
  e.kick = Math.max(0, e.kick - dt);
  e.stagger = Math.max(0, e.stagger - dt);
  e.tacticalCooldown = Math.max(0, e.tacticalCooldown - dt);
  if (e.reloading > 0) {
    e.state = "reload";
    e.reloading = Math.max(0, e.reloading - dt);
    if (e.reloading === 0) {
      const n = Math.min(12 - e.ammo, e.reserve);
      e.ammo += n;
      e.reserve -= n;
      e.cover = null;
      e.target = e.lastSeen || e.target;
      e.tacticalCooldown = 5;
    }
    return;
  }
  e.shot -= dt;
  e.nav -= dt;
  const distance = Math.hypot(player.x - e.x, player.z - e.z),
    sees = distance < 29 && visible(e, player);
  if (sees) {
    e.state = "combat";
    e.lastSeen = { x: player.x, z: player.z };
    e.target = e.lastSeen;
    e.memory = 6;
  } else if (noise && Math.hypot(noise.x - e.x, noise.z - e.z) < 22) {
    e.state = "investigate";
    e.lastSeen = { x: noise.x, z: noise.z };
    e.target = e.lastSeen;
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
  if (e.ammo === 0 && e.reserve > 0 && (!sees || !e.cover)) {
    e.reloading = 2.4;
    e.state = "reload";
    return;
  }
  if (
    sees &&
    e.tacticalCooldown === 0 &&
    (e.hp < 50 || e.ammo <= 3) &&
    !e.cover
  ) {
    e.cover = findCover(e, e.target);
    e.tacticalCooldown = 4;
  }
  if (e.cover) {
    e.state = "cover";
    e.target = e.cover;
    if (Math.hypot(e.x - e.cover.x, e.z - e.cover.z) < 0.7) {
      if (e.ammo < 12 && e.reserve > 0) {
        e.reloading = 2.4;
        e.state = "reload";
        return;
      }
      e.cover = null;
      e.tacticalCooldown = 4;
    }
  }
  if (
    sees &&
    distance < 24 &&
    e.shot <= 0 &&
    e.ammo > 0 &&
    e.stagger === 0 &&
    !e.cover
  ) {
    e.shot = 1.15 + Math.random() * 0.45;
    e.ammo--;
    e.kick = 0.13;
    onShot(e, distance);
  }
  if (e.target && (e.cover || !sees || distance > 11)) {
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

export function findCover(enemy, threat) {
  const choices = [];
  for (const w of WALLS)
    for (const [x, z] of [
      [w.x - w.w / 2 - 0.7, w.z],
      [w.x + w.w / 2 + 0.7, w.z],
      [w.x, w.z - w.d / 2 - 0.7],
      [w.x, w.z + w.d / 2 + 0.7],
    ]) {
      const p = { x, z },
        distance = Math.hypot(x - enemy.x, z - enemy.z);
      if (distance < 12 && !blocked(x, z, 0.45) && !visible(p, threat))
        choices.push({ p, distance });
    }
  choices.sort((a, b) => a.distance - b.distance);
  return choices[0]?.p || null;
}
