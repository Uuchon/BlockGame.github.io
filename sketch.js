let keys = ['D', 'F', 'J', 'K'];      // 使うキーの文字
let keyCodes = [68, 70, 74, 75];     // D, F, J, K のキー番号
let tiles = [];                      // 画面にあるタイルの配列
let score = 0;
let gameOver = false;
let speed = 5;                       // タイルの落ちる速度
let spawnTimer = 0;                  // タイルを作るタイミングのタイマー

function setup() {
  createCanvas(400, 600);            // 縦長の画面を作る（1レーン横幅100px × 4マス）
}

function draw() {
  background(255);                   // ピアノタイルなので背景は「白」
  
  // 1. レーンの区切り線（グレーの線）を描く
  stroke(220);
  for (let i = 1; i < 4; i++) {
    line(i * 100, 0, i * 100, height);
  }
  
  // 2. 判定ライン（画面の下の方にある赤い線）を描く
  stroke(255, 0, 0);
  strokeWeight(3);
  let lineY = height - 120;          // 下から120pxの位置が判定ライン
  line(0, lineY, width, lineY);
  strokeWeight(1);                   // 線の太さを元に戻す

  if (gameOver) {
    drawGameOver();
    return;
  }

  // 3. 一定時間ごとにランダムなレーンに黒いタイルを生成
  spawnTimer++;
  if (spawnTimer > 35) {             // 数字を小さくするとタイルの密度が上がる
    let randomLane = floor(random(4));
    // タイルのデータ（レーン番号、Y座標、高さ、叩かれたかフラグ）
    tiles.push({ lane: randomLane, y: -160, h: 160, hit: false });
    spawnTimer = 0;
  }

  // 4. タイルの移動と描画
  for (let i = tiles.length - 1; i >= 0; i--) {
    let t = tiles[i];
    t.y += speed;                    // 下に落とす

    // タイルの色を決める（叩かれたらグレー、まだなら黒）
    if (t.hit) {
      fill(200);
    } else {
      fill(0);
    }
    noStroke();
    rect(t.lane * 100, t.y, 100, t.h); // タイルを描画

    // 【ゲームオーバー条件1】黒いタイルを叩けずに見逃して、画面下に消えた場合
    if (t.y > height) {
      if (!t.hit) {
        gameOver = true;
      }
      tiles.splice(i, 1);            // 画面外に出たデータを削除
    }
  }

  drawUI();                          // スコアとキーガイドの表示
}

// 5. キーボードが押されたときの処理
function keyPressed() {
  if (gameOver) {
    if (key === 'r' || key === 'R') resetGame();
    return;
  }

  // どのレーンのキーが押されたか調べる
  let pressedLane = -1;
  for (let i = 0; i < 4; i++) {
    if (keyCode === keyCodes[i]) {
      pressedLane = i;
      break;
    }
  }

  // 関係ないキーが押されたら何もしない
  if (pressedLane === -1) return;

  let hitSuccess = false;

  // 画面にあるタイルを古い順（下にある順）にチェック
  for (let i = 0; i < tiles.length; i++) {
    let t = tiles[i];
    
    // 押したキーと同じレーン、かつ、まだ叩いていないタイルを探す
    if (t.lane === pressedLane && !t.hit) {
      let tileBottom = t.y + t.h;    // タイルの下端のY座標
      
      // タイルの下端が、赤い判定ラインの近くにあるか判定（±60pxの猶予）
      let lineY = height - 120;
      if (tileBottom > lineY - 60 && t.y < lineY + 60) {
        t.hit = true;                // 成功！
        score++;
        hitSuccess = true;
        
        // 5点ごとにだんだんスピードアップして難しくする
        if (score % 5 === 0) speed += 0.7;
        break;
      }
    }
  }

  // 【ゲームオーバー条件2】リズムがズレた、または何もない場所（白いタイル）を叩いた場合
  if (!hitSuccess) {
    gameOver = true;
  }
}

// ゲームのリセット
function resetGame() {
  tiles = [];
  score = 0;
  speed = 5;
  spawnTimer = 0;
  gameOver = false;
}

// スコアとキー操作ガイドの表示
function drawUI() {
  fill(255, 0, 0);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Score: " + score, 15, 15);

  // 画面の一番下に操作キーを表示
  fill(150);
  textSize(20);
  textAlign(CENTER, CENTER);
  for (let i = 0; i < 4; i++) {
    text(keys[i], i * 100 + 50, height - 30);
  }
}

// ゲームオーバー画面
function drawGameOver() {
  fill(0, 150);
  rect(0, 0, width, height);
  fill(255, 50, 50);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("GAME OVER", width / 2, height / 2 - 30);
  fill(255);
  textSize(20);
  text("Score: " + score, width / 2, height / 2 + 10);
  textSize(14);
  text("Press 'R' to Restart", width / 2, height / 2 + 50);
}
