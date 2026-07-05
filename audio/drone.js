window.PoemDrone = class PoemDrone {
  constructor() {
    this.nodes = [];
  }

  start(genome, masterVolume) {
    this.stop(0.01);

    const baseAmp = genome.droneVolume * masterVolume;
    const oscA = new p5.Oscillator("sine");
    const oscB = new p5.Oscillator("triangle");
    const noise = new p5.Noise("pink");

    oscA.freq(genome.root);
    oscB.freq(genome.fifth + genome.roughness * 5);
    oscA.amp(0);
    oscB.amp(0);
    noise.amp(0);

    oscA.start();
    oscB.start();
    noise.start();

    oscA.amp(baseAmp, genome.fadeIn);
    oscB.amp(baseAmp * 0.42, genome.fadeIn * 1.2);
    noise.amp(genome.noiseVolume * masterVolume, genome.fadeIn * 1.4);

    this.nodes = [oscA, oscB, noise];
  }

  update(genome, elapsed) {
    if (this.nodes.length < 2) return;

    const drift = Math.sin(elapsed * 0.17 + genome.randomA * 10) * genome.shimmer;
    this.nodes[0].freq(genome.root + drift, 0.4);
    this.nodes[1].freq(genome.fifth + drift * 1.7, 0.4);
  }

  stop(fadeOut = 1.2) {
    for (const node of this.nodes) {
      node.amp(0, fadeOut);
      window.setTimeout(() => node.stop(), fadeOut * 1000 + 80);
    }

    this.nodes = [];
  }
};
