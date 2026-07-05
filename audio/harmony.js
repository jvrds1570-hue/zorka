window.PoemHarmony = class PoemHarmony {
  constructor() {
    this.nodes = [];
  }

  start(genome, masterVolume) {
    this.stop(0.01);

    const amp = genome.harmonyVolume * masterVolume;
    const oscA = new p5.Oscillator("sine");
    const oscB = new p5.Oscillator("sine");

    oscA.freq(genome.octave);
    oscB.freq(genome.octave * (1.25 + genome.harmonicSpread * 0.15));
    oscA.amp(0);
    oscB.amp(0);

    oscA.start();
    oscB.start();
    oscA.amp(amp * 0.55, genome.fadeIn * 1.6);
    oscB.amp(amp * 0.35, genome.fadeIn * 1.9);

    this.nodes = [oscA, oscB];
  }

  update(genome, elapsed) {
    if (this.nodes.length < 2) return;

    const slow = Math.sin(elapsed * 0.09 + genome.randomB * 12);
    const spread = 1.2 + genome.harmonicSpread * 0.22 + slow * 0.015;

    this.nodes[0].freq(genome.octave * (1 + slow * 0.006), 0.8);
    this.nodes[1].freq(genome.octave * spread, 0.8);
  }

  stop(fadeOut = 1.2) {
    for (const node of this.nodes) {
      node.amp(0, fadeOut);
      window.setTimeout(() => node.stop(), fadeOut * 1000 + 80);
    }

    this.nodes = [];
  }
};
