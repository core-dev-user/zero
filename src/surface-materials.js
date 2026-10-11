import * as THREE from "three";
// Original deterministic procedural surfaces, no third-party textures.
function texture(kind) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const c = canvas.getContext("2d");
  let seed = 137;
  const rand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const image = c.createImageData(256, 256),
    base = kind === "metal" ? 118 : kind === "cloth" ? 132 : 145;
  for (let y = 0; y < 256; y++)
    for (let x = 0; x < 256; x++) {
      const grain = (rand() - 0.5) * (kind === "concrete" ? 40 : 22),
        weave =
          kind === "cloth"
            ? x % 4 === 0 || y % 4 === 0
              ? -18
              : 5
            : kind === "metal"
              ? Math.sin(y * 2) * 8
              : 0;
      const p = (y * 256 + x) * 4;
      for (let i = 0; i < 3; i++) image.data[p + i] = base + grain + weave;
      image.data[p + 3] = 255;
    }
  c.putImageData(image, 0, 0);
  if (kind === "concrete") {
    c.strokeStyle = "#666666";
    c.lineWidth = 0.8;
    for (let i = 0; i < 10; i++) {
      c.beginPath();
      const x = rand() * 256,
        y = rand() * 256;
      c.moveTo(x, y);
      c.lineTo(x + rand() * 40, y + rand() * 50);
      c.stroke();
    }
  }
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(kind === "concrete" ? 6 : 2, kind === "concrete" ? 6 : 2);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const cache = new Map();
export function surfaceMaterial(kind, color) {
  if (!cache.has(kind)) cache.set(kind, texture(kind));
  const map = cache.get(kind);
  return new THREE.MeshStandardMaterial({
    color,
    map,
    bumpMap: map,
    bumpScale: kind === "concrete" ? 0.025 : 0.004,
    roughness: kind === "metal" ? 0.42 : 0.9,
    metalness: kind === "metal" ? 0.55 : 0,
  });
}
