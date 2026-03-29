let maskG; // графический буфер для текста-маски


// базовый размер для работы
const BASE_W = 600;
const BASE_H = 800;

// финальный размер
const W = 4961;
const H = 7016;

let S; // scale factor

let colStep = 4; // шаг вертикальных колонок
let dripChance = 0.35; // шанс, что колонка потечет
let maxDrip = 260; // максимальная длина стекания

let asciiChars = ['.', ':', '+', '*', '0', '1'];

function setup() {
  createCanvas(W, H);
  pixelDensity(1);

  S = width / BASE_W;

  textFont('Helvetica');

  // масштабируем параметры
  colStep = int(3 * S);
  maxDrip = 260 * S;

  // буфер текста
  maskG = createGraphics(width, height);
  maskG.pixelDensity(1);
  maskG.background(0);
  maskG.fill(255);
  maskG.noStroke();

  maskG.textAlign(CENTER, TOP);
  maskG.textFont('Helvetica');
  maskG.textStyle(BOLD);
  maskG.textSize(48 * S);

  maskG.text(
    '[chaos is beautiful]',
    width / 2,
    80 * S
  );

  maskG.loadPixels();
}

function draw() {
  background(0);

  strokeWeight(max(1, 2 * S * 0.5));

  // вертикальные колонки
  for (let x = 0; x < width; x += colStep) {

    let columnActive = false;
    let dripLen = random(40 * S, maxDrip);

    let waveOffset = sin(x * 0.0008 + frameCount * 0.05) * (4 * S);

    for (let y = 0; y < height; y += max(1, 2 * S)) {

      let idx = 4 * (floor(y) * width + floor(x));
      let bright = maskG.pixels[idx];

      // активируем стекание
      if (bright > 128) {
        columnActive = true;
      }

      // текст
      if (bright > 128) {
        stroke('#EDEDED');

        let jx = x + random(-0.6, 0.6) * S;
        let jy = y + random(-0.4, 0.4) * S;

        point(jx, jy);
      }

      // стекание
      if (columnActive && random() < dripChance) {

        let dripY = y + random(4 * S, dripLen);

        if (dripY < height) {
          stroke('#BFBFBF');

          let jitterX = x + waveOffset + random(-1.2, 1.2) * S;

          point(jitterX, dripY);
        }
      }
    }
  }

  drawAsciiDust();

  // рисуем нижние плашки с текстом
  labelBlock(
    'creative coding',
    width / 2,
    height - 60 * S,
    80 * S,
    20 * S
  );
  
  labelBlock(
    '2026',
    width / 2,
    height - 40 * S,
    30 * S,
    20 * S
  );
}


// ASCII-пыль

function drawAsciiDust() {
  push();

  fill('rgba(255,255,255,0.4)');
  noStroke();
  textSize(10 * S);
  textAlign(CENTER, CENTER);

  let dustCount = int(220 * S * 0.5);

  for (let i = 0; i < dustCount; i++) {

    let x = random(width);
    let y = random(height * 0.35, height);

    y += sin(frameCount * 0.03 + x * 0.0008) * (6 * S);

    let ch = random(asciiChars);
    text(ch, x, y);
  }

  pop();
}


// плашки
function labelBlock(txt, cx, cy, w, h) {
  push();

  rectMode(CENTER);
  noStroke();

  fill(0);
  rect(cx, cy, w, h, 4 * S);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(12 * S);
  textStyle(NORMAL);

  text(txt, cx, cy);

  pop();
}

// сохраняемся
function mousePressed() {
  save('poster-chaos-beautiful-print.png');
}