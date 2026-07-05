// Sound sketch for the project.
// This uses p5.sound synthesis, so it works without external audio files.
// Replace these values or the functions below when the final sound direction is ready.

window.SOUND_DESIGN = {
  enabled: true,
  masterVolume: 0.35,
  ambience: {
    introTransition: 0.025,
    constellation: 0.045,
    poem: 0.018,
  },
  fall: {
    startFrequency: 920,
    endFrequency: 95,
    volume: 0.16,
    noiseVolume: 0.055,
  },
  poemEnter: {
    frequency: 220,
    volume: 0.08,
  },
};

let projectSoundReady = false;
let ambienceOsc = null;
let ambienceNoise = null;

window.initProjectSound = function initProjectSound() {
  if (!window.SOUND_DESIGN.enabled || typeof p5 === "undefined") return;
  if (projectSoundReady || typeof p5.Oscillator !== "function") return;

  ambienceOsc = new p5.Oscillator("sine");
  ambienceOsc.freq(132);
  ambienceOsc.amp(0);
  ambienceOsc.start();

  ambienceNoise = new p5.Noise("pink");
  ambienceNoise.amp(0);
  ambienceNoise.start();

  projectSoundReady = true;
};

window.ensureProjectSound = function ensureProjectSound() {
  window.initProjectSound();

  if (typeof userStartAudio === "function") {
    userStartAudio();
  }
};

window.setProjectSoundScene = function setProjectSoundScene(sceneName) {
  if (!projectSoundReady || !window.SOUND_DESIGN.enabled) return;

  const config = window.SOUND_DESIGN;
  const target = config.ambience[sceneName] ?? 0;
  const scaledTarget = target * config.masterVolume;

  ambienceOsc.amp(scaledTarget, 1.2);
  ambienceNoise.amp(scaledTarget * 0.45, 1.2);

  if (sceneName === "poem") {
    ambienceOsc.freq(96, 1.4);
  } else if (sceneName === "constellation") {
    ambienceOsc.freq(132, 1.4);
  } else {
    ambienceOsc.freq(176, 1.4);
  }
};

window.playStarFallSound = function playStarFallSound(durationSeconds) {
  if (!projectSoundReady || !window.SOUND_DESIGN.enabled) return;

  const config = window.SOUND_DESIGN;
  const fall = config.fall;
  const durationMs = durationSeconds * 1000;
  const osc = new p5.Oscillator("triangle");
  const noise = new p5.Noise("white");

  osc.freq(fall.startFrequency);
  osc.amp(0);
  osc.start();
  osc.amp(fall.volume * config.masterVolume, 0.08);
  osc.freq(fall.endFrequency, durationSeconds);

  noise.amp(0);
  noise.start();
  noise.amp(fall.noiseVolume * config.masterVolume, 0.08);

  window.setTimeout(() => {
    osc.amp(0, 0.18);
    noise.amp(0, 0.18);
  }, Math.max(0, durationMs - 220));

  window.setTimeout(() => {
    osc.stop();
    noise.stop();
  }, durationMs + 120);
};

window.playPoemEnterSound = function playPoemEnterSound() {
  if (!projectSoundReady || !window.SOUND_DESIGN.enabled) return;

  const config = window.SOUND_DESIGN;
  const poemEnter = config.poemEnter;
  const osc = new p5.Oscillator("sine");

  osc.freq(poemEnter.frequency);
  osc.amp(0);
  osc.start();
  osc.amp(poemEnter.volume * config.masterVolume, 0.08);
  osc.freq(poemEnter.frequency * 1.5, 0.7);

  window.setTimeout(() => {
    osc.amp(0, 0.5);
  }, 500);

  window.setTimeout(() => {
    osc.stop();
  }, 1200);
};
