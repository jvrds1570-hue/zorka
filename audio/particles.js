window.PoemSoundParticles = class PoemSoundParticles {
  constructor() {
    this.active = false;
    this.timer = null;
  }

  start(genome, masterVolume) {
    this.stop();
    this.active = true;
    this.schedule(genome, masterVolume, 600);
  }

  schedule(genome, masterVolume, delay) {
    if (!this.active) return;

    this.timer = window.setTimeout(() => {
      this.bloom(genome, masterVolume);

      const slow = 1500 + (1 - genome.particleRate) * 2400;
      const loose = Math.random() * 1800 * genome.particleScatter;
      this.schedule(genome, masterVolume, slow + loose);
    }, delay);
  }

  bloom(genome, masterVolume) {
    const osc = new p5.Oscillator("sine");
    const partials = [1, 1.5, 2, 2.5];
    const partial = partials[Math.floor(Math.random() * partials.length)];
    const freq = genome.second * partial + Math.random() * genome.harmonicSpread * 45;
    const amp = genome.particleVolume * masterVolume * (0.1 + Math.random() * 0.16);
    const swell = 0.18 + Math.random() * 0.28;
    const release = 0.9 + Math.random() * 1.2;

    osc.freq(freq);
    osc.amp(0);
    osc.start();
    osc.amp(amp, swell);
    osc.freq(freq * (1 + genome.shimmer * 0.01), release);

    window.setTimeout(() => osc.amp(0, release), swell * 1000 + 160);
    window.setTimeout(() => osc.stop(), (swell + release) * 1000 + 360);
  }

  stop() {
    this.active = false;

    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }
};
