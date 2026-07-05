window.PoemGlass = class PoemGlass {
  constructor() {
    this.active = false;
    this.timer = null;
  }

  start(genome, masterVolume) {
    this.stop();
    this.active = true;
    this.schedule(genome, masterVolume, 300);
  }

  schedule(genome, masterVolume, delay) {
    if (!this.active) return;

    this.timer = window.setTimeout(() => {
      this.ping(genome, masterVolume);

      const gap = 900 + (1 - genome.particleRate) * 1800;
      const variation = genome.randomB * 700 + Math.random() * 900;
      this.schedule(genome, masterVolume, gap + variation);
    }, delay);
  }

  ping(genome, masterVolume) {
    const osc = new p5.Oscillator("sine");
    const partial = 1 + Math.floor(Math.random() * 4) * 0.5;
    const freq = genome.second * partial + Math.random() * genome.harmonicSpread * 70;
    const amp = genome.glassVolume * masterVolume * (0.45 + Math.random() * 0.7);

    osc.freq(freq);
    osc.amp(0);
    osc.start();
    osc.amp(amp, 0.04);
    osc.freq(freq * (1 + genome.shimmer * 0.025), 1.1);

    window.setTimeout(() => osc.amp(0, 1.6), 90);
    window.setTimeout(() => osc.stop(), 1900);
  }

  stop() {
    this.active = false;

    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }
};
