export class Audio {
  constructor() {
    this.volume = 0.5;
    this.context = null;
    this.buffers = new Map();
  }
  unlock() {
    this.context ??= new AudioContext();
    return this.context.resume();
  }
  setListener(position, yaw, pitch) {
    if (!this.context) return;
    const listener = this.context.listener;
    listener.positionX.value = position.x;
    listener.positionY.value = position.y;
    listener.positionZ.value = position.z;
    listener.forwardX.value = -Math.sin(yaw) * Math.cos(pitch);
    listener.forwardY.value = Math.sin(pitch);
    listener.forwardZ.value = -Math.cos(yaw) * Math.cos(pitch);
    listener.upX.value = 0;
    listener.upY.value = 1;
    listener.upZ.value = 0;
  }
  play(
    kind,
    pan = 0,
    attenuation = 1,
    profile = "rifle",
    position = null,
    occluded = false,
  ) {
    if (!this.context || this.context.state !== "running" || !this.volume)
      return;
    const c = this.context,
      t = c.currentTime;
    const duration =
      kind === "shot"
        ? 0.16
        : kind === "reload"
          ? 0.12
          : kind === "hit"
            ? 0.09
            : 0.25;
    const gain = c.createGain(),
      p = position ? c.createPanner() : c.createStereoPanner();
    if (position) {
      p.panningModel = "HRTF";
      p.distanceModel = "inverse";
      p.refDistance = 3;
      p.maxDistance = 80;
      p.rolloffFactor = 0.8;
      p.positionX.value = position.x;
      p.positionY.value = position.y;
      p.positionZ.value = position.z;
    } else p.pan.value = Math.max(-1, Math.min(1, pan));
    gain.gain.setValueAtTime(
      this.volume * attenuation * (kind === "shot" ? 0.3 : 0.12),
      t,
    );
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    gain.connect(p);
    p.connect(c.destination);
    if (kind === "shot" || kind === "hit") {
      const key = kind;
      let buffer = this.buffers.get(key);
      if (!buffer) {
        buffer = c.createBuffer(
          1,
          Math.floor(c.sampleRate * duration),
          c.sampleRate,
        );
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        this.buffers.set(key, buffer);
      }
      const source = c.createBufferSource(),
        filter = c.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value =
        kind === "shot"
          ? {
              revolver: 1050,
              rifle: 1700,
              smg: 2300,
              shotgun: 800,
              sniper: 650,
            }[profile] || 1400
          : profile === "metal"
            ? 2800
            : 650;
      if (occluded)
        filter.frequency.value = Math.min(filter.frequency.value, 450);
      source.buffer = buffer;
      source.connect(filter);
      filter.connect(gain);
      source.start(t);
      source.onended = () => {
        source.disconnect();
        filter.disconnect();
        gain.disconnect();
        p.disconnect();
      };
    } else {
      const o = c.createOscillator();
      o.type = "triangle";
      o.frequency.setValueAtTime(
        kind === "reload" ? 450 : kind === "step" ? 85 : 180,
        t,
      );
      if (occluded) o.frequency.value *= 0.5;
      o.frequency.exponentialRampToValueAtTime(70, t + duration);
      o.connect(gain);
      o.start(t);
      o.stop(t + duration);
      o.onended = () => {
        o.disconnect();
        gain.disconnect();
        p.disconnect();
      };
    }
  }
}
