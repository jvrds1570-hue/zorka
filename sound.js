// Bridge between the visual sketch and the generated poem audio system.
// The actual sound design lives in analyzer/ and audio/.

window.projectPoemAudio = null;

window.initProjectSound = function initProjectSound() {
  if (!window.projectPoemAudio && window.PoemAudioEngine) {
    window.projectPoemAudio = new window.PoemAudioEngine();
  }

  if (window.projectPoemAudio) {
    window.projectPoemAudio.init();
  }
};

window.ensureProjectSound = function ensureProjectSound() {
  window.initProjectSound();

  if (window.projectPoemAudio) {
    window.projectPoemAudio.unlock();
  }
};

window.startPoemSound = function startPoemSound(poem, key) {
  window.ensureProjectSound();

  if (window.projectPoemAudio) {
    window.projectPoemAudio.startPoem(poem, key);
  }
};

window.updateProjectSound = function updateProjectSound() {
  if (window.projectPoemAudio) {
    window.projectPoemAudio.update();
  }
};

window.stopProjectSound = function stopProjectSound() {
  if (window.projectPoemAudio) {
    window.projectPoemAudio.stop();
  }
};

window.setProjectSoundScene = function setProjectSoundScene(sceneName) {
  if (sceneName !== "poem") {
    window.stopProjectSound();
  }
};

window.playStarFallSound = function playStarFallSound() {
  // Intentionally silent: generated sound belongs only to poem scenes.
};

window.playPoemEnterSound = function playPoemEnterSound() {
  // The poem sound starts from the full poem text instead of a fixed cue.
};
