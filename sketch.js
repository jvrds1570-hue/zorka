let font;
let nimbusFont;
let poemFont;
let poemScroll = 0;
let poemScrollMax = 0;
let poemSceneFade = 0;
let poemSceneTime = 0;
let romanceRevealCount = 0;
let romanceVisualProgress = 0;
let romanceDarkProgress = 0;
let romanceBlockFades = [];
let romanceStar = null;
let elevationBlockStates = [];
let elevationLetterStates = [];
let listenCursorX = 0;
let listenCursorY = 0;
let listenFollow = 0;
let listenRevealSections = 0;
let listenRevealProgress = 0;
let eveningParticles = [];
let sonnetRevealLines = 0;
let sonnetRevealProgress = 0;
const INTRO = 0;
const CONSTELLATION = 1;
const STAR_EXIT = 2;
const EMPTY_SPACE = 3;
const POEM = 4;
let transitionStar = null;
let currentScene = INTRO;
let poemTransition = 0;
let transitionTimer = 0;
let transitionProgress = 0;
let phaseTimer = 0;
let sceneProgress = 0;
let emptyTimer = 0;
let transitionStarScreen = {
  x: 0,
  y: 0,
  size: 4,
};
let startRotX;
let startRotY;
let exitRotStartX = 0;
let exitRotStartY = 0;
let exitRotTargetX = 0;
let exitRotTargetY = 0;

let targetRotTransitionX = 0;
let targetRotTransitionY = 0;

let transitionParticles = [];
let letters = [];
let particles = [];
let frozen = false;
let freezeProgress = 0;
let hoverAnim = 0;
let transition = false;
let starReleased = false;
let cursorTransition = 0;
let cursorTransitionActive = false;
let x = 0;
let y = 50;
let glowPulse = 0;
let constellationStars = [];
let constellationEdges = [];
const SUPPORT_STAR_COUNT = 18;
const CONNECTION_DISTANCE = 30;
const MAX_CONNECTIONS_PER_STAR = 2;
let bgStars = [];
let constellationRotX = 0;
let constellationRotY = 0;
let rotationX = 0;
let rotationY = 0;
let targetRotX = 0;
let targetRotY = 0;
let scene2Time = 0;
let constellationAlpha = 0;
let selectedStar = null;
let labelHitAreas = [];
let swipeProgress = 0;
const SWIPE_DISTANCE = 220; // try 180–250
const WORD_HOLD_TIME = 0.8; // word stays visible first
const WORD_FADE_TIME = 2.5; // slow fade-out
const STARS_ENTER_DELAY = 1.4;
const STARS_ENTER_TIME = 1.4;
const STAR_EXIT_TIME = 2.1;
const button = {
  x: -100,
  y: 50,
  w: 650,
  h: 300,
};

function preload() {
  nimbusFont = loadFont("nimbus-mono.bold.otf");
  poemFont = loadFont("corbel.ttf");
  font = nimbusFont;
}

function soundEvent(name, ...args) {
  if (typeof window === "undefined") return;

  const fn = window[name];
  if (typeof fn === "function") {
    fn(...args);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  soundEvent("initProjectSound");

  textFont(nimbusFont);
  textWrap(CHAR);

  noCursor();

  letters = [
    {
      char: "z",
      size: 125,
      sx: -1050,
      sy: 1050,
      sz: -700,
      tx: -200,
      ty: 30,
      tz: 0,
    },
    {
      char: "O",
      size: 150,
      sx: -1350,
      sy: -550,
      sz: -300,
      tx: -135,
      ty: 30,
      tz: 0,
    },
    {
      char: "R",
      size: 100,
      sx: 1300,
      sy: 150,
      sz: -200,
      tx: -47,
      ty: 0,
      tz: 0,
    },
    {
      char: "k",
      size: 175,
      sx: 1020,
      sy: -1200,
      sz: -300,
      tx: 2,
      ty: 50,
      tz: 0,
    },
    {
      char: "a",
      size: 100,
      sx: -1620,
      sy: 270,
      sz: -400,
      tx: 85,
      ty: 30,
      tz: 0,
    },
  ];

  const z2 = random(-150, 150);
  const z3 = random(-150, 150);
  const z4 = random(-150, 150);
  const z5 = random(-150, 150);
  const z6 = random(-150, 150);

  constellationStars = [
    {
      x: -320,
      y: -120,
      z: z2,
      label: "Раманс",
      labelOffsetX: 18,
      labelOffsetY: -12,
      isAnchor: true,
      alpha: 0,

      focus: 0,

      poem: {
        author: "Максім Багдановіч",
        text:
          "Зорка Венера ўзышла над зямлёю,\nСветлыя згадкі з сабой прывяла...\nПомніш, калі я спаткаўся з табою,\nЗорка Венера ўзышла.\n\nЗ гэтай пары я пачаў углядацца\nЎ неба начное і зорку шукаў.\nЦіхім каханнем к табе разгарацца\nЗ гэтай пары я пачаў.\n\nАле расстацца нам час наступае;\nПэўна, ўжо доля такая у нас.\nМоцна кахаў я цябе, дарагая,\n Але расстацца нам час.\n\nБуду ў далёкім краю я нудзіцца,\nУ сэрцы любоў затаіўшы сваю;\nКожную ночку на зорку дзівіцца\nБуду ў далёкім краю.\n\nГлянь іншы раз на яе, — у расстанні\nТам з ёй зліём мы пагляды свае...\nКаб хоць на міг уваскрэсла каханне,\nГлянь іншы раз на яе...",
      },
    },
    {
      x: -80,
      y: -220,
      z: z3,
      label: "Послушайте!",
      labelOffsetX: 18,
      labelOffsetY: -12,
      isAnchor: true,
      alpha: 0,

      focus: 0,

      poem: {
        author: "Владимир Маяковский",
        text:
          "Послушайте!\nВедь, если звезды зажигают —\nзначит — это кому-нибудь нужно?\nЗначит — кто-то хочет, чтобы они были?\nЗначит — кто-то называет эти плево́чки жемчужиной?\nИ, надрываясь\nв метелях полу́денной пыли,\nврывается к богу,\nбоится, что опоздал,\nплачет,\nцелует ему жилистую руку,\nпросит —\nчтоб обязательно была звезда! —\nклянется —\nне перенесет эту беззвездную му́ку!\nА после\nходит тревожный,\nно спокойный наружно.\nГоворит кому-то:\n«Ведь теперь тебе ничего?\nНе страшно?\nДа?!»\nПослушайте!\nВедь, если звезды\nзажигают —\nзначит — это кому-нибудь нужно?\nЗначит — это необходимо,\nчтобы каждый вечер\nнад крышами\nзагоралась хоть одна звезда?!",
      },
    },
    {
      x: 150,
      y: -80,
      z: z4,
      label: "Élévation",
      labelOffsetX: 18,
      labelOffsetY: -12,
      isAnchor: true,
      alpha: 0,

      focus: 0,

      poem: {
        author: "Charles Baudelaire",
        text:
          "Au-dessus des étangs, au-dessus des vallées,\nDes montagnes, des bois, des nuages, des mers,\nPar delà le soleil, par delà les éthers,\nPar delà les confins des sphères étoilées,\n\nMon esprit, tu te meus avec agilité,\nEt, comme un bon nageur qui se pâme dans l'onde,\nTu sillonnes gaiement l'immensité profonde\nAvec une indicible et mâle volupté.\n\nEnvole-toi bien loin de ces miasmes morbides;\nVa te purifier dans l'air supérieur,\nEt bois, comme une pure et divine liqueur,\nLe feu clair qui remplit les espaces limpides.\n\nDerrière les ennuis et les vastes chagrins\nQui chargent de leur poids l'existence brumeuse,\nHeureux celui qui peut d'une aile vigoureuse\nS'élancer vers les champs lumineux et sereins;\n\nCelui dont les pensers, comme des alouettes,\nVers les cieux le matin prennent un libre essor,\n— Qui plane sur la vie, et comprend sans effort\nLe langage des fleurs et des choses muettes!",
      },
    },
    {
      x: 280,
      y: 120,
      z: z5,
      label: "Sonnet 14",
      labelOffsetX: 18,
      labelOffsetY: -12,
      isAnchor: true,
      alpha: 0,

      focus: 0,

      poem: {
        author: "William Shakespeare",
        text:
          "Not from the stars do I my judgment pluck,\nAnd yet methinks I have astronomy—\nBut not to tell of good or evil luck,\nOf plagues, of dearths, or seasons’ quality;\nNor can I fortune to brief minutes tell,\nPointing to each his thunder, rain, and wind,\nOr say with princes if it shall go well\nBy oft predict that I in heaven find.\nBut from thine eyes my knowledge I derive,\nAnd, constant stars, in them I read such art\nAs truth and beauty shall together thrive\nIf from thyself to store thou wouldst convert;\n Or else of thee this I prognosticate:\n Thy end is truth’s and beauty’s doom and date.",
      },
    },
    {
      x: -210,
      y: 80,
      z: z6,

      label: "Зоре моя вечірняя",
      labelOffsetX: 18,
      labelOffsetY: -12,

      isAnchor: true,
      size: 3.2,
      brightness: 255,
      alpha: 0,

      focus: 0,

      poem: {
        author: "Тарас Шевченко",
        text:
          "Зоре моя вечірняя,\nЗійди над горою,\nПоговорим тихесенько\nВ неволі з тобою.\n\nРозкажи, як за горою\nСонечко сідає.\nЯк у Дніпра веселочка\nВоду позичає.\n\nЯк широка сокорина\nВіти розпустила...\nА над самою водою\nВерба похилилась;\n\nАж по воді розіслала\nЗеленії віти,\nА на вітах гойдаються\nНехрищені діти.\n\nЯк у полі на могилі\nВовкулак ночує,\nА сич в лісі та на стрісі\nНедолю віщує.\n\nЯк сон-трава при долині\nВночі розцвітає...\nА про людей... Та нехай їм.\nЯ їх, добрих, знаю.\n\nДобре знаю. Зоре моя!\nМій друже єдиний!\nІ хто знає, що діється\nВ нас на Україні?\n\nА я знаю. І розкажу\nТобі; й спать не ляжу.\nА ти завтра тихесенько\nБогові розкажеш.",
      },
    },
  ];

  createSupportStars();

  const supportPositions = [
    [-240, -150, -250],
    [-170, -190, -40],
    [-10, -170, 130],
    [50, -120, 180],
    [95, -70, 150],
    [180, -20, 40],
    [225, 55, 210],
    [-250, -60, -60],
    [-200, 20, -20],
    [-150, 85, 70],
    [-20, -100, 100],
    [30, -145, 80],
    [120, 20, -180],
    [170, 70, -40],
    [220, 150, 10],
    [130, 150, 40],
    [220, 210, 60],
    [140, 200, 250],
  ];

  const ANCHOR_STAR_COUNT = 5;
  applyEditablePoemPages();
  for (let i = 0; i < supportPositions.length; i++) {
    const star = constellationStars[i + ANCHOR_STAR_COUNT];

    star.x = supportPositions[i][0];
    star.y = supportPositions[i][1];
    star.z = supportPositions[i][2];
  }

  createConstellationEdges();

  for (let i = 0; i < 100; i++) {
    bgStars.push({
      x: random(-width / 2, width / 2),
      y: random(-height / 2, height / 2),
      z: -1500,
      size: random(1, 3),
      phase: random(TWO_PI),
      delay: random(0, 0.35),
    });
  }
  createLetterParticles();
}

function createLetterParticles() {
  particles = [];

  for (const l of letters) {
    const points = font.textToPoints(l.char, l.tx, l.ty, l.size, {
      sampleFactor: 0.25,
    });

    for (const p of points) {
      particles.push({
        x: random(-width / 2, width / 2),
        y: random(-height / 2, height / 2),
        z: random(-800, 800),

        tx: p.x,
        ty: p.y,
        tz: 0,

        size: random(2, 4),
      });
    }
  }
}

function createSupportStars() {
  for (let i = 0; i < SUPPORT_STAR_COUNT; i++) {
    const brightness = random(80, 180);

    constellationStars.push({
      x: random(-420, 420),
      y: random(-280, 280),
      z: random(-220, 220),

      label: "",
      labelOffsetX: 0,
      labelOffsetY: 0,

      isAnchor: false,
      size: random(0.8, 1.8),
      brightness,
      alpha: 0,
    });
  }

  // Give the four labelled stars a clearer hierarchy
  for (let i = 0; i < 4; i++) {
    constellationStars[i].size = 3.2;
    constellationStars[i].brightness = 255;
  }
}

function draw() {
  switch (currentScene) {
    case INTRO:
      drawIntro();
      break;

    case CONSTELLATION:
      drawConstellation();
      break;

    case STAR_EXIT:
      drawStarExit();
      break;

    case EMPTY_SPACE:
      drawEmptySpace();
      break;

    case POEM:
      drawPoemPage();
      break;
  }
}

function drawIntro() {
  textFont(nimbusFont);
  textWrap(CHAR);

  // ---------- transition timers ----------
  if (transition) {
    scene2Time += deltaTime / 1000;
  }

  if (transition) {
    transitionProgress += 0.008;
    transitionProgress = constrain(transitionProgress, 0, 1);

    if (transitionProgress >= 1 && !cursorTransitionActive && !starReleased) {
      cursorTransitionActive = true;
    }
  }

  if (cursorTransitionActive && !starReleased) {
    cursorTransition += 0.015;
    cursorTransition = constrain(cursorTransition, 0, 1);

    if (cursorTransition >= 1) {
      x = mouseX - width / 2;
      y = mouseY - height / 2;

      starReleased = true;

      // Switch to constellation scene
      currentScene = CONSTELLATION;
      soundEvent("setProjectSoundScene", "constellation");
    }
  }

  // ---------- background ----------
  let bg = lerp(255, 0, transitionProgress);
  background(bg);

  // ---------- swipe animation ----------
  if (!frozen) {
    // Original version:
    // let progress = constrain(map(mouseX,0,width,0,1),0,1);

    // More sensitive version:
    swipeProgress += abs(movedX);

    let progress = constrain(swipeProgress / SWIPE_DISTANCE, 0, 1);

    freezeProgress = lerp(freezeProgress, progress, 0.15);

    if (freezeProgress > 0.99) {
      freezeProgress = 1;
      frozen = true;
    }
  }

  // ---------- hover button ----------
  let hovering = false;

  if (frozen && !transition) {
    let mx = mouseX - width / 2;
    let my = mouseY - height / 2;

    hovering =
      mx > button.x - button.w / 2 &&
      mx < button.x + button.w / 2 &&
      my > button.y - button.h / 2 &&
      my < button.y + button.h / 2;
  }

  hoverAnim = lerp(hoverAnim, hovering ? 1 : 0, 0.15);

  // ---------- word ----------
  drawLetterParticles();

  // ---------- stars ----------
  if (frozen) {
    drawBackgroundStars();
  }

  // ---------- center star ----------
  if (!cursorTransitionActive) {
    drawCenterStar();
  } else if (!starReleased) {
    drawStarTransition();
  }
}

function drawConstellation() {
  textFont(nimbusFont);
  textWrap(CHAR);

  scene2Time += deltaTime / 1000;

  background(0);

  drawBackgroundStars();
  drawStarCursor();

  constellationAlpha = lerp(constellationAlpha, 255, 0.02);

  drawConstellationStars();
}

function rangeProgress(value, start, duration) {
  return constrain((value - start) / duration, 0, 1);
}

function drawLetterParticles() {
  let wordScale = 1 + hoverAnim * 0.08;
  let wordLift = -hoverAnim * 25;

  // Scene 1: letters assemble into zOrka
  if (!transition) {
    drawWordAndParticles(0, 1, wordScale, wordLift);
    return;
  }

  // Scene 2: zOrka stays still, then slowly disappears
  let fadeProgress = rangeProgress(scene2Time, WORD_HOLD_TIME, WORD_FADE_TIME);

  // Smooth slow fade
  let easedFade = easeInOutCubic(fadeProgress);
  let wordAlpha = lerp(255, 0, easedFade);

  // Main word stays in exactly the same position
  if (wordAlpha > 1) {
    drawWordOnly(0, wordAlpha / 255, 1);
  }

  // Optional: subtle stationary echo layers
  if (fadeProgress > 0 && wordAlpha > 1) {
    for (let i = 1; i <= 4; i++) {
      let echoAlpha = wordAlpha * (0.1 / i);

      drawWordOnly(i * 3, echoAlpha / 255, 1 + i * 0.006);
    }
  }
}

function drawWordAndParticles(offsetY, alphaMultiplier, scaleValue, liftY) {
  push();

  drawingContext.depthMask(false);
  translate(button.x, button.y + liftY + offsetY);
  scale(scaleValue);
  translate(-button.x, -button.y);

  // Finished word
  for (let l of letters) {
    let letterAlpha =
      map(freezeProgress, 0.7, 1, 0, 255, true) * alphaMultiplier;

    push();

    textSize(l.size);
    fill(lerp(0, 255, transitionProgress), letterAlpha);

    translate(l.tx, l.ty, l.tz);
    text(l.char, 0, 0);

    pop();
  }

  // Assembly particles only belong to scene 1
  if (!transition) {
    let particleAlpha =
      map(freezeProgress, 0.8, 1, 255, 0, true) * alphaMultiplier;

    noStroke();

    for (let p of particles) {
      let x = lerp(p.x, p.tx, freezeProgress);
      let y = lerp(p.y, p.ty, freezeProgress);
      let z = lerp(p.z, p.tz, freezeProgress);

      push();
      translate(x, y, z);
      fill(0, particleAlpha);
      circle(0, 0, p.size);
      pop();
    }
  }
  drawingContext.depthMask(true);
  pop();
}

function drawWordOnly(offsetY, alphaMultiplier, scaleValue) {
  push();

  // Invisible/fading text must not create a depth layer
  drawingContext.depthMask(false);

  translate(button.x, button.y + offsetY);
  scale(scaleValue);
  translate(-button.x, -button.y);

  for (let l of letters) {
    push();

    textSize(l.size);

    fill(255, 255 * alphaMultiplier);

    translate(l.tx, l.ty, l.tz);
    text(l.char, 0, 0);

    pop();
  }

  // Restore normal depth behavior for the constellation
  drawingContext.depthMask(true);

  pop();
}

function drawBackgroundStars() {
  push();

  drawingContext.disable(drawingContext.DEPTH_TEST);

  noStroke();

  for (let s of bgStars) {
    let appear = map(
      transitionProgress,
      0.45 + s.delay,
      0.85 + s.delay,
      0,
      1,
      true
    );

    appear = appear * appear * (3 - 2 * appear);

    let twinkle = 0.7 + noise(s.phase, frameCount * 0.005) * 0.6;

    let brightness = lerp(0, 255, appear) * twinkle;

    let alpha = lerp(0, 255, appear);

    fill(brightness, alpha * 0.015);
    circle(s.x, s.y, s.size * 8 * appear);

    fill(brightness, alpha * 0.03);
    circle(s.x, s.y, s.size * 4 * appear);

    fill(brightness, alpha);
    circle(s.x, s.y, s.size * appear);
  }
  drawingContext.enable(drawingContext.DEPTH_TEST);

  pop();
}

function drawCenterStar() {
  let starProgress = map(transitionProgress, 0.25, 1, 0, 1, true);
  if (starProgress <= 0) return;

  let brightness = lerp(0, 255, starProgress);

  push();
  translate(0, 50);

  rectMode(CENTER);
  noStroke();

  fill(brightness, 10);
  circle(0, 0, 80);

  fill(brightness, 20);
  circle(0, 0, 50);

  fill(brightness, 40);
  circle(0, 0, 25);

  fill(brightness);
  circle(0, 0, 6);

  pop();
}

function drawStarTransition() {
  let mx = mouseX - width / 2;
  let my = mouseY - height / 2;

  let t = easeInOutCubic(cursorTransition);

  let x = lerp(0, mx, t);
  let y = lerp(50, my, t);

  let scaleValue = lerp(1, 1.2, t);

  push();

  translate(x, y);
  scale(scaleValue);

  rectMode(CENTER);
  noStroke();

  fill(255, 10);
  circle(0, 0, 80);

  fill(255, 20);
  circle(0, 0, 40);

  fill(255, 40);
  circle(0, 0, 25);

  fill(255);
  circle(0, 0, 6);

  pop();
}

function drawStarCursor() {
  let mx = mouseX - width / 2;
  let my = mouseY - height / 2;

  x = lerp(x, mx, 0.05);
  y = lerp(y, my, 0.05);

  push();

  // Cursor must not create an invisible depth layer
  drawingContext.depthMask(false);

  translate(x, y);

  rectMode(CENTER);
  noStroke();

  glowPulse += 0.025;

  let pulse = (sin(glowPulse) + 1) * 0.5;

  let outerSize = 130 + pulse * 8;
  let middleSize = 80 + pulse * 5;
  let innerSize = 45 + pulse * 3;

  // Same transparent filled glow effect
  fill(255, 8 + pulse * 8);
  circle(0, 0, outerSize);

  fill(255, 18 + pulse * 10);
  circle(0, 0, middleSize);

  fill(255, 35 + pulse * 15);
  circle(0, 0, innerSize);

  fill(255);
  circle(0, 0, 6);

  drawingContext.depthMask(true);

  pop();
}

function getConstellationCenter() {
  let cx = 0;
  let cy = 0;
  let cz = 0;

  for (let star of constellationStars) {
    cx += star.x;
    cy += star.y;
    cz += star.z;
  }

  cx /= constellationStars.length;
  cy /= constellationStars.length;
  cz /= constellationStars.length;

  return {
    x: cx,
    y: cy,
    z: cz,
  };
}

function createConstellationEdges() {
  // Each pair is an index in constellationStars.
  // 0–3 are your labelled anchor stars.
  constellationEdges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 4],
    [4, 5],
    [5, 3],

    [4, 7],
    [7, 8],
    [7, 6],

    [5, 10],
    [10, 11],

    [6, 12],
    [12, 13],
    [13, 14],

    [3, 15],
    [15, 16],
    [16, 17],

    [9, 18],
    [11, 0],
    [14, 2],
    [3, 18],
  ];
}

function getProjectedPoint(x, y, z) {
  const projection = _renderer.uPMatrix.copy();
  const modelView = _renderer.uMVMatrix.copy();

  const point = new p5.Vector(x, y, z, 1);
  point.mult(modelView);
  point.mult(projection);

  if (point.w === 0) return null;

  const ndcX = point.x / point.w;
  const ndcY = point.y / point.w;

  return {
    x: (ndcX * 0.5 + 0.5) * width,
    y: (1 - (ndcY * 0.5 + 0.5)) * height,
  };
}

function applyConstellationTransform(offsetY = 0) {
  const center = getConstellationCenter();

  translate(0, offsetY);

  translate(center.x, center.y, center.z);

  rotateY(rotationY);
  rotateX(rotationX);

  translate(-center.x, -center.y, -center.z);
}

function drawConstellationStars(extraOffsetY = 0) {
  push();

  const starsProgress = rangeProgress(
    scene2Time,
    STARS_ENTER_DELAY,
    STARS_ENTER_TIME
  );

  const easedStars = easeInOutCubic(starsProgress);
  const starsOffsetY = lerp(height + 350, 0, easedStars);
  const starsAlpha = 255 * easedStars;

  if (currentScene === STAR_EXIT) {
    const exitRotationProgress = easeInOutCubic(sceneProgress);
    rotationX = lerp(exitRotStartX, exitRotTargetX, exitRotationProgress);
    rotationY = lerp(exitRotStartY, exitRotTargetY, exitRotationProgress);
  } else {
    constellationRotX = lerp(constellationRotX, targetRotX, 0.035);
    constellationRotY = lerp(constellationRotY, targetRotY, 0.035);

    rotationX = constellationRotX + cos(frameCount * 0.0012) * 0.01;
    rotationY = constellationRotY + sin(frameCount * 0.0015) * 0.015;
  }

applyConstellationTransform(starsOffsetY + extraOffsetY);

  textAlign(LEFT, CENTER);
  labelHitAreas = [];

  const finalAlpha = constellationAlpha * (starsAlpha / 255);
  const exitTone = currentScene === STAR_EXIT ? lerp(255, 0, sceneProgress) : 255;

  // Draw stars and labels once.
 for (const star of constellationStars) {

    if (currentScene === STAR_EXIT && star === transitionStar) {
        continue;
    }
    const targetFocus = selectedStar === star ? 1 : 0;
    star.focus = lerp(star.focus || 0, targetFocus, 0.06);
    star.alpha = finalAlpha;

    const starSize = lerp(star.size ?? 1.5, 4.5, star.focus);

    push();

 let depth = map(star.z, -250, 250, 0.35, 1.0);

let localProgress = constrain(
  easedStars / depth,
  0,
  1
);

let enterY = lerp(height + 700 * depth, 0, localProgress);

translate(
  star.x,
  star.y + enterY,
  star.z + star.focus * 180
);

    star.screen = getScreenPointFromMatrix();

    noStroke();
    fill(
      currentScene === STAR_EXIT ? exitTone : star.brightness ?? 255,
      star.alpha
    );
    sphere(starSize);

    if (star.isAnchor && star.label) {
      const labelX = star.labelOffsetX ?? 18;
      const labelY = star.labelOffsetY ?? -12;

      // Undo constellation rotation so the text faces the camera.
      rotateX(-rotationX);
      rotateY(-rotationY);

      // Move to the exact place where the text is drawn.
      translate(labelX, labelY, 2);

      // Read the final matrix here: this is the same position as the label.
      const labelPosition = getScreenPointFromMatrix();

      noStroke();
      fill(exitTone, star.alpha);

      textSize(lerp(12, 17, star.focus));
      text(star.label, 0, 0);

      if (star.poem && star.alpha > 20 && labelPosition) {
        const labelWidth = textWidth(star.label);

        // p5 text begins at the current origin because textAlign(LEFT, CENTER).
        labelHitAreas.push({
          line: star,
          x: labelPosition.x + labelWidth / 2,
          y: labelPosition.y,
          w: labelWidth + 18,
          h: 30,
        });
      }
    }

    pop();
  }

  strokeWeight(0.55);

  for (const edge of constellationEdges) {
    const a = constellationStars[edge[0]];
    const b = constellationStars[edge[1]];

    if (!a || !b) continue;

    let visibility = min(a.alpha, b.alpha) * 0.18;

    stroke(currentScene === STAR_EXIT ? exitTone : 210, visibility);

    line(
      a.x,
      a.y,
      a.z + (a.focus || 0) * 180,
      b.x,
      b.y,
      b.z + (b.focus || 0) * 180
    );
  }

  pop();
}

function beginTransition(star) {
  transitionStar = star;
  const start = star.screen || { x: mouseX, y: mouseY };
  transitionStarScreen = {
    x: start.x - width / 2,
    y: start.y - height / 2,
    size: lerp(star.size ?? 1.5, 4.5, star.focus || 0),
  };

  startRotX = rotationX;
  startRotY = rotationY;
  exitRotStartX = rotationX;
  exitRotStartY = rotationY;
  exitRotTargetX = rotationX * 0.82;
  exitRotTargetY = rotationY * 0.82;

  currentScene = STAR_EXIT;
  sceneProgress = 0;
  soundEvent("playStarFallSound", STAR_EXIT_TIME);
}

function drawStarExit() {
  sceneProgress += (deltaTime / 1000) / STAR_EXIT_TIME;
  sceneProgress = constrain(sceneProgress, 0, 1);

  let t = easeInOutCubic(sceneProgress);

  let bg = easeInOutCubic(t);

  background(255 * bg);

  let starColor = lerp(255, 0, t);
  let glow = lerp(1, 2.2, bg);
  let size = lerp(1, 1.6, bg);

let constellationExit =
    lerp(0, -height * 1.4, easeInOutCubic(t));

drawConstellationStars(constellationExit);

  let fall = (height + 220) * t * t;
  let starX = transitionStarScreen.x;
  let starY = transitionStarScreen.y + fall;
  let c = lerp(255, 0, t);
  let tailLength = lerp(20, 160, constrain(t * 1.4, 0, 1));
  let tailAlpha = 180 * sin(PI * constrain(t, 0, 1));

  push();
  drawingContext.disable(drawingContext.DEPTH_TEST);
  translate(starX, starY);

  stroke(c, tailAlpha);
  strokeWeight(2.5);
  line(0, -tailLength, 0, -8);

  stroke(c, tailAlpha * 0.35);
  strokeWeight(7);
  line(0, -tailLength * 0.75, 0, -12);

  noStroke();

  fill(c, 10);
  sphere(46);

  fill(c, 25);
  sphere(24);

  fill(c, 95);
  sphere(11);

  fill(c);
  sphere(max(4, transitionStarScreen.size * 1.15));
  drawingContext.enable(drawingContext.DEPTH_TEST);
  pop();

  if (t >= 1) {
    currentScene = POEM;
    resetPoemSceneState();
    soundEvent(
      "startPoemSound",
      getSelectedPoemPage(),
      selectedStar ? selectedStar.pageKey || selectedStar.label : "poem"
    );
  }
}

function drawEmptySpace() {
  background(255);

  emptyTimer += deltaTime;

  if (emptyTimer > 1800) {
    currentScene = POEM;
    resetPoemSceneState();
    soundEvent(
      "startPoemSound",
      getSelectedPoemPage(),
      selectedStar ? selectedStar.pageKey || selectedStar.label : "poem"
    );
  }
}

function getSelectedPoemPage() {
  if (!selectedStar) return null;
  return selectedStar.poemPage || selectedStar.poem;
}

function resetPoemSceneState() {
  const key = selectedStar ? selectedStar.pageKey || selectedStar.label : "";
  poemSceneFade = 0;
  poemSceneTime = 0;

  if (key === "romance") {
    romanceRevealCount = 0;
    romanceVisualProgress = 0;
    romanceDarkProgress = 0;
    romanceBlockFades = [];
    resetRomanceStar();
  } else if (key === "elevation") {
    elevationBlockStates = [];
    elevationLetterStates = [];
  } else if (key === "sonnet14") {
    sonnetRevealLines = 0;
    sonnetRevealProgress = 0;
  } else if (key === "listen") {
    listenCursorX = width * 0.5;
    listenCursorY = height * 0.5;
    listenFollow = 1;
    listenRevealSections = 0;
    listenRevealProgress = 0;
  } else if (key === "eveningStar") {
    eveningParticles = [];
  }
}

function applyEditablePoemPages() {
  if (typeof window === "undefined" || !window.POEM_PAGES) return;

  const pageKeys = [
    "romance",
    "listen",
    "elevation",
    "sonnet14",
    "eveningStar",
  ];

  for (let i = 0; i < pageKeys.length; i++) {
    const star = constellationStars[i];
    const page = window.POEM_PAGES[pageKeys[i]];

    if (!star || !page) continue;

    star.pageKey = pageKeys[i];
    star.poemPage = {
      ...star.poem,
      ...page,
    };

    if (page.label) {
      star.label = page.label;
    }
  }
}

function getPoemPageStyle(poem) {
  const defaultStyle =
    typeof window !== "undefined" && window.POEM_PAGE_STYLE
      ? window.POEM_PAGE_STYLE
      : {};
  const customStyle = poem && poem.style ? poem.style : {};

  return {
    titleY: defaultStyle.titleY ?? 80,
    authorY: defaultStyle.authorY ?? 120,
    bodyX: defaultStyle.bodyX ?? 140,
    bodyY: defaultStyle.bodyY ?? 180,
    bodyRight: defaultStyle.bodyRight ?? 140,
    bodyBottom: defaultStyle.bodyBottom ?? 250,
    titleSize: defaultStyle.titleSize ?? 38,
    authorSize: defaultStyle.authorSize ?? 18,
    bodySize: defaultStyle.bodySize ?? 17,
    bodyLeading: defaultStyle.bodyLeading ?? 29,
    hintSize: defaultStyle.hintSize ?? 14,
    ...customStyle,
  };
}

function drawPoemPage() {
  if (!selectedStar) return;

  soundEvent("updateProjectSound");
  poemSceneTime += deltaTime / 1000;
  poemSceneFade = lerp(poemSceneFade, 1, 0.035);

  const poem = getSelectedPoemPage();
  const key = selectedStar.pageKey || selectedStar.label || "poem";
  const style = getPoemPageStyle(poem);
  const lineCount = (poem.text || "").split("\n").length;
  poemScrollMax = max(
    0,
    lineCount * style.bodyLeading - (height - style.bodyY - style.bodyBottom)
  );

  push();
  drawingContext.disable(drawingContext.DEPTH_TEST);
  translate(-width / 2, -height / 2);
  textFont(poemFont);
  textWrap(WORD);

  if (key === "romance") {
    drawRomancePoem(poem, style);
  } else if (key === "listen") {
    drawListenPoem(poem, style);
  } else if (key === "elevation") {
    drawElevationPoem(poem, style);
  } else if (key === "sonnet14") {
    drawSonnetPoem(poem, style);
  } else if (key === "eveningStar") {
    drawEveningStarPoem(poem, style);
  } else {
    drawSimplePoem(poem, style, {
      bg: [255, 255, 255],
      ink: [20, 20, 20],
      soft: [120, 120, 120],
    });
  }

  drawReturnHint(style);
  drawPoemEntranceOverlay(key);
  drawingContext.enable(drawingContext.DEPTH_TEST);
  pop();
}

function drawPoemEntranceOverlay(key) {
  if (poemSceneFade >= 0.995) return;

  const fade = easeInOutCubic(poemSceneFade);
  const whiteScenes = ["romance", "listen", "elevation", "sonnet14"];
  const tone = whiteScenes.includes(key) ? 255 : 0;

  noStroke();
  rectMode(CORNER);
  fill(tone, 255 * (1 - fade));
  rect(0, 0, width, height);
}

function poemLetters(poem) {
  const text = `${poem.title || ""} ${poem.author || ""} ${poem.text || ""}`;
  return text.replace(/\s+/g, "");
}

function drawPoemHeader(poem, style, ink, soft, align = CENTER) {
  const title = poem.title || selectedStar.label;
  textFont(nimbusFont);
  fill(ink[0], ink[1], ink[2], ink[3] ?? 255);
  noStroke();
  textAlign(align, CENTER);
  textSize(style.titleSize);
  text(title, align === LEFT ? style.bodyX : width / 2, style.titleY);

  fill(soft[0], soft[1], soft[2], soft[3] ?? 255);
  textSize(style.authorSize);
  text(poem.author, align === LEFT ? style.bodyX : width / 2, style.authorY);
  textFont(poemFont);
}

function drawPoemBody(poem, style, ink, x, y, w, h, sizeOffset = 0) {
  textFont(poemFont);
  fill(ink[0], ink[1], ink[2], ink[3] ?? 255);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(style.bodySize + sizeOffset);
  textLeading(style.bodyLeading);
  text(poem.text, x, y - poemScroll, w, h + poemScroll);
}

function drawReturnHint(style) {
  const key = selectedStar ? selectedStar.pageKey || selectedStar.label : "";
  let hint = "Click anywhere to return";

  if (key === "romance") {
    const blocks = getPoemBlocks(getSelectedPoemPage());
    hint =
      romanceRevealCount < blocks.length
        ? "Click to reveal"
        : "Click anywhere to return";
  } else if (key === "sonnet14") {
    const lines = getPoemTextLines(getSelectedPoemPage());
    hint =
      sonnetRevealLines < lines.length
        ? "Click to collect a line"
        : "Click anywhere to return";
  } else if (key === "listen") {
    const sections = getListenSections(getSelectedPoemPage());
    hint =
      listenRevealSections < sections.length
        ? "Click to complete text"
        : "Click anywhere to return";
  }

  fill(130, 130, 130, 190);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(style.hintSize);
  textFont(nimbusFont);
  text(hint, width / 2, height - 44);
  textFont(poemFont);
}

function drawSimplePoem(poem, style, palette) {
  background(palette.bg);
  drawPoemHeader(poem, style, palette.ink, palette.soft);
  drawPoemBody(
    poem,
    style,
    palette.ink,
    style.bodyX,
    style.bodyY,
    width - style.bodyX - style.bodyRight,
    height - style.bodyY - style.bodyBottom
  );
}

function drawElevationPoem(poem, style) {
  background(255);
  drawPoemHeader(poem, style, [0, 0, 0], [90, 90, 90], LEFT);
  drawElevationBlocks(poem, style);
}

function drawElevationBlocks(poem, style) {
  const blocks = getPoemBlocks(poem);
  const maxDist = min(width, height) * 0.36;
  const twoColumns = width > 820;
  const colW = twoColumns ? min(390, width * 0.34) : width - style.bodyX * 2;
  const startY = style.bodyY + 10;
  const rowGap = 142;
  const leftX = style.bodyX;
  const rightX = width - style.bodyX - colW;

  while (elevationBlockStates.length < blocks.length) {
    const i = elevationBlockStates.length;
    const origX = twoColumns && i % 2 === 1 ? rightX : leftX;
    const origY = startY + floor(i / (twoColumns ? 2 : 1)) * rowGap;

    elevationBlockStates.push({
      x: origX,
      y: origY,
      size: max(13, style.bodySize - 2),
      alpha: 0,
    });
  }

  textFont(poemFont);
  textAlign(LEFT, TOP);
  noStroke();

  for (let i = 0; i < blocks.length; i++) {
    const state = elevationBlockStates[i];
    const origX = twoColumns && i % 2 === 1 ? rightX : leftX;
    const origY = startY + floor(i / (twoColumns ? 2 : 1)) * rowGap;
    const blockCenterX = origX + colW * 0.5;
    const blockCenterY = origY + 55;
    const d = dist(blockCenterX, blockCenterY, mouseX, mouseY);
    const pull = constrain(1 - d / maxDist, 0, 1);
    const easedPull = pull * pull * (3 - 2 * pull);
    const targetX = lerp(origX, mouseX - colW * 0.5, easedPull * 0.75);
    const targetY = lerp(origY, mouseY - 46, easedPull * 0.75);
    const targetSize = lerp(max(13, style.bodySize - 2), max(10, style.bodySize - 6), easedPull);
    const targetAlpha = lerp(210, 255, easedPull);

    state.x = lerp(state.x, targetX, 0.08);
    state.y = lerp(state.y, targetY, 0.08);
    state.size = lerp(state.size, targetSize, 0.08);
    state.alpha = lerp(state.alpha, targetAlpha, 0.06);

    drawDispersingTextBlock(
      blocks[i],
      state.x,
      state.y,
      colW,
      state.size,
      state.size * 1.42,
      state.alpha,
      i * 220
    );
  }
}

function drawDispersingTextBlock(block, baseX, baseY, maxW, size, leading, alpha, stateOffset) {
  textFont(poemFont);
  textAlign(LEFT, TOP);
  textSize(size);
  noStroke();

  const lines = block.split("\n");
  let stateIndex = stateOffset;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    let x = baseX;
    let y = baseY + lineIndex * leading;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      const chW = textWidth(ch || " ");

      if (x - baseX + chW > maxW && ch === " ") {
        x = baseX;
        y += leading;
      }

      while (elevationLetterStates.length <= stateIndex) {
        elevationLetterStates.push({ ox: 0, oy: 0, phase: random(TWO_PI) });
      }

      const state = elevationLetterStates[stateIndex];
      const d = dist(x, y, mouseX, mouseY);
      const loosen = easeInOutCubic(constrain(1 - d / 150, 0, 1));
      const direction = stateIndex * 1.618 + state.phase;
      const targetX = cos(direction) * 24 * loosen + sin(frameCount * 0.024 + state.phase) * 5 * loosen;
      const targetY = (12 + sin(direction) * 20) * loosen;

      state.ox = lerp(state.ox, targetX, 0.075);
      state.oy = lerp(state.oy, targetY, 0.075);

      fill(0, alpha * poemSceneFade);
      text(ch, x + state.ox, y + state.oy);
      drawElevationLetterParticles(x, y, stateIndex, loosen, alpha);
      x += chW;
      stateIndex++;
    }
  }
}

function drawElevationLetterParticles(x, y, seed, loosen, alpha) {
  if (loosen <= 0.03) return;

  const count = 2 + floor(loosen * 4);
  noStroke();

  for (let i = 0; i < count; i++) {
    const phase = seed * 0.73 + i * 2.17;
    const fall = ((frameCount * (0.35 + i * 0.06) + seed * 3 + i * 19) % 42) * loosen;
    const spread = sin(frameCount * 0.035 + phase) * 18 * loosen;
    const px = x + cos(phase) * 8 * loosen + spread;
    const py = y + sin(phase) * 4 * loosen + fall;
    const particleAlpha = alpha * poemSceneFade * loosen * (0.32 + i * 0.08);
    const size = 1 + loosen * 1.8 + (i % 2) * 0.4;

    fill(0, particleAlpha);
    circle(px, py, size);
  }
}

function drawRomancePoem(poem, style) {
  const blocks = getPoemBlocks(poem);
  const revealProgress = blocks.length
    ? constrain(romanceRevealCount / blocks.length, 0, 1)
    : 1;
  romanceVisualProgress = lerp(romanceVisualProgress, revealProgress, 0.055);
  const allBlocksOpen = blocks.length > 0 && romanceRevealCount >= blocks.length;
  romanceDarkProgress = lerp(romanceDarkProgress, allBlocksOpen ? 1 : 0, 0.028);
  const darkProgress = smoothDarkProgress(romanceDarkProgress);
  const pulse = allBlocksOpen ? sin(frameCount * 0.035) * 4 * darkProgress : 0;
  const bgTone = lerp(244, 0, darkProgress);
  const inkTone = contrastTone(bgTone);
  const cloudTone = contrastTone(bgTone);

  background(constrain(bgTone + pulse, 0, 255));
  const lettersSource = poemLetters(poem);
  const pixelScale = 7;
  const cutoff = 0.52;
  const t = millis() / 100000;
  let index = 0;

  textFont(poemFont);
  textAlign(CENTER, CENTER);
  for (let x = 0; x <= width; x += pixelScale) {
    for (let y = 0; y <= height; y += pixelScale) {
      const n = noise(x * 0.008 + t * 6, y * 0.008 + t * 1.6, t * 4);
      if (n < cutoff) continue;

      const alpha = map(n, cutoff, 0.72, 18, 150, true) * poemSceneFade;
      fill(cloudTone, alpha * (0.55 + romanceVisualProgress * 0.45));
      textSize(pixelScale * 1.22);
      text(lettersSource[index % lettersSource.length], x, y);
      index++;
    }
  }

  drawRomanceStar(darkProgress, bgTone);
  drawPoemHeader(poem, style, [inkTone, inkTone, inkTone], [inkTone, inkTone, inkTone, 170], LEFT);
  drawRomanceBlocks(blocks, style, inkTone, bgTone);
}

function smoothDarkProgress(progress) {
  const delayed = constrain((progress - 0.08) / 0.92, 0, 1);
  return delayed * delayed * (3 - 2 * delayed);
}

function contrastTone(bgTone) {
  return bgTone > 118 ? 0 : 255;
}

function getPoemBlocks(poem) {
  return (poem.text || "")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function getPoemTextLines(poem) {
  return (poem.text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function getListenSections(poem) {
  const lines = (poem.text || "").split("\n");
  const marker = lines.map((line) => line.trim()).find(Boolean) || "";
  const sections = [];
  let current = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const startsNew = marker && trimmed === marker && current.length > 0;

    if (startsNew) {
      sections.push(current);
      current = [];
    }

    current.push(line);
  }

  if (current.length) {
    sections.push(current);
  }

  return sections;
}

function drawRomanceBlocks(blocks, style, inkTone, bgTone) {
  const visible = min(romanceRevealCount, blocks.length);
  const bodySize = max(12, style.bodySize - 3);
  const bodyLeading = max(18, style.bodyLeading - 8);
  const twoColumns = width > 980;
  const colW = twoColumns ? min(330, width * 0.27) : min(430, width - style.bodyX * 2);
  const rowGap = max(126, bodyLeading * 5.2);
  const startY = style.bodyY + 6;
  const leftX = twoColumns ? width - colW * 2 - 116 : width - colW - 70;
  const rightX = width - colW - 70;

  textFont(poemFont);
  textAlign(LEFT, TOP);
  textSize(bodySize);
  textLeading(bodyLeading);
  noStroke();

  while (romanceBlockFades.length < blocks.length) {
    romanceBlockFades.push(0);
  }

  for (let i = 0; i < visible; i++) {
    romanceBlockFades[i] = lerp(romanceBlockFades[i], 1, 0.075);
    const fade = easeInOutCubic(romanceBlockFades[i]);
    const blockAlpha = map(i, 0, max(1, blocks.length - 1), 185, 255);
    const alpha =
      (bgTone > 92 ? min(255, blockAlpha + 35) : blockAlpha) *
      fade *
      poemSceneFade;
    const col = twoColumns ? i % 2 : 0;
    const row = twoColumns ? floor(i / 2) : i;
    const xBase = col === 0 ? leftX : rightX;
    const xOffset = (col === 0 ? -1 : 1) * sin(i * 1.7) * 8;
    const x = xBase + xOffset;
    const y = startY + row * rowGap;
    const revealY = y + (1 - fade) * 18;

    fill(inkTone, alpha);
    text(blocks[i], x, revealY, colW, rowGap - 8);
  }
}

function drawRomanceStar(progress, bgTone) {
  if (!romanceStar) {
    resetRomanceStar();
  }

  romanceStar.age += deltaTime / 1000;
  const lifeProgress = romanceStar.age / romanceStar.life;

  if (lifeProgress >= 1) {
    resetRomanceStar();
    return;
  }

  const fade = sin(PI * lifeProgress);
  const tone = contrastTone(bgTone);
  const alpha = fade * (bgTone > 118 ? 130 : 245) * poemSceneFade;
  const pulse = 1 + sin(frameCount * 0.05 + romanceStar.phase) * 0.12;

  noStroke();
  fill(tone, alpha * 0.1);
  circle(romanceStar.x, romanceStar.y, romanceStar.size * 15 * pulse);
  fill(tone, alpha * 0.2);
  circle(romanceStar.x, romanceStar.y, romanceStar.size * 7 * pulse);
  fill(tone, alpha);
  circle(romanceStar.x, romanceStar.y, romanceStar.size * pulse);
}

function resetRomanceStar() {
  romanceStar = {
    x: random(width * 0.12, width * 0.88),
    y: random(height * 0.16, height * 0.84),
    size: random(3.5, 7.5),
    age: 0,
    life: random(2.4, 4.8),
    phase: random(TWO_PI),
  };
}

function drawSonnetPoem(poem, style) {
  background(246);
  const lettersSource = poemLetters(poem);
  const cx = width * 0.5;
  const cy = height * 0.52;
  const radius = min(width, height) * 0.28;
  const lines = getPoemTextLines(poem);
  sonnetRevealProgress = lerp(sonnetRevealProgress, sonnetRevealLines, 0.08);
  const collected = lines.length ? constrain(sonnetRevealProgress / lines.length, 0, 1) : 1;
  const total = min(lettersSource.length, 620);
  const t = frameCount * 0.01;

  stroke(0, 16 * (1 - collected * 0.55) * poemSceneFade);
  noFill();
  for (let r = 0.25; r <= 1.05; r += 0.16) {
    beginShape();
    for (let a = 0; a <= TWO_PI + 0.08; a += 0.08) {
      const warp = sin(a * 7 + t * 2.2 + r * 8) * 12 + cos(a * 3 - t) * 7;
      vertex(cx + cos(a) * (radius * r + warp), cy + sin(a) * (radius * r + warp * 0.8));
    }
    endShape();
  }

  noStroke();
  textAlign(CENTER, CENTER);
  for (let i = 0; i < total; i++) {
    const a = (i / total) * TWO_PI * 9 + t * (1 + (i % 5) * 0.04);
    const rose = cos(a * 2.5 + t + i * 0.01);
    const ring = 0.24 + 0.78 * ((i % 47) / 47);
    const wave = sin(t * 2 + i * 0.19) * 20;
    const collapse = collected * (0.1 + (i % 7) * 0.018);
    const x = lerp(cx + cos(a) * (radius * ring + rose * 34 + wave), cx, collapse);
    const y = lerp(cy + sin(a * 0.92) * (radius * ring + rose * 20 + wave * 0.45), cy, collapse);
    const alpha = map(ring, 0.24, 1.02, 220, 55) * (1 - collected) * poemSceneFade;
    const sizePulse = sin(t * 3 + i * 0.23) * 1.5;

    fill(0, alpha);
    textSize(7 + ring * 8 + sizePulse);
    text(lettersSource[i], x, y);
  }

  drawPoemHeader(poem, style, [0, 0, 0, 255 * poemSceneFade], [95, 95, 95, 210 * poemSceneFade], CENTER);
  drawCollectedSonnetLines(lines, style);
}

function drawCollectedSonnetLines(lines, style) {
  const lineSize = max(12, style.bodySize - 5);
  const lineGap = max(20, style.bodyLeading - 7);
  const startY = height * 0.5 - (lines.length * lineGap) * 0.5;
  const w = min(width * 0.72, 760);
  const x = width * 0.5 - w * 0.5;

  textFont(poemFont);
  textAlign(CENTER, TOP);
  textSize(lineSize);
  noStroke();

  for (let i = 0; i < lines.length; i++) {
    const reveal = easeInOutCubic(constrain(sonnetRevealProgress - i, 0, 1));
    if (reveal <= 0) continue;

    const gatherY = startY + i * lineGap + (1 - reveal) * 32;
    const gatherX = x + sin(frameCount * 0.02 + i) * 18 * (1 - reveal);
    fill(0, 230 * reveal * poemSceneFade);
    text(lines[i], gatherX, gatherY, w, lineGap * 1.25);
  }
}

function drawListenPoem(poem, style) {
  background(255);
  const t = frameCount * 0.018;

  drawListenCursorStars(t);

  drawPoemHeader(poem, style, [8, 8, 8, 240 * poemSceneFade], [55, 55, 55, 190 * poemSceneFade], LEFT);
  drawListenParticleText(poem, style);
}

function drawListenCursorStars(t) {
  listenFollow = lerp(listenFollow, 1, 0.0055);
  listenCursorX = lerp(listenCursorX, mouseX, 0.018);
  listenCursorY = lerp(listenCursorY, mouseY, 0.018);

  noStroke();

  fill(0, 10 * poemSceneFade);
  circle(listenCursorX, listenCursorY, 170 + sin(t * 1.1) * 16);
  fill(0, 18 * poemSceneFade);
  circle(listenCursorX, listenCursorY, 70 + sin(t * 1.7) * 8);

  for (let i = 0; i < 86; i++) {
    const col = i % 12;
    const row = floor(i / 12);
    const originX = width * (0.08 + col * 0.076) + sin(i * 2.1) * 26;
    const originY = height * (0.11 + row * 0.108) + cos(i * 1.7) * 20;
    const pull = listenFollow * (0.11 + (i % 5) * 0.012);
    const orbit = sin(t * 0.55 + i) * (4 + (i % 4) * 1.4);
    const x = lerp(originX, listenCursorX, pull) + cos(i * 2.399 + t * 0.35) * orbit;
    const y = lerp(originY, listenCursorY, pull) + sin(i * 2.399 + t * 0.28) * orbit * 0.8;
    const pulse = sin(t * 2.1 + i * 0.57) * 0.5 + 0.5;
    const alpha = (24 + pulse * 82) * poemSceneFade;
    const size = 1 + pulse * 2.2;

    fill(0, alpha * 0.06);
    circle(x, y, size * 9);
    fill(0, alpha);
    circle(x, y, size);
  }
}

function drawListenParticleText(poem, style) {
  const sections = getListenSections(poem);
  const x = width * 0.46;
  const y = 165 - poemScroll;
  const lineSize = max(11, style.bodySize - 5);
  const lineGap = max(18, style.bodyLeading - 8);
  const maxW = width * 0.43;
  listenRevealProgress = lerp(listenRevealProgress, listenRevealSections, 0.055);

  textFont(poemFont);
  textAlign(LEFT, TOP);
  textSize(lineSize);
  textLeading(lineGap);
  noStroke();

  let globalLine = 0;

  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
    const section = sections[sectionIndex];
    const sectionProgress = constrain(listenRevealProgress - sectionIndex, 0, 1);

    if (sectionProgress <= 0) {
      globalLine += section.length;
      continue;
    }

    for (let localLine = 0; localLine < section.length; localLine++) {
      const line = section[localLine];
      const lineY = y + globalLine * lineGap;
      const activeLines = max(1, section.filter((item) => item.trim() !== "").length);
      const lineDelay = localLine / max(1, activeLines + 1.5);
      const reveal = easeInOutCubic(constrain((sectionProgress - lineDelay) / 0.22, 0, 1));

      globalLine++;

      if (lineY < 130 || lineY > height - 90) continue;
      if (line.trim() === "") continue;

      if (reveal < 0.985) {
        const particleCount = min(52, max(14, floor(line.length * 1.15)));
        const textW = min(maxW, textWidth(line));
        for (let p = 0; p < particleCount; p++) {
          const k = particleCount <= 1 ? 0 : p / (particleCount - 1);
          const targetX = x + k * textW;
          const targetY = lineY + lineSize * 0.62;
          const seed = sectionIndex * 97 + localLine * 41 + p * 13;
          const starX = width * (0.08 + ((seed % 17) / 16) * 0.84) + sin(seed) * 18;
          const starY = height * (0.12 + (((seed * 7) % 19) / 18) * 0.76) + cos(seed) * 16;
          const arc = sin(k * PI) * 70 * (1 - reveal);
          const swirl = sin(frameCount * 0.028 + seed) * 26 * (1 - reveal);
          const px = lerp(starX, targetX, reveal) + cos(seed) * arc + swirl;
          const py = lerp(starY, targetY, reveal) - arc * 0.55 + cos(frameCount * 0.022 + seed) * 18 * (1 - reveal);
          const alpha = sin((1 - reveal) * PI) * 155 * poemSceneFade;
          const size = 1.1 + sin(frameCount * 0.04 + seed) * 0.4 + (1 - reveal) * 2.8;

          fill(0, alpha * 0.07);
          circle(px, py, size * 8);
          fill(0, alpha);
          circle(px, py, size);
        }
      }

      fill(34, 34, 34, 220 * reveal * poemSceneFade);
      text(line, x, lineY, maxW, lineGap * 1.2);
    }
  }
}

function drawEveningStarPoem(poem, style) {
  background(0);
  const horizon = height * 0.58;
  const t = frameCount * 0.012;
  const gradientFade = easeInOutCubic(constrain(poemSceneTime / 2.4, 0, 1));

  noStroke();
  for (let y = 0; y < height; y += 3) {
    const k = y / height;
    const tone = lerp(35, 0, k) * gradientFade;
    fill(tone, 255);
    rect(0, y, width, 4);
  }

  fill(255, 230 * gradientFade);
  circle(width * 0.78, height * 0.23, 8);
  fill(255, 34 * gradientFade);
  circle(width * 0.78, height * 0.23, 64);

  drawEveningGeneratedAnimation(horizon, t);

  drawPoemHeader(poem, style, [255, 255, 255, 255 * poemSceneFade], [170, 170, 170, 205 * poemSceneFade], LEFT);
  drawEveningFadingBlocks(poem, style);
}

function drawEveningFadingBlocks(poem, style) {
  const blocks = getPoemBlocks(poem);
  const size = max(11, style.bodySize - 6);
  const leading = max(18, style.bodyLeading - 8);
  const colW = min(width * 0.48, 620);
  let y = style.bodyY - poemScroll;

  textFont(poemFont);
  textAlign(LEFT, TOP);
  textSize(size);
  textLeading(leading);
  noStroke();

  for (let i = 0; i < blocks.length; i++) {
    const reveal = easeInOutCubic(constrain((poemSceneTime - 0.45 - i * 0.55) / 1.1, 0, 1));
    const blockHeight = getTextBlockHeight(blocks[i], size, leading, colW);

    if (y + blockHeight > style.authorY && y < height - 80) {
      fill(255, 215 * reveal * poemSceneFade);
      text(blocks[i], style.bodyX, y + (1 - reveal) * 14, colW, blockHeight + 20);
    }

    y += blockHeight + 20;
  }
}

function getTextBlockHeight(block, size, leading, colW) {
  const lines = block.split("\n");
  let count = 0;

  for (const line of lines) {
    count += max(1, ceil((line.length * size * 0.52) / colW));
  }

  return count * leading;
}

function drawEveningGeneratedAnimation(horizon, t) {
  while (eveningParticles.length < 120) {
    eveningParticles.push(createEveningParticle(true));
  }

  strokeWeight(1);
  for (let i = 0; i < 18; i++) {
    const anchorX = width * (0.1 + i * 0.047);
    const anchorY = height * (0.2 + ((i * 7) % 9) * 0.045);
    const tipX = anchorX + sin(t * 1.4 + i) * 42;
    const tipY = horizon + cos(t + i * 0.7) * 38;
    const alpha = (12 + sin(t * 1.8 + i) * 7) * poemSceneFade;

    stroke(255, alpha);
    noFill();
    beginShape();
    for (let s = 0; s <= 1.001; s += 0.08) {
      const bend = sin(s * PI + t * 2 + i) * 28;
      vertex(lerp(anchorX, tipX, s) + bend, lerp(anchorY, tipY, s));
    }
    endShape();
  }

  noStroke();
  for (let i = 0; i < eveningParticles.length; i++) {
    const p = eveningParticles[i];
    p.y += p.speed;
    p.x += sin(t * 1.3 + p.phase) * p.drift;

    if (p.y > height + 18 || p.x < -30 || p.x > width + 30) {
      eveningParticles[i] = createEveningParticle(false);
      continue;
    }

    const wave = sin(t * 2 + p.phase) * 0.5 + 0.5;
    const alpha = (18 + wave * 76) * poemSceneFade;
    const glow = p.size * (7 + wave * 8);

    fill(255, alpha * 0.08);
    circle(p.x, p.y, glow);
    fill(255, alpha);
    circle(p.x, p.y, p.size);
  }
}

function createEveningParticle(scattered) {
  return {
    x: random(width * 0.05, width * 0.95),
    y: scattered ? random(height * 0.1, height * 0.95) : random(-40, height * 0.15),
    size: random(0.9, 2.6),
    speed: random(0.08, 0.34),
    drift: random(-0.22, 0.22),
    phase: random(TWO_PI),
  };
}

function getScreenPointFromMatrix() {
  const m = _renderer.uMVMatrix.mat4;
  const p = _renderer.uPMatrix.mat4;

  // Current model origin (0, 0, 0) transformed by model-view matrix.
  const mvX = m[12];
  const mvY = m[13];
  const mvZ = m[14];
  const mvW = m[15];

  const clipX = p[0] * mvX + p[4] * mvY + p[8] * mvZ + p[12] * mvW;

  const clipY = p[1] * mvX + p[5] * mvY + p[9] * mvZ + p[13] * mvW;

  const clipW = p[3] * mvX + p[7] * mvY + p[11] * mvZ + p[15] * mvW;

  if (!Number.isFinite(clipW) || clipW === 0) return null;

  return {
    x: ((clipX / clipW) * 0.5 + 0.5) * width,
    y: (1 - ((clipY / clipW) * 0.5 + 0.5)) * height,
  };
}

function mouseWheel(event) {
  if (currentScene !== POEM) return;

  poemScroll += event.delta;
  poemScroll = constrain(poemScroll, 0, poemScrollMax);

  return false;
}

function mousePressed() {
  soundEvent("ensureProjectSound");

  if (currentScene === INTRO) {
    handleIntroClick();
    return;
  }

  if (currentScene === CONSTELLATION) {
    handleConstellationClick();
    return;
  }

  if (currentScene === POEM) {
    handlePoemClick();
    return;
  }
}

function mouseDragged() {
  if (currentScene !== CONSTELLATION) return;

  targetRotY += movedX * 0.002;
  targetRotX += movedY * 0.002;
}

function handleIntroClick() {
  if (!frozen || transition) return;

  const mx = mouseX - width / 2;
  const my = mouseY - height / 2;

  const inside =
    mx > button.x - button.w / 2 &&
    mx < button.x + button.w / 2 &&
    my > button.y - button.h / 2 &&
    my < button.y + button.h / 2;

  if (inside) {
    transition = true;
    scene2Time = 0;
    soundEvent("setProjectSoundScene", "introTransition");
  }
}

function handleConstellationClick() {
  let clicked = null;
  let closest = Infinity;

  for (const area of labelHitAreas) {
    const dx = mouseX - area.x;
    const dy = mouseY - area.y;

    const inside = abs(dx) < area.w / 2 && abs(dy) < area.h / 2;

    if (inside) {
      const d = dist(mouseX, mouseY, area.x, area.y);

      if (d < closest) {
        closest = d;
        clicked = area.line;
      }
    }
  }

  if (!clicked) {
    selectedStar = null;
    return;
  }

  poemScroll = 0;

  selectedStar = clicked;

  poemTransition = 0;

  beginTransition(clicked);
}

function handlePoemClick() {
  const key = selectedStar ? selectedStar.pageKey || selectedStar.label : "";

  if (key === "romance") {
    const poem = getSelectedPoemPage();
    const blocks = getPoemBlocks(poem);

    if (romanceRevealCount < blocks.length) {
      romanceRevealCount++;
      return;
    }

    if (romanceDarkProgress < 0.96) {
      return;
    }
  } else if (key === "sonnet14") {
    const poem = getSelectedPoemPage();
    const lines = getPoemTextLines(poem);

    if (sonnetRevealLines < lines.length) {
      sonnetRevealLines++;
      return;
    }
  } else if (key === "listen") {
    const poem = getSelectedPoemPage();
    const sections = getListenSections(poem);

    if (listenRevealSections < sections.length) {
      listenRevealSections++;
      return;
    }
  }

  currentScene = CONSTELLATION;
  soundEvent("stopProjectSound");

  transitionStar = null;
  sceneProgress = 0;
  emptyTimer = 0;
}

class DissolveParticle {
  constructor(x, y, z) {
    this.x = x + random(-3, 3);
    this.y = y + random(-3, 3);
    this.z = z + random(-3, 3);
    let angle = random(TWO_PI);
    let speed = random(0.4, 2.5);

    this.vx = cos(angle) * speed;
    this.vy = sin(angle) * speed;
    this.vz = random(-0.8, 0.8);

    this.life = 255;
    this.size = random(1, 4);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;

    this.life -= 0.8;
  }

  draw() {
    push();

    translate(this.x, this.y, this.z);

    noStroke();
    fill(255, this.life);

    sphere(this.size);

    pop();
  }
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
