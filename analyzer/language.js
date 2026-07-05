window.PoemLanguage = (() => {
  const APOSTROPHES = "'\u2019\u02bc";
  const WORD_RE = new RegExp(
    `[A-Za-zÀ-ÖØ-öø-ÿА-Яа-яЁёІіЇїЄєҐґЎў]+(?:[${APOSTROPHES}][A-Za-zÀ-ÖØ-öø-ÿА-Яа-яЁёІіЇїЄєҐґЎў]+)?`,
    "g"
  );

  function clamp(value, min = 0, max = 1) {
    return Math.max(min, Math.min(max, value));
  }

  function normalizeWord(word) {
    return word.toLowerCase().replace(/\u2019|\u02bc/g, "'");
  }

  function detectScript(text) {
    const latin = (text.match(/[A-Za-zÀ-ÖØ-öø-ÿ]/g) || []).length;
    const cyrillic = (text.match(/[А-Яа-яЁёІіЇїЄєҐґЎў]/g) || []).length;
    const total = Math.max(1, latin + cyrillic);

    return {
      latin: latin / total,
      cyrillic: cyrillic / total,
      mixed: Math.min(latin, cyrillic) / total,
    };
  }

  function detectLanguageHints(text) {
    const lower = text.toLowerCase();

    return {
      belarusian: /[ў]/.test(lower) ? 1 : 0,
      ukrainian: /[їєґ]/.test(lower) ? 1 : 0,
      russian: /[ёэыъ]/.test(lower) ? 1 : 0,
      french: /[àâçéèêëîïôùûüÿœ]/.test(lower) ? 1 : 0,
      english: /\b(the|and|of|to|i|my|not)\b/.test(lower) ? 1 : 0,
    };
  }

  function tokenize(text) {
    return (text.match(WORD_RE) || []).map(normalizeWord);
  }

  function analyze(text) {
    const safeText = String(text || "");
    const lines = safeText.split(/\r?\n/);
    const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
    const words = tokenize(safeText);
    const uniqueWords = new Set(words);
    const chars = safeText.replace(/\s/g, "");
    const vowels = (safeText.match(/[aeiouyаеёиоуыэюяіїєўàâéèêëîïôùûüÿœ]/gi) || [])
      .length;
    const punctuation = (safeText.match(/[.,;:!?—\-]/g) || []).length;
    const longMarks = (safeText.match(/[—;:]/g) || []).length;
    const exclamations = (safeText.match(/[!?]/g) || []).length;
    const commas = (safeText.match(/[,]/g) || []).length;
    const periods = (safeText.match(/[.]/g) || []).length;

    const wordLengths = words.map((word) => word.length);
    const averageWordLength =
      wordLengths.reduce((sum, length) => sum + length, 0) /
      Math.max(1, wordLengths.length);

    const lineWordCounts = nonEmptyLines.map((line) => tokenize(line).length);
    const averageLineLength =
      lineWordCounts.reduce((sum, count) => sum + count, 0) /
      Math.max(1, lineWordCounts.length);
    const lineVariance =
      lineWordCounts.reduce(
        (sum, count) => sum + Math.pow(count - averageLineLength, 2),
        0
      ) / Math.max(1, lineWordCounts.length);

    const counts = {};
    for (const word of words) counts[word] = (counts[word] || 0) + 1;

    const repeatedWords = Object.values(counts).filter((count) => count > 1);
    const repetitionDensity =
      repeatedWords.reduce((sum, count) => sum + count - 1, 0) /
      Math.max(1, words.length);

    return {
      text: safeText,
      words,
      lineCount: nonEmptyLines.length,
      wordCount: words.length,
      uniqueCount: uniqueWords.size,
      averageWordLength,
      averageLineLength,
      lineVariance,
      repetitionDensity,
      lexicalVariety: uniqueWords.size / Math.max(1, words.length),
      vowelRatio: vowels / Math.max(1, chars.length),
      punctuationDensity: punctuation / Math.max(1, words.length),
      pauseDensity: (commas + periods + longMarks) / Math.max(1, words.length),
      intensity: clamp(exclamations / Math.max(1, nonEmptyLines.length)),
      script: detectScript(safeText),
      hints: detectLanguageHints(safeText),
    };
  }

  return {
    analyze,
    tokenize,
  };
})();
