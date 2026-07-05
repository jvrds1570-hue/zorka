window.PoemGenome = (() => {
  function clamp(value, min = 0, max = 1) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t);
  }

  function hashText(text) {
    let hash = 2166136261;

    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
  }

  function randomFromHash(seed) {
    let state = seed || 1;

    return function next() {
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      return ((state >>> 0) % 100000) / 100000;
    };
  }

  function build(analysis) {
    const seed = hashText(analysis.text);
    const random = randomFromHash(seed);
    const longWords = clamp((analysis.averageWordLength - 4) / 7);
    const structure = clamp(analysis.lineVariance / 18);
    const density = clamp(analysis.wordCount / Math.max(1, analysis.lineCount * 10));
    const variety = clamp(analysis.lexicalVariety);
    const repetition = clamp(analysis.repetitionDensity * 3);
    const punctuation = clamp(analysis.punctuationDensity * 4);
    const cyrillic = analysis.script.cyrillic;
    const latin = analysis.script.latin;
    const frenchColor = analysis.hints.french;
    const ukrainianColor = analysis.hints.ukrainian;
    const belarusianColor = analysis.hints.belarusian;
    const russianColor = analysis.hints.russian;
    const languageLift =
      frenchColor * 32 +
      ukrainianColor * 18 +
      belarusianColor * 10 -
      russianColor * 8;

    const root = lerp(82, 156, longWords * 0.55 + variety * 0.3) + languageLift;
    const tempo = lerp(0.18, 0.74, punctuation * 0.45 + density * 0.35 + structure * 0.2);

    return {
      seed,
      randomA: random(),
      randomB: random(),
      root,
      second: root * lerp(1.2, 1.52, latin * 0.5 + variety * 0.5),
      fifth: root * 1.5,
      octave: root * 2,
      droneVolume: lerp(0.018, 0.065, repetition * 0.45 + density * 0.25),
      glassVolume: lerp(0.018, 0.075, variety * 0.5 + analysis.vowelRatio * 0.5),
      particleVolume: lerp(0.012, 0.055, punctuation * 0.65 + analysis.intensity * 0.35),
      harmonyVolume: lerp(0.014, 0.052, longWords * 0.35 + structure * 0.35),
      noiseVolume: 0,
      shimmer: lerp(0.15, 0.9, analysis.vowelRatio * 1.8),
      roughness: lerp(0.05, 0.75, repetition * 0.5 + structure * 0.4),
      particleRate: tempo,
      particleScatter: lerp(0.2, 1.0, punctuation * 0.65 + variety * 0.2),
      harmonicSpread: lerp(0.18, 0.9, variety * 0.55 + longWords * 0.35),
      filterBase: lerp(420, 1800, analysis.vowelRatio * 1.3 + latin * 0.2),
      fadeIn: 2.4,
      fadeOut: 1.4,
    };
  }

  return {
    build,
  };
})();
