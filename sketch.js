let font;

let letters = [];
let particles = [];

let frozen = false;
let freezeProgress = 0;

let hoverAnim = 0;

let transition = false;
let transitionProgress = 0;

let starReleased = false;

let cursorTransition = 0;
let cursorTransitionActive = false;

let x = 0;
let y = 50;

let glowPulse = 0;

let poemAlpha = 0;

let constellationStars = [];
let constellationEdges = [];

const SUPPORT_STAR_COUNT = 18;
const CONNECTION_DISTANCE = 30;
const MAX_CONNECTIONS_PER_STAR = 2;

let bgStars = [];

let constellationRotX = 0;
let constellationRotY = 0;

let targetRotX = 0;
let targetRotY = 0;

let scene2Time = 0;

let constellationAlpha = 0;

let selectedStar = null;
let labelHitAreas = [];

let poemScroll = 0;
let poemScrollMax = 0;

const WORD_HOLD_TIME = 0.8; // word stays visible first
const WORD_FADE_TIME = 2.5; // slow fade-out
const STARS_ENTER_DELAY = 1.4;
const STARS_ENTER_TIME = 1.4;

const button = {
  x: -100,
  y: 50,
  w: 650,
  h: 300,
};

function preload() {
  font = loadFont("nimbus-mono.bold.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  textFont(font);
  textWrap(CHAR);

  noCursor();

  letters = [
    {
      char: "z",
      size: 250,
      sx: -1050,
      sy: 1050,
      sz: -700,
      tx: -400,
      ty: 50,
      tz: 0,
    },
    {
      char: "O",
      size: 300,
      sx: -1350,
      sy: -550,
      sz: -300,
      tx: -270,
      ty: 50,
      tz: 0,
    },
    {
      char: "R",
      size: 200,
      sx: 1300,
      sy: 150,
      sz: -200,
      tx: -95,
      ty: -5,
      tz: 0,
    },
    {
      char: "k",
      size: 350,
      sx: 1020,
      sy: -1200,
      sz: -300,
      tx: 0,
      ty: 50,
      tz: 0,
    },
    {
      char: "a",
      size: 300,
      sx: -1620,
      sy: 270,
      sz: -400,
      tx: 195,
      ty: 80,
      tz: 0,
    },
  ];

  const z2 = random(-150, 150);
  const z3 = random(-150, 150);
  const z4 = random(-150, 150);
  const z5 = random(-150, 150);
  const z6 = random(-150, 150);
  const z7 = random(-150, 150);

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
    {
      x: 60,
      y: 170,
      z: z7,
      z2,
      label: "Another text",
      labelOffsetX: 18,
      labelOffsetY: -12,

      isAnchor: true,
      size: 3.2,
      brightness: 255,
      alpha: 0,

      focus: 0,

      poem: {
        author: "",
        text: "",
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

  const ANCHOR_STAR_COUNT = 6;
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
    }
  }

  let bg = lerp(255, 0, transitionProgress);
  background(bg);

  if (!frozen) {
    let progress = constrain(map(mouseX, 0, width, 0, 1), 0, 1);

    freezeProgress = lerp(freezeProgress, progress, 0.1);

    if (freezeProgress > 0.99) {
      freezeProgress = 1;
      frozen = true;
    }
  }

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

  drawLetterParticles();

  if (frozen) {
    drawBackgroundStars();
  }

  if (!cursorTransitionActive) {
    drawCenterStar();
  } else if (!starReleased) {
    drawStarTransition();
  }

  if (starReleased && scene2Time >= STARS_ENTER_DELAY) {
    drawStarCursor();
    constellationAlpha = lerp(constellationAlpha, 255, 0.02);

    drawPoem();

    drawPoemInfo();
  }
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

function drawPoem() {
  push();

  const starsProgress = rangeProgress(
    scene2Time,
    STARS_ENTER_DELAY,
    STARS_ENTER_TIME
  );

  const easedStars = easeInOutCubic(starsProgress);
  const starsOffsetY = lerp(height + 350, 0, easedStars);
  const starsAlpha = 255 * easedStars;

  translate(0, starsOffsetY, 0);

  const center = getConstellationCenter();

  constellationRotX = lerp(constellationRotX, targetRotX, 0.035);
  constellationRotY = lerp(constellationRotY, targetRotY, 0.035);

  const rotationX =
    constellationRotX + cos(frameCount * 0.0012) * 0.01;

  const rotationY =
    constellationRotY + sin(frameCount * 0.0015) * 0.015;

  translate(center.x, center.y, center.z);
  rotateY(rotationY);
  rotateX(rotationX);
  translate(-center.x, -center.y, -center.z);

  textAlign(LEFT, CENTER);
  labelHitAreas = [];

  const finalAlpha = constellationAlpha * (starsAlpha / 255);

  // Draw stars and labels once.
  for (const star of constellationStars) {
    const targetFocus = selectedStar === star ? 1 : 0;
    star.focus = lerp(star.focus || 0, targetFocus, 0.06);
    star.alpha = finalAlpha;

    const starSize = lerp(star.size ?? 1.5, 4.5, star.focus);

    push();

    translate(star.x, star.y, star.z + star.focus * 180);

    noStroke();
    fill(star.brightness ?? 255, star.alpha);
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
fill(255, star.alpha);

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
}}

    pop();
  }

  // Explicit constellation structure.
  strokeWeight(0.55);

  for (const edge of constellationEdges) {
    const a = constellationStars[edge[0]];
    const b = constellationStars[edge[1]];

    if (!a || !b) continue;

    const visibility = min(a.alpha, b.alpha) * 0.18;

    stroke(210, visibility);

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

function getScreenPointFromMatrix() {
  const m = _renderer.uMVMatrix.mat4;
  const p = _renderer.uPMatrix.mat4;

  // Current model origin (0, 0, 0) transformed by model-view matrix.
  const mvX = m[12];
  const mvY = m[13];
  const mvZ = m[14];
  const mvW = m[15];

  const clipX =
    p[0] * mvX +
    p[4] * mvY +
    p[8] * mvZ +
    p[12] * mvW;

  const clipY =
    p[1] * mvX +
    p[5] * mvY +
    p[9] * mvZ +
    p[13] * mvW;

  const clipW =
    p[3] * mvX +
    p[7] * mvY +
    p[11] * mvZ +
    p[15] * mvW;

  if (!Number.isFinite(clipW) || clipW === 0) return null;

  return {
    x: (clipX / clipW * 0.5 + 0.5) * width,
    y: (1 - (clipY / clipW * 0.5 + 0.5)) * height,
  };
}

function drawPoemInfo() {
  if (!selectedStar || !selectedStar.poem) return;

  const poem = selectedStar.poem;

  const panelX = 36;
  const panelY = 36;
  const panelW = min(520, width - 72);
  const panelH = min(height - 72, 620);

  const padding = 26;
  const titleY = panelY + padding;
  const authorY = titleY + 32;
  const textY = authorY + 30;
  const footerH = 34;

  const textX = panelX + padding;
  const textW = panelW - padding * 2;
  const textH = panelH - (textY - panelY) - footerH - padding;

  push();

  // Convert WEBGL-centered coordinates to normal screen coordinates.
  translate(-width / 2, -height / 2);

  noStroke();
  fill(0, 220);
  rect(panelX, panelY, panelW, panelH, 14);

  textAlign(LEFT, TOP);

  fill(255);
  textSize(16);
  text(selectedStar.label, textX, titleY);

  fill(255, 170);
  textSize(11);
  text(poem.author, textX, authorY);

  textSize(13);
  const lineHeight = 19;
  textLeading(lineHeight);

  const lines = wrapPoemText(poem.text, textW);
  const contentHeight = lines.length * lineHeight;

  poemScrollMax = max(0, contentHeight - textH);
  poemScroll = constrain(poemScroll, 0, poemScrollMax);

  // Draw only lines currently inside the text area.
  const firstVisibleLine = max(0, floor(poemScroll / lineHeight) - 1);
  const lastVisibleLine = min(
    lines.length,
    ceil((poemScroll + textH) / lineHeight) + 1
  );

  fill(255, 225);

  for (let i = firstVisibleLine; i < lastVisibleLine; i++) {
    const lineY = textY + i * lineHeight - poemScroll;

    // Avoid drawing lines above/below the intended text area.
    if (lineY >= textY - lineHeight && lineY <= textY + textH) {
      text(lines[i], textX, lineY);
    }
  }

  fill(255, 125);
  textSize(11);

  const hint =
    poemScrollMax > 0
      ? "Scroll to read • Click outside a label to close"
      : "Click outside a label to close";

  text(hint, textX, panelY + panelH - 24);

  pop();
}

function wrapPoemText(source, maxWidth) {
  const output = [];
  const paragraphs = source.split("\n");

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === "") {
      output.push("");
      continue;
    }

    const words = paragraph.split(" ");
    let currentLine = "";

    for (const word of words) {
      const candidate = currentLine ? `${currentLine} ${word}` : word;

      if (textWidth(candidate) <= maxWidth) {
        currentLine = candidate;
      } else {
        if (currentLine) output.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine) output.push(currentLine);
  }

  return output;
}

function mouseWheel(event) {
  if (!selectedStar || poemScrollMax <= 0) return;

  poemScroll += event.delta;
  poemScroll = constrain(poemScroll, 0, poemScrollMax);

  return false;
}

function mouseDragged() {
  if (!starReleased) return;

  // Drag changes the target slowly
  targetRotY += movedX * 0.002;
  targetRotX += movedY * 0.002;
}

function mousePressed() {
  // Scene 1: zOrka is the start button
  if (frozen && !transition) {
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
    }

    return;
  }

  // Scene 2: poem labels are buttons
  if (!starReleased) return;

  let clicked = null;
  let closest = Infinity;

  for (const area of labelHitAreas) {
    const dx = mouseX - area.x;
    const dy = mouseY - area.y;

    const inside = abs(dx) < area.w / 2 && abs(dy) < area.h / 2;

    if (inside) {
      const distanceToLabel = dist(mouseX, mouseY, area.x, area.y);

      if (distanceToLabel < closest) {
        closest = distanceToLabel;
        clicked = area.line;
      }
    }
  }

  // Click a label: open/focus it.
  // Click empty space: close it.
  if (selectedStar !== clicked) {
  poemScroll = 0;
}

selectedStar = clicked;
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
