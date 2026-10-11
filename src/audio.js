export class Audio {
  constructor() {
    this.volume = 0.5;
    this.context = null;
  }
  unlock() {
    this.context ??= new AudioContext();
    return this.context.resume();
  }
  play(kind, pan = 0, attenuation = 1) {
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
      p = c.createStereoPanner();
    p.pan.value = Math.max(-1, Math.min(1, pan));
    gain.gain.setValueAtTime(
      this.volume * attenuation * (kind === "shot" ? 0.3 : 0.12),
      t,
    );
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    gain.connect(p);
    p.connect(c.destination);
    if (kind === "shot" || kind === "hit") {
      const buffer = c.createBuffer(1, c.sampleRate * duration, c.sampleRate),
        data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const source = c.createBufferSource(),
        filter = c.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = kind === "shot" ? 1400 : 650;
      source.buffer = buffer;
      source.connect(filter);
      filter.connect(gain);
      source.start(t);
    } else {
      const o = c.createOscillator();
      o.type = "triangle";
      o.frequency.setValueAtTime(kind === "reload" ? 450 : 180, t);
      o.frequency.exponentialRampToValueAtTime(70, t + duration);
      o.connect(gain);
      o.start(t);
      o.stop(t + duration);
    }
  }
}
