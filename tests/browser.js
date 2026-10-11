import { chromium } from "playwright";
import assert from "node:assert/strict";
import { visible } from "../src/simulation.js";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: [
    "--no-sandbox",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
try {
  const page = await browser.newPage({
      viewport: { width: 1280, height: 800 },
    }),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:5173");
  await page.waitForTimeout(800);
  await page.locator("#settings-button").click();
  await page.locator("#sensitivity").fill("1.8");
  await page.locator("#quality").selectOption("low");
  await page.locator("#apply").click();
  assert.equal(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("oz-settings")).sensitivity,
    ),
    1.8,
  );
  await page.reload();
  await page.locator("#settings-button").click();
  assert.equal(await page.locator("#sensitivity").inputValue(), "1.8");
  await page.locator("#cancel").click();
  await page.locator("#play").click();
  await page.waitForFunction(() => !document.getElementById("hud").hidden);
  assert.equal(
    await page.evaluate(() => document.pointerLockElement?.id),
    "game",
  );
  assert.equal(await page.locator("#health").textContent(), "100");
  // Aim using real mouse-look input; assert the rendered raycast changes enemy health.
  const snapshot = await page.evaluate(() => window.__ozTelemetry());
  const target = snapshot.enemies.findIndex(
    (e) => e.hp > 0 && visible(snapshot.player, e),
  );
  assert.ok(target >= 0, JSON.stringify(snapshot));
  async function aimAtTarget() {
    await page.evaluate((i) => {
      const s = window.__ozTelemetry(),
        e = s.enemies[i],
        dx = e.x - s.player.x,
        dz = e.z - s.player.z;
      const desiredYaw = Math.atan2(-dx, -dz),
        desiredPitch = Math.atan2(1.3 - s.player.y, Math.hypot(dx, dz));
      const sens =
        Number(JSON.parse(localStorage.getItem("oz-settings")).sensitivity) *
        0.002;
      document.dispatchEvent(
        new MouseEvent("mousemove", {
          movementX: (s.yaw - desiredYaw) / sens,
          movementY: (s.pitch - desiredPitch) / sens,
        }),
      );
    }, target);
  }
  await aimAtTarget();
  await page.mouse.down();
  await page.waitForFunction(
    (i) => window.__ozTelemetry().enemies[i].hp < 100,
    target,
  );
  await page.mouse.up();
  assert.ok(
    (await page.evaluate(() => window.__ozTelemetry())).enemies[target].hp <
      100,
  );
  await page.mouse.down();
  await page.waitForTimeout(400);
  await page.mouse.up();
  const firedAmmo = await page.locator("#ammo").textContent();
  await page.mouse.down();
  await page.waitForTimeout(900);
  await page.mouse.up();
  // Holding a revolver trigger cannot turn it into an automatic weapon.
  assert.equal(
    Number(await page.locator("#ammo").textContent()),
    Number(firedAmmo) - 1,
  );
  const ammo = Number(await page.locator("#ammo").textContent());
  assert.ok(ammo < 6 && ammo > 0);
  await page.keyboard.press("r");
  await page.waitForFunction(
    () => document.getElementById("ammo").textContent === "6",
    {},
    { timeout: 30000 },
  );
  assert.equal(await page.locator("#ammo").textContent(), "6");
  assert.ok(Number(await page.locator("#reserve").textContent()) < 60);
  const start = await page.evaluate(() => window.__ozTelemetry().player);
  await page.keyboard.down("w");
  await page.waitForFunction((start) => {
    const p = window.__ozTelemetry().player;
    return Math.hypot(p.x - start.x, p.z - start.z) > 0.2;
  }, start);
  await page.keyboard.up("w");
  const moved = await page.evaluate(() => window.__ozTelemetry().player);
  assert.ok(Math.hypot(moved.x - start.x, moved.z - start.z) > 0.2);
  await page.keyboard.press("Space");
  await page.waitForFunction(() => window.__ozTelemetry().player.y > 1.8);
  await page.waitForFunction(() => window.__ozTelemetry().player.y === 1.7);
  await page.evaluate(() => document.exitPointerLock());
  await page.waitForFunction(() => !document.getElementById("menu").hidden);
  const before = await page.locator("#timer").textContent();
  await page.waitForTimeout(1100);
  assert.equal(await page.locator("#timer").textContent(), before);
  await page.locator("#play").click();
  await page.waitForFunction(() => !document.getElementById("hud").hidden);
  assert.equal(await page.locator("#error").isVisible(), false);
  assert.deepEqual(errors, []);
  await page.screenshot({ path: "/tmp/operacao-zero.png" });
  console.log(
    "PASS: WebGL startup, settings persistence, pointer lock, fire, reload, movement inputs, pause and resume; no browser exceptions.",
  );
} finally {
  await browser.close();
}
