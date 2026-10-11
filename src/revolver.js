import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import source from "./assets/Gun.obj?raw";
import { surfaceMaterial } from "./surface-materials.js";

// The supplied OBJ has its barrel pointing along -X and Y as up.
// Rotation maps the bore to the camera's -Z direction without mirroring UVs.
export function createRevolver() {
  const model = new OBJLoader().parse(source);
  const gun = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({
    color: "#50595b",
    metalness: 0.5,
    roughness: 0.34,
  });
  // A PNG can be supplied later without requesting unavailable Windows paths.
  const textures = import.meta.glob("./assets/pistol.png", {
    eager: true,
    query: "?url",
    import: "default",
  });
  if (textures["./assets/pistol.png"]) {
    const texture = new THREE.TextureLoader().load(
      textures["./assets/pistol.png"],
    );
    texture.colorSpace = THREE.SRGBColorSpace;
    metal.map = texture;
    metal.color.set("#ffffff");
    metal.metalness = 0.35;
  }
  const grip = metal.map ? metal : surfaceMaterial("cloth", "#363330");
  const cylinder = new THREE.Group();
  cylinder.position.set(-0.055, 0.055, 0);
  const meshes = [];
  model.traverse((part) => {
    if (part.isMesh) meshes.push(part);
  });
  for (const part of meshes) {
    const geometry = part.geometry.index
      ? part.geometry.toNonIndexed()
      : part.geometry;
    const position = geometry.getAttribute("position");
    const buckets = { frame: [], drum: [], grip: [] };
    for (let i = 0; i < position.count; i += 3) {
      const x =
        (position.getX(i) + position.getX(i + 1) + position.getX(i + 2)) / 3;
      const y =
        (position.getY(i) + position.getY(i + 1) + position.getY(i + 2)) / 3;
      const isDrum =
        [0, 1, 2].every(
          (j) =>
            position.getX(i + j) > -0.163 &&
            position.getX(i + j) < 0.062 &&
            position.getY(i + j) > -0.025 &&
            position.getY(i + j) < 0.136,
        ) && Math.abs(y - 0.055) < 0.071;
      const key = isDrum ? "drum" : x > 0.055 && y < 0.015 ? "grip" : "frame";
      buckets[key].push(i, i + 1, i + 2);
    }
    for (const [key, indices] of Object.entries(buckets)) {
      if (!indices.length) continue;
      const g = new THREE.BufferGeometry();
      for (const [name, attribute] of Object.entries(geometry.attributes)) {
        const data = new Float32Array(indices.length * attribute.itemSize);
        indices.forEach((index, k) => {
          for (let j = 0; j < attribute.itemSize; j++)
            data[k * attribute.itemSize + j] =
              attribute.array[index * attribute.itemSize + j];
        });
        g.setAttribute(
          name,
          new THREE.BufferAttribute(data, attribute.itemSize),
        );
      }
      if (!g.hasAttribute("normal")) g.computeVertexNormals();
      if (key === "drum") g.translate(0.055, -0.055, 0);
      const mesh = new THREE.Mesh(g, key === "grip" ? grip : metal);
      mesh.castShadow = mesh.receiveShadow = true;
      (key === "drum" ? cylinder : model).add(mesh);
    }
    part.removeFromParent();
  }
  model.add(cylinder);
  const loader = new THREE.Group();
  const brass = new THREE.MeshStandardMaterial({
    color: "#baa168",
    metalness: 0.65,
    roughness: 0.4,
  });
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const round = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.01, 0.075, 10),
      brass,
    );
    round.rotation.z = Math.PI / 2;
    round.position.set(
      -0.055,
      0.055 + Math.cos(angle) * 0.038,
      Math.sin(angle) * 0.038,
    );
    loader.add(round);
  }
  model.add(loader);
  loader.visible = false;
  model.rotation.y = -Math.PI / 2;
  model.scale.setScalar(0.85);
  model.position.set(0.18, -0.18, -0.42);
  gun.add(model);
  // Exact front of the supplied barrel, in weapon-local camera coordinates.
  const muzzle = new THREE.Vector3(
    0.18,
    -0.18 + 0.108 * 0.85,
    -0.42 - 0.411832 * 0.85,
  );
  return {
    model: gun,
    muzzle,
    reloadState() {
      return {
        drumOpen: cylinder.position.z > 0.001,
        loaderVisible: loader.visible,
      };
    },
    animateReload(pose, weapon) {
      cylinder.position.z = pose.aperture * 0.105;
      cylinder.rotation.x = pose.aperture * 0.15;
      loader.visible = pose.insertion;
      if (weapon)
        loader.children.forEach(
          (round, i) =>
            (round.visible =
              i <
              Math.min(
                weapon.definition.capacity - weapon.ammo,
                weapon.reserve,
              )),
        );
      loader.position.set(0.13 * (1 - pose.progress), 0, pose.aperture * 0.105);
    },
  };
}
