import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import source from "./assets/Gun.obj?raw";

// The supplied OBJ has its barrel pointing along -X and Y as up.
// Rotation maps the bore to the camera's -Z direction without mirroring UVs.
export function createRevolver() {
  const model = new OBJLoader().parse(source);
  const gun = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({
    color: "#373b3d",
    metalness: 0.78,
    roughness: 0.38,
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
  model.traverse((part) => {
    if (!part.isMesh) return;
    part.material = metal;
    part.geometry.computeVertexNormals();
    part.castShadow = true;
    part.receiveShadow = true;
  });
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
  return { model: gun, muzzle };
}
