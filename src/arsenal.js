import * as THREE from "three";
import { WEAPONS } from "./weapons.js";
export function createArsenal(getModel, onEquip, onClose) {
  const root = document.getElementById("arsenal"),
    list = document.getElementById("weapon-options"),
    canvas = document.getElementById("weapon-preview");
  let renderer,
    scene,
    camera,
    preview,
    selected = "revolver";
  for (const w of WEAPONS) {
    const b = document.createElement("button");
    b.type = "button";
    b.dataset.weapon = w.id;
    b.className = "weapon-option";
    b.innerHTML = `<strong>${w.name}</strong><small>${w.category} · GRÁTIS</small>`;
    b.onclick = () => select(w.id);
    list.append(b);
  }
  function select(id) {
    selected = id;
    const w = WEAPONS.find((w) => w.id === id);
    list.querySelectorAll("button").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.weapon === id));
    });
    document.getElementById("weapon-details").textContent =
      `${w.category} · ${w.capacity} munições · Dano ${w.damage}${w.pellets > 1 ? " × " + w.pellets : ""} · Alcance ${w.range} m · ${w.automatic ? "Automática" : "Disparo individual"} · Recarga ${w.reload} s`;
    if (!renderer) {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      scene = new THREE.Scene();
      scene.background = new THREE.Color("#19251f");
      scene.add(new THREE.HemisphereLight("#ffffff", "#6b7567", 3));
      const light = new THREE.DirectionalLight("#fff4d5", 4);
      light.position.set(2, 3, 4);
      scene.add(light);
      camera = new THREE.PerspectiveCamera(38, 2, 0.01, 20);
      camera.position.set(0.15, 0.2, 2.2);
      camera.lookAt(0, 0, 0);
    }
    if (preview) scene.remove(preview);
    preview = new THREE.Group();
    const copy = getModel(id).model.clone(true);
    copy.rotation.y = Math.PI / 2;
    copy.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(copy),
      size = bounds.getSize(new THREE.Vector3()),
      center = bounds.getCenter(new THREE.Vector3());
    copy.position.sub(center);
    preview.add(copy);
    preview.scale.setScalar(1.2 / Math.max(size.x, size.y, size.z));
    scene.add(preview);
  }
  document.getElementById("equip-weapon").onclick = () => onEquip(selected);
  document.getElementById("close-arsenal").onclick = onClose;
  return {
    open(id) {
      root.hidden = false;
      select(id);
      list.querySelector(`[data-weapon="${id}"]`).focus();
    },
    close() {
      root.hidden = true;
    },
    render(time) {
      if (root.hidden || !renderer) return;
      const w = canvas.clientWidth,
        h = canvas.clientHeight;
      if (
        canvas.width !== w * renderer.getPixelRatio() ||
        canvas.height !== h * renderer.getPixelRatio()
      ) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      preview.rotation.y = Math.sin(time * 0.00035) * 0.22;
      renderer.render(scene, camera);
    },
  };
}
