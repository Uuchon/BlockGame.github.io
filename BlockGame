const COLS = 10;      // 横のマスの数
const ROWS = 20;      // 縦のマスの数
const BLOCK_SIZE = 20; // 1マスのサイズ(ピクセル)
let grid = [];        // 盤面の状態を記録する配列
let currentPiece;     // 動いているブロックの形
let currentX, currentY; // 動いているブロックの位置
let currentType;      // 動いているブロックの種類(色用)
let score = 0;
let gameOver = false;

// 7種類のブロック（テトロミノ）の形状定義
const SHAPES = [
  [[1, 1, 1, 1]], // I型
  [[1, 1], [1, 1]], // O型
  [[0, 1, 0], [1, 1, 1]], // T型
  [[0, 1, 1], [1, 1, 0]], // S型
  [[1, 1, 0], [0, 1, 1]], // Z型
  [[1, 0, 0], [1, 1, 1]], // J型
  [[0, 0, 1], [1, 1, 1]]  // L型
];

// ブロックの色
const COLORS = ['cyan', 'yellow', 'purple', 'green', 'red', 'blue', 'orange'];

function setup() {
  createCanvas(200, 400); // 10マス×20マスに合わせた画面サイズ
  resetGame();
}

function draw() {
  background(220);
  
  if (gameOver) {
    drawGameOver();
    return;
  }
  
  // 30フレーム（約0.5秒）ごとに自動で1マス落下
  if (frameCount % 30 === 0) {
    moveDown();
  }
  
  drawGrid();   // 固定されたブロックとマス目の描画
  drawPiece();  // 操作中のブロックの描画
  drawScore();  // スコアの描画
}

// ゲームのリセット
function resetGame() {
  grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  score = 0;
  gameOver = false;
  spawnPiece();
}

// 新しいブロックを画面上部に出現させる
function spawnPiece() {
  let id = floor(random(SHAPES.length));
  currentPiece = SHAPES[id];
  currentType = id + 1;
  currentX = floor(COLS / 2) - floor(currentPiece[0].length / 2);
  currentY = 0;
  
  // 出現した瞬間に入らなければゲームオーバー
  if (collides(currentX, currentY, currentPiece)) {
    gameOver = true;
  }
}

// 下に移動する処理
function moveDown() {
  if (!collides(currentX, currentY + 1, currentPiece)) {
    currentY++;
  } else {
    lockPiece();   // 地面に固定
    clearLines();  // 行が揃っていれば消す
    spawnPiece();  // 次のブロックへ
  }
}

// キーボード操作
function keyPressed() {
  if (gameOver) {
    if (key === 'r' || key === 'R') resetGame();
    return;
  }
  if (keyCode === LEFT_ARROW && !collides(currentX - 1, currentY, currentPiece)) {
    currentX--;
  } else if (keyCode === RIGHT_ARROW && !collides(currentX + 1, currentY, currentPiece)) {
    currentX++;
  } else if (keyCode === DOWN_ARROW) {
    moveDown(); // 下矢印でソフトドロップ
  } else if (keyCode === UP_ARROW) {
    rotatePiece(); // 上矢印で回転
  }
}

// ブロックの回転処理
function rotatePiece() {
  let rotated = [];
  for (let c = 0; c < currentPiece[0].length; c++) {
    let row = [];
    for (let r = currentPiece.length - 1; r >= 0; r--) {
      row.push(currentPiece[r][c]);
    }
    rotated.push(row);
  }
  // 回転しても壁や他のブロックにぶつからないなら採用
  if (!collides(currentX, currentY, rotated)) {
    currentPiece = rotated;
  }
}

// 衝突判定（壁や床、他のブロックにぶつかるかチェック）
function collides(x, y, piece) {
  for (let r = 0; r < piece.length; r++) {
    for (let c = 0; c < piece[r].length; c++) {
      if (piece[r][c]) {
        let nextX = x + c;
        let nextY = y + r;
        if (nextX < 0 || nextX >= COLS || nextY >= ROWS) return true;
        if (nextY >= 0 && grid[nextY][nextX] > 0) return true;
      }
    }
  }
  return false;
}

// ブロックを盤面に固定する
function lockPiece() {
  for (let r = 0; r < currentPiece.length; r++) {
    for (let c = 0; c < currentPiece[r].length; c++) {
      if (currentPiece[r][c]) {
        grid[currentY + r][currentX + c] = currentType;
      }
    }
  }
}

// 揃った行を消してスコアを加算
function clearLines() {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (grid[r].every(val => val > 0)) {
      grid.splice(r, 1); // その行を削除
      grid.unshift(Array(COLS).fill(0)); // 最上部に空の行を追加
      score += 100;
      r++; // 削除して行がずれたので、同じ行をもう一度チェック
    }
  }
}

// --- 描画用の補助関数群 ---
function drawGrid() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] > 0) {
        fill(COLORS[grid[r][c] - 1]);
        rect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
      stroke(200);
      noFill();
      rect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
  }
}

function drawPiece() {
  fill(COLORS[currentType - 1]);
  stroke(0);
  for (let r = 0; r < currentPiece.length; r++) {
    for (let c = 0; c < currentPiece[r].length; c++) {
      if (currentPiece[r][c]) {
        rect((currentX + c) * BLOCK_SIZE, (currentY + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
}

function drawScore() {
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  text("Score: " + score, 8, 8);
}

function drawGameOver() {
  fill(0, 150);
  rect(0, 0, width, height);
  fill(255, 50, 50);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("GAME OVER", width / 2, height / 2 - 20);
  textSize(14);
  fill(255);
  text("Press 'R' to Restart", width / 2, height / 2 + 20);
}
