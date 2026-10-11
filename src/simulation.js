import { WEAPONS, weaponById } from "./weapons.js";
export const ARENA = 44;
export const WALLS = [
  { x: -8, z: -5, w: 3, d: 14, h: 3 },
  { x: 8, z: 5, w: 3, d: 14, h: 3 },
  { x: 0, z: -12, w: 10, d: 2, h: 2.8 },
  { x: 0, z: 12, w: 10, d: 2, h: 2.8 },
  { x: -15, z: 10, w: 5, d: 4, h: 2.2 },
  { x: 15, z: -10, w: 5, d: 4, h: 2.2 },
  { x: -14, z: -15, w: 5, d: 3, h: 2.5 },
  { x: 14, z: 15, w: 5, d: 3, h: 2.5 },
];
export const WEAPON = WEAPONS[0];
export function blocked(x, z, r = 0.4) {
  if (Math.abs(x) > ARENA / 2 - r || Math.abs(z) > ARENA / 2 - r) return true;
  return WALLS.some(
    (b) =>
      x > b.x - b.w / 2 - r &&
      x < b.x + b.w / 2 + r &&
      z > b.z - b.d / 2 - r &&
      z < b.z + b.d / 2 + r,
  );
}
export function move(body, dx, dz, r = 0.4, others = []) {
  const canOccupy = (x, z) =>
    !blocked(x, z, r) &&
    others.every((o) => Math.hypot(x - o.x, z - o.z) >= r + (o.radius ?? 0.45));
  // Small swept steps prevent crossing thin walls during a delayed frame.
  const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / 0.15));
  for (let i = 0; i < steps; i++) {
    if (canOccupy(body.x + dx / steps, body.z)) body.x += dx / steps;
    if (canOccupy(body.x, body.z + dz / steps)) body.z += dz / steps;
  }
}
export function visible(a, b) {
  const dx = b.x - a.x,
    dz = b.z - a.z,
    steps = Math.ceil(Math.hypot(dx, dz) / 0.12);
  for (let i = 1; i < steps; i++)
    if (blocked(a.x + (dx * i) / steps, a.z + (dz * i) / steps, 0))
      return false;
  return true;
}
export function damageAt(distance, head = false, definition = WEAPON) {
  if (distance > definition.range) return 0;
  return Math.round(
    definition.damage *
      Math.max(0.45, 1 - Math.max(0, distance - 12) / 70) *
      (head ? 1.8 : 1),
  );
}
export function createWeapon(definition = WEAPON) {
  return {
    definition,
    ammo: definition.capacity,
    reserve: definition.reserve,
    cooldown: 0,
    reloading: 0,
  };
}
export function fire(w) {
  if (w.cooldown > 0 || w.reloading > 0 || w.ammo <= 0) return false;
  w.ammo--;
  w.cooldown = w.definition.interval;
  return true;
}
export function reload(w) {
  if (w.reloading > 0 || w.ammo === w.definition.capacity || w.reserve === 0)
    return false;
  w.reloading = w.definition.reload;
  return true;
}
export function tickWeapon(w, dt) {
  w.cooldown = Math.max(0, w.cooldown - dt);
  if (w.reloading > 0) {
    w.reloading = Math.max(0, w.reloading - dt);
    if (w.reloading === 0) {
      const n = Math.min(w.definition.capacity - w.ammo, w.reserve);
      w.ammo += n;
      w.reserve -= n;
    }
  }
}
export class Match {
  constructor() {
    this.reset();
  }
  reset() {
    this.player = { x: 0, z: 18, hp: 100, y: 1.7, vy: 0 };
    this.inventory = new Map(WEAPONS.map((def) => [def.id, createWeapon(def)]));
    this.weapon = this.inventory.get(WEAPON.id);
    this.kills = 0;
    this.time = 180;
    this.state = "playing";
  }
  equip(id) {
    if (this.state !== "playing" || !weaponById(id)) return false;
    const next = this.inventory.get(id);
    if (next !== this.weapon) this.weapon.reloading = 0;
    this.weapon = next;
    return true;
  }
  hitPlayer(n) {
    if (this.state !== "playing") return;
    this.player.hp = Math.max(0, this.player.hp - n);
    if (!this.player.hp) this.state = "lost";
  }
  kill() {
    if (this.state !== "playing") return;
    this.kills++;
    if (this.kills === 4) this.state = "won";
  }
  tick(dt) {
    if (this.state !== "playing") return;
    this.time = Math.max(0, this.time - dt);
    for (const w of this.inventory.values()) {
      if (w === this.weapon) tickWeapon(w, dt);
      else w.cooldown = Math.max(0, w.cooldown - dt);
    }
    if (!this.time) this.state = "lost";
  }
}
