window.PoemAudioEngine = class PoemAudioEngine {
  constructor() {
    this.enabled = true;
    this.masterVolume = 0.42;
    this.ready = false;
    this.activeKey = null;
    this.startedAt = 0;
    this.genome = null;
    this.layers = null;
  }

  init() {
    if (this.ready || typeof p5 === "undefined") return;
    if (typeof p5.Oscillator !== "function" || typeof p5.Noise !== "function") {
      return;
    }

    this.layers = {
      drone: new window.PoemDrone(),
      glass: new window.PoemGlass(),
      particles: new window.PoemSoundParticles(),
      harmony: new window.PoemHarmony(),
    };
    this.ready = true;
  }

  unlock() {
    this.init();

    if (typeof userStartAudio === "function") {
      userStartAudio();
    }
  }

  startPoem(poem, key) {
    if (!this.enabled) return;
    this.unlock();
    if (!this.ready || !poem) return;

    const text = `${poem.title || ""}\n${poem.author || ""}\n${poem.text || ""}`;
    const poemKey = key || text;

    if (this.activeKey === poemKey) return;

    this.stop(0.7);

    const analysis = window.PoemLanguage.analyze(text);
    this.genome = window.PoemGenome.build(analysis);
    this.activeKey = poemKey;
    this.startedAt =
      typeof millis === "function" ? millis() / 1000 : Date.now() / 1000;

    this.layers.drone.start(this.genome, this.masterVolume);
    this.layers.glass.start(this.genome, this.masterVolume);
    this.layers.particles.start(this.genome, this.masterVolume);
    this.layers.harmony.start(this.genome, this.masterVolume);
  }

  update() {
    if (!this.activeKey || !this.genome || !this.layers) return;

    const now =
      typeof millis === "function" ? millis() / 1000 : Date.now() / 1000;
    const elapsed = now - this.startedAt;

    this.layers.drone.update(this.genome, elapsed);
    this.layers.harmony.update(this.genome, elapsed);
  }

  stop(fadeOut = 1.2) {
    if (!this.layers) {
      this.activeKey = null;
      return;
    }

    this.layers.drone.stop(fadeOut);
    this.layers.glass.stop();
    this.layers.particles.stop();
    this.layers.harmony.stop(fadeOut);
    this.activeKey = null;
    this.genome = null;
  }
};
