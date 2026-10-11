import * as THREE from "three";
import "./style.css";
import { WALLS, Match, move, damageAt, fire, reload } from "./simulation.js";
import { Audio } from "./audio.js";
import { createEnemy, tickEnemy } from "./ai.js";
import { createSoldierVisual } from "./enemy-visual.js";
import { createWeaponModel } from "./weapon-models.js";
import { createArsenal } from "./arsenal.js";
const $ = (id) => document.getElementById(id);
const defaults = {
  sensitivity: 1,
  fov: 80,
  volume: 0.5,
  quality: "high",
  motion: true,
};
let settings = { ...defaults };
try {
  settings = {
    ...defaults,
    ...JSON.parse(localStorage.getItem("oz-settings") || "{}"),
  };
} catch {}
for (const [k, min, max] of [
  ["sensitivity", 0.3, 3],
  ["fov", 65, 105],
  ["volume", 0, 1],
])
  settings[k] = Math.min(
    max,
    Math.max(
      min,
      Number.isFinite(Number(settings[k])) ? Number(settings[k]) : defaults[k],
    ),
  );
const audio = new Audio(),
  match = new Match();
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas: $("game"), antialias: true });
} catch (e) {
  $("error").hidden = false;
  $("error").textContent =
    "WebGL indisponível. Use um navegador com aceleração gráfica. " + e.message;
  throw e;
}
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
const scene = new THREE.Scene();
scene.background = new THREE.Color("#8d9c9a");
scene.fog = new THREE.Fog("#8d9c9a", 28, 80);
const camera = new THREE.PerspectiveCamera(
  settings.fov,
  innerWidth / innerHeight,
  0.05,
  110,
);
camera.rotation.order = "YXZ";
scene.add(camera);
scene.add(new THREE.HemisphereLight("#d3e7e5", "#414736", 2));
const sun = new THREE.DirectionalLight("#fff0d2", 3);
sun.position.set(-18, 32, 8);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, {
  left: -30,
  right: 30,
  top: 30,
  bottom: -30,
  near: 1,
  far: 85,
});
sun.shadow.bias = -0.001;
scene.add(sun);
const materials = {
  floor: new THREE.MeshStandardMaterial({ color: "#535c54", roughness: 0.95 }),
  concrete: new THREE.MeshStandardMaterial({
    color: "#9a9c8d",
    roughness: 0.9,
  }),
  metal: new THREE.MeshStandardMaterial({
    color: "#354b48",
    metalness: 0.65,
    roughness: 0.5,
  }),
  dark: new THREE.MeshStandardMaterial({
    color: "#202b2b",
    metalness: 0.6,
    roughness: 0.45,
  }),
  wood: new THREE.MeshStandardMaterial({ color: "#625944", roughness: 0.85 }),
  lime: new THREE.MeshStandardMaterial({ color: "#becd92", roughness: 0.7 }),
  enemy: new THREE.MeshStandardMaterial({ color: "#6a7763", roughness: 0.9 }),
  red: new THREE.MeshStandardMaterial({ color: "#b05c45" }),
};
function box(w, h, d, x, y, z, mat, parent = scene) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}
const solids = [];
solids.push(box(44, 0.3, 44, 0, -0.15, 0, materials.floor));
for (const b of WALLS) {
  const m = box(
    b.w,
    b.h,
    b.d,
    b.x,
    b.h / 2,
    b.z,
    b.w === 3 ? materials.metal : materials.concrete,
  );
  solids.push(m);
  for (let x = -b.w / 2 + 0.25; x < b.w / 2; x += 1.2)
    box(
      0.05,
      b.h,
      0.03,
      b.x + x,
      b.h / 2,
      b.z + b.d / 2 + 0.025,
      materials.dark,
    );
  box(b.w + 0.12, 0.12, b.d + 0.12, b.x, b.h, b.z, materials.dark);
}
for (const [w, d, x, z] of [
  [45, 1, 0, -22.5],
  [45, 1, 0, 22.5],
  [1, 44, -22.5, 0],
  [1, 44, 22.5, 0],
])
  solids.push(box(w, 4, d, x, 2, z, materials.concrete));
// Visual details remain on walls or above traversal space; collision geometry is shared.
for (let i = -20; i <= 20; i += 4) {
  box(0.09, 0.012, 44, i, 0.012, 0, materials.dark);
  box(44, 0.012, 0.09, 0, 0.012, i, materials.dark);
}
for (const x of [-21, 21])
  for (const z of [-18, 0, 18]) {
    box(0.16, 6, 0.16, x, 3, z, materials.dark);
    const lamp = box(0.65, 0.12, 0.45, x, 5.9, z, materials.lime);
    lamp.material = new THREE.MeshStandardMaterial({
      color: "#d9e7b8",
      emissive: "#d9e7b8",
      emissiveIntensity: 2,
    });
  }
for (const x of [-16, 16]) {
  box(10, 7, 10, x, 3.5, -32, materials.metal);
  box(10, 0.3, 10, x, 7, -32, materials.dark);
}
const markings = box(5, 0.015, 3, 0, 0.02, 18, materials.lime);
markings.material = new THREE.MeshStandardMaterial({
  color: "#788262",
  transparent: true,
  opacity: 0.3,
});
const weapon = new THREE.Group();
camera.add(weapon);
const models = new Map();
function getModel(id) {
  if (!models.has(id)) models.set(id, createWeaponModel(id));
  return models.get(id);
}
let activeModel = getModel(match.weapon.definition.id);
weapon.add(activeModel.model);
const flash = new THREE.Mesh(
  new THREE.SphereGeometry(0.045, 7, 7),
  new THREE.MeshBasicMaterial({ color: "#fff2b0" }),
);
flash.position.copy(activeModel.muzzle);
weapon.add(flash);
flash.visible = false;
const muzzle = new THREE.PointLight("#ffcd70", 0, 3);
muzzle.position.copy(flash.position);
weapon.add(muzzle);
let enemies = [],
  yaw = 0,
  pitch = 0,
  paused = true,
  started = false,
  aim = false,
  trigger = false,
  recoil = 0,
  noise = null,
  flashTime = 0,
  hitTime = 0,
  damageTime = 0,
  elapsed = 0;
const keys = new Set(),
  ray = new THREE.Raycaster(),
  effects = [];
function spawnEnemies() {
  for (const e of enemies) scene.remove(e.model);
  enemies = [
    [-17, -8],
    [17, 8],
    [-4, -18],
    [17, -18],
  ].map(([x, z]) => {
    const e = createEnemy(x, z),
      g = new THREE.Group();
    g.position.set(x, 0, z);
    scene.add(g);
    e.model = g;
    const { parts, head, legs } = createSoldierVisual(g);
    e.parts = parts;
    e.legs = legs;
    for (const p of e.parts) {
      p.userData.enemy = e;
      p.userData.head = p === head;
    }
    return e;
  });
}
spawnEnemies();
function applySettings() {
  camera.fov = settings.fov;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(
    settings.quality === "high" ? Math.min(devicePixelRatio, 1.5) : 1,
  );
  renderer.shadowMap.enabled = settings.quality === "high";
  audio.volume = settings.volume;
}
applySettings();
function syncHud() {
  const p = match.player,
    w = match.weapon;
  $("health").textContent = p.hp;
  $("healthbar").style.width = p.hp + "%";
  $("weapon-name").textContent = w.definition.name;
  $("ammo").textContent = w.ammo;
  $("reserve").textContent = w.reserve;
  $("kills").textContent = match.kills;
  $("timer").textContent = `${Math.floor(Math.ceil(match.time) / 60)
    .toString()
    .padStart(
      2,
      "0",
    )}:${(Math.ceil(match.time) % 60).toString().padStart(2, "0")}`;
  $("reload-status").textContent =
    w.reloading > 0
      ? "RECARREGANDO…"
      : w.ammo === 0
        ? "PRESSIONE R PARA RECARREGAR"
        : w.definition.category + " · " + w.definition.capacity + " MUNIÇÕES";
  $("status").textContent = enemies.some((e) => e.state === "combat")
    ? "Contato hostil — procure cobertura"
    : "Patrulha ativa";
}
let arsenalOpen = false;
function equipVisual() {
  weapon.remove(activeModel.model);
  activeModel = getModel(match.weapon.definition.id);
  weapon.add(activeModel.model);
  flash.position.copy(activeModel.muzzle);
  muzzle.position.copy(flash.position);
  recoil = 0;
  flashTime = 0;
  trigger = false;
}
const arsenal = createArsenal(
  getModel,
  (id) => {
    if (match.equip(id)) {
      equipVisual();
      syncHud();
      closeArsenal();
    }
  },
  closeArsenal,
);
function openArsenal() {
  if (!started || match.state !== "playing") return;
  arsenalOpen = true;
  paused = true;
  keys.clear();
  trigger = false;
  aim = false;
  document.exitPointerLock();
  $("hud").hidden = true;
  $("menu").hidden = true;
  arsenal.open(match.weapon.definition.id);
}
async function closeArsenal() {
  if (!arsenalOpen) return;
  arsenalOpen = false;
  arsenal.close();
  await begin();
}
function showMenu(title, description, button) {
  paused = true;
  keys.clear();
  trigger = false;
  aim = false;
  document.exitPointerLock();
  $("hud").hidden = true;
  $("menu").hidden = false;
  $("menu-description").textContent = description;
  $("play").textContent = button;
  document.title = title + " — Operação Zero";
}
async function begin() {
  if (!started || match.state !== "playing") {
    match.reset();
    equipVisual();
    spawnEnemies();
    yaw = 0;
    pitch = 0;
    recoil = 0;
    effects.splice(0).forEach((e) => {
      scene.remove(e.mesh);
      e.mesh.geometry.dispose();
      e.mesh.material.dispose();
    });
    started = true;
  }
  try {
    await audio.unlock();
    await $("game").requestPointerLock();
  } catch {
    showMenu(
      "Pausado",
      "O navegador não permitiu capturar o mouse. Clique em retomar novamente.",
      "RETOMAR OPERAÇÃO",
    );
    return;
  }
  paused = false;
  $("menu").hidden = true;
  $("settings").hidden = true;
  $("hud").hidden = false;
  document.title = "Pátio 07 — Operação Zero";
  syncHud();
}
$("play").onclick = begin;
document.addEventListener("pointerlockchange", () => {
  if (
    document.pointerLockElement !== $("game") &&
    started &&
    !paused &&
    match.state === "playing"
  )
    showMenu(
      "Pausado",
      "Operação pausada. Retome quando estiver pronto.",
      "RETOMAR OPERAÇÃO",
    );
});
document.addEventListener("mousemove", (e) => {
  if (paused) return;
  yaw -= e.movementX * 0.002 * settings.sensitivity * (aim ? 0.55 : 1);
  pitch = Math.max(
    -1.35,
    Math.min(
      1.35,
      pitch - e.movementY * 0.002 * settings.sensitivity * (aim ? 0.55 : 1),
    ),
  );
});
document.addEventListener("keydown", (e) => {
  if (
    !e.repeat &&
    ((e.code === "KeyB" && started && match.state === "playing") ||
      (e.code === "Escape" && arsenalOpen))
  ) {
    e.preventDefault();
    if (arsenalOpen) closeArsenal();
    else if (!paused) openArsenal();
    return;
  }
  if (paused) return;
  if (["Space", "ControlLeft", "KeyW", "KeyS", "KeyA", "KeyD"].includes(e.code))
    e.preventDefault();
  keys.add(e.code);
  if (e.code === "KeyR" && reload(match.weapon)) audio.play("reload");
  if (e.code === "Space" && match.player.y <= 1.71 && !keys.has("ControlLeft"))
    match.player.vy = 5.6;
});
document.addEventListener("keyup", (e) => keys.delete(e.code));
document.addEventListener("mousedown", (e) => {
  if (!paused) {
    if (e.button === 0) trigger = true;
    if (e.button === 2) aim = true;
  }
});
document.addEventListener("mouseup", (e) => {
  if (e.button === 0) trigger = false;
  if (e.button === 2) aim = false;
});
document.addEventListener("contextmenu", (e) => e.preventDefault());
window.addEventListener("blur", () => {
  keys.clear();
  trigger = false;
  if (started && !paused)
    showMenu(
      "Pausado",
      "Operação pausada ao sair da janela.",
      "RETOMAR OPERAÇÃO",
    );
});
function fillSettings(s) {
  for (const k of ["sensitivity", "fov", "volume", "quality"])
    $(k).value = s[k];
  $("motion").checked = s.motion;
  for (const k of ["sensitivity", "fov", "volume"])
    $(k + "-value").textContent = $(k).value;
}
$("settings-button").onclick = () => {
  fillSettings(settings);
  $("menu").hidden = true;
  $("settings").hidden = false;
};
for (const k of ["sensitivity", "fov", "volume"])
  $(k).oninput = () => ($(k + "-value").textContent = $(k).value);
$("defaults").onclick = () => fillSettings(defaults);
$("cancel").onclick = () => {
  $("settings").hidden = true;
  $("menu").hidden = false;
};
$("apply").onclick = () => {
  for (const k of ["sensitivity", "fov", "volume"])
    settings[k] = Number($(k).value);
  settings.quality = $("quality").value;
  settings.motion = $("motion").checked;
  applySettings();
  try {
    localStorage.setItem("oz-settings", JSON.stringify(settings));
  } catch {
    $("menu-description").textContent =
      "Preferências aplicadas; armazenamento local indisponível.";
  }
  $("cancel").click();
};
function effect(from, to, color) {
  const geometry = new THREE.BufferGeometry().setFromPoints([from, to]),
    material = new THREE.LineBasicMaterial({ color });
  const mesh = new THREE.Line(geometry, material);
  scene.add(mesh);
  effects.push({ mesh, life: 0.09 });
}
function shoot() {
  if (!fire(match.weapon)) return;
  const definition = match.weapon.definition;
  if (!definition.automatic) trigger = false;
  noise = { x: match.player.x, z: match.player.z };
  audio.play("shot");
  flashTime = 0.055;
  recoil = 0.06;
  pitch = Math.min(1.35, pitch + definition.recoil);
  camera.updateMatrixWorld(true);
  for (let pellet = 0; pellet < definition.pellets; pellet++) {
    ray.setFromCamera(
      new THREE.Vector2(
        pellet === 0 ? 0 : Math.cos((pellet * Math.PI) / 3) * definition.spread,
        pellet === 0 ? 0 : Math.sin((pellet * Math.PI) / 3) * definition.spread,
      ),
      camera,
    );
    ray.far = definition.range;
    const hits = ray.intersectObjects(
      [...solids, ...enemies.filter((e) => e.hp > 0).flatMap((e) => e.parts)],
      false,
    );
    const h = hits[0],
      to = h ? h.point : ray.ray.at(definition.range, new THREE.Vector3());
    effect(flash.getWorldPosition(new THREE.Vector3()), to, "#e4dbae");
    if (h) {
      audio.play("hit");
      const e = h.object.userData.enemy;
      if (e) {
        e.hp = Math.max(
          0,
          e.hp - damageAt(h.distance, h.object.userData.head, definition),
        );
        hitTime = 0.15;
        if (!e.hp) {
          match.kill();
          e.model.rotation.z = Math.PI / 2;
          e.model.position.y = 0.33;
        }
      }
    }
  }
}
function update(dt) {
  const p = match.player;
  match.tick(dt);
  elapsed += dt;
  const crouch = keys.has("ControlLeft"),
    speed = crouch ? 2 : aim ? 3 : keys.has("ShiftLeft") ? 7 : 4.5;
  let x = Number(keys.has("KeyD")) - Number(keys.has("KeyA")),
    z = Number(keys.has("KeyW")) - Number(keys.has("KeyS"));
  const length = Math.hypot(x, z);
  if (length) {
    x /= length;
    z /= length;
    move(
      p,
      (x * Math.cos(yaw) - z * Math.sin(yaw)) * speed * dt,
      (-x * Math.sin(yaw) - z * Math.cos(yaw)) * speed * dt,
      0.4,
      enemies.filter((e) => e.hp > 0),
    );
  }
  const height = crouch ? 1.1 : 1.7;
  if (p.y > height || p.vy > 0) {
    p.vy -= 15 * dt;
    p.y += p.vy * dt;
    if (p.y < height) {
      p.y = height;
      p.vy = 0;
    }
  } else p.y = height;
  camera.position.set(p.x, p.y, p.z);
  camera.rotation.set(pitch, yaw, 0);
  camera.fov = THREE.MathUtils.lerp(
    camera.fov,
    aim ? settings.fov * 0.72 : settings.fov,
    Math.min(1, dt * 12),
  );
  camera.updateProjectionMatrix();
  recoil = Math.max(0, recoil - dt * 0.35);
  weapon.position.set(
    aim ? -0.16 : 0,
    (settings.motion && length ? Math.sin(elapsed * 10) * 0.007 : 0) -
      (match.weapon.reloading > 0
        ? 0.18 *
          Math.sin(
            (match.weapon.reloading / match.weapon.definition.reload) * Math.PI,
          )
        : 0),
    recoil,
  );
  weapon.rotation.z = match.weapon.reloading > 0 ? -0.25 : 0;
  if (trigger) shoot();
  for (const e of enemies) {
    const oldX = e.x,
      oldZ = e.z;
    tickEnemy(
      e,
      p,
      dt,
      noise,
      (enemy, distance) => {
        const source = new THREE.Vector3(enemy.x, 1.3, enemy.z),
          target = new THREE.Vector3(p.x, p.y - 0.2, p.z);
        effect(source, target, "#ffab6c");
        const relative = Math.atan2(enemy.x - p.x, enemy.z - p.z) + yaw;
        audio.play(
          "shot",
          Math.sin(relative),
          Math.max(0.08, 1 - distance / 32),
        );
        // Aim errors are explicit; damage is applied only with line of sight.
        if (Math.random() < 0.65) {
          match.hitPlayer(8);
          damageTime = 0.28;
          audio.play("hit");
        }
      },
      [
        { ...p, radius: 0.4 },
        ...enemies.filter((other) => other !== e && other.hp > 0),
      ],
    );
    if (e.hp > 0) {
      e.model.position.set(e.x, 0, e.z);
      if (e.target)
        e.model.rotation.y = Math.atan2(e.target.x - e.x, e.target.z - e.z);
      const moving = Math.hypot(e.x - oldX, e.z - oldZ) > 0.001;
      e.legs.forEach(
        (leg, i) =>
          (leg.rotation.x = moving
            ? Math.sin(elapsed * 7 + i * Math.PI) * 0.35
            : 0),
      );
    }
  }
  noise = null;
  syncHud();
  if (match.state !== "playing")
    showMenu(
      match.state === "won" ? "Vitória" : "Derrota",
      match.state === "won"
        ? "Patrulha neutralizada. Operação concluída."
        : p.hp === 0
          ? "Operador abatido. Use as coberturas e tente novamente."
          : "Tempo esgotado. A patrulha permanece ativa.",
      "REINICIAR OPERAÇÃO",
    );
}
let last = performance.now();
function frame(now) {
  arsenal.render(now);
  requestAnimationFrame(frame);
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  if (!paused) update(dt);
  else if (!started) {
    camera.position.set(19, 12, 24);
    camera.lookAt(0, 0, 0);
  }
  flashTime = Math.max(0, flashTime - dt);
  flash.visible = flashTime > 0;
  muzzle.intensity = flashTime > 0 ? 4 : 0;
  hitTime = Math.max(0, hitTime - dt);
  damageTime = Math.max(0, damageTime - dt);
  $("hitmarker").style.opacity = hitTime > 0 ? 1 : 0;
  $("damage").style.opacity = damageTime;
  for (let i = effects.length - 1; i >= 0; i--) {
    effects[i].life -= dt;
    if (effects[i].life <= 0) {
      const e = effects.splice(i, 1)[0];
      scene.remove(e.mesh);
      e.mesh.geometry.dispose();
      e.mesh.material.dispose();
    }
  }
  weapon.visible = started && !paused;
  renderer.render(scene, camera);
}
requestAnimationFrame(frame);
window.addEventListener("resize", () => {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});

// Read-only diagnostic snapshot for integration tests and development telemetry.
export function getTelemetry() {
  return {
    state: match.state,
    paused,
    player: { ...match.player },
    weapon: { ...match.weapon },
    weaponModel: activeModel.model.children.length,
    arsenalOpen,
    kills: match.kills,
    enemies: enemies.map(({ x, z, hp, state }) => ({ x, z, hp, state })),
    yaw,
    pitch,
  };
}
if (import.meta.env.DEV)
  Object.defineProperty(window, "__ozTelemetry", {
    value: getTelemetry,
    configurable: true,
  });
