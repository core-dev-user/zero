// Shared animation phases are driven by the real weapon reload countdown.
export function reloadPose(remaining, duration) {
  const t =
    remaining > 0 ? Math.max(0, Math.min(1, 1 - remaining / duration)) : 1;
  const aperture = remaining > 0 ? Math.min(1, t / 0.18, (1 - t) / 0.16) : 0;
  return {
    progress: t,
    aperture: Math.max(0, aperture),
    insertion: remaining > 0 && t > 0.38 && t < 0.76,
    reach: remaining > 0 ? Math.sin(Math.PI * t) : 0,
  };
}
export function smoothVelocity(current, target, dt, rate = 12) {
  return current + (target - current) * (1 - Math.exp(-rate * dt));
}
