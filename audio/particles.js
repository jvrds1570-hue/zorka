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
      this.burst(genome, masterVolume);

      const quick = 260 + (1 - genome.particleRate) * 900;
      const loose = Math.random() * 900 * genome.particleScatter;
      this.schedule(genome, masterVolume, quick + loose);
    }, delay);
  }

  burst(genome, masterVolume) {
    const noise = new p5.Noise("white");
    const amp = genome.particleVolume * masterVolume * (0.4 + Math.random() * 0.8);

    noise.amp(0);
    noise.start();
    noise.amp(amp, 0.015);

    window.setTimeout(() => noise.amp(0, 0.08 + Math.random() * 0.16), 35);
    window.setTimeout(() => noise.stop(), 360);
  }

  stop() {
    this.active = false;

    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }
};
