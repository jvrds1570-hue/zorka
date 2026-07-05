let font;
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
  font = loadFont("nimbus-mono.bold.otf");
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

  textFont(font);
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
    bodySize: defaultStyle.bodySize ?? 20,
    bodyLeading: defaultStyle.bodyLeading ?? 34,
    hintSize: defaultStyle.hintSize ?? 14,
    ...customStyle,
  };
}

function drawPoemPage() {
  background(255);

  if (!selectedStar) return;

  soundEvent("updateProjectSound");

  let poem = getSelectedPoemPage();
  const style = getPoemPageStyle(poem);
  const title = poem.title || selectedStar.label;

  push();

  translate(-width / 2, -height / 2);

  fill(20);
  noStroke();

  textAlign(CENTER);

  textSize(style.titleSize);
  text(title, width / 2, style.titleY);

  textSize(style.authorSize);
  fill(120);
  text(poem.author, width / 2, style.authorY);

  fill(20);

  textAlign(LEFT);

  textSize(style.bodySize);

  textLeading(style.bodyLeading);

  text(
    poem.text,
    style.bodyX,
    style.bodyY,
    width - style.bodyX - style.bodyRight,
    height - style.bodyY - style.bodyBottom
  );

  fill(140);

  textSize(style.hintSize);

  textAlign(CENTER);

  text("Click anywhere to return", width / 2, height - 60);

  pop();
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
