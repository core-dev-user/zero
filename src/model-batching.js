import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
// Merge static geometry per material, preserving bones and explicit raycast targets.
export function batchStaticParts(root, keep) {
  const groups = new Map();
  for (const child of [...root.children]) {
    if (child.isBone) {
      batchStaticParts(child, keep);
      continue;
    }
    if (!child.isMesh || keep.has(child)) continue;
    const material = child.material;
    if (Array.isArray(material)) continue;
    if (!groups.has(material)) groups.set(material, []);
    groups.get(material).push(child);
  }
  for (const [material, meshes] of groups) {
    if (meshes.length < 2) continue;
    const geometries = meshes.map((m) => {
      m.updateMatrix();
      const g = m.geometry.index
        ? m.geometry.toNonIndexed()
        : m.geometry.clone();
      g.applyMatrix4(m.matrix);
      return g;
    });
    const geometry = mergeGeometries(geometries, false);
    geometries.forEach((g) => g.dispose());
    if (!geometry) continue;
    const merged = new THREE.Mesh(geometry, material);
    merged.castShadow = merged.receiveShadow = true;
    root.add(merged);
    for (const m of meshes) {
      m.removeFromParent();
      m.geometry.dispose();
    }
  }
  const lines = root.children.filter((c) => c.isLine && !c.isLineSegments);
  if (lines.length > 1) {
    const positions = [];
    for (const line of lines) {
      line.updateMatrix();
      const p = line.geometry.getAttribute("position");
      for (let i = 1; i < p.count; i++) {
        for (const index of [i - 1, i]) {
          const v = new THREE.Vector3()
            .fromBufferAttribute(p, index)
            .applyMatrix4(line.matrix);
          positions.push(v.x, v.y, v.z);
        }
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    root.add(new THREE.LineSegments(geometry, lines[0].material));
    for (const line of lines) {
      line.removeFromParent();
      line.geometry.dispose();
    }
  }
}
export function disposeModelGeometry(model) {
  const geometry = new Set();
  model.traverse((o) => {
    if (o.geometry) geometry.add(o.geometry);
  });
  for (const g of geometry) g.dispose();
}
